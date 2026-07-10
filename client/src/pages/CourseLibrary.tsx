import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, ChevronRight, FileText, Search, Video } from "lucide-react";
import { useState } from "react";

const courses = [
  {
    id: 1,
    name: "AMC8 竞赛强化课程",
    subject: "数学竞赛",
    units: 12,
    questions: 240,
    classes: ["AMC8 强化班 A"],
    chapters: [
      { name: "第1单元：数与运算", lessons: 4, questions: 20 },
      { name: "第2单元：数列与递推", lessons: 3, questions: 18 },
      { name: "第3单元：几何基础", lessons: 5, questions: 25 },
    ],
  },
  {
    id: 2,
    name: "AMC10 备考精讲课程",
    subject: "数学竞赛",
    units: 16,
    questions: 320,
    classes: ["AMC10 备考班"],
    chapters: [
      { name: "第1单元：代数综合", lessons: 6, questions: 30 },
      { name: "第2单元：几何进阶", lessons: 5, questions: 28 },
    ],
  },
  {
    id: 3,
    name: "英语写作提升课程",
    subject: "英语",
    units: 10,
    questions: 150,
    classes: ["英语写作提升班"],
    chapters: [
      { name: "第1单元：议论文写作", lessons: 4, questions: 15 },
      { name: "第2单元：词汇与表达", lessons: 3, questions: 20 },
    ],
  },
];

export default function CourseLibrary() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(1);

  const filtered = courses.filter(c => c.name.includes(search) || c.subject.includes(search));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">课程库</h1>
          <p className="text-sm text-muted-foreground mt-0.5">查看班级关联课程和配套题库</p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="搜索课程..." className="pl-8 h-8 text-xs w-48" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(course => (
          <Card key={course.id} className="border-0 shadow-sm overflow-hidden">
            <CardHeader
              className="pb-3 pt-4 px-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => setExpanded(expanded === course.id ? null : course.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{course.name}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{course.subject}</Badge>
                      <span className="text-xs text-muted-foreground">{course.units} 单元 · {course.questions} 题</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded === course.id ? "rotate-90" : ""}`} />
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {course.classes.map(c => (
                  <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                ))}
              </div>
            </CardHeader>

            {expanded === course.id && (
              <CardContent className="px-5 pb-4 border-t bg-gray-50/30">
                <div className="space-y-2 mt-3">
                  {course.chapters.map((ch, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-3 bg-white rounded-lg border border-gray-100">
                      <div>
                        <div className="text-sm font-medium">{ch.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{ch.lessons} 课时 · {ch.questions} 道题</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                          <Video className="h-3.5 w-3.5" /> 录播
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                          <FileText className="h-3.5 w-3.5" /> 课件
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                          <BookOpen className="h-3.5 w-3.5" /> 题库
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
