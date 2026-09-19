"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  DollarSign,
  User,
  Star,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProgramMentor {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  expertise: string[]
  rating: number
  totalSessions: number
  status: "accepted" | "pending" | "rejected"
  appliedDate: string
  acceptedDate?: string
  rejectedDate?: string
  rejectionReason?: string
  assignedSessions: number
  completedSessions: number
  upcomingSessions: number
  hourlyRate: number
  totalEarnings: number
  lastPaidDate?: string
  pendingPayment: number
}

export default function ProgramMentorsPage() {
  const params = useParams()
  const programId = params.id as string

  const [program] = useState({
    id: programId,
    title: "Digital Marketing Bootcamp",
    status: "active",
  })

  const [mentors, setMentors] = useState<ProgramMentor[]>([
    {
      id: "1",
      name: "Tunde Adeyemi",
      email: "tunde@example.com",
      phone: "+234 801 234 5678",
      avatar: "/placeholder.svg?height=40&width=40",
      expertise: ["SEO", "Content Strategy"],
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
      pendingPayment: 22000,
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael@example.com",
      phone: "+1 (555) 234-5678",
      avatar: "/placeholder.svg?height=40&width=40",
      expertise: ["Social Media", "Paid Ads"],
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
      pendingPayment: 20000,
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily@example.com",
      phone: "+1 (555) 345-6789",
      avatar: "/placeholder.svg?height=40&width=40",
      expertise: ["Influencer Marketing"],
      rating: 4.7,
      totalSessions: 18,
      status: "pending",
      appliedDate: "2024-01-15",
      assignedSessions: 0,
      completedSessions: 0,
      upcomingSessions: 0,
      hourlyRate: 100,
      totalEarnings: 0,
      pendingPayment: 0,
    },
  ])

  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const totalOwed = mentors
    .filter((m) => m.status === "accepted")
    .reduce((sum, m) => sum + m.pendingPayment, 0)

  const handleAcceptMentor = (mentorId: string) => {
    setMentors((prev) =>
      prev.map((mentor) =>
        mentor.id === mentorId
          ? { ...mentor, status: "accepted" as const, acceptedDate: new Date().toISOString().split("T")[0] }
          : mentor,
      ),
    )
  }

  const handleRejectMentor = (mentorId: string) => {
    setMentors((prev) =>
      prev.map((mentor) =>
        mentor.id === mentorId
          ? { ...mentor, status: "rejected" as const, rejectedDate: new Date().toISOString().split("T")[0] }
          : mentor,
      ),
    )
  }

  const handleProcessPayment = (mentorId: string) => {
    setMentors((prev) =>
      prev.map((mentor) =>
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
  }

  const filteredMentors = mentors.filter((mentor) => {
    const matchesFilter = filter === "all" || mentor.status === filter
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#E7E5E1] bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="text-xs font-semibold text-[#6B6B6B] hover:text-[#0A0A0A]">
              <Link href={`/trainer/dashboard/programs/${programId}`}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Programme
              </Link>
            </Button>
          </div>
          <div>
            <span className="text-xs font-black text-[#0A0A0A]">mentwork</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0A0A0A]">
              Mentors &amp; payments
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">{program.title}</p>
          </div>
        </div>

        {/* Owed this cycle banner (Gallery style) */}
        <div className="rounded-2xl bg-[#F2F1EE] border border-[#E7E5E1] p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#6B6B6B] font-medium">Owed this cycle</p>
            <p className="text-2xl font-black text-[#0A0A0A] mt-0.5">₦{totalOwed.toLocaleString()}</p>
          </div>
          <Badge variant="yellow" className="text-xs px-3 py-1">
            {mentors.filter((m) => m.status === "accepted").length} Active Mentors
          </Badge>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#9B9B9B] h-4 w-4" />
            <Input
              placeholder="Search mentors by name or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl text-xs sm:text-sm"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl text-xs sm:text-sm font-semibold">
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

        {/* Mentors List */}
        <div className="space-y-4">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="rounded-2xl border border-[#E7E5E1] bg-white p-5 shadow-sm hover:border-[#D8D5CF] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#2B2B2B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {mentor.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#0A0A0A]">{mentor.name}</h3>
                    {mentor.status === "accepted" && <Badge variant="sage">Accepted</Badge>}
                    {mentor.status === "pending" && <Badge variant="slate">Pending</Badge>}
                    {mentor.status === "rejected" && <Badge variant="rust">Rejected</Badge>}
                  </div>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">{mentor.email}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {mentor.expertise.map((exp) => (
                      <span key={exp} className="text-[10px] bg-[#F2F1EE] text-[#0A0A0A] px-2 py-0.5 rounded-full font-medium">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Side */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E7E5E1]">
                {mentor.status === "accepted" ? (
                  <>
                    <span className="text-xs font-bold text-[#6B6B6B]">
                      ₦{mentor.pendingPayment.toLocaleString()} owed
                    </span>
                    {mentor.pendingPayment > 0 ? (
                      <Button
                        onClick={() => handleProcessPayment(mentor.id)}
                        size="sm"
                        className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-full text-xs px-4 h-9 hover:bg-[#e0b300]"
                      >
                        Issue payment
                      </Button>
                    ) : (
                      <Badge variant="sage-subtle" className="text-xs">Paid</Badge>
                    )}
                  </>
                ) : mentor.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptMentor(mentor.id)}
                      size="sm"
                      className="bg-[#5B7B6E] text-white font-bold rounded-xl text-xs h-9 hover:bg-[#4a6459]"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleRejectMentor(mentor.id)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-bold text-[#B0674A] border-[#E7E5E1] h-9"
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-[#9B9B9B]">Application Rejected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
