"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Users, Plus, Target, Clock, Star, CheckCircle, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock data for active programs
const activePrograms = [
  {
    id: 1,
    title: "Startup Funding Masterclass",
    mentees: 12,
    nextSession: "Tomorrow, 10:00 AM",
    totalSessions: 8,
    completedSessions: 3,
    expectedPayout: 14400,
    status: "active",
    focusArea: "Finance & Funding",
  },
  {
    id: 2,
    title: "Leadership Development",
    mentees: 6,
    nextSession: "Friday, 2:00 PM",
    totalSessions: 12,
    completedSessions: 8,
    expectedPayout: 18000,
    status: "active",
    focusArea: "Leadership & People",
  },
]

// Mock data for teaching opportunities
const teachingOpportunities = [
  {
    id: 3,
    title: "Digital Marketing Strategy",
    creator: "TechStart Academy",
    type: "Group Program",
    duration: "6 weeks",
    estimatedMentees: 15,
    compensation: "₦225,000/session",
    totalCompensation: 1800,
    focusArea: "Branding/Marketing/Sales",
    description: "Teach entrepreneurs how to build effective digital marketing strategies for their startups.",
    requirements: ["3+ years marketing experience", "Previous teaching experience preferred"],
  },
  {
    id: 4,
    title: "Operations Excellence Workshop",
    creator: "Business Growth Institute",
    type: "Workshop Series",
    duration: "4 weeks",
    estimatedMentees: 20,
    compensation: "₦300,000/session",
    totalCompensation: 1600,
    focusArea: "Operations & Innovation",
    description: "Guide business owners through operational optimization and process improvement.",
    requirements: ["Operations management background", "Case study examples"],
  },
  {
    id: 5,
    title: "Strategic Planning Bootcamp",
    creator: "Entrepreneur Hub",
    type: "Intensive Program",
    duration: "8 weeks",
    estimatedMentees: 10,
    compensation: "₦450,000/session",
    totalCompensation: 4800,
    focusArea: "Strategy & Planning",
    description: "Help business leaders develop comprehensive strategic plans for growth.",
    requirements: ["Strategic planning experience", "C-level experience preferred"],
  },
]

// Mock data for suggested opportunities
const suggestedOpportunities = [
  {
    id: 6,
    title: "Corporate Governance Essentials",
    creator: "Legal & Business Academy",
    type: "Group Program",
    duration: "5 weeks",
    estimatedMentees: 12,
    compensation: "₦375,000/session",
    totalCompensation: 3000,
    focusArea: "Governance & Impact",
    matchScore: 95,
    description: "Teach business owners about corporate governance, compliance, and ethical business practices.",
    whyRecommended: "Matches your legal background and governance expertise",
  },
  {
    id: 7,
    title: "Impact Measurement Workshop",
    creator: "Social Enterprise Network",
    type: "Workshop Series",
    duration: "3 weeks",
    estimatedMentees: 8,
    compensation: "₦300,000/session",
    totalCompensation: 1200,
    focusArea: "Governance & Impact",
    matchScore: 88,
    description: "Guide social entrepreneurs in measuring and reporting their social impact.",
    whyRecommended: "Aligns with your interest in social impact and measurement",
  },
]

// Mock data for upcoming sessions schedule
const upcomingSessions = [
  {
    id: 1,
    programTitle: "Startup Funding Masterclass",
    topic: "Topic 3: Pitch Deck Essentials",
    time: "Tomorrow, 10:00 AM",
    duration: "90 minutes",
    mentees: 12,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    meetingId: "123-456-789",
  },
  {
    id: 2,
    programTitle: "Leadership Development",
    topic: "Topic 9: Conflict Resolution",
    time: "Friday, 2:00 PM",
    duration: "60 minutes",
    mentees: 6,
    meetingLink: "https://zoom.us/j/123456789",
    meetingId: "123 456 789",
  },
  {
    id: 3,
    programTitle: "Startup Funding Masterclass",
    topic: "Topic 4: Investor Relations",
    time: "Next Monday, 10:00 AM",
    duration: "90 minutes",
    mentees: 12,
    meetingLink: "https://meet.google.com/xyz-uvwx-rst",
    meetingId: "987-654-321",
  },
]

// 6 Focus Area Pillars data
const focusAreas = [
  { name: "Leadership & People", taught: true, color: "bg-gray-700" },
  { name: "Strategy & Planning", taught: false, color: "bg-gray-600" },
  { name: "Branding/Marketing/Sales", taught: false, color: "bg-gray-500" },
  { name: "Finance & Funding", taught: true, color: "bg-gray-700" },
  { name: "Operations & Innovation", taught: false, color: "bg-gray-600" },
  { name: "Governance & Impact", taught: false, color: "bg-gray-500" },
]

