import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, CheckCircle2, Send } from "lucide-react";
import { useState } from "react";

const questionSets = [
  { id: "q1", title: "AMC8 2023 真题 #1-10", type: "数学竞赛", count: 10, difficulty: "中等" },
  { id: "q2", title: "AMC8 2023 真题 #11-20", type: "数学竞赛", count: 10, difficulty: "中等" },
  { id: "q3", title: "数列与递推专项 A 卷", type: "数学竞赛", count: 15, difficulty: "较难" },
  { id: "q4", title: "几何综合练习 B 卷", type: "数学竞赛", count: 12, difficulty: "困难" },
  { id: "q5", title: "英语词汇 Unit 5 练习", type: "英语", count: 20, difficulty: "简单" },
];

const wordLists = [
  { id: "w1", title: "AMC 数学词汇 Vol.1", count: 50, category: "学科词汇" },
  { id: "w2", title: "高频学术词汇 IELTS", count: 100, category: "学术英语" },
  { id: "w3", title: "竞赛英语专项词汇", count: 80, category: "竞赛词汇" },
];

const classes = ["AMC8 强化班 A", "AMC10 备考班", "英语写作提升班"];

export default function PublishTask() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [published, setPublished] = useState(false);

  const toggleQuestion = (id: string) =>
    setSelectedQuestions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleWord = (id: string) =>
    setSelectedWords(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handlePublish = () => setPublished(true);

  if (published) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h2 className="text-xl font-semibold">任务发布成功！</h2>
        <p className="text-muted-foreground text-sm">已向 {selectedClass} 发布任务，截止日期 {dueDate || "未设置"}</p>
        <Button onClick={() => { setPublished(false); setSelectedQuestions([]); setSelectedWords([]); }}>
          继续发布任务
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold">发布任务</h1>
        <p className="text-sm text-muted-foreground mt-0.5">基于课程配套题目发布作业任务</p>
      </div>

      {/* 基本设置 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm">基本设置</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">选择班级</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="选择发布班级" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">截止日期</Label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="date" className="pl-9 h-9" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">已选内容</Label>
            <div className="flex gap-2 items-center h-9">
              {selectedQuestions.length > 0 && (
                <Badge variant="secondary">{selectedQuestions.length} 套题目</Badge>
              )}
              {selectedWords.length > 0 && (
                <Badge variant="secondary">{selectedWords.length} 套单词</Badge>
              )}
              {selectedQuestions.length === 0 && selectedWords.length === 0 && (
                <span className="text-xs text-muted-foreground">尚未选择内容</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 题目/单词选择 */}
      <Tabs defaultValue="questions">
        <TabsList className="h-9">
          <TabsTrigger value="questions" className="text-xs">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" /> 配套题目
          </TabsTrigger>
          <TabsTrigger value="words" className="text-xs">
            背单词任务
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {questionSets.map(q => (
              <Card
                key={q.id}
                className={`border shadow-sm cursor-pointer transition-all ${selectedQuestions.includes(q.id) ? "border-primary bg-primary/5" : "border-transparent hover:border-gray-200"}`}
                onClick={() => toggleQuestion(q.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <Checkbox
                    checked={selectedQuestions.includes(q.id)}
                    onCheckedChange={() => toggleQuestion(q.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{q.title}</div>
                    <div className="flex gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs">{q.type}</Badge>
                      <Badge variant="outline" className="text-xs">{q.count} 题</Badge>
                      <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="words" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {wordLists.map(w => (
              <Card
                key={w.id}
                className={`border shadow-sm cursor-pointer transition-all ${selectedWords.includes(w.id) ? "border-primary bg-primary/5" : "border-transparent hover:border-gray-200"}`}
                onClick={() => toggleWord(w.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <Checkbox
                    checked={selectedWords.includes(w.id)}
                    onCheckedChange={() => toggleWord(w.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{w.title}</div>
                    <div className="flex gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs">{w.category}</Badge>
                      <Badge variant="outline" className="text-xs">{w.count} 词</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 发布按钮 */}
      <div className="flex justify-end">
        <Button
          size="lg"
          className="gap-2"
          disabled={!selectedClass || (selectedQuestions.length === 0 && selectedWords.length === 0)}
          onClick={handlePublish}
        >
          <Send className="h-4 w-4" /> 发布任务
        </Button>
      </div>
    </div>
  );
}

