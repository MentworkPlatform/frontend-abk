import type { Metadata } from "next"
import Link from "next/link"
import { Plus, Clock, TrendingUp, Target, Award, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Personalized Learning Dashboard",
}

const focusAreas = [
  { name: "Leadership & People", progress: 75, color: "bg-blue-500", engaged: true },
  { name: "Strategy & Planning", progress: 60, color: "bg-green-500", engaged: true },
  { name: "Branding, Marketing & Sales", progress: 45, color: "bg-purple-500", engaged: true },
  { name: "Finance & Funding", progress: 0, color: "bg-orange-500", engaged: false },
  { name: "Operations & Innovation", progress: 20, color: "bg-red-500", engaged: true },
  { name: "Governance & Impact", progress: 0, color: "bg-teal-500", engaged: false },
]

const yourPrograms = [
  {
    id: 1,
    title: "Leadership Excellence Program",
    mentor: "Sarah Johnson",
    progress: 75,
    focusArea: "Leadership & People",
    nextSession: "Today, 2:00 PM",
    status: "active",
  },
  {
    id: 2,
    title: "Strategic Business Planning",
    mentor: "Michael Chen",
    progress: 60,
    focusArea: "Strategy & Planning",
    nextSession: "Tomorrow, 10:00 AM",
    status: "active",
  },
]

const suggestedPrograms = [
  {
    id: 3,
    title: "Digital Marketing Mastery",
    mentor: "Emma Rodriguez",
    focusArea: "Branding, Marketing & Sales",
    duration: "8 weeks",
    rating: 4.9,
    reason: "Perfect match for your entrepreneurship goals",
  },
  {
    id: 4,
    title: "Innovation & Product Development",
    mentor: "David Kim",
    focusArea: "Operations & Innovation",
    duration: "6 weeks",
    rating: 4.8,
    reason: "Builds on your strategic planning foundation",
  },
]

const growthPrograms = [
  {
    id: 5,
    title: "Startup Funding Essentials",
    mentor: "Lisa Wang",
    focusArea: "Finance & Funding",
    duration: "4 weeks",
    rating: 4.7,
    reason: "Strengthen your entrepreneurial toolkit",
  },
  {
    id: 6,
    title: "Social Impact & Governance",
    mentor: "James Thompson",
    focusArea: "Governance & Impact",
    duration: "5 weeks",
    rating: 4.6,
    reason: "Expand your leadership perspective",
  },
]

export default function DashboardPage() {
  const engagedAreas = focusAreas.filter((area) => area.engaged).length
  const overallProgress = Math.round(focusAreas.reduce((sum, area) => sum + area.progress, 0) / focusAreas.length)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, John!</h1>
              <p className="text-gray-600">Continue your entrepreneurial journey with personalized recommendations</p>
            </div>
            <Button asChild className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
              <Link href="/programs">
                <Plus className="mr-2 h-4 w-4" />
                Explore Programs
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Entrepreneurial Toolkit
            </CardTitle>
            <CardDescription>Track your growth across all essential business areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FFD500]">{overallProgress}%</div>
                  <p className="text-sm text-gray-600">Overall Progress</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold">{engagedAreas}/6</div>
                  <p className="text-sm text-gray-600">Focus Areas Engaged</p>
                </div>
              </div>
              <div className="space-y-3">
                {focusAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${area.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{area.name}</span>
                        <span className="text-xs text-gray-500">{area.progress}%</span>
                      </div>
                      <Progress value={area.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Your Programs</h2>
              <p className="text-gray-600">Active programs and personalized recommendations</p>
            </div>
          </div>

          {/* Active Programs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Currently Active</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {yourPrograms.map((program) => (
                <Card key={program.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                        <CardDescription>with {program.mentor}</CardDescription>
                      </div>
                      <Badge variant="secondary">{program.focusArea}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{program.progress}%</span>
                      </div>
                      <Progress value={program.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="mr-1 h-4 w-4" />
                        {program.nextSession}
                      </div>
                      <Button size="sm" className="bg-[#FFD500] text-black hover:bg-[#e6c000]" asChild>
                        <Link href={`/dashboard/programs/${program.id}`}>Continue</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Suggested Programs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Recommended for You</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {suggestedPrograms.map((program) => (
                <Card key={program.id} className="hover:shadow-md transition-shadow border-[#FFD500]/20">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                        <CardDescription>with {program.mentor}</CardDescription>
                      </div>
                      <Badge className="bg-[#FFD500] text-black">{program.focusArea}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{program.reason}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">{program.duration}</span>
                        <div className="flex items-center">
                          <Award className="mr-1 h-4 w-4 text-yellow-500" />
                          <span>{program.rating}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/programs/${program.id}`}>
                          Learn More
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Recommended for Growth
              </h2>
              <p className="text-gray-600">Opportunities to strengthen your entrepreneurial toolkit</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {growthPrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-md transition-shadow border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{program.title}</CardTitle>
                      <CardDescription>with {program.mentor}</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-700">
                      {program.focusArea}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{program.reason}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">{program.duration}</span>
                      <div className="flex items-center">
                        <Award className="mr-1 h-4 w-4 text-yellow-500" />
                        <span>{program.rating}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-700 hover:bg-green-50 bg-transparent"
                      asChild
                    >
                      <Link href={`/programs/${program.id}`}>
                        Explore
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
