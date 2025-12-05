"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, CheckCircle, Clock, Download, FileText, PlayCircle, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export default function SchoolProgramDetailPage({ params }: { params: { id: string } }) {
  const [activeWeek, setActiveWeek] = useState("week-6")

  // Mock program data
  const program = {
    id: params.id,
    title: "TechStart Entrepreneurship Program",
    organization: "Silicon Valley High School",
    progress: 65,
    currentWeek: 6,
    totalWeeks: 10,
    description:
      "A comprehensive program designed to help students develop entrepreneurial skills and launch their own tech startups.",
    instructors: [
      { name: "Dr. Emily Chen", role: "Lead Instructor" },
      { name: "Mark Rodriguez", role: "Mentor" },
    ],
    weeks: [
      {
        id: "week-1",
        title: "Introduction to Entrepreneurship",
        status: "completed",
        progress: 100,
        materials: [
          { type: "video", title: "What is Entrepreneurship?", duration: "15 min" },
          { type: "reading", title: "The Entrepreneurial Mindset", pages: "12 pages" },
          { type: "quiz", title: "Week 1 Assessment", questions: 10 },
        ],
        assignments: [{ title: "Personal Entrepreneurship Goals", status: "submitted", grade: "A" }],
      },
      {
        id: "week-2",
        title: "Identifying Opportunities",
        status: "completed",
        progress: 100,
        materials: [
          { type: "video", title: "Finding Market Gaps", duration: "20 min" },
          { type: "reading", title: "Opportunity Recognition", pages: "15 pages" },
          { type: "quiz", title: "Week 2 Assessment", questions: 8 },
        ],
        assignments: [{ title: "Market Gap Analysis", status: "submitted", grade: "B+" }],
      },
      {
        id: "week-3",
        title: "Business Model Canvas",
        status: "completed",
        progress: 100,
        materials: [
          { type: "video", title: "Business Model Canvas Explained", duration: "25 min" },
          { type: "reading", title: "Value Proposition Design", pages: "18 pages" },
          { type: "quiz", title: "Week 3 Assessment", questions: 12 },
        ],
        assignments: [{ title: "Draft Business Model Canvas", status: "submitted", grade: "A-" }],
      },
      {
        id: "week-4",
        title: "Customer Discovery",
        status: "completed",
        progress: 100,
        materials: [
          { type: "video", title: "Customer Interview Techniques", duration: "18 min" },
          { type: "reading", title: "Gathering Customer Insights", pages: "14 pages" },
          { type: "quiz", title: "Week 4 Assessment", questions: 10 },
        ],
        assignments: [{ title: "Customer Interview Results", status: "submitted", grade: "A" }],
      },
      {
        id: "week-5",
        title: "Minimum Viable Product",
        status: "completed",
        progress: 100,
        materials: [
          { type: "video", title: "Building Your MVP", duration: "22 min" },
          { type: "reading", title: "Lean Startup Methodology", pages: "20 pages" },
          { type: "quiz", title: "Week 5 Assessment", questions: 15 },
        ],
        assignments: [{ title: "MVP Proposal", status: "submitted", grade: "A+" }],
      },
      {
        id: "week-6",
        title: "Market Validation",
        status: "in-progress",
        progress: 60,
        materials: [
          { type: "video", title: "Testing Your Market Fit", duration: "24 min" },
          { type: "reading", title: "Validation Techniques", pages: "16 pages" },
          { type: "quiz", title: "Week 6 Assessment", questions: 12 },
        ],
        assignments: [{ title: "Market Validation Report", status: "in-progress", dueDate: "May 25, 2023" }],
      },
      {
        id: "week-7",
        title: "Financial Planning",
        status: "locked",
        progress: 0,
        materials: [
          { type: "video", title: "Startup Financials", duration: "30 min" },
          { type: "reading", title: "Financial Projections", pages: "22 pages" },
          { type: "quiz", title: "Week 7 Assessment", questions: 15 },
        ],
        assignments: [{ title: "Financial Plan", status: "locked" }],
      },
      {
        id: "week-8",
        title: "Pitching Your Idea",
        status: "locked",
        progress: 0,
        materials: [
          { type: "video", title: "Pitch Deck Essentials", duration: "28 min" },
          { type: "reading", title: "Storytelling for Entrepreneurs", pages: "18 pages" },
          { type: "quiz", title: "Week 8 Assessment", questions: 10 },
        ],
        assignments: [{ title: "Draft Pitch Deck", status: "locked" }],
      },
      {
        id: "week-9",
        title: "Funding Strategies",
        status: "locked",
        progress: 0,
        materials: [
          { type: "video", title: "Funding Options for Startups", duration: "26 min" },
          { type: "reading", title: "Investor Relations", pages: "20 pages" },
          { type: "quiz", title: "Week 9 Assessment", questions: 12 },
        ],
        assignments: [{ title: "Funding Strategy Document", status: "locked" }],
      },
      {
        id: "week-10",
        title: "Final Presentations",
        status: "locked",
        progress: 0,
        materials: [
          { type: "video", title: "Presentation Skills", duration: "20 min" },
          { type: "reading", title: "Handling Q&A", pages: "12 pages" },
        ],
        assignments: [{ title: "Final Business Pitch", status: "locked" }],
      },
    ],
  }

  const activeWeekData = program.weeks.find((week) => week.id === activeWeek)

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Link href="/dashboard/school-programs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programs
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="w-full md:w-1/3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{program.title}</CardTitle>
                <CardDescription>{program.organization}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span>{program.progress}%</span>
                  </div>
                  <Progress value={program.progress} className="h-2" />
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Program Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p>
                          Week {program.currentWeek} of {program.totalWeeks}
                        </p>
                        <p className="text-muted-foreground">Current: {program.weeks[program.currentWeek - 1].title}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p>{program.currentWeek - 1} weeks completed</p>
                        <p className="text-muted-foreground">
                          {program.totalWeeks - program.currentWeek} weeks remaining
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Instructors</h4>
                  <div className="space-y-2">
                    {program.instructors.map((instructor, index) => (
                      <div key={index} className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary mr-2"></div>
                        <div>
                          <p className="text-sm font-medium">{instructor.name}</p>
                          <p className="text-xs text-muted-foreground">{instructor.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Program Curriculum</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <Accordion type="single" collapsible className="w-full">
                  {program.weeks.map((week) => (
                    <AccordionItem key={week.id} value={week.id} className="border-b-0 px-6">
                      <AccordionTrigger
                        onClick={() => week.status !== "locked" && setActiveWeek(week.id)}
                        className={`hover:no-underline ${week.status === "locked" ? "text-muted-foreground" : ""}`}
                      >
                        <div className="flex items-center text-left">
                          <div className="mr-2">
                            {week.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {week.status === "in-progress" && <Clock className="h-4 w-4 text-amber-500" />}
                            {week.status === "locked" && (
                              <div className="h-4 w-4 rounded-full border border-muted-foreground"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">Week {program.weeks.indexOf(week) + 1}</p>
                            <p className="text-xs text-muted-foreground">{week.title}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-6 space-y-2 text-sm">
                          {week.materials.map((material, index) => (
                            <div key={index} className="flex items-center">
                              {material.type === "video" && (
                                <PlayCircle className="h-3 w-3 mr-2 text-muted-foreground" />
                              )}
                              {material.type === "reading" && (
                                <BookOpen className="h-3 w-3 mr-2 text-muted-foreground" />
                              )}
                              {material.type === "quiz" && <FileText className="h-3 w-3 mr-2 text-muted-foreground" />}
                              <span>{material.title}</span>
                            </div>
                          ))}
                          {week.assignments.map((assignment, index) => (
                            <div key={index} className="flex items-center">
                              <Upload className="h-3 w-3 mr-2 text-muted-foreground" />
                              <span>{assignment.title}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="w-full md:w-2/3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      Week {program.weeks.indexOf(activeWeekData!) + 1}: {activeWeekData?.title}
                    </CardTitle>
                    <CardDescription>
                      {activeWeekData?.status === "completed" && "Completed"}
                      {activeWeekData?.status === "in-progress" && "In Progress"}
                      {activeWeekData?.status === "locked" && "Locked"}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      activeWeekData?.status === "completed"
                        ? "secondary"
                        : activeWeekData?.status === "in-progress"
                          ? "default"
                          : "outline"
                    }
                  >
                    {activeWeekData?.status === "completed" && "Completed"}
                    {activeWeekData?.status === "in-progress" && "In Progress"}
                    {activeWeekData?.status === "locked" && "Locked"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="materials">
                  <TabsList className="mb-4">
                    <TabsTrigger value="materials">Learning Materials</TabsTrigger>
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  </TabsList>

                  <TabsContent value="materials" className="space-y-4">
                    <div className="space-y-4">
                      {activeWeekData?.materials.map((material, index) => (
                        <Card key={index}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                {material.type === "video" && <PlayCircle className="h-5 w-5 mr-2 text-primary" />}
                                {material.type === "reading" && <BookOpen className="h-5 w-5 mr-2 text-primary" />}
                                {material.type === "quiz" && <FileText className="h-5 w-5 mr-2 text-primary" />}
                                <CardTitle className="text-base">{material.title}</CardTitle>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {material.duration && material.duration}
                                {material.pages && material.pages}
                                {material.questions && `${material.questions} questions`}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            {material.type === "video" && (
                              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                <PlayCircle className="h-12 w-12 text-primary/70" />
                              </div>
                            )}
                            {material.type === "reading" && (
                              <div className="flex justify-between items-center">
                                <p className="text-sm">
                                  Essential reading material for understanding {activeWeekData.title.toLowerCase()}.
                                </p>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </Button>
                              </div>
                            )}
                            {material.type === "quiz" && (
                              <div className="flex justify-between items-center">
                                <p className="text-sm">Test your knowledge of this week's material.</p>
                                <Button size="sm">Start Quiz</Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="assignments" className="space-y-4">
                    {activeWeekData?.assignments.map((assignment, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">{assignment.title}</CardTitle>
                            <Badge
                              variant={
                                assignment.status === "submitted"
                                  ? "secondary"
                                  : assignment.status === "in-progress"
                                    ? "default"
                                    : "outline"
                              }
                            >
                              {assignment.status === "submitted" && "Submitted"}
                              {assignment.status === "in-progress" && "In Progress"}
                              {assignment.status === "locked" && "Locked"}
                            </Badge>
                          </div>
                          {assignment.dueDate && <CardDescription>Due: {assignment.dueDate}</CardDescription>}
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p className="text-sm">
                              {assignment.status === "submitted" ? (
                                <>
                                  Your submission has been graded. Grade:{" "}
                                  <span className="font-medium">{assignment.grade}</span>
                                </>
                              ) : assignment.status === "in-progress" ? (
                                "Complete and submit your assignment before the due date."
                              ) : (
                                "This assignment will be available once you complete the required materials."
                              )}
                            </p>

                            {assignment.status === "in-progress" && (
                              <div className="flex justify-end">
                                <Button>Submit Assignment</Button>
                              </div>
                            )}

                            {assignment.status === "submitted" && (
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline">View Feedback</Button>
                                <Button variant="outline">View Submission</Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="discussion" className="space-y-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">
                          Discussion board for Week {program.weeks.indexOf(activeWeekData!) + 1} will be available soon.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
