import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, ChevronLeft, ChevronRight, Pen, Save } from "lucide-react";
import { useState } from "react";

const errorCategories = {
  level1: ["概念理解", "计算错误", "逻辑推理", "审题失误"],
  level2: {
    "概念理解": ["数列概念", "函数定义", "几何定理", "代数法则"],
    "计算错误": ["加减运算", "乘除运算", "分数运算", "开方运算"],
    "逻辑推理": ["归纳推理", "演绎推理", "反证法", "数学归纳法"],
    "审题失误": ["条件遗漏", "单位换算", "范围判断", "题意理解"],
  } as Record<string, string[]>,
  level3: ["低频错误（偶发）", "中频错误（需关注）", "高频错误（重点辅导）"],
};

const submissions = [
  { id: 1, student: "张伟", assignment: "AMC8 2023 #1-10", score: null, comment: "", l1: "", l2: "", l3: "" },
  { id: 2, student: "王芳", assignment: "AMC8 2023 #1-10", score: null, comment: "", l1: "", l2: "", l3: "" },
  { id: 3, student: "赵磊", assignment: "AMC8 2023 #1-10", score: null, comment: "", l1: "", l2: "", l3: "" },
];

export default function Homework() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [l1, setL1] = useState<Record<number, string>>({});
  const [l2, setL2] = useState<Record<number, string>>({});
  const [l3, setL3] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [isDrawing, setIsDrawing] = useState(false);

  const current = submissions[currentIdx];
  const currentL1 = l1[current.id] || "";

  const handleSave = () => {
    setSaved(prev => ({ ...prev, [current.id]: true }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">作业批改</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Canvas 手写批注 + 三级错误分类</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{currentIdx + 1} / {submissions.length}</span>
          <Button variant="outline" size="sm" className="h-8" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => setCurrentIdx(Math.min(submissions.length - 1, currentIdx + 1))} disabled={currentIdx === submissions.length - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* 左侧：作业内容 + Canvas 批注 */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  {current.student} · {current.assignment}
                </CardTitle>
                {saved[current.id] && (
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> 已保存
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {/* 模拟作业内容 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-700 space-y-3 border">
                <p className="font-medium">题目 1：若 a₁=2，aₙ₊₁=2aₙ+1，求 a₅ 的值。</p>
                <div className="bg-white p-3 rounded border-l-4 border-blue-300">
                  <p className="text-xs text-muted-foreground mb-1">学生作答：</p>
                  <p>a₂=5, a₃=11, a₄=23, a₅=<span className="text-red-500 font-medium">45</span></p>
                </div>
                <p className="text-xs text-orange-600">⚠ 正确答案应为 47，学生在最后一步计算出错。</p>
              </div>

              {/* Canvas 批注区 */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg bg-white relative" style={{ height: 200 }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Pen className="h-8 w-8 mb-2 text-gray-300" />
                  <p className="text-sm">Canvas 手写批注区</p>
                  <p className="text-xs mt-1">（点击启用手写批注）</p>
                </div>
                <Button
                  variant={isDrawing ? "default" : "outline"}
                  size="sm"
                  className="absolute top-3 right-3 h-7 text-xs"
                  onClick={() => setIsDrawing(!isDrawing)}
                >
                  <Pen className="h-3.5 w-3.5 mr-1" />
                  {isDrawing ? "结束批注" : "开始批注"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：评分 + 错误分类 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 评分 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm">评分</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="flex gap-2 flex-wrap">
                {[60, 70, 75, 80, 85, 90, 95, 100].map(s => (
                  <button
                    key={s}
                    onClick={() => setScores(prev => ({ ...prev, [current.id]: s }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      scores[current.id] === s
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {scores[current.id] && (
                <p className="text-sm font-semibold mt-3 text-primary">当前评分：{scores[current.id]} 分</p>
              )}
            </CardContent>
          </Card>

          {/* 三级错误分类 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm">三级错误分类</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">一级分类（错误类型）</label>
                <Select value={currentL1} onValueChange={v => setL1(prev => ({ ...prev, [current.id]: v }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="选择错误类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {errorCategories.level1.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">二级分类（具体知识点）</label>
                <Select
                  value={l2[current.id] || ""}
                  onValueChange={v => setL2(prev => ({ ...prev, [current.id]: v }))}
                  disabled={!currentL1}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="选择知识点" />
                  </SelectTrigger>
                  <SelectContent>
                    {(errorCategories.level2[currentL1] || []).map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">三级分类（错误频率）</label>
                <Select value={l3[current.id] || ""} onValueChange={v => setL3(prev => ({ ...prev, [current.id]: v }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="选择错误频率" />
                  </SelectTrigger>
                  <SelectContent>
                    {errorCategories.level3.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 评语 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm">批改评语</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <Textarea
                placeholder="输入批改评语，将同步发送给学生和家长..."
                className="text-xs resize-none"
                rows={3}
                value={comments[current.id] || ""}
                onChange={e => setComments(prev => ({ ...prev, [current.id]: e.target.value }))}
              />
              <Button className="w-full mt-3 h-8 text-sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1.5" /> 保存批改结果
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
