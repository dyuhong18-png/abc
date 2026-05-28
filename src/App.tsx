/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, Github, Twitter, Info, ChevronRight, Database, Flame } from 'lucide-react';
import { ProblemGenerator } from './components/ProblemGenerator';
import { FormulaSheet, FORMULA_DATA } from './components/FormulaSheet';
import { ImportProblems } from './components/ImportProblems';
import { motion } from 'motion/react';
import { useLearning } from './context/LearningContext';
import { useState } from 'react';
import { cn } from './lib/utils';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const TOPICS = ['基礎代數', '平面幾何', '三角函數', '向量單元', '微積分初步', '統計與機率', '邏輯推理'];

export default function App() {
  const { activeTopic, setActiveTopic, progress } = useLearning();
  const [currentPage, setCurrentPage] = useState<'home' | 'practice' | 'formulas' | 'profile' | 'import'>('home');
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [showSidebarFormulas, setShowSidebarFormulas] = useState(true);
  const [formulaSelectedTopic, setFormulaSelectedTopic] = useState<string>('all');
  const [formulaSearchQuery, setFormulaSearchQuery] = useState<string>('');

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
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setCurrentPage('formulas')} className="text-xs font-bold underline underline-offset-4 decoration-indigo-400">查閱公式手冊</button>
                  <button onClick={() => setCurrentPage('profile')} className="text-xs font-bold underline underline-offset-4 decoration-indigo-400">查看我的 XP 排名</button>
                  <button onClick={() => setCurrentPage('import')} className="text-xs font-bold text-indigo-300 hover:text-indigo-200 underline underline-offset-4 decoration-indigo-300">⚙️ 後端數據庫管理</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'practice': {
        // Filter formulas based on chosen topic and search query
        let filteredFormulas: { topic: string; label: string; math: string }[] = [];
        Object.entries(FORMULA_DATA).forEach(([topicKey, category]) => {
          category.formulas.forEach(f => {
            filteredFormulas.push({
              topic: topicKey,
              label: f.label,
              math: f.math
            });
          });
        });

        const selectedTopicTopic = formulaSelectedTopic === 'active' || formulaSelectedTopic === '' ? activeTopic : formulaSelectedTopic;

        if (formulaSelectedTopic !== 'all') {
          filteredFormulas = filteredFormulas.filter(item => item.topic === selectedTopicTopic);
        }

        if (formulaSearchQuery.trim()) {
          const q = formulaSearchQuery.toLowerCase();
          filteredFormulas = filteredFormulas.filter(item => 
            item.label.toLowerCase().includes(q) || 
            item.topic.toLowerCase().includes(q) ||
            item.math.toLowerCase().includes(q)
          );
        }

        return (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">實戰練習場</h2>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Core Training Module / {activeTopic}</p>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <button 
                  onClick={() => setShowSidebarFormulas(!showSidebarFormulas)}
                  className={cn(
                    "px-4 py-2 text-xs font-black transition-all border flex items-center gap-2 cursor-pointer",
                    showSidebarFormulas 
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-800"
                  )}
                >
                  📖 {showSidebarFormulas ? '關閉側邊對照' : '在旁邊看所有算式'}
                </button>
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase transition-colors"
                >
                  返回儀表板
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Problem Generator */}
              <div className={cn(showSidebarFormulas ? "lg:col-span-8 w-full" : "lg:col-span-12 w-full")}>
                <ProblemGenerator />
              </div>

              {/* Right Column: Custom side-by-side formula handbook */}
              {showSidebarFormulas && (
                <div id="side-formula-panel" className="lg:col-span-4 bg-white border border-slate-200 p-6 flex flex-col gap-6 sticky top-24 max-h-[calc(100vh-10rem)] overflow-y-auto shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-indigo-600"></span>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">側邊算式對照表</h3>
                    </div>
                    <span className="text-[9px] font-mono text-slate-300">FORMULA-AIDE</span>
                  </div>

                  <p className="text-xs font-semibold text-slate-500 leading-relaxed -mt-2">
                    配合當前題目，您可以在右邊自由切換查看代數、幾何、微積分等各大單元的公式，不影響當前的答題狀態。
                  </p>

                  {/* Dropdown Topic Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">1. 常規篩選主題</label>
                    <select 
                      value={formulaSelectedTopic} 
                      onChange={(e) => setFormulaSelectedTopic(e.target.value)}
                      className="w-full p-3 border border-slate-200 bg-slate-50 text-xs font-bold outline-none focus:border-indigo-600 transition-colors cursor-pointer"
                    >
                      <option value="active">當前練習單元 ({activeTopic})</option>
                      <option value="all">列出所有單元算式 (All Topics)</option>
                      {TOPICS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Filter Search Box */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">2. 關鍵字快速檢索</label>
                    <input 
                      type="text"
                      value={formulaSearchQuery}
                      onChange={(e) => setFormulaSearchQuery(e.target.value)}
                      placeholder="搜尋公式名稱或定義 (如: 畢氏、貝氏)..."
                      className="w-full p-3 border border-slate-200 bg-transparent text-xs font-semibold outline-none focus:border-indigo-600 transition-colors"
                    />
                  </div>

                  {/* Render filtered calculations list */}
                  <div className="space-y-6 mt-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredFormulas.length === 0 ? (
                      <div className="p-6 text-center text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 italic">
                        未找到符合搜尋條件的算式。
                      </div>
                    ) : (
                      filteredFormulas.map((f, i) => (
                        <div key={i} className="flex flex-col gap-2 p-4 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors relative group">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tight">{f.topic}</span>
                            <span className="text-[9px] font-mono text-slate-300">#{i + 1}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-700">{f.label}</span>
                          <div className="p-3 bg-white border border-slate-100 flex items-center justify-center overflow-x-auto select-all">
                            <BlockMath math={f.math} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    <span>Precision Engine</span>
                    <span>v1.2.1</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }
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
              {TOPICS.map((t) => (
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
      case 'import':
        return <ImportProblems />;
      case 'profile':
        return (
          <div className="flex flex-col gap-10">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">個人成長檔案</h2>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Growth Data Analysis</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white border border-slate-200 p-8 flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">累積綜合積分</span>
                <span className="text-4xl font-black text-slate-900 italic">{progress.totalScore} <span className="text-xs not-italic text-slate-300">XP</span></span>
              </div>
              <div className="bg-white border border-slate-200 p-8 flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">已攻克單元</span>
                <span className="text-4xl font-black text-indigo-600 italic">{completedCount} <span className="text-xs not-italic text-slate-300">/ {TOPICS.length}</span></span>
              </div>
              <div className="bg-white border border-slate-200 p-8 flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">連續實踐天數</span>
                <span className={cn("text-4xl font-black italic", progress.streak > 0 ? "text-orange-600" : "text-slate-950")}>
                  {progress.streak} <span className="text-xs not-italic text-slate-300">天</span>
                </span>
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
          <span className="text-2xl font-black tracking-tight text-slate-800">偉傑數學<span className="text-indigo-600 font-bold text-sm ml-1 uppercase">.Lab</span></span>
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
          <button 
            onClick={() => setCurrentPage('import')}
            className={cn("hover:text-indigo-600 transition-colors py-1 cursor-pointer", currentPage === 'import' && "text-indigo-600 border-b-2 border-indigo-600")}
          >
            題庫管理
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

              {/* Learning Streak Indicator */}
              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    key={`${progress.streak}-${progress.completedTopics.length}-${progress.totalScore}`}
                    initial={{ scale: 1, rotate: 0 }}
                    animate={{
                      scale: [1, 1.45, 1.1, 1.15, 1],
                      rotate: [0, -18, 18, -10, 10, 0],
                    }}
                    transition={{
                      duration: 0.75,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className="flex items-center justify-center cursor-pointer"
                  >
                    <Flame 
                      className={cn(
                        "w-4 h-4 transition-colors duration-300",
                        progress.streak > 0 
                          ? "text-orange-500 fill-orange-500 animate-pulse" 
                          : "text-slate-300"
                      )} 
                    />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">學習極限連擊</span>
                    <span className="text-[10px] font-medium text-slate-500">
                      {progress.streak > 0 ? "保持每日練習！" : "今天練習以啟動！"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-lg font-black italic tracking-tighter",
                    progress.streak > 0 ? "text-orange-600" : "text-slate-400"
                  )}>
                    {progress.streak}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold ml-0.5">🔥</span>
                </div>
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
                © 2026 偉傑數學.Lab - Precision Education
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

