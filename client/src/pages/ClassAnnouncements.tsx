import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Megaphone, Plus, Send } from "lucide-react";
import { useState } from "react";

type Announcement = { id: number; title: string; content: string; class: string; date: string; reads: number; total: number };

const initialAnnouncements: Announcement[] = [
  { id: 1, title: "本周作业截止提醒", content: "请同学们注意，「AMC8 2023 真题 #11-20」将于本周五截止，请及时完成提交。", class: "AMC8 强化班 A", date: "2024-07-08", reads: 22, total: 28 },
  { id: 2, title: "下周课程调整通知", content: "由于教室维修，下周三的课程调整至下周四同一时间，请同学们注意。", class: "AMC10 备考班", date: "2024-07-07", reads: 20, total: 24 },
  { id: 3, title: "期中测试安排", content: "期中综合测试将于下周五进行，请同学们提前复习前六单元内容。", class: "英语写作提升班", date: "2024-07-05", reads: 34, total: 34 },
];

const classes = ["AMC8 强化班 A", "AMC10 备考班", "英语写作提升班", "全部班级"];

export default function ClassAnnouncements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetClass, setTargetClass] = useState("");

  const handlePublish = () => {
    if (!title.trim() || !content.trim() || !targetClass) return;
    const newAnn: Announcement = {
      id: Date.now(),
      title,
      content,
      class: targetClass,
      date: new Date().toISOString().slice(0, 10),
      reads: 0,
      total: targetClass === "AMC8 强化班 A" ? 28 : targetClass === "AMC10 备考班" ? 24 : 34,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setTitle(""); setContent(""); setTargetClass(""); setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">班级公告</h1>
          <p className="text-sm text-muted-foreground mt-0.5">发布通知，查看阅读统计</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> 发布公告
        </Button>
      </div>

      {/* 发布表单 */}
      {showForm && (
        <Card className="border-0 shadow-sm border-l-4 border-l-primary">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" /> 新建公告
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">公告标题</Label>
                <Input placeholder="输入公告标题" className="h-9" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">发布班级</Label>
                <Select value={targetClass} onValueChange={setTargetClass}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="选择班级" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">公告内容</Label>
              <Textarea placeholder="输入公告内容..." rows={3} className="text-sm resize-none" value={content} onChange={e => setContent(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>取消</Button>
              <Button size="sm" className="gap-1.5" onClick={handlePublish} disabled={!title || !content || !targetClass}>
                <Send className="h-3.5 w-3.5" /> 发布
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 公告列表 */}
      <div className="space-y-3">
        {announcements.map(a => {
          const readPct = Math.round((a.reads / a.total) * 100);
          return (
            <Card key={a.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{a.title}</span>
                      <Badge variant="secondary" className="text-xs">{a.class}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{a.reads}/{a.total}</span>
                    <Badge className={`text-xs ml-1 ${readPct === 100 ? "bg-green-100 text-green-700" : readPct >= 70 ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                      {readPct}%
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{a.content}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
