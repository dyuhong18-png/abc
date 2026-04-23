import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Gemini
  const apiKey = process.env.api_key || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing api_key environment variable");
  }
  const ai = new GoogleGenAI({ apiKey: apiKey || "" });

  // API Routes
  app.post("/api/generate-problems", async (req, res) => {
    try {
      const { topic, difficulty } = req.body;
      
      const promptText = `產生 3 個關於「${topic}」的數學練習題，難度為「${difficulty}」。
請以 JSON 格式回傳，結構如下：
[
  {
    "id": 1,
    "question": "題目描述 (使用 LaTeX)",
    "options": ["選項 A", "選項 B", "選項 C", "選項 D"],
    "answer": "正確選項的索引 (0-3)",
    "explanation": "解析描述 (使用 LaTeX)"
  }
]
只回傳 JSON 字串。`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
        }
      });

      res.json(JSON.parse(response.text || "[]"));
    } catch (error: any) {
      console.error("Generator API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
