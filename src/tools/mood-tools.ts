import { createTool } from "@mastra/core";
import { z } from "zod";
import { sessionManager } from "../lib/session-manager";

const CONTENT_TYPE_MAP: Record<string, string> = {
  books: "book",
  music: "music",
  videos: "movie",
  podcasts: "podcast",
  articles: "book",
  movies: "movie",
};

interface MoodnikoContent {
  id: number;
  externalId: string;
  title: string;
  description: string;
  imageUrl: string;
  type: string;
  moodtag: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchMoodnikoContent(
  mood: string,
  contentType: string
): Promise<MoodnikoContent[]> {
  const apiUrl =
    process.env.MOODNIKO_API_URL || "https://moodniko-backend.onrender.com";
  const apiContentType = CONTENT_TYPE_MAP[contentType] || contentType;

  const url = `${apiUrl}/contents?mood=${encodeURIComponent(
    mood
  )}&type=${encodeURIComponent(apiContentType)}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API returned ${response.status}: ${errorText}`);
  }

  const data: MoodnikoContent[] = await response.json();
  return data;
}

const sessionTracking = new Map<string, Map<string, Set<number>>>();

function getSessionTracker(sessionId: string): Map<string, Set<number>> {
  if (!sessionTracking.has(sessionId)) {
    sessionTracking.set(sessionId, new Map());
  }
  return sessionTracking.get(sessionId)!;
}

function getShownIds(
  sessionId: string,
  mood: string,
  contentType: string
): Set<number> {
  const tracker = getSessionTracker(sessionId);
  const key = `${mood}_${contentType}`;

  if (!tracker.has(key)) {
    tracker.set(key, new Set());
  }

  return tracker.get(key)!;
}

function getNextRecommendations(
  sessionId: string,
  mood: string,
  contentType: string,
  allItems: MoodnikoContent[],
  count: number = 5
): {
  recommendations: string[];
  hasMore: boolean;
} {
  const shownIds = getShownIds(sessionId, mood, contentType);
  const availableItems = allItems.filter((item) => !shownIds.has(item.id));

  if (availableItems.length === 0 && allItems.length > 0) {
    shownIds.clear();
    return getNextRecommendations(
      sessionId,
      mood,
      contentType,
      allItems,
      count
    );
  }

  const batch = availableItems.slice(0, count);
  batch.forEach((item) => shownIds.add(item.id));

  const formattedBatch = batch.map((item) => {
    const shortDesc =
      item.description.length > 120
        ? item.description.substring(0, 120) + "..."
        : item.description;
    return `${item.title} - ${shortDesc}`;
  });

  const hasMore = availableItems.length > count;

  return {
    recommendations: formattedBatch,
    hasMore,
  };
}

export function resetSessionRecommendations(sessionId: string): void {
  sessionTracking.delete(sessionId);
}

export const logMood = createTool({
  id: "log-mood",
  description: "Log user mood immediately when they express any emotion",
  inputSchema: z.object({
    mood: z.enum([
      "happy",
      "sad",
      "anxious",
      "calm",
      "energetic",
      "tired",
      "stressed",
      "content",
      "frustrated",
      "excited",
    ]),
    intensity: z.number().min(1).max(10).optional().default(5),
    sessionId: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { mood, sessionId } = context as { mood: string; sessionId?: string };
    if (sessionId) {
      sessionManager.updateSession(sessionId, {
        currentMood: mood,
        stage: 2,
      });
    }
    return { success: true, mood };
  },
});

export const getContentRecommendations = createTool({
  id: "get-content-recommendations",
  description:
    "Get content recommendations from Moodniko API. Returns 5 new recommendations each time, never repeating items already shown in this session.",
  inputSchema: z.object({
    mood: z.enum([
      "happy",
      "sad",
      "anxious",
      "calm",
      "energetic",
      "tired",
      "stressed",
      "content",
      "frustrated",
      "excited",
    ]),
    contentType: z.enum([
      "books",
      "music",
      "videos",
      "podcasts",
      "articles",
      "movies",
    ]),
    sessionId: z
      .string()
      .describe("REQUIRED: Session identifier to track shown recommendations."),
  }),
  execute: async ({ context }) => {
    let { mood, contentType, sessionId } = context as {
      mood: string;
      contentType: string;
      sessionId?: string;
    };

    if (sessionId) {
      const session = sessionManager.getSession(sessionId);
      if (session?.currentMood) {
        mood = session.currentMood;
      }
    }

    if (!sessionId || sessionId === "undefined") {
      return {
        success: false,
        recommendations: [],
        mood,
        contentType,
        hasMore: false,
        message: "Internal error: session tracking failed. Please try again.",
      };
    }

    try {
      const allItems = await fetchMoodnikoContent(mood, contentType);

      if (allItems.length === 0) {
        return {
          success: false,
          recommendations: [],
          mood,
          contentType,
          hasMore: false,
          message: `Sorry, we don't have any ${contentType} recommendations for when you're feeling ${mood} right now. Want to try a different content type?`,
        };
      }

      const { recommendations, hasMore } = getNextRecommendations(
        sessionId,
        mood,
        contentType,
        allItems,
        5
      );

      return {
        success: true,
        recommendations,
        mood,
        contentType,
        hasMore,
        message: hasMore
          ? `Found ${recommendations.length} recommendations. More available.`
          : `Found ${recommendations.length} recommendations. This covers most of our best options for this mood.`,
      };
    } catch (error: any) {
      return {
        success: false,
        recommendations: [],
        mood,
        contentType,
        hasMore: false,
        message: `Sorry, I'm having trouble fetching recommendations right now. Please try again in a moment.`,
      };
    }
  },
});

export const getMoodHistory = createTool({
  id: "get-mood-history",
  description: "Get mood history - only when user asks",
  inputSchema: z.object({ days: z.number().default(7) }),
  execute: async () => ({ entries: [] }),
});

export const analyzeMoodPattern = createTool({
  id: "analyze-mood-pattern",
  description: "Analyze patterns - only when user asks",
  inputSchema: z.object({ days: z.number().default(30) }),
  execute: async () => ({ insights: "Not enough data" }),
});
