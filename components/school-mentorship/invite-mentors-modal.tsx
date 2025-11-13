"use client"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { SchoolMentorshipProgram, Mentor } from "@/types/school-mentorship"

// Mock data for demonstration
const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    expertise: ["Technology", "Leadership"],
    skills: ["Coding", "Public Speaking", "Project Management"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@example.com",
    expertise: ["Business", "Marketing"],
    skills: ["Strategy", "Social Media", "Analytics"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Aisha Patel",
    email: "aisha.p@example.com",
    expertise: ["Creative Arts", "Education"],
    skills: ["Visual Design", "Curriculum Development", "Mentoring"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "David Rodriguez",
    email: "david.r@example.com",
    expertise: ["Technology", "Engineering"],
    skills: ["Software Development", "Hardware Design", "Robotics"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Emma Wilson",
    email: "emma.w@example.com",
    expertise: ["Business", "Finance"],
    skills: ["Accounting", "Investment", "Entrepreneurship"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

interface InviteMentorsModalProps {
  isOpen: boolean
  onClose: () => void
  program: SchoolMentorshipProgram
}

export function InviteMentorsModal({ isOpen, onClose, program }: InviteMentorsModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([])
  const [selectedMentors, setSelectedMentors] = useState<string[]>([])
  const [compensationRates, setCompensationRates] = useState<Record<string, number>>({})
  const [showFilters, setShowFilters] = useState(false)

  // Initialize compensation rates with program default
  useEffect(() => {
    const rates: Record<string, number> = {}
    mockMentors.forEach((mentor) => {
      rates[mentor.id] = program.compensationRate
    })
    setCompensationRates(rates)
  }, [program])

  const allExpertiseAreas = Array.from(new Set(mockMentors.flatMap((mentor) => mentor.expertise)))

  const filteredMentors = mockMentors.filter((mentor) => {
    const matchesSearch =
      searchQuery === "" ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesExpertise =
      selectedExpertise.length === 0 || mentor.expertise.some((exp) => selectedExpertise.includes(exp))

    return matchesSearch && matchesExpertise
  })

  const toggleMentorSelection = (mentorId: string) => {
    setSelectedMentors((prev) => (prev.includes(mentorId) ? prev.filter((id) => id !== mentorId) : [...prev, mentorId]))
  }

  const updateCompensationRate = (mentorId: string, rate: number) => {
    setCompensationRates((prev) => ({
      ...prev,
      [mentorId]: rate,
    }))
  }

  const handleSendInvitations = () => {
    // In a real application, this would send the invitations to the selected mentors
    console.log("Sending invitations to:", selectedMentors)
    console.log(
      "With compensation rates:",
      selectedMentors.map((id) => ({ id, rate: compensationRates[id] })),
    )
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Mentors to {program.title}</DialogTitle>
          <DialogDescription>Search and select mentors to invite to this school mentorship program.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search mentors by name, email, or skills..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:w-auto w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="p-4 border rounded-md bg-gray-50">
              <h4 className="font-medium mb-2">Filter by Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {allExpertiseAreas.map((expertise) => (
                  <Badge
                    key={expertise}
                    variant={selectedExpertise.includes(expertise) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedExpertise.includes(expertise) ? "bg-[#FFD500] text-black hover:bg-[#e6c000]" : ""
                    }`}
                    onClick={() =>
                      setSelectedExpertise((prev) =>
                        prev.includes(expertise) ? prev.filter((e) => e !== expertise) : [...prev, expertise],
                      )
                    }
                  >
                    {expertise}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-100 p-3 flex items-center">
              <Checkbox
                id="select-all"
                checked={selectedMentors.length === filteredMentors.length && filteredMentors.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedMentors(filteredMentors.map((m) => m.id))
                  } else {
                    setSelectedMentors([])
                  }
                }}
              />
              <label htmlFor="select-all" className="ml-2 text-sm font-medium">
                Select All ({filteredMentors.length})
              </label>
            </div>

            <div className="divide-y">
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) => (
                  <div key={mentor.id} className="p-3 hover:bg-gray-50">
                    <div className="flex items-start">
                      <Checkbox
                        id={`mentor-${mentor.id}`}
                        checked={selectedMentors.includes(mentor.id)}
                        onCheckedChange={() => toggleMentorSelection(mentor.id)}
                        className="mt-1"
                      />
                      <div className="ml-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                            <AvatarFallback>
                              {mentor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{mentor.name}</p>
                            <p className="text-sm text-gray-500">{mentor.email}</p>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {mentor.expertise.map((exp) => (
                              <Badge key={exp} variant="outline" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">Skills: {mentor.skills.join(", ")}</p>
                        </div>

                        {selectedMentors.includes(mentor.id) && (
                          <div className="mt-2 flex items-center">
                            <label className="text-sm mr-2">Compensation Rate ($/hr):</label>
                            <Input
                              type="number"
                              min="0"
                              className="w-20 h-8 text-sm"
                              value={compensationRates[mentor.id]}
                              onChange={(e) =>
                                updateCompensationRate(mentor.id, Number.parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">No mentors found matching your search criteria</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 text-sm">
            {selectedMentors.length} mentor{selectedMentors.length !== 1 ? "s" : ""} selected
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSendInvitations}
            disabled={selectedMentors.length === 0}
            className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
          >
            Send Invitations
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
