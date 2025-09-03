"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Plus, Edit, Trash2, Upload, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

// Mock data for the school program
const mockProgram = {
  id: "1",
  title: "Youth Entrepreneurship Accelerator",
  school: "Westlake High School",
  duration: "10 weeks",
  topic: "Entrepreneurship",
  stipend: "$600",
  status: "Active",
  mentorsAssigned: 3,
  studentsEnrolled: 25,
  sessionsCompleted: 4,
  totalSessions: 10,
  startDate: "2024-01-15",
  endDate: "2024-03-25",
  description:
    "A comprehensive program designed to help students develop entrepreneurial skills and launch their own tech startups.",
}

// Mock weekly schedule data
const mockWeeklySchedule = [
  {
    week: 1,
    date: "2024-01-15",
    topic: "Introduction to Entrepreneurship",
    mentor: "Sarah Johnson",
    status: "completed",
    attendance: 24,
    materials: ["Intro Slides", "Reading Material"],
    objectives: ["Understand entrepreneurship basics", "Identify personal strengths"],
  },
  {
    week: 2,
    date: "2024-01-22",
    topic: "Identifying Market Opportunities",
    mentor: "Michael Chen",
    status: "completed",
    attendance: 23,
    materials: ["Market Research Guide", "Case Studies"],
    objectives: ["Learn market research techniques", "Identify potential opportunities"],
  },
  {
    week: 3,
    date: "2024-01-29",
    topic: "Business Model Canvas",
    mentor: "Sarah Johnson",
    status: "completed",
    attendance: 25,
    materials: ["Canvas Template", "Examples"],
    objectives: ["Create business model canvas", "Understand value propositions"],
  },
  {
    week: 4,
    date: "2024-02-05",
    topic: "Customer Discovery",
    mentor: "David Rodriguez",
    status: "completed",
    attendance: 22,
    materials: ["Interview Guide", "Survey Templates"],
    objectives: ["Conduct customer interviews", "Validate assumptions"],
  },
  {
    week: 5,
    date: "2024-02-12",
    topic: "MVP Development",
    mentor: "Sarah Johnson",
    status: "in-progress",
    attendance: 0,
    materials: ["MVP Guide", "Prototyping Tools"],
    objectives: ["Build minimum viable product", "Test core features"],
  },
  {
    week: 6,
    date: "2024-02-19",
    topic: "Financial Planning",
    mentor: "Michael Chen",
    status: "scheduled",
    attendance: 0,
    materials: [],
    objectives: ["Create financial projections", "Understand startup costs"],
  },
]

// Mock student data
const mockStudents = [
  {
    id: 1,
    name: "Alex Thompson",
    email: "alex.t@email.com",
    attendance: 4,
    assignments: 3,
    grade: "A",
    progress: 85,
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.g@email.com",
    attendance: 4,
    assignments: 4,
    grade: "A+",
    progress: 92,
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james.w@email.com",
    attendance: 3,
    assignments: 2,
    grade: "B+",
    progress: 78,
  },
]

