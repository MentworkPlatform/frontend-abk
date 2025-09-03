"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  Globe,
  BookOpen,
  DollarSign,
  Award,
  Save,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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

export default function MentorGoalsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("goals")
  const [saving, setSaving] = useState(false)

  // Goals state
  const [mentorGoals, setMentorGoals] = useState({
    networking: {
      targetMenteesCount: 15,
      targetProfessionals: true,
      targetStudents: false,
      targetFounders: true,
      industries: ["technology", "finance"],
      desiredNetworkSize: 100,
    },
    impact: {
      primaryImpactArea: "career-growth",
      secondaryImpactArea: "leadership",
      weeklyHours: 5,
      preferredFormat: "mixed",
      programTypes: ["group", "one-on-one"],
      topicFocus: ["startup-funding", "career-advancement"],
    },
    revenue: {
      yearlyTargetIncome: 25000,
      preferredPricing: "premium",
      groupProgramPrice: 1200,
      oneOnOnePrice: 250,
      discountStrategy: "early-bird",
      availableWeeklyHours: 10,
    },
  })

  // Update networking goals
  const updateNetworkingGoal = (field: string, value: any) => {
    setMentorGoals((prev) => ({
      ...prev,
      networking: {
        ...prev.networking,
        [field]: value,
      },
    }))
  }

  // Update impact goals
  const updateImpactGoal = (field: string, value: any) => {
    setMentorGoals((prev) => ({
      ...prev,
      impact: {
        ...prev.impact,
        [field]: value,
      },
    }))
  }

  // Update revenue goals
  const updateRevenueGoal = (field: string, value: any) => {
    setMentorGoals((prev) => ({
      ...prev,
      revenue: {
        ...prev.revenue,
        [field]: value,
      },
    }))
  }

  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    setMentorGoals((prev) => {
      const currentIndustries = [...prev.networking.industries]
      if (currentIndustries.includes(industry)) {
        return {
          ...prev,
          networking: {
            ...prev.networking,
            industries: currentIndustries.filter((i) => i !== industry),
          },
        }
      } else {
        return {
          ...prev,
          networking: {
            ...prev.networking,
            industries: [...currentIndustries, industry],
          },
        }
      }
    })
  }

  // Toggle program type selection
  const toggleProgramType = (type: string) => {
    setMentorGoals((prev) => {
      const currentTypes = [...prev.impact.programTypes]
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          impact: {
            ...prev.impact,
            programTypes: currentTypes.filter((t) => t !== type),
          },
        }
      } else {
        return {
          ...prev,
          impact: {
            ...prev.impact,
            programTypes: [...currentTypes, type],
          },
        }
      }
    })
  }

  // Toggle topic focus
  const toggleTopicFocus = (topic: string) => {
    setMentorGoals((prev) => {
      const currentTopics = [...prev.impact.topicFocus]
      if (currentTopics.includes(topic)) {
        return {
          ...prev,
          impact: {
            ...prev.impact,
            topicFocus: currentTopics.filter((t) => t !== topic),
          },
        }
      } else {
        return {
          ...prev,
          impact: {
            ...prev.impact,
            topicFocus: [...currentTopics, topic],
          },
        }
      }
    })
  }

  // Save mentor goals
  const saveGoals = () => {
    setSaving(true)
    // In a real app, this would save to the backend
    setTimeout(() => {
      setSaving(false)
      router.push("/mentor/dashboard/recommendations")
    }, 1500)
  }

  // Calculate estimated mentee count based on goals
  const estimatedMenteeCount = () => {
    // Simple calculation based on weekly hours and program types
    let baseCount = mentorGoals.impact.weeklyHours * 2

    if (mentorGoals.impact.programTypes.includes("group")) {
      baseCount *= 2 // Group programs can handle more mentees
    }

    return Math.round(baseCount)
  }

  // Calculate estimated monthly revenue
  const estimatedMonthlyRevenue = () => {
    const yearlyTarget = mentorGoals.revenue.yearlyTargetIncome
    return Math.round(yearlyTarget / 12)
  }

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
                    <SidebarMenuButton asChild isActive>
                      <Link href="/mentor/goals">
                        <Target className="h-4 w-4" />
                        <span>My Goals</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
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
              <h1 className="text-2xl font-bold">My Mentor Goals</h1>
              <p className="text-gray-500">
                Set your mentoring goals to help us recommend programs and optimize your experience
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid grid-cols-3 w-full mb-6">
                <TabsTrigger value="goals">Set Your Goals</TabsTrigger>
                <TabsTrigger value="recommendations">Program Recommendations</TabsTrigger>
                <TabsTrigger value="progress">Goal Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="goals">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Networking Goals */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-[#FFD500]" />
                          <span>Networking Goals</span>
                        </CardTitle>
                      </div>
                      <CardDescription>Define who you want to connect with</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Target mentee count</Label>
                        <div className="flex justify-between text-sm mb-1">
                          <span>5</span>
                          <span>25+</span>
                        </div>
                        <Slider
                          value={[mentorGoals.networking.targetMenteesCount]}
                          min={5}
                          max={25}
                          step={1}
                          onValueChange={(value) => updateNetworkingGoal("targetMenteesCount", value[0])}
                          className="mb-2"
                        />
                        <div className="text-center font-medium">
                          {mentorGoals.networking.targetMenteesCount} mentees
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Target audience</Label>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="target-professionals"
                              checked={mentorGoals.networking.targetProfessionals}
                              onCheckedChange={(checked) =>
                                updateNetworkingGoal("targetProfessionals", checked === true)
                              }
                            />
                            <Label htmlFor="target-professionals" className="font-normal">
                              Professional/Mid-career
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="target-students"
                              checked={mentorGoals.networking.targetStudents}
                              onCheckedChange={(checked) => updateNetworkingGoal("targetStudents", checked === true)}
                            />
                            <Label htmlFor="target-students" className="font-normal">
                              Students/Early-career
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="target-founders"
                              checked={mentorGoals.networking.targetFounders}
                              onCheckedChange={(checked) => updateNetworkingGoal("targetFounders", checked === true)}
                            />
                            <Label htmlFor="target-founders" className="font-normal">
                              Founders/Entrepreneurs
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Target industries</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={mentorGoals.networking.industries.includes("technology") ? "default" : "outline"}
                            className={
                              mentorGoals.networking.industries.includes("technology") ? "bg-[#FFD500] text-black" : ""
                            }
                            onClick={() => toggleIndustry("technology")}
                            size="sm"
                          >
                            Technology
                          </Button>
                          <Button
                            type="button"
                            variant={mentorGoals.networking.industries.includes("finance") ? "default" : "outline"}
                            className={
                              mentorGoals.networking.industries.includes("finance") ? "bg-[#FFD500] text-black" : ""
                            }
                            onClick={() => toggleIndustry("finance")}
                            size="sm"
                          >
                            Finance
                          </Button>
                          <Button
                            type="button"
                            variant={mentorGoals.networking.industries.includes("healthcare") ? "default" : "outline"}
                            className={
                              mentorGoals.networking.industries.includes("healthcare") ? "bg-[#FFD500] text-black" : ""
                            }
                            onClick={() => toggleIndustry("healthcare")}
                            size="sm"
                          >
                            Healthcare
                          </Button>
                          <Button
                            type="button"
                            variant={mentorGoals.networking.industries.includes("education") ? "default" : "outline"}
                            className={
                              mentorGoals.networking.industries.includes("education") ? "bg-[#FFD500] text-black" : ""
                            }
                            onClick={() => toggleIndustry("education")}
                            size="sm"
                          >
                            Education
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Desired professional network size</Label>
                        <div className="flex justify-between text-sm mb-1">
                          <span>50</span>
                          <span>500+</span>
                        </div>
                        <Slider
                          value={[mentorGoals.networking.desiredNetworkSize]}
                          min={50}
                          max={500}
                          step={50}
                          onValueChange={(value) => updateNetworkingGoal("desiredNetworkSize", value[0])}
                          className="mb-2"
                        />
                        <div className="text-center font-medium">
                          {mentorGoals.networking.desiredNetworkSize} connections
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Impact Goals */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-[#FFD500]" />
                          <span>Impact Goals</span>
                        </CardTitle>
                      </div>
                      <CardDescription>Define how you want to make an impact</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="primary-impact">Primary impact area</Label>
                        <Select
                          value={mentorGoals.impact.primaryImpactArea}
                          onValueChange={(value) => updateImpactGoal("primaryImpactArea", value)}
                        >
                          <SelectTrigger id="primary-impact">
                            <SelectValue placeholder="Select impact area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="career-growth">Career Growth</SelectItem>
                            <SelectItem value="skill-development">Skill Development</SelectItem>
                            <SelectItem value="business-growth">Business Growth</SelectItem>
                            <SelectItem value="leadership">Leadership Development</SelectItem>
                            <SelectItem value="innovation">Innovation & Creativity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="secondary-impact">Secondary impact area</Label>
                        <Select
                          value={mentorGoals.impact.secondaryImpactArea}
                          onValueChange={(value) => updateImpactGoal("secondaryImpactArea", value)}
                        >
                          <SelectTrigger id="secondary-impact">
                            <SelectValue placeholder="Select impact area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="career-growth">Career Growth</SelectItem>
                            <SelectItem value="skill-development">Skill Development</SelectItem>
                            <SelectItem value="business-growth">Business Growth</SelectItem>
                            <SelectItem value="leadership">Leadership Development</SelectItem>
                            <SelectItem value="innovation">Innovation & Creativity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Weekly hours for mentoring</Label>
                        <div className="flex justify-between text-sm mb-1">
                          <span>1</span>
                          <span>15+</span>
                        </div>
                        <Slider
                          value={[mentorGoals.impact.weeklyHours]}
                          min={1}
                          max={15}
                          step={1}
                          onValueChange={(value) => updateImpactGoal("weeklyHours", value[0])}
                          className="mb-2"
                        />
                        <div className="text-center font-medium">{mentorGoals.impact.weeklyHours} hours per week</div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferred-format">Preferred format</Label>
                        <Select
                          value={mentorGoals.impact.preferredFormat}
                          onValueChange={(value) => updateImpactGoal("preferredFormat", value)}
                        >
                          <SelectTrigger id="preferred-format">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="virtual">Fully Virtual</SelectItem>
                            <SelectItem value="in-person">In-Person Only</SelectItem>
                            <SelectItem value="mixed">Mix of Virtual & In-Person</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Program types</Label>
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            type="button"
                            variant={mentorGoals.impact.programTypes.includes("group") ? "default" : "outline"}
                            className={
                              mentorGoals.impact.programTypes.includes("group") ? "bg-[#FFD500] text-black" : ""
                            }
                            onClick={() => toggleProgramType("group")}
                            size="sm"
                          >
                            Group Programs
                          </Button>
                          <Button
                            type="button"
                            variant={mentorGoals.impact.programTypes.includes("one-on-one") ? "default" : "outline"}
                            className={
                              mentorGoals.impact.programTypes.includes("one-on-one") ? "bg-[#FFD500] text-black" : ""
                            }
                            onClick={() => toggleProgramType("one-on-one")}
                            size="sm"
                          >
                            1:1 Programs
                          </Button>
                          <Button
                            type="button"
                            variant={mentorGoals.impact.programTypes.includes("workshop") ? "default" : "outline"}
                            className={
                              mentorGoals.impact.programTypes.includes("workshop") ? "bg-[#FFD500] text-black" : ""
                            }
                            onClick={() => toggleProgramType("workshop")}
                            size="sm"
                          >
                            Workshops
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Topic focus</Label>
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            type="button"
                            variant={mentorGoals.impact.topicFocus.includes("startup-funding") ? "default" : "outline"}
                            className={
                              mentorGoals.impact.topicFocus.includes("startup-funding") ? "bg-[#FFD500] text-black" : ""
                            }
                            onClick={() => toggleTopicFocus("startup-funding")}
                            size="sm"
                          >
                            Startup Funding
                          </Button>
                          <Button
                            type="button"
                            variant={
                              mentorGoals.impact.topicFocus.includes("career-advancement") ? "default" : "outline"
                            }
                            className={
                              mentorGoals.impact.topicFocus.includes("career-advancement")
                                ? "bg-[#FFD500] text-black"
                                : ""
                            }
                            onClick={() => toggleTopicFocus("career-advancement")}
                            size="sm"
                          >
                            Career Advancement
                          </Button>
                          <Button
                            type="button"
                            variant={mentorGoals.impact.topicFocus.includes("tech-skills") ? "default" : "outline"}
                            className={
                              mentorGoals.impact.topicFocus.includes("tech-skills") ? "bg-[#FFD500] text-black" : ""
                            }
                            onClick={() => toggleTopicFocus("tech-skills")}
                            size="sm"
                          >
                            Tech Skills
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Revenue Goals */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-[#FFD500]" />
                          <span>Revenue Goals</span>
                        </CardTitle>
                      </div>
                      <CardDescription>Define your monetization strategy</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="yearly-income">Yearly target income ($)</Label>
                        <Input
                          id="yearly-income"
                          type="number"
                          value={mentorGoals.revenue.yearlyTargetIncome}
                          onChange={(e) =>
                            updateRevenueGoal("yearlyTargetIncome", Number.parseInt(e.target.value) || 0)
                          }
                          placeholder="e.g., 25000"
                        />
                        <p className="text-sm text-gray-500">Estimated monthly: ${estimatedMonthlyRevenue()}</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferred-pricing">Preferred pricing strategy</Label>
                        <Select
                          value={mentorGoals.revenue.preferredPricing}
                          onValueChange={(value) => updateRevenueGoal("preferredPricing", value)}
                        >
                          <SelectTrigger id="preferred-pricing">
                            <SelectValue placeholder="Select pricing strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="premium">Premium (Higher price, fewer mentees)</SelectItem>
                            <SelectItem value="balanced">Balanced (Mid-range price and volume)</SelectItem>
                            <SelectItem value="accessible">Accessible (Lower price, more mentees)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="group-price">Group program price ($)</Label>
                        <Input
                          id="group-price"
                          type="number"
                          value={mentorGoals.revenue.groupProgramPrice}
                          onChange={(e) => updateRevenueGoal("groupProgramPrice", Number.parseInt(e.target.value) || 0)}
                          placeholder="e.g., 1200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="one-on-one-price">1:1 session price ($)</Label>
                        <Input
                          id="one-on-one-price"
                          type="number"
                          value={mentorGoals.revenue.oneOnOnePrice}
                          onChange={(e) => updateRevenueGoal("oneOnOnePrice", Number.parseInt(e.target.value) || 0)}
                          placeholder="e.g., 250"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discount-strategy">Discount strategy</Label>
                        <Select
                          value={mentorGoals.revenue.discountStrategy}
                          onValueChange={(value) => updateRevenueGoal("discountStrategy", value)}
                        >
                          <SelectTrigger id="discount-strategy">
                            <SelectValue placeholder="Select a strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="early-bird">Early Bird Discounts</SelectItem>
                            <SelectItem value="package">Package Discounts</SelectItem>
                            <SelectItem value="referral">Referral Discounts</SelectItem>
                            <SelectItem value="none">No Discounts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Available weekly hours</Label>
                        <div className="flex justify-between text-sm mb-1">
                          <span>5</span>
                          <span>30+</span>
                        </div>
                        <Slider
                          value={[mentorGoals.revenue.availableWeeklyHours]}
                          min={5}
                          max={30}
                          step={1}
                          onValueChange={(value) => updateRevenueGoal("availableWeeklyHours", value[0])}
                          className="mb-2"
                        />
                        <div className="text-center font-medium">
                          {mentorGoals.revenue.availableWeeklyHours} hours per week
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end mt-6">
                  <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000]" onClick={saveGoals} disabled={saving}>
                    {saving ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Goals
                      </>
                    )}
                  </Button>
                </div>

                <div className="border rounded-lg p-4 mt-6 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800">Personalized Program Recommendations</h3>
                      <p className="text-sm text-blue-600 mt-1">
                        After saving your goals, we'll suggest programs and sessions that align with your objectives.
                        These recommendations will help you achieve your networking, impact, and revenue goals.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations">
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="rounded-full bg-gray-100 p-6 inline-block mb-4">
                      <TrendingUp className="h-10 w-10 text-[#FFD500]" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Save your goals first</h3>
                    <p className="text-gray-500 mb-6">
                      Your personalized program and session recommendations will appear here after you save your goals.
                    </p>
                    <Button
                      className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                      onClick={saveGoals}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Goals to See Recommendations
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="progress">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Goal Progress Overview</CardTitle>
                      <CardDescription>Track how you're doing against your mentoring goals</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-[#FFD500]" />
                              <span className="font-medium">Networking</span>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Mentee count</span>
                                <span className="font-medium">8/{mentorGoals.networking.targetMenteesCount}</span>
                              </div>
                              <Progress value={(8 / mentorGoals.networking.targetMenteesCount) * 100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Network size</span>
                                <span className="font-medium">35/{mentorGoals.networking.desiredNetworkSize}</span>
                              </div>
                              <Progress
                                value={(35 / mentorGoals.networking.desiredNetworkSize) * 100}
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Globe className="h-5 w-5 text-[#FFD500]" />
                              <span className="font-medium">Impact</span>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Weekly hours</span>
                                <span className="font-medium">3/{mentorGoals.impact.weeklyHours}</span>
                              </div>
                              <Progress value={(3 / mentorGoals.impact.weeklyHours) * 100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Program types</span>
                                <span className="font-medium">1/{mentorGoals.impact.programTypes.length}</span>
                              </div>
                              <Progress value={(1 / mentorGoals.impact.programTypes.length) * 100} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-[#FFD500]" />
                              <span className="font-medium">Revenue</span>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Just Started</Badge>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Yearly income</span>
                                <span className="font-medium">$3,800/${mentorGoals.revenue.yearlyTargetIncome}</span>
                              </div>
                              <Progress value={(3800 / mentorGoals.revenue.yearlyTargetIncome) * 100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Weekly hours used</span>
                                <span className="font-medium">4/{mentorGoals.revenue.availableWeeklyHours}</span>
                              </div>
                              <Progress value={(4 / mentorGoals.revenue.availableWeeklyHours) * 100} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-6">
                        <h3 className="font-medium mb-4">Current Goal Status</h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <p className="font-medium">Created mentorship profile</p>
                              <p className="text-sm text-gray-500">Your profile is complete and visible to mentees</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <p className="font-medium">Set mentoring goals</p>
                              <p className="text-sm text-gray-500">
                                You've defined your networking, impact, and revenue goals
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center">
                              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                            </div>
                            <div>
                              <p className="font-medium">Launch first program</p>
                              <p className="text-sm text-gray-500">You've started creating your first program</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                            <div>
                              <p className="font-medium">Get 5 mentees</p>
                              <p className="text-sm text-gray-500">You currently have 0 active mentees</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                            <div>
                              <p className="font-medium">Earn first $1,000</p>
                              <p className="text-sm text-gray-500">You've earned $0 so far</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-center">
                    <Button
                      className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                      onClick={() => router.push("/mentor/dashboard/programs/create")}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Create a Program
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
