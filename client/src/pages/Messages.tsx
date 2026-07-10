import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle2, MessageCircle, MessageSquare, User } from "lucide-react";
import { useState } from "react";

type Msg = { id: number; title: string; content: string; time: string; read: boolean; type: string };

const notifications: Msg[] = [
  { id: 1, title: "作业提交提醒", content: "AMC8 强化班 A 的张伟已提交「AMC8 2023 真题 #1-10」，请及时批改。", time: "10分钟前", read: false, type: "assignment" },
  { id: 2, title: "作业提交提醒", content: "AMC10 备考班的李明已提交「数列与递推专项」，请及时批改。", time: "1小时前", read: false, type: "assignment" },
  { id: 3, title: "截止日期提醒", content: "「AMC8 2023 真题 #11-20」将于明日截止，仍有 11 名学生未提交。", time: "2小时前", read: true, type: "deadline" },
  { id: 4, title: "学生完成提醒", content: "英语写作提升班本周作业完成率达到 88%，超过上周 15%。", time: "昨天", read: true, type: "progress" },
];

const parentFeedback: Msg[] = [
  { id: 5, title: "张伟家长反馈", content: "孩子最近学习状态不错，但希望助教能多给一些针对性的练习题，特别是数列部分。", time: "30分钟前", read: false, type: "parent" },
  { id: 6, title: "刘洋家长咨询", content: "孩子这周作业分数下降了，想了解一下具体哪些知识点需要加强？", time: "3小时前", read: false, type: "parent" },
  { id: 7, title: "陈静家长感谢", content: "感谢助教的耐心辅导，孩子这次考试进步很大！", time: "昨天", read: true, type: "parent" },
];

export default function Messages() {
  const [msgs, setMsgs] = useState([...notifications, ...parentFeedback]);

  const markRead = (id: number) => setMsgs(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  const markAllRead = () => setMsgs(prev => prev.map(m => ({ ...m, read: true })));

  const notifs = msgs.filter(m => m.type !== "parent");
  const parents = msgs.filter(m => m.type === "parent");
  const unreadCount = msgs.filter(m => !m.read).length;

  const MsgCard = ({ msg }: { msg: Msg }) => (
    <Card className={`border-0 shadow-sm cursor-pointer transition-all ${!msg.read ? "bg-blue-50/50" : ""}`} onClick={() => markRead(msg.id)}>
      <CardContent className="p-4 flex gap-3">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
          msg.type === "parent" ? "bg-purple-100" : msg.type === "assignment" ? "bg-blue-100" : "bg-orange-100"
        }`}>
          {msg.type === "parent" ? <User className="h-4 w-4 text-purple-500" /> :
           msg.type === "assignment" ? <MessageSquare className="h-4 w-4 text-blue-500" /> :
           <Bell className="h-4 w-4 text-orange-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium">{msg.title}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">{msg.time}</span>
              {!msg.read && <div className="h-2 w-2 rounded-full bg-blue-500" />}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{msg.content}</p>
          {msg.type === "parent" && (
            <Button variant="outline" size="sm" className="mt-2 h-7 text-xs gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" /> 回复
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            消息中心
            {unreadCount > 0 && <Badge className="text-xs">{unreadCount} 未读</Badge>}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">作业通知、学生完成提醒、家长反馈</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={markAllRead}>
          <CheckCircle2 className="h-3.5 w-3.5" /> 全部已读
        </Button>
      </div>

      <Tabs defaultValue="notifications">
        <TabsList className="h-9">
          <TabsTrigger value="notifications" className="text-xs">
            系统通知 {notifs.filter(m => !m.read).length > 0 && <Badge className="ml-1.5 text-xs h-4 px-1">{notifs.filter(m => !m.read).length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="parents" className="text-xs">
            家长反馈 {parents.filter(m => !m.read).length > 0 && <Badge className="ml-1.5 text-xs h-4 px-1">{parents.filter(m => !m.read).length}</Badge>}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="notifications" className="mt-4 space-y-3">
          {notifs.map(m => <MsgCard key={m.id} msg={m} />)}
        </TabsContent>
        <TabsContent value="parents" className="mt-4 space-y-3">
          {parents.map(m => <MsgCard key={m.id} msg={m} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
