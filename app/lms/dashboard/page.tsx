"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Star,
  DollarSign,
  Eye,
  Settings,
  Plus,
  MessageSquare,
  Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function LMSDashboard() {
  const [stats, setStats] = useState({
    totalPrograms: 0,
    activeStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    completionRate: 0,
    monthlyGrowth: 0,
  });

  const [programs, setPrograms] = useState([
    {
      id: "1",
      title: "Digital Marketing Mastery",
      status: "active",
      students: 247,
      rating: 4.8,
      revenue: 12450,
      completionRate: 78,
      lastUpdated: "2 days ago",
      thumbnail: "/placeholder.svg?height=100&width=150",
    },
    {
      id: "2",
      title: "Advanced Business Strategy",
      status: "active",
      students: 156,
      rating: 4.9,
      revenue: 18720,
      completionRate: 85,
      lastUpdated: "1 week ago",
      thumbnail: "/placeholder.svg?height=100&width=150",
    },
    {
      id: "3",
      title: "Product Management Essentials",
      status: "draft",
      students: 0,
      rating: 0,
      revenue: 0,
      completionRate: 0,
      lastUpdated: "3 days ago",
      thumbnail: "/placeholder.svg?height=100&width=150",
    },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "enrollment",
      message: "Sarah Johnson enrolled in Digital Marketing Mastery",
      time: "2 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      type: "completion",
      message: "Michael Chen completed Advanced Business Strategy",
      time: "4 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      type: "review",
      message: "New 5-star review for Digital Marketing Mastery",
      time: "6 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      type: "message",
      message: "Lisa Park sent you a message about Product Management",
      time: "1 day ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalPrograms: 3,
        activeStudents: 403 + Math.floor(Math.random() * 10),
        totalRevenue: 31170 + Math.floor(Math.random() * 1000),
        averageRating: 4.8,
        completionRate: 81 + Math.floor(Math.random() * 5),
        monthlyGrowth: 23 + Math.floor(Math.random() * 5),
      }));
    }, 30000); // Update every 30 seconds

    // Initial load
    setStats({
      totalPrograms: 3,
      activeStudents: 403,
      totalRevenue: 31170,
      averageRating: 4.8,
      completionRate: 81,
      monthlyGrowth: 23,
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-6">
      <DashboardHeader
        title="LMS Dashboard"
        description="Manage your training programs and students"
        actionButton={{
          label: "Create Program",
          href: "/trainer/dashboard/programs/create",
          icon: Plus,
        }}
      />

      <div className="w-full space-y-6 p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Programs
                  </p>
                  <p className="text-2xl font-bold">{stats.totalPrograms}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Students
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.activeStudents.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Avg. Rating
                  </p>
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Completion Rate
                  </p>
                  <p className="text-2xl font-bold">{stats.completionRate}%</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Monthly Growth
                  </p>
                  <p className="text-2xl font-bold">+{stats.monthlyGrowth}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Programs Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Programs</CardTitle>
                    <CardDescription>
                      Manage and monitor your training programs
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/trainer/dashboard/programs/create">
                      <Plus className="h-4 w-4 mr-2" />
                      New Program
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programs.map((program) => (
                    <div
                      key={program.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={program.thumbnail || "/placeholder.svg"}
                          alt={program.title}
                          className="w-20 h-14 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{program.title}</h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {program.students} students
                                </span>
                                {program.rating > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    {program.rating}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />$
                                  {program.revenue.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  program.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {program.status}
                              </Badge>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/lms/programs/${program.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  href={`/lms/programs/${program.id}/manage`}
                                >
                                  <Settings className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                          {program.status === "active" && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Completion Rate</span>
                                <span>{program.completionRate}%</span>
                              </div>
                              <Progress
                                value={program.completionRate}
                                className="h-2"
                              />
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Updated {program.lastUpdated}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/trainer/dashboard/programs/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Program
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  asChild
                >
                  <Link href="/lms/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  asChild
                >
                  <Link href="/lms/students">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Students
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  asChild
                >
                  <Link href="/lms/messages">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates from your programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={activity.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Enrollments</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completions</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Revenue</span>
                  <span className="font-medium">$4,230</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Rating</span>
                  <span className="font-medium">4.8 ⭐</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
