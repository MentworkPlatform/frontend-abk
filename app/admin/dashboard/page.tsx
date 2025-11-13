"use client"

import { useState } from "react"
import { Users, Plus, School, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for mentors
const mentors = [
  {
    id: "m1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "Builder",
    sessions: 18,
    rating: 4.3,
    hours: 36,
    programs: 2,
    earnings: 2450,
    joinedAt: "2023-01-15",
    status: "active",
  },
  {
    id: "m2",
    name: "Michael Chen",
    email: "michael.c@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "Leader",
    sessions: 42,
    rating: 4.7,
    hours: 84,
    programs: 3,
    earnings: 5800,
    joinedAt: "2022-11-03",
    status: "active",
  },
  {
    id: "m3",
    name: "Jessica Williams",
    email: "jessica.w@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "Starter",
    sessions: 7,
    rating: 4.1,
    hours: 14,
    programs: 1,
    earnings: 980,
    joinedAt: "2023-03-22",
    status: "pending",
  },
  {
    id: "m4",
    name: "David Rodriguez",
    email: "david.r@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "Partner",
    sessions: 65,
    rating: 4.9,
    hours: 130,
    programs: 5,
    earnings: 8900,
    joinedAt: "2022-08-17",
    status: "active",
  },
  {
    id: "m5",
    name: "Emily Taylor",
    email: "emily.t@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "Builder",
    sessions: 22,
    rating: 4.4,
    hours: 44,
    programs: 2,
    earnings: 3100,
    joinedAt: "2023-02-08",
    status: "active",
  },
]

// Mock data for school programs
const schoolPrograms = [
  {
    id: "sp1",
    title: "Introduction to Coding",
    school: "Westside High School",
    startDate: "2023-09-01",
    endDate: "2023-10-30",
    status: "in_progress",
    mentors: 4,
    students: 20,
    sessions: {
      completed: 6,
      total: 16,
    },
    stipend: 1200,
  },
  {
    id: "sp2",
    title: "Business Leadership",
    school: "Mentwork School",
    startDate: "2023-10-15",
    endDate: "2024-01-15",
    status: "open",
    mentors: 2,
    students: 15,
    sessions: {
      completed: 0,
      total: 12,
    },
    stipend: 1800,
  },
  {
    id: "sp3",
    title: "Digital Marketing Fundamentals",
    school: "Eastside Academy",
    startDate: "2023-08-10",
    endDate: "2023-09-20",
    status: "completed",
    mentors: 3,
    students: 18,
    sessions: {
      completed: 6,
      total: 6,
    },
    stipend: 900,
  },
  {
    id: "sp4",
    title: "Advanced Entrepreneurship",
    school: "Mentwork School",
    startDate: "2023-11-01",
    endDate: "2024-01-10",
    status: "open",
    mentors: 0,
    students: 12,
    sessions: {
      completed: 0,
      total: 20,
    },
    stipend: 2400,
  },
]

// Mock data for tier settings
const tierSettings = [
  {
    name: "Starter",
    requirements: {
      sessions: 0,
      rating: 0,
      programs: 0,
    },
    commission: 25,
  },
  {
    name: "Builder",
    requirements: {
      sessions: 10,
      rating: 4.0,
      programs: 1,
    },
    commission: 20,
  },
  {
    name: "Leader",
    requirements: {
      sessions: 25,
      rating: 4.5,
      programs: 2,
    },
    commission: 15,
  },
  {
    name: "Partner",
    requirements: {
      sessions: 50,
      rating: 4.8,
      programs: 4,
    },
    commission: 10,
  },
]

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tierFilter, setTierFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [programStatusFilter, setProgramStatusFilter] = useState("all")
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false)

  // Filter mentors based on search query, tier filter, and status filter
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTier = tierFilter === "all" || mentor.tier.toLowerCase() === tierFilter.toLowerCase()
    
    const matchesStatus = statusFilter === "all" || mentor.status === statusFilter

    return matchesSearch && matchesTier && matchesStatus
  })

  // Filter school programs based on status
  const filteredPrograms = schoolPrograms.filter((program) => {
    return programStatusFilter === "all" || program.status === programStatusFilter
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500">Manage mentors, programs, and platform settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Platform Settings
          </Button>
          <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
            <Plus className="mr-2 h-4 w-4" /> New School Program
          </Button>
        </div>
      </div>

      {/* Overview Cards - Enhanced with better visualization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <Users className="mr-2 h-4 w-4 text-blue-500" /> Total Mentors
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{mentors.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              {mentors.filter(m => m.status === "active").length} active, {mentors.filter(m => m.status === "pending").length} pending
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-white">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <School className="mr-2 h-4 w-4 text-green-500" /> Active School Programs
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {schoolPrograms.filter((p) => p.status === "in_progress" || p.status === "open").length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {schoolPrograms.filter(p => p.status === "in_progress").length} in progress, {schoolPrograms.filter(p => p.status === "open").length} open
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-white">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center"/>

\
