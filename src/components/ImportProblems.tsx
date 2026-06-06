import React, { useState, useEffect } from 'react';
import { getCustomProblems, importProblems, deleteCustomProblem, Problem } from '../services/gemini';
import { Upload, Trash2, CheckCircle, Database, HelpCircle, FileJson, AlertCircle, Eye } from 'lucide-react';
import { MathText } from './MathRenderer';

const TOPICS = ['基礎代數', '平面幾何', '三角函數', '向量單元', '微積分初步', '統計與機率', '邏輯推理'];

const DEMO_PROBLEMS = [
  {
    question: "已知 $f(x) = ax^2 + bx + c$ 滿足 $f(1) = 6$, $f'(1) = 5$，與定積分 $\\int_{0}^{1} f(x) \\, dx = 4$。求數對 $(a, b, c)$ 的乘積 $a \\times b \\times c$。",
    options: ["-12", "12", "-15", "15"],
    answer: 0,
    explanation: "由導函數 $f'(x)=2ax+b \\implies 2a+b=5$。已知 $f(1)=a+b+c=6$。定積分 $\\int_0^1 f(x)dx = \\frac{a}{3}+\\frac{b}{2}+c=4$。聯立三式解得 $a=3, b=-1, c=4$，乘積為 $3 \\times (-1) \\times 4 = -12$。"
  },
  {
    question: "在 $\\triangle ABC$ 中，若三邊長滿足 $a^2 + b^2 - c^2 = -ab$，求最大內角 $\\angle C$ 的弧度值或度數。",
    options: ["$60^\\circ$", "$120^\\circ$", "$135^\\circ$", "$150^\\circ$"],
    answer: 1,
    explanation: "根據餘弦定理：$c^2 = a^2 + b^2 - 2ab \\cos C \\implies a^2 + b^2 - c^2 = 2ab \\cos C$。由題意得 $2ab \\cos C = -ab \\implies \\cos C = -\\frac{1}{2}$。因為 $C$ 為三角形內角，故 $\\angle C = 120^\\circ$。"
  },
  {
    question: "已知兩個二維向量 $\\vec{u} = (2 \\cos \\theta, 2 \\sin \\theta)$ 與 $\\vec{v} = (3 \\sin \\theta, -3 \\cos \\theta)$，求它們的內積值 $\\vec{u} \\cdot \\vec{v}$。",
    options: ["$0$", "$6$", "$-6$", "$6 \\sin(2\\theta)$"],
    answer: 0,
    explanation: "內積公式為 $x_1 x_2 + y_1 y_2$。代入計算得 $\\vec{u} \\cdot \\vec{v} = (2 \\cos \\theta)(3 \\sin \\theta) + (2 \\sin \\theta)(-3 \\cos \\theta) = 6 \\cos \\theta \\sin \\theta - 6 \\sin \\theta \\cos \\theta = 0$。兩向量在任何 $\\theta$ 下皆正交。"
  }
];

