"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Play,
  FileText,
  Award,
  MessageSquare,
  BarChart3,
  Eye,
  DollarSign,
  UserCheck,
  XCircle,
  Video,
  Plus,
  Edit,
  Star,
  Send,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function ProgramLMSPage() {
  const params = useParams()
  const programId = params.id as string

  const [program] = useState({
    id: programId,
    title: "Digital Marketing Bootcamp",
    status: "active",
    startDate: "2024-02-15",
    endDate: "2024-05-15",
    participants: 25,
    maxParticipants: 30,
  })

  const [topics] = useState([
    {
      id: "topic-1",
      title: "SEO Fundamentals",
      description: "Learn the basics of search engine optimization",
      type: "live_session",
      duration: 90,
      status: "completed",
      mentors: ["Sarah Johnson"],
      participants: 25,
      completionRate: 100,
      assessments: [{ id: "assess-1", title: "SEO Quiz", type: "quiz", submissions: 23, avgScore: 85 }],
      feedback: { rating: 4.8, reviews: 18 },
      sessions: [
        {
          id: "session-1",
          date: "2024-02-20",
          time: "10:00 AM",
          mentor: "Sarah Johnson",
          trainerConfirmed: true,
          mentorConfirmed: true,
          paymentStatus: "paid",
          amount: 150,
          meetingLink: "https://meet.mentwork.com/session-1",
          meetingId: "123-456-789",
          recordingUrl: "https://recordings.mentwork.com/session-1",
          feedback: [
            { id: "f1", author: "Sarah Johnson", rating: 5, comment: "Great session, very engaged participants" },
          ],
        },
      ],
    },
    {
      id: "topic-2",
      title: "Content Strategy",
      description: "Develop effective content marketing strategies",
      type: "project",
      duration: 120,
      status: "active",
      mentors: ["Sarah Johnson", "Michael Chen"],
      participants: 22,
      completionRate: 75,
      assessments: [{ id: "assess-2", title: "Content Plan Project", type: "project", submissions: 18, avgScore: 0 }],
      feedback: { rating: 4.6, reviews: 12 },
      sessions: [
        {
          id: "session-2",
          date: "2024-02-25",
          time: "2:00 PM",
          mentor: "Sarah Johnson",
          trainerConfirmed: true,
          mentorConfirmed: false,
          paymentStatus: "pending",
          amount: 180,
          meetingLink: "https://meet.mentwork.com/session-2",
          meetingId: "234-567-890",
          feedback: [],
        },
        {
          id: "session-3",
          date: "2024-02-27",
          time: "3:00 PM",
          mentor: "Michael Chen",
          trainerConfirmed: false,
          mentorConfirmed: false,
          paymentStatus: "pending",
          amount: 180,
          meetingLink: "https://meet.mentwork.com/session-3",
          meetingId: "345-678-901",
          feedback: [],
        },
      ],
    },
    {
      id: "topic-3",
      title: "Social Media Analytics",
      description: "Understanding and interpreting social media metrics",
      type: "discussion",
      duration: 60,
      status: "upcoming",
      mentors: ["Michael Chen"],
      participants: 0,
      completionRate: 0,
      assessments: [],
      feedback: { rating: 0, reviews: 0 },
      sessions: [
        {
          id: "session-4",
          date: "2024-03-05",
          time: "11:00 AM",
          mentor: "Michael Chen",
          trainerConfirmed: false,
          mentorConfirmed: false,
          paymentStatus: "scheduled",
          amount: 120,
          meetingLink: "https://meet.mentwork.com/session-4",
          meetingId: "456-789-012",
          feedback: [],
        },
      ],
    },
    {
      id: "topic-4",
      title: "Email Marketing Automation",
      description: "Setting up automated email campaigns",
      type: "live_session",
      duration: 90,
      status: "draft",
      mentors: [],
      participants: 0,
      completionRate: 0,
      assessments: [],
      feedback: { rating: 0, reviews: 0 },
      sessions: [],
    },
  ])

  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackComment, setFeedbackComment] = useState("")

  const handleAttendanceConfirmation = (topicId, sessionId, type) => {
    console.log(`[v0] Confirming ${type} attendance for session ${sessionId} in topic ${topicId}`)
  }

  const handleScheduleSession = (sessionData) => {
    console.log(`[v0] Scheduling new session:`, sessionData)
    setShowScheduleDialog(false)
  }

  const handleJoinMeeting = (meetingLink) => {
    console.log(`[v0] Opening meeting link: ${meetingLink}`)
    window.open(meetingLink, "_blank")
  }

  const handleSubmitFeedback = () => {
    console.log(`[v0] Submitting feedback for session ${selectedSession.id}:`, {
      rating: feedbackRating,
      comment: feedbackComment,
    })
    setShowFeedbackDialog(false)
    setFeedbackRating(5)
    setFeedbackComment("")
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "scheduled":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getTopicIcon = (type: string) => {
    switch (type) {
      case "live_session":
        return <Calendar className="h-5 w-5" />
      case "project":
        return <Award className="h-5 w-5" />
      case "discussion":
        return <MessageSquare className="h-5 w-5" />
      case "video":
        return <Play className="h-5 w-5" />
      case "document":
        return <FileText className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const getTopicStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "active":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "upcoming":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/trainer/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{program.title}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant={program.status === "active" ? "default" : "secondary"}>{program.status}</Badge>
                  <span className="text-sm text-gray-500">
                    {program.participants}/{program.maxParticipants} participants
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {selectedTopic ? (
          // Topic Detail View
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setSelectedTopic(null)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Topics
              </Button>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getTopicStatusColor(selectedTopic.status)}`}>
                  {getTopicIcon(selectedTopic.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedTopic.title}</h2>
                  <p className="text-gray-600">{selectedTopic.description}</p>
                </div>
              </div>
            </div>

            {/* Topic Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Participants</p>
                      <p className="text-2xl font-bold">{selectedTopic.participants}</p>
                    </div>
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completion</p>
                      <p className="text-2xl font-bold">{selectedTopic.completionRate}%</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-2xl font-bold">{selectedTopic.duration}m</p>
                    </div>
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-2xl font-bold">{selectedTopic.feedback.rating || "N/A"}</p>
                    </div>
                    <BarChart3 className="h-6 w-6 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Online Sessions & Payment Tracking
                    </CardTitle>
                    <CardDescription>
                      Schedule and manage online meetings for this topic. Both trainer and mentor must confirm
                      attendance for payment processing.
                    </CardDescription>
                  </div>
                  <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000] w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule Online Session</DialogTitle>
                        <DialogDescription>Create a new online session for {selectedTopic.title}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" />
                          </div>
                          <div>
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" type="time" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="mentor">Select Mentor</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a mentor" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedTopic.mentors.map((mentor) => (
                                <SelectItem key={mentor} value={mentor}>
                                  {mentor}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="amount">Payment Amount ($)</Label>
                          <Input id="amount" type="number" placeholder="150" />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => handleScheduleSession({})}>Schedule Session</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {selectedTopic.sessions && selectedTopic.sessions.length > 0 ? (
                  <div className="space-y-4">
                    {selectedTopic.sessions.map((session) => (
                      <div key={session.id} className="p-4 border rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
                          <div className="flex items-center gap-3">
                            <Video className="h-5 w-5 text-blue-500" />
                            <div>
                              <h4 className="font-medium">{session.mentor}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(session.date).toLocaleDateString()} at {session.time}
                              </p>
                              {session.meetingId && (
                                <p className="text-xs text-gray-500">Meeting ID: {session.meetingId}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPaymentStatusColor(session.paymentStatus)}>
                              {session.paymentStatus}
                            </Badge>
                            <span className="font-medium">${session.amount}</span>
                          </div>
                        </div>

                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Online Meeting</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {session.meetingLink && (
                                <Button
                                  size="sm"
                                  onClick={() => handleJoinMeeting(session.meetingLink)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Video className="h-4 w-4 mr-1" />
                                  Join Meeting
                                </Button>
                              )}
                              {session.recordingUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(session.recordingUrl, "_blank")}
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Recording
                                </Button>
                              )}
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Trainer Confirmation */}
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">Trainer Confirmation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {session.trainerConfirmed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">{session.trainerConfirmed ? "Confirmed" : "Pending"}</span>
                              {!session.trainerConfirmed && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAttendanceConfirmation(selectedTopic.id, session.id, "trainer")}
                                >
                                  Confirm
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Mentor Confirmation */}
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">Mentor Confirmation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {session.mentorConfirmed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">{session.mentorConfirmed ? "Confirmed" : "Pending"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Status Message */}
                        <div className="mb-4 p-2 bg-blue-50 rounded text-sm text-blue-700">
                          {session.trainerConfirmed && session.mentorConfirmed
                            ? session.paymentStatus === "paid"
                              ? "✅ Payment processed successfully"
                              : "⏳ Payment will be processed within 24 hours"
                            : "⚠️ Both trainer and mentor confirmation required for payment processing"}
                        </div>

                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <h5 className="font-medium text-sm text-purple-900">Session Feedback</h5>
                              <p className="text-xs text-purple-700">
                                {session.feedback.length > 0
                                  ? `${session.feedback.length} feedback received`
                                  : "No feedback yet"}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedSession(session)
                                setShowFeedbackDialog(true)
                              }}
                              className="bg-white hover:bg-purple-50 w-full sm:w-auto"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {session.feedback.length > 0 ? "View & Add" : "Add"} Feedback
                            </Button>
                          </div>

                          {session.feedback.length > 0 && (
                            <div className="mt-3 space-y-2 border-t border-purple-200 pt-3">
                              {session.feedback.map((fb) => (
                                <div key={fb.id} className="text-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-purple-900">{fb.author}</span>
                                    <div className="flex gap-0.5">
                                      {[...Array(fb.rating)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-purple-700">{fb.comment}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No online sessions scheduled yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                      onClick={() => setShowScheduleDialog(true)}
                    >
                      Schedule First Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Topic Details Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mentors Teaching */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Mentors Teaching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTopic.mentors.length > 0 ? (
                    <div className="space-y-3">
                      {selectedTopic.mentors.map((mentorName, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {mentorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{mentorName}</p>
                            <p className="text-sm text-gray-600">Active Mentor</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No mentors assigned yet</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Assign Mentor
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Assessments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTopic.assessments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedTopic.assessments.map((assessment) => (
                        <div key={assessment.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{assessment.title}</h4>
                            <Badge variant="outline">{assessment.type}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{assessment.submissions} submissions</span>
                            <span>Avg: {assessment.avgScore || "Not graded"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No assessments created</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Create Assessment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Feedback Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Student Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTopic.feedback.reviews > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{selectedTopic.feedback.rating}</div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">{selectedTopic.feedback.reviews} reviews</div>
                        <Progress value={(selectedTopic.feedback.rating / 5) * 100} className="h-2" />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Feedback
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No feedback yet</p>
                    <p className="text-sm">Feedback will appear after the topic is completed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Topics Timeline View
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Program Topics Timeline</h2>
                <p className="text-gray-600">Follow the progressive learning path for your program</p>
              </div>
              <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000] w-full sm:w-auto">
                <BookOpen className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </div>

            {/* Timeline Line */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block"></div>

              <div className="space-y-8">
                {topics.map((topic, index) => (
                  <div key={topic.id} className="relative flex flex-col md:flex-row md:items-start md:gap-6">
                    {/* Topic Number Circle */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 font-bold text-lg flex-shrink-0 ${
                        topic.status === "completed"
                          ? "bg-green-500 border-green-500 text-white"
                          : topic.status === "active"
                            ? "bg-blue-500 border-blue-500 text-white"
                            : topic.status === "upcoming"
                              ? "bg-yellow-500 border-yellow-500 text-white"
                              : "bg-gray-200 border-gray-300 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Topic Card */}
                    <Card
                      className="flex-1 cursor-pointer hover:shadow-md transition-shadow w-full"
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getTopicStatusColor(topic.status)}`}>
                              {getTopicIcon(topic.type)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{topic.title}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTopicStatusColor(topic.status)}>{topic.status}</Badge>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {/* Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{topic.completionRate}%</span>
                            </div>
                            <Progress value={topic.completionRate} className="h-2" />
                          </div>

                          {/* Duration */}
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Duration</p>
                              <p className="font-medium">{topic.duration}m</p>
                            </div>
                          </div>

                          {/* Participants */}
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Participants</p>
                              <p className="font-medium">{topic.participants}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Sessions</p>
                              <p className="font-medium">{topic.sessions ? topic.sessions.length : 0}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Payment</p>
                              <p className="font-medium">
                                {topic.sessions && topic.sessions.length > 0
                                  ? topic.sessions.every((s) => s.paymentStatus === "paid")
                                    ? "✅ Paid"
                                    : topic.sessions.some((s) => s.paymentStatus === "pending")
                                      ? "⏳ Pending"
                                      : "📅 Scheduled"
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Mentors */}
                        {topic.mentors.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-gray-600">Mentors:</span>
                              <div className="flex flex-wrap gap-1">
                                {topic.mentors.map((mentor, mentorIndex) => (
                                  <Badge key={mentorIndex} variant="secondary" className="text-xs">
                                    {mentor}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Topics</p>
                      <p className="text-2xl font-bold">{topics.length}</p>
                    </div>
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold">{topics.filter((t) => t.status === "completed").length}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active</p>
                      <p className="text-2xl font-bold">{topics.filter((t) => t.status === "active").length}</p>
                    </div>
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Payments</p>
                      <p className="text-2xl font-bold">
                        {topics.reduce(
                          (acc, t) => acc + (t.sessions?.filter((s) => s.paymentStatus === "paid").length || 0),
                          0,
                        )}
                      </p>
                    </div>
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Feedback Dialog */}
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Session Feedback</DialogTitle>
              <DialogDescription>Provide feedback for the session with {selectedSession?.mentor}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setFeedbackRating(star)} className="focus:outline-none">
                      <Star
                        className={`h-6 w-6 ${
                          star <= feedbackRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your feedback about this session..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitFeedback} className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
