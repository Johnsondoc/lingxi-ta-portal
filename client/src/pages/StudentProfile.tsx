import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, TrendingDown, TrendingUp, User } from "lucide-react";
import { useState } from "react";

const students = [
  { id: 1, name: "张伟", class: "AMC8 强化班 A", score: 82, trend: "up" },
  { id: 2, name: "李明", class: "AMC8 强化班 A", score: 68, trend: "down" },
  { id: 3, name: "王芳", class: "AMC10 备考班", score: 91, trend: "up" },
  { id: 4, name: "刘洋", class: "AMC10 备考班", score: 55, trend: "down" },
  { id: 5, name: "陈静", class: "英语写作提升班", score: 88, trend: "up" },
];

const learningHistory = [
  { date: "2024-07-08", assignment: "AMC8 2023 真题 #1-10", score: 80, errors: ["计算错误", "逻辑推理"] },
  { date: "2024-07-01", assignment: "数列与递推专项", score: 75, errors: ["概念理解"] },
  { date: "2024-06-24", assignment: "AMC8 2022 真题 #1-10", score: 85, errors: ["审题失误"] },
  { date: "2024-06-17", assignment: "几何综合练习", score: 70, errors: ["计算错误", "概念理解"] },
];

const knowledgePoints = [
  { name: "数列与递推", mastery: 65 },
  { name: "几何定理", mastery: 82 },
  { name: "代数运算", mastery: 78 },
  { name: "逻辑推理", mastery: 55 },
  { name: "计数原理", mastery: 90 },
  { name: "概率统计", mastery: 72 },
];

const wrongQuestions = [
  { id: "W001", question: "若 a₁=2，aₙ₊₁=2aₙ+1，求 a₅", errorType: "计算错误", frequency: 3, date: "2024-07-08" },
  { id: "W002", question: "三角形 ABC 中，∠A=60°，AB=AC=2，求 BC", errorType: "概念理解", frequency: 2, date: "2024-06-24" },
  { id: "W003", question: "从 1-10 中选 3 个数，求和为奇数的概率", errorType: "逻辑推理", frequency: 2, date: "2024-07-01" },
];

export default function StudentProfile() {
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [search, setSearch] = useState("");

  const filtered = students.filter(s => s.name.includes(search));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold">学生档案</h1>
        <p className="text-sm text-muted-foreground mt-0.5">查看学生学习历史、知识点掌握情况和错题集</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* 左侧学生列表 */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索学生..."
                  className="pl-8 h-8 text-xs"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              {filtered.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    selectedStudent.id === s.id ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.class}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">{s.score}</span>
                    {s.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 右侧详情 */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{selectedStudent.name}</h2>
              <p className="text-xs text-muted-foreground">{selectedStudent.class} · 平均分 {selectedStudent.score}</p>
            </div>
          </div>

          <Tabs defaultValue="history">
            <TabsList className="h-9">
              <TabsTrigger value="history" className="text-xs">学习历史</TabsTrigger>
              <TabsTrigger value="knowledge" className="text-xs">知识点掌握</TabsTrigger>
              <TabsTrigger value="wrong" className="text-xs">错题集</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-4 space-y-3">
              {learningHistory.map((h, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="text-center shrink-0">
                      <div className={`text-xl font-bold ${h.score >= 80 ? "text-green-600" : h.score >= 70 ? "text-orange-500" : "text-red-500"}`}>{h.score}</div>
                      <div className="text-xs text-muted-foreground">分</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{h.assignment}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{h.date}</div>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {h.errors.map(e => (
                          <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="knowledge" className="mt-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5 space-y-4">
                  {knowledgePoints.map(kp => (
                    <div key={kp.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span>{kp.name}</span>
                        <span className={`font-medium ${kp.mastery >= 80 ? "text-green-600" : kp.mastery >= 65 ? "text-orange-500" : "text-red-500"}`}>
                          {kp.mastery}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${kp.mastery >= 80 ? "bg-green-500" : kp.mastery >= 65 ? "bg-orange-400" : "bg-red-400"}`}
                          style={{ width: `${kp.mastery}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wrong" className="mt-4 space-y-3">
              {wrongQuestions.map(q => (
                <Card key={q.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium">{q.question}</span>
                        </div>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>{q.date}</span>
                          <span>·</span>
                          <span>错误 {q.frequency} 次</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">{q.errorType}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
