import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, MessageCircle, Search, Send, User } from "lucide-react";
import { useState } from "react";

const parents = [
  { id: 1, studentName: "张伟", parentName: "张父", phone: "138****8888", lastContact: "2024-07-08", unread: 1 },
  { id: 2, studentName: "李明", parentName: "李母", phone: "139****9999", lastContact: "2024-07-06", unread: 1 },
  { id: 3, studentName: "王芳", parentName: "王父", phone: "137****7777", lastContact: "2024-07-07", unread: 0 },
  { id: 4, studentName: "刘洋", parentName: "刘母", phone: "136****6666", lastContact: "2024-07-05", unread: 0 },
];

type Record_ = { id: number; sender: string; content: string; time: string; type: string };
const communicationRecords: Record<number, Record_[]> = {
  1: [
    { id: 1, sender: "助教", content: "张伟同学本周表现不错，AMC8 真题得了 80 分，继续加油！", time: "2024-07-08 14:30", type: "sent" },
    { id: 2, sender: "张父", content: "谢谢老师！孩子回来说题目有点难，数列那块还需要加强。", time: "2024-07-08 15:20", type: "received" },
    { id: 3, sender: "助教", content: "好的，我会在下周的任务中加入更多数列专项练习。", time: "2024-07-08 15:45", type: "sent" },
  ],
  2: [
    { id: 4, sender: "李母", content: "李明最近作业分数下降了，是不是难度增加了？", time: "2024-07-06 10:00", type: "received" },
    { id: 5, sender: "助教", content: "是的，本周进入了逻辑推理单元，难度有所提升。建议每天额外练习 30 分钟。", time: "2024-07-06 10:30", type: "sent" },
  ],
};

export default function ParentCommunication() {
  const [selected, setSelected] = useState(parents[0]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState(communicationRecords);

  const filtered = parents.filter(p => p.studentName.includes(search) || p.parentName.includes(search));
  const currentRecords = records[selected.id] || [];

  const handleSend = () => {
    if (!message.trim()) return;
    const newRecord: Record_ = {
      id: Date.now(),
      sender: "助教",
      content: message,
      time: new Date().toLocaleString("zh-CN"),
      type: "sent",
    };
    setRecords(prev => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), newRecord] }));
    setMessage("");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">家长沟通</h1>
          <p className="text-sm text-muted-foreground mt-0.5">发送学习链接，查看沟通记录</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <ExternalLink className="h-3.5 w-3.5" /> 发送学习报告链接
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 家长列表 */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="搜索家长/学生..." className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              {filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${selected.id === p.id ? "bg-primary/10" : "hover:bg-gray-50"}`}
                >
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{p.studentName} 家长</div>
                    <div className="text-xs text-muted-foreground">{p.lastContact}</div>
                  </div>
                  {p.unread > 0 && <Badge className="text-xs h-4 px-1.5">{p.unread}</Badge>}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 沟通记录 */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm flex flex-col" style={{ minHeight: 480 }}>
            <CardHeader className="pb-3 pt-4 px-5 border-b">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-purple-500" />
                {selected.studentName} 家长（{selected.parentName}）
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 px-5 py-4 space-y-3 overflow-y-auto">
              {currentRecords.map(r => (
                <div key={r.id} className={`flex ${r.type === "sent" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-xl px-4 py-2.5 ${r.type === "sent" ? "bg-primary text-white" : "bg-gray-100 text-gray-800"}`}>
                    <p className="text-sm leading-relaxed">{r.content}</p>
                    <p className={`text-xs mt-1 ${r.type === "sent" ? "text-blue-100" : "text-gray-400"}`}>{r.time}</p>
                  </div>
                </div>
              ))}
              {currentRecords.length === 0 && (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">暂无沟通记录</div>
              )}
            </CardContent>
            <div className="px-5 pb-4 pt-3 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="输入消息..."
                  className="text-sm resize-none flex-1"
                  rows={2}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                />
                <Button className="self-end gap-1.5" size="sm" onClick={handleSend}>
                  <Send className="h-4 w-4" /> 发送
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
