"use client"

import Link from "next/link"
import { Calendar, Users, DollarSign, TrendingUp, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardHeader } from "@/components/dashboard-header"

// Mock data for mentor's programs
const mentorPrograms = [
  {
    id: 1,
    title: "Startup Funding Masterclass",
    status: "active",
    mentees: 12,
    totalSessions: 6,
    completedSessions: 3,
    upcomingSession: "Tomorrow, 10:00 AM",
    earned: 525000,
    pending: 1050000,
    progress: 50,
    focusArea: "Finance & Funding",
  },
  {
    id: 2,
    title: "Leadership Development",
    status: "active",
    mentees: 6,
    totalSessions: 12,
    completedSessions: 8,
    upcomingSession: "Friday, 2:00 PM",
    earned: 1800000,
    pending: 900000,
    progress: 67,
    focusArea: "Leadership & People",
  },
  {
    id: 3,
    title: "Product Management Essentials",
    status: "upcoming",
    mentees: 8,
    totalSessions: 8,
    completedSessions: 0,
    upcomingSession: "Starts in 2 weeks",
    earned: 0,
    pending: 2400000,
    progress: 0,
    focusArea: "Operations & Innovation",
  },
  {
    id: 4,
    title: "Digital Marketing Strategy",
    status: "completed",
    mentees: 15,
    totalSessions: 10,
    completedSessions: 10,
    upcomingSession: null,
    earned: 3750000,
    pending: 0,
    progress: 100,
    focusArea: "Branding/Marketing/Sales",
  },
]

// Calculate total stats
const totalEarned = mentorPrograms.reduce((sum, p) => sum + p.earned, 0)
const totalPending = mentorPrograms.reduce((sum, p) => sum + p.pending, 0)
const totalMentees = mentorPrograms.reduce((sum, p) => sum + p.mentees, 0)
const activePrograms = mentorPrograms.filter((p) => p.status === "active").length

export default function MentorProgramsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "upcoming":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Programs"
        description="Manage all your teaching programs and track your progress"
      />

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Programs</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{activePrograms}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Mentees</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{totalMentees}</p>
              </div>
              <Users className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Earned</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">₦{totalEarned.toLocaleString()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Payment</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">₦{totalPending.toLocaleString()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mentorPrograms.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                    {program.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getStatusColor(program.status)}>{program.status}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {program.focusArea}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/mentor/dashboard/programs/${program.id}`}>
                    <Eye className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              {program.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className="font-semibold text-gray-900">{program.progress}%</span>
                  </div>
                  <Progress value={program.progress} className="h-2" />
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Mentees</p>
                    <p className="text-sm font-semibold text-gray-900">{program.mentees}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Sessions</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {program.completedSessions}/{program.totalSessions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Earnings */}
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Earned</span>
                  <span className="text-sm font-semibold text-green-700">
                    ₦{program.earned.toLocaleString()}
                  </span>
                </div>
                {program.pending > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">Pending</span>
                    <span className="text-sm font-semibold text-orange-700">
                      ₦{program.pending.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Upcoming Session */}
              {program.upcomingSession && (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600 font-medium">Next session:</span>
                    <span className="text-gray-900 font-semibold">{program.upcomingSession}</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button asChild className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000] font-medium">
                <Link href={`/mentor/dashboard/programs/${program.id}`}>View Program Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
