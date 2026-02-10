"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Video,
  Play,
  MessageSquare,
  Star,
  Award,
  TrendingUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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

export default function LearnerProgramPage({ params }: { params: { id: string } }) {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "active":
        return "bg-blue-500"
      case "upcoming":
        return "bg-yellow-500"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/mentee/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{programData.title}</h1>
              <p className="text-gray-600">with {programData.mentor}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  {programData.completedTopics}/{programData.totalTopics} topics completed
                </span>
                <Badge variant="secondary">{programData.focusArea}</Badge>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-[#FFD500]">{programData.progress}%</div>
              <p className="text-sm text-gray-600">Overall Progress</p>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={programData.progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Topics Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Learning Path</CardTitle>
                <CardDescription>Follow your structured learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {topics.map((topic, index) => (
                    <div key={topic.id} className="flex gap-4">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full ${getStatusColor(topic.status)} flex items-center justify-center text-white font-semibold text-sm`}
                        >
                          {index + 1}
                        </div>
                        {index < topics.length - 1 && <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>}
                      </div>

                      {/* Topic card */}
                      <div className="flex-1">
                        <Card
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedTopic === topic.id ? "ring-2 ring-[#FFD500]" : ""
                          }`}
                          onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{topic.title}</CardTitle>
                                <CardDescription>{topic.description}</CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(topic.status)}
                                <Badge variant={topic.status === "completed" ? "default" : "secondary"}>
                                  {topic.status}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {topic.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Topic Details Sidebar */}
          <div className="space-y-6">
            {selectedTopic ? (
              (() => {
                const topic = topics.find((t) => t.id === selectedTopic)!
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full ${getStatusColor(topic.status)} flex items-center justify-center text-white text-sm font-semibold`}
                        >
                          {topics.findIndex((t) => t.id === selectedTopic) + 1}
                        </span>
                        {topic.title}
                      </CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="sessions" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="sessions">Sessions</TabsTrigger>
                          <TabsTrigger value="assessments">Tests</TabsTrigger>
                          <TabsTrigger value="feedback">Feedback</TabsTrigger>
                        </TabsList>

                        <TabsContent value="sessions" className="space-y-4">
                          {topic.sessions.map((session) => (
                            <Card key={session.id}>
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-base">{session.title}</CardTitle>
                                    <CardDescription>
                                      {session.date} at {session.time} • {session.duration}
                                    </CardDescription>
                                  </div>
                                  <Badge variant={session.status === "completed" ? "default" : "secondary"}>
                                    {session.status}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {session.status === "upcoming" && (
                                  <Button className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]" asChild>
                                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                      <Video className="mr-2 h-4 w-4" />
                                      Join Meeting
                                    </a>
                                  </Button>
                                )}

                                {/* Recording not available for now */}

                                {session.status === "completed" && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span>Attendance Confirmed</span>
                                      <div className="flex items-center gap-2">
                                        {session.attendanceConfirmed.trainer && session.attendanceConfirmed.mentor ? (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
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

                        <TabsContent value="assessments" className="space-y-4">
                          {topic.assessments.map((assessment) => (
                            <Card key={assessment.id}>
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base">{assessment.title}</CardTitle>
                                  <Badge variant={assessment.status === "completed" ? "default" : "secondary"}>
                                    {assessment.status}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                {assessment.status === "completed" && assessment.score && (
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Award className="h-4 w-4 text-yellow-500" />
                                      <span className="font-semibold">{assessment.score}%</span>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="w-full"
                                      onClick={() => {
                                        // In real app, navigate to assessment results page
                                        // router.push(`/mentee/dashboard/programs/${params.id}/assessments/${assessment.id}`)
                                        alert("Viewing assessment results...")
                                      }}
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
                                  <Button size="sm" variant="outline" className="w-full">
                                    Not Available Yet
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </TabsContent>

                        <TabsContent value="feedback" className="space-y-4">
                          {/* Give Review & Rating Section */}
                          <Card className="border-2 border-[#FFD500]">
                            <CardHeader>
                              <CardTitle className="text-lg">Give Review & Rating</CardTitle>
                              <CardDescription>Share your feedback about this topic</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label>Your Rating</Label>
                                <div className="flex items-center gap-2">
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
                                    <span className="text-sm text-gray-600 ml-2">{feedbackRating} out of 5</span>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="feedback-comment">Your Feedback</Label>
                                <Textarea
                                  id="feedback-comment"
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
                                  // TODO: Submit feedback via API
                                  // await fetch(`/api/programs/${params.id}/topics/${topic.id}/feedback`, {...})
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

                          {/* Received Feedback Section */}
                          {topic.feedback.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="font-medium text-sm text-gray-700">Feedback from Mentor</h4>
                              {topic.feedback.map((feedback) => (
                                <Card key={feedback.id}>
                                  <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder-avatar.jpg" />
                                        <AvatarFallback>
                                          {feedback.from
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
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
                                  <CardContent>
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
              })()
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
  )
}
