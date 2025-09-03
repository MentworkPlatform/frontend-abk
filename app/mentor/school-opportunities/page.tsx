"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Search, Calendar, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import type { SchoolMentorshipProgram, ApplicationStatus } from "@/types/school-mentorship"
import { ApplyToProgramModal } from "@/components/school-mentorship/apply-to-program-modal"

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
    status: "open",
    compensationRate: 40,
  },
  {
    id: "4",
    title: "STEM Exploration",
    description: "Introducing students to various STEM fields through hands-on projects",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    status: "open",
    compensationRate: 55,
  },
]

// Mock application data
const mockApplications = [
  { programId: "1", status: "accepted" as ApplicationStatus },
  { programId: "3", status: "applied" as ApplicationStatus },
]

export default function SchoolOpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProgram, setSelectedProgram] = useState<SchoolMentorshipProgram | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredPrograms = mockPrograms.filter(
    (program) =>
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getApplicationStatus = (programId: string): ApplicationStatus | null => {
    const application = mockApplications.find((app) => app.programId === programId)
    return application ? application.status : null
  }

  const handleApplyToProgram = (program: SchoolMentorshipProgram) => {
    setSelectedProgram(program)
    setIsModalOpen(true)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">School Mentorship Opportunities</h1>
          <p className="text-gray-500">Apply to mentor students through Mentwork Foundation</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search opportunities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="available" className="mb-6">
        <TabsList className="w-full md:w-auto grid grid-cols-3">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
        </TabsList>
        <TabsContent value="available" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms
              .filter((program) => program.status === "open" && !getApplicationStatus(program.id))
              .map((program) => (
                <OpportunityCard
                  key={program.id}
                  program={program}
                  applicationStatus={null}
                  onApply={() => handleApplyToProgram(program)}
                />
              ))}
          </div>
          {filteredPrograms.filter((program) => program.status === "open" && !getApplicationStatus(program.id))
            .length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No available opportunities found</p>
              <p className="text-sm text-gray-400">Check back later for new opportunities</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="applied" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms
              .filter(
                (program) =>
                  getApplicationStatus(program.id) === "applied" || getApplicationStatus(program.id) === "pending",
              )
              .map((program) => (
                <OpportunityCard
                  key={program.id}
                  program={program}
                  applicationStatus={getApplicationStatus(program.id)}
                  onApply={() => {}}
                />
              ))}
          </div>
          {filteredPrograms.filter(
            (program) =>
              getApplicationStatus(program.id) === "applied" || getApplicationStatus(program.id) === "pending",
          ).length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't applied to any programs yet</p>
              <p className="text-sm text-gray-400">Browse available opportunities to apply</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms
              .filter((program) => getApplicationStatus(program.id) === "accepted")
              .map((program) => (
                <OpportunityCard
                  key={program.id}
                  program={program}
                  applicationStatus={getApplicationStatus(program.id)}
                  onApply={() => {}}
                />
              ))}
          </div>
          {filteredPrograms.filter((program) => getApplicationStatus(program.id) === "accepted").length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have any active school programs</p>
              <p className="text-sm text-gray-400">Apply to opportunities to get started</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedProgram && (
        <ApplyToProgramModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} program={selectedProgram} />
      )}
    </div>
  )
}

interface OpportunityCardProps {
  program: SchoolMentorshipProgram
  applicationStatus: ApplicationStatus | null
  onApply: () => void
}

function OpportunityCard({ program, applicationStatus, onApply }: OpportunityCardProps) {
  const getStatusBadge = () => {
    if (!applicationStatus) return null

    switch (applicationStatus) {
      case "applied":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="mr-1 h-3 w-3" /> Applied
          </Badge>
        )
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" /> Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" /> Not Selected
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" /> Under Review
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{program.title}</CardTitle>
            <CardDescription className="mt-1">{program.description}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
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
            <DollarSign className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Compensation</p>
              <p className="text-lg font-bold">${program.compensationRate}/hour</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {!applicationStatus ? (
          <Button onClick={onApply} className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]">
            Apply to Program
          </Button>
        ) : applicationStatus === "applied" || applicationStatus === "pending" ? (
          <Button variant="outline" className="w-full" disabled>
            Application Submitted
          </Button>
        ) : (
          <Button className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]">View Program Details</Button>
        )}
      </CardFooter>
    </Card>
  )
}
