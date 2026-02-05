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
  AlertCircle,
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function ProgramManagementPage() {
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
    mentorsRequired: 5,
    mentorsAccepted: 3,
    mentorsPending: 2,
    canPublish: false,
  })

  const [mentorInvites] = useState([
    {
      id: "1",
      mentorName: "Sarah Johnson",
      expertise: "SEO & Content Strategy",
      status: "accepted",
      invitedDate: "2024-01-10",
      respondedDate: "2024-01-12",
    },
    {
      id: "2",
      mentorName: "Michael Chen",
      expertise: "Social Media & Analytics",
      status: "accepted",
      invitedDate: "2024-01-08",
      respondedDate: "2024-01-10",
    },
    {
      id: "3",
      mentorName: "Emily Rodriguez",
      expertise: "Email Marketing",
      status: "pending",
      invitedDate: "2024-01-15",
    },
    {
      id: "4",
      mentorName: "David Wilson",
      expertise: "E-commerce",
      status: "pending",
      invitedDate: "2024-01-12",
    },
  ])

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

  const [topicsState, setTopicsState] = useState(topics)
  const [selectedTopic, setSelectedTopic] = useState<typeof topics[0] | null>(null)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showAssignMentorDialog, setShowAssignMentorDialog] = useState(false)
  const [selectedMentorForAssignment, setSelectedMentorForAssignment] = useState<string>("")

  const acceptedMentors = mentorInvites.filter((m) => m.status === "accepted")
  const pendingMentors = mentorInvites.filter((m) => m.status === "pending")

  const handleAttendanceConfirmation = (topicId: string, sessionId: string, type: string) => {
    console.log(`[v0] Confirming ${type} attendance for session ${sessionId} in topic ${topicId}`)
    // This would update the session confirmation status
  }

  const handleScheduleSession = (sessionData: any) => {
    console.log(`[v0] Scheduling new session:`, sessionData)
    setShowScheduleDialog(false)
    // This would create a new session with meeting link generation
  }

  const handleJoinMeeting = (meetingLink: string) => {
    console.log(`[v0] Opening meeting link: ${meetingLink}`)
    window.open(meetingLink, "_blank")
  }

  const handleAssignMentor = () => {
    if (!selectedTopic || !selectedMentorForAssignment) {
      console.error("Cannot assign mentor: missing selectedTopic or selectedMentorForAssignment")
      return
    }
    
    // Check if mentor is already assigned
    if (selectedTopic.mentors.includes(selectedMentorForAssignment)) {
      alert("This mentor is already assigned to this topic")
      return
    }
    
    const topicId = selectedTopic.id
    const newMentors = [...selectedTopic.mentors, selectedMentorForAssignment]
    
    // Update both states
    setTopicsState((prevTopics) =>
      prevTopics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              mentors: newMentors,
            }
          : topic
      )
    )
    
    // Update selectedTopic immediately
    setSelectedTopic({
      ...selectedTopic,
      mentors: newMentors,
    })
    
    setShowAssignMentorDialog(false)
    setSelectedMentorForAssignment("")
  }

  const getPaymentStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "default"
      case "pending":
        return "secondary"
      default:
        return "outline"
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
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 py-4">
            <Button variant="ghost" size="icon" className="h-9 w-9 -ml-2" asChild>
              <Link href="/trainer/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-semibold text-gray-900 truncate">{program.title}</h1>
                  <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                    <Badge 
                      variant={program.status === "active" ? "default" : "secondary"} 
                      className="text-xs font-medium"
                    >
                      {program.status}
                    </Badge>
                    <span className="text-sm text-gray-600 font-medium">
                      {program.participants}/{program.maxParticipants} participants
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-6">
        <Tabs defaultValue="pre-launch" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pre-launch" className="font-medium">Pre-Launch</TabsTrigger>
            <TabsTrigger value="management" className="font-medium">Program Management</TabsTrigger>
          </TabsList>

          {/* Pre-Launch Tab */}
          <TabsContent value="pre-launch" className="space-y-6">
            {/* Mentor Requirements Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Users className="h-5 w-5" />
                  Mentor Requirements
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1.5">
                  You need at least 1 mentor to accept before you can publish this program to the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">Mentors Accepted</span>
                    <span className="text-2xl font-semibold text-green-600">{acceptedMentors.length}</span>
                  </div>
                  <Progress value={(acceptedMentors.length / program.mentorsRequired) * 100} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {acceptedMentors.length} of {program.mentorsRequired} mentors accepted
                    </span>
                    <span>{pendingMentors.length} pending responses</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentor Invite Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Mentor Invite Status</CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1.5">Track the status of your mentor invitations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentorInvites.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(invite.status)}
                        <div>
                          <h4 className="font-semibold text-gray-900">{invite.mentorName}</h4>
                          <p className="text-sm text-gray-600 mt-0.5">{invite.expertise}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">
                            Invited: {new Date(invite.invitedDate).toLocaleDateString()}
                          </p>
                          {invite.respondedDate && (
                            <p className="text-muted-foreground">
                              Responded: {new Date(invite.respondedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Badge variant={getStatusColor(invite.status)}>{invite.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Publish Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Marketplace Publishing</CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1.5">
                  {acceptedMentors.length >= 1
                    ? "Your program meets the requirements and can be published to the marketplace"
                    : "You need at least 1 mentor to accept before publishing"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {acceptedMentors.length >= 1 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className="font-semibold text-gray-900">
                      {acceptedMentors.length >= 1 ? "Ready to Publish" : "Waiting for Mentors"}
                    </span>
                  </div>
                  <Button
                    disabled={acceptedMentors.length < 1}
                    className="bg-[#FFD500] text-black hover:bg-[#e6c000] disabled:opacity-50 font-medium"
                  >
                    Publish to Marketplace
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            {selectedTopic ? (
              // Topic Detail View
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="h-9 w-9 -ml-2" onClick={() => setSelectedTopic(null)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${getTopicStatusColor(selectedTopic.status)} flex-shrink-0`}>
                      {getTopicIcon(selectedTopic.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-gray-900 truncate">{selectedTopic.title}</h2>
                      <p className="text-sm text-gray-600 mt-1 truncate">{selectedTopic.description}</p>
                    </div>
                  </div>
                </div>

                {/* Topic Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Participants</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{selectedTopic.participants}</p>
                        </div>
                        <Users className="h-6 w-6 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Completion</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{selectedTopic.completionRate}%</p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Duration</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{selectedTopic.duration}m</p>
                        </div>
                        <Clock className="h-6 w-6 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Rating</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{selectedTopic.feedback.rating || "N/A"}</p>
                        </div>
                        <BarChart3 className="h-6 w-6 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                          <Video className="h-5 w-5" />
                          Online Sessions & Payment Tracking
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1.5">
                          Schedule and manage online meetings for this topic. Both trainer and mentor must confirm
                          attendance for payment processing.
                        </CardDescription>
                      </div>
                      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule Session
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">Schedule Online Session</DialogTitle>
                            <DialogDescription className="text-sm text-gray-600">
                              Create a new online session for {selectedTopic.title}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                                <Input id="date" type="date" className="text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                                <Input id="time" type="time" className="text-sm" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mentor" className="text-sm font-medium">Select Mentor</Label>
                              <Select>
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="Choose a mentor" />
                                </SelectTrigger>
                                <SelectContent>
                                  {acceptedMentors.map((mentor) => (
                                    <SelectItem key={mentor.id} value={mentor.mentorName} className="text-sm">
                                      {mentor.mentorName} - {mentor.expertise}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="amount" className="text-sm font-medium">Payment Amount (₦)</Label>
                              <Input id="amount" type="number" placeholder="225000" className="text-sm" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <Button variant="outline" onClick={() => setShowScheduleDialog(false)} className="font-medium">
                                Cancel
                              </Button>
                              <Button onClick={() => handleScheduleSession({})} className="font-medium bg-[#FFD500] text-black hover:bg-[#e6c000]">
                                Schedule Session
                              </Button>
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
                            <div className="flex items-center justify-between mb-3">
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
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Video className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-800">Online Meeting</span>
                                </div>
                                <div className="flex items-center gap-2">
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
                                  {"recordingUrl" in session && session.recordingUrl && (
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                      onClick={() =>
                                        handleAttendanceConfirmation(selectedTopic.id, session.id, "trainer")
                                      }
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
                            <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                              {session.trainerConfirmed && session.mentorConfirmed
                                ? session.paymentStatus === "paid"
                                  ? "✅ Payment processed successfully"
                                  : "⏳ Payment will be processed within 24 hours"
                                : "⚠️ Both trainer and mentor confirmation required for payment processing"}
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
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
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
                                <p className="font-semibold text-gray-900">{mentorName}</p>
                                <p className="text-sm text-gray-600 mt-0.5">Active Mentor</p>
                              </div>
                            </div>
                          ))}
                          <Dialog open={showAssignMentorDialog} onOpenChange={setShowAssignMentorDialog}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full font-medium">
                                <Plus className="h-4 w-4 mr-2" />
                                Assign Another Mentor
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="text-xl font-semibold">Assign Mentor to {selectedTopic.title}</DialogTitle>
                                <DialogDescription className="text-sm text-gray-600">
                                  Select a mentor from your accepted mentors to assign to this topic
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="mentor-select" className="text-sm font-medium">Select Mentor</Label>
                                  <Select
                                    value={selectedMentorForAssignment}
                                    onValueChange={setSelectedMentorForAssignment}
                                  >
                                    <SelectTrigger className="text-sm">
                                      <SelectValue placeholder="Choose a mentor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {acceptedMentors
                                        .filter((mentor) => !selectedTopic.mentors.includes(mentor.mentorName))
                                        .map((mentor) => (
                                          <SelectItem key={mentor.id} value={mentor.mentorName} className="text-sm">
                                            {mentor.mentorName} - {mentor.expertise}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                  {acceptedMentors.filter((mentor) => !selectedTopic.mentors.includes(mentor.mentorName)).length === 0 && (
                                    <p className="text-xs text-gray-500 mt-1">All accepted mentors are already assigned to this topic</p>
                                  )}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                  <Button variant="outline" onClick={() => setShowAssignMentorDialog(false)} className="font-medium">
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleAssignMentor}
                                    disabled={!selectedMentorForAssignment}
                                    className="font-medium bg-[#FFD500] text-black hover:bg-[#e6c000]"
                                  >
                                    Assign Mentor
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-medium">No mentors assigned yet</p>
                          <Dialog open={showAssignMentorDialog} onOpenChange={setShowAssignMentorDialog}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="mt-2 bg-transparent font-medium">
                                Assign Mentor
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="text-xl font-semibold">Assign Mentor to {selectedTopic.title}</DialogTitle>
                                <DialogDescription className="text-sm text-gray-600">
                                  Select a mentor from your accepted mentors to assign to this topic
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="mentor-select" className="text-sm font-medium">Select Mentor</Label>
                                  <Select
                                    value={selectedMentorForAssignment}
                                    onValueChange={setSelectedMentorForAssignment}
                                  >
                                    <SelectTrigger className="text-sm">
                                      <SelectValue placeholder="Choose a mentor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {acceptedMentors
                                        .filter((mentor) => !selectedTopic.mentors.includes(mentor.mentorName))
                                        .map((mentor) => (
                                          <SelectItem key={mentor.id} value={mentor.mentorName} className="text-sm">
                                            {mentor.mentorName} - {mentor.expertise}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                  {acceptedMentors.filter((mentor) => !selectedTopic.mentors.includes(mentor.mentorName)).length === 0 && (
                                    <p className="text-xs text-gray-500 mt-1">All accepted mentors are already assigned to this topic</p>
                                  )}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                  <Button variant="outline" onClick={() => setShowAssignMentorDialog(false)} className="font-medium">
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleAssignMentor}
                                    disabled={!selectedMentorForAssignment}
                                    className="font-medium bg-[#FFD500] text-black hover:bg-[#e6c000]"
                                  >
                                    Assign Mentor
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </CardContent>
                  </Card>

              {/* Assessments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
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
                            <h4 className="font-semibold text-gray-900">{assessment.title}</h4>
                            <Badge variant="outline">{assessment.type}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>{assessment.submissions} submissions</span>
                            <span>Avg: {assessment.avgScore || "Not graded"}</span>
                          </div>
                          {(assessment as any).link && typeof (assessment as any).link === "string" && (
                            <div className="mt-2">
                              <a
                                href={(assessment as any).link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                View Assessment Link
                              </a>
                            </div>
                          )}
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
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <MessageSquare className="h-5 w-5" />
                      Student Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTopic.feedback.reviews > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-semibold text-gray-900">{selectedTopic.feedback.rating}</div>
                            <div className="text-sm text-gray-600 font-medium mt-1">Average Rating</div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-600 mb-1.5 font-medium">{selectedTopic.feedback.reviews} reviews</div>
                            <Progress value={(selectedTopic.feedback.rating / 5) * 100} className="h-2" />
                          </div>
                        </div>
                        <Button variant="outline" className="w-full bg-transparent font-medium">
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
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Program Topics Timeline</h2>
                    <p className="text-gray-600">Follow the progressive learning path for your program</p>
                  </div>
                  <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add Topic
                  </Button>
                </div>

                {/* Quick Stats - Moved to Top */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Total Topics</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{topicsState.length}</p>
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
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{topicsState.filter((t) => t.status === "completed").length}</p>
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
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{topicsState.filter((t) => t.status === "active").length}</p>
                        </div>
                        <Clock className="h-6 w-6 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Payments</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">
                            {topicsState.reduce(
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

                {/* Timeline Line */}
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                  <div className="space-y-8">
                    {topicsState.map((topic, index) => (
                      <div key={topic.id} className="relative flex items-start gap-6">
                        {/* Topic Number Circle */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 font-bold text-lg ${
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
                          className="flex-1 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            // Always get the latest topic from topicsState
                            const latestTopic = topicsState.find((t) => t.id === topic.id)
                            if (latestTopic) {
                              setSelectedTopic(latestTopic)
                            }
                          }}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`p-3 rounded-lg ${getTopicStatusColor(topic.status)} flex-shrink-0`}>
                                  {getTopicIcon(topic.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">{topic.title}</CardTitle>
                                      <p className="text-sm text-gray-600 mt-0.5">{topic.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <Badge className={getTopicStatusColor(topic.status)}>{topic.status}</Badge>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="pt-0 space-y-4">
                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{topic.completionRate}%</span>
                              </div>
                              <Progress value={topic.completionRate} className="h-2" />
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500">Duration</p>
                                  <p className="text-sm font-medium">{topic.duration}m</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500">Participants</p>
                                  <p className="text-sm font-medium">{topic.participants}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500">Sessions</p>
                                  <p className="text-sm font-medium">{topic.sessions ? topic.sessions.length : 0}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500">Payment</p>
                                  <p className="text-sm font-medium">
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
                              <div className="pt-3 border-t">
                                <div className="flex items-center gap-2">
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
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
