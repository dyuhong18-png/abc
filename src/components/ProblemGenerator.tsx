import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { generatePracticeProblems } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLearning } from '../context/LearningContext';

interface Problem {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const DIFFICULTIES = ['入門', '進階', '困難'];

export function ProblemGenerator() {
  const { activeTopic, addScore, completeTopic } = useLearning();
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Reset when topic changes
  useEffect(() => {
    setProblems([]);
    setIsFinished(false);
  }, [activeTopic]);

  const startPractice = async () => {
    setLoading(true);
    setProblems([]);
    setCurrentIdx(0);
    setSessionScore(0);
    setUserAnswer(null);
    setShowExplanation(false);
    setIsFinished(false);
    
    try {
      const data = await generatePracticeProblems(activeTopic, difficulty);
      setProblems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (userAnswer !== null) return;
    setUserAnswer(idx);
    setShowExplanation(true);
    if (idx === problems[currentIdx].answer) {
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
              <span className="text-sm font-black font-mono">0{currentIdx + 1} <span className="text-slate-300">/</span> 0{problems.length}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase">階段得分</span>
              <span className="text-sm font-black font-mono">{sessionScore}</span>
            </div>
          </div>

          <div className="mb-10 p-8 border border-slate-100 bg-slate-50/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 font-mono text-4xl font-bold italic">Q</div>
            <div className="prose prose-slate max-w-none text-base text-slate-800 relative z-10 antialiased font-medium leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {problems[currentIdx].question}
              </ReactMarkdown>
            </div>
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
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 border border-current flex items-center justify-center text-[10px] font-mono">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm">{opt}</span>
                </div>
                {userAnswer !== null && i === problems[currentIdx].answer && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {userAnswer !== null && i === userAnswer && i !== problems[currentIdx].answer && <XCircle className="w-5 h-5 text-rose-600" />}
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
                <div className="p-6 bg-slate-900 text-white border-t-2 border-indigo-600 flex flex-col gap-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">邏輯解析 Log Description</h4>
                  <div className="text-sm font-medium text-slate-300 leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {problems[currentIdx].explanation}
                    </ReactMarkdown>
                  </div>
                </div>
                <button 
                  onClick={nextProblem}
                  className="w-full py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all"
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
            <p className="text-sm font-mono text-slate-400 mt-2 uppercase">Success Rate: {(score / problems.length * 100).toFixed(0)}%</p>
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
