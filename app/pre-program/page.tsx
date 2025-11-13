"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, CheckCircle, Clock, AlertCircle, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function PreProgramPage() {
  const [programData] = useState({
    title: "Digital Marketing Bootcamp",
    description: "A comprehensive 8-week program covering SEO, social media, and paid advertising",
    requiredMentors: 1,
    maxMentors: 5,
  })

  const [mentorInvites] = useState([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      expertise: ["SEO", "Content Marketing"],
      status: "accepted",
      invitedAt: "2024-01-20",
      respondedAt: "2024-01-21",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.c@example.com",
      expertise: ["Social Media", "Paid Ads"],
      status: "pending",
      invitedAt: "2024-01-22",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Emma Wilson",
      email: "emma.w@example.com",
      expertise: ["Analytics", "Strategy"],
      status: "declined",
      invitedAt: "2024-01-19",
      respondedAt: "2024-01-20",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const acceptedMentors = mentorInvites.filter((invite) => invite.status === "accepted")
  const pendingMentors = mentorInvites.filter((invite) => invite.status === "pending")
  const canPublish = acceptedMentors.length >= programData.requiredMentors

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "declined":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/trainer/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{programData.title}</h1>
                <p className="text-gray-600">Pre-Program Setup</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/trainer/dashboard/programs/create">
                  <Send className="mr-2 h-4 w-4" />
                  Invite More Mentors
                </Link>
              </Button>
              <Button disabled={!canPublish} className="bg-[#FFD500] text-black hover:bg-[#e6c000] disabled:opacity-50">
                {canPublish ? "Publish Program" : "Need 1+ Mentor to Publish"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Mentor Invitation Status
            </CardTitle>
            <CardDescription>
              You need at least {programData.requiredMentors} mentor to accept before you can publish your program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress to Launch</span>
                <span className="text-sm text-gray-600">
                  {acceptedMentors.length} of {programData.requiredMentors} required mentors
                </span>
              </div>
              <Progress value={(acceptedMentors.length / programData.requiredMentors) * 100} className="h-3" />

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{acceptedMentors.length}</div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{pendingMentors.length}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{mentorInvites.length}</div>
                  <div className="text-sm text-gray-600">Total Invited</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentor Invites List */}
        <Card>
          <CardHeader>
            <CardTitle>Mentor Invitations</CardTitle>
            <CardDescription>Track the status of your mentor invitations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mentorInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={invite.avatar || "/placeholder.svg"} alt={invite.name} />
                      <AvatarFallback>
                        {invite.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{invite.name}</h3>
                      <p className="text-sm text-gray-600">{invite.email}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {invite.expertise.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(invite.status)}
                        <Badge className={getStatusColor(invite.status)}>
                          {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Invited {new Date(invite.invitedAt).toLocaleDateString()}
                      </p>
                      {invite.respondedAt && (
                        <p className="text-xs text-gray-500">
                          Responded {new Date(invite.respondedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {invite.status === "pending" && (
                      <Button variant="outline" size="sm">
                        Resend
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        {!canPublish && (
          <Card className="mt-8 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <AlertCircle className="mr-2 h-5 w-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-yellow-800">
                <p>• Wait for pending mentor responses</p>
                <p>• Or invite additional mentors to increase your chances</p>
                <p>• Once at least 1 mentor accepts, you can publish your program to the marketplace</p>
              </div>
            </CardContent>
          </Card>
        )}

        {canPublish && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <CheckCircle className="mr-2 h-5 w-5" />
                Ready to Launch!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 mb-4">
                Great! You have {acceptedMentors.length} mentor{acceptedMentors.length !== 1 ? "s" : ""} confirmed. Your
                program is ready to be published to the marketplace.
              </p>
              <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000]">Publish to Marketplace</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
