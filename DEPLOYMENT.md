# Moodniko AI Agent - Deployment Guide

## Current Status ✅

The agent is **working locally** with the following features:

- ✅ Context-aware conversations with session management
- ✅ Mood detection (10 mood types)
- ✅ Content recommendations (6 content types)
- ✅ 5 unique recommendations per request
- ✅ No repetition within sessions
- ✅ Smart tracking of shown items
- ✅ Natural language processing

## Local Testing

Run the agent locally:

```bash
npm run dev          # Start Mastra dev server (http://localhost:3456)
npm run test-agent   # Run automated conversation test
```

## Next Steps: Deployment

### 1. Deploy to Mastra Cloud

- [ ] Create Mastra Cloud account
- [ ] Configure deployment settings
- [ ] Set environment variables (GOOGLE_GENERATIVE_AI_API_KEY)
- [ ] Deploy agent
- [ ] Test cloud endpoint

### 2. Telegram Integration

- [ ] Create Telegram bot via @BotFather
- [ ] Get bot token
- [ ] Set up webhook to Mastra cloud endpoint
- [ ] Configure Telegram-specific message handlers
- [ ] Test in Telegram

### 3. Production Checklist

- [ ] Replace mock data with actual Moodniko API calls
- [ ] Add persistent database for user sessions
- [ ] Implement rate limiting
- [ ] Add error logging and monitoring
- [ ] Set up analytics
- [ ] Create admin dashboard

## File Structure

```
src/
├── agents/
│   └── mood-agent.ts          # Main agent configuration
├── lib/
│   ├── agent-wrapper.ts       # Context management wrapper
│   └── session-manager.ts     # Session state tracking
├── tools/
│   └── mood-tools.ts          # Recommendation tools
├── types/
│   └── mood.ts                # Type definitions
├── mastra/
│   └── index.ts               # Mastra setup
└── test-agent.ts              # Local testing script
```

## Environment Variables

Required for deployment:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
DB_URL=your_database_url
MOODNIKO_API_URL=https://api.moodniko.com
MOODNIKO_API_KEY=your_moodniko_key
```

## API Integration (TODO)

Current: Mock data in `mood-tools.ts`
Future: Replace with actual Moodniko API calls

```typescript
// In mood-tools.ts, replace mock data with:
const response = await fetch(
  `${process.env.MOODNIKO_API_URL}/recommendations`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MOODNIKO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mood, contentType, count: 5 }),
  }
);
```

## Known Issues / Improvements Needed

- Agent sometimes needs explicit instruction to use tools
- Session timeout not implemented (currently 30 min)
- No persistent storage (sessions lost on restart)
- Mock data instead of real API
- Limited to 5 recommendations per request

## Resources

- [Mastra Docs](https://docs.mastra.ai)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Gemini API](https://ai.google.dev/docs)

---

**Status**: Ready for cloud deployment
**Last Updated**: 2025
**Next Session**: Deploy to Mastra Cloud + Telegram integration
