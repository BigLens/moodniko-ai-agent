import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

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

export const moodnikoTool = createTool({
  id: 'get-moodniko-content',
  description: 'Get content recommendations from Moodniko API based on mood and content type. Extract mood from user message (happy, sad, anxious, etc.) and content type (books, music, movies, podcasts, videos, articles).',
  inputSchema: z.object({
    mood: z.string().describe('Mood/emotion (e.g., happy, sad, anxious, excited, stressed, tired, bored, motivated, peaceful, romantic, nostalgic, inspired, angry, relaxed)'),
    contentType: z.string().describe('Type of content (movie, music, podcast, book, video, article). Normalize: movies→movie, books→book, podcasts→podcast, etc.'),
  }),
  outputSchema: z.object({
    recommendations: z.array(z.string()),
    mood: z.string(),
    contentType: z.string(),
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const apiUrl = process.env.MOODNIKO_API_URL || 'https://moodniko-backend.onrender.com';
    
    const typeMap: Record<string, string> = {
      'movies': 'movie',
      'movie': 'movie',
      'music': 'music',
      'podcasts': 'podcast',
      'podcast': 'podcast',
      'books': 'book',
      'book': 'book',
      'articles': 'book',
      'article': 'book',
      'videos': 'movie',
      'video': 'movie',
    };

    const apiContentType = typeMap[context.contentType.toLowerCase()] || context.contentType;
    const url = `${apiUrl}/contents?mood=${encodeURIComponent(context.mood)}&type=${encodeURIComponent(apiContentType)}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        recommendations: [],
        mood: context.mood,
        contentType: context.contentType,
        message: `Failed to fetch content: ${errorText}`,
      };
    }

    const data: MoodnikoContent[] = await response.json();

    if (!data || data.length === 0) {
      return {
        success: true,
        recommendations: [],
        mood: context.mood,
        contentType: context.contentType,
        message: `No ${context.contentType} found for ${context.mood} mood.`,
      };
    }

    const recommendations = data.slice(0, 6).map((item, index) => {
      const shortDesc = item.description.length > 100 
        ? item.description.substring(0, 100) + '...' 
        : item.description;
      return `${index + 1}. ${item.title} - ${shortDesc}`;
    });

    return {
      success: true,
      recommendations,
      mood: context.mood,
      contentType: context.contentType,
      message: `Found ${recommendations.length} recommendations.`,
    };
  },
});

