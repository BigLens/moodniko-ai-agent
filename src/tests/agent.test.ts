import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { mastra } from "../mastra/index";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Moodniko AI Agent - Complete Test Suite", () => {
  const testUserId = "test-user-" + Date.now();
  let agent: any;

  beforeEach(async () => {
    agent = mastra.getAgent("moodAgent");
   
    await delay(2000);
  });

  afterEach(async () => {
    await delay(1000);
  });

  describe("Basic Agent Tests", () => {
    it("should have moodAgent registered", () => {
      expect(agent).toBeDefined();
      expect(agent.name).toBe("Mood Agent");
    });

    it("should respond to greetings", async () => {
      const response = await agent.generate([
        { role: "user", content: "Hello" },
      ]);
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe("string");
    }, 30000);

    it("should respond to mood expression", async () => {
      const response = await agent.generate([
        { role: "user", content: "I'm feeling sad" },
      ]);
      expect(response.text).toBeDefined();
      expect(response.text.toLowerCase()).toMatch(/sad|content|recommend/);
    }, 30000);

    it("should handle content type request", async () => {
      const response = await agent.generate([
        { role: "user", content: "I'm anxious and want books" },
      ]);
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe("string");
    }, 40000);
  });

  describe("Conversation Flow", () => {
    it("should handle complete conversation", async () => {
      const conv1 = await agent.generate([
        { role: "user", content: "Hi there" },
      ]);
      expect(conv1.text).toBeDefined();
      await delay(3000);

      const conv2 = await agent.generate([
        { role: "user", content: "I'm feeling stressed" },
      ]);
      expect(conv2.text).toBeDefined();
      await delay(3000);

      const conv3 = await agent.generate([{ role: "user", content: "music" }]);
      expect(conv3.text).toBeDefined();
    }, 80000);
  });

  describe("Different Moods", () => {
    const moods = ["happy", "sad", "anxious"];

    moods.forEach((mood) => {
      it(`should handle ${mood} mood`, async () => {
        const response = await agent.generate([
          { role: "user", content: `I'm ${mood}` },
        ]);
        expect(response.text).toBeDefined();
        expect(response.text.toLowerCase()).toContain(mood);
      }, 30000);
    });
  });

  describe("Content Types", () => {
    const contentTypes = ["books", "music"];

    contentTypes.forEach((contentType) => {
      it(`should handle ${contentType} request`, async () => {
        const response = await agent.generate([
          { role: "user", content: `I'm happy and want ${contentType}` },
        ]);
        expect(response.text).toBeDefined();
        expect(typeof response.text).toBe("string");
      }, 40000);
    });
  });

  describe("Error Handling", () => {
    it("should handle empty message", async () => {
      const response = await agent.generate([{ role: "user", content: "" }]);
      expect(response.text).toBeDefined();
    }, 30000);

    it("should handle special characters", async () => {
      const response = await agent.generate([
        { role: "user", content: "I'm sad!!!" },
      ]);
      expect(response.text).toBeDefined();
    }, 30000);
  });
});
