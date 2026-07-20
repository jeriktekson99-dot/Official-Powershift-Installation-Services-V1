import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

let aiInstance: GoogleGenAI | null = null;

function getGenAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const ai = getGenAI();

    // Map history to Gemini content parts, ensuring strict role alternation (user -> model -> user -> model...)
    const contents: any[] = [];
    messages.forEach((msg: any) => {
      if (msg.text && (msg.sender === 'user' || msg.sender === 'assistant')) {
        const role = msg.sender === 'user' ? 'user' : 'model';
        
        // Skip any leading model messages, because Gemini multi-turn chat MUST start with a 'user' turn.
        if (contents.length === 0 && role !== 'user') {
          return;
        }

        const lastItem = contents[contents.length - 1];
        if (lastItem && lastItem.role === role) {
          // Merge consecutive messages of the same role
          lastItem.parts[0].text += "\n" + msg.text;
        } else {
          contents.push({
            role,
            parts: [{ text: msg.text }]
          });
        }
      }
    });

    // Fallback if no user messages were added
    if (contents.length === 0) {
      return res.status(400).json({ error: "At least one user message is required" });
    }

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    let response = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: `You are Powershift AI, an intelligent, professional solar energy assistant for Powershift Solar (a leading solar installer).
Your job is to answer questions related to solar energy, solar panels, solar system components (such as inverters, battery banks, LiFePO4 batteries), net metering, solar auditing, custom sizing, solar pricing/costs, energy efficiency, grid integration, and Powershift Solar's products, services, and technology partners (like Tesla Energy, SunPower, Enphase, Astroenergy, DAH Solar, Deye, Pylontech).

RULES OF ENGAGEMENT:
1. ONLY answer questions that are directly related to solar energy, clean/renewable energy, battery backup/storage systems, energy conservation, power grids, electricity bills, or Powershift Solar.
2. If a user asks a question or sends a message that is unrelated to solar, renewable energy, energy conservation, power grid topics, or Powershift Solar (for example: cooking recipes, general trivia, programming, writing unrelated stories, non-solar history, or other unrelated topics), you MUST respond with a polite and professional message stating that you are a specialized solar assistant and cannot answer that topic. Do NOT answer the question and do NOT engage in off-topic discussion.
3. Be professional, polite, concise, and helpful. Guide the user back to how Powershift Solar can help them transition to solar energy and cut their bills by up to 80%.
4. If a user asks about pricing, sizing, or a free quote, remind them they can get a free custom quote right on our website using the "Get A Free Quote" form or by calling us at 0935 479 6321.`
          }
        });
        if (response) {
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed, trying next fallback if available...`, err);
        lastError = err;
      }
    }

    if (!response) {
      throw lastError || new Error("All models failed to generate content.");
    }

    const text = response.text || "I apologize, but I could not generate a response. Please try again.";
    res.json({ reply: text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "An error occurred on the server" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
