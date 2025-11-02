import { Agent } from "@mastra/core";
import { sessionManager } from "./session-manager";

export class ContextualAgent {
  constructor(private agent: Agent<any, any, any>) {}

  async chat(userId: string, userMessage: string): Promise<string> {
    const session: any = sessionManager.getSession(userId);
    const lower = userMessage.toLowerCase().trim();

    sessionManager.addToHistory(userId, "user", userMessage);

    const moodKeywords = [
      "sad",
      "happy",
      "anxious",
      "calm",
      "energetic",
      "tired",
      "stressed",
      "frustrated",
      "excited",
    ];
    const contentKeywords = [
      "books",
      "music",
      "videos",
      "podcasts",
      "articles",
      "movies",
    ];

    const detectedMood = moodKeywords.find((m) => lower.includes(m));
    const detectedContent = contentKeywords.find((c) => lower.includes(c));

    if (detectedMood && detectedMood !== session.currentMood) {
      sessionManager.updateSession(userId, {
        currentMood: detectedMood,
        currentContentType: detectedContent || null,
        stage: detectedContent ? 3 : 2,
      });
    } else if (detectedContent && !detectedMood && session.currentMood) {
      sessionManager.updateSession(userId, {
        currentContentType: detectedContent,
        stage: 3,
      });
    }

    const freshSession: any = sessionManager.getSession(userId);

    const contextPrompt = `
[SYSTEM - SESSION STATE]
User ID: ${userId}
Current Mood: ${freshSession.currentMood || "NOT SET - user needs to express their mood"}
Current Content Type: ${freshSession.currentContentType || "NOT SET"}
Stage: ${freshSession.stage}

[USER MESSAGE]
${userMessage}

[CRITICAL INSTRUCTIONS FOR TOOL CALLS]
When you call ANY tool, you MUST use these EXACT values:
- sessionId: "${userId}" (NEVER generate random IDs like "678" or "67890")
- mood: "${freshSession.currentMood}" (THIS IS THE AUTHORITATIVE MOOD - use it exactly as shown)

If calling getContentRecommendations:
- mood MUST be: "${freshSession.currentMood}"
- sessionId MUST be: "${userId}"
- contentType: extract from user message (books/music/videos/podcasts/articles/movies)

Example correct tool call:
getContentRecommendations({
  mood: "${freshSession.currentMood}",
  contentType: "books",
  sessionId: "${userId}"
})

[YOUR RESPONSE STYLE]
- Be warm, empathetic, and conversational
- Understand natural language (e.g., "I'm feeling down" = sad mood)
- Handle compound requests (e.g., "I'm sad and want music" = process both)
- If user says "yes"/"more"/"sure" after recommendations, they want more of the same content
- Present recommendations in clean numbered lists

Now respond to the user naturally while following the tool usage rules above.
`;

    const response = await this.agent.generate(contextPrompt);
    const assistantMessage =
      response?.text || "I'm here to help. How are you feeling?";

    sessionManager.addToHistory(userId, "assistant", assistantMessage);

    return assistantMessage;
  }

  resetSession(userId: string): void {
    sessionManager.resetSession(userId);
    const { resetSessionRecommendations } = require("../tools/mood-tools");
    resetSessionRecommendations(userId);
  }
}
