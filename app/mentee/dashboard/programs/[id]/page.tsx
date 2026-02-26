"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Video,
  Play,
  Star,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"

// Mock data for the program
const programData = {
  id: 1,
  title: "Leadership Excellence Program",
  mentor: "Sarah Johnson",
  description: "Develop essential leadership skills through practical exercises and real-world applications.",
  progress: 75,
  totalTopics: 8,
  completedTopics: 6,
  focusArea: "Leadership & People",
  startDate: "2024-01-15",
  endDate: "2024-03-15",
}

const topics = [
  {
    id: 1,
    title: "Introduction to Leadership",
    description: "Understanding leadership fundamentals and personal leadership style",
    status: "completed",
    duration: "2 hours",
    mentor: "Sarah Johnson",
    sessions: [
      {
        id: 1,
        title: "Leadership Foundations",
        date: "2024-01-15",
        time: "2:00 PM",
        duration: "60 min",
        status: "completed",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        recording: null,
        attendanceConfirmed: { trainer: true, mentor: true },
        paymentStatus: "paid",
      },
    ],
    assessments: [{ id: 1, title: "Leadership Style Assessment", status: "completed", score: 85 }],
    feedback: [{ id: 1, from: "Sarah Johnson", rating: 5, comment: "Excellent engagement and thoughtful questions!" }],
  },
  {
    id: 2,
    title: "Communication Skills",
    description: "Mastering effective communication techniques for leaders",
    status: "completed",
    duration: "2.5 hours",
    mentor: "Sarah Johnson",
    sessions: [
      {
        id: 2,
        title: "Active Listening Techniques",
        date: "2024-01-22",
        time: "2:00 PM",
        duration: "90 min",
        status: "completed",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        recording: null,
        attendanceConfirmed: { trainer: true, mentor: true },
        paymentStatus: "paid",
      },
    ],
    assessments: [{ id: 2, title: "Communication Effectiveness", status: "completed", score: 92 }],
    feedback: [{ id: 2, from: "Sarah Johnson", rating: 5, comment: "Great improvement in communication clarity!" }],
  },
  {
    id: 3,
    title: "Team Building & Motivation",
    description: "Building high-performing teams and motivating team members",
    status: "active",
    duration: "3 hours",
    mentor: "Sarah Johnson",
    sessions: [
      {
        id: 3,
        title: "Team Dynamics Workshop",
        date: "2024-02-05",
        time: "2:00 PM",
        duration: "120 min",
        status: "upcoming",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        attendanceConfirmed: { trainer: false, mentor: false },
        paymentStatus: "pending",
      },
    ],
    assessments: [{ id: 3, title: "Team Leadership Scenario", status: "pending", score: null }],
    feedback: [],
  },
  {
    id: 4,
    title: "Decision Making & Problem Solving",
    description: "Strategic decision-making frameworks and problem-solving techniques",
    status: "upcoming",
    duration: "2.5 hours",
    mentor: "Sarah Johnson",
    sessions: [
      {
        id: 4,
        title: "Decision Making Frameworks",
        date: "2024-02-12",
        time: "2:00 PM",
        duration: "90 min",
        status: "scheduled",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        attendanceConfirmed: { trainer: false, mentor: false },
        paymentStatus: "pending",
      },
    ],
    assessments: [{ id: 4, title: "Case Study Analysis", status: "not_started", score: null }],
    feedback: [],
  },
]

type Topic = (typeof topics)[number]

