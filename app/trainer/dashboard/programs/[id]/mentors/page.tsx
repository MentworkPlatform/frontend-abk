"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Mail, Phone, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { API_URL } from "@/components/Serverurl"

type Mentor = {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  expertise: string[]
  rating: number
  totalSessions: number
  hourlyRate?: number
}

export default function ProgramMentorsPage() {
  const params = useParams()
  const programId = params.id as string
  const searchParams = useSearchParams()
  const topicId = searchParams.get("topicId")
  const router = useRouter()

  const [mentors, setMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assignError, setAssignError] = useState<string | null>(null)
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null)
  const [isAssigning, setIsAssigning] = useState<Record<string, boolean>>({})
  const [proposedRates, setProposedRates] = useState<Record<string, string>>({})
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({})
  const [existingAssignments, setExistingAssignments] = useState<any[]>([])
  const [topicTitle, setTopicTitle] = useState<string | null>(null)

  useEffect(() => {
    const fetchMentors = async () => {
      setError(null)
      try {
        const response = await fetch(`${API_URL}/mentors`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        const data = await response.json()
        if (data?.success && Array.isArray(data.mentors)) {
          const mapped: Mentor[] = data.mentors.map((mentor: any) => {
            const profile = mentor.profile || {}
            const expertiseRaw = profile.expertise
            const expertise = Array.isArray(expertiseRaw)
              ? expertiseRaw
              : typeof expertiseRaw === "string"
              ? expertiseRaw
                  .split(",")
                  .map((item: string) => item.trim())
                  .filter(Boolean)
              : []

            return {
              id: mentor.id ? String(mentor.id) : "",
              name: mentor.name || "Unknown",
              email: mentor.email || "",
              phone: profile.phone || "",
              avatar: profile.profile_picture_url || undefined,
              expertise,
              rating: profile.rating ?? 0,
              totalSessions: profile.totalSessions ?? 0,
              hourlyRate: profile.hourlyRate ?? 0,
            }
          })
          setMentors(mapped)
          const rates: Record<string, string> = {}
          mapped.forEach((m) => (rates[m.id] = m.hourlyRate?.toString() ?? ""))
          setProposedRates(rates)
        } else {
          setError("Failed to load mentors.")
          setMentors([])
        }
      } catch (err) {
        console.error(err)
        setError("Unable to fetch mentors right now.")
        setMentors([])
      } finally {
        setIsLoading(false)
      }
    }

    const fetchProgramAssignments = async () => {
      try {
        const response = await fetch(`${API_URL}/programs/details/${programId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        const data = await response.json()
        if (data?.success && Array.isArray(data.program?.mentorAssignments)) {
          setExistingAssignments(data.program.mentorAssignments)
          if (topicId) {
            const matchTopic = data.program.curriculum
              ?.flatMap((m: any) => m.topics || [])
              ?.find((t: any) => String(t.id ?? t.topicId) === topicId)
            setTopicTitle(matchTopic?.title ?? null)
          }
        }
      } catch (err) {
        console.error("Error fetching program assignments", err)
      }
    }

    fetchMentors()
    fetchProgramAssignments()
  }, [programId, topicId])

  const approvedMentorIds = useMemo(() => {
    return new Set(
      existingAssignments
        .filter((a) => {
          const status = (a.status || "").toString().trim().toUpperCase()
          return status === "APPROVED" || status === "ACCEPTED"
        })
        .map((a) => String(a.mentorId))
    )
  }, [existingAssignments])

  const filteredMentors = mentors.filter((mentor) => !approvedMentorIds.has(mentor.id))

  const handleAssignMentor = async (mentor: Mentor) => {
    if (isAssigning[mentor.id]) return
    if (!topicId) {
      setAssignError("Missing topic. Please return to the edit page and retry.")
      return
    }

    const rate = proposedRates[mentor.id] || mentor.hourlyRate?.toString() || ""
    const parsedRate = Number(rate)
    if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
      setAssignError("Enter a valid proposed hourly rate.")
      return
    }

    setAssignError(null)
    setAssignSuccess(null)
    setIsAssigning((prev) => ({ ...prev, [mentor.id]: true }))

    // Store selection locally so the edit page can pick it up and render the change.
    const payload = {
      topicId,
      mentor: {
        id: mentor.id,
        name: mentor.name,
        email: mentor.email,
        profile: {
          profile_picture_url: mentor.avatar,
          bio: "",
        },
      },
      proposedRate: parsedRate,
      customMessage: customMessages[mentor.id]?.trim() || "",
      topicTitle: topicTitle || "",
    }
    try {
      localStorage.setItem("pending-mentor-reassign", JSON.stringify(payload))
      router.replace(`/trainer/dashboard/programs/${programId}/edit`)
      return
    } catch (err) {
      console.error(err)
      setAssignError("Unable to store selection. Please retry.")
    } finally {
      setIsAssigning((prev) => ({ ...prev, [mentor.id]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-white border-b">
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
                {topicId && (
                  <p className="text-gray-500">
                    Changing mentor for {topicTitle ? `"${topicTitle}"` : `topic ${topicId}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-4">
        {assignError && <p className="text-sm text-red-600">{assignError}</p>}
        {assignSuccess && <p className="text-sm text-green-600">{assignSuccess}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {isLoading && <p className="text-sm text-gray-500">Loading mentors...</p>}

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="space-y-4">
              {filteredMentors.map((mentor) => (
                <Card key={mentor.id}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
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
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-600">Proposed hourly rate (USD)</label>
                        <Input
                          type="number"
                          min="0"
                          value={proposedRates[mentor.id] ?? mentor.hourlyRate ?? ""}
                          onChange={(e) =>
                            setProposedRates((prev) => ({ ...prev, [mentor.id]: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-600">Custom message (optional)</label>
                        <Textarea
                          rows={2}
                          value={customMessages[mentor.id] ?? ""}
                          onChange={(e) =>
                            setCustomMessages((prev) => ({ ...prev, [mentor.id]: e.target.value }))
                          }
                          placeholder="Add a short note to the mentor"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        disabled={isAssigning[mentor.id]}
                        className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                        onClick={() => handleAssignMentor(mentor)}
                      >
                        {isAssigning[mentor.id] ? "Assigning..." : "Assign to Topic"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {!isLoading && filteredMentors.length === 0 && (
                <p className="text-sm text-gray-500">
                  No available mentors. Approved mentors for this program are hidden from this list.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
