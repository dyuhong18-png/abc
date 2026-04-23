import React, { useState, useEffect } from 'react';
import { Send, User, Bot, Loader2, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { askMathTutor } from '../services/gemini';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useLearning } from '../context/LearningContext';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function MathTutor() {
  const { activeTopic } = useLearning();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `你好！我是你的 AI 數學導師。目前我們正在探討「${activeTopic}」，有什麼問題想聊聊嗎？` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Update initial message when topic changes
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{ role: 'model', content: `好的，切換到「${activeTopic}」。讓我們開始吧！有什麼這方面的難題嗎？` }]);
    }
  }, [activeTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      // Pass activeTopic to tutor for context
      const contextualPrompt = `(當前討論主題：${activeTopic}) ${userMessage}`;
      const response = await askMathTutor(contextualPrompt, history);
      if (response) {
        setMessages(prev => [...prev, { role: 'model', content: response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: '抱歉，我現在遇到一點困難，請稍後再試。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-white border border-slate-200 shadow-none overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold text-sm uppercase tracking-widest">AI 導師系統</h2>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'model', content: '你好！我是你的 AI 數學導師。有什麼數學問題想討論嗎？' }])}
          className="p-1 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
          title="清除對話"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[90%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-8 h-8 flex items-center justify-center",
                m.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-indigo-100 text-indigo-600"
              )}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-4 border text-sm leading-relaxed",
                m.role === 'user' 
                  ? "bg-indigo-600 text-white border-indigo-700" 
                  : "bg-white text-slate-800 border-slate-200"
              )}>
                <div className="markdown-body prose prose-sm max-w-none prose-slate">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-4 mr-auto max-w-[90%]">
            <div className="w-8 h-8 bg-indigo-50 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            </div>
            <div className="bg-white p-4 border border-slate-200 text-slate-400 text-xs font-mono uppercase tracking-widest italic">
              Processing logic...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 flex gap-4 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入你的數學問題..."
          className="flex-1 px-4 py-2 border-b border-slate-200 focus:border-indigo-600 transition-colors outline-none bg-transparent text-sm font-medium"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-30"
        >
          發送
        </button>
      </form>
    </div>
  );
}
