import { Mastra } from "@mastra/core";
import { moodAgent } from "../agents/mood-agent";
import { ContextualAgent } from "../lib/agent-wrapper";

export const mastra = new Mastra({
  agents: {
    moodAgent,
  },
});

// Export wrapped agent with context management
export const contextualMoodAgent = new ContextualAgent(moodAgent);
