"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
  DollarSign,
  Award,
  Clock,
  Plus,
  ArrowRight,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
} from "@/components/ui/sidebar"

// Sample recommendation data
const recommendedPrograms = [
  {
    id: 1,
    title: "Startup Funding Masterclass",
    type: "Group Program",
    sessions: 8,
    duration: "8 weeks",
    estimatedIncome: 14400,
    estimatedMentees: 12,
    description: "A comprehensive program teaching entrepreneurs how to secure funding for their startups.",
    matchScore: 98,
    tags: ["funding", "startups", "entrepreneurship"],
  },
  {
    id: 2,
    title: "Career Growth Accelerator",
    type: "Group Program",
    sessions: 6,
    duration: "6 weeks",
    estimatedIncome: 9000,
    estimatedMentees: 15,
    description: "Help professionals advance in their careers through strategic planning and skill development.",
    matchScore: 92,
    tags: ["career", "professional development", "leadership"],
  },
  {
    id: 3,
    title: "Executive Leadership Coaching",
    type: "1:1 Program",
    sessions: 12,
    duration: "3 months",
    estimatedIncome: 18000,
    estimatedMentees: 6,
    description: "Premium one-on-one coaching for executives looking to enhance their leadership skills.",
    matchScore: 85,
    tags: ["leadership", "executive", "coaching"],
  },
]

const recommendedSessions = [
  {
    id: 1,
    title: "Pitch Deck Review",
    type: "1:1 Session",
    duration: "60 minutes",
    estimatedIncome: 250,
    description: "Review and provide feedback on startup pitch decks to improve investor presentations.",
    matchScore: 96,
    frequency: "Weekly",
  },
  {
    id: 2,
    title: "Career Strategy Session",
    type: "1:1 Session",
    duration: "45 minutes",
    estimatedIncome: 200,
    description: "Help professionals develop personalized career advancement strategies.",
    matchScore: 94,
    frequency: "Weekly",
  },
  {
    id: 3,
    title: "Leadership Challenge Workshop",
    type: "Group Session",
    duration: "90 minutes",
    estimatedIncome: 750,
    description: "Interactive workshop helping leaders overcome common challenges through case studies.",
    matchScore: 88,
    frequency: "Monthly",
  },
]