export function ImportProblems() {
  const [activeTopic, setActiveTopic] = useState(TOPICS[0]);
  const [jsonText, setJsonText] = useState("");
  const [debouncedJsonText, setDebouncedJsonText] = useState("");
  const [importedData, setImportedData] = useState<Record<string, Problem[]>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showStoredProblems, setShowStoredProblems] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [topicVisibleLimits, setTopicVisibleLimits] = useState<Record<string, number>>({});
  const [deleteCandidate, setDeleteCandidate] = useState<{ topic: string; id: number } | null>(null);

  // Debounce JSON text for preview so typing is 100% fluid
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedJsonText(jsonText);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [jsonText]);

  // Load custom problems on component mount
  const refreshList = async () => {
    const list = await getCustomProblems();
    setImportedData(list || {});
  };

  useEffect(() => {
    refreshList();
  }, []);

  const totalCustomCount = Object.values(importedData).reduce((acc, curr) => acc + curr.length, 0);

  const toggleTopicExpand = (topic: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  const handleImport = async () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    if (!jsonText.trim()) {
      setErrorMsg("請輸入有效的 JSON 格式題目資料。");
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setErrorMsg("輸入內容必須為 JSON 陣列 (包含多個題目物件)。");
        return;
      }

      // Basic schema verification
      for (const p of parsed) {
        if (!p.question || !Array.isArray(p.options) || p.options.length !== 4 || typeof p.answer !== 'number' || !p.explanation) {
          setErrorMsg("每道題目必須包含：question (字串)、options (4 個選項的陣列)、answer (0-3 索引數值)、explanation (字串) 屬性。");
          return;
        }
      }

      setLoading(true);
      const res = await importProblems(activeTopic, parsed);
      if (res.success) {
        setSuccessMsg(`成功導入 ${res.count} 題數學問題至【${activeTopic}】後端資料庫！`);
        setJsonText("");
        refreshList();
      } else {
        setErrorMsg("後端儲存失敗，請檢查伺服器連線。");
      }
    } catch (e: any) {
      setErrorMsg(`JSON 解析錯誤：${e.message || String(e)}。請確認逗號與雙引號格式正確。`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (topic: string, id: number) => {
    setDeleteCandidate({ topic, id });
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const { topic, id } = deleteCandidate;
    const res = await deleteCustomProblem(topic, id);
    if (res.success) {
      refreshList();
    }
    setDeleteCandidate(null);
  };

  const loadDemo = () => {
    setJsonText(JSON.stringify(DEMO_PROBLEMS, null, 2));
    setSuccessMsg("已帶入範本！您可以直接點擊下方的「寫入後端儲存」進行測試。");
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Database className="w-8 h-8 text-indigo-600" /> 後端資料庫導入與管理
          </h2>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Backend JSON Math Database Administration</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={loadDemo}
            className="px-5 py-3 border border-slate-300 text-[10px] font-black uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
          >
            ⚡ 帶入 LaTeX 範本
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 p-8">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-6 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" /> 批量題目寫入
            </h4>

            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border-l-4 border-l-rose-500 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-l-emerald-500 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-pulse">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">目標學習單元</label>
                <select 
                  value={activeTopic}
                  onChange={(e) => setActiveTopic(e.target.value)}
                  className="w-full h-11 border border-slate-200 px-4 text-sm font-semibold rounded-none bg-white focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  {TOPICS.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <FileJson className="w-3.5 h-3.5 text-slate-400" /> 題目 JSON 資料組 (Array 格式)
                  </label>
                  <button 
                    onClick={() => setPreviewOpen(!previewOpen)}
                    className="text-[10px] font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1 hover:underline"
                  >
                    <Eye className="w-3 h-3" /> {previewOpen ? "隱藏公式即時預覽" : "開啟公式即時預覽"}
                  </button>
                </div>
                <textarea 
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder={`請參照以下結構貼上或是點選右上角 [⚡ 帶入 LaTeX 範本]：\n[\n  {\n    "question": "已知 $x + \\\\frac{1}{x} = 4$，求 $x^2 + \\\\frac{1}{x^2}$ 的值。",\n    "options": ["12", "14", "16", "18"],\n    "answer": 1,\n    "explanation": "兩邊平方得 $x^2 + 2 + \\\\frac{1}{x^2} = 16 \\\\implies x^2 + \\\\frac{1}{x^2} = 14$。"\n  }\n]`}
                  className="w-full h-64 border border-slate-200 p-5 font-mono text-xs text-slate-700 leading-relaxed bg-slate-50/50 rounded-none focus:outline-none focus:border-indigo-600"
                />
              </div>

              {previewOpen && jsonText.trim() && (
                <div className="p-6 bg-slate-100/80 border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">公式渲染預覽 (Live Math Preview)</h5>
                    {jsonText !== debouncedJsonText && (
                      <span className="text-[9px] font-semibold text-amber-600 animate-pulse">正在渲染公式中...</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    {(() => {
                      try {
                        if (!debouncedJsonText.trim()) {
                          return <div className="text-xs text-slate-500 font-medium">請繼續輸入以產生預覽...</div>;
                        }
                        const parsed = JSON.parse(debouncedJsonText);
                        if (!Array.isArray(parsed)) return <div className="text-xs text-rose-500 font-medium">資料必須為陣列 []</div>;
                        
                        const maxPreview = 4;
                        const previewSlice = parsed.slice(0, maxPreview);
                        const restCount = parsed.length - maxPreview;
                        
                        return (
                          <div className="flex flex-col gap-4">
                            {previewSlice.map((p, idx) => (
                              <div key={idx} className="bg-white border border-slate-200 p-4 shrink-0">
                                <div className="text-[10px] font-mono font-bold text-indigo-600 mb-1">PREVIEW Q{idx+1}</div>
                                <div className="prose prose-slate max-w-none text-xs text-slate-800 mb-2 font-medium">
                                  <MathText>{p.question || ""}</MathText>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  {Array.isArray(p.options) && p.options.map((o: string, index: number) => (
                                    <div key={index} className={`p-2 border text-[11px] font-semibold text-slate-600 ${index === p.answer ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-150'}`}>
                                      {String.fromCharCode(65 + index)}. <MathText>{o}</MathText>
                                    </div>
                                  ))}
                                </div>
                                {p.explanation && (
                                  <div className="p-3 bg-indigo-50/50 border-l-2 border-l-indigo-500 text-[11px] text-slate-700">
                                    <span className="font-bold text-indigo-900 block mb-1">解析與推導：</span>
                                    <MathText>{p.explanation}</MathText>
                                  </div>
                                )}
                              </div>
                            ))}
                            {restCount > 0 && (
                              <div className="p-4 bg-amber-50/50 border border-dashed border-amber-200 text-center text-amber-800 text-[11px] font-bold">
                                💡 系統已自動收合其餘 {restCount} 題的 LaTeX 即時預覽，以維持打字編輯的絕對順暢。點選下方寫入後，即可完整瀏覽所有題目。
                              </div>
                            )}
                          </div>
                        );
                      } catch {
                        return <div className="text-xs text-amber-600 font-semibold">正在等待完整、合法的 JSON 輸入以渲染 LaTeX...</div>;
                      }
                    })()}
                  </div>
                </div>
              )}

              <button 
                onClick={handleImport}
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? "正在儲存至後端..." : "寫入後端 SQL/JSON 儲存器 Save to DB"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 text-white p-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> LaTeX 與 JSON 寫入規範
            </h4>
            <ul className="space-y-4 text-xs font-medium text-slate-300 leading-relaxed list-disc list-inside">
              <li>題目與解析必須使用繁體中文，且使用 <strong>LaTeX 數學公式符號</strong> 撰寫。</li>
              <li>公式在行內請使用單錢符號，例如 <code>$x^2 + y = 3$</code>。</li>
              <li>公式在行間請使用雙錢符號，例如 <code>$$\int_0^1 f(x) \, dx$$</code>。</li>
              <li>
                由於 JSON 格式字串需要逸出 (Escape) 特殊字元，公式內的斜線符號
                <code className="bg-slate-800 text-indigo-300 px-1 mx-1">\</code> 必須雙寫為 
                <code className="bg-slate-800 text-indigo-400 px-1 ml-1 font-bold">\\</code>，例：
                <code>\\frac{'\{'}1{'\}'}{'\{'}2{'\}'}</code> 或 <code>\\pm</code>。
              </li>
              <li><code>options</code> 陣列必須包含恰好 4 個元素。</li>
              <li><code>answer</code> 是從 0 到 3 之間代表正確選項的索引（0 代表 A, 1 代表 B...）。</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Backend Databases Status Panel */}
      <div className="bg-white border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" /> 目前已成功留存在後端的自訂題庫
            </h4>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">Backend custom problem storage status</p>
          </div>
          <button
            onClick={() => setShowStoredProblems(!showStoredProblems)}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider border border-indigo-100 transition-colors cursor-pointer"
          >
            {showStoredProblems ? "收起自訂題庫 ▲" : `展開自訂題庫 (共 ${totalCustomCount} 題) ▼`}
          </button>
        </div>
        
        {showStoredProblems ? (
          <div className="flex flex-col gap-6">
            {TOPICS.map(topic => {
              const list = importedData[topic] || [];
              const isExpanded = !!expandedTopics[topic];
              const visibleLimit = topicVisibleLimits[topic] || 4;
              const slicedList = list.slice(0, visibleLimit);
              
              return (
                <div key={topic} className="border border-slate-200 bg-slate-50/20">
                  {/* Topic Accordion Header */}
                  <button
                    onClick={() => toggleTopicExpand(topic)}
                    className="w-full text-left px-6 py-4 bg-white hover:bg-slate-50 border-b border-slate-100 flex justify-between items-center transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-indigo-600 group-hover:text-indigo-800">{topic}</span>
                      <span className="bg-slate-100 text-[10px] font-bold font-mono text-slate-500 px-2.5 py-0.5 uppercase">
                        自訂庫存：{list.length} 題
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                      {list.length === 0 ? (
                        <span className="text-slate-300">暫無題目</span>
                      ) : isExpanded ? (
                        "收起題目 ▲"
                      ) : (
                        "展開題目 👁️ ▼"
                      )}
                    </span>
                  </button>

                  {/* Topic Accordion Content (Only render LaTeX if expanded for optimal performance) */}
                  {isExpanded && list.length > 0 && (
                    <div className="p-6 bg-slate-50/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {slicedList.map((p, index) => (
                          <div key={p.id} className="bg-white border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                              <div className="flex justify-between items-start gap-4 mb-3">
                                <span className="bg-slate-100 text-[10px] font-bold text-slate-600 font-mono px-2 py-0.5">ID: {p.id}</span>
                                <button 
                                  onClick={() => handleDelete(topic, p.id)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="從後端刪除題目"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="prose prose-slate max-w-none text-xs text-slate-800 font-semibold mb-3">
                                <MathText>{p.question}</MathText>
                              </div>
                              <div className="space-y-1 mb-3">
                                {p.options.map((opt, oIdx) => (
                                  <div key={oIdx} className={`text-[11px] px-2.5 py-1 ${oIdx === p.answer ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'text-slate-500 font-medium'}`}>
                                    {String.fromCharCode(65 + oIdx)}. <MathText>{opt}</MathText>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                              <span className="font-bold text-indigo-900 block mb-1">解析邏輯：</span>
                              <MathText>{p.explanation}</MathText>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Progressive 'Load More' button if there are more problems left in this topic */}
                      {list.length > visibleLimit && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={() => setTopicVisibleLimits(prev => ({
                              ...prev,
                              [topic]: visibleLimit + 10
                            }))}
                            className="px-6 py-2.5 border border-indigo-200 bg-white hover:bg-slate-50 text-indigo-700 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            🔎 載入更多本單元題目 (剩餘 {list.length - visibleLimit} 題) ...
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {Object.values(importedData).every(arr => arr.length === 0) && (
              <div className="py-8 text-center text-xs font-medium text-slate-400 bg-slate-50/50 border border-dashed border-slate-200">
                目前暫無自訂題目。點選右上角 [⚡ 帶入 LaTeX 範本] 以試用導入功能並儲存。
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-slate-200 bg-slate-50/50">
            <p className="text-xs font-semibold text-slate-500">已自動收合後端自訂題庫，以避開大量 LaTeX 渲染導致的瀏覽器卡頓。</p>
            <button
              onClick={() => setShowStoredProblems(true)}
              className="mt-3 px-4 py-2 border border-indigo-200 text-indigo-700 text-xs font-black hover:bg-indigo-50 transition-colors bg-white cursor-pointer"
            >
              🔎 點此展開詳細題庫清單 (共 {totalCustomCount} 題)
            </button>
          </div>
        )}
      </div>

      {/* ⚠️ Custom Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="w-full max-w-md bg-white border-2 border-rose-500 shadow-2xl p-8 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-rose-50 flex items-center justify-center rounded-none shrink-0">
                <AlertCircle className="w-6 h-6 text-rose-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">確定要刪除此題嗎？</h3>
                <p className="text-[10px] font-mono text-rose-600 uppercase tracking-widest font-bold mt-0.5">DELETE QUESTION DATABASE WARNING</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-500 leading-relaxed font-sans">
              此操作將會從【{deleteCandidate.topic}】單元的自訂題庫中<strong>永久刪除</strong>本道數學題目 (ID: {deleteCandidate.id})，且操作將無法還原。
            </p>

            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-black text-slate-700 uppercase tracking-widest cursor-pointer"
              >
                取消 Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest cursor-pointer"
              >
                🗑️ 確定刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
