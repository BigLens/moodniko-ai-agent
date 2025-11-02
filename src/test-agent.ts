import { contextualMoodAgent } from "./mastra/index";

async function testMoodAgent() {
  const userId = "test-user-001";

  const conversation = [
    "Hi there",
    "I'm feeling really sad today",
    "books",
    "can I get more books?",
    "actually, I'm anxious now",
    "music",
  ];

  for (const message of conversation) {
    try {
      const response = await contextualMoodAgent.chat(userId, message);
    } catch (error: any) {
      console.error("Error occurred:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  contextualMoodAgent.resetSession(userId);
}

testMoodAgent();
