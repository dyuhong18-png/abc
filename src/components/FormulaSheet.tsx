import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const FORMULA_DATA: Record<string, { title: string, formulas: { label: string, math: string }[] }> = {
  '基礎代數': {
    title: '代數核心公式',
    formulas: [
      { label: '二次方程求根公式', math: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
      { label: '平方差公式', math: 'a^2 - b^2 = (a-b)(a+b)' },
      { label: '完全平方公式', math: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2' }
    ]
  },
  '平面幾何': {
    title: '幾何基礎幾何',
    formulas: [
      { label: '畢氏定理', math: 'a^2 + b^2 = c^2' },
      { label: '圓面積', math: 'A = \\pi r^2' },
      { label: '三角形面積', math: 'A = \\frac{1}{2}bh' }
    ]
  },
  '三角函數': {
    title: '三角恆等式',
    formulas: [
      { label: '畢氏恆等式', math: '\\sin^2 \\theta + \\cos^2 \\theta = 1' },
      { label: '正弦定理', math: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}' },
      { label: '倍角公式', math: '\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta' }
    ]
  }
};

export function FormulaSheet({ topic, isOpen, onClose }: { topic: string, isOpen: boolean, onClose: () => void }) {
  const data = FORMULA_DATA[topic] || FORMULA_DATA['基礎代數'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-6 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="w-full max-w-sm bg-white border border-slate-200 shadow-2xl p-8 pointer-events-auto h-full flex flex-col"
          >
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">公式參考手冊</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-slate-100 transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-10 custom-scrollbar pr-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">當前主題</span>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">{data.title}</h4>
              </div>

              <div className="space-y-8">
                {data.formulas.map((f, i) => (
                  <div key={i} className="group">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 group-hover:text-indigo-600 transition-colors">
                      {f.label}
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 overflow-x-auto">
                      <BlockMath math={f.math} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 italic text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              The language of the universe.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
