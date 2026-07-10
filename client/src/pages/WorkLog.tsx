import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, BookOpen, CheckCircle2, MessageSquare, TrendingUp, Users } from "lucide-react";

const weekStats = [
  { label: "本周批改数", value: 47, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50", change: "+8 较上周" },
  { label: "发送通知数", value: 23, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50", change: "+5 较上周" },
  { label: "学生反馈数", value: 12, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50", change: "正面反馈 10" },
  { label: "家长沟通次数", value: 8, icon: Users, color: "text-orange-500", bg: "bg-orange-50", change: "本周新增" },
];

const dailyLogs = [
  { date: "2024-07-08（周一）", graded: 15, notifications: 6, feedback: 4, notes: "完成 AMC8 班本周第一批作业批改，发现数列部分错误率偏高。" },
  { date: "2024-07-09（周二）", graded: 8, notifications: 4, feedback: 2, notes: "批改 AMC10 班作业，联系 2 名家长沟通学习进度。" },
  { date: "2024-07-10（周三）", graded: 12, notifications: 7, feedback: 3, notes: "发布下周任务，更新英语写作班第 5 单元内容。" },
  { date: "2024-07-11（周四）", graded: 7, notifications: 4, feedback: 2, notes: "完成批改进度追踪报告，发送给班主任审阅。" },
  { date: "2024-07-12（周五）", graded: 5, notifications: 2, feedback: 1, notes: "处理家长反馈消息，整理本周工作总结。" },
];

const studentFeedback = [
  { student: "陈静", content: "助教批改很详细，错误分析很有帮助！", sentiment: "positive", date: "2024-07-08" },
  { student: "王芳", content: "希望能多一些针对几何部分的练习题。", sentiment: "suggestion", date: "2024-07-09" },
  { student: "张伟", content: "这周的题目难度刚好，继续加油！", sentiment: "positive", date: "2024-07-10" },
  { student: "李明", content: "逻辑推理那部分还是不太理解，能再讲解一下吗？", sentiment: "question", date: "2024-07-11" },
];

const sentimentConfig: Record<string, { label: string; badge: string }> = {
  positive: { label: "正面反馈", badge: "bg-green-100 text-green-700" },
  suggestion: { label: "建议", badge: "bg-blue-100 text-blue-700" },
  question: { label: "疑问", badge: "bg-orange-100 text-orange-700" },
};

export default function WorkLog() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold">工作日志</h1>
        <p className="text-sm text-muted-foreground mt-0.5">批改数、通知数、学生反馈汇总</p>
      </div>

      {/* 本周统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {weekStats.map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
                </div>
                <div className={`${s.bg} p-2 rounded-lg`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 每日日志 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-500" /> 本周每日记录
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-3">
            {dailyLogs.map((log, i) => (
              <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">{log.date}</span>
                  <div className="flex gap-2 text-xs">
                    <span className="text-blue-600">批改 {log.graded}</span>
                    <span className="text-purple-600">通知 {log.notifications}</span>
                    <span className="text-green-600">反馈 {log.feedback}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{log.notes}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 学生反馈 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" /> 学生反馈汇总
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-3">
            {studentFeedback.map((f, i) => {
              const cfg = sentimentConfig[f.sentiment];
              return (
                <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{f.student}</span>
                      <Badge className={`text-xs ${cfg.badge}`}>{cfg.label}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{f.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{f.content}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

