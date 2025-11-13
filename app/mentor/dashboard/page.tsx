"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Users, Plus, Target, Clock, Star, CheckCircle, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

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
    compensation: "$150/session",
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
    compensation: "$200/session",
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
    compensation: "$300/session",
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
    compensation: "$250/session",
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
    compensation: "$200/session",
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
  { name: "Leadership & People", taught: true, color: "bg-blue-500" },
  { name: "Strategy & Planning", taught: false, color: "bg-green-500" },
  { name: "Branding/Marketing/Sales", taught: false, color: "bg-purple-500" },
  { name: "Finance & Funding", taught: true, color: "bg-orange-500" },
  { name: "Operations & Innovation", taught: false, color: "bg-red-500" },
  { name: "Governance & Impact", taught: false, color: "bg-teal-500" },
]

export default function MentorDashboardPage() {
  const [activeTab, setActiveTab] = useState("opportunities")

  // Calculate progress across pillars
  const taughtAreas = focusAreas.filter((area) => area.taught).length
  const progressPercentage = (taughtAreas / focusAreas.length) * 100

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">Manage your teaching programs and sessions</p>
        </div>
      </div>

      {/* Upcoming Sessions Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Your Upcoming Sessions
          </CardTitle>
          <CardDescription>Next sessions scheduled with meeting links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{session.programTitle}</h4>
                    <Badge variant="outline" className="text-xs">
                      {session.topic}
                    </Badge>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-muted-foreground">
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
                <div className="flex items-center gap-2">
                  <div className="text-right text-sm">
                    <p className="font-mono text-xs text-muted-foreground">ID: {session.meetingId}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => window.open(session.meetingLink, "_blank")}
                    className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
                  >
                    Join Meeting
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Teaching Expertise Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Teaching Expertise
          </CardTitle>
          <CardDescription>Track your experience across all 6 entrepreneurial focus areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Progress Circle */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${progressPercentage * 3.14} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{taughtAreas}/6</div>
                  <div className="text-xs text-muted-foreground">Areas</div>
                </div>
              </div>
            </div>

            {/* Focus Areas Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
              {focusAreas.map((area, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    area.taught ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${area.color} ${!area.taught && "opacity-30"}`} />
                    {area.taught && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                  <p className={`text-sm font-medium ${area.taught ? "text-green-900" : "text-gray-600"}`}>
                    {area.name}
                  </p>
                  {!area.taught && <p className="text-xs text-blue-600 mt-1">Growth opportunity</p>}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">18</p>
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
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Sessions This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Active Programs</CardTitle>
          <CardDescription>Programs you're currently teaching</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activePrograms.map((program) => (
            <div
              key={program.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-4"
            >
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{program.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="text-xs">Mentees</span>
                    <p className="font-medium text-foreground">{program.mentees}</p>
                  </div>
                  <div>
                    <span className="text-xs">Sessions</span>
                    <p className="font-medium text-foreground">
                      {program.completedSessions}/{program.totalSessions}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs">Next Session</span>
                    <p className="font-medium text-foreground">{program.nextSession}</p>
                  </div>
                  <div>
                    <span className="text-xs">Expected Payout</span>
                    <p className="font-medium text-foreground">${program.expectedPayout.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <Link href={`/mentor/dashboard/programs/${program.id}/lms`}>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">Manage Program</Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Teaching Opportunities Tab */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Teaching Opportunities</TabsTrigger>
          <TabsTrigger value="active">Active Engagements</TabsTrigger>
          <TabsTrigger value="suggested">Suggested for You</TabsTrigger>
        </TabsList>

        {/* Teaching Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Browse Teaching Opportunities</h3>
              <p className="text-sm text-muted-foreground">
                Programs created by trainers and organizations looking for mentors
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Filter by Focus Area
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachingOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <CardDescription>by {opportunity.creator}</CardDescription>
                    </div>
                    <Badge variant="outline">{opportunity.focusArea}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{opportunity.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium">{opportunity.duration}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium">{opportunity.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-900">Total Compensation</p>
                      <p className="text-lg font-bold text-green-700">
                        ${opportunity.totalCompensation.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-700">{opportunity.compensation}</p>
                      <p className="text-xs text-green-600">{opportunity.estimatedMentees} mentees</p>
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
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Request to Join</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Active Engagements Tab */}
        <TabsContent value="active" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Your Active Programs</h3>
            <p className="text-sm text-muted-foreground">Programs you're currently teaching with upcoming sessions</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {activePrograms.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {program.title}
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </CardTitle>
                      <CardDescription>
                        {program.type} • {program.focusArea}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${program.expectedPayout.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Expected payout</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{program.mentees} mentees enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Next: {program.nextSession}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {program.completedSessions}/{program.totalSessions} sessions
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round((program.completedSessions / program.totalSessions) * 100)}%</span>
                    </div>
                    <Progress value={(program.completedSessions / program.totalSessions) * 100} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View Program
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => (window.location.href = `/mentor/dashboard/programs/${program.id}`)}
                  >
                    Manage Program
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Suggested Opportunities Tab */}
        <TabsContent value="suggested" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Recommended for Your Growth</h3>
            <p className="text-sm text-muted-foreground">Opportunities in focus areas you haven't taught yet</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="overflow-hidden border-blue-200">
                <div className="h-1 bg-blue-500" />
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <CardDescription>by {opportunity.creator}</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{opportunity.matchScore}% Match</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Why recommended:</p>
                    <p className="text-sm text-blue-700">{opportunity.whyRecommended}</p>
                  </div>

                  <p className="text-sm text-muted-foreground">{opportunity.description}</p>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-900">Total Compensation</p>
                      <p className="text-lg font-bold text-green-700">
                        ${opportunity.totalCompensation.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-700">{opportunity.compensation}</p>
                      <p className="text-xs text-green-600">{opportunity.estimatedMentees} mentees</p>
                    </div>
                  </div>

                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    {opportunity.focusArea} - New area for you!
                  </Badge>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Learn More
                  </Button>
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Request to Join
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
