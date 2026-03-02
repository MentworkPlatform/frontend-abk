"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  FileText,
  Award,
  MessageSquare,
  BarChart3,
  Eye,
  DollarSign,
  UserCheck,
  XCircle,
  Video,
  Plus,
  Edit,
  Search,
  Loader2,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ApiError, apiClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"

type Session = {
  id: string
  date: string
  time: string
  mentor: string
  trainerConfirmed: boolean
  mentorConfirmed: boolean
  paymentStatus: "paid" | "pending" | "scheduled"
  amount: number
  meetingLink?: string
  meetingId?: string
  recordingUrl?: string
}

type Topic = {
  id: string
  moduleId: string
  moduleTitle: string
  title: string
  description: string
  type: string
  duration: number
  status: string
  mentors: string[]
  participants: number
  completionRate: number
  assessments: Array<{
    id: string
    title: string
    type: string
    submissions: number
    avgScore: number | null
    link?: string
  }>
  feedback: { rating: number; reviews: number }
  topicMentorAssignmentId?: string
  feedbackLink?: string
  sessions?: Session[]
}

type MentorInviteStatus = "APPROVED" | "PENDING" | "REJECTED"

type MentorInvite = {
  id: string
  mentorId: string
  mentorName: string
  expertise: string
  status: MentorInviteStatus
  invitedDate: string
  respondedDate?: string
  topicTitle?: string
  proposedRate?: number
  rejectionMessage?: string | null
}

type TopicMentorDisplay = {
  mentorName: string
  status?: MentorInviteStatus
  rejectionMessage?: string | null
}

type ApiMentorDirectoryProfile = {
  professional_background?: string | null
  bio?: string | null
  expertise?: string | null
  location?: string | null
  availability?: string | null
  hourlyRate?: string | number | null
  availableForHire?: boolean | null
  experience_years?: number | null
}

type ApiMentorDirectoryItem = {
  id?: string | number
  name?: string
  email?: string
  profile?: ApiMentorDirectoryProfile | string
}

type ApiMentor = {
  id?: string | number
  name?: string
  email?: string
  profile?:
    | string
    | {
        professional_background?: string | null
        bio?: string | null
        expertise?: string | null
      }
  status?: string
  confirmation?: boolean
}

type ApiTopic = {
  id?: string | number
  title?: string
  description?: string
  type?: string
  duration?: number
  status?: string
  mentors?: ApiMentor[]
  feedbacklink?: string
  feedbackLink?: string
  surveyLink?: string
  surveylink?: string
}

type ApiCurriculumModule = {
  id?: string | number
  title?: string
  description?: string
  topics?: ApiTopic[]
}

type ApiMentorAssignment = {
  id?: string | number
  topicId?: string | number
  topicTitle?: string
  mentor?: ApiMentor
  status?: string
  confirmation?: boolean
  proposedRate?: number
  rejectionMessage?: string | null
  respondedAt?: string
  feedbacklink?: string
  feedbackLink?: string
  surveyLink?: string
  surveylink?: string
}

type ApiProgramDetails = {
  id?: string | number
  title?: string
  status?: string
  isPublished?: boolean
  startDate?: string | null
  endDate?: string | null
  createdAt?: string
  updatedAt?: string
  participants?: number
  participantCount?: number
  maxParticipants?: number
  curriculum?: ApiCurriculumModule[]
  mentorAssignments?: ApiMentorAssignment[]
}

type ProgramDetailsResponse = {
  success?: boolean
  error?: string
  program?: ApiProgramDetails
}

type ApiSurveyItem = {
  id?: string | number
  slug?: string
  surveySlug?: string
  title?: string
  name?: string
  surveyTitle?: string
  feedbacklink?: string
  feedbackLink?: string
  link?: string
  surveyLink?: string
  url?: string
}

type AllSurveysResponse = {
  success?: boolean
  message?: string
  allsurvey?: ApiSurveyItem[]
}

type SurveyOption = {
  id: string
  slug: string
  title: string
}

type MentorsResponse = {
  success?: boolean
  error?: string
  mentors?: ApiMentorDirectoryItem[]
}

type MentorDirectoryItem = {
  mentorId: string
  mentorName: string
  email: string
  expertise: string
  bio: string
  professionalBackground: string
  location: string
  availability: string
  hourlyRate?: number
  availableForHire: boolean
  experienceYears?: number
}

type CurriculumModuleOption = {
  id: string
  title: string
}

type AddTopicFormState = {
  moduleId: string
  title: string
  description: string
  duration: string
  type: string
}

type AddTopicMentorAssignmentPayload = {
  mentorId: number
  proposedHourlyRate: number
  customMessage: string
  feedbacklink?: string
}

type AddTopicPayload = {
  moduleId: number
  title: string
  type: string
  description: string
  duration: number
  mentorAssignments: AddTopicMentorAssignmentPayload[]
}

const MENTOR_MODAL_PAGE_SIZE = 6
const INT32_MAX = 2_147_483_647

const normalizeProgramStatus = (program: ApiProgramDetails) => {
  if (program.isPublished) {
    return "published"
  }

  const normalizedStatus = (program.status ?? "").toLowerCase()

  if (normalizedStatus.includes("publish")) {
    return "published"
  }

  if (normalizedStatus.includes("draft")) {
    return "draft"
  }

  if (normalizedStatus.includes("active") || normalizedStatus.includes("ongoing")) {
    return "active"
  }

  return "active"
}

const shouldRedirectToDraftBuilder = (program: ApiProgramDetails) => {
  if (program.isPublished) {
    return false
  }

  const normalizedStatus = (program.status ?? "").toLowerCase()

  if (normalizedStatus.includes("draft")) {
    return true
  }

  if (normalizedStatus.includes("publish")) {
    return false
  }

  const hasScheduleWindow = Boolean(
    (program.startDate && program.startDate.trim()) ||
      (program.endDate && program.endDate.trim()),
  )

  if (hasScheduleWindow) {
    return false
  }

  const hasMentorAssignments =
    Array.isArray(program.mentorAssignments) &&
    program.mentorAssignments.length > 0

  if (hasMentorAssignments) {
    return false
  }

  const hasNestedTopics = (program.curriculum ?? []).some(
    (moduleItem) => Array.isArray(moduleItem.topics) && moduleItem.topics.length > 0,
  )

  return !hasNestedTopics
}

const normalizeTopicType = (type?: string) => {
  const normalizedType = (type ?? "").toLowerCase()

  if (normalizedType.includes("live")) {
    return "live_session"
  }

  if (normalizedType.includes("project")) {
    return "project"
  }

  if (normalizedType.includes("discussion")) {
    return "discussion"
  }

  if (normalizedType.includes("video")) {
    return "video"
  }

  if (normalizedType.includes("document") || normalizedType.includes("doc")) {
    return "document"
  }

  return "live_session"
}

const normalizeTopicStatus = (status?: string, mentorCount = 0) => {
  const normalizedStatus = (status ?? "").toLowerCase()

  if (normalizedStatus.includes("complete") || normalizedStatus.includes("done")) {
    return "completed"
  }

  if (normalizedStatus.includes("active")) {
    return "active"
  }

  if (normalizedStatus.includes("upcoming") || normalizedStatus.includes("scheduled")) {
    return "upcoming"
  }

  if (normalizedStatus.includes("draft")) {
    return "draft"
  }

  return mentorCount > 0 ? "active" : "draft"
}

const getMentorExpertise = (profile?: ApiMentor["profile"]) => {
  if (typeof profile === "string" && profile.trim().length > 0) {
    return profile
  }

  if (profile && typeof profile === "object") {
    if (
      typeof profile.professional_background === "string" &&
      profile.professional_background.trim().length > 0
    ) {
      return profile.professional_background
    }

    if (typeof profile.bio === "string" && profile.bio.trim().length > 0) {
      return profile.bio
    }

    if (typeof profile.expertise === "string" && profile.expertise.trim().length > 0) {
      return profile.expertise
    }
  }

  return "Mentor"
}

const mapInviteStatus = (
  assignmentStatus?: string,
  confirmation?: boolean,
): MentorInviteStatus => {
  if (confirmation === true) {
    return "APPROVED"
  }

  const normalizedStatus = (assignmentStatus ?? "").toLowerCase()

  if (normalizedStatus.includes("approve") || normalizedStatus.includes("accept")) {
    return "APPROVED"
  }

  if (normalizedStatus.includes("decline") || normalizedStatus.includes("reject")) {
    return "REJECTED"
  }

  return "PENDING"
}

const parseMentorHourlyRate = (value: string | number | null | undefined) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsedValue = Number(value)

    if (Number.isFinite(parsedValue)) {
      return parsedValue
    }
  }

  return undefined
}

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim()
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value)
    }
  }

  return null
}

const pickFeedbackLink = (...values: Array<string | null | undefined>) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim()
    }
  }

  return undefined
}

const normalizeComparable = (value: string | number | null | undefined) =>
  `${value ?? ""}`.trim().toLowerCase()

const resolveFeedbackLinkHref = (feedbackLink: string) => {
  const trimmed = feedbackLink.trim()

  if (!trimmed) {
    return null
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) {
    return trimmed
  }

  return `/survey/${encodeURIComponent(trimmed)}`
}

const normalizeFeedbackLinkValue = (value: string) => {
  const trimmed = value.trim()

  if (!trimmed) {
    return ""
  }

  const getSlugFromPath = (pathValue: string) => {
    const segments = pathValue
      .split("/")
      .map((segment) => segment.trim())
      .filter(Boolean)
    const surveyIndex = segments.findIndex((segment) => {
      const normalized = segment.toLowerCase()
      return normalized === "survey" || normalized === "surveys"
    })

    if (surveyIndex < 0 || surveyIndex + 1 >= segments.length) {
      return null
    }

    try {
      return decodeURIComponent(segments[surveyIndex + 1]).trim()
    } catch {
      return segments[surveyIndex + 1].trim()
    }
  }

  if (trimmed.startsWith("/")) {
    const slug = getSlugFromPath(trimmed)
    return slug && slug.length > 0 ? slug : trimmed
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed)
      const slug = getSlugFromPath(parsed.pathname)
      return slug && slug.length > 0 ? slug : trimmed
    } catch {
      return trimmed
    }
  }

  return trimmed
}