export default function SchoolProgramDetailPage({ params }: { params: { id: string } }) {
  const [selectedWeek, setSelectedWeek] = useState(5)
  const [showAddSessionDialog, setShowAddSessionDialog] = useState(false)
  const [showEditSessionDialog, setShowEditSessionDialog] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)

  const handleEditSession = (session: any) => {
    setSelectedSession(session)
    setShowEditSessionDialog(true)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Link href="/admin/school-programs-management">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>
        </Link>
      </div>

      {/* Program Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{mockProgram.title}</CardTitle>
                <CardDescription className="text-lg">{mockProgram.school}</CardDescription>
              </div>
              <Badge
                className={
                  mockProgram.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }
              >
                {mockProgram.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{mockProgram.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Duration:</span>
                <p className="font-medium">{mockProgram.duration}</p>
              </div>
              <div>
                <span className="text-gray-500">Topic:</span>
                <p className="font-medium">{mockProgram.topic}</p>
              </div>
              <div>
                <span className="text-gray-500">Stipend:</span>
                <p className="font-medium">{mockProgram.stipend}</p>
              </div>
              <div>
                <span className="text-gray-500">Students:</span>
                <p className="font-medium">{mockProgram.studentsEnrolled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Program Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Sessions Completed</span>
                <span>
                  {mockProgram.sessionsCompleted}/{mockProgram.totalSessions}
                </span>
              </div>
              <Progress value={(mockProgram.sessionsCompleted / mockProgram.totalSessions) * 100} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Mentors:</span>
                <p className="font-medium">{mockProgram.mentorsAssigned}</p>
              </div>
              <div>
                <span className="text-gray-500">Avg Attendance:</span>
                <p className="font-medium">92%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        {/* Weekly Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Weekly Schedule</h3>
            <Dialog open={showAddSessionDialog} onOpenChange={setShowAddSessionDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Session</DialogTitle>
                  <DialogDescription>Create a new session for this program.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="week">Week Number</Label>
                      <Input id="week" type="number" placeholder="e.g., 5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Session Date</Label>
                      <Input id="date" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic">Session Topic</Label>
                    <Input id="topic" placeholder="e.g., MVP Development" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentor">Assigned Mentor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mentor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="michael">Michael Chen</SelectItem>
                        <SelectItem value="david">David Rodriguez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Learning Objectives</Label>
                    <Textarea id="objectives" placeholder="Enter learning objectives..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddSessionDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowAddSessionDialog(false)}>Create Session</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockWeeklySchedule.map((session) => (
                    <TableRow key={session.week}>
                      <TableCell className="font-medium">Week {session.week}</TableCell>
                      <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                      <TableCell>{session.topic}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="text-xs">
                              {session.mentor
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {session.mentor}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            session.status === "completed"
                              ? "secondary"
                              : session.status === "in-progress"
                                ? "default"
                                : "outline"
                          }
                        >
                          {session.status === "completed" && "Completed"}
                          {session.status === "in-progress" && "In Progress"}
                          {session.status === "scheduled" && "Scheduled"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {session.status === "completed" ? `${session.attendance}/${mockProgram.studentsEnrolled}` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditSession(session)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Enrolled Students</h3>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Assignments</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback>
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {student.attendance}/{mockProgram.sessionsCompleted}
                      </TableCell>
                      <TableCell>{student.assignments}/4</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.grade}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={student.progress} className="h-2 w-16" />
                          <span className="text-sm">{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Program Materials</h3>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Material
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockWeeklySchedule.map((session) => (
              <Card key={session.week}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Week {session.week}: {session.topic}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {session.materials.length > 0 ? (
                      session.materials.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{material}</span>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No materials uploaded</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Plus className="h-3 w-3 mr-2" />
                    Add Material
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Assessments</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">Week 2 Quiz</CardTitle>
                    <CardDescription>Market Opportunities Assessment</CardDescription>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span>10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Submissions:</span>
                    <span>23/25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Score:</span>
                    <span>87%</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Results
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">Business Model Assignment</CardTitle>
                    <CardDescription>Canvas Creation Project</CardDescription>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>Project</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span>Feb 10, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Submissions:</span>
                    <span>18/25</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Grade Submissions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Session Dialog */}
      <Dialog open={showEditSessionDialog} onOpenChange={setShowEditSessionDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
            <DialogDescription>Update session details and materials.</DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-week">Week Number</Label>
                  <Input id="edit-week" type="number" defaultValue={selectedSession.week} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Session Date</Label>
                  <Input id="edit-date" type="date" defaultValue={selectedSession.date} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-topic">Session Topic</Label>
                <Input id="edit-topic" defaultValue={selectedSession.topic} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mentor">Assigned Mentor</Label>
                <Select defaultValue={selectedSession.mentor.toLowerCase().replace(" ", "")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarahjohnson">Sarah Johnson</SelectItem>
                    <SelectItem value="michaelchen">Michael Chen</SelectItem>
                    <SelectItem value="davidrodriguez">David Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-objectives">Learning Objectives</Label>
                <Textarea
                  id="edit-objectives"
                  defaultValue={selectedSession.objectives?.join("\n")}
                  placeholder="Enter learning objectives..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditSessionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowEditSessionDialog(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
