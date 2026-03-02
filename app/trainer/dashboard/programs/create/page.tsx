"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  X,
  Users,
  Clock,
  BookOpen,
  Search,
  Filter,
  Star,
  Globe,
  Info,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelect } from "@/components/ui/multi-select"
import type { MentorAssignment, PlatformMentor } from "@/types/trainer"
import type { CurriculumTemplate, CurriculumModule } from "@/types/curriculum"
import { CurriculumBuilder } from "@/components/curriculum/curriculum-builder"
import { TemplateSelector } from "@/components/curriculum/template-selector"
import { ApiError, apiClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"
import {
  SECTORS,
  SKILLS_CAPABILITIES,
  getSkillsForSectors,
  getSkillsGroupedBySector,
} from "@/lib/constants/onboarding"

type SaveProgramStepResponse = {
  success?: boolean
  error?: string
  programId?: string
  data?: {
    programId?: string
  }
}

type ProgramStepOnePayload = {
  step: 1
  programId: string
  title: string
  description: string
  tagline: string
  learningOutcomes: string[]
}

type ProgramStepTwoPayload = {
  step: 2
  programId: string
  sectors: string[]
  subSectorSkills: string[]
  skillsCapabilities: string[]
  category: number
  level: string
  format: string
  type: number
  maxParticipant: number
  price: number
  duration: number
  numberOfSessions: number
  meetingLink?: string
  accessCredentials?: string
}

type ProgramStepThreePayload = {
  step: 3
  programId: string
  modules: Array<{
    title: string
    description: string
    duration: number
    learningObjectives: string[]
    topics: Array<{
      id: string
      title: string
      description: string
      type: string
      duration: number
    }>
  }>
}

type ProgramStepFourPayload = {
  step: 4
  programId: string
  topicMentors: Array<{
    topicIds: string[]
    mentorId: string
    proposedRate: number
    customMessage: string
    feedbacklink?: string
  }>
}

type ApiSurveyItem = {
  id?: string | number
  slug?: string
  surveySlug?: string
  title?: string
  name?: string
  surveyTitle?: string
  feedbackLink?: string
  link?: string
  surveyLink?: string
  url?: string
  feedbacklink?: string
}

type AllSurveysResponse = {
  success?: boolean
  message?: string
  allsurvey?: ApiSurveyItem[]
}

type ApiMentorProfile = {
  professional_background?: string | null
  bio?: string | null
  expertise?: string | string[] | null
  availability?: string | null
  hourlyRate?: string | number | null
  experience_years?: number | null
  location?: string | null
}

type ApiMentorItem = {
  id?: string | number
  name?: string
  email?: string
  avatar?: string
  title?: string
  company?: string
  bio?: string
  expertise?: string | string[]
  rating?: number
  totalReviews?: number
  totalSessions?: number
  hourlyRate?: string | number
  availability?: string
  languages?: string[]
  timezone?: string
  responseTime?: string
  successRate?: number
  specializations?: string[]
  yearsOfExperience?: number
  education?: string[]
  certifications?: string[]
  profile?: ApiMentorProfile | string
}

type MentorsApiResponse = {
  success?: boolean
  error?: string
  message?: string
  mentors?: ApiMentorItem[]
  mentor?: ApiMentorItem[]
  data?: ApiMentorItem[]
}

type DraftProgramEnvelope = {
  step?: number
  programId?: string
  data?: Record<string, unknown>
}

type DraftProgramResponse = {
  success?: boolean
  error?: string
  message?: string
  draft?: DraftProgramEnvelope | Record<string, unknown>
  drafts?: Array<DraftProgramEnvelope | Record<string, unknown>>
  data?: DraftProgramEnvelope | Record<string, unknown>
}

type ProgramDetailsByIdResponse = {
  success?: boolean
  error?: string
  message?: string
  program?: Record<string, unknown>
  data?: unknown
}

const LEVEL_VALUE_MAP: Record<string, string> = {
  beginner: "1",
  intermediate: "2",
  advanced: "3",
  "all-levels": "4",
}

const LEVEL_LABEL_MAP: Record<string, string> = {
  "1": "beginner",
  "2": "intermediate",
  "3": "advanced",
  "4": "all-levels",
}

const FORMAT_VALUE_MAP: Record<string, string> = {
  hybrid: "1",
  online: "2",
  "in-person": "3",
}

const FORMAT_LABEL_MAP: Record<string, string> = {
  "1": "hybrid",
  "2": "online",
  "3": "in-person",
}

const getInitialDraftProgramId = () => `draft-program-${Date.now()}`

const toPositiveNumber = (value: string, fallback = 0) => {
  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallback
  }

  return parsedValue
}

const sanitizeStringArray = (items: string[]) =>
  items.map((item) => item.trim()).filter((item) => item.length > 0)

const normalizeTopicTypeForApi = (type: string) =>
  type.trim().replace(/\s+/g, "_").toUpperCase()

const requiresMeetingDetails = (format: string) =>
  format === "online" || format === "hybrid"

const parseNumberValue = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsedValue = Number(value)

    if (Number.isFinite(parsedValue)) {
      return parsedValue
    }
  }

  return fallback
}

