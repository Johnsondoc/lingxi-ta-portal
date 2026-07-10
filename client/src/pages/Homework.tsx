import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CLASSES = ["AMC 8 基础班", "AMC 8 强化班", "AMC 10 冲刺班"];
const LESSONS = [
  "第4课 · 代数方程组（作业）",
  "第3课 · 几何基础（作业）",
  "第2课 · 数论入门（作业）",
];

const STUDENTS = [
  { id: 1, name: "李明远", avatar: "李", status: "done", score: "28/36" },
  { id: 2, name: "张晓宇", avatar: "张", status: "done", score: "22/36" },
  { id: 3, name: "王思远", avatar: "王", status: "done", score: "31/36" },
  { id: 4, name: "陈雨欣", avatar: "陈", status: "done", score: "33/36" },
  { id: 5, name: "刘子豪", avatar: "刘", status: "done", score: "26/36" },
  { id: 6, name: "赵梦琪", avatar: "赵", status: "pending", score: null },
  { id: 7, name: "孙浩然", avatar: "孙", status: "pending", score: null },
  { id: 8, name: "周佳怡", avatar: "周", status: "pending", score: null },
  { id: 9, name: "吴宇轩", avatar: "吴", status: "pending", score: null },
  { id: 10, name: "郑思琦", avatar: "郑", status: "pending", score: null },
  { id: 11, name: "冯晨曦", avatar: "冯", status: "pending", score: null },
  { id: 12, name: "蒋雪儿", avatar: "蒋", status: "pending", score: null },
  { id: 13, name: "韩志远", avatar: "韩", status: "pending", score: null },
  { id: 14, name: "杨梦瑶", avatar: "杨", status: "pending", score: null },
  { id: 15, name: "谢天宇", avatar: "谢", status: "pending", score: null },
  { id: 16, name: "林晓彤", avatar: "林", status: "absent", score: null },
  { id: 17, name: "徐嘉琪", avatar: "徐", status: "absent", score: null },
  { id: 18, name: "曹宇航", avatar: "曹", status: "absent", score: null },
];

const ERROR_TYPES = [
  { key: "knowledge", label: "📚 知识点问题" },
  { key: "careless", label: "✏ 粗心问题" },
  { key: "logic", label: "🔗 推导逻辑问题" },
  { key: "calc", label: "🔢 运算失误" },
  { key: "format", label: "📝 书写不规范" },
  { key: "incomplete", label: "⏸ 解题不完整" },
];

const KP_TAGS_Q3 = ["代数-方程组", "消元法", "代入消元法", "加减消元法", "方程验证", "线性方程组", "整式运算", "解题步骤规范"];
const KP_TAGS_Q4 = ["数论-整数", "韦达定理", "因式分解", "二次方程", "判别式", "整数分解", "逆向思维", "验算方法"];
const AI_Q3 = "<strong>解题过程识别：</strong>学生使用了代入法，步骤基本正确。<br/><strong>问题点：</strong>验证步骤缺失。<br/><strong>建议评分：</strong>过程分 9/10，验证分 0/2，建议总分 9/12。<br/><strong>批注建议：</strong>在验证步骤处标注需补充验证。";
const AI_Q4 = "<strong>解题过程识别：</strong>学生使用韦达定理，解题思路正确，验证完整。<br/><strong>建议评分：</strong>12/12。";

