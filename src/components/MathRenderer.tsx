import React, { useMemo } from 'react';
import katexDefault from 'katex';
import * as katexNamespace from 'katex';

interface MathProps {
  math?: string;
  children?: string;
}

// Safely resolve the correct KaTeX module containing the renderToString function
const getKatex = (): any => {
  if (typeof window !== 'undefined' && (window as any).katex && typeof (window as any).katex.renderToString === 'function') {
    return (window as any).katex;
  }
  if (katexDefault && typeof (katexDefault as any).renderToString === 'function') {
    return katexDefault;
  }
  if (typeof (katexDefault as any)?.default?.renderToString === 'function') {
    return (katexDefault as any).default;
  }
  if (katexNamespace && typeof (katexNamespace as any).renderToString === 'function') {
    return katexNamespace;
  }
  if (typeof (katexNamespace as any)?.default?.renderToString === 'function') {
    return (katexNamespace as any).default;
  }
  return null;
};

export function InlineMath({ math, children }: MathProps) {
  const formula = math || children || '';
  const html = useMemo(() => {
    try {
      const k = getKatex();
      if (!k || typeof k.renderToString !== 'function') {
        throw new Error("KaTeX renderToString is not available in resolved modules");
      }
      return k.renderToString(formula, {
        displayMode: false,
        throwOnError: false,
      });
    } catch (e) {
      console.warn("InlineMath rendering failed, falling back to raw text:", e);
      // Fallback directly to text so formulas are ALWAYS visible
      return `<span class="raw-math px-1 py-0.5 font-mono text-slate-700 bg-slate-50 border border-slate-200/60 rounded text-xs select-all">${formula}</span>`;
    }
  }, [formula]);

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function BlockMath({ math, children }: MathProps) {
  const formula = math || children || '';
  const html = useMemo(() => {
    try {
      const k = getKatex();
      if (!k || typeof k.renderToString !== 'function') {
        throw new Error("KaTeX renderToString is not available in resolved modules");
      }
      return k.renderToString(formula, {
        displayMode: true,
        throwOnError: false,
      });
    } catch (e) {
      console.warn("BlockMath rendering failed, falling back to raw text:", e);
      // Fallback directly to div so formulas are ALWAYS visible
      return `<div class="raw-math block text-center my-2 font-mono text-xs text-indigo-700 bg-slate-50 border border-slate-100 p-3 select-all">${formula}</div>`;
    }
  }, [formula]);

  return <div className="katex-block-container overflow-x-auto my-2 block" dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * MathText parses strings with $...$ (inline math) and $$...$$ (block math) 
 * and outputs standard HTML with KaTeX inline and block formula components.
 * Extremely robust fallback in React 19.
 */
export function MathText({ children }: { children: string }) {
  if (!children) return null;

  const parts = useMemo(() => {
    const rawParts: { text: string; isMath: boolean; isBlock: boolean }[] = [];
    
    // Split by $$ first for block equations
    const blockSplit = children.split(/\$\$/g);
    blockSplit.forEach((blockPart, blockIdx) => {
      const isBlk = blockIdx % 2 !== 0;
      
      if (isBlk) {
        rawParts.push({ text: blockPart, isMath: true, isBlock: true });
      } else {
        // Split by $ for inline math
        const inlineSplit = blockPart.split(/\$/g);
        inlineSplit.forEach((inlinePart, inlineIdx) => {
          const isInl = inlineIdx % 2 !== 0;
          rawParts.push({
            text: inlinePart,
            isMath: isInl,
            isBlock: false
          });
        });
      }
    });
    
    return rawParts;
  }, [children]);

  return (
    <>
      {parts.map((p, idx) => {
        if (!p.text) return null;
        if (p.isMath) {
          if (p.isBlock) {
            return <BlockMath key={idx} math={p.text} />;
          }
          return <InlineMath key={idx} math={p.text} />;
        }
        return <span key={idx}>{p.text}</span>;
      })}
    </>
  );
}
