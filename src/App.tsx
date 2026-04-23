/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, Github, Twitter, Info } from 'lucide-react';
import { MathTutor } from './components/MathTutor';
import { ProblemGenerator } from './components/ProblemGenerator';
import { FormulaSheet } from './components/FormulaSheet';
import { motion } from 'motion/react';
import { useLearning } from './context/LearningContext';
import { useState } from 'react';
import { cn } from './lib/utils';

const TOPICS = ['基礎代數', '平面幾何', '三角函數', '微積分初步', '統計與機率'];

export default function App() {
  const { activeTopic, setActiveTopic, progress } = useLearning();
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);

  const completedCount = progress.completedTopics.length;
  const progressPercent = (completedCount / TOPICS.length) * 100;

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-x-hidden select-none">
      {/* Header Navigation */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 flex-shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center rounded-none shadow-sm">
             <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-800 uppercase">MathWhiz<span className="text-indigo-600">.Lab</span></span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-widest text-slate-500">
          <button 
            onClick={() => setIsFormulaOpen(true)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors py-1 cursor-pointer"
          >
            <Info className="w-4 h-4" /> 公式庫
          </button>
          <a href="#tutor" className="hover:text-slate-800 transition-colors py-1">AI 導師</a>
          <a href="#practice" className="hover:text-slate-800 transition-colors py-1">練習挑戰</a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="text-right mr-2 hidden sm:block">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">學員</div>
            <div className="text-sm font-bold">數學探險家</div>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
             <span className="text-xs font-bold text-slate-500">Explorer</span>
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
                  onClick={() => setActiveTopic(topic)}
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
              <div className="text-sm font-bold mb-4 italic underline text-slate-700 underline-offset-4 decoration-indigo-400">解鎖全部核心概念</div>
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

        {/* Main Content Grid */}
        <main className="flex-1 p-6 md:p-12 flex flex-col gap-12 overflow-y-auto">
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

          {/* Interactive Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
            <div id="tutor" className="xl:col-span-3 flex flex-col">
              <h3 className="section-header">智能導師系統</h3>
              <MathTutor />
            </div>
            <div id="practice" className="xl:col-span-2 flex flex-col">
              <h3 className="section-header">實戰練習模組</h3>
              <ProblemGenerator />
            </div>
          </div>

          {/* Dashboard Stats */}
          <footer className="mt-8 flex flex-col sm:flex-row justify-between items-center sm:items-end border-t border-slate-200 pt-10 gap-8">
            <div className="flex flex-wrap gap-12 justify-center sm:justify-start">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">累積綜合積分</div>
                <div className="text-3xl font-black italic text-slate-800">{progress.totalScore}<span className="text-xs not-italic text-slate-400 font-mono ml-2">XP</span></div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">全球解題排名</div>
                <div className="text-3xl font-black italic text-indigo-600">TOP 5%</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">徽章成就</div>
                <div className="flex gap-2 mt-2">
                  <div className="w-5 h-5 bg-amber-400 shadow-sm"></div>
                  <div className="w-5 h-5 bg-indigo-500 shadow-sm rotate-12"></div>
                  <div className="w-5 h-5 bg-emerald-500 shadow-sm -rotate-12"></div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center sm:items-end gap-4">
              <div className="flex gap-4">
                <Twitter className="w-4 h-4 text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors" />
                <Github className="w-4 h-4 text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors" />
              </div>
              <div className="text-[9px] font-mono text-slate-300 uppercase tracking-[0.2em] italic text-center sm:text-right max-w-xs">
                Logic is the beginning of wisdom, not the end.
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