export default function MentorRecommendationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("programs")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-4">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/mentor/dashboard">
                        <BarChart3 className="h-4 w-4" />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/mentor/dashboard/programs">
                        <BookOpen className="h-4 w-4" />
                        <span>Programs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Goals & Growth</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/mentor/goals">
                        <Target className="h-4 w-4" />
                        <span>My Goals</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href="/mentor/dashboard/recommendations">
                        <TrendingUp className="h-4 w-4" />
                        <span>Recommendations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/mentor/subscriptions">
                        <Award className="h-4 w-4" />
                        <span>Subscription</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <img src="/placeholder.svg?height=40&width=40" alt="User avatar" className="rounded-full" />
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Business Mentor</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Public Profile
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="flex-1 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Personalized Recommendations</h1>
              <p className="text-gray-500">
                Based on your goals, here are programs and sessions designed to help you achieve your targets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-[#F8F7FF] border-[#e0ddff]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-[#e0ddff] rounded-full">
                      <Users className="h-6 w-6 text-[#7B61FF]" />
                    </div>
                    <Badge className="bg-[#e0ddff] text-[#7B61FF] hover:bg-[#d2cdff]">Networking</Badge>
                  </div>
                  <h3 className="font-bold text-lg mt-4">Build your network</h3>
                  <p className="text-sm text-gray-700 mt-1">Connect with {15 - 8} more mentees to reach your target</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>8 mentees</span>
                      <span>15 mentees</span>
                    </div>
                    <Progress value={(8 / 15) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FFF9E6] border-[#ffe7a2]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-[#FFE7A2] rounded-full">
                      <Target className="h-6 w-6 text-[#F8B400]" />
                    </div>
                    <Badge className="bg-[#FFE7A2] text-[#F8B400] hover:bg-[#FFDF85]">Impact</Badge>
                  </div>
                  <h3 className="font-bold text-lg mt-4">Increase your reach</h3>
                  <p className="text-sm text-gray-700 mt-1">Offer more sessions to reach your impact goals</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>3 hours/week</span>
                      <span>5 hours/week</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#F2FCEF] border-[#d0efca]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-[#D0EFCA] rounded-full">
                      <DollarSign className="h-6 w-6 text-[#4CAF50]" />
                    </div>
                    <Badge className="bg-[#D0EFCA] text-[#4CAF50] hover:bg-[#c1e6ba]">Revenue</Badge>
                  </div>
                  <h3 className="font-bold text-lg mt-4">Grow your income</h3>
                  <p className="text-sm text-gray-700 mt-1">You're 15% toward your annual revenue goal</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>$3,800</span>
                      <span>$25,000</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-bold">Recommended Opportunities</h2>
              <Link href="/mentor/goals" className="text-sm text-blue-600 hover:underline flex items-center">
                Update my goals <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="programs">Program Templates</TabsTrigger>
                <TabsTrigger value="sessions">Session Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="programs" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedPrograms.map((program) => (
                    <Card key={program.id} className="overflow-hidden">
                      <div className="h-2 bg-[#FFD500]"></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{program.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <BookOpen className="h-4 w-4 mr-1 text-gray-500" />
                              {program.type} • {program.sessions} sessions
                            </CardDescription>
                          </div>
                          <Badge className="bg-green-100 text-green-800">{program.matchScore}% Match</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-600">{program.description}</p>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {program.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-100">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="border rounded-md p-3 bg-gray-50">
                            <p className="text-xs text-gray-500">Est. Revenue</p>
                            <p className="text-lg font-bold">${program.estimatedIncome.toLocaleString()}</p>
                          </div>
                          <div className="border rounded-md p-3 bg-gray-50">
                            <p className="text-xs text-gray-500">Est. Mentees</p>
                            <p className="text-lg font-bold">{program.estimatedMentees}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]"
                          onClick={() => router.push("/mentor/dashboard/programs/create")}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Program
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sessions" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedSessions.map((session) => (
                    <Card key={session.id} className="overflow-hidden">
                      <div className="h-2 bg-[#7B61FF]"></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{session.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              {session.type} • {session.duration}
                            </CardDescription>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">{session.matchScore}% Match</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-600">{session.description}</p>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="border rounded-md p-3 bg-gray-50">
                            <p className="text-xs text-gray-500">Est. Revenue</p>
                            <p className="text-lg font-bold">${session.estimatedIncome.toLocaleString()}</p>
                          </div>
                          <div className="border rounded-md p-3 bg-gray-50">
                            <p className="text-xs text-gray-500">Frequency</p>
                            <p className="text-lg font-bold">{session.frequency}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          className="w-full bg-[#7B61FF] text-white hover:bg-[#6a52da]"
                          onClick={() => router.push("/mentor/dashboard/sessions/create")}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Session
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mb-4">
              <h2 className="text-xl font-bold">Suggested Integrations</h2>
              <p className="text-gray-500">Connect these tools to enhance your mentorship experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-500"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="currentColor"
                          d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm0 22.5a10.5 10.5 0 1 1 0-21 10.5 10.5 0 0 1 0 21zm4.4-11.6c.5.9.8 1.9.8 3.1 0 2.5-1.4 4-4 4.4V20h-2v-1.6c-2.6-.4-4-2-4-4.1h2.4c.1 1.3 1 2.1 2.6 2.1 1.7 0 2.6-.7 2.6-1.9 0-1-.6-1.5-2.7-2-2.2-.6-3.9-1.5-3.9-3.8 0-2 1.3-3.4 3.6-3.8V3h2v1.9c2.3.4 3.5 2 3.6 3.7h-2.4c-.1-1.2-.9-2-2.2-2-1.3 0-2.2.6-2.2 1.7 0 .9.6 1.4 2.6 1.9 2.1.5 4 1.4 4 3.7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Zoom</h3>
                      <p className="text-sm text-gray-500">Video conferencing</p>
                    </div>
                  </div>
                  <Button className="w-full">Connect</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Calendar className="h-8 w-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Google Calendar</h3>
                      <p className="text-sm text-gray-500">Schedule management</p>
                    </div>
                  </div>
                  <Button className="w-full">Connect</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-500"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="currentColor"
                          d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm-2-13c0-1.657 1.343-3 3-3 1.657 0 3 1.343 3 3s-1.343 3-3 3v2h-2v-2h-1v-2h3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1h-2zm3 5v2h-2v-2h2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-sm text-gray-500">Payment processing</p>
                    </div>
                  </div>
                  <Button className="w-full">Connect</Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-[#F5F5F5] rounded-lg p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FFD500] rounded-full">
                  <Zap className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Upgrade to Pro Plan</h3>
                  <p className="text-gray-600 mb-4">
                    Get verified status, reduced commissions, and premium features to boost your mentorship success.
                  </p>
                  <Button
                    className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                    onClick={() => router.push("/mentor/subscriptions")}
                  >
                    <Award className="mr-2 h-4 w-4" /> View Subscription Plans
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
