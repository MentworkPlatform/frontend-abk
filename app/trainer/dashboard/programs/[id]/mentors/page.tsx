"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Star,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProgramMentorsPage() {
  const params = useParams()
  const programId = params.id as string

  const [program] = useState({
    id: programId,
    title: "Digital Marketing Bootcamp",
    status: "active",
    startDate: "2024-02-15",
    endDate: "2024-05-15",
    totalSessions: 12,
    completedSessions: 8,
  })

  const [mentors, setMentors] = useState([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg?height=40&width=40",
      expertise: ["Digital Marketing", "SEO", "Content Strategy"],
      rating: 4.9,
      totalSessions: 45,
      status: "accepted",
      appliedDate: "2024-01-10",
      acceptedDate: "2024-01-12",
      assignedSessions: 3,
      completedSessions: 2,
      upcomingSessions: 1,
      hourlyRate: 150,
      totalEarnings: 450,
      lastPaidDate: "2024-01-20",
      pendingPayment: 150,
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael@example.com",
      phone: "+1 (555) 234-5678",
      avatar: "/placeholder.svg?height=40&width=40",
      expertise: ["Social Media", "Analytics", "Paid Advertising"],
      rating: 4.8,
      totalSessions: 32,
      status: "accepted",
      appliedDate: "2024-01-08",
      acceptedDate: "2024-01-10",
      assignedSessions: 4,
      completedSessions: 3,
      upcomingSessions: 1,
      hourlyRate: 120,
      totalEarnings: 480,
      lastPaidDate: "2024-01-18",
      pendingPayment: 120,
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily@example.com",
      phone: "+1 (555) 345-6789",
      avatar: "/placeholder.svg?height=40&width=40",
      expertise: ["Email Marketing", "Automation", "CRM"],
      rating: 4.7,
      totalSessions: 28,
      status: "pending",
      appliedDate: "2024-01-15",
      assignedSessions: 0,
      completedSessions: 0,
      upcomingSessions: 0,
      hourlyRate: 130,
      totalEarnings: 0,
      pendingPayment: 0,
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1 (555) 456-7890",
      avatar: "/placeholder.svg?height=40&width=40",
      expertise: ["E-commerce", "Conversion Optimization"],
      rating: 4.6,
      totalSessions: 22,
      status: "rejected",
      appliedDate: "2024-01-12",
      rejectedDate: "2024-01-14",
      rejectionReason: "Schedule conflict with existing commitments",
      assignedSessions: 0,
      completedSessions: 0,
      upcomingSessions: 0,
      hourlyRate: 140,
      totalEarnings: 0,
      pendingPayment: 0,
    },
  ])

  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleAcceptMentor = (mentorId: string) => {
    setMentors(
      mentors.map((mentor) =>
        mentor.id === mentorId
          ? { ...mentor, status: "accepted", acceptedDate: new Date().toISOString().split("T")[0] }
          : mentor,
      ),
    )
  }

  const handleRejectMentor = (mentorId: string) => {
    setMentors(
      mentors.map((mentor) =>
        mentor.id === mentorId
          ? { ...mentor, status: "rejected", rejectedDate: new Date().toISOString().split("T")[0] }
          : mentor,
      ),
    )
  }

  const handleProcessPayment = (mentorId: string) => {
    setMentors(
      mentors.map((mentor) =>
        mentor.id === mentorId
          ? {
              ...mentor,
              lastPaidDate: new Date().toISOString().split("T")[0],
              pendingPayment: 0,
              totalEarnings: mentor.totalEarnings + mentor.pendingPayment,
            }
          : mentor,
      ),
    )
    alert("Payment processed successfully!")
  }

  const filteredMentors = mentors.filter((mentor) => {
    const matchesFilter = filter === "all" || mentor.status === filter
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/trainer/dashboard/programs/${programId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Program
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Program Mentors</h1>
                <p className="text-gray-500">{program.title}</p>
              </div>
            </div>
            <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
              <Plus className="h-4 w-4 mr-2" />
              Invite Mentors
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Mentors</p>
                  <p className="text-2xl font-bold">{mentors.length}</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Accepted</p>
                  <p className="text-2xl font-bold">{mentors.filter((m) => m.status === "accepted").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold">{mentors.filter((m) => m.status === "pending").length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Payments</p>
                  <p className="text-2xl font-bold">
                    ${mentors.reduce((sum, mentor) => sum + mentor.totalEarnings, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search mentors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentors List */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="payments">Payment Management</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="space-y-4">
              {filteredMentors.map((mentor) => (
                <Card key={mentor.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                          <AvatarFallback>
                            {mentor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div>
                            <h3 className="text-lg font-medium">{mentor.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {mentor.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {mentor.phone}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{mentor.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{mentor.totalSessions} total sessions</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">${mentor.hourlyRate}/hour</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {mentor.expertise.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          {mentor.status === "accepted" && (
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Assigned:</span>
                                <span className="ml-1 font-medium">{mentor.assignedSessions} sessions</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Completed:</span>
                                <span className="ml-1 font-medium">{mentor.completedSessions} sessions</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Upcoming:</span>
                                <span className="ml-1 font-medium">{mentor.upcomingSessions} sessions</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(mentor.status)} className="flex items-center gap-1">
                          {getStatusIcon(mentor.status)}
                          {mentor.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule Session
                            </DropdownMenuItem>
                            {mentor.status === "pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleAcceptMentor(mentor.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Accept Application
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRejectMentor(mentor.id)}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject Application
                                </DropdownMenuItem>
                              </>
                            )}
                            {mentor.status === "accepted" && mentor.pendingPayment > 0 && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleProcessPayment(mentor.id)}>
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Process Payment (${mentor.pendingPayment})
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>Track and process mentor payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentors
                    .filter((m) => m.status === "accepted")
                    .map((mentor) => (
                      <div key={mentor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                            <AvatarFallback>
                              {mentor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{mentor.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Rate: ${mentor.hourlyRate}/hour</span>
                              <span>•</span>
                              <span>Completed: {mentor.completedSessions} sessions</span>
                              {mentor.lastPaidDate && (
                                <>
                                  <span>•</span>
                                  <span>Last paid: {new Date(mentor.lastPaidDate).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Total Earnings</p>
                            <p className="font-medium">${mentor.totalEarnings}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Pending Payment</p>
                            <p className="font-medium text-green-600">${mentor.pendingPayment}</p>
                          </div>
                          {mentor.pendingPayment > 0 && (
                            <Button
                              size="sm"
                              onClick={() => handleProcessPayment(mentor.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Pay ${mentor.pendingPayment}
                            </Button>
                          )}
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