// ─── Canvas Hook ──────────────────────────────────────────────────────────────
function useCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const history = useRef<ImageData[]>([]);
  const [color, setColorState] = useState("#ef4444");
  const [tool, setToolState] = useState<"pen" | "eraser" | "line">("pen");
  const [brushSize, setBrushSizeState] = useState(3);
  const lineStart = useRef<{ x: number; y: number } | null>(null);
  const snapshot = useRef<ImageData | null>(null);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const syncSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wrap = canvas.parentElement;
    if (!wrap) return;
    const w = wrap.offsetWidth;
    const h = wrap.offsetHeight;
    if (canvas.width !== w || canvas.height !== h) {
      const ctx = canvas.getContext("2d");
      const saved = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = w;
      canvas.height = h;
      if (saved) ctx?.putImageData(saved, 0, 0);
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    syncSize();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    const pos = getPos(e);
    lastPos.current = pos;
    history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (tool === "line") {
      lineStart.current = pos;
      snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    if (tool === "line") {
      if (!lineStart.current || !snapshot.current) return;
      ctx.putImageData(snapshot.current, 0, 0);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.moveTo(lineStart.current.x, lineStart.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = tool === "eraser" ? brushSize * 4 : brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (lastPos.current) ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
      lastPos.current = pos;
    }
  };

  const onPointerUp = () => { drawing.current = false; lineStart.current = null; };
  const onPointerLeave = () => { drawing.current = false; };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prev = history.current.pop();
    if (prev) ctx.putImageData(prev, 0, 0);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return {
    color, setColor: setColorState,
    tool, setTool: setToolState,
    brushSize, setBrushSize: setBrushSizeState,
    onPointerDown, onPointerMove, onPointerUp, onPointerLeave,
    undo, clear,
  };
}

// ─── Canvas Toolbar ───────────────────────────────────────────────────────────
function CanvasToolbar({ ctrl, label, qNum }: {
  ctrl: ReturnType<typeof useCanvas>;
  label: string;
  qNum: string;
}) {
  const COLORS = ["#ef4444", "#3b82f6", "#16a34a", "#f59e0b", "#1e293b"];
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-t-lg" style={{ background: "#1e293b" }}>
      <span className="text-xs font-medium text-white/90">📷 AI 切片（题目区 + 答题区）</span>
      <span className="text-xs text-white/40">{qNum}</span>
      <div className="flex-1" />
      {/* Tools */}
      {(["pen", "eraser", "line"] as const).map((t, i) => (
        <button
          key={t}
          onClick={() => ctrl.setTool(t)}
          className={`w-7 h-7 rounded text-sm flex items-center justify-center transition-colors ${ctrl.tool === t ? "bg-white/25" : "hover:bg-white/10"} text-white`}
        >
          {["✏️", "⬜", "╯"][i]}
        </button>
      ))}
      <div className="w-px h-4 bg-white/20 mx-1" />
      {/* Colors */}
      {COLORS.map(c => (
        <button
          key={c}
          onClick={() => ctrl.setColor(c)}
          className={`w-5 h-5 rounded-full border-2 transition-transform ${ctrl.color === c ? "border-white scale-110" : "border-transparent"}`}
          style={{ background: c }}
        />
      ))}
      <div className="w-px h-4 bg-white/20 mx-1" />
      <span className="text-xs text-white/60">粗细</span>
      <input
        type="range" min={1} max={20} value={ctrl.brushSize}
        onChange={e => ctrl.setBrushSize(Number(e.target.value))}
        className="w-16 accent-white"
      />
      <span className="text-xs text-white/60 w-4">{ctrl.brushSize}</span>
      <div className="w-px h-4 bg-white/20 mx-1" />
      <button onClick={ctrl.undo} className="w-7 h-7 rounded text-white hover:bg-white/10 text-sm">↩</button>
      <button onClick={ctrl.clear} className="w-7 h-7 rounded text-white hover:bg-white/10 text-sm">🗑</button>
      <button onClick={() => toast.success("批注已保存")} className="w-7 h-7 rounded text-white hover:bg-white/15 text-sm" style={{ background: "rgba(255,255,255,0.12)" }}>💾</button>
      <div className="w-px h-4 bg-white/20 mx-1" />
      <button onClick={() => toast.info("原图查看功能（Demo）")} className="text-xs text-white hover:bg-white/10 px-2 h-7 rounded">🔍原图</button>
      <button onClick={() => toast.info("上传功能（Demo）")} className="text-xs text-white hover:bg-white/10 px-2 h-7 rounded">📤上传</button>
    </div>
  );
}

