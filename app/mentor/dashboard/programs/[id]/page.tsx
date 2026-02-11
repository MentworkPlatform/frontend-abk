"use client"

import { useState } from "react"
import {
  Calendar,
  Users,
  Clock,
  DollarSign,
  Video,
  CheckCircle,
  XCircle,
  Play,
  FileText,
  ArrowLeft,
  Star,
  Link as LinkIcon,
  ExternalLink,
  MessageSquare,
  Send,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface Props {
  params: { id: string }
}

// Mock data for program topics
const programTopics = [
  {
    id: 1,
    title: "Introduction to Startup Funding",
    description: "Overview of funding landscape and preparation basics",
    status: "completed",
    duration: "2 hours",
    participants: 12,
    sessions: [
      {
        id: 1,
        title: "Funding Landscape Overview",
        date: "2024-01-15",
        time: "10:00 AM",
        duration: "60 min",
        status: "completed",
        mentorConfirmed: true,
        trainerConfirmed: true,
        paymentStatus: "paid",
        amount: 150,
        meetingId: "123-456-789",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        recordingUrl: "https://example.com/recording1",
        facilitatorLinks: [
          { id: 1, title: "Pitch Deck Template", url: "https://example.com/template1", type: "resource" },
          { id: 2, title: "Funding Checklist", url: "https://example.com/checklist1", type: "resource" },
        ],
      },
      {
        id: 2,
        title: "Preparation Strategies",
        date: "2024-01-17",
        time: "10:00 AM",
        duration: "60 min",
        status: "completed",
        mentorConfirmed: true,
        trainerConfirmed: true,
        paymentStatus: "pending",
        amount: 150,
        meetingId: "123-456-790",
        meetingLink: "https://meet.google.com/xyz-uvwx-rst",
        recordingUrl: "https://example.com/recording2",
        facilitatorLinks: [
          { id: 3, title: "Preparation Guide", url: "https://example.com/guide1", type: "resource" },
        ],
      },
    ],
    assessments: [{ id: 1, title: "Funding Readiness Quiz", status: "completed", avgScore: 85 }],
    feedback: [
      { id: 1, student: "John Doe", rating: 5, comment: "Excellent overview of the funding landscape!" },
      { id: 2, student: "Jane Smith", rating: 4, comment: "Very informative, would like more examples." },
    ],
  },
  {
    id: 2,
    title: "Pitch Deck Development",
    description: "Creating compelling pitch presentations for investors",
    status: "active",
    duration: "3 hours",
    participants: 12,
    sessions: [
      {
        id: 3,
        title: "Pitch Structure & Storytelling",
        date: "2024-01-22",
        time: "10:00 AM",
        duration: "90 min",
        status: "completed",
        mentorConfirmed: true,
        trainerConfirmed: true,
        paymentStatus: "paid",
        amount: 200,
        meetingId: "123-456-791",
        meetingLink: "https://zoom.us/j/123456789",
        recordingUrl: "https://example.com/recording3",
        facilitatorLinks: [
          { id: 4, title: "Storytelling Framework", url: "https://example.com/framework1", type: "resource" },
        ],
      },
      {
        id: 4,
        title: "Financial Projections",
        date: "2024-01-24",
        time: "10:00 AM",
        duration: "90 min",
        status: "upcoming",
        mentorConfirmed: false,
        trainerConfirmed: false,
        paymentStatus: "pending",
        amount: 200,
        meetingId: "123-456-792",
        meetingLink: "https://zoom.us/j/987654321",
        recordingUrl: null,
        facilitatorLinks: [],
      },
    ],
    assessments: [{ id: 2, title: "Pitch Deck Review", status: "active", avgScore: null }],
    feedback: [{ id: 3, student: "Mike Johnson", rating: 5, comment: "Great insights on storytelling techniques!" }],
  },
  {
    id: 3,
    title: "Investor Relations",
    description: "Building and maintaining relationships with potential investors",
    status: "upcoming",
    duration: "2.5 hours",
    participants: 12,
    sessions: [
      {
        id: 5,
        title: "Investor Research & Targeting",
        date: "2024-01-29",
        time: "10:00 AM",
        duration: "75 min",
        status: "upcoming",
        mentorConfirmed: false,
        trainerConfirmed: false,
        paymentStatus: "pending",
        amount: 175,
        meetingId: "123-456-793",
        meetingLink: "https://meet.google.com/def-ghij-klm",
        recordingUrl: null,
        facilitatorLinks: [],
      },
      {
        id: 6,
        title: "Communication & Follow-up",
        date: "2024-01-31",
        time: "10:00 AM",
        duration: "75 min",
        status: "upcoming",
        mentorConfirmed: false,
        trainerConfirmed: false,
        paymentStatus: "pending",
        amount: 175,
        meetingId: "123-456-794",
        meetingLink: "https://meet.google.com/nop-qrst-uvw",
        recordingUrl: null,
        facilitatorLinks: [],
      },
    ],
    assessments: [{ id: 3, title: "Investor Outreach Plan", status: "upcoming", avgScore: null }],
    feedback: [],
  },
]

export default function MentorProgramDashboard({ params }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [activeDetailTab, setActiveDetailTab] = useState("sessions")
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [selectedSessionForFeedback, setSelectedSessionForFeedback] = useState<any>(null)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState("")
  // Track which sessions have feedback submitted
  const [sessionsWithFeedback, setSessionsWithFeedback] = useState<Set<number>>(new Set())

  // Calculate overall stats
  const totalSessions = programTopics.flatMap((topic) => topic.sessions).length
  const completedSessions = programTopics
    .flatMap((topic) => topic.sessions)
    .filter((s) => s.status === "completed").length
  const totalEarnings = programTopics
    .flatMap((topic) => topic.sessions)
    .filter((s) => s.paymentStatus === "paid")
    .reduce((sum, s) => sum + s.amount, 0)
  const pendingEarnings = programTopics
    .flatMap((topic) => topic.sessions)
    .filter((s) => s.paymentStatus === "pending")
    .reduce((sum, s) => sum + s.amount, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "active":
        return "bg-blue-500"
      case "upcoming":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>
      case "upcoming":
        return <Badge className="bg-yellow-100 text-yellow-800">Upcoming</Badge>
      default:
        return <Badge variant="outline">Draft</Badge>
    }
  }

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/mentor/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Startup Funding Masterclass</h1>
          <p className="text-muted-foreground">Mentor LMS Dashboard</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Mentees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {completedSessions}/{totalSessions}
                </p>
                <p className="text-sm text-muted-foreground">Sessions Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">₦{(totalEarnings * 1500).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">₦{(pendingEarnings * 1500).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Pending Payment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topics Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Program Topics Timeline</CardTitle>
          <CardDescription>Linear progression through program curriculum</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {programTopics.map((topic, index) => (
              <div key={topic.id} className="flex items-start gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${getStatusColor(topic.status)} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {index + 1}
                  </div>
                  {index < programTopics.length - 1 && <div className="w-0.5 h-16 bg-gray-200 mt-2" />}
                </div>

                {/* Topic card */}
                <Card
                  className="flex-1 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                      </div>
                      {getStatusBadge(topic.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{topic.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{topic.participants} mentees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{topic.sessions.length} sessions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          $
                          {topic.sessions
                            .filter((s) => s.paymentStatus === "paid")
                            .reduce((sum, s) => sum + s.amount, 0)}{" "}
                          earned
                        </span>
                      </div>
                    </div>

                    {topic.status === "active" && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>
                            {Math.round(
                              (topic.sessions.filter((s) => s.status === "completed").length / topic.sessions.length) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (topic.sessions.filter((s) => s.status === "completed").length / topic.sessions.length) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{programTopics.find((t) => t.id === selectedTopic)?.title}</DialogTitle>
              <DialogDescription>{programTopics.find((t) => t.id === selectedTopic)?.description}</DialogDescription>
            </DialogHeader>

            <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="assessments">Assessments</TabsTrigger>
                <TabsTrigger value="links">Facilitator Links</TabsTrigger>
                <TabsTrigger value="feedback">Student Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="sessions" className="space-y-4">
                {programTopics
                  .find((t) => t.id === selectedTopic)
                  ?.sessions.map((session) => (
                    <Card key={session.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold">{session.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {session.date} at {session.time} • {session.duration}
                            </p>
                          </div>
                          <Badge
                            className={
                              session.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : session.status === "upcoming"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }
                          >
                            {session.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Attendance Confirmation</p>
                            <div className="flex items-center gap-2">
                              {session.mentorConfirmed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">
                                Mentor: {session.mentorConfirmed ? "Confirmed" : "Pending"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {session.trainerConfirmed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">
                                Trainer: {session.trainerConfirmed ? "Confirmed" : "Pending"}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium">Payment Status</p>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-sm">₦{(session.amount * 1500).toLocaleString()}</span>
                              <Badge
                                className={
                                  session.paymentStatus === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {session.paymentStatus}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium">Meeting Details</p>
                            <p className="text-sm text-muted-foreground">ID: {session.meetingId}</p>
                            {session.meetingLink && (
                              <Button variant="outline" size="sm" asChild className="mr-2">
                                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Meeting
                                </a>
                              </Button>
                            )}
                            {session.recordingUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer">
                                  <Play className="h-4 w-4 mr-2" />
                                  View Recording
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {session.status === "upcoming" && session.meetingLink && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                              <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4 mr-2" />
                                Join Meeting
                              </a>
                              </Button>
                          )}
                          {session.status === "upcoming" && !session.mentorConfirmed && (
                                <Button variant="outline" size="sm">
                                  Confirm Attendance
                                </Button>
                          )}
                          {session.status === "completed" && (
                            <>
                              {session.recordingUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer">
                                <Play className="h-4 w-4 mr-2" />
                                View Recording
                              </a>
                            </Button>
                              )}
                              {!sessionsWithFeedback.has(session.id) ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedSessionForFeedback(session)
                                    setShowFeedbackDialog(true)
                                    setFeedbackRating(0)
                                    setFeedbackComment("")
                                  }}
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Rate Facilitator
                                </Button>
                              ) : (
                                <>
                                  <Badge className="bg-green-100 text-green-800">Feedback Submitted</Badge>
                                  {session.paymentStatus === "pending" && (
                                    <Button
                                      size="sm"
                                      className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                                      onClick={() => {
                                        // In real app, trigger payment API call to request payment from facilitator
                                        console.log("Triggering payment request for session:", session.id)
                                        alert(`Payment request of ₦${(session.amount * 1500).toLocaleString()} has been sent to the facilitator. Payment will be processed after verification.`)
                                        // In real app, this would send a notification to facilitator and update status
                                      }}
                                    >
                                      <DollarSign className="h-4 w-4 mr-2" />
                                      Request Payment
                                    </Button>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="assessments" className="space-y-4">
                {programTopics
                  .find((t) => t.id === selectedTopic)
                  ?.assessments.map((assessment) => (
                    <Card key={assessment.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{assessment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Status: {assessment.status}
                              {assessment.avgScore && ` • Average Score: ${assessment.avgScore}%`}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Results
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                {programTopics
                  .find((t) => t.id === selectedTopic)
                  ?.sessions.flatMap((session) =>
                    (session.facilitatorLinks || []).map((link: any) => ({ ...link, sessionTitle: session.title })),
                  )
                  .map((link: any) => (
                    <Card key={link.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <LinkIcon className="h-4 w-4" />
                              {link.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">{link.sessionTitle}</p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Link
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {programTopics
                  .find((t) => t.id === selectedTopic)
                  ?.sessions.flatMap((s) => s.facilitatorLinks || []).length === 0 && (
                  <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                      No links uploaded by facilitator yet
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4">
                {programTopics
                  .find((t) => t.id === selectedTopic)
                  ?.feedback.map((feedback) => (
                    <Card key={feedback.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{feedback.student}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                {programTopics.find((t) => t.id === selectedTopic)?.feedback.length === 0 && (
                  <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                      No feedback available yet
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Feedback to Facilitator Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate & Provide Feedback to Facilitator</DialogTitle>
            <DialogDescription>
              Your feedback helps ensure timely payments and improves the program experience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSessionForFeedback && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">{selectedSessionForFeedback.title}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedSessionForFeedback.date} at {selectedSessionForFeedback.time}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    className="focus:outline-none"
                    type="button"
                  >
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
              <Label htmlFor="feedback-comment">Feedback Comment</Label>
              <Textarea
                id="feedback-comment"
                placeholder="Share your feedback about the facilitator and this session..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // In a real app, submit feedback to backend
                  console.log("Feedback submitted:", {
                    sessionId: selectedSessionForFeedback?.id,
                    rating: feedbackRating,
                    comment: feedbackComment,
                  })
                  // Mark session as having feedback submitted
                  if (selectedSessionForFeedback?.id) {
                    setSessionsWithFeedback((prev) => new Set(prev).add(selectedSessionForFeedback.id))
                  }
                  setShowFeedbackDialog(false)
                  setFeedbackRating(0)
                  setFeedbackComment("")
                  setSelectedSessionForFeedback(null)
                }}
                className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                disabled={feedbackRating === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
