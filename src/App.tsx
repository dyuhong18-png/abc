/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, Github, Twitter, Info, ChevronRight, ChevronLeft, Database, Flame, Trophy, Target, Zap, Award, ShieldAlert, Sparkles, CheckCircle2, Sun, Moon } from 'lucide-react';
import { ProblemGenerator } from './components/ProblemGenerator';
import { FormulaSheet, FORMULA_DATA } from './components/FormulaSheet';
import { ImportProblems } from './components/ImportProblems';
import { motion } from 'motion/react';
import { useLearning, ALL_TOPICS } from './context/LearningContext';
import { useState } from 'react';
import { cn } from './lib/utils';
import 'katex/dist/katex.min.css';

export default function App() {
  const { 
    activeTopic, 
    setActiveTopic, 
    progress, 
    resetProgress,
    darkMode,
    toggleDarkMode
  } = useLearning();

  const [currentPage, setCurrentPage] = useState<'home' | 'practice' | 'formulas' | 'profile' | 'import'>('home');
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [showSidebar, setShowSidebar] = useState(() => {
    const saved = localStorage.getItem('mathwhiz_show_sidebar');
    return saved !== 'false';
  });

  const handleToggleSidebar = (val: boolean) => {
    setShowSidebar(val);
    localStorage.setItem('mathwhiz_show_sidebar', String(val));
  };

  const completedCount = progress.completedTopics.length;
  const progressPercent = (completedCount / ALL_TOPICS.length) * 100;

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
                  className="mt-8 px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center gap-3 cursor-pointer"
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

            {/* Premium Learning Dashboard */}
            <div className="bg-white border border-slate-200 p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600"></span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 font-sans">學員智慧儀表板 Insights</h3>
                </div>
                <span className="text-[9px] font-mono text-indigo-600 font-bold uppercase tracking-wider">Level: {Math.floor(progress.totalScore / 50) + 1} 探險家</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50/50 p-6 border border-slate-150 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">單元覆蓋度 Topic Scope</span>
                    <h5 className="text-3xl font-black text-slate-800 mt-1 italic">{completedCount} <span className="text-xs not-italic font-bold text-slate-300">/ {ALL_TOPICS.length}</span></h5>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 mt-4 overflow-hidden">
                    <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>
                <div className="bg-slate-50/50 p-6 border border-slate-150 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">實作正確率 Accuracy</span>
                    <h5 className="text-3xl font-black text-indigo-600 mt-1 italic">
                      {progress.totalAnswersCount > 0 
                        ? `${Math.round((progress.correctAnswersCount / progress.totalAnswersCount) * 100)}%` 
                        : "0%"}
                    </h5>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-4 leading-normal font-sans font-medium">
                    {progress.totalAnswersCount > 0 
                      ? `已紀錄共 ${progress.totalAnswersCount} 次常規答題` 
                      : "初始狀態，請至練習場開啟挑戰以分析正確率"}
                  </span>
                </div>
                <div className="bg-slate-50/50 p-6 border border-slate-150 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">已獲積分 Cumulative Score</span>
                    <h5 className="text-3xl font-black text-slate-800 mt-1 italic">{progress.totalScore} <span className="text-xs not-italic font-bold text-slate-300">XP</span></h5>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-4 leading-normal font-sans font-medium">
                    答對一題累計 10 XP，解鎖更進階的個人成就勳章
                  </span>
                </div>
              </div>

              {/* Quick Topic link pills */}
              <div className="mt-4 flex flex-col gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">極速單元進場：</span>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {ALL_TOPICS.map(topic => {
                    const isPassed = progress.completedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => {
                          setActiveTopic(topic);
                          setCurrentPage('practice');
                        }}
                        className={cn(
                          "p-3 text-center border text-xs font-bold transition-all relative flex flex-col items-center justify-center gap-1.5 cursor-pointer",
                          isPassed 
                            ? "bg-emerald-50/50 border-emerald-300 text-emerald-800 hover:bg-emerald-50" 
                            : topic === activeTopic 
                              ? "bg-indigo-50/30 border-indigo-400 text-indigo-700 hover:bg-indigo-50" 
                              : "bg-white border-slate-200 hover:border-slate-800 h-14"
                        )}
                      >
                        <span className="truncate w-full block">{topic}</span>
                        {isPassed ? (
                          <span className="text-[8px] bg-emerald-600 text-white font-black px-1.5 py-0.5 uppercase tracking-tighter scale-90">已通關</span>
                        ) : (
                          <span className="text-[8px] font-mono text-indigo-500">GO &rarr;</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 p-8 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">最新公告 System Bulletins</h4>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed font-sans">
                    [更新] 本機離線高品質 LaTeX 資料庫已部署完畢！若外部 Gemini 網路不穩或免費額度受限，系統將極速載入高品質精選課程與導入的自訂題庫進行無縫學習。
                  </p>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3 text-[10px] font-mono text-slate-400 uppercase font-bold">
                  DATABASE CORNER: 200+ 精細精選 LaTeX 題目
                </div>
              </div>
              <div className="bg-slate-900 p-8 text-white flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">快速入口 Quick Links</h4>
                  <p className="text-sm text-slate-300 mb-4 leading-relaxed font-sans font-medium">
                    輕鬆存取各大系統，查閱多維公式，查看 XP 勳章，或者是寫入全新手動精煉考題數據：
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <button onClick={() => setCurrentPage('formulas')} className="text-xs font-bold underline underline-offset-4 decoration-indigo-400 hover:text-indigo-300 cursor-pointer">查閱公式手冊</button>
                    <button onClick={() => setCurrentPage('profile')} className="text-xs font-bold underline underline-offset-4 decoration-indigo-400 hover:text-indigo-300 cursor-pointer">查看我的 XP 勳章</button>
                    <button onClick={() => setCurrentPage('import')} className="text-xs font-bold text-indigo-300 hover:text-indigo-200 underline underline-offset-4 decoration-indigo-300 cursor-pointer">⚙️ 專人題庫導入與管理</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'practice':
        return (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">實戰練習場</h2>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Core Training Module / {activeTopic}</p>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase transition-colors"
                >
                  返回儀表板
                </button>
              </div>
            </div>

            <div className="w-full">
              <ProblemGenerator />
            </div>
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
              {ALL_TOPICS.map((t) => (
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
      case 'profile': {
        const hasHistory = progress.totalAnswersCount > 0;
        const currentAccuracy = hasHistory 
          ? `${Math.round((progress.correctAnswersCount / progress.totalAnswersCount) * 100)}%`
          : "暫無數據";
        const profileCompletedCount = progress.completedTopics.length;

        // Dynamic unlocking lists of badges
        const badges = [
          {
            title: "創始探險家",
            desc: "踏出偉傑數學的首步，登錄本實驗室。",
            unlocked: true,
            icon: Trophy,
            color: "text-amber-500 border-amber-400 bg-amber-500/10"
          },
          {
            title: "求知起點",
            desc: "成功在本機解答 1 道練習考題。",
            unlocked: progress.totalAnswersCount >= 1,
            icon: Target,
            color: "text-blue-500 border-blue-400 bg-blue-500/10"
          },
          {
            title: "火熱打卡連擊",
            desc: "連續練習天數大於 0 天。",
            unlocked: progress.streak > 0,
            icon: Flame,
            color: "text-orange-500 border-orange-400 bg-orange-500/10"
          },
          {
            title: "代數探索家",
            desc: "成功把「基礎代數」單元全盤擊破。",
            unlocked: progress.completedTopics.includes("基礎代數"),
            icon: Award,
            color: "text-indigo-500 border-indigo-400 bg-indigo-500/10"
          },
          {
            title: "幾何大師",
            desc: "完成「平面幾何」單元全部核心挑戰。",
            unlocked: progress.completedTopics.includes("平面幾何"),
            icon: Sparkles,
            color: "text-pink-500 border-pink-400 bg-pink-500/10"
          },
          {
            title: "核心大師",
            desc: "至少攻克 3 個核心單元並且答對率過關。",
            unlocked: progress.completedTopics.length >= 3,
            icon: Zap,
            color: "text-purple-500 border-purple-400 bg-purple-500/10"
          }
        ];

        return (
          <div className="flex flex-col gap-10">
            <div className="border-b border-slate-200 pb-6 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">個人成長檔案</h2>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Growth Data Analysis</p>
              </div>
              <span className="text-xs font-mono text-slate-400">UUID: {Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white border border-slate-200 p-8 flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">累積綜合積分 XP</span>
                <span className="text-4xl font-black text-slate-900 italic">{progress.totalScore} <span className="text-xs not-italic text-slate-300 font-bold">XP</span></span>
              </div>
              <div className="bg-white border border-slate-200 p-8 flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">已攻克單元 Topic Score</span>
                <span className="text-4xl font-black text-indigo-600 italic">{profileCompletedCount} <span className="text-xs not-italic text-slate-300 font-bold">/ {ALL_TOPICS.length}</span></span>
              </div>
              <div className="bg-white border border-slate-200 p-8 flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">連續實踐天數 Learning Streak</span>
                <span className={cn("text-4xl font-black italic", progress.streak > 0 ? "text-orange-600" : "text-slate-950")}>
                  {progress.streak} <span className="text-xs not-italic text-slate-300 font-bold">天</span>
                </span>
              </div>
              <div className="bg-white border border-slate-200 p-8 flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">解題正確率 Correct Ratio</span>
                <span className="text-4xl font-black text-slate-900 italic">{currentAccuracy}</span>
              </div>
            </div>

            {/* Achievement badges showcase */}
            <div className="bg-slate-900 p-10 text-white">
              <div className="border-b border-slate-800 pb-4 mb-8">
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">解鎖成就勳章 Achievements &amp; Medals</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  在這裡查閱您所有的榮譽點數。隨著答題次數以及通關單元升高，勳章將會自動啟用、變得鮮艷：
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge, idx) => {
                  const BIcon = badge.icon;
                  return (
                    <div 
                      key={idx} 
                      className={cn(
                        "p-6 border flex gap-4 items-center transition-all duration-300",
                        badge.unlocked 
                          ? "bg-slate-950 border-slate-800 opacity-100" 
                          : "border-slate-800/60 bg-slate-900/40 opacity-40 select-none cursor-not-allowed"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 border flex items-center justify-center shrink-0 rotate-45",
                        badge.unlocked ? badge.color : "border-slate-800 text-slate-700 bg-slate-900"
                      )}>
                        <BIcon className="w-5 h-5 -rotate-45" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className={cn("text-xs font-black uppercase tracking-tight", badge.unlocked ? "text-slate-100" : "text-slate-500")}>
                            {badge.title}
                          </span>
                          {badge.unlocked && <span className="text-[9px] bg-emerald-600/35 text-emerald-400 border border-emerald-500/25 px-1 font-bold">ACTIVE</span>}
                        </div>
                        <span className="text-[10px] text-slate-400 leading-normal font-sans font-medium">{badge.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border border-rose-200 p-8">
              <h4 className="text-xs font-black uppercase tracking-widest text-rose-600 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> 危險專區 (Danger Zone)
              </h4>
              <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed font-sans">
                重置您在【偉傑數學.Lab】的本機學習軌跡。這操作會立即清除您的 XP 積分、連續學習天數度、已攻克單元、答題統計與全部已解鎖徽章，使您的數據歸零。
              </p>
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-5 py-3 border-2 border-rose-500 text-rose-600 hover:bg-rose-50 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                🚨 清除本機學習軌跡 Reset Progress
              </button>
            </div>
          </div>
        );
      }
      default:
        return <div>404 Module Not Found</div>;
    }
  };

  return (
    <div className={cn("w-full min-h-screen font-sans flex flex-col overflow-x-hidden select-none transition-colors duration-300", 
      darkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
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
          <button 
            type="button"
            onClick={toggleDarkMode}
            className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer transition-colors"
            title={darkMode ? "切換至淺色模式 (Switch to Light Mode)" : "切換至深色模式 (Switch to Dark Mode)"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          <div className="text-right mr-2 hidden sm:block">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">學員等級</div>
            <div className="text-sm font-bold">LV. {Math.floor(progress.totalScore / 50) + 1} 探險家</div>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => setCurrentPage('profile')}>
             <span className="text-xs font-bold text-slate-500">USER</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row relative">
        {/* Toggle Sidebar tab when hidden */}
        {!showSidebar && (
          <button
            onClick={() => handleToggleSidebar(true)}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-[45] bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg shadow-lg py-5 px-2 flex flex-col items-center gap-2 border border-l-0 border-indigo-400 group transition-all duration-250 cursor-pointer"
            title="展開核心單元"
          >
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 animate-pulse" />
            <span className="text-[10px] [writing-mode:vertical-lr] font-black tracking-[0.2em] uppercase select-none">展開單元</span>
          </button>
        )}

        {/* Sidebar Modules */}
        <aside className={cn(
          "bg-white flex flex-col border-slate-200 transition-all duration-300 ease-in-out shrink-0 overflow-y-auto",
          showSidebar 
            ? "w-full md:w-72 border-r p-8 gap-10 opacity-100" 
            : "w-0 h-0 md:h-auto md:p-0 md:border-r-0 md:gap-0 opacity-0 overflow-hidden"
        )}>
          <div>
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 font-sans">核心單元</h3>
              <button
                onClick={() => handleToggleSidebar(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer flex items-center justify-center bg-slate-150 hover:bg-slate-200 w-6 h-6 transition-colors"
                title="隱藏核心單元欄"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <ul className="space-y-4 text-sm font-medium">
              {ALL_TOPICS.map((topic) => (
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

      {/* ⚠️ Custom Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-white border-2 border-rose-500 shadow-2xl p-8 flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-rose-50 flex items-center justify-center rounded-none shrink-0">
                <ShieldAlert className="w-6 h-6 text-rose-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">確定重置學習檔案嗎？</h3>
                <p className="text-[10px] font-mono text-rose-600 uppercase tracking-widest font-bold mt-0.5">CRITICAL DATA RESET WARNING</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-500 leading-relaxed font-sans">
              此操作將會<strong>永久清除</strong>您的所有學習軌跡、累計積分、連續練習天數、答題正確率統計以及全部已解鎖徽章。此動作將對瀏覽器的 LocalStorage 進行清空且無法還原！
            </p>

            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-black text-slate-700 uppercase tracking-widest cursor-pointer"
              >
                取消 Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetProgress();
                  setShowResetConfirm(false);
                  setShowResetSuccess(true);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest cursor-pointer"
              >
                🚨 確認清除重置
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 🎉 Custom Reset Success Modal */}
      {showResetSuccess && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-white border-2 border-emerald-500 shadow-2xl p-8 flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-emerald-50 flex items-center justify-center rounded-none shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">資料重置完畢</h3>
                <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest font-bold mt-0.5">RESET COMPLETED SUCCESS</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-500 leading-relaxed font-sans">
              您的學習軌跡已順利清空重置。現在一切數據已歸零，您將從 <strong>LV.1 探險家</strong> 重新出發探險學習！
            </p>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetSuccess(false)}
                className="px-6 py-2.5 bg-slate-950 hover:bg-slate-850 text-white text-[10px] font-black uppercase tracking-widest cursor-pointer"
              >
                好的，出發！
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

