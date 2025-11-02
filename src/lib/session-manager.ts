interface SessionContext {
  userId: string;
  currentMood: string | null;
  currentContentType: string | null;
  stage: number;
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
  lastRecommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

class SessionManager {
  private sessions: Map<string, SessionContext> = new Map();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; 

  getSession(userId: string): SessionContext {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, {
        userId,
        currentMood: null,
        currentContentType: null,
        stage: 1,
        conversationHistory: [],
        lastRecommendations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const session = this.sessions.get(userId)!;

    // Check for timeout
    const timeSinceUpdate = Date.now() - session.updatedAt.getTime();
    if (timeSinceUpdate > this.SESSION_TIMEOUT) {
      // Reset session if timeout
      this.resetSession(userId);
      return this.sessions.get(userId)!;
    }

    return session;
  }

  updateSession(userId: string, updates: Partial<SessionContext>): void {
    const session = this.getSession(userId);
    Object.assign(session, updates, { updatedAt: new Date() });
  }

  addToHistory(
    userId: string,
    role: "user" | "assistant",
    content: string
  ): void {
    const session = this.getSession(userId);
    session.conversationHistory.push({ role, content });

    // Keep only last 10 messages to avoid token limits
    if (session.conversationHistory.length > 10) {
      session.conversationHistory = session.conversationHistory.slice(-10);
    }

    session.updatedAt = new Date();
  }

  resetSession(userId: string): void {
    this.sessions.delete(userId);
  }

  getContextSummary(userId: string): string {
    const session = this.getSession(userId);
    const parts: string[] = [];

    if (session.currentMood) {
      parts.push(`User's current mood: ${session.currentMood}`);
    }
    if (session.currentContentType) {
      parts.push(`User wants: ${session.currentContentType}`);
    }
    parts.push(`Conversation stage: ${session.stage}`);

    if (session.conversationHistory.length > 0) {
      parts.push("\nRecent conversation:");
      session.conversationHistory.slice(-3).forEach((msg) => {
        parts.push(`${msg.role}: ${msg.content}`);
      });
    }

    return parts.join("\n");
  }
}

export const sessionManager = new SessionManager();
