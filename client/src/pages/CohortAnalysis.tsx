import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const knowledgeGroups = [
  { name: "数列与递推", mastered: 12, learning: 8, struggling: 8, total: 28 },
  { name: "几何定理", mastered: 18, learning: 6, struggling: 4, total: 28 },
  { name: "代数运算", mastered: 20, learning: 5, struggling: 3, total: 28 },
  { name: "逻辑推理", mastered: 10, learning: 10, struggling: 8, total: 28 },
  { name: "计数原理", mastered: 22, learning: 4, struggling: 2, total: 28 },
];

const difficultyGroups = [
  {
    level: "优秀（90分以上）",
    count: 8,
    color: "bg-green-500",
    badge: "bg-green-100 text-green-700",
    students: ["陈静", "王芳", "孙丽"],
    suggestion: "可尝试 AMC10 难度题目，进行拔高训练。",
  },
  {
    level: "良好（75-89分）",
    count: 12,
    color: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
    students: ["张伟", "赵磊", "李华"],
    suggestion: "重点巩固薄弱知识点，提升稳定性。",
  },
  {
    level: "待提升（60-74分）",
    count: 6,
    color: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700",
    students: ["李明", "周强"],
    suggestion: "建议增加基础练习频率，重点关注数列和逻辑推理。",
  },
  {
    level: "需关注（60分以下）",
    count: 2,
    color: "bg-red-500",
    badge: "bg-red-100 text-red-700",
    students: ["刘洋"],
    suggestion: "建议主动联系家长，制定个性化补救计划。",
  },
];

export default function CohortAnalysis() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold">群体分析</h1>
        <p className="text-sm text-muted-foreground mt-0.5">按知识点和难度段对班级学生进行分组分析</p>
      </div>

      <Tabs defaultValue="knowledge">
        <TabsList className="h-9">
          <TabsTrigger value="knowledge" className="text-xs">知识点分组</TabsTrigger>
          <TabsTrigger value="difficulty" className="text-xs">难度段分组</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="mt-4 space-y-3">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm">各知识点掌握分布（AMC8 强化班 A · 28人）</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              {knowledgeGroups.map(g => (
                <div key={g.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{g.name}</span>
                    <div className="flex gap-2 text-xs">
                      <span className="text-green-600">已掌握 {g.mastered}</span>
                      <span className="text-orange-500">学习中 {g.learning}</span>
                      <span className="text-red-500">待加强 {g.struggling}</span>
                    </div>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                    <div className="bg-green-400 rounded-l-full" style={{ width: `${(g.mastered / g.total) * 100}%` }} />
                    <div className="bg-orange-400" style={{ width: `${(g.learning / g.total) * 100}%` }} />
                    <div className="bg-red-400 rounded-r-full" style={{ width: `${(g.struggling / g.total) * 100}%` }} />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-green-400 inline-block" />已掌握</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-400 inline-block" />学习中</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400 inline-block" />待加强</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="difficulty" className="mt-4 space-y-3">
          {difficultyGroups.map(g => (
            <Card key={g.level} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${g.color} shrink-0 mt-0.5`} />
                    <div>
                      <span className="text-sm font-medium">{g.level}</span>
                      <span className="text-xs text-muted-foreground ml-2">{g.count} 名学生</span>
                    </div>
                  </div>
                  <Badge className={`text-xs ${g.badge}`}>{g.count}人</Badge>
                </div>
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {g.students.map(s => (
                    <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                  {g.count > g.students.length && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">+{g.count - g.students.length} 人</Badge>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                  💡 {g.suggestion}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
