/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, Github, Twitter, Info, ChevronRight } from 'lucide-react';
import { ProblemGenerator } from './components/ProblemGenerator';
import { FormulaSheet } from './components/FormulaSheet';
import { motion } from 'motion/react';
import { useLearning } from './context/LearningContext';
import { useState } from 'react';
import { cn } from './lib/utils';

const TOPICS = ['基礎代數', '平面幾何', '三角函數', '微積分初步', '統計與機率'];

export default function App() {
  const { activeTopic, setActiveTopic, progress } = useLearning();
  const [currentPage, setCurrentPage] = useState<'home' | 'practice' | 'formulas' | 'profile'>('home');
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);

  const completedCount = progress.completedTopics.length;
  const progressPercent = (completedCount / TOPICS.length) * 100;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="flex flex-col gap-12">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl md:text-6xl font-black leading-[1.05] text-slate-800 mb-6 tracking-tighter"
                >
                  探索數學的<br/><span className="text-indigo-600">幾何美學</span>與邏輯
                </motion.h1>
                <p className="text-slate-500 text-lg max-w-lg font-medium leading-relaxed">
                  透過視覺化的幾何結構，理解抽象的代數邏輯。讓數學不只是計算，而是一種思考的方式。
                </p>
                <button 
                  onClick={() => setCurrentPage('practice')}
                  className="mt-8 px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center gap-3"
                >
                  開始核心訓練 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="lg:col-span-4 aspect-square border-4 border-indigo-600 relative flex items-center justify-center overflow-hidden bg-white shadow-2xl shadow-indigo-100">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="w-32 h-32 border-2 border-slate-300 rotate-45 flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-indigo-600 rotate-12 flex items-center justify-center">
                      <div className="w-4 h-4 bg-indigo-600"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest antialiased">A² + B² = C²</div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 p-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">最新公告</h4>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  [更新] 幾何單元已新增 15 個進階挑戰題目，包含空間向量運算。
                </p>
              </div>
              <div className="bg-slate-900 p-8 text-white">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">快速入口</h4>
                <div className="flex gap-4">
                  <button onClick={() => setCurrentPage('formulas')} className="text-xs font-bold underline underline-offset-4 decoration-indigo-400">查閱公式手冊</button>
                  <button onClick={() => setCurrentPage('profile')} className="text-xs font-bold underline underline-offset-4 decoration-indigo-400">查看我的 XP 排名</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'practice':
        return (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">實戰練習場</h2>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Core Training Module / {activeTopic}</p>
              </div>
              <button 
                onClick={() => setCurrentPage('home')}
                className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase transition-colors"
              >
                返回儀表板
              </button>
            </div>
            <ProblemGenerator />
          </div>
        );
      case 'formulas':
        return (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">公式知識庫</h2>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Mathematical Formula Reference</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {['基礎代數', '平面幾何', '三角函數'].map((t) => (
                <div key={t} className="bg-white border border-slate-200 p-8">
                  <h3 className="text-sm font-black uppercase text-indigo-600 mb-6">{t}</h3>
                  <div className="space-y-6">
                    <div className="h-px bg-slate-100" />
                    <p className="text-sm text-slate-500 italic">點擊下方按鈕啟動 Drawer 查看詳細公式渲染</p>
                    <button 
                      onClick={() => { setActiveTopic(t); setIsFormulaOpen(true); }}
                      className="text-xs font-bold text-slate-800 hover:text-indigo-600 underline"
                    >
                      開啟 {t} 手冊 (Drawer Mode)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex flex-col gap-10">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">個人成長檔案</h2>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Growth Data Analysis</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-200 p-8 flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">累積綜合積分</span>
                <span className="text-4xl font-black text-slate-900 italic">{progress.totalScore} <span className="text-xs not-italic text-slate-300">XP</span></span>
              </div>
              <div className="bg-white border border-slate-200 p-8 flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">已攻克單元</span>
                <span className="text-4xl font-black text-indigo-600 italic">{completedCount} <span className="text-xs not-italic text-slate-300">/ {TOPICS.length}</span></span>
              </div>
              <div className="bg-white border border-slate-200 p-8 flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">解題正確率</span>
                <span className="text-4xl font-black text-slate-900 italic">87%</span>
              </div>
            </div>

            <div className="bg-slate-900 p-10 text-white">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-8">解鎖成就勳章 Achievements</h4>
              <div className="flex gap-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-amber-400/20 border border-amber-400 flex items-center justify-center rotate-45">
                    <div className="w-8 h-8 bg-amber-400 -rotate-45" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-amber-200">創始探險家</span>
                </div>
                <div className="flex flex-col items-center gap-3 opacity-30">
                  <div className="w-16 h-16 bg-slate-700 border border-slate-600 flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-500 rounded-full" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-tighter">幾何大師</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>404 Module Not Found</div>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-x-hidden select-none">
      {/* Header Navigation */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 flex-shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center rounded-none shadow-sm">
             <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-800 uppercase">MathWhiz<span className="text-indigo-600">.Lab</span></span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-widest text-slate-500">
          <button 
            onClick={() => setCurrentPage('home')}
            className={cn("hover:text-indigo-600 transition-colors py-1 cursor-pointer", currentPage === 'home' && "text-indigo-600 border-b-2 border-indigo-600")}
          >
            探索首頁
          </button>
          <button 
            onClick={() => setCurrentPage('practice')}
            className={cn("hover:text-indigo-600 transition-colors py-1 cursor-pointer", currentPage === 'practice' && "text-indigo-600 border-b-2 border-indigo-600")}
          >
            練習場
          </button>
          <button 
            onClick={() => setCurrentPage('formulas')}
            className={cn("hover:text-indigo-600 transition-colors py-1 cursor-pointer", currentPage === 'formulas' && "text-indigo-600 border-b-2 border-indigo-600")}
          >
            知識庫
          </button>
          <button 
            onClick={() => setCurrentPage('profile')}
            className={cn("hover:text-indigo-600 transition-colors py-1 cursor-pointer", currentPage === 'profile' && "text-indigo-600 border-b-2 border-indigo-600")}
          >
            檔案
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <div className="text-right mr-2 hidden sm:block">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">學員等級</div>
            <div className="text-sm font-bold">LV. {Math.floor(progress.totalScore / 50) + 1} 探險家</div>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => setCurrentPage('profile')}>
             <span className="text-xs font-bold text-slate-500">USER</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar Modules */}
        <aside className="w-full md:w-72 border-r border-slate-200 bg-white p-8 flex flex-col gap-10">
          <div>
            <h3 className="section-header">核心單元</h3>
            <ul className="space-y-4 text-sm font-medium">
              {TOPICS.map((topic) => (
                <li 
                  key={topic}
                  onClick={() => { setActiveTopic(topic); setCurrentPage('practice'); }}
                  className={cn(
                    "flex items-center gap-3 cursor-pointer pl-3 transition-all h-10 border-l-2",
                    activeTopic === topic 
                      ? "text-indigo-600 font-bold border-indigo-600 bg-indigo-50/30 -ml-8 px-8" 
                      : "text-slate-500 hover:text-indigo-500 border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-1.5 h-1.5",
                    progress.completedTopics.includes(topic) ? "bg-emerald-500" : "bg-slate-200"
                  )}></div>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 md:mt-auto">
            <div className="bg-slate-50 p-6 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-3">當前進度 (已完成 {completedCount} 單元)</div>
              <div className="text-sm font-bold mb-4 italic underline text-slate-700 underline-offset-4 decoration-indigo-400">解鎖全部概念</div>
              <div className="w-full bg-slate-200 h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="bg-indigo-600 h-full"
                ></motion.div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-12 flex flex-col gap-12 overflow-y-auto">
          {renderPage()}

          {/* Dashboard Footer Stats (Common) */}
          <footer className="mt-8 flex flex-col sm:flex-row justify-between items-center sm:items-end border-t border-slate-200 pt-10 gap-8">
            <div className="flex flex-wrap gap-12 justify-center sm:justify-start">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">當前積分 XP</div>
                <div className="text-3xl font-black italic text-slate-800">{progress.totalScore}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">全球解題排名</div>
                <div className="text-3xl font-black italic text-indigo-600">TOP 5%</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center sm:items-end gap-3 text-right">
              <div className="text-[9px] font-mono text-slate-300 uppercase tracking-[0.2em] italic">
                © 2026 MathWhiz.Lab - Precision Education
              </div>
            </div>
          </footer>
        </main>
      </div>
      <FormulaSheet 
        topic={activeTopic} 
        isOpen={isFormulaOpen} 
        onClose={() => setIsFormulaOpen(false)} 
      />
    </div>
  );
}