const hashString = (value: string) => {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

const getNumericTopicIdFromRaw = (
  rawTopicId: string,
  fallbackKey: string,
  usedIds: Set<string>,
) => {
  const digits = rawTopicId.replace(/\D+/g, "")
  const seed =
    digits.length > 0
      ? digits
      : `${hashString(fallbackKey) || 1}`

  let normalizedId = seed.slice(0, 18).replace(/^0+/, "")

  if (normalizedId.length === 0) {
    normalizedId = `${hashString(fallbackKey) || 1}`
  }

  let candidate = normalizedId
  let suffix = 1

  while (usedIds.has(candidate)) {
    const suffixText = `${suffix}`
    const base = normalizedId.slice(0, Math.max(1, 18 - suffixText.length))
    candidate = `${base}${suffixText}`
    suffix += 1
  }

  usedIds.add(candidate)
  return candidate
}

const toNumericTopicIdValue = (rawTopicId: string, fallbackKey: string) => {
  const digits = rawTopicId.replace(/\D+/g, "")

  if (digits.length > 0) {
    return digits
  }

  return `${hashString(fallbackKey) || 1}`
}

const buildTopicIdMapForApi = (modules: CurriculumModule[]) => {
  const usedIds = new Set<string>()
  const topicIdMap = new Map<string, string>()

  modules.forEach((module, moduleIndex) => {
    module.topics.forEach((topic, topicIndex) => {
      const rawTopicId = `${topic.id}`.trim()
      const normalizedTopicId = getNumericTopicIdFromRaw(
        rawTopicId,
        `${module.id}-${moduleIndex + 1}-${topic.title}-${topicIndex + 1}`,
        usedIds,
      )

      topicIdMap.set(rawTopicId, normalizedTopicId)
    })
  })

  return topicIdMap
}

const resolveCategoryId = (selectedSectors: string[]) => {
  const rawCategory = selectedSectors[0]?.trim()

  if (!rawCategory) {
    return 0
  }

  const numericCategory = Number(rawCategory)

  if (Number.isInteger(numericCategory) && numericCategory > 0) {
    return numericCategory
  }

  const sectorIndex = SECTORS.findIndex((sector) => sector.id === rawCategory)

  return sectorIndex >= 0 ? sectorIndex + 1 : 0
}

const normalizeMentorAvailability = (
  availability: string | undefined,
): PlatformMentor["availability"] => {
  const normalizedValue = (availability ?? "").toLowerCase()

  if (normalizedValue.includes("busy")) {
    return "busy"
  }

  if (normalizedValue.includes("unavailable")) {
    return "unavailable"
  }

  return "available"
}

const parseMentorExpertise = (mentor: ApiMentorItem): string[] => {
  const profile =
    mentor.profile && typeof mentor.profile === "object" ? mentor.profile : undefined

  const expertiseValue = mentor.expertise ?? profile?.expertise

  if (Array.isArray(expertiseValue)) {
    const cleaned = expertiseValue.map((item) => item.trim()).filter(Boolean)
    if (cleaned.length > 0) {
      return cleaned
    }
  }

  if (typeof expertiseValue === "string" && expertiseValue.trim().length > 0) {
    return expertiseValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return ["Mentoring"]
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null

const toStringValue = (value: unknown) => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim()
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value}`
  }

  return null
}

const extractSurveySlug = (value: string | null | undefined) => {
  if (!value) {
    return null
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  if (!trimmedValue.includes("/")) {
    return trimmedValue
  }

  const normalizedSegments = trimmedValue.split("/").filter(Boolean)
  const surveysIndex = normalizedSegments.findIndex((segment) => {
    const normalizedSegment = segment.toLowerCase()
    return normalizedSegment === "surveys" || normalizedSegment === "survey"
  })

  const slugCandidate =
    surveysIndex >= 0 && surveysIndex + 1 < normalizedSegments.length
      ? normalizedSegments[surveysIndex + 1]
      : normalizedSegments[normalizedSegments.length - 1]

  if (!slugCandidate) {
    return null
  }

  try {
    return decodeURIComponent(slugCandidate).trim()
  } catch {
    return slugCandidate.trim()
  }
}

const getSurveyHref = (value: string | undefined) => {
  if (!value) {
    return null
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue
  }

  const slug = extractSurveySlug(trimmedValue)

  if (!slug) {
    return null
  }

  return `/survey/${encodeURIComponent(slug)}`
}

const toStringArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => toStringValue(item))
    .filter((item): item is string => Boolean(item))
}

const normalizeExperienceLevelFromDraft = (value: unknown) => {
  const rawValue = toStringValue(value)

  if (!rawValue) {
    return ""
  }

  const mappedByCode = LEVEL_LABEL_MAP[rawValue]

  if (mappedByCode) {
    return mappedByCode
  }

  const normalizedValue = rawValue.toLowerCase()

  if (normalizedValue.includes("begin")) {
    return "beginner"
  }

  if (normalizedValue.includes("inter")) {
    return "intermediate"
  }

  if (normalizedValue.includes("adv")) {
    return "advanced"
  }

  if (normalizedValue.includes("all")) {
    return "all-levels"
  }

  return ""
}

const normalizeFormatFromDraft = (value: unknown) => {
  const rawValue = toStringValue(value)

  if (!rawValue) {
    return ""
  }

  const mappedByCode = FORMAT_LABEL_MAP[rawValue]

  if (mappedByCode) {
    return mappedByCode
  }

  const normalizedValue = rawValue.toLowerCase()

  if (normalizedValue.includes("hybrid")) {
    return "hybrid"
  }

  if (
    normalizedValue.includes("in-person") ||
    normalizedValue.includes("in person") ||
    normalizedValue.includes("physical") ||
    normalizedValue.includes("offline")
  ) {
    return "in-person"
  }

  if (normalizedValue.includes("online") || normalizedValue.includes("virtual")) {
    return "online"
  }

  return ""
}

const normalizeTopicTypeFromApi = (
  value: unknown,
): CurriculumModule["topics"][number]["type"] => {
  const normalized = (toStringValue(value) ?? "").toLowerCase().replace(/\s+/g, "_")

  if (
    normalized === "video" ||
    normalized === "document" ||
    normalized === "quiz" ||
    normalized === "assignment" ||
    normalized === "live_session" ||
    normalized === "discussion" ||
    normalized === "project"
  ) {
    return normalized
  }

  if (normalized.includes("live")) {
    return "live_session"
  }

  return "discussion"
}

const toDraftEnvelope = (
  value: unknown,
  fallbackProgramId: string,
): DraftProgramEnvelope | null => {
  const record = asRecord(value)

  if (!record) {
    return null
  }

  const dataRecord = asRecord(record.data) ?? record
  const resolvedProgramId =
    toStringValue(record.programId) ??
    toStringValue(dataRecord.programId) ??
    fallbackProgramId

  const rawStep = record.step ?? dataRecord.step
  const parsedStep = parseNumberValue(rawStep, 0)
  const step = parsedStep > 0 ? parsedStep : undefined

  return {
    step,
    programId: resolvedProgramId,
    data: dataRecord,
  }
}

const getDraftEnvelopeFromResponse = (
  response: DraftProgramResponse,
  requestedProgramId: string,
): DraftProgramEnvelope | null => {
  if (Array.isArray(response.drafts) && response.drafts.length > 0) {
    const normalizedDrafts = response.drafts
      .map((draft) => toDraftEnvelope(draft, requestedProgramId))
      .filter((draft): draft is DraftProgramEnvelope => Boolean(draft))
    const matchedDraft =
      normalizedDrafts.find((draft) => draft.programId === requestedProgramId) ??
      normalizedDrafts[0]

    if (matchedDraft) {
      return matchedDraft
    }
  }

  return (
    toDraftEnvelope(response.draft, requestedProgramId) ??
    toDraftEnvelope(response.data, requestedProgramId)
  )
}

const getDraftEnvelopeFromProgramDetailsResponse = (
  response: ProgramDetailsByIdResponse,
  requestedProgramId: string,
) => {
  const dataRecord = asRecord(response.data)
  const programRecord =
    asRecord(response.program) ??
    asRecord(dataRecord?.program) ??
    dataRecord

  return toDraftEnvelope(programRecord, requestedProgramId)
}

const buildDraftCurriculum = (draftData: Record<string, unknown>): CurriculumModule[] => {
  const rawModules = Array.isArray(draftData.modules)
    ? draftData.modules
    : Array.isArray(draftData.curriculum)
      ? draftData.curriculum
      : []

  return rawModules.map((moduleItem, moduleIndex) => {
    const moduleRecord = asRecord(moduleItem) ?? {}
    const moduleId = toStringValue(moduleRecord.id) ?? `module-${moduleIndex + 1}`
    const rawTopics = Array.isArray(moduleRecord.topics) ? moduleRecord.topics : []

    return {
      id: moduleId,
      title: toStringValue(moduleRecord.title) ?? `Module ${moduleIndex + 1}`,
      description: toStringValue(moduleRecord.description) ?? "",
      order: parseNumberValue(moduleRecord.order, moduleIndex + 1),
      duration: parseNumberValue(moduleRecord.duration, 0),
      topics: rawTopics.map((topicItem, topicIndex) => {
        const topicRecord = asRecord(topicItem) ?? {}

        return {
          id:
            toStringValue(topicRecord.id) ??
            `topic-${moduleIndex + 1}-${topicIndex + 1}`,
          title: toStringValue(topicRecord.title) ?? `Topic ${topicIndex + 1}`,
          description: toStringValue(topicRecord.description) ?? "",
          duration: parseNumberValue(topicRecord.duration, 0),
          order: parseNumberValue(topicRecord.order, topicIndex + 1),
          type: normalizeTopicTypeFromApi(topicRecord.type),
          materials: [],
          prerequisites: [],
          requiredExpertise: [],
          content: undefined,
          isPublished: false,
        }
      }),
      learningObjectives: toStringArray(moduleRecord.learningObjectives),
      materials: [],
      assessments: [],
      isPublished: false,
    }
  })
}

const createFallbackMentor = (mentorId: string): PlatformMentor => ({
  id: mentorId,
  name: `Mentor ${mentorId}`,
  email: "",
  avatar: "/placeholder.svg",
  title: "Platform Mentor",
  bio: "",
  expertise: ["Mentoring"],
  rating: 0,
  totalReviews: 0,
  totalSessions: 0,
  hourlyRate: 0,
  availability: "available",
  languages: [],
  timezone: "Africa/Lagos",
  responseTime: "Response time unavailable",
  successRate: 0,
  specializations: [],
  yearsOfExperience: 0,
  education: [],
  certifications: [],
  portfolioItems: [],
})

const buildDraftMentorAssignments = (
  draftData: Record<string, unknown>,
): MentorAssignment[] => {
  const rawAssignments = Array.isArray(draftData.topicMentors)
    ? draftData.topicMentors
    : []

  return rawAssignments
    .map((item, index): MentorAssignment | null => {
      const record = asRecord(item)

      if (!record) {
        return null
      }

      const mentorId = toStringValue(record.mentorId)

      if (!mentorId) {
        return null
      }

      return {
        id: `assignment-${mentorId}-${index + 1}`,
        mentorId,
        mentor: createFallbackMentor(mentorId),
        moduleIds: [],
        topicIds: toStringArray(record.topicIds),
        proposedRate: parseNumberValue(record.proposedRate, 0),
        status: "pending",
        customMessage: toStringValue(record.customMessage) ?? "",
        feedbackLink: toStringValue(record.feedbacklink) ?? undefined,
      }
    })
    .filter((assignment): assignment is MentorAssignment => Boolean(assignment))
}

export default function CreateProgram() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedDraftProgramId = (
    searchParams.get("programId") ??
    searchParams.get("id") ??
    searchParams.get("draftId") ??
    ""
  ).trim()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingStep, setIsSavingStep] = useState(false)
  const [isHydratingDraft, setIsHydratingDraft] = useState(false)
  const [draftProgramId, setDraftProgramId] = useState(getInitialDraftProgramId)

  // Step 1: Program Overview
  const [programData, setProgramData] = useState({
    title: "",
    tagline: "",
    description: "",
    selectedSectors: [] as string[],
    selectedSubSectorSkills: [] as string[],
    selectedSkillsCapabilities: [] as string[],
    experienceLevel: "",
    format: "",
    maxParticipants: "",
    price: "",
    durationWeeks: "",
    numberOfSessions: "",
    meetingLink: "",
    accessCredentials: "",
    learningOutcomes: ["", "", ""],
    prerequisites: [""],
  })

  // Step 2: Curriculum
  const [selectedTemplate, setSelectedTemplate] = useState<CurriculumTemplate | null>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [curriculum, setCurriculum] = useState<CurriculumModule[]>([])

  // Step 3: Mentor Assignments
  const [mentorAssignments, setMentorAssignments] = useState<MentorAssignment[]>([])
  const [platformMentors, setPlatformMentors] = useState<PlatformMentor[]>([])
  const [isPlatformMentorsLoading, setIsPlatformMentorsLoading] = useState(false)
  const [platformMentorsError, setPlatformMentorsError] = useState<string | null>(null)
  const [showMentorBrowser, setShowMentorBrowser] = useState(false)
  const [selectedMentorForAssignment, setSelectedMentorForAssignment] = useState<PlatformMentor | null>(null)
  const [mentorSearchQuery, setMentorSearchQuery] = useState("")
  const [mentorFilters, setMentorFilters] = useState({
    expertise: "all",
    availability: "all",
    priceRange: "all",
    rating: "all",
  })

  useEffect(() => {
    if (!requestedDraftProgramId) {
      setIsHydratingDraft(false)
      return
    }

    let isMounted = true

    const loadDraft = async () => {
      setIsHydratingDraft(true)

      try {
        const loadDraftEnvelope = async () => {
          let draftLookupError: unknown = null

          try {
            const response = await apiClient.get<DraftProgramResponse>(
              `/programs/drafts/${encodeURIComponent(requestedDraftProgramId)}`,
            )

            if (response.success === false) {
              throw new Error(response.error ?? response.message ?? "Unable to load draft.")
            }

            const detailedDraftEnvelope = getDraftEnvelopeFromResponse(
              response,
              requestedDraftProgramId,
            )
            const detailedProgramId =
              detailedDraftEnvelope?.programId ??
              toStringValue(detailedDraftEnvelope?.data?.programId) ??
              null

            if (
              detailedDraftEnvelope &&
              detailedProgramId &&
              detailedProgramId === requestedDraftProgramId
            ) {
              return detailedDraftEnvelope
            }

            const fallbackListResponse = await apiClient.get<DraftProgramResponse>(
              "/programs/drafts",
            )

            if (fallbackListResponse.success === false) {
              throw new Error(
                fallbackListResponse.error ??
                  fallbackListResponse.message ??
                  "Unable to load draft.",
              )
            }

            const fallbackDraftEnvelope = getDraftEnvelopeFromResponse(
              fallbackListResponse,
              requestedDraftProgramId,
            )

            if (fallbackDraftEnvelope) {
              return fallbackDraftEnvelope
            }

            throw new Error("Draft record was not found.")
          } catch (error) {
            draftLookupError = error
          }

          try {
            const detailsResponse = await apiClient.get<ProgramDetailsByIdResponse>(
              `/programs/details/${encodeURIComponent(requestedDraftProgramId)}`,
            )

            if (detailsResponse.success === false) {
              throw new Error(
                detailsResponse.error ??
                  detailsResponse.message ??
                  "Unable to load draft.",
              )
            }

            const detailsDraftEnvelope = getDraftEnvelopeFromProgramDetailsResponse(
              detailsResponse,
              requestedDraftProgramId,
            )

            if (detailsDraftEnvelope?.data) {
              return detailsDraftEnvelope
            }
          } catch (error) {
            if (draftLookupError instanceof Error) {
              throw draftLookupError
            }

            throw error
          }

          if (draftLookupError instanceof Error) {
            throw draftLookupError
          }

          throw new Error("Draft record was not found.")
        }

        const draftEnvelope = await loadDraftEnvelope()

        if (!draftEnvelope?.data) {
          throw new Error("Draft record was not found.")
        }

        const draftData = draftEnvelope.data
        const resolvedProgramId =
          draftEnvelope.programId ??
          toStringValue(draftData.programId) ??
          requestedDraftProgramId

        if (!isMounted) {
          return
        }

        setDraftProgramId(resolvedProgramId)
        const learningOutcomes = toStringArray(draftData.learningOutcomes)
        const prerequisites = toStringArray(draftData.prerequisites)

        setProgramData({
          title: toStringValue(draftData.title) ?? "",
          tagline: toStringValue(draftData.tagline) ?? "",
          description: toStringValue(draftData.description) ?? "",
          selectedSectors: toStringArray(draftData.sectors),
          selectedSubSectorSkills: toStringArray(draftData.subSectorSkills),
          selectedSkillsCapabilities: toStringArray(draftData.skillsCapabilities),
          experienceLevel: normalizeExperienceLevelFromDraft(draftData.level),
          format: normalizeFormatFromDraft(draftData.format),
          maxParticipants:
            toStringValue(draftData.maxParticipant ?? draftData.maxParticipants) ?? "",
          price: toStringValue(draftData.price) ?? "",
          durationWeeks: toStringValue(draftData.duration) ?? "",
          numberOfSessions:
            toStringValue(draftData.numberOfSessions ?? draftData.sessionCount) ??
            "",
          meetingLink: toStringValue(draftData.meetingLink) ?? "",
          accessCredentials:
            toStringValue(draftData.accessCredentials) ??
            "",
          learningOutcomes:
            learningOutcomes.length > 0 ? learningOutcomes : [""],
          prerequisites:
            prerequisites.length > 0 ? prerequisites : [""],
        })

        const draftCurriculum = buildDraftCurriculum(draftData)
        setCurriculum(draftCurriculum)
        setSelectedTemplate(null)

        const draftMentorAssignments = buildDraftMentorAssignments(draftData)
        setMentorAssignments(draftMentorAssignments)

        const draftStep =
          typeof draftEnvelope.step === "number" && Number.isFinite(draftEnvelope.step)
            ? draftEnvelope.step
            : parseNumberValue(draftData.step, 1)
        const resumeStep = Math.min(4, Math.max(1, draftStep))
        setCurrentStep(resumeStep)

        toast({
          title: "Draft loaded",
          description: "Continue from where you stopped.",
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Unable to load draft."

        toast({
          title: "Load draft failed",
          description: message,
          variant: "destructive",
        })
      } finally {
        if (isMounted) {
          setIsHydratingDraft(false)
        }
      }
    }

    void loadDraft()

    return () => {
      isMounted = false
    }
  }, [requestedDraftProgramId])

  const setNextStep = () => {
    setCurrentStep((previousStep) => Math.min(previousStep + 1, 4))
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    if (currentStep > 1 && !isSavingStep && !isLoading) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const persistProgramStep = async <TPayload extends Record<string, unknown>>(
    payload: TPayload,
  ) => {
    const response = await apiClient.post<SaveProgramStepResponse, TPayload>(
      "/programs",
      payload,
    )

    if (response?.success === false) {
      throw new Error(response.error ?? "Unable to save program step.")
    }

    const backendProgramId =
      response?.programId ?? response?.data?.programId

    if (typeof backendProgramId === "string" && backendProgramId.trim().length > 0) {
      setDraftProgramId(backendProgramId)
    }
  }

  const buildStepOnePayload = (): ProgramStepOnePayload => ({
    step: 1,
    programId: draftProgramId,
    title: programData.title.trim(),
    description: programData.description.trim(),
    tagline: programData.tagline.trim(),
    learningOutcomes: sanitizeStringArray(programData.learningOutcomes),
  })

  const buildStepTwoPayload = (): ProgramStepTwoPayload => ({
    step: 2,
    programId: draftProgramId,
    sectors: programData.selectedSectors,
    subSectorSkills: programData.selectedSubSectorSkills,
    skillsCapabilities: programData.selectedSkillsCapabilities,
    category: resolveCategoryId(programData.selectedSectors),
    level: LEVEL_VALUE_MAP[programData.experienceLevel] ?? "1",
    format: FORMAT_VALUE_MAP[programData.format] ?? "1",
    type: toPositiveNumber(programData.maxParticipants, 1) > 1 ? 2 : 1,
    maxParticipant: toPositiveNumber(programData.maxParticipants),
    price: toPositiveNumber(programData.price),
    duration: toPositiveNumber(programData.durationWeeks),
    numberOfSessions: toPositiveNumber(programData.numberOfSessions),
    meetingLink: requiresMeetingDetails(programData.format)
      ? programData.meetingLink.trim()
      : undefined,
    accessCredentials: requiresMeetingDetails(programData.format)
      ? programData.accessCredentials.trim()
      : undefined,
  })

  const buildStepThreePayload = (): ProgramStepThreePayload => {
    const topicIdMap = buildTopicIdMapForApi(curriculum)

    return {
      step: 3,
      programId: draftProgramId,
      modules: curriculum.map((module, moduleIndex) => ({
        title: module.title.trim(),
        description: module.description.trim(),
        duration: module.duration,
        learningObjectives: sanitizeStringArray(module.learningObjectives ?? []),
        topics: module.topics.map((topic, topicIndex) => ({
          id:
            topicIdMap.get(`${topic.id}`) ??
            toNumericTopicIdValue(
              `${topic.id}`,
              `${module.id}-${moduleIndex + 1}-${topic.title}-${topicIndex + 1}`,
            ),
          title: topic.title.trim(),
          description: topic.description.trim(),
          type: normalizeTopicTypeForApi(topic.type),
          duration: topic.duration,
        })),
      })),
    }
  }

  const buildStepFourPayload = (): ProgramStepFourPayload => {
    const topicIdMap = buildTopicIdMapForApi(curriculum)

    return {
      step: 4,
      programId: draftProgramId,
      topicMentors: mentorAssignments.map((assignment, assignmentIndex) => ({
        topicIds: assignment.topicIds.map((topicId, topicIndex) => {
          const rawTopicId = topicId.trim()

          return (
            topicIdMap.get(rawTopicId) ??
            toNumericTopicIdValue(
              rawTopicId,
              `${assignment.mentorId}-${assignmentIndex + 1}-${topicIndex + 1}`,
            )
          )
        }),
        mentorId: assignment.mentorId,
        proposedRate: assignment.proposedRate,
        customMessage: assignment.customMessage?.trim() ?? "",
        feedbacklink: assignment.feedbackLink?.trim() || undefined,
      })),
    }
  }

  const nextStep = async () => {
    if (isSavingStep || isLoading || currentStep >= 4) {
      return
    }

    setIsSavingStep(true)

    try {
      if (currentStep === 1) {
        await persistProgramStep(buildStepOnePayload())
        toast({
          title: "Step saved",
          description: "Basic info was saved to draft.",
        })
      }

      if (currentStep === 2) {
        await persistProgramStep(buildStepTwoPayload())
        toast({
          title: "Step saved",
          description: "Audience details were saved to draft.",
        })
      }

      if (currentStep === 3) {
        await persistProgramStep(buildStepThreePayload())
        toast({
          title: "Step saved",
          description: "Curriculum was saved to draft.",
        })
      }

      setNextStep()
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to save this step."

      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSavingStep(false)
    }
  }

  const handleSaveDraft = async () => {
    if (isSavingStep || isLoading) {
      return
    }

    setIsSavingStep(true)

    try {
      await persistProgramStep(buildStepFourPayload())
      toast({
        title: "Draft saved",
        description: "Mentor assignments were saved to your draft.",
      })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to save your draft."

      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSavingStep(false)
    }
  }

  const handleSubmit = async () => {
    if (isLoading || isSavingStep) {
      return
    }

    setIsLoading(true)

    try {
      await persistProgramStep(buildStepFourPayload())
      toast({
        title: "Program created",
        description: "Your program has been saved successfully.",
      })
      router.push("/trainer/dashboard")
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to create program."

      toast({
        title: "Create program failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Memoized options for sectors and skills
  const sectorsOptions = useMemo(() => {
    return SECTORS.map((sector) => ({ value: sector.id, label: sector.name }))
  }, [])

  const subSectorSkillsOptions = useMemo(() => {
    const sectorSkills = getSkillsForSectors(programData.selectedSectors)
    return sectorSkills.map((skill) => ({ value: skill, label: skill }))
  }, [programData.selectedSectors])

  const subSectorSkillsGrouped = useMemo(() => {
    if (programData.selectedSectors.length === 0) return []
    const grouped = getSkillsGroupedBySector(programData.selectedSectors)
    return grouped.map((group) => ({
      groupLabel: group.sectorName,
      options: group.skills.map((skill) => ({ value: skill, label: skill })),
    }))
  }, [programData.selectedSectors])

  const skillsCapabilitiesOptions = useMemo(() => {
    return SKILLS_CAPABILITIES.map((skill) => ({ value: skill, label: skill }))
  }, [])

  // Step 1 validation (Basic Information only)
  const isStep1Valid = () => {
    return (
      programData.title.trim() !== "" &&
      programData.description.trim() !== "" &&
      programData.learningOutcomes.some((outcome) => outcome.trim() !== "")
    )
  }

  // Get Step 1 validation errors
  const getStep1Errors = () => {
    const errors: string[] = []
    if (programData.title.trim() === "") errors.push("Program Title is required")
    if (programData.description.trim() === "") errors.push("Program Description is required")
    if (!programData.learningOutcomes.some((outcome) => outcome.trim() !== "")) {
      errors.push("At least one Learning Outcome is required")
    }
    return errors
  }

  // Step 2 validation (Who is this for? - only step 2 fields)
  const isStep2Valid = () => {
    const hasMeetingDetails =
      !requiresMeetingDetails(programData.format) ||
      (programData.meetingLink.trim() !== "" &&
        programData.accessCredentials.trim() !== "")

    return (
      programData.selectedSectors.length > 0 &&
      programData.experienceLevel !== "" &&
      programData.format !== "" &&
      programData.maxParticipants.trim() !== "" &&
      programData.price.trim() !== "" &&
      programData.durationWeeks.trim() !== "" &&
      programData.numberOfSessions.trim() !== "" &&
      hasMeetingDetails
    )
  }

  // Get Step 2 validation errors
  const getStep2Errors = () => {
    const errors: string[] = []
    if (programData.selectedSectors.length === 0) errors.push("At least one Sector is required")
    if (programData.experienceLevel === "") errors.push("Experience Level is required")
    if (programData.format === "") errors.push("Format is required")
    if (programData.maxParticipants.trim() === "") errors.push("Max Participants is required")
    if (programData.price.trim() === "") errors.push("Price is required")
    if (programData.durationWeeks.trim() === "") errors.push("Duration is required")
    if (programData.numberOfSessions.trim() === "") errors.push("Number of Sessions is required")
    if (
      requiresMeetingDetails(programData.format) &&
      programData.meetingLink.trim() === ""
    ) {
      errors.push("Meeting Link is required for online/hybrid format")
    }
    if (
      requiresMeetingDetails(programData.format) &&
      programData.accessCredentials.trim() === ""
    ) {
      errors.push("Access Credentials is required for online/hybrid format")
    }
    return errors
  }

  // Step 3 validation (curriculum)
  const isStep3Valid = () => {
    return (
      curriculum.length > 0 &&
      curriculum.every(
        (module) =>
          module.title.trim() !== "" &&
          module.description.trim() !== "" &&
          module.topics.length > 0 &&
          module.topics.every((topic) => topic.title.trim() !== "" && topic.description.trim() !== ""),
      )
    )
  }

  const getStepProgress = () => {
    return (currentStep / 4) * 100
  }

  const handleTemplateSelect = (template: CurriculumTemplate) => {
    setSelectedTemplate(template)
    // Convert template modules to curriculum modules
    const convertedModules: CurriculumModule[] = template.modules.map((templateModule) => ({
      id: templateModule.id,
      title: templateModule.title,
      description: templateModule.description,
      order: templateModule.order,
      duration: templateModule.estimatedDuration * 60, // Convert hours to minutes
      topics: templateModule.topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        duration: topic.estimatedDuration,
        order: topic.order,
        type: topic.type,
        materials: topic.materials,
        prerequisites: [],
        requiredExpertise: [],
        content: typeof topic.content === "string" ? undefined : topic.content,
        isPublished: false,
      })),
      learningObjectives: templateModule.learningObjectives,
      materials: [],
      assessments: [],
      isPublished: false,
    }))
    setCurriculum(convertedModules)
    setShowTemplateSelector(false) // Close the template selector after selection
  }

  useEffect(() => {
    if (!showMentorBrowser) {
      return
    }

    let isMounted = true

    const fetchPlatformMentors = async () => {
      setIsPlatformMentorsLoading(true)
      setPlatformMentorsError(null)

      try {
        const response = await apiClient.get<MentorsApiResponse>("/mentors")

        if (response.success === false) {
          throw new Error(response.error ?? response.message ?? "Unable to load mentors.")
        }

        const rawMentors = response.mentor ?? response.mentors ?? response.data ?? []
        const mappedMentors = rawMentors
          .map((mentor, index): PlatformMentor | null => {
            const profile =
              mentor.profile && typeof mentor.profile === "object"
                ? mentor.profile
                : undefined
            const mentorName = mentor.name?.trim()

            if (!mentorName || mentor.id === undefined || mentor.id === null) {
              return null
            }

            const rating = parseNumberValue(mentor.rating, 0)
            const hourlyRate = parseNumberValue(
              mentor.hourlyRate ?? profile?.hourlyRate,
              0,
            )
            const yearsOfExperience = parseNumberValue(
              mentor.yearsOfExperience ?? profile?.experience_years,
              0,
            )

            return {
              id: `${mentor.id}`,
              name: mentorName,
              email: mentor.email ?? "",
              avatar: mentor.avatar,
              title:
                mentor.title?.trim() ||
                profile?.professional_background?.trim() ||
                "Mentor",
              company: mentor.company?.trim(),
              bio:
                mentor.bio?.trim() ||
                profile?.bio?.trim() ||
                "Experienced mentor available on the platform.",
              expertise: parseMentorExpertise(mentor),
              rating,
              totalReviews: parseNumberValue(mentor.totalReviews, 0),
              totalSessions: parseNumberValue(mentor.totalSessions, 0),
              hourlyRate,
              availability: normalizeMentorAvailability(
                mentor.availability ?? profile?.availability ?? undefined,
              ),
              languages:
                Array.isArray(mentor.languages) && mentor.languages.length > 0
                  ? mentor.languages
                  : ["English"],
              timezone: mentor.timezone ?? "UTC",
              responseTime: mentor.responseTime ?? "Usually responds within 24 hours",
              successRate: parseNumberValue(mentor.successRate, 0),
              specializations:
                Array.isArray(mentor.specializations) && mentor.specializations.length > 0
                  ? mentor.specializations
                  : [],
              yearsOfExperience,
              education:
                Array.isArray(mentor.education) && mentor.education.length > 0
                  ? mentor.education
                  : [],
              certifications:
                Array.isArray(mentor.certifications) && mentor.certifications.length > 0
                  ? mentor.certifications
                  : [],
              portfolioItems: [],
            }
          })
          .filter((mentor): mentor is PlatformMentor => Boolean(mentor))

        if (!isMounted) {
          return
        }

        setPlatformMentors(mappedMentors)
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Unable to load mentors."

        setPlatformMentorsError(message)
        setPlatformMentors([])
      } finally {
        if (isMounted) {
          setIsPlatformMentorsLoading(false)
        }
      }
    }

    void fetchPlatformMentors()

    return () => {
      isMounted = false
    }
  }, [showMentorBrowser])

  // Filter mentors based on search and filters
  const filteredMentors = platformMentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(mentorSearchQuery.toLowerCase()) ||
      mentor.expertise.some((exp) => exp.toLowerCase().includes(mentorSearchQuery.toLowerCase())) ||
      mentor.title.toLowerCase().includes(mentorSearchQuery.toLowerCase())

    const matchesExpertise =
      !mentorFilters.expertise ||
      mentorFilters.expertise === "all" ||
      mentor.expertise.includes(mentorFilters.expertise)
    const matchesAvailability =
      !mentorFilters.availability ||
      mentorFilters.availability === "all" ||
      mentor.availability === mentorFilters.availability
    const matchesRating =
      !mentorFilters.rating ||
      mentorFilters.rating === "all" ||
      mentor.rating >= Number.parseFloat(mentorFilters.rating)

    let matchesPrice = true
    if (mentorFilters.priceRange && mentorFilters.priceRange !== "all") {
      const [min, max] = mentorFilters.priceRange.split("-").map(Number)
      matchesPrice = mentor.hourlyRate >= min && (max ? mentor.hourlyRate <= max : true)
    }

    return matchesSearch && matchesExpertise && matchesAvailability && matchesRating && matchesPrice
  })

  if (isHydratingDraft) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="container max-w-4xl px-0 py-4 sm:px-0 sm:py-6 md:px-6 md:py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Draft</CardTitle>
              <CardDescription>Prefilling saved fields...</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={50} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Please wait while we load your saved draft.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="container max-w-4xl px-0 py-4 sm:px-0 sm:py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-3 p-0 h-auto text-sm text-muted-foreground hover:text-foreground sm:mb-4">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Programs
          </Button>

          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl font-bold sm:text-3xl">Create New Training Program</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Build a comprehensive training program and invite expert mentors to teach
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 sm:mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium sm:text-sm">Step {currentStep} of 4</span>
              <span className="text-xs text-muted-foreground sm:text-sm">{Math.round(getStepProgress())}% Complete</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          {/* Step Indicators - 2x2 grid on mobile, single row on desktop */}
          <div className="mt-4 sm:mt-6">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-between sm:gap-1">
              {[
                { step: 1, label: "Basic Info" },
                { step: 2, label: "Who" },
                { step: 3, label: "Curriculum" },
                { step: 4, label: "Mentors" },
              ].map(({ step, label }, i) => (
                <div key={step} className="flex items-center gap-2 sm:flex-1 sm:gap-1.5">
                  <div
                    className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-medium sm:h-8 sm:w-8 sm:text-sm ${
                      currentStep >= step ? "bg-[#FFD500] text-black" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > step ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : step}
                  </div>
                  <span className={`text-xs sm:text-sm truncate ${currentStep >= step ? "font-medium" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                  {i < 3 && <div className="hidden flex-1 h-px bg-gray-200 mx-1 sm:block min-w-[8px]" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <Step1BasicInfo
            programData={programData}
            setProgramData={setProgramData}
            onNext={nextStep}
            isValid={isStep1Valid()}
            isSaving={isSavingStep}
            errors={getStep1Errors()}
          />
        )}

        {currentStep === 2 && (
          <Step2WhoIsThisFor
            programData={programData}
            setProgramData={setProgramData}
            onNext={nextStep}
            onPrev={prevStep}
            isValid={isStep2Valid()}
            isSaving={isSavingStep}
            errors={getStep2Errors()}
            sectorsOptions={sectorsOptions}
            subSectorSkillsOptions={subSectorSkillsOptions}
            subSectorSkillsGrouped={subSectorSkillsGrouped}
            skillsCapabilitiesOptions={skillsCapabilitiesOptions}
          />
        )}

        {currentStep === 3 && (
          <Step2Curriculum
            curriculum={curriculum}
            setCurriculum={setCurriculum}
            onNext={nextStep}
            onPrev={prevStep}
            isValid={isStep3Valid()}
            isSaving={isSavingStep}
            onShowTemplateSelector={() => setShowTemplateSelector(true)}
            selectedTemplate={selectedTemplate}
          />
        )}

        {currentStep === 4 && (
          <Step3AssignMentors
            curriculum={curriculum}
            mentorAssignments={mentorAssignments}
            setMentorAssignments={setMentorAssignments}
            onPrev={prevStep}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isSavingDraft={isSavingStep}
            onShowMentorBrowser={() => setShowMentorBrowser(true)}
          />
        )}

        {/* Mentor Browser Modal */}
        <MentorBrowserModal
          isOpen={showMentorBrowser}
          onClose={() => setShowMentorBrowser(false)}
          mentors={filteredMentors}
          isLoading={isPlatformMentorsLoading}
          error={platformMentorsError}
          curriculum={curriculum}
          searchQuery={mentorSearchQuery}
          setSearchQuery={setMentorSearchQuery}
          filters={mentorFilters}
          setFilters={setMentorFilters}
          onSelectMentor={(mentor) => {
            setSelectedMentorForAssignment(mentor)
            setShowMentorBrowser(false)
          }}
          existingAssignments={mentorAssignments}
        />

        {/* Mentor Assignment Modal */}
        {selectedMentorForAssignment && (
          <MentorAssignmentModal
            isOpen={!!selectedMentorForAssignment}
            onClose={() => setSelectedMentorForAssignment(null)}
            mentor={selectedMentorForAssignment}
            curriculum={curriculum}
            existingAssignments={mentorAssignments}
            onAssign={(assignment) => {
              setMentorAssignments([...mentorAssignments, assignment])
              setSelectedMentorForAssignment(null)
            }}
          />
        )}

        {/* Template Selector Modal */}
        <TemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
          onSelectTemplate={handleTemplateSelect}
        />
      </div>
    </div>
  )
}

