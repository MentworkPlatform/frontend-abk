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

      {/* Teaching Opportunities Tab */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Browse Teaching Opportunities</h3>
            <p className="text-sm text-muted-foreground">
              Programs created by trainers and organizations looking for mentors
            </p>
          </div>
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
      </Tabs>
    </div>
  )
}