function TopicDetailPanel({
  topic,
  topicIndex,
  getStatusColor,
  feedbackRating,
  setFeedbackRating,
  feedbackComment,
  setFeedbackComment,
  isSubmittingFeedback,
  setIsSubmittingFeedback,
  testLink,
  setTestLink,
}: {
  topic: Topic
  topicIndex: number
  getStatusColor: (status: string) => string
  feedbackRating: number
  setFeedbackRating: (n: number) => void
  feedbackComment: string
  setFeedbackComment: (s: string) => void
  isSubmittingFeedback: boolean
  setIsSubmittingFeedback: (b: boolean) => void
  testLink: string
  setTestLink: (s: string) => void
}) {
  return (
    <Card className="bg-gray-50/80 border border-gray-200">
      <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <span
            className={`w-6 h-6 rounded-full ${getStatusColor(topic.status)} flex items-center justify-center text-white text-sm font-semibold shrink-0`}
          >
            {topicIndex + 1}
          </span>
          {topic.title}
        </CardTitle>
        <CardDescription className="text-sm">{topic.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <Tabs defaultValue="sessions" className="w-full" key={topic.id}>
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="sessions" className="text-xs sm:text-sm">Sessions</TabsTrigger>
            <TabsTrigger value="assessments" className="text-xs sm:text-sm">Tests</TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs sm:text-sm">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-3 sm:space-y-4 mt-3">
            {topic.sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader className="pb-2 p-4 sm:pb-3 sm:p-6">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-sm sm:text-base">{session.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {session.date} at {session.time} • {session.duration}
                      </CardDescription>
                    </div>
                    <Badge variant={session.status === "completed" ? "default" : "secondary"} className="text-xs shrink-0">
                      {session.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-4 pt-0 sm:p-6 sm:pt-0">
                  {session.status === "upcoming" && (
                    <Button className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000] text-sm" asChild>
                      <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                        <Video className="mr-2 h-4 w-4" />
                        Join Meeting
                      </a>
                    </Button>
                  )}
                  {session.status === "completed" && (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Attendance Confirmed</span>
                        <div className="flex items-center gap-2">
                          {session.attendanceConfirmed.trainer && session.attendanceConfirmed.mentor ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Payment Status</span>
                        <Badge variant={session.paymentStatus === "paid" ? "default" : "secondary"}>
                          {session.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="assessments" className="space-y-3 sm:space-y-4 mt-3">
            {topic.assessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader className="pb-2 p-4 sm:pb-3 sm:p-6">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-sm sm:text-base">{assessment.title}</CardTitle>
                    <Badge variant={assessment.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {assessment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  {assessment.status === "completed" && assessment.score != null && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{assessment.score}%</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => alert("Viewing assessment results...")}
                      >
                        View Results
                      </Button>
                    </div>
                  )}
                  {assessment.status === "pending" && (
                    <Button size="sm" className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
                      Start Assessment
                    </Button>
                  )}
                  {assessment.status === "not_started" && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">Test link not provided yet</p>
                      <div className="space-y-2">
                        <Label htmlFor={`test-link-${topic.id}-${assessment.id}`}>Add Test Link (Optional)</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`test-link-${topic.id}-${assessment.id}`}
                            type="url"
                            placeholder="https://..."
                            value={testLink}
                            onChange={(e) => setTestLink(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                            onClick={() => {
                              if (testLink) {
                                alert("Test link saved!")
                                setTestLink("")
                              }
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4 mt-3">
            <Card className="border-2 border-[#FFD500]">
              <CardHeader className="pb-2 p-4 sm:pb-6 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Give Review & Rating</CardTitle>
                <CardDescription className="text-sm">Share your feedback about this topic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
                <div className="space-y-2">
                  <Label>Your Rating</Label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= feedbackRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    {feedbackRating > 0 && (
                      <span className="text-sm text-gray-600">{feedbackRating} out of 5</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`feedback-comment-${topic.id}`}>Your Feedback</Label>
                  <Textarea
                    id={`feedback-comment-${topic.id}`}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Share your thoughts about this topic..."
                    rows={4}
                  />
                </div>
                <Button
                  className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                  disabled={feedbackRating === 0 || !feedbackComment.trim() || isSubmittingFeedback}
                  onClick={async () => {
                    setIsSubmittingFeedback(true)
                    setTimeout(() => {
                      setIsSubmittingFeedback(false)
                      alert("Feedback submitted successfully!")
                      setFeedbackRating(0)
                      setFeedbackComment("")
                    }, 1000)
                  }}
                >
                  {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                </Button>
              </CardContent>
            </Card>
            {topic.feedback.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Feedback from Mentor</h4>
                {topic.feedback.map((feedback) => (
                  <Card key={feedback.id}>
                    <CardHeader className="pb-2 p-4 sm:pb-3 sm:p-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-avatar.jpg" />
                          <AvatarFallback>
                            {feedback.from.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{feedback.from}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < feedback.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                      <p className="text-sm text-gray-600">{feedback.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function LearnerProgramPage({ params }: { params: { id: string } }) {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [testLink, setTestLink] = useState("")

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-white" />
      case "active":
        return <Play className="h-4 w-4 text-white" />
      case "upcoming":
        return <Clock className="h-4 w-4 text-white" />
      default:
        return <Clock className="h-4 w-4 text-white" />
    }
  }

  const router = useRouter()

  return (
    <div className="space-y-6 md:px-6 md:pt-8 md:pb-8">
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0 font-inherit"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <DashboardHeader
        title={programData.title}
        description={`with ${programData.mentor} • ${programData.completedTopics}/${programData.totalTopics} topics completed`}
        />
      </div>

      <div className="w-full">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="space-y-3 p-0">
            <div className="flex items-center justify-between">
                <Badge variant="secondary">{programData.focusArea}</Badge>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-semibold text-[#FFD500]">{programData.progress}%</div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Overall Progress</p>
              </div>
            </div>
            <Progress value={programData.progress} className="h-2" />
          </CardContent>
        </Card>

        <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Topics Timeline - on mobile: accordion (detail below selected card); on lg: list + sidebar */}
          <div className="lg:col-span-2 space-y-0">
            <Card>
              <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
                <CardTitle className="text-base sm:text-lg">Learning Path</CardTitle>
                <CardDescription className="text-sm">Follow your structured learning journey</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4 sm:space-y-6 sm:p-6 sm:pt-0">
                  {topics.map((topic, index) => (
                    <div key={topic.id}>
                    <div className="flex gap-3 sm:gap-4 items-stretch">
                      {/* Timeline indicator — line stretches to next number */}
                      <div className="flex flex-col items-center flex-shrink-0 self-stretch">
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${getStatusColor(topic.status)} flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0`}
                        >
                          {index + 1}
                        </div>
                        {index < topics.length - 1 && (
                          <div className="w-0.5 flex-1 min-h-3 bg-gray-200 rounded-full mt-0.5" />
                        )}
                      </div>

                      {/* Topic card */}
                      <div className="flex-1 min-w-0 flex flex-col min-h-0">
                        <Card
                          className={`cursor-pointer transition-all hover:shadow-md flex-1 flex flex-col min-h-0 ${
                            selectedTopic === topic.id ? "ring-2 ring-[#FFD500]" : ""
                          }`}
                          onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                        >
                          <CardHeader className="p-4 sm:pb-3 sm:p-6">
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <CardTitle className="text-base sm:text-lg leading-tight">{topic.title}</CardTitle>
                                <CardDescription className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-none">{topic.description}</CardDescription>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                                {getStatusIcon(topic.status)}
                                <Badge variant={topic.status === "completed" ? "default" : "secondary"} className="text-xs">
                                  {topic.status}
                                </Badge>
                                <span className="lg:hidden text-muted-foreground">
                                  {selectedTopic === topic.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                                  {topic.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                                  {topic.mentor}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>
                                  {topic.sessions.length} session{topic.sessions.length !== 1 ? "s" : ""}
                                </span>
                                <span>•</span>
                                <span>
                                  {topic.assessments.length} assessment{topic.assessments.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                      {/* Mobile: expand-in-place accordion — topic detail below card when selected */}
                      {selectedTopic === topic.id && (
                        <div className="mt-4 lg:hidden w-full">
                          <TopicDetailPanel
                            topic={topic}
                            topicIndex={index}
                            getStatusColor={getStatusColor}
                            feedbackRating={feedbackRating}
                            setFeedbackRating={setFeedbackRating}
                            feedbackComment={feedbackComment}
                            setFeedbackComment={setFeedbackComment}
                            isSubmittingFeedback={isSubmittingFeedback}
                            setIsSubmittingFeedback={setIsSubmittingFeedback}
                            testLink={testLink}
                            setTestLink={setTestLink}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* Topic Details Sidebar — desktop only */}
          <div className="hidden lg:block space-y-6">
            {selectedTopic ? (
              <TopicDetailPanel
                topic={topics.find((t) => t.id === selectedTopic)!}
                topicIndex={topics.findIndex((t) => t.id === selectedTopic)}
                getStatusColor={getStatusColor}
                feedbackRating={feedbackRating}
                setFeedbackRating={setFeedbackRating}
                feedbackComment={feedbackComment}
                setFeedbackComment={setFeedbackComment}
                isSubmittingFeedback={isSubmittingFeedback}
                setIsSubmittingFeedback={setIsSubmittingFeedback}
                testLink={testLink}
                setTestLink={setTestLink}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <TrendingUp className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Select a topic to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