const generateClientTopicId = (topics: Topic[]) => {
  const usedTopicIds = new Set<number>()

  topics.forEach((topic) => {
    const parsedTopicId = Number(topic.id)

    if (
      Number.isInteger(parsedTopicId) &&
      parsedTopicId > 0 &&
      parsedTopicId <= INT32_MAX
    ) {
      usedTopicIds.add(parsedTopicId)
    }
  })

  let candidateTopicId = Math.floor(Date.now() / 1000)

  if (candidateTopicId <= 0 || candidateTopicId > INT32_MAX) {
    candidateTopicId = 1
  }

  while (usedTopicIds.has(candidateTopicId) && candidateTopicId < INT32_MAX) {
    candidateTopicId += 1
  }

  if (candidateTopicId > INT32_MAX) {
    candidateTopicId = 1

    while (usedTopicIds.has(candidateTopicId) && candidateTopicId < INT32_MAX) {
      candidateTopicId += 1
    }
  }

  return candidateTopicId
}

const getDefaultAddTopicForm = (moduleId = ""): AddTopicFormState => ({
  moduleId,
  title: "",
  description: "",
  duration: "60",
  type: "live_session",
})

export default function ProgramManagementPage() {
  const params = useParams()
  const router = useRouter()
  const programId = params.id as string

  const [program, setProgram] = useState({
    id: programId,
    title: "Loading program...",
    status: "draft",
    startDate: "",
    endDate: "",
    participants: 0,
    maxParticipants: 0,
    mentorsRequired: 1,
    mentorsAccepted: 0,
    mentorsPending: 0,
    canPublish: false,
  })

  const [mentorInvites, setMentorInvites] = useState<MentorInvite[]>([])
  const [topicsState, setTopicsState] = useState<Topic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [surveyOptions, setSurveyOptions] = useState<SurveyOption[]>([])
  const [selectedTopicFeedbackSlug, setSelectedTopicFeedbackSlug] = useState("")
  const [isSurveyOptionsLoading, setIsSurveyOptionsLoading] = useState(false)
  const [surveyOptionsError, setSurveyOptionsError] = useState<string | null>(null)
  const [isSavingTopicFeedbackLink, setIsSavingTopicFeedbackLink] = useState(false)
  const [topicForMentorChange, setTopicForMentorChange] = useState<Topic | null>(null)
  const [isProgramLoading, setIsProgramLoading] = useState(true)
  const [programError, setProgramError] = useState<string | null>(null)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showAssignMentorDialog, setShowAssignMentorDialog] = useState(false)
  const [selectedMentorForAssignment, setSelectedMentorForAssignment] = useState<string>("")
  const [proposedHourlyRate, setProposedHourlyRate] = useState<string>("")
  const [customMessage, setCustomMessage] = useState<string>("")
  const [isChangingMentor, setIsChangingMentor] = useState(false)
  const [mentorDirectory, setMentorDirectory] = useState<MentorDirectoryItem[]>([])
  const [isMentorsLoading, setIsMentorsLoading] = useState(false)
  const [mentorDirectoryError, setMentorDirectoryError] = useState<string | null>(null)
  const [mentorSearchQuery, setMentorSearchQuery] = useState("")
  const [mentorPage, setMentorPage] = useState(1)
  const [curriculumModules, setCurriculumModules] = useState<CurriculumModuleOption[]>([])
  const [showAddTopicDialog, setShowAddTopicDialog] = useState(false)
  const [addTopicForm, setAddTopicForm] = useState<AddTopicFormState>(() => getDefaultAddTopicForm())
  const [selectedMentorForNewTopic, setSelectedMentorForNewTopic] = useState("")
  const [newTopicProposedRate, setNewTopicProposedRate] = useState("")
  const [newTopicCustomMessage, setNewTopicCustomMessage] = useState("")
  const [newTopicFeedbackLink, setNewTopicFeedbackLink] = useState("")
  const [isAddingTopic, setIsAddingTopic] = useState(false)
  const [showDeleteTopicDialog, setShowDeleteTopicDialog] = useState(false)
  const [topicPendingDeletion, setTopicPendingDeletion] = useState<Topic | null>(null)
  const [topicBeingDeletedId, setTopicBeingDeletedId] = useState<string | null>(null)
  const [isPublishingProgram, setIsPublishingProgram] = useState(false)

  const acceptedMentors = useMemo(
    () => mentorInvites.filter((mentor) => mentor.status === "APPROVED"),
    [mentorInvites],
  )
  const pendingMentors = useMemo(
    () => mentorInvites.filter((mentor) => mentor.status === "PENDING"),
    [mentorInvites],
  )

  useEffect(() => {
    let isMounted = true

    const loadSurveyOptions = async () => {
      setIsSurveyOptionsLoading(true)
      setSurveyOptionsError(null)

      try {
        const response = await apiClient.get<AllSurveysResponse>("/surveys/all-survey")

        if (response.success === false) {
          throw new Error(response.message ?? "Unable to load surveys.")
        }

        const mappedOptions = (response.allsurvey ?? [])
          .map((survey, index) => {
            const title = (
              survey.title ??
              survey.surveyTitle ??
              survey.name ??
              ""
            ).trim()
            const slug = normalizeFeedbackLinkValue(
              (
                pickString(
                  survey.slug,
                  survey.surveySlug,
                  survey.feedbacklink,
                  survey.feedbackLink,
                  survey.link,
                  survey.surveyLink,
                  survey.url,
                ) ?? ""
              ).trim(),
            )

            if (!title || !slug) {
              return null
            }

            return {
              id: `${survey.id ?? `survey-${index + 1}`}`,
              slug,
              title,
            } satisfies SurveyOption
          })
          .filter((survey): survey is SurveyOption => Boolean(survey))

        const uniqueBySlug = Array.from(
          new Map(mappedOptions.map((option) => [option.slug, option])).values(),
        )

        if (!isMounted) {
          return
        }

        setSurveyOptions(uniqueBySlug)
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

        setSurveyOptionsError(message)
        setSurveyOptions([])
      } finally {
        if (isMounted) {
          setIsSurveyOptionsLoading(false)
        }
      }
    }

    void loadSurveyOptions()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchProgramDetails = async () => {
      setIsProgramLoading(true)
      setProgramError(null)

      try {
        const response = await apiClient.get<ProgramDetailsResponse>(
          `/programs/details/${encodeURIComponent(programId)}`,
        )

        if (response.success === false || !response.program) {
          throw new Error(response.error ?? "Unable to load program details.")
        }

        const fetchedProgram = response.program
        const resolvedProgramId = `${fetchedProgram.id ?? programId}`

        if (shouldRedirectToDraftBuilder(fetchedProgram)) {
          router.replace(
            `/trainer/dashboard/programs/create?programId=${encodeURIComponent(
              resolvedProgramId,
            )}&id=${encodeURIComponent(resolvedProgramId)}`,
          )

          return
        }

        const participants =
          typeof fetchedProgram.participants === "number"
            ? fetchedProgram.participants
            : typeof fetchedProgram.participantCount === "number"
              ? fetchedProgram.participantCount
              : 0
        const maxParticipants =
          typeof fetchedProgram.maxParticipants === "number"
            ? fetchedProgram.maxParticipants
            : participants
        const mappedModules: CurriculumModuleOption[] = (fetchedProgram.curriculum ?? []).map(
          (moduleItem, moduleIndex) => ({
            id: `${moduleItem.id ?? `module-${moduleIndex + 1}`}`,
            title: moduleItem.title?.trim() || `Module ${moduleIndex + 1}`,
          }),
        )

        const mappedTopics: Topic[] = (fetchedProgram.curriculum ?? []).flatMap(
          (moduleItem, moduleIndex) =>
            (moduleItem.topics ?? []).map((topicItem, topicIndex) => {
              const mentors = (topicItem.mentors ?? [])
                .map((mentor) => mentor.name)
                .filter((mentorName): mentorName is string => Boolean(mentorName))
              const resolvedTopicTitle =
                topicItem.title ??
                `${moduleItem.title ?? "Module"} Topic ${topicIndex + 1}`
              const topicIdKey = normalizeComparable(topicItem.id)
              const topicTitleKey = normalizeComparable(resolvedTopicTitle)
              const matchedAssignment = (fetchedProgram.mentorAssignments ?? []).find(
                (assignment) => {
                  const assignmentTopicIdKey = normalizeComparable(assignment.topicId)
                  const assignmentTopicTitleKey = normalizeComparable(
                    assignment.topicTitle,
                  )

                  return (
                    (topicIdKey.length > 0 &&
                      assignmentTopicIdKey.length > 0 &&
                      topicIdKey === assignmentTopicIdKey) ||
                    (topicTitleKey.length > 0 &&
                      topicTitleKey === assignmentTopicTitleKey)
                  )
                },
              )
              const feedbackLink = pickFeedbackLink(
                topicItem.feedbacklink,
                topicItem.feedbackLink,
                topicItem.surveyLink,
                topicItem.surveylink,
                matchedAssignment?.feedbacklink,
                matchedAssignment?.feedbackLink,
                matchedAssignment?.surveyLink,
                matchedAssignment?.surveylink,
              )
              const matchedAssignmentId = pickString(matchedAssignment?.id)
              const assignmentMentorName = matchedAssignment?.mentor?.name?.trim()
              const mentorsWithAssignment =
                assignmentMentorName && !mentors.includes(assignmentMentorName)
                  ? [...mentors, assignmentMentorName]
                  : mentors
              const mappedInviteStatus = matchedAssignment
                ? mapInviteStatus(matchedAssignment.status, matchedAssignment.confirmation)
                : null
              let topicStatus = normalizeTopicStatus(
                topicItem.status,
                mentorsWithAssignment.length,
              )

              // If a topic has a mentor assignment, it should not remain draft.
              if (topicStatus === "draft" && mappedInviteStatus) {
                topicStatus = mappedInviteStatus === "APPROVED" ? "active" : "upcoming"
              }
              const completionRate =
                topicStatus === "completed"
                  ? 100
                  : topicStatus === "active"
                    ? 50
                    : 0

              return {
                id: `${topicItem.id ?? `${moduleItem.id ?? moduleIndex}-${topicIndex}`}`,
                moduleId: `${moduleItem.id ?? `module-${moduleIndex + 1}`}`,
                moduleTitle: moduleItem.title?.trim() || `Module ${moduleIndex + 1}`,
                title: resolvedTopicTitle,
                description:
                  topicItem.description ??
                  moduleItem.description ??
                  "No description available",
                type: normalizeTopicType(topicItem.type),
                duration:
                  typeof topicItem.duration === "number" ? topicItem.duration : 0,
                status: topicStatus,
                mentors: mentorsWithAssignment,
                participants,
                completionRate,
                assessments: [],
                feedback: { rating: 0, reviews: 0 },
                topicMentorAssignmentId: matchedAssignmentId ?? undefined,
                feedbackLink,
                sessions: [],
              }
            }),
        )

        const mappedInvites: MentorInvite[] = (fetchedProgram.mentorAssignments ?? [])
          .map((assignment, index) => {
            const mentorName = assignment.mentor?.name?.trim()

            if (!mentorName) {
              return null
            }

            return {
              id: `${assignment.id ?? assignment.mentor?.id ?? index}`,
              mentorId: `${assignment.mentor?.id ?? assignment.mentor?.email ?? mentorName}`,
              mentorName,
              expertise: getMentorExpertise(assignment.mentor?.profile),
              status: mapInviteStatus(assignment.status, assignment.confirmation),
              invitedDate:
                assignment.respondedAt ??
                fetchedProgram.createdAt ??
                new Date().toISOString(),
              respondedDate: assignment.respondedAt,
              topicTitle: assignment.topicTitle,
              proposedRate:
                typeof assignment.proposedRate === "number"
                  ? assignment.proposedRate
                  : undefined,
              rejectionMessage: assignment.rejectionMessage ?? null,
            }
          })
          .filter((invite): invite is MentorInvite => Boolean(invite))

        if (!isMounted) {
          return
        }

        const mentorsRequired = Math.max(1, mappedInvites.length)

        setProgram({
          id: resolvedProgramId,
          title: fetchedProgram.title ?? "Untitled Program",
          status: normalizeProgramStatus(fetchedProgram),
          startDate: fetchedProgram.startDate ?? fetchedProgram.createdAt ?? "",
          endDate: fetchedProgram.endDate ?? fetchedProgram.updatedAt ?? "",
          participants,
          maxParticipants,
          mentorsRequired,
          mentorsAccepted: mappedInvites.filter((invite) => invite.status === "APPROVED")
            .length,
          mentorsPending: mappedInvites.filter((invite) => invite.status === "PENDING")
            .length,
          canPublish:
            (fetchedProgram.isPublished ?? false) ||
            mappedInvites.some((invite) => invite.status === "APPROVED"),
        })
        setCurriculumModules(mappedModules)
        setAddTopicForm((previousForm) => {
          const fallbackModuleId = mappedModules[0]?.id ?? ""

          if (
            previousForm.moduleId &&
            mappedModules.some((moduleItem) => moduleItem.id === previousForm.moduleId)
          ) {
            return previousForm
          }

          return {
            ...previousForm,
            moduleId: fallbackModuleId,
          }
        })
        setMentorInvites(mappedInvites)
        setTopicsState(mappedTopics.length > 0 ? mappedTopics : [])
        setSelectedTopic((currentTopic) =>
          currentTopic
            ? mappedTopics.find((topic) => topic.id === currentTopic.id) ?? null
            : null,
        )
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Unable to load program details."

        setProgramError(message)
      } finally {
        if (isMounted) {
          setIsProgramLoading(false)
        }
      }
    }

    void fetchProgramDetails()

    return () => {
      isMounted = false
    }
  }, [programId, router])

  useEffect(() => {
    if (!showAssignMentorDialog && !showAddTopicDialog) {
      return
    }

    let isMounted = true

    const fetchMentors = async () => {
      setIsMentorsLoading(true)
      setMentorDirectoryError(null)

      try {
        const response = await apiClient.get<MentorsResponse>("/mentors")

        if (response.success === false) {
          throw new Error(response.error ?? "Unable to load mentors.")
        }

        const mappedMentors = (response.mentors ?? [])
          .map((mentor) => {
            const mentorName = mentor.name?.trim()

            if (!mentorName || mentor.id === undefined || mentor.id === null) {
              return null
            }

            const profile =
              mentor.profile && typeof mentor.profile === "object"
                ? mentor.profile
                : undefined

            return {
              mentorId: `${mentor.id}`,
              mentorName,
              email: mentor.email ?? "",
              expertise: getMentorExpertise(profile),
              bio: typeof profile?.bio === "string" ? profile.bio : "",
              professionalBackground:
                typeof profile?.professional_background === "string"
                  ? profile.professional_background
                  : "",
              location: typeof profile?.location === "string" ? profile.location : "",
              availability:
                typeof profile?.availability === "string" ? profile.availability : "",
              hourlyRate: parseMentorHourlyRate(profile?.hourlyRate),
              availableForHire: profile?.availableForHire !== false,
              experienceYears:
                typeof profile?.experience_years === "number"
                  ? profile.experience_years
                  : undefined,
            }
          })
          .filter((mentor): mentor is MentorDirectoryItem => Boolean(mentor))
        const fallbackMentors = Array.from(
          new Map(
            mentorInvites.map((invite) => [
              invite.mentorId,
              {
                mentorId: invite.mentorId,
                mentorName: invite.mentorName,
                email: "",
                expertise: invite.expertise || "Mentor",
                bio: "",
                professionalBackground: "",
                location: "",
                availability: "",
                hourlyRate: invite.proposedRate,
                availableForHire: true,
              } satisfies MentorDirectoryItem,
            ]),
          ).values(),
        )

        if (!isMounted) {
          return
        }

        setMentorDirectory(mappedMentors.length > 0 ? mappedMentors : fallbackMentors)
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

        setMentorDirectoryError(message)
      } finally {
        if (isMounted) {
          setIsMentorsLoading(false)
        }
      }
    }

    void fetchMentors()

    return () => {
      isMounted = false
    }
  }, [showAssignMentorDialog, showAddTopicDialog, mentorInvites])

  const handleAttendanceConfirmation = (topicId: string, sessionId: string, type: string) => {
    console.log(`[v0] Confirming ${type} attendance for session ${sessionId} in topic ${topicId}`)
    // This would update the session confirmation status
  }

  const handleScheduleSession = (sessionData: any) => {
    console.log(`[v0] Scheduling new session:`, sessionData)
    setShowScheduleDialog(false)
    // This would create a new session with meeting link generation
  }

  const handleJoinMeeting = (meetingLink: string) => {
    console.log(`[v0] Opening meeting link: ${meetingLink}`)
    window.open(meetingLink, "_blank")
  }

  const handleAssignMentor = async () => {
    const targetTopic = topicForMentorChange ?? selectedTopic

    if (!targetTopic || !selectedMentorForAssignment) {
      console.error("Cannot assign mentor: missing target topic or selected mentor")
      return
    }

    const isChangeAction = Boolean(topicForMentorChange)
    const selectedMentor = mentorDirectory.find(
      (mentor) => mentor.mentorId === selectedMentorForAssignment,
    )

    if (!selectedMentor) {
      toast({
        title: "Mentor selection required",
        description: "Please select a valid mentor to continue.",
        variant: "destructive",
      })
      return
    }

    if (!isChangeAction && targetTopic.mentors.includes(selectedMentor.mentorName)) {
      alert("This mentor is already assigned to this topic")
      return
    }

    const topicId = targetTopic.id
    const newMentors = isChangeAction
      ? [selectedMentor.mentorName]
      : [...targetTopic.mentors, selectedMentor.mentorName]

    if (isChangeAction) {
      const assignment = mentorInvites.find(
        (invite) => invite.topicTitle === targetTopic.title,
      )

      if (!assignment) {
        toast({
          title: "Assignment not found",
          description: "Could not find a mentor assignment for this topic.",
          variant: "destructive",
        })
        return
      }

      const newMentorId = Number(selectedMentor.mentorId)
      const parsedRate = Number(proposedHourlyRate)

      if (!Number.isFinite(newMentorId)) {
        toast({
          title: "Invalid mentor",
          description: "Selected mentor ID is invalid for this request.",
          variant: "destructive",
        })
        return
      }

      if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
        toast({
          title: "Invalid rate",
          description: "Proposed hourly rate must be greater than 0.",
          variant: "destructive",
        })
        return
      }

      const message = customMessage.trim()

      if (!message) {
        toast({
          title: "Message required",
          description: "Please enter a message for the mentor reassignment.",
          variant: "destructive",
        })
        return
      }

      setIsChangingMentor(true)

      try {
        const response = await apiClient.post<
          { success?: boolean; error?: string },
          {
            newMentorId: number
            proposedHourlyRate: number
            customMessage: string
          }
        >(`/programs/topic-mentors/${assignment.id}/change-mentor`, {
          newMentorId,
          proposedHourlyRate: parsedRate,
          customMessage: message,
        })

        if (response.success === false) {
          throw new Error(response.error ?? "Unable to change mentor.")
        }

        setMentorInvites((previousInvites) =>
          previousInvites.map((invite) =>
            invite.id === assignment.id
              ? {
                  ...invite,
                  mentorId: selectedMentor.mentorId,
                  mentorName: selectedMentor.mentorName,
                  expertise: selectedMentor.expertise,
                  status: "PENDING",
                  proposedRate: parsedRate,
                  rejectionMessage: null,
                  respondedDate: undefined,
                }
              : invite,
          ),
        )

        toast({
          title: "Mentor changed",
          description: "Mentor reassignment was sent successfully.",
        })
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Unable to change mentor."

        toast({
          title: "Change mentor failed",
          description: message,
          variant: "destructive",
        })

        return
      } finally {
        setIsChangingMentor(false)
      }
    }

    // Update both states
    setTopicsState((prevTopics) =>
      prevTopics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              mentors: newMentors,
            }
          : topic
      )
    )
    
    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic({
        ...selectedTopic,
        mentors: newMentors,
      })
    }

    setShowAssignMentorDialog(false)
    setSelectedMentorForAssignment("")
    setProposedHourlyRate("")
    setCustomMessage("")
    setTopicForMentorChange(null)
  }

  const canAddNewTopic = program.status !== "published"
  const canDeleteTopic = program.status !== "published"

  const handleOpenAddTopicDialog = () => {
    if (!canAddNewTopic) {
      toast({
        title: "Program already published",
        description: "You cannot add new topics to a published program.",
        variant: "destructive",
      })
      return
    }

    setAddTopicForm((previousForm) => {
      const defaultModuleId = previousForm.moduleId || curriculumModules[0]?.id || ""

      return {
        ...previousForm,
        moduleId: defaultModuleId,
      }
    })
    setMentorSearchQuery("")
    setMentorPage(1)
    setSelectedMentorForNewTopic("")
    setNewTopicProposedRate("")
    setNewTopicCustomMessage("")
    setNewTopicFeedbackLink("")
    setShowAddTopicDialog(true)
  }

  const handleAddTopic = async () => {
    if (!canAddNewTopic) {
      toast({
        title: "Program already published",
        description: "You cannot add new topics to a published program.",
        variant: "destructive",
      })
      return
    }

    const title = addTopicForm.title.trim()
    const description = addTopicForm.description.trim()
    const parsedDuration = Number(addTopicForm.duration)

    if (!title) {
      toast({
        title: "Topic title required",
        description: "Please enter a topic title.",
        variant: "destructive",
      })
      return
    }

    if (!description) {
      toast({
        title: "Topic description required",
        description: "Please enter a topic description.",
        variant: "destructive",
      })
      return
    }

    if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
      toast({
        title: "Invalid duration",
        description: "Topic duration must be greater than 0.",
        variant: "destructive",
      })
      return
    }

    const selectedModule =
      curriculumModules.find((moduleItem) => moduleItem.id === addTopicForm.moduleId) ??
      curriculumModules[0]
    const moduleId = selectedModule?.id ?? "1"
    const moduleTitle = selectedModule?.title ?? "General Module"
    const numericModuleId = Number(moduleId)
    const resolvedModuleId = Number.isFinite(numericModuleId) ? numericModuleId : 1
    const generatedTopicId = generateClientTopicId(topicsState)
    const selectedMentor = mentorDirectory.find(
      (mentor) => mentor.mentorId === selectedMentorForNewTopic,
    )
    let mentorAssignmentsPayload: AddTopicMentorAssignmentPayload[] = []

    if (selectedMentorForNewTopic) {
      const numericMentorId = Number(selectedMentorForNewTopic)
      const parsedRate = Number(newTopicProposedRate)
      const mentorMessage = newTopicCustomMessage.trim()

      if (!Number.isFinite(numericMentorId)) {
        toast({
          title: "Invalid mentor",
          description: "Please select a valid mentor for this topic.",
          variant: "destructive",
        })
        return
      }

      if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
        toast({
          title: "Invalid rate",
          description: "Please enter a proposed hourly rate greater than 0.",
          variant: "destructive",
        })
        return
      }

      if (!mentorMessage) {
        toast({
          title: "Message required",
          description: "Please add a custom message for the mentor assignment.",
          variant: "destructive",
        })
        return
      }

      mentorAssignmentsPayload = [
        {
          mentorId: numericMentorId,
          proposedHourlyRate: parsedRate,
          customMessage: mentorMessage,
          feedbacklink: newTopicFeedbackLink.trim() || undefined,
        },
      ]
    }

    const payload: AddTopicPayload = {
      moduleId: resolvedModuleId,
      title,
      type: addTopicForm.type.toUpperCase(),
      description,
      duration: parsedDuration,
      mentorAssignments: mentorAssignmentsPayload,
    }

    setIsAddingTopic(true)

    try {
      const response = await apiClient.post<{ success?: boolean; error?: string }, AddTopicPayload>(
        `/programs/${encodeURIComponent(programId)}/topics`,
        payload,
      )

      if (response.success === false) {
        throw new Error(response.error ?? "Unable to add topic.")
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to add topic."

      toast({
        title: "Add topic failed",
        description: message,
        variant: "destructive",
      })
      setIsAddingTopic(false)
      return
    }

    const newTopic: Topic = {
      id: `${generatedTopicId}`,
      moduleId,
      moduleTitle,
      title,
      description,
      type: normalizeTopicType(addTopicForm.type),
      duration: parsedDuration,
      status: "draft",
      mentors: [],
      participants: program.participants,
      completionRate: 0,
      assessments: [],
      feedback: { rating: 0, reviews: 0 },
      feedbackLink: newTopicFeedbackLink.trim() || undefined,
      sessions: [],
    }

    setTopicsState((previousTopics) => [...previousTopics, newTopic])
    if (selectedMentor) {
      setMentorInvites((previousInvites) => [
        ...previousInvites,
        {
          id: `invite-${generatedTopicId}`,
          mentorId: selectedMentor.mentorId,
          mentorName: selectedMentor.mentorName,
          expertise: selectedMentor.expertise,
          status: "PENDING",
          invitedDate: new Date().toISOString(),
          topicTitle: title,
          proposedRate: Number.isFinite(Number(newTopicProposedRate))
            ? Number(newTopicProposedRate)
            : undefined,
          rejectionMessage: null,
        },
      ])
      setTopicsState((previousTopics) =>
        previousTopics.map((topic) =>
          topic.id === `${generatedTopicId}`
            ? { ...topic, mentors: [selectedMentor.mentorName] }
            : topic,
        ),
      )
    }
    setShowAddTopicDialog(false)
    setAddTopicForm(getDefaultAddTopicForm(moduleId))
    setSelectedMentorForNewTopic("")
    setNewTopicProposedRate("")
    setNewTopicCustomMessage("")
    setNewTopicFeedbackLink("")
    setIsAddingTopic(false)
    toast({
      title: "Topic added",
      description: "The new topic is now in your program timeline.",
    })
  }

  const handleRequestDeleteTopic = (topic: Topic) => {
    if (!canDeleteTopic) {
      toast({
        title: "Program already published",
        description: "You cannot delete topics from a published program.",
        variant: "destructive",
      })
      return
    }

    setTopicPendingDeletion(topic)
    setShowDeleteTopicDialog(true)
  }

  const handleDeleteTopic = async () => {
    if (!topicPendingDeletion) {
      return
    }

    if (!canDeleteTopic) {
      toast({
        title: "Program already published",
        description: "You cannot delete topics from a published program.",
        variant: "destructive",
      })
      return
    }

    const topic = topicPendingDeletion

    setTopicBeingDeletedId(topic.id)

    try {
      const response = await apiClient.delete<{ success?: boolean; error?: string }>(
        `/programs/${encodeURIComponent(programId)}/topics/${encodeURIComponent(topic.id)}`,
      )

      if (response.success === false) {
        throw new Error(response.error ?? "Unable to delete topic.")
      }

      const normalizedDeletedTopicTitle = topic.title.trim().toLowerCase()

      setTopicsState((previousTopics) =>
        previousTopics.filter((currentTopic) => currentTopic.id !== topic.id),
      )
      setSelectedTopic((currentTopic) =>
        currentTopic?.id === topic.id ? null : currentTopic,
      )
      setTopicForMentorChange((currentTopic) =>
        currentTopic?.id === topic.id ? null : currentTopic,
      )
      setMentorInvites((previousInvites) =>
        previousInvites.filter(
          (invite) =>
            (invite.topicTitle ?? "").trim().toLowerCase() !==
            normalizedDeletedTopicTitle,
        ),
      )

      toast({
        title: "Topic deleted",
        description: `"${topic.title}" has been removed from this program.`,
      })
      setShowDeleteTopicDialog(false)
      setTopicPendingDeletion(null)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to delete topic."

      toast({
        title: "Delete topic failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setTopicBeingDeletedId(null)
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "scheduled":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default"
      case "PENDING":
        return "secondary"
      case "REJECTED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTopicIcon = (type: string) => {
    switch (type) {
      case "live_session":
        return <Calendar className="h-5 w-5" />
      case "project":
        return <Award className="h-5 w-5" />
      case "discussion":
        return <MessageSquare className="h-5 w-5" />
      case "video":
        return <Play className="h-5 w-5" />
      case "document":
        return <FileText className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const getTopicStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "active":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "upcoming":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "draft":
        return "bg-gray-50 text-gray-600 border-gray-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const getTopicMentorInvites = (topic: Topic) => {
    const normalizedTopicTitle = topic.title.trim().toLowerCase()

    const invitesByTopicTitle = mentorInvites.filter(
      (invite) =>
        (invite.topicTitle ?? "").trim().toLowerCase() === normalizedTopicTitle,
    )

    if (invitesByTopicTitle.length > 0) {
      return invitesByTopicTitle
    }

    const topicMentorNames = new Set(
      topic.mentors.map((mentorName) => mentorName.trim().toLowerCase()),
    )

    return mentorInvites.filter((invite) =>
      topicMentorNames.has(invite.mentorName.trim().toLowerCase()),
    )
  }

  const getTopicMentorRows = (topic: Topic): TopicMentorDisplay[] => {
    const topicInvites = getTopicMentorInvites(topic)

    if (topicInvites.length === 0) {
      return topic.mentors.map((mentorName) => ({ mentorName }))
    }

    const mergedMentors = new Map<string, TopicMentorDisplay>()

    topicInvites.forEach((invite) => {
      mergedMentors.set(invite.mentorName.trim().toLowerCase(), {
        mentorName: invite.mentorName,
        status: invite.status,
        rejectionMessage: invite.rejectionMessage ?? null,
      })
    })

    topic.mentors.forEach((mentorName) => {
      const key = mentorName.trim().toLowerCase()

      if (!mergedMentors.has(key)) {
        mergedMentors.set(key, { mentorName })
      }
    })

    return Array.from(mergedMentors.values())
  }

  const selectedTopicMentorRows = useMemo(() => {
    if (!selectedTopic) {
      return []
    }

    return getTopicMentorRows(selectedTopic)
  }, [selectedTopic, mentorInvites])

  const selectedTopicFeedbackHref = useMemo(() => {
    if (!selectedTopic?.feedbackLink) {
      return null
    }

    return resolveFeedbackLinkHref(selectedTopic.feedbackLink)
  }, [selectedTopic])

  const feedbackDropdownOptions = useMemo(() => {
    const normalizedSelectedSlug = normalizeFeedbackLinkValue(selectedTopicFeedbackSlug)

    if (!normalizedSelectedSlug) {
      return surveyOptions
    }

    if (surveyOptions.some((option) => option.slug === normalizedSelectedSlug)) {
      return surveyOptions
    }

    return [
      {
        id: `assigned-${normalizedSelectedSlug}`,
        slug: normalizedSelectedSlug,
        title: `Assigned (${normalizedSelectedSlug})`,
      },
      ...surveyOptions,
    ]
  }, [selectedTopicFeedbackSlug, surveyOptions])

  useEffect(() => {
    setSelectedTopicFeedbackSlug(
      normalizeFeedbackLinkValue(selectedTopic?.feedbackLink ?? ""),
    )
  }, [selectedTopic?.id, selectedTopic?.feedbackLink])

  const handleSaveSelectedTopicFeedbackLink = async () => {
    if (!selectedTopic) {
      return
    }

    const normalizedFeedbackLink = normalizeFeedbackLinkValue(
      selectedTopicFeedbackSlug,
    )
    const assignmentId =
      selectedTopic.topicMentorAssignmentId ??
      mentorInvites.find(
        (invite) =>
          (invite.topicTitle ?? "").trim().toLowerCase() ===
          selectedTopic.title.trim().toLowerCase(),
      )?.id

    if (!assignmentId) {
      toast({
        title: "Unable to update feedback link",
        description:
          "No topic mentor assignment was found for this topic. Assign a mentor first.",
        variant: "destructive",
      })
      return
    }

    setIsSavingTopicFeedbackLink(true)

    try {
      const response = await apiClient.patch<
        { success?: boolean; error?: string },
        { feedbacklink?: string; feedbackLink?: string }
      >(
        `/programs/topic-mentors/${encodeURIComponent(
          assignmentId,
        )}/feedbacklink`,
        {
          feedbacklink: normalizedFeedbackLink || undefined,
          feedbackLink: normalizedFeedbackLink || undefined,
        },
      )

      if (
        response &&
        typeof response === "object" &&
        "success" in response &&
        response.success === false
      ) {
        throw new Error(response.error ?? "Unable to update feedback link.")
      }

      setTopicsState((previousTopics) =>
        previousTopics.map((topic) =>
          topic.id === selectedTopic.id
            ? {
                ...topic,
                topicMentorAssignmentId:
                  topic.topicMentorAssignmentId ?? assignmentId,
                feedbackLink: normalizedFeedbackLink || undefined,
              }
            : topic,
        ),
      )

      setSelectedTopic((currentTopic) =>
        currentTopic
          ? {
              ...currentTopic,
              topicMentorAssignmentId:
                currentTopic.topicMentorAssignmentId ?? assignmentId,
              feedbackLink: normalizedFeedbackLink || undefined,
            }
          : currentTopic,
      )

      setSelectedTopicFeedbackSlug(normalizedFeedbackLink)

      toast({
        title: "Feedback link updated",
        description: normalizedFeedbackLink
          ? "Survey link was saved for this topic."
          : "Survey link was cleared for this topic.",
      })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to update feedback link."

      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSavingTopicFeedbackLink(false)
    }
  }

  const topicsMissingApprovedMentor = useMemo(
    () =>
      topicsState.filter((topic) => {
        const topicInvites = getTopicMentorInvites(topic)

        return !topicInvites.some((invite) => invite.status === "APPROVED")
      }),
    [topicsState, mentorInvites],
  )

  const canPublishNow =
    program.status === "published" ||
    (topicsState.length > 0 && topicsMissingApprovedMentor.length === 0)

  const handlePublishProgram = async () => {
    if (program.status === "published") {
      toast({
        title: "Program already published",
        description: "This program is already published to the marketplace.",
      })
      return
    }

    if (!canPublishNow) {
      const pendingTopicsPreview = topicsMissingApprovedMentor
        .slice(0, 2)
        .map((topic) => topic.title)
        .join(", ")

      toast({
        title: "Publishing requirements not met",
        description:
          topicsMissingApprovedMentor.length > 0
            ? `Every topic needs an approved mentor first. Pending: ${pendingTopicsPreview}${
                topicsMissingApprovedMentor.length > 2 ? "..." : ""
              }`
            : "Every topic needs an approved mentor first.",
        variant: "destructive",
      })
      return
    }

    setIsPublishingProgram(true)

    try {
      const response = await apiClient.get<{ success?: boolean; error?: string }>(
        `/programs/publish-program/${encodeURIComponent(programId)}`,
      )

      if (response.success === false) {
        throw new Error(response.error ?? "Unable to publish program.")
      }

      setProgram((previousProgram) => ({
        ...previousProgram,
        status: "published",
        canPublish: true,
      }))
      toast({
        title: "Program published",
        description: "Your program is now published to the marketplace.",
      })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to publish program."

      toast({
        title: "Publish failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsPublishingProgram(false)
    }
  }

  const assignmentTargetTopic = topicForMentorChange ?? selectedTopic
  const filteredMentorsForAssignment = useMemo(() => {
    const normalizedSearchQuery = mentorSearchQuery.trim().toLowerCase()

    return mentorDirectory.filter((mentor) => {
      if (!normalizedSearchQuery) {
        return true
      }

      return [
        mentor.mentorName,
        mentor.email,
        mentor.expertise,
        mentor.professionalBackground,
        mentor.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearchQuery)
    })
  }, [mentorDirectory, mentorSearchQuery])

  const mentorTotalPages = Math.max(
    1,
    Math.ceil(filteredMentorsForAssignment.length / MENTOR_MODAL_PAGE_SIZE),
  )
  const paginatedMentorsForAssignment = useMemo(() => {
    const startIndex = (mentorPage - 1) * MENTOR_MODAL_PAGE_SIZE

    return filteredMentorsForAssignment.slice(
      startIndex,
      startIndex + MENTOR_MODAL_PAGE_SIZE,
    )
  }, [filteredMentorsForAssignment, mentorPage])

  const assignmentModalTitle = topicForMentorChange
    ? `Change Mentor for ${assignmentTargetTopic?.title ?? "Topic"}`
    : `Assign Mentor to ${assignmentTargetTopic?.title ?? "Topic"}`

  useEffect(() => {
    setMentorPage((previousPage) => Math.min(previousPage, mentorTotalPages))
  }, [mentorTotalPages])

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 py-4">
            <Button variant="ghost" size="icon" className="h-9 w-9 -ml-2" asChild>
                <Link href="/trainer/dashboard">
                <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-semibold text-gray-900 truncate">{program.title}</h1>
                  <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                    <Badge 
                      variant={program.status === "active" ? "default" : "secondary"} 
                      className="text-xs font-medium"
                    >
                      {program.status}
                    </Badge>
                    <span className="text-sm text-gray-600 font-medium">
                    {program.participants}/{program.maxParticipants} participants
                  </span>
                  {isProgramLoading ? (
                    <span className="text-xs text-gray-500">Loading latest details...</span>
                  ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-6">
        {programError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {programError}
          </div>
        ) : null}
        <Dialog
          open={showAssignMentorDialog}
          onOpenChange={(open) => {
            setShowAssignMentorDialog(open)

            if (open) {
              setMentorSearchQuery("")
              setMentorPage(1)
            } else {
              setSelectedMentorForAssignment("")
              setProposedHourlyRate("")
              setCustomMessage("")
              setTopicForMentorChange(null)
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">{assignmentModalTitle}</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Browse mentors, review details, and pick who should own this topic.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mentor-search" className="text-sm font-medium">
                  Search Mentors
                </Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="mentor-search"
                    value={mentorSearchQuery}
                    onChange={(event) => {
                      setMentorSearchQuery(event.target.value)
                      setMentorPage(1)
                    }}
                    placeholder="Search by name, email, expertise, or location"
                    className="pl-8"
                  />
                </div>
              </div>

              {isMentorsLoading ? (
                <div className="flex items-center justify-center rounded-lg border border-dashed p-6 text-sm text-gray-600">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading mentors...
                </div>
              ) : mentorDirectoryError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {mentorDirectoryError}
                </div>
              ) : filteredMentorsForAssignment.length > 0 ? (
                <div className="space-y-3">
                  <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                    {paginatedMentorsForAssignment.map((mentor) => {
                      const isSelected = selectedMentorForAssignment === mentor.mentorId

                      return (
                        <button
                          key={mentor.mentorId}
                          type="button"
                          onClick={() => setSelectedMentorForAssignment(mentor.mentorId)}
                          className={`w-full rounded-lg border p-3 text-left transition-colors ${
                            isSelected
                              ? "border-yellow-400 bg-yellow-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{mentor.mentorName}</p>
                              <p className="text-xs text-gray-600 truncate">
                                {mentor.email || "No email provided"}
                              </p>
                            </div>
                            <Badge variant={mentor.availableForHire ? "default" : "secondary"}>
                              {mentor.availableForHire ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-gray-600">
                            <p>
                              <span className="font-medium text-gray-800">Expertise:</span> {mentor.expertise}
                            </p>
                            {mentor.professionalBackground ? (
                              <p>
                                <span className="font-medium text-gray-800">Background:</span>{" "}
                                {mentor.professionalBackground}
                              </p>
                            ) : null}
                            <p>
                              <span className="font-medium text-gray-800">Location:</span>{" "}
                              {mentor.location || "Not provided"}
                            </p>
                            <p>
                              <span className="font-medium text-gray-800">Rate:</span>{" "}
                              {typeof mentor.hourlyRate === "number"
                                ? `${mentor.hourlyRate}/hr`
                                : "Not provided"}
                            </p>
                            {typeof mentor.experienceYears === "number" ? (
                              <p>
                                <span className="font-medium text-gray-800">Experience:</span>{" "}
                                {mentor.experienceYears} years
                              </p>
                            ) : null}
                            {mentor.bio ? (
                              <p>
                                <span className="font-medium text-gray-800">Bio:</span> {mentor.bio}
                              </p>
                            ) : null}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {mentorTotalPages > 1 ? (
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-gray-600">
                        Page {mentorPage} of {mentorTotalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setMentorPage((previousPage) => Math.max(1, previousPage - 1))}
                          disabled={mentorPage <= 1}
                        >
                          Previous
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setMentorPage((previousPage) =>
                              Math.min(mentorTotalPages, previousPage + 1),
                            )
                          }
                          disabled={mentorPage >= mentorTotalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-sm text-gray-600">
                  No mentors match your current search.
                </div>
              )}

              {topicForMentorChange ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="proposed-rate" className="text-sm font-medium">
                      Proposed Hourly Rate
                    </Label>
                    <Input
                      id="proposed-rate"
                      type="number"
                      min="1"
                      value={proposedHourlyRate}
                      onChange={(event) => setProposedHourlyRate(event.target.value)}
                      placeholder="90"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-message" className="text-sm font-medium">
                      Custom Message
                    </Label>
                    <Textarea
                      id="custom-message"
                      value={customMessage}
                      onChange={(event) => setCustomMessage(event.target.value)}
                      placeholder="Reassigning this topic to you."
                    />
                  </div>
                </>
              ) : null}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAssignMentorDialog(false)
                    setSelectedMentorForAssignment("")
                    setProposedHourlyRate("")
                    setCustomMessage("")
                    setTopicForMentorChange(null)
                  }}
                  className="font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignMentor}
                  disabled={
                    !selectedMentorForAssignment ||
                    !assignmentTargetTopic ||
                    isChangingMentor ||
                    isMentorsLoading
                  }
                  className="font-medium bg-[#FFD500] text-black hover:bg-[#e6c000]"
                >
                  {isChangingMentor
                    ? "Changing Mentor..."
                    : topicForMentorChange
                      ? "Change Mentor"
                      : "Assign Mentor"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={showAddTopicDialog}
          onOpenChange={(open) => {
            setShowAddTopicDialog(open)

            if (open) {
              setMentorSearchQuery("")
              setMentorPage(1)
            } else {
              setAddTopicForm((previousForm) =>
                getDefaultAddTopicForm(
                  previousForm.moduleId || curriculumModules[0]?.id || "",
                ),
              )
              setSelectedMentorForNewTopic("")
              setNewTopicProposedRate("")
              setNewTopicCustomMessage("")
              setNewTopicFeedbackLink("")
            }
          }}
        >
          <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Add Topic</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Create a new topic with the same structure used during program creation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 overflow-y-auto pr-1 max-h-[calc(90vh-130px)] overflow-x-hidden">
              {curriculumModules.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="topic-module" className="text-sm font-medium">
                    Module
                  </Label>
                  <Select
                    value={addTopicForm.moduleId}
                    onValueChange={(value) =>
                      setAddTopicForm((previousForm) => ({
                        ...previousForm,
                        moduleId: value,
                      }))
                    }
                  >
                    <SelectTrigger id="topic-module" className="text-sm">
                      <SelectValue placeholder="Choose module" />
                    </SelectTrigger>
                    <SelectContent>
                      {curriculumModules.map((moduleItem) => (
                        <SelectItem key={moduleItem.id} value={moduleItem.id}>
                          {moduleItem.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="rounded-md border border-dashed px-3 py-2 text-sm text-gray-600">
                  No curriculum modules found. This topic will be added under General Module.
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="topic-title" className="text-sm font-medium">
                  Topic Title
                </Label>
                <Input
                  id="topic-title"
                  value={addTopicForm.title}
                  onChange={(event) =>
                    setAddTopicForm((previousForm) => ({
                      ...previousForm,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g., SEO Fundamentals"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="topic-duration" className="text-sm font-medium">
                    Duration (min)
                  </Label>
                  <Input
                    id="topic-duration"
                    type="number"
                    min="1"
                    value={addTopicForm.duration}
                    onChange={(event) =>
                      setAddTopicForm((previousForm) => ({
                        ...previousForm,
                        duration: event.target.value,
                      }))
                    }
                    placeholder="60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-type" className="text-sm font-medium">
                    Type
                  </Label>
                  <Select
                    value={addTopicForm.type}
                    onValueChange={(value) =>
                      setAddTopicForm((previousForm) => ({
                        ...previousForm,
                        type: value,
                      }))
                    }
                  >
                    <SelectTrigger id="topic-type" className="text-sm">
                      <SelectValue placeholder="Topic type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live_session">Live Session</SelectItem>
                      <SelectItem value="discussion">Discussion</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic-description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="topic-description"
                  value={addTopicForm.description}
                  onChange={(event) =>
                    setAddTopicForm((previousForm) => ({
                      ...previousForm,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe what this topic covers."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-topic-mentor-search" className="text-sm font-medium">
                  Assign Mentor (Optional)
                </Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="new-topic-mentor-search"
                    value={mentorSearchQuery}
                    onChange={(event) => {
                      setMentorSearchQuery(event.target.value)
                      setMentorPage(1)
                    }}
                    placeholder="Search mentor by name, email, expertise"
                    className="pl-8"
                  />
                </div>
              </div>
              {isMentorsLoading ? (
                <div className="flex items-center justify-center rounded-lg border border-dashed p-4 text-sm text-gray-600">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading mentors...
                </div>
              ) : mentorDirectoryError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {mentorDirectoryError}
                </div>
              ) : filteredMentorsForAssignment.length > 0 ? (
                <div className="space-y-3">
                  <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
                    {paginatedMentorsForAssignment.map((mentor) => {
                      const isSelected = selectedMentorForNewTopic === mentor.mentorId

                      return (
                        <button
                          key={`new-topic-mentor-${mentor.mentorId}`}
                          type="button"
                          onClick={() =>
                            setSelectedMentorForNewTopic((currentValue) =>
                              currentValue === mentor.mentorId ? "" : mentor.mentorId,
                            )
                          }
                          className={`w-full rounded-lg border p-2.5 text-left transition-colors ${
                            isSelected
                              ? "border-yellow-400 bg-yellow-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{mentor.mentorName}</p>
                              <p className="text-xs text-gray-600 break-words">{mentor.expertise}</p>
                            </div>
                            <Badge variant={mentor.availableForHire ? "default" : "secondary"} className="shrink-0">
                              {mentor.availableForHire ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  {mentorTotalPages > 1 ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">
                      <p className="text-gray-600">
                        Page {mentorPage} of {mentorTotalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setMentorPage((previousPage) => Math.max(1, previousPage - 1))}
                          disabled={mentorPage <= 1}
                        >
                          Previous
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setMentorPage((previousPage) =>
                              Math.min(mentorTotalPages, previousPage + 1),
                            )
                          }
                          disabled={mentorPage >= mentorTotalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-sm text-gray-600">
                  No mentors found.
                </div>
              )}
              {selectedMentorForNewTopic ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-topic-rate" className="text-sm font-medium">
                      Proposed Hourly Rate
                    </Label>
                    <Input
                      id="new-topic-rate"
                      type="number"
                      min="1"
                      value={newTopicProposedRate}
                      onChange={(event) => setNewTopicProposedRate(event.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-topic-feedback-link" className="text-sm font-medium">
                      Feedback Link (Optional)
                    </Label>
                    <Input
                      id="new-topic-feedback-link"
                      value={newTopicFeedbackLink}
                      onChange={(event) => setNewTopicFeedbackLink(event.target.value)}
                      placeholder="https://forms.gle/example"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="new-topic-message" className="text-sm font-medium">
                      Custom Message
                    </Label>
                    <Textarea
                      id="new-topic-message"
                      value={newTopicCustomMessage}
                      onChange={(event) => setNewTopicCustomMessage(event.target.value)}
                      placeholder="Please handle this topic."
                    />
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddTopicDialog(false)}
                  className="font-medium w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTopic}
                  className="font-medium bg-[#FFD500] text-black hover:bg-[#e6c000] w-full sm:w-auto"
                  disabled={!canAddNewTopic || isAddingTopic || isMentorsLoading}
                >
                  {isAddingTopic ? "Adding Topic..." : "Add Topic"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <AlertDialog
          open={showDeleteTopicDialog}
          onOpenChange={(open) => {
            if (topicBeingDeletedId) {
              return
            }

            setShowDeleteTopicDialog(open)

            if (!open) {
              setTopicPendingDeletion(null)
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete topic</AlertDialogTitle>
              <AlertDialogDescription>
                {topicPendingDeletion
                  ? `Are you sure you want to delete "${topicPendingDeletion.title}"? This action cannot be undone.`
                  : "Are you sure you want to delete this topic? This action cannot be undone."}
              </AlertDialogDescription>
              {topicBeingDeletedId ? (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting topic...
                </p>
              ) : null}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  if (topicBeingDeletedId) {
                    return
                  }

                  setShowDeleteTopicDialog(false)
                  setTopicPendingDeletion(null)
                }}
                disabled={Boolean(topicBeingDeletedId)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600"
                disabled={!topicPendingDeletion || Boolean(topicBeingDeletedId)}
                onClick={(event) => {
                  event.preventDefault()
                  void handleDeleteTopic()
                }}
              >
                {topicBeingDeletedId ? "Deleting..." : "Delete Topic"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Tabs defaultValue="pre-launch" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pre-launch" className="font-medium">Pre-Launch</TabsTrigger>
            <TabsTrigger value="management" className="font-medium">Program Management</TabsTrigger>
          </TabsList>

          {/* Pre-Launch Tab */}
          <TabsContent value="pre-launch" className="space-y-6">
            {/* Mentor Requirements Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Users className="h-5 w-5" />
                  Mentor Requirements
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1.5">
                  You need at least 1 mentor to accept before you can publish this program to the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">Mentors Accepted</span>
                    <span className="text-2xl font-semibold text-green-600">{acceptedMentors.length}</span>
                  </div>
                  <Progress value={(acceptedMentors.length / program.mentorsRequired) * 100} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {acceptedMentors.length} of {program.mentorsRequired} mentors accepted
                    </span>
                    <span>{pendingMentors.length} pending responses</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentor Invite Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Mentor Invite Status</CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1.5">Track the status of your mentor invitations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentorInvites.length > 0 ? (
                    mentorInvites.map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(invite.status)}
                          <div>
                            <h4 className="font-semibold text-gray-900">{invite.mentorName}</h4>
                            <p className="text-sm text-gray-600 mt-0.5">{invite.expertise}</p>
                            {invite.topicTitle ? (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Topic: {invite.topicTitle}
                              </p>
                            ) : null}
                            {typeof invite.proposedRate === "number" ? (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Proposed Rate: {invite.proposedRate}/hr
                              </p>
                            ) : null}
                            {invite.status === "REJECTED" && invite.rejectionMessage ? (
                              <div className="mt-2 rounded border border-red-200 bg-red-50 px-2 py-1">
                                <p className="text-xs text-red-700">
                                  Rejection Reason: {invite.rejectionMessage}
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right text-sm">
                            <p className="text-muted-foreground">
                              Invited: {new Date(invite.invitedDate).toLocaleDateString()}
                            </p>
                            {invite.respondedDate && (
                              <p className="text-muted-foreground">
                                Responded: {new Date(invite.respondedDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Badge variant={getStatusColor(invite.status)}>{invite.status}</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                      No mentor assignments found for this program.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Publish Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Marketplace Publishing</CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1.5">
                  {program.status === "published"
                    ? "This program is already published to the marketplace."
                    : canPublishNow
                      ? "All topics have approved mentors and are ready for publishing."
                      : "All topics must have at least one approved mentor before publishing."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {program.status === "published" || canPublishNow ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className="font-semibold text-gray-900">
                      {program.status === "published"
                        ? "Published"
                        : canPublishNow
                          ? "Ready to Publish"
                          : "Waiting for Mentor Approvals"}
                    </span>
                  </div>
                  <Button
                    onClick={handlePublishProgram}
                    disabled={program.status === "published" || !canPublishNow || isPublishingProgram}
                    className="bg-[#FFD500] text-black hover:bg-[#e6c000] disabled:opacity-50 font-medium"
                  >
                    {program.status === "published"
                      ? "Published"
                      : isPublishingProgram
                        ? "Publishing..."
                        : "Publish to Marketplace"}
                  </Button>
                </div>
                {program.status !== "published" && topicsMissingApprovedMentor.length > 0 ? (
                  <p className="text-xs text-gray-600 mt-2">
                    {topicsMissingApprovedMentor.length} topic(s) still need approved mentors.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            {selectedTopic ? (
              // Topic Detail View
              <div className="space-y-6">
                  <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="h-9 w-9 -ml-2" onClick={() => setSelectedTopic(null)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${getTopicStatusColor(selectedTopic.status)} flex-shrink-0`}>
                      {getTopicIcon(selectedTopic.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-gray-900 truncate">{selectedTopic.title}</h2>
                      <p className="text-sm text-gray-600 mt-1 truncate">{selectedTopic.description}</p>
                    </div>
                  </div>
                </div>

                {/* Topic Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Participants</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{selectedTopic.participants}</p>
                        </div>
                        <Users className="h-6 w-6 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Completion</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{selectedTopic.completionRate}%</p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Duration</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{selectedTopic.duration}m</p>
                        </div>
                        <Clock className="h-6 w-6 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Rating</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{selectedTopic.feedback.rating || "N/A"}</p>
                        </div>
                        <BarChart3 className="h-6 w-6 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <FileText className="h-5 w-5" />
                      Topic Feedback Link
                    </CardTitle>
                    <CardDescription>
                      Assign or update the survey slug/link for this topic.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="topic-feedback-link" className="text-sm font-medium">
                        Survey
                      </Label>
                      <Select
                        value={selectedTopicFeedbackSlug}
                        onValueChange={setSelectedTopicFeedbackSlug}
                        disabled={isSurveyOptionsLoading}
                      >
                        <SelectTrigger id="topic-feedback-link">
                          <SelectValue
                            placeholder={
                              isSurveyOptionsLoading
                                ? "Loading surveys..."
                                : "Select survey"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {feedbackDropdownOptions.map((surveyOption) => (
                            <SelectItem key={surveyOption.id} value={surveyOption.slug}>
                              {surveyOption.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {surveyOptionsError ? (
                        <p className="text-xs text-red-600">{surveyOptionsError}</p>
                      ) : (
                        <p className="text-xs text-gray-500">
                          The currently assigned survey is selected by default.
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSaveSelectedTopicFeedbackLink}
                        disabled={
                          isSavingTopicFeedbackLink ||
                          isSurveyOptionsLoading ||
                          !selectedTopicFeedbackSlug
                        }
                        className="bg-[#FFD500] text-black hover:bg-[#e6c000] font-medium"
                      >
                        {isSavingTopicFeedbackLink ? "Saving..." : "Save Feedback Link"}
                      </Button>
                    </div>
                    {selectedTopic.feedbackLink ? (
                      selectedTopicFeedbackHref ? (
                        <a
                          href={selectedTopicFeedbackHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-sm text-blue-600 hover:underline"
                        >
                          {selectedTopic.feedbackLink}
                        </a>
                      ) : (
                        <p className="break-all text-sm text-gray-700">
                          {selectedTopic.feedbackLink}
                        </p>
                      )
                    ) : (
                      <p className="text-sm text-gray-500">No feedback link assigned yet.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                          <Video className="h-5 w-5" />
                          Online Sessions & Payment Tracking
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1.5">
                          Schedule and manage online meetings for this topic. Both trainer and mentor must confirm
                          attendance for payment processing.
                        </CardDescription>
                      </div>
                      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000] font-medium">
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule Session
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">Schedule Online Session</DialogTitle>
                            <DialogDescription className="text-sm text-gray-600">
                              Create a new online session for {selectedTopic.title}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                                <Input id="date" type="date" className="text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                                <Input id="time" type="time" className="text-sm" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mentor" className="text-sm font-medium">Select Mentor</Label>
                              <Select>
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="Choose a mentor" />
                                </SelectTrigger>
                                <SelectContent>
                                  {acceptedMentors.map((mentor) => (
                                    <SelectItem key={mentor.id} value={mentor.mentorId} className="text-sm">
                                      {mentor.mentorName} - {mentor.expertise}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="amount" className="text-sm font-medium">Payment Amount (₦)</Label>
                              <Input id="amount" type="number" placeholder="225000" className="text-sm" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <Button variant="outline" onClick={() => setShowScheduleDialog(false)} className="font-medium">
                                Cancel
                              </Button>
                              <Button onClick={() => handleScheduleSession({})} className="font-medium bg-[#FFD500] text-black hover:bg-[#e6c000]">
                                Schedule Session
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedTopic.sessions && selectedTopic.sessions.length > 0 ? (
                      <div className="space-y-4">
                        {selectedTopic.sessions.map((session) => (
                          <div key={session.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Video className="h-5 w-5 text-blue-500" />
                                <div>
                                  <h4 className="font-medium">{session.mentor}</h4>
                                  <p className="text-sm text-gray-600">
                                    {new Date(session.date).toLocaleDateString()} at {session.time}
                                  </p>
                                  {session.meetingId && (
                                    <p className="text-xs text-gray-500">Meeting ID: {session.meetingId}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getPaymentStatusColor(session.paymentStatus)}>
                                  {session.paymentStatus}
                                </Badge>
                                <span className="font-medium">₦{(session.amount * 1500).toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Video className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-800">Online Meeting</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {session.meetingLink && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleJoinMeeting(session.meetingLink)}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Video className="h-4 w-4 mr-1" />
                                      Join Meeting
                                    </Button>
                                  )}
                                  {"recordingUrl" in session && session.recordingUrl && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => window.open(session.recordingUrl, "_blank")}
                                    >
                                      <Play className="h-4 w-4 mr-1" />
                                      Recording
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Trainer Confirmation */}
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium">Trainer Confirmation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {session.trainerConfirmed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                                  <span className="text-sm">{session.trainerConfirmed ? "Confirmed" : "Pending"}</span>
                                  {!session.trainerConfirmed && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleAttendanceConfirmation(selectedTopic.id, session.id, "trainer")
                                      }
                                    >
                                      Confirm
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {/* Mentor Confirmation */}
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium">Mentor Confirmation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {session.mentorConfirmed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                                  <span className="text-sm">{session.mentorConfirmed ? "Confirmed" : "Pending"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Payment Status Message */}
                            <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                              {session.trainerConfirmed && session.mentorConfirmed
                                ? session.paymentStatus === "paid"
                                  ? "✅ Payment processed successfully"
                                  : "⏳ Payment will be processed within 24 hours"
                                : "⚠️ Both trainer and mentor confirmation required for payment processing"}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No online sessions scheduled yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-transparent"
                          onClick={() => setShowScheduleDialog(true)}
                        >
                          Schedule First Session
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Topic Details Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Mentors Teaching */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Users className="h-5 w-5" />
                        Mentors Teaching
                      </CardTitle>
                    </CardHeader>
                      <CardContent>
                      {selectedTopicMentorRows.length > 0 ? (
                        <div className="space-y-3">
                          {selectedTopicMentorRows.map((mentor, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {mentor.mentorName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="font-semibold text-gray-900 truncate">{mentor.mentorName}</p>
                                  <Badge
                                    variant={mentor.status ? getStatusColor(mentor.status) : "secondary"}
                                  >
                                    {mentor.status ?? "ASSIGNED"}
                                  </Badge>
                                </div>
                                {mentor.status === "REJECTED" && mentor.rejectionMessage ? (
                                  <p className="text-xs text-red-600 mt-0.5">
                                    Reason: {mentor.rejectionMessage}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-600 mt-0.5">
                                    {mentor.status ? "Invite tracked" : "Assigned Mentor"}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full font-medium"
                            onClick={() => {
                              setTopicForMentorChange(null)
                              setSelectedMentorForAssignment("")
                              setProposedHourlyRate("")
                              setCustomMessage("")
                              setShowAssignMentorDialog(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Assign Another Mentor
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-medium">No mentors assigned yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 bg-transparent font-medium"
                            onClick={() => {
                              setTopicForMentorChange(null)
                              setSelectedMentorForAssignment("")
                              setProposedHourlyRate("")
                              setCustomMessage("")
                              setShowAssignMentorDialog(true)
                            }}
                          >
                            Assign Mentor
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Assessments */}
                  <Card>
                    <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Award className="h-5 w-5" />
                        Assessments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedTopic.assessments.length > 0 ? (
                        <div className="space-y-3">
                          {selectedTopic.assessments.map((assessment) => (
                            <div key={assessment.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{assessment.title}</h4>
                                <Badge variant="outline">{assessment.type}</Badge>
                              </div>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>{assessment.submissions} submissions</span>
                                <span>Avg: {assessment.avgScore || "Not graded"}</span>
                              </div>
                          {(assessment as any).link && typeof (assessment as any).link === "string" && (
                            <div className="mt-2">
                              <a
                                href={(assessment as any).link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                View Assessment Link
                              </a>
                            </div>
                          )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No assessments created</p>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            Create Assessment
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <MessageSquare className="h-5 w-5" />
                      Student Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTopic.feedback.reviews > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-semibold text-gray-900">{selectedTopic.feedback.rating}</div>
                            <div className="text-sm text-gray-600 font-medium mt-1">Average Rating</div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-600 mb-1.5 font-medium">{selectedTopic.feedback.reviews} reviews</div>
                            <Progress value={(selectedTopic.feedback.rating / 5) * 100} className="h-2" />
                          </div>
                        </div>
                        <Button variant="outline" className="w-full bg-transparent font-medium">
                          View All Feedback
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No feedback yet</p>
                        <p className="text-sm">Feedback will appear after the topic is completed</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Topics Timeline View
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Program Topics Timeline</h2>
                    <p className="text-sm text-gray-600 mt-1">Follow the progressive learning path for your program</p>
                  </div>
                  <Button
                    className="bg-[#FFD500] text-black hover:bg-[#e6c000] font-medium disabled:opacity-60"
                    onClick={handleOpenAddTopicDialog}
                    disabled={!canAddNewTopic}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    {canAddNewTopic ? "Add Topic" : "Published"}
                  </Button>
                </div>

                {/* Quick Stats - Moved to Top */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Total Topics</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{topicsState.length}</p>
                        </div>
                        <BookOpen className="h-6 w-6 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Completed</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{topicsState.filter((t) => t.status === "completed").length}</p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Active</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">{topicsState.filter((t) => t.status === "active").length}</p>
                        </div>
                        <Clock className="h-6 w-6 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Payments</p>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">
                            {topicsState.reduce(
                              (acc, t) => acc + (t.sessions?.filter((s) => s.paymentStatus === "paid").length || 0),
                              0,
                            )}
                          </p>
                        </div>
                        <DollarSign className="h-6 w-6 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline Line */}
                {topicsState.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>

                  <div className="space-y-6">
                    {topicsState.map((topic, index) => {
                      const topicMentorRows = getTopicMentorRows(topic)
                      const topicFeedbackHref = topic.feedbackLink
                        ? resolveFeedbackLinkHref(topic.feedbackLink)
                        : null

                      return (
                        <div key={topic.id} className="relative flex items-start gap-6">
                        {/* Topic Number Circle */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full font-semibold text-lg text-white ${
                            topic.status === "completed"
                              ? "bg-gray-700"
                              : topic.status === "active"
                                ? "bg-gray-600"
                                : topic.status === "upcoming"
                                  ? "bg-gray-500"
                                  : "bg-gray-400"
                          }`}
                        >
                          {index + 1}
                        </div>

                        {/* Topic Card */}
                        <Card
                          className="flex-1 cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                          onClick={() => {
                            // Always get the latest topic from topicsState
                            const latestTopic = topicsState.find((t) => t.id === topic.id)
                            if (latestTopic) {
                              setSelectedTopic(latestTopic)
                            }
                          }}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`p-3 rounded-lg ${getTopicStatusColor(topic.status)} flex-shrink-0`}>
                                  {getTopicIcon(topic.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                <div>
                                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">{topic.title}</CardTitle>
                                      <p className="text-sm text-gray-600 mt-0.5">{topic.description}</p>
                                </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge className={getTopicStatusColor(topic.status)}>{topic.status}</Badge>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={(event) => {
                                          event.stopPropagation()
                                          setTopicForMentorChange(topic)
                                          setSelectedMentorForAssignment("")
                                          setProposedHourlyRate("")
                                          setCustomMessage("")
                                          setShowAssignMentorDialog(true)
                                        }}
                                      >
                                        <UserCheck className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        onClick={(event) => {
                                          event.stopPropagation()
                                          handleRequestDeleteTopic(topic)
                                        }}
                                        disabled={!canDeleteTopic || Boolean(topicBeingDeletedId)}
                                      >
                                        {topicBeingDeletedId === topic.id ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Trash2 className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="pt-0 space-y-4">
                            {/* Progress Bar */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 font-medium">Progress</span>
                                <span className="font-semibold text-gray-900">{topic.completionRate}%</span>
                                </div>
                                <Progress value={topic.completionRate} className="h-2" />
                              </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Duration</p>
                                  <p className="text-sm font-semibold text-gray-900">{topic.duration}m</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Participants</p>
                                  <p className="text-sm font-semibold text-gray-900">{topic.participants}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Sessions</p>
                                  <p className="text-sm font-semibold text-gray-900">{topic.sessions ? topic.sessions.length : 0}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Payment</p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {topic.sessions && topic.sessions.length > 0
                                      ? topic.sessions.every((s) => s.paymentStatus === "paid")
                                        ? "✅ Paid"
                                        : topic.sessions.some((s) => s.paymentStatus === "pending")
                                          ? "⏳ Pending"
                                          : "📅 Scheduled"
                                      : "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-md border border-blue-100 bg-blue-50/60 px-3 py-2 text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-medium text-blue-900">Feedback Link</p>
                                {!topic.feedbackLink ? (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      setSelectedTopic(topic)
                                    }}
                                    className="h-7 px-2 text-[11px]"
                                  >
                                    Assign
                                  </Button>
                                ) : null}
                              </div>
                              {topic.feedbackLink ? (
                                topicFeedbackHref ? (
                                  <a
                                    href={topicFeedbackHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(event) => event.stopPropagation()}
                                    className="mt-1 inline-flex break-all text-blue-700 hover:underline"
                                  >
                                    {topic.feedbackLink}
                                  </a>
                                ) : (
                                  <p className="mt-1 break-all text-blue-700">
                                    {topic.feedbackLink}
                                  </p>
                                )
                              ) : (
                                <p className="mt-1 text-blue-700">
                                  No feedback link assigned.
                                </p>
                              )}
                            </div>

                            {/* Mentors */}
                            {topicMentorRows.length > 0 && (
                              <div className="pt-3 border-t space-y-2">
                                <span className="text-sm text-gray-600 font-medium">Mentors:</span>
                                <div className="space-y-2">
                                  {topicMentorRows.map((mentorRow, mentorIndex) => (
                                    <div
                                      key={`${topic.id}-${mentorRow.mentorName}-${mentorIndex}`}
                                      className="rounded-md border border-gray-100 bg-gray-50 px-2.5 py-2"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs font-semibold text-gray-900 truncate">
                                          {mentorRow.mentorName}
                                        </p>
                                        <Badge
                                          variant={
                                            mentorRow.status ? getStatusColor(mentorRow.status) : "secondary"
                                          }
                                          className="text-[10px]"
                                        >
                                          {mentorRow.status ?? "ASSIGNED"}
                                        </Badge>
                                      </div>
                                      {mentorRow.status === "REJECTED" && mentorRow.rejectionMessage ? (
                                        <p className="mt-1 text-[11px] text-red-600">
                                          Reason: {mentorRow.rejectionMessage}
                                        </p>
                                      ) : null}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                      )
                    })}
                  </div>
                </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                    No curriculum topics found for this program.
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