// ─── Question Card: Multiple Choice ──────────────────────────────────────────
function MCQuestion({ num, color, title, question, options, correct, studentPick, aiConfidence, isWrong, aiAnalysis, aiTags }: {
  num: number; color: string; title: string; question: string;
  options: { letter: string; text: string }[];
  correct: string; studentPick: string; aiConfidence: number;
  isWrong: boolean; aiAnalysis?: string; aiTags?: string[];
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: color }}>{num}</div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-800">{title}</div>
          <div className="text-xs text-gray-400">满分 6 分 · 系统已自动判断</div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isWrong ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {isWrong ? "✗ 回答错误" : "✓ 已自动批改"}
        </span>
        <span className={`text-sm font-semibold ${isWrong ? "text-red-500" : "text-blue-600"}`}>{isWrong ? "0/6" : "6/6"}</span>
      </div>
      {/* Body */}
      <div className="p-4 space-y-3">
        {/* 题目 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">📋 题目</div>
          <p className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: question }} />
        </div>
        {/* 切片 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-600">📷 AI 切片（含题目区 + 答题区）</span>
            <span className="text-xs text-gray-400">Q{num} · 第{num}题</span>
            <button onClick={() => toast.info("原照片查看（Demo）")} className="ml-auto text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded px-2 py-0.5">🔍 查看原照片</button>
          </div>
          <div className="bg-amber-50 font-serif relative">
            <div className="bg-sky-50 border-b border-dashed border-sky-200 px-4 py-2">
              <span className="text-xs font-semibold text-sky-600 block mb-1">[ 题目区 ]</span>
              <span className="text-sm text-slate-800" dangerouslySetInnerHTML={{ __html: question.replace(/<em>/g, '<i>').replace(/<\/em>/g, '</i>') }} />
            </div>
            <div className="px-4 py-3 min-h-[70px]">
              <span className="text-xs font-semibold text-amber-800 block mb-2">[ 答题区 ]</span>
              <div className="text-base text-slate-800 leading-loose">
                <span className={`inline-block border-2 rounded-full px-1.5 mr-1 font-bold ${isWrong ? "border-red-400 text-red-500" : "border-blue-400 text-blue-500"}`}>{studentPick}</span>
                学生圈选答案：<strong className={isWrong ? "text-red-500" : ""}>{studentPick} {isWrong ? "← 错误" : ""}</strong>
                <br /><span className="text-xs text-gray-500">AI 识别置信度: {aiConfidence}%{isWrong ? ` · 正确答案应为 ${correct}` : ""}</span>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "repeating-linear-gradient(transparent,transparent 31px,#e8e4d0 31px,#e8e4d0 32px)" }} />
          </div>
          <div className="text-xs text-gray-400 px-3 py-1.5 bg-gray-50 border-t border-gray-100">💡 切片包含完整题目文字与学生答题区域，防止裁切错位</div>
        </div>
        {/* 选项 */}
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-2">🔘 选项区（系统自动匹配）</div>
          <div className="space-y-1.5">
            {options.map(opt => {
              const isCorrect = opt.letter === correct;
              const isPick = opt.letter === studentPick;
              return (
                <div key={opt.letter} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${isCorrect ? "border-green-200 bg-green-50" : isPick && isWrong ? "border-red-200 bg-red-50" : "border-gray-100 bg-white"}`}>
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${isCorrect ? "border-green-300 bg-green-50 text-green-700" : isPick && isWrong ? "border-red-300 bg-red-50 text-red-600" : "border-gray-200 text-gray-600"}`}>{opt.letter}</div>
                  <span className="text-sm text-gray-700">{opt.text}</span>
                  {isCorrect && <span className="ml-auto text-xs text-green-600">✓ 正确答案</span>}
                  {isPick && isWrong && <span className="ml-auto text-xs text-red-500">✏ 学生选择 ✗</span>}
                  {isPick && !isWrong && <span className="ml-auto text-xs text-blue-500">✏ 学生选择 ✓</span>}
                </div>
              );
            })}
          </div>
        </div>
        {/* AI 答题区 */}
        <div className={`rounded-lg border p-3 ${isWrong ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <div className={`text-xs font-semibold mb-1 ${isWrong ? "text-red-500" : "text-green-600"}`}>✏ 答题区（AI识别）</div>
          <div className="text-sm text-gray-700">学生圈选：<strong className={isWrong ? "text-red-500" : "text-green-600"}>{studentPick}</strong>（AI识别置信度 {aiConfidence}%）{isWrong && <span>· 正确答案为 <strong className="text-green-600">{correct}</strong></span>}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">{isWrong ? "❌" : "✅"}</span>
          <span className="text-sm text-gray-700">回答{isWrong ? "错误" : "正确"}，得 <strong className={isWrong ? "text-red-500" : "text-green-600"}>{isWrong ? 0 : 6}</strong> 分</span>
        </div>
        {/* AI 错题分析 */}
        {isWrong && aiAnalysis && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span>🤖</span>
              <span className="text-xs font-semibold text-amber-800">AI 错题分析</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">{aiAnalysis}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {aiTags?.map(t => <span key={t} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{t}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Question Card: Written (Canvas + 三级错误分类) ──────────────────────────
function WrittenQuestion({ num, color, qNum, question, answerLines, aiSuggestion, aiTags, maxScore, defaultScore, kpTags }: {
  num: number; color: string; qNum: string; question: string;
  answerLines: string[]; aiSuggestion: string; aiTags: string[];
  maxScore: number; defaultScore: number | null; kpTags: string[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctrl = useCanvas(canvasRef);
  const [verdict, setVerdict] = useState<"correct" | "wrong" | null>(null);
  const [errorTypes, setErrorTypes] = useState<string[]>([]);
  const [activeKp, setActiveKp] = useState<string[]>(kpTags.slice(0, 2));
  const [score, setScore] = useState<number | "">(defaultScore ?? "");
  const [statusLabel, setStatusLabel] = useState("待批改");

  const toggleError = (key: string) => {
    setErrorTypes(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };
  const toggleKp = (tag: string) => {
    setActiveKp(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // sync canvas size on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wrap = canvas.parentElement;
    if (!wrap) return;
    canvas.width = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: color }}>{num}</div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-800">推导解答题 · 手写批改</div>
          <div className="text-xs text-gray-400">满分 {maxScore} 分 · 需老师手动批改</div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusLabel === "已批改" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>{statusLabel}</span>
        <span className="text-sm font-semibold text-blue-600">{score !== "" ? `${score}/${maxScore}` : `—/${maxScore}`}</span>
      </div>
      {/* Body */}
      <div className="p-4 space-y-3">
        {/* 题目 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs font-semibold text-gray-400 mb-2">📋 题目</div>
          <p className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: question }} />
        </div>
        {/* Canvas 批注区 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <CanvasToolbar ctrl={ctrl} label="AI 切片" qNum={qNum} />
          <div id={`q${num}-slice-wrap`} className="relative bg-amber-50 font-serif" style={{ minHeight: 200 }}>
            {/* 题目区 */}
            <div className="bg-sky-50 border-b border-dashed border-sky-200 px-4 py-2">
              <span className="text-xs font-semibold text-sky-600 block mb-1">[ 题目区 ]</span>
              <span className="text-sm text-slate-800" dangerouslySetInnerHTML={{ __html: question }} />
            </div>
            {/* 答题区 */}
            <div className="px-4 py-3 pb-4">
              <span className="text-xs font-semibold text-amber-800 block mb-2">[ 答题区 ]</span>
              <div className="text-sm text-slate-800 leading-loose">
                {answerLines.map((line, i) => (
                  <span key={i} dangerouslySetInnerHTML={{ __html: line }} />
                ))}
              </div>
            </div>
            {/* 横线装饰 */}
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "repeating-linear-gradient(transparent,transparent 31px,#e8e4d0 31px,#e8e4d0 32px)" }} />
            {/* Canvas 叠加 */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full block touch-none cursor-crosshair z-10"
              onPointerDown={ctrl.onPointerDown}
              onPointerMove={ctrl.onPointerMove}
              onPointerUp={ctrl.onPointerUp}
              onPointerLeave={ctrl.onPointerLeave}
            />
          </div>
          <div className="text-xs text-gray-400 px-3 py-1.5 bg-gray-50 border-t border-gray-100">✏️ 直接在学生答题区上批注 · 支持手写板压感 / 鼠标 / iPad 触控笔</div>
        </div>
        {/* AI 批改建议 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span>🤖</span>
            <span className="text-xs font-semibold text-amber-800">AI 批改建议</span>
            <span className="ml-auto text-xs text-gray-400">基于解题过程分析</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: aiSuggestion }} />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {aiTags.map(t => <span key={t} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{t}</span>)}
          </div>
        </div>
        {/* 正确/错误判断 */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-600">推导过程判断：</span>
          <button
            onClick={() => { setVerdict("correct"); setStatusLabel("已批改"); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold border-2 transition-colors ${verdict === "correct" ? "bg-green-500 text-white border-green-500" : "bg-green-50 text-green-600 border-green-200 hover:bg-green-500 hover:text-white hover:border-green-500"}`}
          >✓ 正确</button>
          <button
            onClick={() => { setVerdict("wrong"); setStatusLabel("已批改"); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold border-2 transition-colors ${verdict === "wrong" ? "bg-red-500 text-white border-red-500" : "bg-red-50 text-red-500 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500"}`}
          >✗ 错误</button>
          {!verdict && <span className="text-xs text-gray-400">请判断学生推导过程是否正确</span>}
        </div>
        {/* 错误类型（当选错误时展示） */}
        {verdict === "wrong" && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-600 mb-2">⚠ 错误类型（可多选）</div>
            <div className="flex flex-wrap gap-2">
              {ERROR_TYPES.map(et => (
                <button
                  key={et.key}
                  onClick={() => toggleError(et.key)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${errorTypes.includes(et.key) ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-600 border-gray-200 hover:border-red-300"}`}
                >{et.label}</button>
              ))}
            </div>
            {/* 知识点 */}
            {errorTypes.includes("knowledge") && (
              <div className="mt-3">
                <div className="text-xs font-semibold text-gray-600 mb-2">📚 请勾选涉及的知识点</div>
                <div className="flex flex-wrap gap-1.5">
                  {kpTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleKp(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${activeKp.includes(tag) ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
                    >{tag}</button>
                  ))}
                </div>
                <div className="mt-2 p-2 bg-red-50 rounded-lg text-xs text-gray-500">
                  <strong>已勾选知识点将自动：</strong>① 记录到学生知识点掌握档案 ② 纳入 AI 建议分析 ③ 用于下次作业题目推荐
                </div>
              </div>
            )}
          </div>
        )}
        {/* 分数输入 */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-sm font-medium text-gray-600">本题得分</span>
          <input
            type="number" min={0} max={maxScore} value={score}
            onChange={e => { setScore(e.target.value === "" ? "" : Number(e.target.value)); setStatusLabel("已批改"); }}
            className="w-16 h-9 text-center border-2 border-gray-200 rounded-lg text-sm font-semibold focus:border-blue-400 outline-none"
          />
          <span className="text-sm text-gray-400">/ {maxScore} 分</span>
          {defaultScore !== null && (
            <button
              onClick={() => { setScore(defaultScore); setStatusLabel("已批改"); toast.success(`已采纳 AI 建议 ${defaultScore} 分`); }}
              className="text-xs bg-green-50 text-green-700 border border-green-200 hover:bg-green-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >采纳 AI 建议 ({defaultScore}分)</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Homework() {
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedLesson, setSelectedLesson] = useState(LESSONS[0]);
  const [activeStudent, setActiveStudent] = useState(STUDENTS[5]); // 默认选第一个待批
  const [comment, setComment] = useState("本次作业整体思路清晰，选择题第1题掌握较好。第2题方程组消元步骤出现运算失误，需加强练习。第3题解题过程正确但缺少验证步骤，请注意补充。");
  const [q3Score] = useState(9);
  const [q4Score] = useState<number | null>(null);

  const filtered = STUDENTS.filter(s => {
    if (filter === "pending") return s.status === "pending";
    if (filter === "done") return s.status === "done";
    return true;
  });

  const statusColor = (s: string) => {
    if (s === "done") return "bg-green-100 text-green-700";
    if (s === "pending") return "bg-amber-100 text-amber-700";
    return "bg-gray-100 text-gray-500";
  };
  const statusText = (s: typeof STUDENTS[0]) => {
    if (s.status === "done") return `得分 ${s.score} 已批`;
    if (s.status === "pending") return "已提交 待批";
    return "未提交 未交";
  };

  const totalScore = 6 + 0 + q3Score + (q4Score ?? 0);

  return (
    // 全屏布局，脱离 DashboardLayout 的 padding
    <div className="flex h-full -m-5 overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
      {/* ── 左侧学生列表 ── */}
      <div className="w-[220px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">学生列表</h3>
          <div className="flex gap-1.5">
            {(["all", "pending", "done"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1 rounded-md text-xs font-medium border transition-colors ${filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200 hover:border-blue-300"}`}
              >
                {f === "all" ? `全部(${STUDENTS.length})` : f === "pending" ? `待批(${STUDENTS.filter(s => s.status === "pending").length})` : `已批(${STUDENTS.filter(s => s.status === "done").length})`}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.map(s => (
            <div
              key={s.id}
              onClick={() => setActiveStudent(s)}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors mb-0.5 ${activeStudent.id === s.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">{s.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{s.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{statusText(s)}</div>
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${statusColor(s.status)}`}>
                {s.status === "done" ? "已批" : s.status === "pending" ? "待批" : "未交"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 主区域 ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* 顶部栏 */}
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4 flex-shrink-0">
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none cursor-pointer"
          >
          {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="w-px h-5 bg-gray-200"></div>
          <select
            value={selectedLesson}
            onChange={e => setSelectedLesson(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none cursor-pointer"
          >
            {LESSONS.map(l => <option key={l}>{l}</option>)}
          </select>
          <div className="w-px h-5 bg-gray-200"></div>
          <span className="text-sm text-gray-500">当前：{activeStudent.name}</span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => { const idx = STUDENTS.findIndex(s => s.id === activeStudent.id); if (idx > 0) setActiveStudent(STUDENTS[idx - 1]); }}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >← 上一位</button>
            <button
              onClick={() => { const idx = STUDENTS.findIndex(s => s.id === activeStudent.id); if (idx < STUDENTS.length - 1) setActiveStudent(STUDENTS[idx + 1]); }}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >下一位 →</button>
            <button
              onClick={() => toast.success(`${activeStudent.name} 的批改已提交`)}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >✓ 提交批改</button>
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-5 flex gap-4">
          {/* 题目列表 */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Q1: 选择题 正确 */}
            <MCQuestion
              num={1} color="#2563eb"
              title="选择题 · 自动批改"
              question="If <em>x</em> + <em>y</em> = 10 and <em>xy</em> = 21, what is the value of <em>x</em>² + <em>y</em>²?"
              options={[{ letter: "A", text: "58" }, { letter: "B", text: "62" }, { letter: "C", text: "79" }, { letter: "D", text: "100" }]}
              correct="A" studentPick="A" aiConfidence={97} isWrong={false}
            />
            {/* Q2: 选择题 错误 */}
            <MCQuestion
              num={2} color="#ef4444"
              title="选择题 · 自动批改"
              question="A system of equations: 2<em>x</em> + 3<em>y</em> = 12 and <em>x</em> − <em>y</em> = 1. Find <em>x</em>."
              options={[{ letter: "A", text: "2" }, { letter: "B", text: "3" }, { letter: "C", text: "4" }, { letter: "D", text: "5" }]}
              correct="B" studentPick="C" aiConfidence={94} isWrong={true}
              aiAnalysis="该学生在代入消元法上存在运算失误，选了 C(4) 而非正确答案 B(3)。建议在批改评语中提示：先用第二个方程表示 x = y+1，再代入第一个方程求解。"
              aiTags={["代数-方程组", "消元法", "运算失误"]}
            />
            {/* Q3: 推导题 手写批改 */}
            <WrittenQuestion
              num={3} color="#f59e0b" qNum="Q3 · 第3题"
              question="解方程组：{ 3x + 2y = 16，x − y = 2 }，并验证你的答案。（要求写出完整解题过程）"
              answerLines={[
                "解：由 x−y=2 得 x=y+2<br/>",
                "代入第一个方程：3(y+2)+2y=16<br/>",
                "3y+6+2y=16<br/>",
                "5y=10  ∴ y=2<br/>",
                "x=y+2=4  ∴ x=4<br/>",
                '<span style="color:#ef4444;font-size:13px">（未写验证步骤）</span>',
              ]}
              aiSuggestion={AI_Q3}
              aiTags={["代入法 ✓", "缺少验证", "建议 9/12"]}
              maxScore={12} defaultScore={9} kpTags={KP_TAGS_Q3}
            />
            {/* Q4: 推导题 手写批改 */}
            <WrittenQuestion
              num={4} color="#8b5cf6" qNum="Q4 · 第4题"
              question="已知两个正整数之和为 35，乘积为 306，求这两个正整数。"
              answerLines={[
                "设两数为 a, b：a+b=35, ab=306<br/>",
                "由韦达定理：t²−35t+306=0<br/>",
                "Δ=35²−4×306=1225−1224=1<br/>",
                "t=(35±1)/2<br/>",
                "t₁=18, t₂=17<br/>",
                "验证：18+17=35✓, 18×17=306✓",
              ]}
              aiSuggestion={AI_Q4}
              aiTags={["韦达定理 ✓", "验算完整", "建议 12/12"]}
              maxScore={12} defaultScore={12} kpTags={KP_TAGS_Q4}
            />
          </div>

          {/* 右侧评分面板 */}
          <div className="w-[260px] flex-shrink-0 flex flex-col gap-3">
            {/* 批改进度 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-sm font-semibold text-gray-800 mb-3">批改进度</div>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-blue-600">{totalScore}</span>
                <span className="text-base text-gray-400">/36</span>
                <div className="text-xs text-gray-400 mt-1">当前总分</div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "第1题（选择）", score: "6/6", color: "text-green-600", dot: "bg-green-500" },
                  { label: "第2题（选择）", score: "0/6", color: "text-red-500", dot: "bg-red-500" },
                  { label: "第3题（解答）", score: `${q3Score}/12`, color: "text-amber-600", dot: "bg-amber-400" },
                  { label: "第4题（解答）", score: q4Score !== null ? `${q4Score}/12` : "—/12", color: q4Score !== null ? "text-blue-600" : "text-gray-400", dot: q4Score !== null ? "bg-blue-500" : "bg-gray-300" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
                      <span className="text-gray-600">{item.label}</span>
                    </div>
                    <span className={`font-semibold ${item.color}`}>{item.score}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => toast.success(`${activeStudent.name} 的批改已完成并提交`)}
                className="w-full mt-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >✓ 完成批改并提交</button>
            </div>

            {/* 总体评语 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-xs font-medium text-gray-600 mb-2">总体评语</div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="输入对该学生本次作业的整体评语..."
                className="w-full h-24 p-2.5 border border-gray-200 rounded-lg text-xs text-gray-700 resize-none outline-none focus:border-blue-400"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => toast.success("评语已保存")} className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">保存评语</button>
                <button onClick={() => toast.info("AI 正在生成评语...")} className="flex-1 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors">🤖 AI 生成评语</button>
              </div>
            </div>

            {/* 批改进度总览 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-sm font-semibold text-gray-800 mb-2">批改进度总览</div>
              <div className="text-xs text-gray-400 mb-2">AMC8基础班 · 第4课作业</div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">已批改</span>
                <span className="font-semibold text-green-600">6/18</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "33%" }} />
              </div>
              <div className="mt-3 text-xs text-gray-400">班级平均分（已批）</div>
              <div className="text-xl font-bold text-blue-600 mt-1">22.4 <span className="text-sm font-normal text-gray-400">/36</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
