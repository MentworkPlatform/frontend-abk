"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Users, BookOpen, DollarSign, Star, TrendingUp, Calendar, Eye, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function TrainerDashboard() {
  const [stats] = useState({
    totalPrograms: 12,
    activePrograms: 8,
    totalMentors: 24,
    totalParticipants: 156,
    totalRevenue: 45600,
    averageRating: 4.8,
  })

  const [recentPrograms] = useState([
    {
      id: "1",
      title: "Digital Marketing Bootcamp",
      participants: 25,
      mentors: 4,
      progress: 75,
      status: "active",
      startDate: "2024-01-15",
      revenue: 12500,
      hasLMS: true,
    },
    {
      id: "2",
      title: "Leadership Excellence Program",
      participants: 18,
      mentors: 3,
      progress: 45,
      status: "active",
      startDate: "2024-02-01",
      revenue: 9000,
      hasLMS: true,
    },
    {
      id: "3",
      title: "Data Science Fundamentals",
      participants: 30,
      mentors: 5,
      progress: 100,
      status: "completed",
      startDate: "2023-11-01",
      revenue: 15000,
      hasLMS: false,
    },
  ])

  const [upcomingTasks] = useState([
    {
      id: "1",
      title: "Review mentor applications for Marketing Bootcamp",
      dueDate: "2024-01-25",
      priority: "high",
    },
    {
      id: "2",
      title: "Prepare curriculum for Leadership Program Module 3",
      dueDate: "2024-01-28",
      priority: "medium",
    },
    {
      id: "3",
      title: "Send feedback to participants in Data Science program",
      dueDate: "2024-01-30",
      priority: "low",
    },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trainer Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your programs.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/lms/dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              LMS Dashboard
            </Link>
          </Button>
          <Link href="/trainer/dashboard/programs/create">
            <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrograms}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.2</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Programs */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Programs</CardTitle>
              <Link href="/trainer/dashboard/programs">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPrograms.map((program) => (
                <div key={program.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Program" />
                      <AvatarFallback>
                        {program.title
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{program.title}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{program.participants} participants</span>
                        <span>•</span>
                        <span>{program.mentors} mentors</span>
                        {program.hasLMS && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">
                              LMS Enabled
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(program.status)}>{program.status}</Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">${program.revenue.toLocaleString()}</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={program.progress} className="w-16 h-2" />
                        <span className="text-xs text-muted-foreground">{program.progress}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {program.hasLMS && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/lms/programs/${program.id}`}>
                            <BarChart3 className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/trainer/dashboard/programs/${program.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Things that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{task.title}</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to help you manage your programs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/trainer/dashboard/programs/create">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                <Plus className="h-6 w-6" />
                <span>Create Program</span>
              </Button>
            </Link>
            <Link href="/trainer/dashboard/programs">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                <BookOpen className="h-6 w-6" />
                <span>Manage Programs</span>
              </Button>
            </Link>
            <Link href="/lms/dashboard">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                <BarChart3 className="h-6 w-6" />
                <span>LMS Dashboard</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
