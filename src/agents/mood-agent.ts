import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
import { moodnikoTool } from '../tools/moodniko-tool';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';


const memoryStore = new Memory({
  storage: new LibSQLStore({ url: ':memory:' }),
});

export const moodAgent = new Agent({
  name: 'mood-agent',
  model: google('gemini-2.0-flash'),
  tools: { moodnikoTool },
  memory: memoryStore,
  instructions: `
    You are a helpful mood-based content recommendation assistant powered by Moodniko.
    Remember the user's last stated mood and content preference within the same session.

    If user provides a mood, store it in memory.
    If user provides a content type, retrieve the last stored mood and use both to fetch recommendations.
    If both are known, immediately fetch recommendations using moodnikoTool.

  Formatting rule:

  When showing results from moodnikoTool, always format them as a **numbered list** (1., 2., 3., etc.)
  Example:
  Here are some calming songs you might enjoy:
  1. Weightless – Marconi Union
  2. Bloom – ODESZA
  3. Breathe Me – Sia
    
  Respond conversationally, friendly, and concise.
  `,
});

