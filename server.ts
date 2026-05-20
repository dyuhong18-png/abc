import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

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

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API Key is not configured on the server." });
    }

    try {
      // Define a concurrent helper to generate slices of problems
      const generateProblemSlice = async (startId: number, count: number, focusArea: string) => {
        const promptText = `產生 ${count} 個關於「${topic}」的數學練習題，難度為「${difficulty}」。
請確保：
1. 為繁體中文。
2. 題目描述、選項以及解析都必須使用標準 LaTeX 格式包裹數學公式、算式或符號（請使用單錢符號 $...$ 或雙錢符號 $$...$$，例如 $x^2 + y = 0$)。
3. 四個選項必須各不相同。
4. 本組 ID 範圍應為：${startId} 到 ${startId + count - 1}（請嚴格依序設定 id 屬性為整數）。
5. 出題焦點：${focusArea}。
6. 敘述與解析請力求精確、簡潔直觀，不含贅字或客套話，這能使系統壓縮出題時間。`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            temperature: 0.3,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: {
                    type: Type.INTEGER,
                    description: `問題的唯一識別 ID (${startId} 到 ${startId + count - 1})。`,
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
                    description: "詳細的循序解題步驟與概念解析，應使用 LaTeX 包裹數學公式或算式。",
                  }
                },
                required: ["id", "question", "options", "answer", "explanation"]
              }
            }
          }
        });

        try {
          return JSON.parse(response.text || "[]");
        } catch (err) {
          console.error(`Failed to parse slice content starting at ${startId}:`, response.text);
          return [];
        }
      };

      // Generate the 8 problems in parallel: two requests of 4 items each
      const [slice1, slice2] = await Promise.all([
        generateProblemSlice(1, 4, "著重核心基礎概念、定義與直接運算，避免題幹過於冗長。"),
        generateProblemSlice(5, 4, "著重延伸應用、公式變形、或進階觀念推導以深化實力。")
      ]);

      const mergedList = [...(Array.isArray(slice1) ? slice1 : []), ...(Array.isArray(slice2) ? slice2 : [])];
      
      // Ensure the collection is sorted sequentially by ID
      mergedList.sort((a, b) => (a.id || 0) - (b.id || 0));

      res.json(mergedList);
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
