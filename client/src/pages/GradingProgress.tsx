import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart2, CheckCircle2, Clock, TrendingUp } from "lucide-react";

const overallStats = [
  { label: "本周已批改", value: 47, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
  { label: "待批改", value: 23, icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
  { label: "平均批改时间", value: "8.5分钟", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "本周批改效率", value: "↑12%", icon: BarChart2, color: "text-purple-500", bg: "bg-purple-50" },
];

const classProgress = [
  { name: "AMC8 强化班 A", total: 28, graded: 20, avgTime: 7.2 },
  { name: "AMC10 备考班", total: 24, graded: 13, avgTime: 9.8 },
  { name: "英语写作提升班", total: 34, graded: 30, avgTime: 8.1 },
];

const weeklyData = [
  { day: "周一", count: 15 },
  { day: "周二", count: 8 },
  { day: "周三", count: 12 },
  { day: "周四", count: 7 },
  { day: "周五", count: 5 },
  { day: "周六", count: 0 },
  { day: "周日", count: 0 },
];

const maxCount = Math.max(...weeklyData.map(d => d.count));

export default function GradingProgress() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold">批改进度追踪</h1>
        <p className="text-sm text-muted-foreground mt-0.5">已批/待批数量统计与平均批改时间分析</p>
      </div>

      {/* 总体统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overallStats.map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
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
        {/* 班级进度 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm">各班级批改进度</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-5">
            {classProgress.map(cls => {
              const pct = Math.round((cls.graded / cls.total) * 100);
              return (
                <div key={cls.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium">{cls.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">均 {cls.avgTime} 分钟/份</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{cls.graded}/{cls.total}</span>
                      <Badge
                        className={`text-xs ${pct >= 80 ? "bg-green-100 text-green-700" : pct >= 50 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}
                      >
                        {pct}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 本周批改趋势 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm">本周批改趋势</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-end gap-2 h-40">
              {weeklyData.map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{d.count || ""}</span>
                  <div
                    className={`w-full rounded-t-md transition-all ${d.count > 0 ? "bg-primary/80" : "bg-gray-100"}`}
                    style={{ height: `${maxCount > 0 ? (d.count / maxCount) * 120 : 4}px`, minHeight: "4px" }}
                  />
                  <span className="text-xs text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

