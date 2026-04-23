import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY environment variable");
  }
  const ai = new GoogleGenAI(apiKey || "");

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      const model = ai.getGenerativeModel({
        model: "gemini-3.1-pro-preview",
        systemInstruction: `你是 MathWhiz 的 AI 數學導師。
你的目標是以親切、耐心的態度教導學生數學。
請使用繁體中文回答。
當學生問問題時：
1. 逐步解釋概念，不要只給答案。
2. 使用 LaTeX 格式包裹數學公式（例如 $x^2$ 或 $$y = mx + c$$）。
3. 如果學生不理解，嘗試用簡單的比喻。
4. 鼓勵學生思考。`,
      });

      const chat = model.startChat({
        history: history || [],
      });

      const result = await chat.sendMessage(prompt);
      res.json({ text: result.response.text() });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/generate-problems", async (req, res) => {
    try {
      const { topic, difficulty } = req.body;
      const model = ai.getGenerativeModel({
        model: "gemini-3-flash-preview",
        generationConfig: {
          responseMimeType: "application/json",
        }
      });

      const prompt = `產生 3 個關於「${topic}」的數學練習題，難度為「${difficulty}」。
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

      const result = await model.generateContent(prompt);
      res.json(JSON.parse(result.response.text() || "[]"));
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
