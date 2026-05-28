import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";
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

  const CUSTOM_PROBLEMS_FILE = path.join(process.cwd(), "custom_problems.json");

  // Helper to read custom/imported problems stored in the backend
  function getCustomProblemsData(): Record<string, any[]> {
    try {
      if (fs.existsSync(CUSTOM_PROBLEMS_FILE)) {
        const content = fs.readFileSync(CUSTOM_PROBLEMS_FILE, "utf-8");
        return JSON.parse(content || "{}");
      }
    } catch (e) {
      console.error("Error reading custom_problems.json from backend:", e);
    }
    return {};
  }

  // Helper to write custom/imported problems back to the backend
  function saveCustomProblemsData(data: Record<string, any[]>) {
    try {
      fs.writeFileSync(CUSTOM_PROBLEMS_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error saving custom_problems.json to backend filesystem:", e);
    }
  }

  // API Routes
  app.post("/api/generate-problems", async (req, res) => {
    const { topic, difficulty, useCustomOnly } = req.body;
    console.log(`Generating problems for: ${topic} (${difficulty}), useCustomOnly: ${useCustomOnly}`);

    const customData = getCustomProblemsData();
    const topicCustomProblems = customData[topic] || [];

    // Helper to filter custom problems by difficulty
    function filterCustomProblems(problems: any[], diff: string): any[] {
      if (!diff) return problems;
      let filtered = problems.filter((p: any) => {
        const qText = p.question || "";
        return qText.includes(`【${diff}】`) || qText.includes(diff);
      });

      // If no problems match but there are problems in this topic, check if any problem has any classification
      if (filtered.length === 0) {
        const hasAnyClassification = problems.some((p: any) => {
          const q = p.question || "";
          return ["入門", "進階", "困難"].some(d => q.includes(`【${d}】`) || q.includes(d));
        });
        if (!hasAnyClassification) {
          // If no custom problems have ANY difficulty prefixes, assume unclassified and return them all
          filtered = problems;
        }
      }
      return filtered;
    }

    // Helper to limit to exactly 10 questions, padding dynamically from the same list if there are fewer
    function limitToTenQuestions(problems: any[]): any[] {
      if (!problems || problems.length === 0) return [];
      
      const targetCount = 10;
      let result = [...problems];
      
      if (result.length > targetCount) {
        return result.sort(() => 0.5 - Math.random()).slice(0, targetCount);
      }
      
      // If we have fewer than 10, pad by cycling through the existing questions in the list
      let i = 0;
      const baseProblems = [...problems];
      while (result.length < targetCount) {
        const dup = { ...baseProblems[i % baseProblems.length] };
        dup.id = Math.max(...result.map(p => p.id || 0)) + 1;
        result.push(dup);
        i++;
      }
      return result;
    }

    // Helper to shuffle options and distribute correct answers perfectly evenly across [0, 1, 2, 3]
    function shuffleOptionsAndDistributeAnswers(problems: any[]): any[] {
      if (!Array.isArray(problems) || problems.length === 0) {
        return problems;
      }

      // 1. Identify which questions have options and can be shuffled
      const eligibleIndices: number[] = [];
      problems.forEach((prob, idx) => {
        if (prob && Array.isArray(prob.options) && prob.options.length >= 2) {
          eligibleIndices.push(idx);
        }
      });

      const numEligible = eligibleIndices.length;
      if (numEligible === 0) {
        return problems;
      }

      // 2. Generate a balanced set of target answer indexes
      // For exactly 8 questions, we'll get exactly two A (0), two B (1), two C (2), two D (3).
      // For any N, they will be distributed as evenly as mathematically possible.
      const targetIndices: number[] = [];
      for (let i = 0; i < numEligible; i++) {
        targetIndices.push(i % 4);
      }

      // Shuffle the targets to assign them randomly to each question
      for (let i = targetIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targetIndices[i], targetIndices[j]] = [targetIndices[j], targetIndices[i]];
      }

      // 3. Map back and perform the shuffle of options with the exact target index
      const result = [...problems];
      eligibleIndices.forEach((probIdx, targetIndexSeqIdx) => {
        const prob = result[probIdx];
        const K = prob.options.length;
        
        // Take the assigned target, and clamp/wrap it to the options count
        let targetAnswerIdx = targetIndices[targetIndexSeqIdx];
        if (targetAnswerIdx >= K) {
          targetAnswerIdx = targetAnswerIdx % K;
        }

        const originalAnswerIdx = typeof prob.answer === "number" ? prob.answer : 0;
        const correctOptText = prob.options[originalAnswerIdx];
        const incorrectOpts = prob.options.filter((_: any, idx: number) => idx !== originalAnswerIdx);

        // Shuffle the incorrect options themselves for additional randomization
        for (let i = incorrectOpts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [incorrectOpts[i], incorrectOpts[j]] = [incorrectOpts[j], incorrectOpts[i]];
        }

        // Construct new options array putting the correct one at targetAnswerIdx
        const newOptions = new Array(K);
        newOptions[targetAnswerIdx] = correctOptText;
        
        let incorrectInsertIdx = 0;
        for (let i = 0; i < K; i++) {
          if (i !== targetAnswerIdx) {
            newOptions[i] = incorrectOpts[incorrectInsertIdx++];
          }
        }

        result[probIdx] = {
          ...prob,
          options: newOptions,
          answer: targetAnswerIdx
        };
      });

      return result;
    }

    // Prioritize custom problems if requested
    if (useCustomOnly && topicCustomProblems.length > 0) {
      const filtered = filterCustomProblems(topicCustomProblems, difficulty);
      const limited = limitToTenQuestions(filtered);
      const shuffled = shuffleOptionsAndDistributeAnswers(limited);
      return res.json({
        problems: shuffled,
        isFallback: false,
        isCustom: true
      });
    }

    // Guard: If there is no keys configured, we can immediately return fallbacks seamlessly rather than crashing
    if (!apiKey) {
      console.warn("API key not configured. Seamlessly falling back to custom or curated curriculum data.");
      
      let fallbackList = [];
      if (topicCustomProblems.length > 0) {
        fallbackList = filterCustomProblems(topicCustomProblems, difficulty);
        if (fallbackList.length === 0) {
          fallbackList = topicCustomProblems;
        }
      }
      if (fallbackList.length === 0) {
        fallbackList = FALLBACK_PROBLEMS[topic] || FALLBACK_PROBLEMS["基礎代數"];
      }

      fallbackList = limitToTenQuestions(fallbackList);
      const shuffled = shuffleOptionsAndDistributeAnswers(fallbackList);
      
      return res.json({
        problems: shuffled,
        isFallback: true,
        fallbackReason: "MISSING_KEY",
        errorMessage: "API key is not configured"
      });
    }

    try {
      let difficultyExtraInstruction = "";
      if (difficulty === "進階") {
        difficultyExtraInstruction = `
【進階難度特別要求 - 精密、多層次】：
- 題目整體難度顯著提升，不可單一步驟或直接套公式得分。
- ID 1-5 為「密集的綜合運算題」，需要結合兩個以上的邏輯或代數處理流程（如：須先利用特定條件解出係數參數，才能求出其特定代數表示式或函數值）。
- ID 6-10 為「進階思考引導題」，著重於多個公式聯立、對稱多項式、複數平面運算或向量內積與夾角公式的變形。
- 選項干擾要經過考量（提供容易混淆的計算錯誤選項，如負號、係數漏乘、倒數等）。`;
      } else if (difficulty === "困難") {
        difficultyExtraInstruction = `
【困難難度之解題極限要求 - 競賽/大師級極致硬核】：
- 絕對杜絕簡單、中等或直接代入常規公式的題目，出題難度直指頂尖高手！
- ID 1-5 為「高難度跨單元綜合題」，需要高度串聯不相干概念或進行複雜的非線性多變數聯立。
- ID 6-10 必須是「競賽級/大師級困難挑戰題」，涉及諸如：非對稱因式分解極限設計、非標準座標系之幾何解構、利用算幾/柯西不等式之特殊臨界特例求高難度極值、特殊未知置換的複數與極座標之極致結合、特徵根方程。
- 【極致精煉出題】：出題時題目描述必須「字數極少、專注於符號公式」，用高密度的 LaTeX 數學公式來代表複雜的關係（例如：已知條件直接寫成聯立 LaTeX 算式），而不是用長篇文字。這樣可以大幅降低發送和生成的 Token 數，讓出題速度達到極致，同時難度挑戰拉滿！
- 四個選項設計必須極端精準且具備高強度干擾度（例如常犯的配方疏失、倒數、臨界點開閉區間等）。`;
      } else {
        difficultyExtraInstruction = `
【入門難度特別要求】：
- 著重觀念啟盟，循序漸進。
- ID 1-5 為基礎概念澄清，以及直接套用核心公式之直觀單一運算。
- ID 6-10 為基本觀念的輕微變形、單一步驟應用題，協助學習者奠定解題信心。`;
      }

      const promptText = `產生 10 個關於「${topic}」的數學練習題，難度為「${difficulty}」。
請確保：
1. 語系全面使用繁體中文。
2. 題目描述、選項以及解析都必須使用標準 LaTeX 格式包裹數學公式、算式或符號（請使用單錢符號 $...$ 或雙錢符號 $$...$$，例如 $x^2 + y = 0$)。
3. 四個選項必須各不相同。
4. ID 範圍為：1 到 10（請嚴格依序設定 id 屬性為 1, 2, 3, ..., 10）。
5. 題目難度分佈與要求：${difficultyExtraInstruction}
6. 【超級極致壓縮時間】：為了極速生成，題目描述(question)要非常直接且精簡無廢話。解析(explanation)「全文字數必須限制在 25 字以內」，直接顯示關鍵代數步驟或破點核心公式即可（例如「由 $x^2-4=0$ 得 $x=\\pm 2$」），杜絕任何客套、引言 or 重複題目描述，以此方式達到毫米級極速出題！`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          temperature: 0.1, // 降低溫度以更具決定性，減少生成時間與 Token 損耗
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }, // 不使用思考，極速生成
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: {
                  type: Type.INTEGER,
                  description: "問題唯一識別 ID (1-10)。",
                },
                question: {
                  type: Type.STRING,
                  description: "極度精簡的數學題目描述。直切主題，長度不超過 40 字。使用 LaTeX。",
                },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "四個不重複的選擇題選項內容，越簡短精煉越好。",
                },
                answer: {
                  type: Type.INTEGER,
                  description: "正確答案在 options 陣列中的索引（0 代表選項 A，1 代表 B，2 代表 C，3 代表 D）。",
                },
                explanation: {
                  type: Type.STRING,
                  description: "超極簡解析，限制在一兩句話 or 單個關鍵代數公式推導（25字以內）。使用 LaTeX。",
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
        const shuffled = shuffleOptionsAndDistributeAnswers(parsedList);
        res.json({
          problems: shuffled,
          isFallback: false
        });
      } else {
        throw new Error("Empty or invalid response parsed from Gemini");
      }
    } catch (error: any) {
      console.warn("Gemini Generation failed or rate-limited. Activating custom database or offline fallback:", error.message || error);
      
      // Determine if it is a rate limit or quota exceeded error with absolute certainty
      let isQuotaLimit = false;
      const errMessage = String(error.message || "").toLowerCase();
      let errDetails = "";
      try {
        errDetails = JSON.stringify(error).toLowerCase();
      } catch (err) {}

      if (
        error.status === 429 || 
        error.statusCode === 429 || 
        error.error?.code === 429 ||
        error.error?.status === "RESOURCE_EXHAUSTED" ||
        errMessage.includes("429") ||
        errMessage.includes("quota") ||
        errMessage.includes("resource_exhausted") ||
        errMessage.includes("rate-limit") ||
        errDetails.includes("429") ||
        errDetails.includes("quota") ||
        errDetails.includes("resource_exhausted")
      ) {
        isQuotaLimit = true;
      }

      // Retrieve high-quality custom or offline LaTeX curriculum problems for this topic
      let fallbackList = [];
      if (topicCustomProblems.length > 0) {
        fallbackList = filterCustomProblems(topicCustomProblems, difficulty);
        // If the filtering returned nothing, grab all custom problems for this topic
        if (fallbackList.length === 0) {
          fallbackList = topicCustomProblems;
        }
      }
      // If we still have nothing or custom list was empty, use static curated offline database
      if (fallbackList.length === 0) {
        fallbackList = FALLBACK_PROBLEMS[topic] || FALLBACK_PROBLEMS["基礎代數"];
      }
      
      fallbackList = limitToTenQuestions(fallbackList);
      const shuffled = shuffleOptionsAndDistributeAnswers(fallbackList);
      
      res.json({
        problems: shuffled,
        isFallback: true,
        fallbackReason: isQuotaLimit ? "QUOTA_LIMIT" : "GENERIC_ERROR",
        errorMessage: error.message || String(error)
      });
    }
  });

  // GET Custom Problems List
  app.get("/api/custom-problems", (req, res) => {
    try {
      const data = getCustomProblemsData();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to load custom problems" });
    }
  });

  // POST Import Problems List directly to backend
  app.post("/api/import-problems", (req, res) => {
    try {
      const { topic, problems } = req.body;
      if (!topic || !Array.isArray(problems)) {
        return res.status(400).json({ error: "Missing topic or problems array" });
      }

      const currentData = getCustomProblemsData();
      if (!currentData[topic]) {
        currentData[topic] = [];
      }

      const lastId = currentData[topic].reduce((max: number, p: any) => Math.max(max, p.id || 0), 1000);
      const sanitizedProblems = problems.map((p, idx) => ({
        id: lastId + idx + 1,
        question: p.question || "未命名題目",
        options: Array.isArray(p.options) ? p.options : ["A", "B", "C", "D"],
        answer: typeof p.answer === "number" ? p.answer : 0,
        explanation: p.explanation || "無詳細解析"
      }));

      currentData[topic] = [...currentData[topic], ...sanitizedProblems];
      saveCustomProblemsData(currentData);

      console.log(`Successfully stored ${sanitizedProblems.length} custom problems for [${topic}] directly in backend`);
      res.json({ success: true, count: sanitizedProblems.length, problems: currentData[topic] });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to import problems" });
    }
  });

  // POST Delete Custom Problem from backend
  app.post("/api/delete-problem", (req, res) => {
    try {
      const { topic, id } = req.body;
      if (!topic || id === undefined) {
        return res.status(400).json({ error: "Missing topic or id parameter" });
      }

      const currentData = getCustomProblemsData();
      if (currentData[topic]) {
        currentData[topic] = currentData[topic].filter((p: any) => p.id !== id);
        saveCustomProblemsData(currentData);
      }

      res.json({ success: true, problems: currentData[topic] || [] });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to delete problem" });
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
