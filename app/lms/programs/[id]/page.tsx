"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Users,
  BookOpen,
  Play,
  Settings,
  Eye,
  BarChart3,
  CalendarIcon,
  Award,
  Rocket,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LMSProgramDetail() {
  const params = useParams()
  const programId = params.id as string

  const [program] = useState({
    id: programId,
    title: "Digital Marketing Mastery",
    description: "Comprehensive digital marketing training program covering all aspects from strategy to execution.",
    status: "pre-launch",
    students: 0,
    rating: 0,
    reviews: 0,
    revenue: 0,
    completionRate: 0,
    enrollmentRate: 0,
    lastUpdated: "2 days ago",
    createdAt: "3 months ago",
    launchDate: "2024-03-15",
    daysUntilLaunch: 45,
    modules: [
      {
        id: "1",
        title: "Digital Marketing Fundamentals",
        description: "Introduction to core concepts",
        isPublished: true,
        students: 0,
        completionRate: 0,
        avgTimeSpent: 0,
        topics: [
          { id: "1", title: "Introduction to Digital Marketing", type: "video", isPublished: true, views: 0 },
          { id: "2", title: "Market Research Basics", type: "document", isPublished: true, downloads: 0 },
          { id: "3", title: "Strategy Planning", type: "assignment", isPublished: true, submissions: 0 },
        ],
      },
      {
        id: "2",
        title: "Social Media Marketing",
        description: "Platform strategies and content creation",
        isPublished: true,
        students: 0,
        completionRate: 0,
        avgTimeSpent: 0,
        topics: [
          { id: "4", title: "Platform Overview", type: "video", isPublished: true, views: 0 },
          { id: "5", title: "Content Creation", type: "live_session", isPublished: false, attendees: 0 },
          { id: "6", title: "Analytics & Reporting", type: "quiz", isPublished: false, attempts: 0 },
        ],
      },
    ],
    recentStudents: [],
    analytics: {
      weeklyEnrollments: [0, 0, 0, 0, 0, 0, 0],
      completionTrend: [0, 0, 0, 0, 0],
      engagementRate: 0,
      averageSessionTime: 0,
      dropoutRate: 0,
    },
  })

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/lms/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{program.title}</h1>
                <p className="text-gray-500">Program Analytics & Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {program.status === "pre-launch" && (
                <Button asChild>
                  <Link href={`/lms/programs/${programId}/pre-launch`}>
                    <Rocket className="h-4 w-4 mr-2" />
                    Pre-Launch Management
                  </Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href={`/programs/${programId}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Public View
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold">{program.students}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              {program.status === "pre-launch" ? (
                <p className="text-xs text-gray-500 mt-2">Pre-launch phase</p>
              ) : (
                <p className="text-xs text-green-600 mt-2">+{program.enrollmentRate}% this month</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-bold">{program.completionRate}%</p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={program.completionRate} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Program Status */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Program Status</CardTitle>
                    <CardDescription>Current program performance and key metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {program.status === "pre-launch" ? (
                      <div className="text-center py-8">
                        <Rocket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Program Not Yet Launched</h3>
                        <p className="text-gray-600 mb-4">
                          This program is in pre-launch phase. Analytics will be available after launch.
                        </p>
                        <Button asChild>
                          <Link href={`/lms/programs/${programId}/pre-launch`}>
                            <Rocket className="h-4 w-4 mr-2" />
                            Manage Pre-Launch
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Enrollment Trend</h4>
                          <div className="space-y-2">
                            {program.analytics.weeklyEnrollments.map((count, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-sm w-16">Week {index + 1}</span>
                                <Progress value={(count / 25) * 100} className="flex-1 h-2" />
                                <span className="text-sm font-medium w-8">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">Completion Progress</h4>
                          <div className="space-y-2">
                            {program.analytics.completionTrend.map((rate, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-sm w-16">Month {index + 1}</span>
                                <Progress value={rate} className="flex-1 h-2" />
                                <span className="text-sm font-medium w-8">{rate}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest student interactions and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {program.status === "pre-launch" ? (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>Activity will appear here after program launch</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[
                          {
                            action: "completed",
                            student: "Sarah Johnson",
                            item: "Module 2: Social Media Marketing",
                            time: "2 hours ago",
                          },
                          {
                            action: "enrolled",
                            student: "Michael Chen",
                            item: "Digital Marketing Mastery",
                            time: "4 hours ago",
                          },
                          {
                            action: "submitted",
                            student: "Lisa Park",
                            item: "Assignment: Strategy Planning",
                            time: "6 hours ago",
                          },
                          { action: "reviewed", student: "David Wilson", item: "5-star review", time: "1 day ago" },
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                activity.action === "completed"
                                  ? "bg-green-500"
                                  : activity.action === "enrolled"
                                    ? "bg-blue-500"
                                    : activity.action === "submitted"
                                      ? "bg-yellow-500"
                                      : "bg-purple-500"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-medium">{activity.student}</span> {activity.action}{" "}
                                {activity.item}
                              </p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Program Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500"></span>
                        <Badge variant={program.status === "pre-launch" ? "secondary" : "default"}>
                          {program.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Created</span>
                        <span>{program.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Updated</span>
                        <span>{program.lastUpdated}</span>
                      </div>
                      {program.status === "pre-launch" && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Launch Date</span>
                          <span>{new Date(program.launchDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>Manage modules, lessons, and learning materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {program.modules.map((module, index) => (
                    <div key={module.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium">
                            Module {index + 1}: {module.title}
                          </h3>
                          <p className="text-gray-600">{module.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{module.students} students</span>
                            <span>{module.completionRate}% completion</span>
                            <span>{module.avgTimeSpent} min avg time</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={module.isPublished ? "default" : "secondary"}>
                            {module.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {module.topics.map((topic) => (
                          <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded flex items-center justify-center ${
                                  topic.type === "video"
                                    ? "bg-red-100 text-red-600"
                                    : topic.type === "document"
                                      ? "bg-blue-100 text-blue-600"
                                      : topic.type === "assignment"
                                        ? "bg-green-100 text-green-600"
                                        : topic.type === "quiz"
                                          ? "bg-purple-100 text-purple-600"
                                          : "bg-orange-100 text-orange-600"
                                }`}
                              >
                                {topic.type === "video" && <Play className="h-4 w-4" />}
                                {topic.type === "document" && <BookOpen className="h-4 w-4" />}
                                {topic.type === "assignment" && <Award className="h-4 w-4" />}
                                {topic.type === "quiz" && <BarChart3 className="h-4 w-4" />}
                                {topic.type === "live_session" && <CalendarIcon className="h-4 w-4" />}
                              </div>
                              <div>
                                <p className="font-medium">{topic.title}</p>
                                <p className="text-sm text-gray-500 capitalize">{topic.type.replace("_", " ")}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {"views" in topic && topic.views !== undefined && <span>{topic.views} views</span>}
                              {"downloads" in topic && topic.downloads !== undefined && <span>{topic.downloads} downloads</span>}
                              {"submissions" in topic && topic.submissions !== undefined && <span>{topic.submissions} submissions</span>}
                              {"attendees" in topic && topic.attendees !== undefined && <span>{topic.attendees} attendees</span>}
                              {"attempts" in topic && topic.attempts !== undefined && <span>{topic.attempts} attempts</span>}
                              <Badge variant={topic.isPublished ? "default" : "secondary"} className="text-xs">
                                {topic.isPublished ? "Live" : "Draft"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
