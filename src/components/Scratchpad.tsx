import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, Trash2, Minus, Undo, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function Scratchpad() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#3b82f6'); // Cool blue/indigo as default pen
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [history, setHistory] = useState<string[]>([]); // To save snapshots for undo

  // Run on mount and handle resizing robustly using ResizeObserver on the parent container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      if (width === 0 || height === 0) return;

      // Save existing drawing as image data before resize to prevent blanking
      const backup = canvas.toDataURL();

      // Set internal resolution matching logical layout
      canvas.width = width;
      canvas.height = height;

      // Restore line style settings
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Reload backup image
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = backup;
      }
    });

    resizeObserver.observe(parent);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Save current whiteboard state to undo history
  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      setHistory((prev) => [...prev, dataUrl].slice(-10)); // Keep last 10 snapshots
    }
  };

  // Undo last path action
  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextHistory = [...history];
    const prevSnapshot = nextHistory.pop(); // Remove current newest
    setHistory(nextHistory);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (prevSnapshot) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = prevSnapshot;
    }
  };

  // Triggered when client coordinates initiate drawing
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // Draw controls
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent default scrolling on mobile views while drawing
    if ('touches' in e) {
      e.preventDefault();
    }
    
    saveSnapshot(); // Save snapshot before drawing a new line
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    // Apply active brush tool configurations with automatic contrast adjustment for dark mode
    const isDark = !!document.querySelector('.dark');
    const drawingColor = (color === '#1E293B' || color === '#1e293b') && isDark ? '#f8fafc' : color;
    ctx.strokeStyle = isEraser ? (isDark ? '#090D16' : '#ffffff') : drawingColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Slightly draw a point on instant tap
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if ('touches' in e) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    saveSnapshot();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Charcoal', value: '#1e293b' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#8b5cf6' },
  ];

  return (
    <div 
      ref={containerRef}
      className={cn(
        "bg-white border-2 transition-all duration-300 flex flex-col relative overflow-hidden",
        isMinimized 
          ? "border-slate-200 h-14" 
          : isLarge
            ? "border-indigo-600 shadow-xl shadow-indigo-100/40 h-[760px]"
            : "border-indigo-600 shadow-xl shadow-indigo-100/40 h-[560px]"
      )}
      id="scratchpad-widget"
    >
      {/* Scratchpad Header Bar */}
      <div className="flex justify-between items-center px-4 py-3.5 bg-slate-50 border-b border-light-200 select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
            計
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-800 font-sans">
            隨身幾何計算紙 (Scratchpad)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isMinimized && (
            <button
              type="button"
              onClick={() => setIsLarge(!isLarge)}
              className="px-2 py-1 text-[9px] font-black uppercase tracking-wider text-indigo-650 border border-indigo-200 bg-white hover:bg-indigo-50 hover:text-indigo-850 rounded-none transition-colors cursor-pointer mr-2 flex items-center gap-1"
              title={isLarge ? "切換至標準尺寸 (560px)" : "切換至加大尺寸 (760px)"}
            >
              📐 {isLarge ? "標準尺寸" : "放大版面"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            title={isMinimized ? "主動展開計算紙" : "摺疊收納計算紙"}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Quick Toolbar */}
          <div className="px-4 py-2.5 bg-slate-50/65 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Color Select & Pen Tools */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEraser(false)}
                  className={cn(
                    "p-1.5 text-xs font-semibold cursor-pointer transition-colors",
                    !isEraser ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"
                  )}
                  title="畫筆模式 (Pen Mode)"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEraser(true)}
                  className={cn(
                    "p-1.5 text-xs font-semibold cursor-pointer transition-colors",
                    isEraser ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"
                  )}
                  title="橡皮擦模式 (Eraser Mode)"
                >
                  <Eraser className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Color list wrapper - disabled when eraser is active */}
              {!isEraser && (
                <div className="flex items-center gap-1">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={cn(
                        "w-5 h-5 transition-all outline-none border cursor-pointer shrink-0",
                        color === c.value 
                          ? "scale-110 border-indigo-600 ring-2 ring-indigo-100" 
                          : "border-slate-200 hover:scale-105"
                      )}
                      style={{ backgroundColor: c.value }}
                      title={`畫筆顏色: ${c.name}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Brush brushSize & utilities */}
            <div className="flex items-center gap-3">
              {/* Brush size adjust */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400">線寬</span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-16 h-1 bg-slate-200 accent-indigo-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] font-mono font-bold text-slate-600 w-4">{brushSize}px</span>
              </div>

              {/* Clear / Undo actions */}
              <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className={cn(
                    "p-1.5 border border-slate-200 bg-white transition-colors cursor-pointer",
                    history.length > 0 ? "text-slate-700 hover:bg-slate-100" : "text-slate-300 cursor-not-allowed"
                  )}
                  title="還原上一步 (Undo)"
                >
                  <Undo className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="p-1.5 border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="清除全部筆跡 (Clear)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Real Math Grid Canvas Backed Area */}
          <div className="flex-1 relative min-h-0 overflow-hidden cursor-crosshair bg-white">
            {/* SVG Grid Pattern Background for nice mathematical graphing paper feel */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] select-none">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4f46e5" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridPattern)" />
              </svg>
            </div>

            {/* The Actual Core Canvas Rendering Frame */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full block touch-none z-10"
            />
            
            {/* Soft Tip Watermark */}
            <span className="absolute bottom-3 right-4 font-mono text-[9px] text-slate-300 font-bold select-none pointer-events-none z-0">
              * 支援滑鼠草稿與觸控板手寫運算
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
