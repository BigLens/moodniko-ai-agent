import { Mastra } from '@mastra/core';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { moodAgent } from '../agents/mood-agent';
import { a2aAgentRoute } from '../routes/a2a-agent-route';

export const mastra = new Mastra({
  agents: { moodAgent },
  storage: new LibSQLStore({ url: ':memory:' }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'debug',
  }),
  observability: {
    default: { enabled: true },
  },
  server: {
    build: {
      openAPIDocs: true,
      swaggerUI: true,
    },
    apiRoutes: [a2aAgentRoute]
  }
});
