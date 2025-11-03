import { config } from 'dotenv';
config();

import { mastra } from "./mastra/index";

async function testMoodAgent() {
  console.log('Testing Mood Agent...\n');
  
  const conversation = [
    "Hi there",
    "I'm feeling really sad today",
    "books",
    "can I get more books?",
    "actually, I'm anxious now",
    "music",
  ];

  const agent = mastra.getAgent('moodAgent');
  
  if (!agent) {
    console.error('Agent not found!');
    return;
  }

  for (const message of conversation) {
    try {
      console.log(`User: ${message}`);
      const response = await agent.generate([{ role: 'user', content: message }]);
      console.log(`Agent: ${response.text}\n`);
    } catch (error: any) {
      console.error('Error occurred:', error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('Test completed!');
}

testMoodAgent();
