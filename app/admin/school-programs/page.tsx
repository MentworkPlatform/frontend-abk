"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Search, Plus, Calendar, Users, CheckCircle, XCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { InviteMentorsModal } from "@/components/school-mentorship/invite-mentors-modal"
import type { SchoolMentorshipProgram } from "@/types/school-mentorship"

// Define MentorshipProgramStatus type
type MentorshipProgramStatus = "open" | "closed" | "in_progress"

// Mock data for demonstration
const mockPrograms: SchoolMentorshipProgram[] = [
  {
    id: "1",
    title: "Tech Leaders of Tomorrow",
    description: "A 12-week program teaching coding and leadership skills to high school students",
    startDate: "2023-09-01",
    endDate: "2023-11-30",
    status: "in_progress",
    compensationRate: 50,
  },
  {
    id: "2",
    title: "Business Fundamentals",
    description: "Introduction to business concepts for middle school students",
    startDate: "2023-10-15",
    endDate: "2023-12-15",
    status: "open",
    compensationRate: 45,
  },
  {
    id: "3",
    title: "Creative Arts Mentorship",
    description: "Guiding students in developing their artistic talents",
    startDate: "2024-01-10",
    endDate: "2024-03-15",
    status: "closed",
    compensationRate: 40,
  },
]

// Mock invitation data
const mockInvitations = [
  { programId: "1", mentorCount: 12, accepted: 8, declined: 1, pending: 3 },
  { programId: "2", mentorCount: 8, accepted: 5, declined: 0, pending: 3 },
  { programId: "3", mentorCount: 15, accepted: 10, declined: 2, pending: 3 },
]

export default function SchoolProgramsAdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProgram, setSelectedProgram] = useState<SchoolMentorshipProgram | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredPrograms = mockPrograms.filter(
    (program) =>
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: MentorshipProgramStatus) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-red-100 text-red-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInvitationStats = (programId: string) => {
    return (
      mockInvitations.find((inv) => inv.programId === programId) || {
        programId,
        mentorCount: 0,
        accepted: 0,
        declined: 0,
        pending: 0,
      }
    )
  }

  const handleInviteMentors = (program: SchoolMentorshipProgram) => {
    setSelectedProgram(program)
    setIsModalOpen(true)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">School Mentorship Programs</h1>
          <p className="text-gray-500">Manage Mentwork Foundation's school programs</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search programs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
            <Plus className="mr-2 h-4 w-4" /> New Program
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="mb-6">
        <TabsList className="w-full md:w-auto grid grid-cols-3">
          <TabsTrigger value="active">Active Programs</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Programs</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredPrograms
              .filter((program) => program.status === "in_progress" || program.status === "open")
              .map((program) => {
                const invStats = getInvitationStats(program.id)
                return (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    invitationStats={invStats}
                    onInviteMentors={() => handleInviteMentors(program)}
                  />
                )
              })}
          </div>
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredPrograms
              .filter((program) => new Date(program.startDate) > new Date())
              .map((program) => {
                const invStats = getInvitationStats(program.id)
                return (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    invitationStats={invStats}
                    onInviteMentors={() => handleInviteMentors(program)}
                  />
                )
              })}
          </div>
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredPrograms
              .filter((program) => program.status === "closed")
              .map((program) => {
                const invStats = getInvitationStats(program.id)
                return (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    invitationStats={invStats}
                    onInviteMentors={() => handleInviteMentors(program)}
                  />
                )
              })}
          </div>
        </TabsContent>
      </Tabs>

      {selectedProgram && (
        <InviteMentorsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} program={selectedProgram} />
      )}
    </div>
  )
}

interface ProgramCardProps {
  program: SchoolMentorshipProgram
  invitationStats: {
    mentorCount: number
    accepted: number
    declined: number
    pending: number
  }
  onInviteMentors: () => void
}

function ProgramCard({ program, invitationStats, onInviteMentors }: ProgramCardProps) {
  const getStatusColor = (status: MentorshipProgramStatus) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-red-100 text-red-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle>{program.title}</CardTitle>
            <CardDescription className="mt-1">{program.description}</CardDescription>
          </div>
          <Badge className={`mt-2 md:mt-0 ${getStatusColor(program.status)}`}>
            {program.status === "in_progress"
              ? "In Progress"
              : program.status.charAt(0).toUpperCase() + program.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Program Duration</p>
              <p className="text-sm text-gray-500">
                {format(new Date(program.startDate), "MMM d, yyyy")} -{" "}
                {format(new Date(program.endDate), "MMM d, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Mentor Invitations</p>
              <div className="flex gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {invitationStats.accepted}
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-red-500" />
                  {invitationStats.declined}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-yellow-500" />
                  {invitationStats.pending}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-sm font-medium">Compensation Rate</p>
              <p className="text-lg font-bold">${program.compensationRate}/hour</p>
            </div>
            <Button onClick={onInviteMentors} className="mt-2 md:mt-0 bg-[#FFD500] text-black hover:bg-[#e6c000]">
              Invite Mentors
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Details</Button>
        <Button variant="outline">Edit Program</Button>
      </CardFooter>
    </Card>
  )
}