// Step 1: Basic Information (Title only)
interface Step1BasicInfoProps {
  programData: any
  setProgramData: (data: any) => void
  onNext: () => Promise<void>
  isValid: boolean
  isSaving: boolean
  errors: string[]
}

function Step1BasicInfo({
  programData,
  setProgramData,
  onNext,
  isValid,
  isSaving,
  errors,
}: Step1BasicInfoProps) {
  const updateLearningOutcome = (index: number, value: string) => {
    const updated = [...programData.learningOutcomes]
    updated[index] = value
    setProgramData({ ...programData, learningOutcomes: updated })
  }

  const addLearningOutcome = () => {
    setProgramData({
      ...programData,
      learningOutcomes: [...programData.learningOutcomes, ""],
    })
  }

  const removeLearningOutcome = (index: number) => {
    if (programData.learningOutcomes.length > 1) {
      const updated = programData.learningOutcomes.filter((_: string, i: number) => i !== index)
      setProgramData({ ...programData, learningOutcomes: updated })
    }
  }

  const updatePrerequisite = (index: number, value: string) => {
    const updated = [...programData.prerequisites]
    updated[index] = value
    setProgramData({ ...programData, prerequisites: updated })
  }

  const addPrerequisite = () => {
    setProgramData({
      ...programData,
      prerequisites: [...programData.prerequisites, ""],
    })
  }

  const removePrerequisite = (index: number) => {
    if (programData.prerequisites.length > 1) {
      const updated = programData.prerequisites.filter((_: string, i: number) => i !== index)
      setProgramData({ ...programData, prerequisites: updated })
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Basic Information</CardTitle>
          <CardDescription className="text-sm">Tell us about your training program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-2">
              <Label htmlFor="title">Program Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Digital Marketing Bootcamp"
                value={programData.title}
                onChange={(e) => setProgramData({ ...programData, title: e.target.value })}
                className="text-sm h-9 sm:h-10"
              />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Program Tagline</Label>
            <Input
              id="tagline"
              placeholder="e.g., Master digital marketing from SEO to social media advertising"
              value={programData.tagline}
              onChange={(e) => setProgramData({ ...programData, tagline: e.target.value })}
              className="text-sm h-9 sm:h-10"
            />
            <p className="text-xs text-muted-foreground">A short, compelling tagline that will be displayed on the program page</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Program Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what participants will learn and achieve..."
              rows={4}
              value={programData.description}
              onChange={(e) => setProgramData({ ...programData, description: e.target.value })}
              className="text-sm min-h-[72px] sm:min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Learning Outcomes</CardTitle>
          <CardDescription className="text-sm">What will participants achieve by completing this program?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
          {programData.learningOutcomes.map((outcome: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`Learning outcome ${index + 1}`}
                value={outcome}
                onChange={(e) => updateLearningOutcome(index, e.target.value)}
                className="text-sm h-9 sm:h-10"
              />
              {programData.learningOutcomes.length > 1 && (
                <Button type="button" variant="outline" size="icon" onClick={() => removeLearningOutcome(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addLearningOutcome} className="w-full bg-transparent min-h-10">
            <Plus className="h-4 w-4 mr-2" />
            Add Learning Outcome
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Prerequisites</CardTitle>
          <CardDescription className="text-sm">What should participants know or have before starting?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
          {programData.prerequisites.map((prerequisite: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`Prerequisite ${index + 1}`}
                value={prerequisite}
                onChange={(e) => updatePrerequisite(index, e.target.value)}
                className="text-sm h-9 sm:h-10"
              />
              {programData.prerequisites.length > 1 && (
                <Button type="button" variant="outline" size="icon" onClick={() => removePrerequisite(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addPrerequisite} className="w-full bg-transparent min-h-10">
            <Plus className="h-4 w-4 mr-2" />
            Add Prerequisite
          </Button>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <p className="text-sm font-medium text-red-800 mb-2">Please complete the following required fields:</p>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!isValid || isSaving}
          className="w-full sm:w-auto min-h-10 bg-[#FFD500] text-black hover:bg-[#e6c000]"
        >
          {isSaving ? "Saving..." : "Next: Who is this for?"}
          {!isSaving && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  )
}

// Step 2: Who is this for? (Description + Targeting)
interface Step2WhoIsThisForProps {
  programData: any
  setProgramData: (data: any) => void
  onNext: () => Promise<void>
  onPrev: () => void
  isValid: boolean
  isSaving: boolean
  errors: string[]
  sectorsOptions: { value: string; label: string }[]
  subSectorSkillsOptions: { value: string; label: string }[]
  subSectorSkillsGrouped: { groupLabel: string; options: { value: string; label: string }[] }[]
  skillsCapabilitiesOptions: { value: string; label: string }[]
}

function Step2WhoIsThisFor({
  programData,
  setProgramData,
  onNext,
  onPrev,
  isValid,
  isSaving,
  errors,
  sectorsOptions,
  subSectorSkillsOptions,
  subSectorSkillsGrouped,
  skillsCapabilitiesOptions,
}: Step2WhoIsThisForProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Who is this for?</CardTitle>
          <CardDescription className="text-sm">Describe your program and define your target audience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-2">
            <Label>Sector *</Label>
            <MultiSelect
              options={sectorsOptions}
              selected={programData.selectedSectors}
              onSelectionChange={(selected) => {
                // Clear sub-sector skills when sectors change
                const newSubSectorSkills = getSkillsForSectors(selected)
                setProgramData({
                  ...programData,
                  selectedSectors: selected,
                  selectedSubSectorSkills: programData.selectedSubSectorSkills.filter((skill: string) =>
                    newSubSectorSkills.includes(skill),
                  ),
                })
              }}
              placeholder="Select sector(s)"
            />
            </div>

            <div className="space-y-2">
            <Label>Sub-Sector (Skill) *</Label>
            <MultiSelect
              options={subSectorSkillsOptions}
              selected={programData.selectedSubSectorSkills}
              onSelectionChange={(selected) =>
                setProgramData({ ...programData, selectedSubSectorSkills: selected })
              }
              placeholder="Select skill(s)"
              disabled={programData.selectedSectors.length === 0}
              groupedOptions={subSectorSkillsGrouped}
            />
            {programData.selectedSectors.length === 0 && (
              <p className="text-sm text-gray-500">Please select a sector first</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Skills & Capabilities *</Label>
            <MultiSelect
              options={skillsCapabilitiesOptions}
              selected={programData.selectedSkillsCapabilities}
              onSelectionChange={(selected) =>
                setProgramData({ ...programData, selectedSkillsCapabilities: selected })
              }
              placeholder="Select skills & capabilities"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level *</Label>
              <Select
                value={programData.experienceLevel}
                onValueChange={(value) => setProgramData({ ...programData, experienceLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="all-levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Format *</Label>
              <Select
                value={programData.format}
                onValueChange={(value) =>
                  setProgramData({
                    ...programData,
                    format: value,
                    meetingLink: value === "in-person" ? "" : programData.meetingLink,
                    accessCredentials:
                      value === "in-person" ? "" : programData.accessCredentials,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {requiresMeetingDetails(programData.format) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meetingLink">Meeting Link *</Label>
                <Input
                  id="meetingLink"
                  type="url"
                  placeholder="e.g., https://meet.google.com/abc-defg-hij"
                  value={programData.meetingLink}
                  onChange={(e) =>
                    setProgramData({ ...programData, meetingLink: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessCredentials">Access Credentials *</Label>
                <Input
                  id="accessCredentials"
                  placeholder="e.g., Meeting ID: 123-456-789, Passcode: 9876"
                  value={programData.accessCredentials}
                  onChange={(e) =>
                    setProgramData({
                      ...programData,
                      accessCredentials: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants *</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="e.g., 25"
                  value={programData.maxParticipants}
                  onChange={(e) => setProgramData({ ...programData, maxParticipants: e.target.value })}
                />
              </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₦) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 2,250,000"
                value={programData.price}
                onChange={(e) => setProgramData({ ...programData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationWeeks">Duration (Weeks) *</Label>
              <Input
                id="durationWeeks"
                type="number"
                placeholder="e.g., 12"
                value={programData.durationWeeks}
                onChange={(e) => setProgramData({ ...programData, durationWeeks: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfSessions">Number of Sessions *</Label>
              <Input
                id="numberOfSessions"
                type="number"
                placeholder="e.g., 8"
                value={programData.numberOfSessions}
                onChange={(e) => setProgramData({ ...programData, numberOfSessions: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <p className="text-sm font-medium text-red-800 mb-2">Please complete the following required fields:</p>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isSaving} className="w-full sm:w-auto min-h-10">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid || isSaving}
          className="w-full sm:w-auto min-h-10 bg-[#FFD500] text-black hover:bg-[#e6c000]"
        >
          {isSaving ? "Saving..." : "Next: Build Curriculum"}
          {!isSaving && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  )
}

// Step 2: Curriculum Component (same as before)
interface Step2Props {
  curriculum: CurriculumModule[]
  setCurriculum: (curriculum: CurriculumModule[]) => void
  onNext: () => Promise<void>
  onPrev: () => void
  isValid: boolean
  isSaving: boolean
  onShowTemplateSelector: () => void
  selectedTemplate: CurriculumTemplate | null
}

function Step2Curriculum({
  curriculum,
  setCurriculum,
  onNext,
  onPrev,
  isValid,
  isSaving,
  onShowTemplateSelector,
  selectedTemplate,
}: Step2Props) {
  const getTotalDuration = () => {
    return curriculum.reduce(
      (total, module) => total + module.topics.reduce((moduleTotal, topic) => moduleTotal + topic.duration, 0),
      0,
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">Program Curriculum</CardTitle>
              <CardDescription className="text-sm">Structure your program into modules and topics</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground sm:text-right">
              <div>Total Duration: {Math.round(getTotalDuration() / 60)} hours</div>
              <div>
                {curriculum.length} modules, {curriculum.reduce((total, m) => total + m.topics.length, 0)} topics
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          {curriculum.length === 0 && !selectedTemplate ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">Start building your curriculum</p>
              <p className="text-sm text-muted-foreground mb-4">
                Choose a template to get started or build from scratch.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button onClick={onShowTemplateSelector} className="w-full sm:w-auto min-h-10 bg-[#FFD500] text-black hover:bg-[#e6c000]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto min-h-10"
                  onClick={() =>
                    setCurriculum([
                      {
                        id: `module-${Date.now()}`,
                        title: "",
                        description: "",
                        order: 1,
                        duration: 0,
                        topics: [],
                        learningObjectives: [""],
                        materials: [],
                        assessments: [],
                        isPublished: false,
                      },
                    ])
                  }
                >
                  Start from Scratch
                </Button>
              </div>
            </div>
          ) : (
            <CurriculumBuilder
              initialTemplate={selectedTemplate || undefined}
              modules={curriculum}
              setModules={setCurriculum}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isSaving} className="w-full sm:w-auto min-h-10">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid || isSaving}
          className="w-full sm:w-auto min-h-10 bg-[#FFD500] text-black hover:bg-[#e6c000]"
        >
          {isSaving ? "Saving..." : "Next: Assign Mentors"}
          {!isSaving && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  )
}

// Step 3: Assign Mentors Component (Updated)
interface Step3Props {
  curriculum: CurriculumModule[]
  mentorAssignments: MentorAssignment[]
  setMentorAssignments: (assignments: MentorAssignment[]) => void
  onPrev: () => void
  onSaveDraft: () => Promise<void>
  onSubmit: () => Promise<void>
  isLoading: boolean
  isSavingDraft: boolean
  onShowMentorBrowser: () => void
}

function Step3AssignMentors({
  curriculum,
  mentorAssignments,
  setMentorAssignments,
  onPrev,
  onSaveDraft,
  onSubmit,
  isLoading,
  isSavingDraft,
  onShowMentorBrowser,
}: Step3Props) {
  const removeMentorAssignment = (assignmentId: string) => {
    setMentorAssignments(mentorAssignments.filter((a) => a.id !== assignmentId))
  }

  const getAssignedTopicsCount = () => {
    const assignedTopicIds = new Set(mentorAssignments.flatMap((a) => a.topicIds))
    return assignedTopicIds.size
  }

  const getTotalTopicsCount = () => {
    return curriculum.reduce((total, module) => total + module.topics.length, 0)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">Assign Platform Mentors</CardTitle>
              <CardDescription className="text-sm">
                Browse and invite expert mentors from our platform to teach specific topics
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground sm:text-right">
              <div>
                {getAssignedTopicsCount()} of {getTotalTopicsCount()} topics assigned
              </div>
              <div>{mentorAssignments.length} mentors invited</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Curriculum Overview */}
      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Curriculum Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="space-y-4">
            {curriculum.map((module, moduleIndex) => (
              <div key={module.id} className="border rounded-lg p-3 sm:p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">
                      Module {moduleIndex + 1}: {module.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{module.topics.length} topics</p>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {Math.round(module.topics.reduce((total, topic) => total + topic.duration, 0) / 60)}h
                  </Badge>
                </div>

                <div className="grid gap-2">
                  {module.topics.map((topic, topicIndex) => {
                    const isAssigned = mentorAssignments.some((a) => a.topicIds.includes(topic.id))
                    const assignedMentor = mentorAssignments.find((a) => a.topicIds.includes(topic.id))

                    return (
                      <div
                        key={topic.id}
                        className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2 rounded ${
                          isAssigned ? "bg-green-50 border border-green-200" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:space-x-3">
                          <Badge variant="secondary" className="text-xs">
                            {topicIndex + 1}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium">{topic.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {topic.duration} min • {topic.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isAssigned ? (
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={assignedMentor?.mentor.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {assignedMentor?.mentor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <Badge className="bg-green-100 text-green-800">{assignedMentor?.mentor.name}</Badge>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Unassigned
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mentor Assignments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Assigned Mentors</CardTitle>
            <Button onClick={onShowMentorBrowser} className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
              <Search className="h-4 w-4 mr-2" />
              Browse Mentors
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mentorAssignments.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">No mentors assigned yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our platform's expert mentors and assign them to specific topics
              </p>
              <Button onClick={onShowMentorBrowser} className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
                <Search className="h-4 w-4 mr-2" />
                Browse Platform Mentors
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {mentorAssignments.map((assignment) => (
                <Card key={assignment.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={assignment.mentor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {assignment.mentor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{assignment.mentor.name}</h4>
                          <p className="text-sm text-muted-foreground">{assignment.mentor.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs ml-1">{assignment.mentor.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {assignment.mentor.totalSessions} sessions
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">₦{(assignment.proposedRate * 1500).toLocaleString()}/session</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMentorAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.topicIds.length} topics assigned</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {assignment.topicIds.map((topicId) => {
                          const topic = curriculum.flatMap((m) => m.topics).find((t) => t.id === topicId)
                          return topic ? (
                            <Badge key={topicId} variant="secondary" className="text-xs">
                              {topic.title}
                            </Badge>
                          ) : null
                        })}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {assignment.mentor.expertise.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {assignment.mentor.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{assignment.mentor.expertise.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground pt-1">
                        <span className="font-medium text-gray-700">feedbacklink: </span>
                        {assignment.feedbackLink ? (
                          getSurveyHref(assignment.feedbackLink) ? (
                            <a
                              href={getSurveyHref(assignment.feedbackLink) ?? undefined}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {assignment.feedbackLink}
                            </a>
                          ) : (
                            <span>{assignment.feedbackLink}</span>
                          )
                        ) : (
                          <span>Not set</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Program Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>
                {curriculum.length} modules, {getTotalTopicsCount()} topics
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{mentorAssignments.length} mentors assigned</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {Math.round(
                  curriculum.reduce((total, m) => total + m.topics.reduce((t, topic) => t + topic.duration, 0), 0) / 60,
                )}{" "}
                total hours
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center">
        <Button variant="outline" onClick={onPrev} disabled={isLoading || isSavingDraft} className="w-full sm:w-auto min-h-10">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:space-x-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto min-h-10"
            onClick={onSaveDraft}
            disabled={isLoading || isSavingDraft}
          >
            {isSavingDraft ? "Saving Draft..." : "Save as Draft"}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading || isSavingDraft}
            className="w-full sm:w-auto min-h-10 bg-[#FFD500] text-black hover:bg-[#e6c000]"
          >
            {isLoading ? "Creating Program..." : "Create Program"}
            {!isLoading && <Check className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Mentor Browser Modal
interface MentorBrowserModalProps {
  isOpen: boolean
  onClose: () => void
  mentors: PlatformMentor[]
  isLoading: boolean
  error: string | null
  curriculum: CurriculumModule[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: any
  setFilters: (filters: any) => void
  onSelectMentor: (mentor: PlatformMentor) => void
  existingAssignments: MentorAssignment[]
}

function MentorBrowserModal({
  isOpen,
  onClose,
  mentors,
  isLoading,
  error,
  curriculum,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  onSelectMentor,
  existingAssignments,
}: MentorBrowserModalProps) {
  const allExpertiseAreas = Array.from(new Set(mentors.flatMap((m) => m.expertise)))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[min(100%,36rem)] sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Browse Platform Mentors
          </DialogTitle>
          <DialogDescription>
            Find and invite expert mentors from our platform to teach in your program
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-4 pb-4 border-b">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search mentors by name, expertise, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select value={filters.expertise} onValueChange={(value) => setFilters({ ...filters, expertise: value })}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expertise</SelectItem>
                {allExpertiseAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.availability}
              onValueChange={(value) => setFilters({ ...filters, availability: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priceRange} onValueChange={(value) => setFilters({ ...filters, priceRange: value })}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-100">₦0 - ₦150,000</SelectItem>
                <SelectItem value="100-150">₦150,000 - ₦225,000</SelectItem>
                <SelectItem value="150-200">₦225,000 - ₦300,000</SelectItem>
                <SelectItem value="200">₦300,000+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.rating} onValueChange={(value) => setFilters({ ...filters, rating: value })}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4.0">4.0+ Stars</SelectItem>
                <SelectItem value="3.5">3.5+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mentors List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 pr-2">
            {isLoading ? (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Loading mentors...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No mentors found matching your criteria</p>
              </div>
            ) : (
              mentors.map((mentor) => {
                const isAlreadyAssigned = existingAssignments.some((a) => a.mentorId === mentor.id)

                return (
                  <Card
                    key={mentor.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${isAlreadyAssigned ? "opacity-50" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {mentor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-sm">{mentor.name}</h3>
                              <p className="text-sm text-muted-foreground">{mentor.title}</p>
                              {mentor.company && <p className="text-xs text-muted-foreground">{mentor.company}</p>}
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{mentor.rating}</span>
                                <span className="text-xs text-muted-foreground">({mentor.totalReviews})</span>
                              </div>
                              <p className="text-sm font-medium">₦{(mentor.hourlyRate * 1500).toLocaleString()}/hr</p>
                              <Badge
                                variant={mentor.availability === "available" ? "default" : "secondary"}
                                className="text-xs mt-1"
                              >
                                {mentor.availability}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{mentor.bio}</p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex flex-wrap gap-1">
                              {mentor.expertise.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {mentor.expertise.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{mentor.expertise.length - 3}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {mentor.totalSessions} sessions
                              </div>
                              <div className="flex items-center">
                                <Globe className="h-3 w-3 mr-1" />
                                {mentor.timezone}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end mt-3">
                            <Button
                              size="sm"
                              onClick={() => onSelectMentor(mentor)}
                              disabled={isAlreadyAssigned}
                              className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                            >
                              {isAlreadyAssigned ? "Already Assigned" : "Assign Topics"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Mentor Assignment Modal
interface MentorAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  mentor: PlatformMentor
  curriculum: CurriculumModule[]
  existingAssignments: MentorAssignment[]
  onAssign: (assignment: MentorAssignment) => void
}

function MentorAssignmentModal({
  isOpen,
  onClose,
  mentor,
  curriculum,
  existingAssignments,
  onAssign,
}: MentorAssignmentModalProps) {
  const [surveyOptions, setSurveyOptions] = useState<
    Array<{ id: string; slug: string; title: string }>
  >([])
  const [selectedFeedbackSurveySlug, setSelectedFeedbackSurveySlug] = useState("")
  const [isSurveysLoading, setIsSurveysLoading] = useState(false)
  const [surveysError, setSurveysError] = useState<string | null>(null)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [proposedRate, setProposedRate] = useState(150) // Default pay per session
  const [customMessage, setCustomMessage] = useState("")

  useEffect(() => {
    if (!isOpen) {
      return
    }

    let isMounted = true

    const loadSurveys = async () => {
      setIsSurveysLoading(true)
      setSurveysError(null)

      try {
        const response = await apiClient.get<AllSurveysResponse>("/surveys/all-survey")

        if (response.success === false) {
          throw new Error(response.message ?? "Unable to load surveys.")
        }

        const normalizedSurveys = (response.allsurvey ?? [])
          .map((survey, index) => {
            const title = (
              survey.title ??
              survey.surveyTitle ??
              survey.name ??
              ""
            ).trim()
            const surveyId = `${survey.id ?? `survey-${index + 1}`}`
            const slug =
              extractSurveySlug(
                toStringValue(survey.slug) ??
                  toStringValue(survey.surveySlug) ??
                  toStringValue(survey.feedbacklink) ??
                  toStringValue(survey.feedbackLink) ??
                  toStringValue(survey.link) ??
                  toStringValue(survey.surveyLink) ??
                  toStringValue(survey.url),
              ) ?? null

            if (!title || !slug) {
              return null
            }

            return {
              id: surveyId,
              slug,
              title,
            }
          })
          .filter(
            (survey): survey is { id: string; slug: string; title: string } =>
              Boolean(survey),
          )

        if (!isMounted) {
          return
        }

        setSurveyOptions(normalizedSurveys)

        const defaultSurvey =
          normalizedSurveys.find(
            (survey) => survey.title.trim().toLowerCase() === "default",
          ) ?? normalizedSurveys[0]

        setSelectedFeedbackSurveySlug(defaultSurvey?.slug ?? "")
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Unable to load surveys."

        setSurveysError(message)
        setSurveyOptions([])
        setSelectedFeedbackSurveySlug("")
      } finally {
        if (isMounted) {
          setIsSurveysLoading(false)
        }
      }
    }

    void loadSurveys()

    return () => {
      isMounted = false
    }
  }, [isOpen])

  const handleAssign = () => {
    const selectedSurvey = surveyOptions.find(
      (survey) => survey.slug === selectedFeedbackSurveySlug,
    )

    const assignment: MentorAssignment = {
      id: `assignment-${Date.now()}`,
      mentorId: mentor.id,
      mentor: mentor,
      moduleIds: [],
      topicIds: selectedTopics,
      proposedRate: proposedRate,
      status: "pending",
      customMessage: customMessage,
      feedbackLink: selectedSurvey?.slug,
    }

    onAssign(assignment)
    setSelectedTopics([])
    setCustomMessage("")
  }

  const getSelectedTopicsDuration = () => {
    return curriculum
      .flatMap((m) => m.topics)
      .filter((topic) => selectedTopics.includes(topic.id))
      .reduce((total, topic) => total + topic.duration, 0)
  }

  const getAssignedTopics = () => {
    const assignedTopicIds = new Set(existingAssignments.flatMap((a) => a.topicIds))
    return assignedTopicIds
  }

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[min(100%,28rem)] sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Assign Topics to {mentor.name}
          </DialogTitle>
          <DialogDescription>Select which topics you'd like {mentor.name} to teach in your program</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mentor Info */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground">{mentor.title}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">
                        {mentor.rating} ({mentor.totalReviews} reviews)
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{mentor.totalSessions} sessions</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">₦{(mentor.hourlyRate * 1500).toLocaleString()}/session</p>
                  <Badge variant={mentor.availability === "available" ? "default" : "secondary"}>
                    {mentor.availability}
                  </Badge>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">Expertise:</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.expertise.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proposed Rate */}
          <div className="space-y-2">
            <Label htmlFor="proposedRate">Pay Per Session (₦)</Label>
            <Input
              id="proposedRate"
              type="number"
              min="0"
              step="5"
              value={proposedRate}
              onChange={(e) => setProposedRate(Number.parseInt(e.target.value) || 150)}
            />
            <p className="text-xs text-muted-foreground">Enter the amount to pay per session</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Info className="h-3 w-3 mr-1" />
              Mentors are paid on the platform after completion of their assigned sessions.
            </div>
          </div>

          {/* Topic Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Select Topics to Assign</Label>
              <div className="text-sm text-muted-foreground">
                {selectedTopics.length} topics selected
                {selectedTopics.length > 0 && <span> • {Math.round(getSelectedTopicsDuration() / 60)} hours</span>}
              </div>
            </div>

            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              {curriculum.map((module) => (
                <div key={module.id} className="mb-4 last:mb-0">
                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">{module.title}</h4>
                  <div className="space-y-2 pl-4">
                    {module.topics.map((topic) => {
                      const isAlreadyAssigned = getAssignedTopics().has(topic.id)
                      const isSelected = selectedTopics.includes(topic.id)

                      return (
                        <div key={topic.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={topic.id}
                            checked={isSelected}
                            disabled={isAlreadyAssigned}
                            onCheckedChange={() => !isAlreadyAssigned && toggleTopic(topic.id)}
                          />
                          <label
                            htmlFor={topic.id}
                            className={`text-sm flex-1 cursor-pointer ${
                              isAlreadyAssigned ? "text-muted-foreground line-through" : ""
                            }`}
                          >
                            {topic.title}
                            <span className="text-muted-foreground ml-2">({topic.duration} min)</span>
                            {isAlreadyAssigned && <span className="ml-2 text-xs text-red-600">(Already assigned)</span>}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="customMessage">Custom Message (Optional)</Label>
            <Textarea
              id="customMessage"
              placeholder="Add a personal message to your invitation..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* feedbacklink */}
          <div className="space-y-2">
            <Label htmlFor="feedbacklink">feedbacklink *</Label>
            <Select
              value={selectedFeedbackSurveySlug}
              onValueChange={setSelectedFeedbackSurveySlug}
              disabled={isSurveysLoading}
            >
              <SelectTrigger id="feedbacklink">
                <SelectValue
                  placeholder={
                    isSurveysLoading
                      ? "Loading surveys..."
                      : "Select survey"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {surveyOptions.map((survey) => (
                  <SelectItem key={survey.id} value={survey.slug}>
                    {survey.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {surveysError ? (
              <p className="text-xs text-red-600">{surveysError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                The survey with title "default" is selected automatically when available.
              </p>
            )}
          </div>

          {/* Summary */}
          {selectedTopics.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Assignment Summary</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Topics:</strong> {selectedTopics.length} selected
                  </p>
                  <p>
                    <strong>Total Duration:</strong> {Math.round(getSelectedTopicsDuration() / 60)} hours
                  </p>
                  <p>
                    <strong>Pay Per Session:</strong> ₦{(proposedRate * 1500).toLocaleString()}/session
                  </p>
                  <p>
                    <strong>Estimated Cost:</strong> ₦{((selectedTopics.length * proposedRate) * 1500).toLocaleString()} ({selectedTopics.length} sessions × ₦{(proposedRate * 1500).toLocaleString()})
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={selectedTopics.length === 0 || isSurveysLoading || !selectedFeedbackSurveySlug}
              className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
            >
              Assign Topics & Send Invitation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
