import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { generatePracticeProblems } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLearning } from '../context/LearningContext';
import { FORMULA_DATA } from './FormulaSheet';
import { BlockMath, MathText } from './MathRenderer';
import 'katex/dist/katex.min.css';

interface Problem {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const DIFFICULTIES = ['入門', '進階', '困難'];

export function ProblemGenerator() {
  const { activeTopic, addScore, completeTopic, recordAttempt } = useLearning();
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fallbackReason, setFallbackReason] = useState<'MISSING_KEY' | 'QUOTA_LIMIT' | 'GENERIC_ERROR' | 'CONNECTION_ERROR' | 'FORCE_OFFLINE' | null>(null);
  const [useCustomOnly, setUseCustomOnly] = useState(false);
  const [forceOffline, setForceOffline] = useState(false);
  const [isCustomRecord, setIsCustomRecord] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Reset when topic changes
  useEffect(() => {
    setProblems([]);
    setIsFinished(false);
    setErrorMsg(null);
    setFallbackReason(null);
    setShowHint(false);
  }, [activeTopic]);

  const startPractice = async () => {
    setLoading(true);
    setErrorMsg(null);
    setFallbackReason(null);
    setProblems([]);
    setCurrentIdx(0);
    setSessionScore(0);
    setUserAnswer(null);
    setShowExplanation(false);
    setIsFinished(false);
    setShowHint(false);
    
    try {
      const response = await generatePracticeProblems(activeTopic, difficulty, useCustomOnly, forceOffline);
      const problemList = response.problems;
      
      if (!Array.isArray(problemList) || problemList.length === 0) {
        if (useCustomOnly) {
          setErrorMsg(`後端自訂題庫中尚無此單元且難度為「${difficulty}」的自訂題目。您可以在頂部選單的「題庫管理」導入題目，或選擇其他難度及單元！`);
          return;
        }
        console.error("Invalid problem data received:", response);
        setErrorMsg("無法產生題目。系統已啟用標準備用數據，請點擊下方按鈕重試或切換主題。");
        return;
      }
      setProblems(problemList);
      setIsCustomRecord(!!response.isCustom);
      
      if (response.isFallback) {
        setFallbackReason(response.fallbackReason || 'GENERIC_ERROR');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("伺服器連線異常。我們在下方為您準備了離線精選 LaTeX 數學題目，請點擊再次啟動。");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (userAnswer !== null) return;
    setUserAnswer(idx);
    setShowExplanation(true);
    const isCorrect = idx === problems[currentIdx].answer;
    
    // Log user attempt in context for profile analytics
    recordAttempt(isCorrect);

    if (isCorrect) {
      setSessionScore(s => s + 1);
      addScore(10); // Persistence 10 pts per correct answer
    }
  };

  const finishSession = () => {
    setIsFinished(true);
    if (sessionScore >= problems.length * 0.7) {
      completeTopic(activeTopic);
    }
  };

  const nextProblem = () => {
    if (currentIdx < problems.length - 1) {
      setCurrentIdx(i => i + 1);
      setUserAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
    } else {
      finishSession();
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-none overflow-hidden flex flex-col p-8">
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 font-sans">實戰練習模組</h2>
        </div>
        <span className="text-[10px] font-mono text-slate-300">MOD-02</span>
      </div>

      {!problems.length && !loading && !isFinished && (
        <div className="space-y-8">
          {errorMsg && (
            <div className="p-6 bg-amber-50/70 border-2 border-amber-300 border-l-8 border-l-amber-500 text-slate-800 text-xs font-semibold leading-relaxed">
              <div className="font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                <span>💡 智慧學習提示 / Intelligent Integration Guidance</span>
              </div>
              <p className="text-slate-600 font-medium">{errorMsg}</p>
            </div>
          )}
          {fallbackReason && (
            <div className="p-6 bg-amber-50 border-2 border-amber-300 border-l-8 border-l-amber-500 text-slate-800 text-xs font-semibold leading-relaxed">
              {fallbackReason === 'QUOTA_LIMIT' ? (
                <div>
                  <div className="font-bold text-amber-800 flex items-center gap-1.5 mb-1 text-sm">
                    ⚠️ <span>Gemini API 額度已達免費上限 / Quota Limit Exceeded</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    您的當前金鑰已達 `gemini-3.5-flash` 免費每日限制（20 次請求）。
                    為了解鎖即時生成全新的高難度演算法題目，您可在 **Settings &gt; Secrets** 內設定您個人的付費 API 金鑰，或在部署環境（如 Render）中設定 `GEMINI_API_KEY`。
                  </p>
                  <p className="text-slate-500 font-normal mt-2">
                    * 為了保證學習不中斷，系統已為您動態啟用<strong>備用題庫（優先載入 100 題後端自訂題庫及 10 題離線精選 LaTeX 核心考題）</strong>。您仍可以自由進行解題訓練與賺取學習積分！
                  </p>
                </div>
              ) : fallbackReason === 'MISSING_KEY' ? (
                <div>
                  <div className="font-bold text-amber-800 flex items-center gap-1.5 mb-1 text-sm">
                    ⚠️ <span>未設定 API 金鑰 / API Key Missing</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    未偵測到您的 API 金鑰。請在 **Settings &gt; Secrets** 內設定 `api_key`（或專屬的付費 API 金鑰），或在您的部署環境設定 `GEMINI_API_KEY`。
                  </p>
                  <p className="text-slate-500 font-normal mt-2">
                    * 系統已為您自動啟用<strong>備用題庫模式（優先整合您匯入的 100 題自訂題庫與備用 LaTeX 題庫）</strong>，支援完美的公式渲染與即時解析！
                  </p>
                </div>
              ) : (
                <div>
                  <div className="font-bold text-amber-800 flex items-center gap-1.5 mb-1 text-sm">
                    ⚠️ <span>連線超時或生成限制 / Service Notice</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    AI 伺服器回傳：當前無法配置新算式。我們已為您切換至<strong>備用與精選 LaTeX 離線題目</strong>，完美照常累計積分。
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">當前學習計畫</label>
              <div className="p-3 border-b border-indigo-600 bg-indigo-50/50 text-indigo-700 text-sm font-black uppercase tracking-widest">
                {activeTopic}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">難度級別</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 border-b border-slate-200 bg-transparent text-sm font-semibold outline-none focus:border-indigo-600 transition-colors"
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="useCustomOnly" 
                  checked={useCustomOnly} 
                  onChange={(e) => {
                    setUseCustomOnly(e.target.checked);
                    if (e.target.checked) setForceOffline(false);
                  }}
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="useCustomOnly" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                  優先載入後端自訂題庫模式 (Use Custom Database)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="forceOffline" 
                  checked={forceOffline} 
                  onChange={(e) => {
                    setForceOffline(e.target.checked);
                    if (e.target.checked) setUseCustomOnly(false);
                  }}
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="forceOffline" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                  強制限載「極速離線精選題庫」模式 (Force Offline Math Database)
                </label>
              </div>
            </div>
          </div>
          <button 
            onClick={startPractice}
            className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
          >
            啟動單元測驗 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest italic">Generating algorithmic data...</p>
        </div>
      )}

      {problems.length > 0 && !isFinished && (
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">進度</span>
              <span className="text-sm font-black font-mono">{(currentIdx + 1) < 10 ? `0${currentIdx + 1}` : currentIdx + 1} <span className="text-slate-300">/</span> {problems.length < 10 ? `0${problems.length}` : problems.length}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase">階段得分</span>
              <span className="text-sm font-black font-mono">{sessionScore}</span>
            </div>
          </div>

          {isCustomRecord && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-xs text-slate-700 font-medium">
              <span className="font-bold text-emerald-800">⚙️ 後端自訂題庫模式：</span>
              您目前正在練習由老師或管理者手動導入、直接存在伺服器（In-House DB）的專屬高難度 LaTeX 題目。答題同步可累計 XP 積分！
            </div>
          )}

          {fallbackReason && (
            <div className="mb-6 p-4 bg-amber-50/80 border border-amber-200 text-xs text-slate-700 font-medium">
              <span className="font-bold text-amber-800">💡 備用與離線模組：</span>
              {fallbackReason === 'FORCE_OFFLINE'
                ? '已主動開啟極速離線精選題庫模式，為您載入最經典的 LaTeX 整合核心考題與解析，不消耗任何網路金鑰額度！答題仍可照常累計 XP 積分！'
                : fallbackReason === 'QUOTA_LIMIT' 
                ? '因您的 API 免費請求次數已達上限，系統已自備用題庫 (優先載入您的 100 題自訂題庫) 抽取高水準題目，答題可照常累計積分！如需無限 AI 出題，請於 Settings > Secrets 設定付費金鑰。' 
                : fallbackReason === 'MISSING_KEY'
                ? '未偵測到 API 金鑰。系統已為您啟用備用庫模式 (優先整合您的 100 題自訂考題與高品質精選題)，以完美 LaTeX 公式與解析維持高效率學習！'
                : 'AI 出題服務可能受限或超時，已自動切換為備用精選考題，答題仍可累計積分。'
              }
            </div>
          )}

          <div className="mb-8 p-8 border border-slate-100 bg-slate-50/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 font-mono text-4xl font-bold italic">Q</div>
            <div className="prose prose-slate max-w-none text-base text-slate-800 relative z-10 antialiased font-medium leading-relaxed">
              <MathText>
                {problems[currentIdx].question}
              </MathText>
            </div>
            
            {/* Mindset Hint Toggle */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-black uppercase text-indigo-600 hover:text-slate-900 tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                💡 {showHint ? "隱藏思維指引" : "解題觀念思維提示 (Hint Clue)"}
              </button>
              <span className="text-[9px] text-slate-300 font-mono">TOPIC: {activeTopic}</span>
            </div>

            {showHint && (
              <div className="mt-4 p-5 bg-indigo-50/30 border border-indigo-100 flex flex-col gap-3">
                <span className="text-[9px] font-black uppercase text-indigo-800 tracking-widest block font-sans">核心考點引導公式 Reference Formulas</span>
                <span className="text-xs text-slate-600 font-semibold leading-relaxed">
                  本單元《{activeTopic}》常見之公式與邏輯結構如下。請對照分析題目中給出的代數關係：
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
                  {(FORMULA_DATA[activeTopic] || FORMULA_DATA['基礎代數']).formulas.map((frm, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200/60 flex flex-col justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter mb-1 select-none">{frm.label}</span>
                      <div className="p-1 bg-slate-50/50 overflow-x-auto select-all text-xs flex items-center justify-center">
                        <BlockMath math={frm.math} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {problems[currentIdx].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={userAnswer !== null}
                className={cn(
                  "p-5 text-left border transition-all flex items-center justify-between group",
                  userAnswer === null 
                    ? "border-slate-200 hover:border-slate-900 bg-white" 
                    : i === problems[currentIdx].answer
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold"
                      : i === userAnswer
                        ? "border-rose-500 bg-rose-50 text-rose-700 font-bold"
                        : "border-slate-100 bg-slate-50 opacity-40"
                )}
              >
                <div className="flex items-center gap-4 w-full mr-4">
                  <span className="w-6 h-6 border border-current flex items-center justify-center text-[10px] font-mono shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <div className="text-sm font-semibold text-slate-800 text-left flex-1 prose prose-slate prose-p:my-0 max-w-none">
                    <MathText>
                      {opt}
                    </MathText>
                  </div>
                </div>
                {userAnswer !== null && i === problems[currentIdx].answer && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                {userAnswer !== null && i === userAnswer && i !== problems[currentIdx].answer && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-6"
              >
                {userAnswer === problems[currentIdx].answer ? (
                  /* Correct Answer Mode - High-contrast Emerald Diagnostic style */
                  <div className="p-8 bg-emerald-50 border-2 border-emerald-400 border-l-8 border-l-emerald-500 flex flex-col gap-4 shadow-xl shadow-emerald-500/5">
                    <div className="flex items-center gap-2 pb-3 border-b border-emerald-200">
                      <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                        ✓ 答對了！恭喜核心突破
                      </span>
                      <span className="text-xs font-black text-emerald-900 uppercase tracking-tight">
                        完整公式推導與解析 Correct Explanation
                      </span>
                    </div>
                    <div className="diagnostic-explanation correct text-[15px] text-slate-900 leading-relaxed font-semibold self-stretch">
                      <MathText>
                        {problems[currentIdx].explanation}
                      </MathText>
                    </div>
                  </div>
                ) : (
                  /* Wrong Answer Mode - High-contrast Warning/Diagnostic style with distinct background & borders */
                  <div className="p-8 bg-amber-50 border-2 border-amber-400 border-l-8 border-l-amber-500 flex flex-col gap-4 shadow-xl shadow-amber-500/5">
                    <div className="flex items-center gap-2 pb-3 border-b border-amber-200">
                      <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                        💡 觀念診斷與核心指引
                      </span>
                      <span className="text-xs font-black text-amber-900 uppercase tracking-tight">
                        錯誤解析 & 公式精要
                      </span>
                    </div>
                    <div className="diagnostic-explanation wrong text-[15px] text-slate-900 leading-relaxed font-semibold self-stretch">
                      <MathText>
                        {problems[currentIdx].explanation}
                      </MathText>
                    </div>
                  </div>
                )}
                <button 
                  onClick={nextProblem}
                  className="w-full py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all cursor-pointer"
                >
                  {currentIdx === problems.length - 1 ? '完成單元內容' : '進入下一核心題目'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {isFinished && (
        <div className="flex flex-col items-center justify-center py-16 gap-8 text-center bg-slate-50 border border-slate-200">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 flex items-center justify-center border-2 border-emerald-500 shadow-xl shadow-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 font-sans uppercase tracking-tight">單元實測結束</h3>
            <p className="text-sm font-mono text-slate-400 mt-2 uppercase">Success Rate: {(sessionScore / problems.length * 100).toFixed(0)}%</p>
          </div>
          <button 
            onClick={() => { setProblems([]); setIsFinished(false); }}
            className="px-10 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
          >
            重新初始化模組
          </button>
        </div>
      )}
    </div>
  );
}
