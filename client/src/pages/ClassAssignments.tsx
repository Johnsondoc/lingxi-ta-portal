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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Clock, PenLine, Search, Send, XCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const classes = ["AMC8 强化班 A", "AMC10 备考班", "英语写作提升班"];

const assignments = [
  { id: "HW001", title: "AMC8 2023 真题 #1-10", dueDate: "2024-07-08", total: 28 },
  { id: "HW002", title: "AMC8 2023 真题 #11-20", dueDate: "2024-07-10", total: 28 },
  { id: "HW003", title: "数列与递推专项练习", dueDate: "2024-07-12", total: 28 },
];

type Status = "submitted" | "graded" | "missing";

const students: { id: number; name: string; statuses: Record<string, Status> }[] = [
  { id: 1, name: "张伟", statuses: { HW001: "graded", HW002: "submitted", HW003: "missing" } },
  { id: 2, name: "李明", statuses: { HW001: "graded", HW002: "graded", HW003: "submitted" } },
  { id: 3, name: "王芳", statuses: { HW001: "submitted", HW002: "submitted", HW003: "submitted" } },
  { id: 4, name: "刘洋", statuses: { HW001: "graded", HW002: "missing", HW003: "missing" } },
  { id: 5, name: "陈静", statuses: { HW001: "graded", HW002: "graded", HW003: "graded" } },
  { id: 6, name: "赵磊", statuses: { HW001: "submitted", HW002: "submitted", HW003: "missing" } },
  { id: 7, name: "孙丽", statuses: { HW001: "graded", HW002: "submitted", HW003: "submitted" } },
  { id: 8, name: "周强", statuses: { HW001: "missing", HW002: "missing", HW003: "missing" } },
];

const statusConfig: Record<Status, { label: string; icon: React.ReactNode; badge: string }> = {
  graded: { label: "已批改", icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, badge: "bg-green-100 text-green-700" },
  submitted: { label: "待批改", icon: <Clock className="h-4 w-4 text-orange-500" />, badge: "bg-orange-100 text-orange-700" },
  missing: { label: "未提交", icon: <XCircle className="h-4 w-4 text-gray-400" />, badge: "bg-gray-100 text-gray-500" },
};

export default function ClassAssignments() {
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const filtered = students.filter(s => s.name.includes(search));

  const getCount = (status: Status) =>
    students.reduce((acc, s) => acc + Object.values(s.statuses).filter(v => v === status).length, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">班级作业管理</h1>
          <p className="text-sm text-muted-foreground mt-0.5">查看学生作业完成情况，进行批改操作</p>
        </div>
        <Button size="sm" onClick={() => setLocation("/homework")}>
          <PenLine className="h-4 w-4 mr-1.5" /> 去批改
        </Button>
      </div>

      {/* 班级选择 + 统计 */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-3 text-sm">
          <span className="flex items-center gap-1.5 text-green-600"><CheckCircle2 className="h-4 w-4" /> 已批改 {getCount("graded")}</span>
          <span className="flex items-center gap-1.5 text-orange-500"><Clock className="h-4 w-4" /> 待批改 {getCount("submitted")}</span>
          <span className="flex items-center gap-1.5 text-gray-400"><XCircle className="h-4 w-4" /> 未提交 {getCount("missing")}</span>
        </div>
      </div>

      {/* 作业列表 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {assignments.map(a => {
          const gradedCount = students.filter(s => s.statuses[a.id] === "graded").length;
          const submittedCount = students.filter(s => s.statuses[a.id] === "submitted").length;
          return (
            <Card key={a.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="font-medium text-sm mb-1">{a.title}</div>
                <div className="text-xs text-muted-foreground mb-3">截止 {a.dueDate}</div>
                <div className="flex gap-2 text-xs">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">已批 {gradedCount}</span>
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">待批 {submittedCount}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 学生列表 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 pt-4 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">学生作业状态</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索学生..."
                  className="pl-8 h-8 text-xs w-36"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Send className="h-3.5 w-3.5" /> 发送家长链接
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">学生姓名</TableHead>
                {assignments.map(a => (
                  <TableHead key={a.id} className="text-xs">{a.title.slice(0, 12)}…</TableHead>
                ))}
                <TableHead className="text-xs">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(student => (
                <TableRow key={student.id}>
                  <TableCell className="text-sm font-medium">{student.name}</TableCell>
                  {assignments.map(a => {
                    const status = student.statuses[a.id];
                    const cfg = statusConfig[status];
                    return (
                      <TableCell key={a.id}>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setLocation("/homework")}
                    >
                      <PenLine className="h-3.5 w-3.5 mr-1" /> 批改
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
