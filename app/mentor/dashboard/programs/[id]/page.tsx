"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
        return "bg-gray-700"
      case "active":
        return "bg-gray-600"
      case "upcoming":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
      case "active":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Active</Badge>
      case "upcoming":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Upcoming</Badge>
      default:
        return <Badge variant="outline">Draft</Badge>
    }
  }

  const router = useRouter()

  return (
    <div className="space-y-0 w-full md:px-6 md:pt-8 md:pb-8">
      <div className="flex flex-col">
        {/* On mobile: back first. On desktop: header first, then back. */}
        <div className="order-2 md:order-1 bg-white border-b w-full px-4 py-4 sm:py-5 md:py-6 md:px-6 -mx-0 md:-mx-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Startup Funding Masterclass</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Mentor LMS Dashboard</p>
        </div>
        <div className="order-1 md:order-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0 font-inherit mb-2 mt-2 md:mt-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 px-0 pt-4 sm:pt-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Active Mentees</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-0.5">12</p>
              </div>
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Sessions Complete</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-0.5">{completedSessions}/{totalSessions}</p>
              </div>
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Earned</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-0.5 truncate">₦{(totalEarnings * 1500).toLocaleString()}</p>
              </div>
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Pending Payment</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-0.5 truncate">₦{(pendingEarnings * 1500).toLocaleString()}</p>
              </div>
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topics Timeline */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-2xl font-semibold text-gray-900">Program Topics Timeline</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-600 mt-0.5">Linear progression through program curriculum</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-5 sm:space-y-4 md:space-y-6">
            {programTopics.map((topic, index) => (
              <div key={topic.id} className="flex flex-row items-stretch gap-0 sm:gap-4">
                {/* Desktop: circle + vertical line. Mobile: hidden (step lives inside card) */}
                <div className="hidden sm:flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full ${getStatusColor(topic.status)} flex items-center justify-center text-white font-semibold text-base shrink-0`}
                  >
                    {index + 1}
                  </div>
                  {index < programTopics.length - 1 && (
                    <div className="w-px h-12 md:h-16 bg-gray-200 mt-1 sm:mt-2 flex-shrink-0" />
                  )}
                </div>

                {/* Topic card: on mobile has left border + step label; desktop unchanged */}
                <Card
                  className={`flex-1 min-w-0 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200 border-l-4 sm:border-l sm:border-l-border ${
                    topic.status === "completed"
                      ? "border-l-green-500"
                      : topic.status === "active"
                        ? "border-l-blue-500"
                        : "border-l-gray-400"
                  }`}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <CardContent className="p-4 sm:p-4">
                    {/* Step label: mobile only, inside card */}
                    <div className="flex items-center gap-2 mb-2 sm:hidden">
                      <span className="text-xs font-medium text-muted-foreground">Step {index + 1}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 leading-tight">{topic.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 line-clamp-2 sm:line-clamp-none">{topic.description}</p>
                      </div>
                      <div className="shrink-0">{getStatusBadge(topic.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2 sm:gap-4 mt-3 sm:mt-4">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Duration</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{topic.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Mentees</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">{topic.participants}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Sessions</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">{topic.sessions.length}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 col-span-2 md:col-span-1">
                        <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Earned</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                            ₦{(topic.sessions
                            .filter((s) => s.paymentStatus === "paid")
                              .reduce((sum, s) => sum + s.amount, 0) * 1500).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {topic.status === "active" && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 font-medium">Progress</span>
                          <span className="font-semibold text-gray-900">
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
      </div>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto w-[95vw] sm:w-full p-4 sm:p-6">
            <DialogHeader className="space-y-1.5 pr-8">
              <DialogTitle className="text-lg sm:text-xl font-semibold leading-tight">{programTopics.find((t) => t.id === selectedTopic)?.title}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-600 line-clamp-2">{programTopics.find((t) => t.id === selectedTopic)?.description}</DialogDescription>
            </DialogHeader>

            <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab}>
              <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1 bg-muted/50">
                <TabsTrigger value="sessions" className="flex-1 min-w-0 text-xs sm:text-sm">Sessions</TabsTrigger>
                <TabsTrigger value="assessments" className="flex-1 min-w-0 text-xs sm:text-sm">Assess</TabsTrigger>
                <TabsTrigger value="links" className="flex-1 min-w-0 text-xs sm:text-sm">Links</TabsTrigger>
                <TabsTrigger value="feedback" className="flex-1 min-w-0 text-xs sm:text-sm">Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="sessions" className="space-y-4 mt-4">
                {programTopics
                  .find((t) => t.id === selectedTopic)
                  ?.sessions.map((session) => (
                    <Card key={session.id}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base leading-tight">{session.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                              {session.date} at {session.time} • {session.duration}
                            </p>
                          </div>
                          <Badge
                            className={
                              session.status === "completed"
                                ? "bg-green-50 text-green-700 border-green-200 text-xs w-fit"
                                : session.status === "upcoming"
                                  ? "bg-orange-50 text-orange-700 border-orange-200 text-xs w-fit"
                                  : "bg-blue-50 text-blue-700 border-blue-200 text-xs w-fit"
                            }
                          >
                            {session.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <p className="text-xs sm:text-sm font-medium">Attendance</p>
                            <div className="flex items-center gap-2">
                              {session.mentorConfirmed ? (
                                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 shrink-0" />
                              )}
                              <span className="text-xs sm:text-sm">Mentor: {session.mentorConfirmed ? "Confirmed" : "Pending"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {session.trainerConfirmed ? (
                                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 shrink-0" />
                              )}
                              <span className="text-xs sm:text-sm">Trainer: {session.trainerConfirmed ? "Confirmed" : "Pending"}</span>
                            </div>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2">
                            <p className="text-xs sm:text-sm font-medium">Payment</p>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs sm:text-sm">₦{(session.amount * 1500).toLocaleString()}</span>
                              <Badge
                                className={
                                  session.paymentStatus === "paid"
                                    ? "bg-green-50 text-green-700 border-green-200 text-xs"
                                    : "bg-orange-50 text-orange-700 border-orange-200 text-xs"
                                }
                              >
                                {session.paymentStatus}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 md:col-span-1">
                            <p className="text-xs sm:text-sm font-medium">Meeting</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">ID: {session.meetingId}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2">
                          {session.status === "upcoming" && session.meetingLink && (
                            <Button size="sm" className="w-full sm:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000]" asChild>
                              <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4 mr-2" />
                                Join Meeting
                              </a>
                            </Button>
                          )}
                          {session.status === "upcoming" && !session.mentorConfirmed && (
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              Confirm Attendance
                            </Button>
                          )}
                          {session.status === "completed" && (
                            <>
                              {session.meetingLink && (
                                <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                                  <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                    <Video className="h-4 w-4 mr-2" />
                                    Join Meeting
                                  </a>
                                </Button>
                              )}
                              {session.recordingUrl && (
                                <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
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
                                  className="w-full sm:w-auto"
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
                                  <Badge className="w-fit bg-green-50 text-green-700 border-green-200 text-xs">Feedback Submitted</Badge>
                                  {session.paymentStatus === "pending" && (
                                    <Button
                                      size="sm"
                                      className="w-full sm:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000] font-medium"
                                      onClick={() => {
                                        console.log("Triggering payment request for session:", session.id)
                                        alert(`Payment request of ₦${(session.amount * 1500).toLocaleString()} has been sent to the facilitator. Payment will be processed after verification.`)
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

              <TabsContent value="assessments" className="space-y-4 mt-4">
                {programTopics
                  .find((t) => t.id === selectedTopic)
                  ?.assessments.map((assessment) => (
                    <Card key={assessment.id}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base">{assessment.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                              Status: {assessment.status}
                              {assessment.avgScore != null && ` • Score: ${assessment.avgScore}%`}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0">
                            <FileText className="h-4 w-4 mr-2" />
                            View Results
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="links" className="space-y-4 mt-4">
                {programTopics
                  .find((t) => t.id === selectedTopic)
                  ?.sessions.flatMap((session) =>
                    (session.facilitatorLinks || []).map((link: any) => ({ ...link, sessionTitle: session.title })),
                  )
                  .map((link: any) => (
                    <Card key={link.id}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                              <LinkIcon className="h-4 w-4 shrink-0" />
                              <span className="truncate">{link.title}</span>
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{link.sessionTitle}</p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0" asChild>
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

              <TabsContent value="feedback" className="space-y-4 mt-4">
                {programTopics
                  .find((t) => t.id === selectedTopic)
                  ?.feedback.map((feedback) => (
                    <Card key={feedback.id}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start mb-2">
                          <h4 className="font-semibold text-sm sm:text-base">{feedback.student}</h4>
                          <div className="flex items-center gap-1 shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{feedback.comment}</p>
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
            <DialogTitle className="text-xl font-semibold">Rate & Provide Feedback to Facilitator</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
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
                className="bg-[#FFD500] text-black hover:bg-[#e6c000] font-medium"
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
