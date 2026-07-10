import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  MessageSquare,
  Users,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useLocation } from "wouter";

const statsCards = [
  { label: "待批改作业", value: "23", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-50", change: "+3 今日新增" },
  { label: "今日已完成", value: "12", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50", change: "完成率 52%" },
  { label: "管理学生数", value: "86", icon: Users, color: "text-blue-500", bg: "bg-blue-50", change: "3个班级" },
  { label: "未读消息", value: "7", icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50", change: "2条家长反馈" },
];

const classes = [
  { name: "AMC8 强化班 A", students: 28, pending: 8, progress: 71, subject: "数学竞赛" },
  { name: "AMC10 备考班", students: 24, pending: 11, progress: 54, subject: "数学竞赛" },
  { name: "英语写作提升班", students: 34, pending: 4, progress: 88, subject: "英语" },
];

const todos = [
  { id: 1, text: "批改 AMC8 班 8 份未批作业", urgency: "urgent", time: "今日截止" },
  { id: 2, text: "发送 AMC10 班本周学习报告给家长", urgency: "normal", time: "明日截止" },
  { id: 3, text: "更新英语写作班第 5 单元任务", urgency: "normal", time: "后天截止" },
  { id: 4, text: "回复 3 条家长消息", urgency: "urgent", time: "今日截止" },
];

const aiSuggestions = [
  "AMC8 班有 5 名学生在「数列与递推」知识点连续出错，建议本周重点讲解。",
  "英语写作班整体完成率本周提升 18%，可适当增加作业难度。",
  "李明同学近两周作业提交率下降，建议主动联系家长沟通。",
];

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">早上好，王助教 👋</h1>
            <p className="text-blue-100 text-sm mt-1">
              {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
            </p>
            <p className="text-blue-100 text-sm mt-3">今日还有 <span className="text-white font-bold">23</span> 份作业待批改，加油！</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">52%</div>
            <div className="text-blue-100 text-xs mt-1">今日批改进度</div>
            <Progress value={52} className="mt-2 w-24 h-1.5 bg-blue-400/40" />
          </div>
        </div>
      </div>

      {/* 数据卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <Card key={card.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
                </div>
                <div className={`${card.bg} p-2 rounded-lg`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 班级卡片 */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">我的班级</h2>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7" onClick={() => setLocation("/class-assignments")}>
              查看全部 <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          {classes.map((cls) => (
            <Card key={cls.name} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation("/class-assignments")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{cls.name}</span>
                      <Badge variant="secondary" className="text-xs">{cls.subject}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{cls.students} 名学生</p>
                  </div>
                  {cls.pending > 0 && (
                    <Badge variant="destructive" className="text-xs">{cls.pending} 待批</Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>本周批改进度</span>
                    <span>{cls.progress}%</span>
                  </div>
                  <Progress value={cls.progress} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 右侧：待处理事项 + AI建议 */}
        <div className="space-y-4">
          {/* 待处理事项 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                待处理事项
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-start gap-2 py-1.5 border-b last:border-0">
                  {todo.urgency === "urgent" ? (
                    <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">{todo.text}</p>
                    <p className={`text-xs mt-0.5 ${todo.urgency === "urgent" ? "text-red-500" : "text-muted-foreground"}`}>{todo.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI 建议 */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI 教学建议
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {aiSuggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5 border-b border-purple-100 last:border-0">
                  <TrendingUp className="h-3.5 w-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-700 leading-relaxed">{s}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
