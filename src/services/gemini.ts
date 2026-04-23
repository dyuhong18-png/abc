import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askMathTutor(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview", // Use Pro for math reasoning
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `你是 MathWhiz 的 AI 數學導師。
你的目標是以親切、耐心的態度教導學生數學。
請使用繁體中文回答。
當學生問問題時：
1. 逐步解釋概念，不要只給答案。
2. 使用 LaTeX 格式包裹數學公式（例如 $x^2$ 或 $$y = mx + c$$）。
3. 如果學生不理解，嘗試用簡單的比喻。
4. 鼓勵學生思考。`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function generatePracticeProblems(topic: string, difficulty: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `產生 3 個關於「${topic}」的數學練習題，難度為「${difficulty}」。
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
只回傳 JSON 字串。`,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Problem Generation Error:", error);
    return [];
  }
}
