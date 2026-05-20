import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { FALLBACK_PROBLEMS } from "./server_fallback_problems";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Initialize Gemini
  const apiKey = process.env.api_key || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("CRITICAL: Missing GEMINI_API_KEY / api_key environment variable");
  }
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/generate-problems", async (req, res) => {
    const { topic, difficulty } = req.body;
    console.log(`Generating problems for: ${topic} (${difficulty})`);

    // Guard: If there is no keys configured, we can immediately return fallbacks seamlessly rather than crashing
    if (!apiKey) {
      console.warn("API key not configured. Seamlessly falling back to curated curriculum data.");
      const fallbackList = FALLBACK_PROBLEMS[topic] || FALLBACK_PROBLEMS["基礎代數"];
      return res.json(fallbackList);
    }

    try {
      const promptText = `產生 8 個關於「${topic}」的數學練習題，難度為「${difficulty}」。
請確保：
1. 語系全面使用繁體中文。
2. 題目描述、選項以及解析都必須使用標準 LaTeX 格式包裹數學公式、算式或符號（請使用單錢符號 $...$ 或雙錢符號 $$...$$，例如 $x^2 + y = 0$)。
3. 四個選項必須各不相同。
4. ID 範圍為：1 到 8（請嚴格依序設定 id 屬性為 1, 2, 3, ..., 8）。
5. 題目難度層次：ID 1-4 著重核心基礎概念、定義與直接運算；ID 5-8 著重延伸應用、公式變形、或進階觀念推導以深化實力。
6. 【超級重要 - 壓縮生成時間】：請直接切入重點，題目描述、選項和解析（explanation）務必直覺、極致精簡、沒有任何客套或冗餘說明（例如「因為...所以得到此結果」直接寫成「由...得...」，省去長篇大論）。這能大幅縮短系統生成時間。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          temperature: 0.1, // 降低溫度以更具決定性，減少生成時間與 Token 損耗
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: {
                  type: Type.INTEGER,
                  description: "問題的唯一識別 ID (1-8)。",
                },
                question: {
                  type: Type.STRING,
                  description: "數學問題描述，應使用 LaTeX 包裹數學公式或算式。",
                },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "四個不重複的選擇題選項內容。",
                },
                answer: {
                  type: Type.INTEGER,
                  description: "正確答案在 options 陣列中的索引（0 代表選項 A，1 代表選項 B，2 代表選項 C，3 代表選項 D）。",
                },
                explanation: {
                  type: Type.STRING,
                  description: "極簡、精確的循序解題步驟與公式解析，應使用 LaTeX 包裹數學公式或算式。",
                }
              },
              required: ["id", "question", "options", "answer", "explanation"]
            }
          }
        }
      });

      const parsedList = JSON.parse(response.text || "[]");
      if (Array.isArray(parsedList) && parsedList.length > 0) {
        parsedList.sort((a, b) => (a.id || 0) - (b.id || 0));
        res.json(parsedList);
      } else {
        throw new Error("Empty or invalid response parsed from Gemini");
      }
    } catch (error: any) {
      console.warn("Gemini Generation failed or rate-limited. Activating curated offline fallback engine:", error.message || error);
      // Retrieve high-quality offline LaTeX curriculum problems for this topic
      const fallbackList = FALLBACK_PROBLEMS[topic] || FALLBACK_PROBLEMS["基礎代數"];
      res.json(fallbackList);
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
