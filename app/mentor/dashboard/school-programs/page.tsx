"use client"

import type React from "react"

import { useState } from "react"
import { School, Calendar, Users, DollarSign, Clock, CheckCircle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for available school programs
const availablePrograms = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    school: "Mentwork High School",
    duration: "8 weeks",
    topic: "Technology",
    stipend: "$1,200",
    startDate: "June 15, 2025",
    sessions: 16,
    students: 15,
    requiresTier: "Builder",
  },
  {
    id: 2,
    title: "Business Fundamentals",
    school: "Eastside Academy",
    duration: "10 weeks",
    topic: "Business",
    stipend: "$1,500",
    startDate: "July 1, 2025",
    sessions: 20,
    students: 12,
    requiresTier: "Starter",
  },
  {
    id: 3,
    title: "Creative Writing Workshop",
    school: "Mentwork School",
    duration: "6 weeks",
    topic: "Arts",
    stipend: "$900",
    startDate: "June 20, 2025",
    sessions: 12,
    students: 10,
    requiresTier: "Starter",
  },
  {
    id: 4,
    title: "Advanced Mathematics",
    school: "Westside Prep",
    duration: "12 weeks",
    topic: "Mathematics",
    stipend: "$1,800",
    startDate: "August 5, 2025",
    sessions: 24,
    students: 8,
    requiresTier: "Leader",
  },
]

// Mock data for assigned school programs
const assignedPrograms = [
  {
    id: 101,
    title: "Digital Marketing Basics",
    school: "Mentwork School",
    duration: "8 weeks",
    topic: "Marketing",
    stipend: "$1,200",
    startDate: "May 10, 2025",
    endDate: "July 5, 2025",
    completedSessions: 3,
    totalSessions: 16,
    students: [
      { id: 1, name: "Alex Johnson", attendance: "100%" },
      { id: 2, name: "Maria Garcia", attendance: "87%" },
      { id: 3, name: "James Wilson", attendance: "93%" },
      { id: 4, name: "Sarah Lee", attendance: "100%" },
      { id: 5, name: "David Kim", attendance: "75%" },
    ],
    nextSession: "May 24, 2025 - 3:00 PM",
  },
  {
    id: 102,
    title: "Entrepreneurship 101",
    school: "Eastside Academy",
    duration: "10 weeks",
    topic: "Business",
    stipend: "$1,500",
    startDate: "April 15, 2025",
    endDate: "June 24, 2025",
    completedSessions: 6,
    totalSessions: 20,
    students: [
      { id: 6, name: "Emma Thompson", attendance: "95%" },
      { id: 7, name: "Michael Brown", attendance: "90%" },
      { id: 8, name: "Sophia Martinez", attendance: "100%" },
      { id: 9, name: "Daniel Clark", attendance: "85%" },
    ],
    nextSession: "May 22, 2025 - 4:30 PM",
  },
]

// Current mentor tier
const currentTier = "Builder"

// Mock data for school hours progress
const schoolHoursProgress = {
  completed: 42,
  target: 100,
  percentage: 42,
}

export default function SchoolProgramsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [topicFilter, setTopicFilter] = useState("all")

  // Filter available programs based on search and topic
  const filteredAvailablePrograms = availablePrograms.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.school.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTopic = topicFilter === "all" || program.topic === topicFilter
    return matchesSearch && matchesTopic
  })

  // Get unique topics for filter
  const topics = ["all", ...new Set(availablePrograms.map((program) => program.topic))]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">School Programs</h1>
          <p className="text-muted-foreground">Teach at schools and earn rewards while making an impact</p>
        </div>
      </div>

      {/* Progress Tracker */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <School className="h-5 w-5" />
            School Hours Progress
          </CardTitle>
          <CardDescription>Track your completed school hours and tier contribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress toward next tier</span>
              <span className="font-medium">
                {schoolHoursProgress.completed}/{schoolHoursProgress.target} hours
              </span>
            </div>
            <Progress value={schoolHoursProgress.percentage} className="h-2" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Badge variant="outline" className="bg-blue-50">
              Current Tier: {currentTier}
            </Badge>
            <Badge variant="outline" className="bg-green-50">
              {schoolHoursProgress.completed} Hours Completed
            </Badge>
            <Badge variant="outline" className="bg-purple-50">
              58 Hours to Next Tier
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Programs</TabsTrigger>
          <TabsTrigger value="assigned">My Assigned Programs</TabsTrigger>
        </TabsList>

        {/* Available Programs Tab */}
        <TabsContent value="available" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Input
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4" />
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic === "all" ? "All Topics" : topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAvailablePrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">{program.title}</CardTitle>
                    <Badge>{program.topic}</Badge>
                  </div>
                  <CardDescription>{program.school}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {program.duration} ({program.sessions} sessions)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Starts {program.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{program.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Stipend: {program.stipend}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="w-full space-y-2">
                    <Badge
                      variant="outline"
                      className={
                        program.requiresTier === currentTier ||
                        (program.requiresTier === "Starter" && currentTier === "Builder") ||
                        (program.requiresTier === "Starter" && currentTier === "Leader") ||
                        (program.requiresTier === "Builder" && currentTier === "Leader")
                          ? "bg-green-50"
                          : "bg-amber-50"
                      }
                    >
                      {program.requiresTier === currentTier ||
                      (program.requiresTier === "Starter" && currentTier === "Builder") ||
                      (program.requiresTier === "Starter" && currentTier === "Leader") ||
                      (program.requiresTier === "Builder" && currentTier === "Leader")
                        ? "Eligible"
                        : `Requires ${program.requiresTier} Tier`}
                    </Badge>
                    <Button
                      className="w-full"
                      disabled={
                        !(
                          program.requiresTier === currentTier ||
                          (program.requiresTier === "Starter" && currentTier === "Builder") ||
                          (program.requiresTier === "Starter" && currentTier === "Leader") ||
                          (program.requiresTier === "Builder" && currentTier === "Leader")
                        )
                      }
                    >
                      Apply to Teach
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Assigned Programs Tab */}
        <TabsContent value="assigned" className="space-y-4">
          {assignedPrograms.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <School className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  You haven't been assigned to any school programs yet.
                </p>
                <p className="text-center text-muted-foreground">Apply to available programs to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {assignedPrograms.map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">{program.title}</CardTitle>
                      <Badge>{program.topic}</Badge>
                    </div>
                    <CardDescription>{program.school}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {program.startDate} to {program.endDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Stipend: {program.stipend}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Session Progress</span>
                        <span className="font-medium">
                          {program.completedSessions}/{program.totalSessions}
                        </span>
                      </div>
                      <Progress value={(program.completedSessions / program.totalSessions) * 100} className="h-2" />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Students ({program.students.length})</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {program.students.map((student) => (
                          <div
                            key={student.id}
                            className="flex justify-between items-center text-sm p-2 bg-muted rounded-md"
                          >
                            <span>{student.name}</span>
                            <Badge
                              variant="outline"
                              className={
                                Number.parseInt(student.attendance) >= 90
                                  ? "bg-green-50"
                                  : Number.parseInt(student.attendance) >= 80
                                    ? "bg-amber-50"
                                    : "bg-red-50"
                              }
                            >
                              {student.attendance}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Next Session</p>
                        <p className="text-sm">{program.nextSession}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Session Report
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Feedback
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Search icon component
function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
