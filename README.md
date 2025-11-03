# Moodniko AI Agent

A Mastra-based AI agent that provides mood-based content recommendations using the Moodniko API.

## Architecture

Built following the Mastra framework pattern:

1. **Mood Agent** (`src/agents/mood-agent.ts`) - Gemini-powered agent that extracts moods and content types from natural conversation
2. **Moodniko Tool** (`src/tools/moodniko-tool.ts`) - Fetches content from Moodniko API based on mood and content type
3. **A2A Route Handler** (`src/routes/a2a-agent-route.ts`) - Handles A2A protocol for agent communication
4. **Mastra Instance** (`src/mastra/index.ts`) - Main Mastra configuration with agent, storage, and routes

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
MOODNIKO_API_URL=https://moodniko-backend.onrender.com
```

3. Run tests:
```bash
npm run test-agent
```

4. Start dev server:
```bash
npm run dev
```

## How It Works

1. User expresses mood or asks for content
2. Gemini extracts mood and content type from natural language
3. When both are available, the agent calls moodnikoTool
4. Tool fetches from Moodniko API: `/contents?mood={mood}&type={type}`
5. Returns formatted recommendations

## API Endpoints

- `POST /a2a/agent/moodAgent` - A2A protocol endpoint for agent communication

## Content Types & Moods

**Supported Content Types:** movies, music, podcasts, books, videos, articles

**Supported Moods:** happy, sad, anxious, excited, stressed, tired, bored, motivated, peaceful, romantic, nostalgic, inspired, angry, relaxed, calm, energetic, frustrated, content, confused, scared, lonely, moody

## Example Flow

User: "I'm feeling anxious"
Agent: "I understand. What type of content would you like?"

User: "movies"
Agent: *calls moodnikoTool* → Returns movie recommendations for anxious mood
