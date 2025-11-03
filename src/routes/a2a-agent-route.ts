import { randomUUID } from 'crypto';
import { registerApiRoute } from '@mastra/core/server';

const memoryStore = new Map<string, any>();

export const a2aAgentRoute = registerApiRoute('/a2a/agent/:agentId', {
  method: 'POST',
  handler: async (c) => {
    try {
      const mastra = c.get('mastra');
      const agentId = c.req.param('agentId');

      const body = await c.req.json();
      const { jsonrpc, id: requestId, params } = body;

      if (jsonrpc !== '2.0' || !requestId) {
        return c.json({
          jsonrpc: '2.0',
          id: requestId || null,
          error: {
            code: -32600,
            message: 'Invalid Request: jsonrpc must be "2.0" and id is required',
          },
        }, 400);
      }

      const agent = mastra.getAgent(agentId);
      if (!agent) {
        return c.json({
          jsonrpc: '2.0',
          id: requestId,
          error: {
            code: -32602,
            message: `Agent '${agentId}' not found`,
          },
        }, 404);
      }

      const { message, messages, contextId, taskId } = params || {};
      const sessionId = contextId || requestId || `session-${randomUUID()}`;

      const session = memoryStore.get(sessionId) || {
        CURRENT_MOOD: 'unknown',
        CURRENT_CONTENT_TYPE: 'unknown',
        SENT_ITEMS: {},
        STAGE: 1,
        HISTORY: [],
      };

      const messagesList = message
        ? [message]
        : Array.isArray(messages)
          ? messages
          : [];

      const mastraMessages = messagesList.map((msg: any) => ({
        role: msg.role,
        content:
          msg.parts?.map((part: any) => {
            if (part.kind === 'text') return part.text;
            if (part.kind === 'data') return JSON.stringify(part.data);
            return '';
          }).join('\n') || msg.content || '',
      }));

      const sessionContext = JSON.stringify({
        CURRENT_MOOD: session.CURRENT_MOOD,
        CURRENT_CONTENT_TYPE: session.CURRENT_CONTENT_TYPE,
        SENT_ITEMS: session.SENT_ITEMS,
        STAGE: session.STAGE,
      });
      
      const response = await agent.generate([
        {
          role: 'system',
          content: `SESSION_CONTEXT:${sessionId}::${sessionContext}`,
        },
        ...session.HISTORY,
        ...mastraMessages,
      ]);
      
      

      const agentText = response.text || '';

      session.HISTORY = [
        ...session.HISTORY,
        ...mastraMessages,
        { role: 'assistant', content: agentText },
      ];
      memoryStore.set(sessionId, session);

      const artifacts = [
        {
          artifactId: randomUUID(),
          name: `${agentId}Response`,
          parts: [{ kind: 'text', text: agentText }],
        },
      ];

      return c.json({
        jsonrpc: '2.0',
        id: requestId,
        result: {
          id: taskId || randomUUID(),
          contextId: sessionId,
          status: {
            state: 'completed',
            timestamp: new Date().toISOString(),
            message: {
              messageId: randomUUID(),
              role: 'agent',
              parts: [{ kind: 'text', text: agentText }],
              kind: 'message',
            },
          },
          artifacts,
          kind: 'task',
        },
      });
    } catch (error: any) {
      return c.json({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32603,
          message: 'Internal error',
          data: { details: error.message },
        },
      }, 500);
    }
  },
});
