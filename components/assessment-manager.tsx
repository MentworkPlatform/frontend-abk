"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, FileText, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Assessment {
  id: string
  title: string
  description: string
  type: "quiz" | "assignment" | "peer_review" | "self_reflection" | "project"
  curriculumGroup: string
  session?: string
  questions: Question[]
  maxScore: number
  timeLimit?: number
  maxAttempts: number
  dueDate: string
  isPublished: boolean
  submissions: Submission[]
  averageScore: number
  completionRate: number
}

interface Question {
  id: string
  type: "multiple_choice" | "true_false" | "short_answer" | "essay"
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
}

interface Submission {
  id: string
  studentId: string
  studentName: string
  answers: any[]
  score?: number
  feedback?: string
  submittedAt: string
  gradedAt?: string
  status: "submitted" | "graded" | "pending"
}

// Mock data
const mockAssessments: Assessment[] = [
  {
    id: "assessment-1",
    title: "Entrepreneurship Fundamentals Quiz",
    description: "Test your understanding of basic entrepreneurship concepts",
    type: "quiz",
    curriculumGroup: "Fundamentals of Entrepreneurship",
    session: "Introduction to Entrepreneurship",
    questions: [
      {
        id: "q1",
        type: "multiple_choice",
        question: "What is the primary characteristic of an entrepreneur?",
        options: ["Risk-taking", "Innovation", "Leadership", "All of the above"],
        correctAnswer: 3,
        points: 5,
      },
      {
        id: "q2",
        type: "true_false",
        question: "All entrepreneurs must have a business degree.",
        correctAnswer: "false",
        points: 3,
      },
    ],
    maxScore: 50,
    timeLimit: 30,
    maxAttempts: 2,
    dueDate: "2024-02-15",
    isPublished: true,
    submissions: [
      {
        id: "sub-1",
        studentId: "student-1",
        studentName: "Alex Thompson",
        answers: [3, "false"],
        score: 45,
        feedback: "Great work! Review the innovation concepts.",
        submittedAt: "2024-02-10T10:30:00Z",
        gradedAt: "2024-02-11T09:00:00Z",
        status: "graded",
      },
      {
        id: "sub-2",
        studentId: "student-2",
        studentName: "Maria Garcia",
        answers: [3, "false"],
        score: 50,
        submittedAt: "2024-02-12T14:20:00Z",
        gradedAt: "2024-02-12T16:00:00Z",
        status: "graded",
      },
    ],
    averageScore: 47.5,
    completionRate: 85,
  },
  {
    id: "assessment-2",
    title: "Business Model Canvas Project",
    description: "Create a comprehensive business model canvas for your startup idea",
    type: "project",
    curriculumGroup: "Business Model Development",
    questions: [],
    maxScore: 100,
    maxAttempts: 1,
    dueDate: "2024-03-01",
    isPublished: true,
    submissions: [
      {
        id: "sub-3",
        studentId: "student-1",
        studentName: "Alex Thompson",
        answers: [],
        submittedAt: "2024-02-28T23:59:00Z",
        status: "submitted",
      },
    ],
    averageScore: 0,
    completionRate: 40,
  },
]

export function AssessmentManager() {
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const handleEditAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setShowEditDialog(true)
  }

  const handleDeleteAssessment = (assessmentId: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== assessmentId))
  }

  const getTypeIcon = (type: Assessment["type"]) => {
    switch (type) {
      case "quiz":
        return <FileText className="h-4 w-4" />
      case "assignment":
        return <FileText className="h-4 w-4" />
      case "project":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "graded":
        return "bg-green-100 text-green-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Assessment Management</h2>
          <p className="text-gray-500">Create, manage, and grade assessments for your programs</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create New Assessment</DialogTitle>
              <DialogDescription>Set up a new assessment for your students.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment-title">Assessment Title</Label>
                  <Input id="assessment-title" placeholder="e.g., Week 1 Quiz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment-type">Assessment Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="peer_review">Peer Review</SelectItem>
                      <SelectItem value="self_reflection">Self Reflection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessment-description">Description</Label>
                <Textarea id="assessment-description" placeholder="Describe the assessment..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-score">Max Score</Label>
                  <Input id="max-score" type="number" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                  <Input id="time-limit" type="number" placeholder="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-attempts">Max Attempts</Label>
                  <Input id="max-attempts" type="number" placeholder="2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="curriculum-group">Curriculum Group</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fundamentals">Fundamentals of Entrepreneurship</SelectItem>
                      <SelectItem value="market-research">Market Research & Validation</SelectItem>
                      <SelectItem value="business-model">Business Model Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="datetime-local" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>Create Assessment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Question Bank</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(assessment.type)}
                      <div>
                        <CardTitle className="text-base">{assessment.title}</CardTitle>
                        <CardDescription className="text-sm">{assessment.curriculumGroup}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={assessment.isPublished ? "default" : "outline"}>
                      {assessment.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{assessment.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Max Score:</span>
                      <p className="font-medium">{assessment.maxScore}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <p className="font-medium">{new Date(assessment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Submissions:</span>
                      <p className="font-medium">{assessment.submissions.length}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Score:</span>
                      <p className="font-medium">{assessment.averageScore || "N/A"}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{assessment.completionRate}%</span>
                    </div>
                    <Progress value={assessment.completionRate} className="h-2" />
                  </div>

                  <div className="flex justify-between gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditAssessment(assessment)}>
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteAssessment(assessment.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Submissions</h3>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assessments</SelectItem>
                <SelectItem value="quiz">Quizzes Only</SelectItem>
                <SelectItem value="assignment">Assignments Only</SelectItem>
                <SelectItem value="project">Projects Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.flatMap((assessment) =>
                    assessment.submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback>
                                {submission.studentName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {submission.studentName}
                          </div>
                        </TableCell>
                        <TableCell>{assessment.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{assessment.type.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell>
                          {submission.score !== undefined ? (
                            <span className="font-medium">
                              {submission.score}/{assessment.maxScore}
                            </span>
                          ) : (
                            <span className="text-gray-500">Not graded</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            {submission.status === "submitted" ? "Grade" : "Review"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )),
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assessments.length}</div>
                <div className="text-xs text-gray-500">{assessments.filter((a) => a.isPublished).length} published</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Average Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(assessments.reduce((acc, a) => acc + a.completionRate, 0) / assessments.length)}%
                </div>
                <div className="text-xs text-gray-500">Across all assessments</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pending Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assessments.reduce(
                    (acc, a) => acc + a.submissions.filter((s) => s.status === "submitted").length,
                    0,
                  )}
                </div>
                <div className="text-xs text-gray-500">Need attention</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Performance</CardTitle>
              <CardDescription>Overview of student performance across assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{assessment.title}</h4>
                      <p className="text-sm text-gray-500">{assessment.submissions.length} submissions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        Avg: {assessment.averageScore || "N/A"}/{assessment.maxScore}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Progress value={assessment.completionRate} className="h-2 w-20" />
                        <span className="text-sm">{assessment.completionRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