export default function MentorDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("opportunities")
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)

  // Calculate progress across pillars
  const taughtAreas = focusAreas.filter((area) => area.taught).length
  const progressPercentage = (taughtAreas / focusAreas.length) * 100

  const handleRequestToTeach = (opportunity: any) => {
    setSelectedOpportunity(opportunity)
    setShowRequestModal(true)
  }

  const handleSubmitRequest = () => {
    // In real app, this would submit request to backend
    console.log("Request submitted for:", selectedOpportunity?.title)
    setShowRequestModal(false)
    setSelectedOpportunity(null)
  }

  return (
    <div className="w-full">
      <DashboardHeader
        title="Welcome back"
        description="Manage your teaching programs and sessions"
      />

      <div className="w-full pt-2 space-y-6 sm:space-y-8 md:px-6 md:pt-8 md:pb-8">
      {/* Upcoming Sessions Schedule */}
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Your Upcoming Sessions
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Next sessions scheduled with meeting links</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 gap-3 sm:gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm sm:text-base">{session.programTitle}</h4>
                    <Badge variant="outline" className="text-xs">
                      {session.topic}
                    </Badge>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.time} ({session.duration})
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {session.mentees} mentees
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right text-xs sm:text-sm hidden sm:block">
                    <p className="font-mono text-muted-foreground">ID: {session.meetingId}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => window.open(session.meetingLink, "_blank")}
                    className="bg-[#FFD500] text-black hover:bg-[#e6c000] whitespace-nowrap w-full sm:w-auto"
                  >
                    Join Meeting
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Programs */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                Active Programs
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Programs you are currently teaching</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => router.push("/programs?view=mentor")}>
              Explore Programs
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {activePrograms.map((program) => (
              <Card key={program.id} className="border">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg leading-tight">{program.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{program.focusArea}</CardDescription>
                    </div>
                    <Badge className="bg-[#FFD500] text-black shrink-0">{program.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-muted-foreground">Mentees</p>
                      <p className="font-medium">{program.mentees}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sessions</p>
                      <p className="font-medium">{program.completedSessions}/{program.totalSessions}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {Math.round((program.completedSessions / program.totalSessions) * 100)}%
                      </span>
                    </div>
                    <Progress value={(program.completedSessions / program.totalSessions) * 100} />
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Next Session</p>
                      <p className="text-xs sm:text-sm font-medium truncate">{program.nextSession}</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full sm:w-auto" asChild>
                      <Link href={`/mentor/dashboard/programs/${program.id}`}>View Program</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Programs to Teach */}
      {suggestedOpportunities.length > 0 && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              Recommended Programs to Teach
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Based on your skills and goals, these programs match your expertise
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {suggestedOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="border border-gray-200 bg-gray-50/50">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg leading-tight">{opportunity.title}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">by {opportunity.creator}</CardDescription>
                      </div>
                      <Badge className="bg-[#FFD500] text-black shrink-0">{opportunity.matchScore}% match</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">{opportunity.description}</p>
                    <div className="bg-white p-2 rounded text-xs">
                      <p className="font-medium text-gray-900 mb-1">Why recommended:</p>
                      <p className="text-gray-700">{opportunity.whyRecommended}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Compensation</p>
                        <p className="text-xs sm:text-sm font-medium">{opportunity.compensation}</p>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full sm:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000]"
                        onClick={() => handleRequestToTeach(opportunity)}
                      >
                        Request to Teach
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Program Teaching Invitations */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Program Teaching Invitations
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Programs created by trainers and organizations looking for mentors
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => router.push("/programs?view=mentor")}>
              Explore Programs
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-auto p-1 gap-1">
              <TabsTrigger value="opportunities" className="text-xs sm:text-sm">All Opportunities</TabsTrigger>
              <TabsTrigger value="invitations" className="text-xs sm:text-sm">My Invitations</TabsTrigger>
            </TabsList>

            <TabsContent value="opportunities" className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {teachingOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="overflow-hidden">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg leading-tight">{opportunity.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">by {opportunity.creator}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{opportunity.focusArea}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">{opportunity.description}</p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium">{opportunity.duration}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium">{opportunity.type}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Total Compensation</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      ${opportunity.totalCompensation.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{opportunity.compensation}</p>
                    <p className="text-xs text-gray-600">{opportunity.estimatedMentees} mentees</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Requirements:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {opportunity.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 p-4 sm:p-6 pt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full sm:flex-1 bg-transparent"
                  onClick={() => router.push(`/programs/${opportunity.id}?view=mentor`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button 
                  size="sm"
                  className="w-full sm:flex-1 bg-[#FFD500] text-black hover:bg-[#e6c000]"
                  onClick={() => handleRequestToTeach(opportunity)}
                >
                  Request to Join
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
            </TabsContent>

            <TabsContent value="invitations" className="mt-4">
              <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm">
                <p>No pending invitations at this time.</p>
                <p className="text-xs sm:text-sm mt-2">Check back later for new teaching opportunities.</p>
              </div>
            </TabsContent>
      </Tabs>
        </CardContent>
      </Card>
      </div>

      {/* Request to Teach Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="w-[calc(100vw-3rem)] max-w-[500px] sm:w-full mx-auto my-4 sm:my-0 max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 gap-4">
          <DialogHeader className="space-y-1.5 pr-8">
            <DialogTitle className="text-base sm:text-lg">Request to Teach</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Express your interest in teaching "{selectedOpportunity?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 sm:py-4">
            <div className="space-y-2">
              <Label htmlFor="mentor-name" className="text-sm">Full Name</Label>
              <Input
                id="mentor-name"
                placeholder="Your full name"
                defaultValue="Sarah Johnson"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentor-email" className="text-sm">Email</Label>
              <Input
                id="mentor-email"
                type="email"
                placeholder="your.email@example.com"
                defaultValue="sarah.johnson@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentor-expertise" className="text-sm">Relevant Expertise</Label>
              <Input
                id="mentor-expertise"
                placeholder="e.g., 10+ years in business strategy"
                defaultValue=""
              />
            </div>
            {selectedOpportunity && (
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg space-y-1.5 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium">Program Details:</p>
                <p className="text-xs sm:text-sm text-gray-600">Duration: {selectedOpportunity.duration}</p>
                <p className="text-xs sm:text-sm text-gray-600">Type: {selectedOpportunity.type}</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">Compensation: {selectedOpportunity.compensation}</p>
              </div>
            )}
            <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-900">
                <strong>Next steps:</strong> The program facilitator will review your request and contact you within 2-3 business days.
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setShowRequestModal(false)}>
              Cancel
            </Button>
            <Button 
              size="sm"
              className="w-full sm:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000]"
              onClick={handleSubmitRequest}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
