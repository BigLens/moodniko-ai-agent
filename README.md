# Moodniko AI Agent

An AI-powered mood tracking and analysis agent built with Mastra and Google Gemini.

## Features

- 🎭 Mood logging and tracking
- 📊 Pattern analysis and insights
- 💡 Personalized recommendations
- 🧠 Intelligent mood analysis using Gemini 1.5 Flash
- 📈 Historical mood data tracking

## Setup

1. Install dependencies:

```bash
npm install
```

2. Your `.env` file should contain:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
DB_URL=file:local.db
```

## Usage

### Start Development Server

```bash
npm run dev
```

This will start the Mastra development server at http://localhost:3456

### Test the Agent

```bash
npm run test-agent
```

### Build for Production

```bash
npm run build
```

## Interacting with the Agent

Once the dev server is running, you can interact with the agent through:

1. **Mastra Playground**: Visit http://localhost:3456 in your browser
2. **API Endpoints**: Use the Mastra API endpoints
3. **Direct Integration**: Import and use the agent in your code

## Example Interactions

### Log a Mood

```
"I'm feeling anxious today, around 7/10 intensity. I have a big meeting coming up."
```

### Get Recommendations

```
"Can you give me some recommendations for dealing with stress?"
```

### Check Mood History

```
"What were my moods like last week?"
```

### Analyze Patterns

```
"Can you analyze my mood patterns and identify any triggers?"
```

## Agent Capabilities

The Mood Analyzer agent can:

- Log moods with intensity levels (1-10)
- Track activities and triggers associated with moods
- Analyze mood patterns over time
- Provide personalized recommendations
- Identify trends and potential triggers

## Available Tools

- **logMood**: Record current mood with context
- **getMoodHistory**: Retrieve past mood entries
- **analyzeMoodPattern**: Identify patterns and trends
- **getMoodRecommendations**: Get personalized suggestions

## Mood Categories

- happy
- sad
- anxious
- calm
- energetic
- tired
- stressed
- content
- frustrated
- excited

## Next Steps

1. Implement database persistence for mood entries
2. Add user authentication
3. Create a web or mobile interface
4. Add data visualization for mood trends
5. Integrate with other health/wellness apps
