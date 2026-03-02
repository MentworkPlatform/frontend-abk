'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Target,
  Users,
  XCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { DashboardHeader } from '@/components/dashboard-header'
import { useToast } from '@/hooks/use-toast'
import { ApiError, getAuthToken } from '@/lib/api-client'
import { mentorApi } from '@/lib/mentor'

type DashboardSession = {
  id: string
  programTitle: string
  topicTitle: string
  moduleTitle?: string
  scheduledAt: string
  durationMinutes: number
  menteeCount: number
  proposedHourlyRate?: number
  meetingLink?: string
  meetingId?: string
  feedbackLink?: string
  status: string
  tag?: string
}

type DashboardProgram = {
  id: string
  title: string
  status: string
  focusArea: string
  menteeCount: number
  completedSessions: number
  totalSessions: number
  assignedTopicsCount: number
  firstAssignedTopicTitle?: string
  firstAssignedTopicModule?: string
  firstAssignedTopicRate?: number
  nextSession: string | null
}

type PendingTopicAssignment = {
  id: string
  programId?: string
  programTitle: string
  topicTitle: string
  requestedBy: string
  requestedAt: string | null
  status: string
  proposedHourlyRate?: number
  customMessage?: string
}

type AssignmentEventRecord = {
  id: string
  action: string
  actorName: string
  actorEmail?: string
  message?: string
  proposedHourlyRate?: number
  createdAt: string | null
}

type AssignmentRequestRecord = {
  id: string
  mentorName: string
  mentorEmail?: string
  status: string
  proposedHourlyRate?: number
  customMessage?: string
  rejectionMessage?: string
  respondedAt: string | null
  createdAt: string | null
  events: AssignmentEventRecord[]
}

type PendingAssignmentDetail = {
  assignmentId: string
  totalRequests: number
  topic: {
    topicId: string
    title: string
    type?: string
    description?: string
    durationMinutes: number
    moduleTitle?: string
    programTitle?: string
  }
  requests: AssignmentRequestRecord[]
  timeline: AssignmentEventRecord[]
}

const asObject = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, unknown>
  }

  return null
}

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value)
    }
  }

  return null
}

const pickNumber = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value)

      if (!Number.isNaN(parsed)) {
        return parsed
      }
    }

    if (Array.isArray(value)) {
      return value.length
    }
  }

  return 0
}

const extractArrayFromPayload = (payload: unknown, keys: string[] = []) => {
  if (Array.isArray(payload)) {
    return payload
  }

  const root = asObject(payload)

  if (!root) {
    return []
  }

  const rootData = root.data
  const dataRecord = asObject(rootData)
  const candidates: unknown[] = [
    root.items,
    root.rows,
    root.results,
    root.sessions,
    root.programs,
    root.topicAssignments,
    root.assignments,
    rootData,
    dataRecord?.items,
    dataRecord?.rows,
    dataRecord?.results,
    dataRecord?.sessions,
    dataRecord?.programs,
    dataRecord?.topicAssignments,
    dataRecord?.assignments,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
    }
  }

  for (const key of keys) {
    if (Array.isArray(root[key])) {
      return root[key] as unknown[]
    }

    if (dataRecord && Array.isArray(dataRecord[key])) {
      return dataRecord[key] as unknown[]
    }
  }

  return []
}

const parseTokenPayload = (token: string) => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const tokenPayload = token.split('.')[1] ?? ''
    const normalizedPayload = tokenPayload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const paddedPayload =
      normalizedPayload + '='.repeat((4 - (normalizedPayload.length % 4)) % 4)

    return asObject(JSON.parse(window.atob(paddedPayload)))
  } catch {
    return null
  }
}

const resolveMentorId = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const token = getAuthToken()

  if (token) {
    const tokenRecord = parseTokenPayload(token)

    const tokenId =
      pickString(
        tokenRecord?.id,
        tokenRecord?.userId,
        tokenRecord?.mentorId,
        asObject(tokenRecord?.user)?.id,
        asObject(tokenRecord?.data)?.id,
      ) ?? null

    if (tokenId) {
      return tokenId
    }

    const subject = pickString(tokenRecord?.sub)

    if (subject && !subject.includes('@')) {
      return subject
    }
  }

  const candidates = ['user', 'profile', 'authUser']

  for (const key of candidates) {
    const rawValue = window.localStorage.getItem(key)

    if (!rawValue) {
      continue
    }

    try {
      const parsedRecord = asObject(JSON.parse(rawValue))
      const profileId =
        pickString(
          parsedRecord?.id,
          parsedRecord?.userId,
          parsedRecord?.mentorId,
          asObject(parsedRecord?.user)?.id,
          asObject(parsedRecord?.data)?.id,
        ) ?? null

      if (profileId) {
        return profileId
      }
    } catch {
      continue
    }
  }

  return null
}

const mapSession = (rawSession: unknown, index: number): DashboardSession | null => {
  const record = asObject(rawSession)

  if (!record) {
    return null
  }

  const programRecord = asObject(record.program)
  const topicRecord = asObject(record.topic)
  const meetingRecord = asObject(record.meeting)
  const statsRecord = asObject(record.stats)
  const sessionId =
    pickString(
      record.id,
      record.sessionId,
      record.topicMentorId,
      record.reference,
      record.topicId,
      record.programId,
    ) ?? `session-${index + 1}`

  return {
    id: sessionId,
    programTitle:
      pickString(
        record.programTitle,
        record.programName,
        programRecord?.title,
        programRecord?.name,
      ) ?? 'Untitled Program',
    topicTitle:
      pickString(
        record.topicTitle,
        record.topic_name,
        record.topic,
        record.title,
        topicRecord?.topicTitle,
        topicRecord?.title,
        topicRecord?.name,
      ) ?? 'Session',
    moduleTitle:
      pickString(record.moduleTitle, record.moduleName, topicRecord?.moduleTitle) ??
      undefined,
    scheduledAt:
      pickString(
        record.scheduledAt,
        record.startTime,
        record.sessionDate,
        record.date,
        record.time,
        record.approvedAt,
        record.assignedAt,
        record.startDate,
        record.endDate,
      ) ?? '',
    durationMinutes: pickNumber(
      record.durationMinutes,
      record.duration,
      record.topicDuration,
      record.sessionDuration,
    ),
    menteeCount: pickNumber(
      record.menteeCount,
      record.menteesCount,
      record.participantsCount,
      record.attendeesCount,
      statsRecord?.participants,
      record.mentees,
      record.participants,
    ),
    meetingLink: pickString(
      record.meetingLink,
      record.joinUrl,
      record.link,
      meetingRecord?.link,
      meetingRecord?.joinUrl,
    ) ?? undefined,
    meetingId:
      pickString(record.meetingId, meetingRecord?.id, meetingRecord?.meetingId) ??
      undefined,
    feedbackLink: pickString(record.feedbacklink, record.feedbackLink) ?? undefined,
    proposedHourlyRate: pickNumber(record.proposedHourlyRate) || 0,
    status: pickString(record.status, record.sessionStatus)?.toUpperCase() ?? 'SCHEDULED',
    tag: pickString(record.tag) ?? undefined,
  }
}

const mapProgram = (rawProgram: unknown, index: number): DashboardProgram | null => {
  const record = asObject(rawProgram)

  if (!record) {
    return null
  }

  const progressRecord = asObject(record.progress)
  const assignedTopics = Array.isArray(record.assignedTopics)
    ? record.assignedTopics
    : []
  const firstAssignedTopic = asObject(assignedTopics[0])
  const programId =
    pickString(record.id, record.programId, record.reference) ?? `program-${index + 1}`
  const completedSessions = pickNumber(
    record.completedSessions,
    record.sessionsCompleted,
    progressRecord?.completed,
    record.totalAssignedTopics,
    assignedTopics,
  )
  const totalSessions = pickNumber(
    record.totalSessions,
    record.numberOfSessions,
    record.sessions,
    progressRecord?.total,
  )

  return {
    id: programId,
    title:
      pickString(record.title, record.programTitle, record.name) ?? 'Untitled Program',
    status:
      pickString(record.status, record.programStatus)?.toLowerCase() ??
      (record.isPublished === true ? 'published' : 'active'),
    focusArea:
      pickString(
        record.focusArea,
        record.category,
        record.sector,
        record.industry,
        record.tagline,
      ) ??
      'General',
    menteeCount: pickNumber(
      record.menteeCount,
      record.menteesCount,
      record.participantCount,
      record.participants,
      record.enrolled,
    ),
    completedSessions,
    totalSessions,
    assignedTopicsCount: pickNumber(record.totalAssignedTopics, assignedTopics),
    firstAssignedTopicTitle:
      pickString(
        firstAssignedTopic?.topicTitle,
        firstAssignedTopic?.title,
        firstAssignedTopic?.topicName,
      ) ?? undefined,
    firstAssignedTopicModule:
      pickString(firstAssignedTopic?.moduleTitle, firstAssignedTopic?.moduleName) ??
      undefined,
    firstAssignedTopicRate: pickNumber(firstAssignedTopic?.proposedHourlyRate) || 0,
    nextSession:
      pickString(
        record.nextSession,
        record.nextSessionDate,
        record.upcomingSessionDate,
        record.startDate,
        asObject(record.upcomingSession)?.scheduledAt,
      ) ?? null,
  }
}

const mapAssignment = (
  rawAssignment: unknown,
  index: number,
): PendingTopicAssignment | null => {
  const record = asObject(rawAssignment)

  if (!record) {
    return null
  }

  const programRecord = asObject(record.program)
  const topicRecord = asObject(record.topic)
  const moduleRecord = asObject(topicRecord?.module)
  const nestedProgramRecord = asObject(moduleRecord?.program)
  const trainerRecord = asObject(record.trainer)
  const events = Array.isArray(record.events) ? record.events : []
  const firstEvent = asObject(events[0])
  const eventActor = asObject(firstEvent?.actor)
  const assignmentId =
    pickString(record.id, record.assignmentId, record.topicAssignmentId) ??
    `assignment-${index + 1}`

  return {
    id: assignmentId,
    programId:
      pickString(
        record.programId,
        record.program_id,
        programRecord?.id,
        nestedProgramRecord?.id,
      ) ?? undefined,
    programTitle:
      pickString(
        record.programTitle,
        record.programName,
        programRecord?.title,
        programRecord?.name,
        nestedProgramRecord?.title,
        nestedProgramRecord?.name,
      ) ?? 'Untitled Program',
    topicTitle:
      pickString(
        record.topicTitle,
        record.topic_title,
        record.topicName,
        topicRecord?.topicTitle,
        topicRecord?.topic_name,
        topicRecord?.title,
        topicRecord?.name,
      ) ?? 'Untitled Topic',
    requestedBy:
      pickString(
        record.requestedBy,
        record.trainerName,
        record.assignedByName,
        trainerRecord?.name,
        eventActor?.name,
      ) ?? 'Unknown requester',
    requestedAt:
      pickString(
        record.requestedAt,
        record.assignedAt,
        record.createdAt,
        record.requestDate,
        firstEvent?.createdAt,
      ) ?? null,
    status: pickString(record.status)?.toUpperCase() ?? 'PENDING',
    proposedHourlyRate:
      pickNumber(record.proposedHourlyRate, firstEvent?.proposedHourlyRate) || 0,
    customMessage:
      pickString(record.customMessage, record.message, firstEvent?.message) ??
      undefined,
  }
}

const mapAssignmentEventRecord = (
  rawEvent: unknown,
  index: number,
): AssignmentEventRecord | null => {
  const record = asObject(rawEvent)

  if (!record) {
    return null
  }

  const actorRecord = asObject(record.actor)

  return {
    id:
      pickString(record.id, record.eventId, record.topicMentorId) ??
      `event-${index + 1}`,
    action: pickString(record.action)?.toUpperCase() ?? 'REQUEST',
    actorName:
      pickString(
        record.actorName,
        record.mentorName,
        actorRecord?.name,
        actorRecord?.fullName,
      ) ?? 'Unknown actor',
    actorEmail:
      pickString(record.actorEmail, record.mentorEmail, actorRecord?.email) ??
      undefined,
    message: pickString(record.message, record.note, record.customMessage) ?? undefined,
    proposedHourlyRate: pickNumber(record.proposedHourlyRate) || 0,
    createdAt:
      pickString(record.createdAt, record.eventDate, record.timestamp) ?? null,
  }
}

const mapPendingAssignmentDetail = (
  payload: unknown,
  fallbackAssignmentId: string,
): PendingAssignmentDetail | null => {
  const root = asObject(payload)
  const dataRecord = asObject(root?.data)
  const assignmentRecord =
    asObject(root?.assignment) ?? asObject(dataRecord?.assignment)
  const topicRecord =
    asObject(root?.topic) ??
    asObject(dataRecord?.topic) ??
    asObject(assignmentRecord?.topic)

  if (!topicRecord) {
    return null
  }

  const moduleRecord = asObject(topicRecord.module)
  const programRecord = asObject(moduleRecord?.program)
  const requestsRaw =
    (Array.isArray(root?.requests) ? root.requests : null) ??
    (Array.isArray(dataRecord?.requests) ? dataRecord?.requests : null) ??
    (assignmentRecord ? [assignmentRecord] : [])
  const timelineRaw =
    (Array.isArray(root?.timeline) ? root.timeline : null) ??
    (Array.isArray(dataRecord?.timeline) ? dataRecord?.timeline : null) ??
    (Array.isArray(assignmentRecord?.events) ? assignmentRecord?.events : [])

  const requests = requestsRaw
    .map((rawRequest, index) => {
      const requestRecord = asObject(rawRequest)

      if (!requestRecord) {
        return null
      }

      const mentorRecord = asObject(requestRecord.mentor)
      const eventsRaw = Array.isArray(requestRecord.events)
        ? requestRecord.events
        : []
      const mappedEvents = eventsRaw
        .map((rawEvent, eventIndex) =>
          mapAssignmentEventRecord(rawEvent, eventIndex),
        )
        .filter((event): event is AssignmentEventRecord => Boolean(event))

      return {
        id:
          pickString(requestRecord.id, requestRecord.assignmentId) ??
          `request-${index + 1}`,
        mentorName:
          pickString(mentorRecord?.name, requestRecord.mentorName) ??
          'Unknown mentor',
        mentorEmail:
          pickString(mentorRecord?.email, requestRecord.mentorEmail) ?? undefined,
        status: pickString(requestRecord.status)?.toUpperCase() ?? 'PENDING',
        proposedHourlyRate: pickNumber(requestRecord.proposedHourlyRate) || 0,
        customMessage:
          pickString(requestRecord.customMessage, requestRecord.message) ?? undefined,
        rejectionMessage:
          pickString(requestRecord.rejectionMessage) ?? undefined,
        respondedAt: pickString(requestRecord.respondedAt) ?? null,
        createdAt: pickString(requestRecord.createdAt) ?? null,
        events: mappedEvents,
      } satisfies AssignmentRequestRecord
    })
    .filter((request): request is AssignmentRequestRecord => Boolean(request))

  const timeline = timelineRaw
    .map((rawEvent, index) => mapAssignmentEventRecord(rawEvent, index))
    .filter((event): event is AssignmentEventRecord => Boolean(event))

  return {
    assignmentId:
      pickString(
        root?.assignmentId,
        dataRecord?.assignmentId,
        assignmentRecord?.id,
        fallbackAssignmentId,
      ) ??
      fallbackAssignmentId,
    totalRequests: pickNumber(
      root?.totalRequests,
      dataRecord?.totalRequests,
      requests,
    ),
    topic: {
      topicId:
        pickString(topicRecord.id, topicRecord.topicId, fallbackAssignmentId) ??
        fallbackAssignmentId,
      title:
        pickString(topicRecord.topicTitle, topicRecord.title) ?? 'Untitled Topic',
      type: pickString(topicRecord.topicType, topicRecord.type) ?? undefined,
      description:
        pickString(topicRecord.topicDescription, topicRecord.description) ?? undefined,
      durationMinutes: pickNumber(topicRecord.duration, topicRecord.topicDuration),
      moduleTitle:
        pickString(moduleRecord?.moduleTitle, moduleRecord?.title) ?? undefined,
      programTitle:
        pickString(programRecord?.title, topicRecord.programTitle) ?? undefined,
    },
    requests,
    timeline,
  }
}

const formatDateTime = (value: string | null) => {
  if (!value) {
    return 'TBD'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleString()
}

const formatDuration = (minutes: number) => {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return 'TBD'
  }

  return `${Math.round(minutes)} minutes`
}

export default function MentorDashboardPage() {
  const { toast } = useToast()
  const [mentorId, setMentorId] = useState<string | null>(null)
  const [isMentorResolved, setIsMentorResolved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<DashboardSession[]>([])
  const [programs, setPrograms] = useState<DashboardProgram[]>([])
  const [pendingAssignments, setPendingAssignments] = useState<
    PendingTopicAssignment[]
  >([])
  const [selectedAssignment, setSelectedAssignment] =
    useState<PendingTopicAssignment | null>(null)
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)
  const [isAssignmentDetailLoading, setIsAssignmentDetailLoading] =
    useState(false)
  const [assignmentDetailError, setAssignmentDetailError] = useState<
    string | null
  >(null)
  const [assignmentDetail, setAssignmentDetail] =
    useState<PendingAssignmentDetail | null>(null)
  const [decisionReason, setDecisionReason] = useState('')
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false)

  const fetchDashboardData = useCallback(async () => {
    if (!mentorId) {
      setError('Unable to resolve mentor ID. Please sign in again.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [sessionsResult, programsResult, assignmentsResult] =
        await Promise.allSettled([
          mentorApi.getMentorSessions<unknown>(mentorId),
          mentorApi.getMentorPrograms<unknown>(mentorId),
          mentorApi.getMentorTopicAssignments<unknown>(mentorId, {
            status: 'PENDING',
          }),
        ])

      if (
        sessionsResult.status === 'rejected' &&
        programsResult.status === 'rejected' &&
        assignmentsResult.status === 'rejected'
      ) {
        throw sessionsResult.reason
      }

      if (sessionsResult.status === 'fulfilled') {
        const mappedSessions = extractArrayFromPayload(sessionsResult.value, [
          'sessions',
        ])
          .map((session, index) => mapSession(session, index))
          .filter((session): session is DashboardSession => Boolean(session))

        setSessions(mappedSessions)
      }

      if (programsResult.status === 'fulfilled') {
        const mappedPrograms = extractArrayFromPayload(programsResult.value, [
          'programs',
        ])
          .map((program, index) => mapProgram(program, index))
          .filter((program): program is DashboardProgram => Boolean(program))

        setPrograms(mappedPrograms)
      }

      if (assignmentsResult.status === 'fulfilled') {
        const mappedAssignments = extractArrayFromPayload(
          assignmentsResult.value,
          ['topicAssignments', 'assignments'],
        )
          .map((assignment, index) => mapAssignment(assignment, index))
          .filter(
            (assignment): assignment is PendingTopicAssignment =>
              Boolean(assignment),
          )

        setPendingAssignments(mappedAssignments)
      }
    } catch (fetchError) {
      const message =
        fetchError instanceof ApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : 'Unable to load mentor dashboard.'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [mentorId])

  const loadAssignmentDetail = useCallback(
    async (assignment: PendingTopicAssignment) => {
      if (!mentorId) {
        setAssignmentDetailError(
          'Unable to resolve mentor ID. Please sign in again.',
        )
        return
      }

      setIsAssignmentDetailLoading(true)
      setAssignmentDetailError(null)

      try {
        const response = await mentorApi.getMentorTopicAssignmentById<unknown>(
          mentorId,
          assignment.id,
        )
        const mappedDetail = mapPendingAssignmentDetail(response, assignment.id)

        if (!mappedDetail) {
          throw new Error('Unable to load assignment details.')
        }

        setAssignmentDetail(mappedDetail)
      } catch (fetchError) {
        const message =
          fetchError instanceof ApiError
            ? fetchError.message
            : fetchError instanceof Error
              ? fetchError.message
              : 'Unable to load assignment details.'

        setAssignmentDetail(null)
        setAssignmentDetailError(message)
      } finally {
        setIsAssignmentDetailLoading(false)
      }
    },
    [mentorId],
  )

  const openAssignmentModal = useCallback(
    (assignment: PendingTopicAssignment) => {
      setSelectedAssignment(assignment)
      setDecisionReason('')
      setAssignmentDetail(null)
      setAssignmentDetailError(null)
      setIsAssignmentModalOpen(true)
      void loadAssignmentDetail(assignment)
    },
    [loadAssignmentDetail],
  )

  const submitAssignmentDecision = useCallback(
    async (decision: 'APPROVED' | 'REJECTED') => {
      if (!selectedAssignment) {
        toast({
          variant: 'destructive',
          title: 'Unable to submit decision',
          description: 'Assignment context is missing.',
        })
        return
      }

      const reason = decisionReason.trim()

      if (!reason) {
        toast({
          variant: 'destructive',
          title: 'Reason required',
          description:
            'Please provide a reason before approving or rejecting this request.',
        })
        return
      }

      setIsSubmittingDecision(true)

      try {
        await mentorApi.respondToMentorTopicAssignment(selectedAssignment.id, {
          decision,
          message: reason,
        })

        toast({
          title:
            decision === 'APPROVED'
              ? 'Request approved'
              : 'Request rejected',
          description: 'Your response has been sent successfully.',
        })

        setPendingAssignments((previousAssignments) =>
          previousAssignments.filter(
            (assignment) => assignment.id !== selectedAssignment.id,
          ),
        )
        setIsAssignmentModalOpen(false)
        setSelectedAssignment(null)
        setDecisionReason('')
        setAssignmentDetail(null)
        void fetchDashboardData()
      } catch (submitError) {
        const message =
          submitError instanceof ApiError
            ? submitError.message
            : submitError instanceof Error
              ? submitError.message
              : 'Unable to submit assignment decision.'

        toast({
          variant: 'destructive',
          title: 'Decision failed',
          description: message,
        })
      } finally {
        setIsSubmittingDecision(false)
      }
    },
    [
      decisionReason,
      fetchDashboardData,
      selectedAssignment,
      toast,
    ],
  )

  useEffect(() => {
    setMentorId(resolveMentorId())
    setIsMentorResolved(true)
  }, [])

  useEffect(() => {
    if (!isMentorResolved) {
      return
    }

    if (!mentorId) {
      setError('Unable to resolve mentor ID. Please sign in again.')
      setIsLoading(false)
      return
    }

    void fetchDashboardData()
  }, [fetchDashboardData, isMentorResolved, mentorId])

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const first = new Date(a.scheduledAt).getTime()
      const second = new Date(b.scheduledAt).getTime()

      if (Number.isNaN(first) || Number.isNaN(second)) {
        return 0
      }

      return first - second
    })
  }, [sessions])

  return (
    <div className='w-full'>
      <DashboardHeader
        title='Welcome back'
        description='Manage your assigned programs and upcoming sessions'
      />

      <div className='w-full pt-2 space-y-6 md:px-6 md:pt-8 md:pb-8'>
        {error ? (
          <Card className='border-destructive/40 bg-destructive/5'>
            <CardContent className='p-4 flex items-start justify-between gap-3'>
              <div className='flex items-start gap-2'>
                <AlertCircle className='h-4 w-4 text-destructive mt-0.5' />
                <p className='text-sm text-destructive'>{error}</p>
              </div>
              <Button
                size='sm'
                variant='outline'
                onClick={() => {
                  void fetchDashboardData()
                }}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader className='p-4 sm:p-6 pb-2 sm:pb-3'>
            <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
              <Calendar className='h-4 w-4 sm:h-5 sm:w-5' />
              Your Upcoming Sessions
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              Next sessions scheduled for your assigned topics
            </CardDescription>
          </CardHeader>
          <CardContent className='p-4 sm:p-6 pt-0'>
            {isLoading ? (
              <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                Loading sessions...
              </div>
            ) : sortedSessions.length === 0 ? (
              <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                No upcoming sessions found.
              </div>
            ) : (
              <div className='space-y-3'>
                {sortedSessions.map((session) => (
                  <div
                    key={session.id}
                    className='flex flex-col md:flex-row md:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3'
                  >
                    <div className='flex-1 min-w-0'>
                      <div className='flex flex-wrap items-center gap-2 mb-1'>
                        <h4 className='font-medium text-sm sm:text-base'>
                          {session.programTitle}
                        </h4>
                        <Badge variant='outline' className='text-xs'>
                          {session.topicTitle}
                        </Badge>
                        {session.moduleTitle ? (
                          <Badge variant='secondary' className='text-xs'>
                            {session.moduleTitle}
                          </Badge>
                        ) : null}
                        {session.tag ? (
                          <Badge variant='secondary' className='text-xs'>
                            {session.tag}
                          </Badge>
                        ) : null}
                      </div>
                      <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs sm:text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Clock className='h-4 w-4' />
                          {formatDateTime(session.scheduledAt)} (
                          {formatDuration(session.durationMinutes)})
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='h-4 w-4' />
                          {session.menteeCount} mentees
                        </div>
                        {session.proposedHourlyRate ? (
                          <div className='text-xs sm:text-sm'>
                            ₦{session.proposedHourlyRate.toLocaleString()}/hr
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className='flex items-center gap-2 shrink-0'>
                      {session.meetingId ? (
                        <p className='text-xs text-muted-foreground hidden sm:block'>
                          ID: {session.meetingId}
                        </p>
                      ) : null}
                      {session.status ? (
                        <Badge variant='outline' className='text-xs uppercase'>
                          {session.status}
                        </Badge>
                      ) : null}
                      <Button
                        size='sm'
                        onClick={() => {
                          const actionLink =
                            session.meetingLink ?? session.feedbackLink

                          if (actionLink) {
                            window.open(
                              actionLink,
                              '_blank',
                              'noopener,noreferrer',
                            )
                          }
                        }}
                        disabled={!session.meetingLink && !session.feedbackLink}
                        className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
                      >
                        {session.meetingLink ? 'Join Meeting' : 'Open Feedback'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='p-4 sm:p-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
                  <Target className='h-4 w-4 sm:h-5 sm:w-5' />
                  Active Programs
                </CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  Programs you are currently assigned to teach
                </CardDescription>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='outline' size='sm' asChild>
                  <Link href='/programs?view=mentor'>Explore Programs</Link>
                </Button>
                <Button variant='outline' size='sm' asChild>
                  <Link href='/mentor/dashboard/programs'>View More</Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-4 sm:p-6 pt-0'>
            {isLoading ? (
              <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                Loading active programs...
              </div>
            ) : programs.length === 0 ? (
              <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                No active programs found.
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                {programs.map((program) => {
                  const progressValue =
                    program.totalSessions > 0
                      ? Math.min(
                          100,
                          Math.max(
                            0,
                            (program.completedSessions / program.totalSessions) *
                              100,
                          ),
                        )
                      : 0

                  return (
                    <Card key={program.id} className='border'>
                      <CardHeader className='p-4 sm:p-6 pb-2 sm:pb-3'>
                        <div className='flex justify-between items-start gap-2'>
                          <div className='min-w-0 flex-1'>
                            <CardTitle className='text-base sm:text-lg leading-tight'>
                              {program.title}
                            </CardTitle>
                            <CardDescription className='text-xs sm:text-sm'>
                              {program.focusArea}
                            </CardDescription>
                          </div>
                          <Badge className='bg-[#FFD500] text-black shrink-0'>
                            {program.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className='p-4 sm:p-6 pt-0 space-y-3'>
                        <div className='grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm'>
                          <div>
                            <p className='text-muted-foreground'>Mentees</p>
                            <p className='font-medium'>{program.menteeCount}</p>
                          </div>
                          <div>
                            <p className='text-muted-foreground'>Assigned Topics</p>
                            <p className='font-medium'>
                              {program.assignedTopicsCount}
                            </p>
                          </div>
                        </div>
                        {program.firstAssignedTopicTitle ? (
                          <div className='rounded-md border p-2'>
                            <p className='text-xs text-muted-foreground'>
                              Latest assigned topic
                            </p>
                            <p className='text-sm font-medium'>
                              {program.firstAssignedTopicTitle}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              {program.firstAssignedTopicModule
                                ? `${program.firstAssignedTopicModule} module`
                                : 'Module not specified'}
                              {program.firstAssignedTopicRate
                                ? ` • ₦${program.firstAssignedTopicRate.toLocaleString()}/hr`
                                : ''}
                            </p>
                          </div>
                        ) : null}
                        <div>
                          <div className='flex justify-between text-sm mb-1'>
                            <span className='text-muted-foreground'>Progress</span>
                            <span className='font-medium'>
                              {Math.round(progressValue)}%
                            </span>
                          </div>
                          <Progress value={progressValue} />
                        </div>
                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2'>
                          <div className='min-w-0'>
                            <p className='text-xs text-muted-foreground'>
                              Next Session
                            </p>
                            <p className='text-xs sm:text-sm font-medium truncate'>
                              {formatDateTime(program.nextSession)}
                            </p>
                          </div>
                          <Button size='sm' variant='outline' asChild>
                            <Link
                              href={`/mentor/dashboard/programs/${encodeURIComponent(
                                program.id,
                              )}`}
                            >
                              View Program
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='p-4 sm:p-6 pb-2 sm:pb-3'>
            <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
              <AlertCircle className='h-4 w-4 sm:h-5 sm:w-5' />
              Pending Approval Requests
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              Topic assignment requests awaiting your response
            </CardDescription>
          </CardHeader>
          <CardContent className='p-4 sm:p-6 pt-0'>
            {isLoading ? (
              <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                Loading pending requests...
              </div>
            ) : pendingAssignments.length === 0 ? (
              <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                No pending approval requests.
              </div>
            ) : (
              <div className='space-y-3'>
                {pendingAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className='flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3'
                  >
                    <div className='space-y-1'>
                      <p className='text-sm font-medium'>{assignment.topicTitle}</p>
                      <p className='text-xs text-muted-foreground'>
                        Program: {assignment.programTitle}
                      </p>
                      {assignment.proposedHourlyRate ? (
                        <p className='text-xs text-muted-foreground'>
                          Proposed hourly rate: ₦
                          {assignment.proposedHourlyRate.toLocaleString()}
                        </p>
                      ) : null}
                      {assignment.customMessage ? (
                        <p className='text-xs text-muted-foreground'>
                          Message: {assignment.customMessage}
                        </p>
                      ) : null}
                      <p className='text-xs text-muted-foreground'>
                        Requested by {assignment.requestedBy} on{' '}
                        {formatDateTime(assignment.requestedAt)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2 mt-2 sm:mt-0'>
                      <Badge variant='secondary'>{assignment.status}</Badge>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => {
                          openAssignmentModal(assignment)
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isAssignmentModalOpen}
        onOpenChange={(isOpen) => {
          if (isSubmittingDecision) {
            return
          }

          setIsAssignmentModalOpen(isOpen)

          if (!isOpen) {
            setSelectedAssignment(null)
            setDecisionReason('')
            setAssignmentDetail(null)
            setAssignmentDetailError(null)
          }
        }}
      >
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Pending Assignment Decision</DialogTitle>
            <DialogDescription>
              Review assignment details and submit your approval decision.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {isAssignmentDetailLoading ? (
              <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                Loading assignment details...
              </div>
            ) : null}

            {assignmentDetailError ? (
              <div className='rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive'>
                {assignmentDetailError}
              </div>
            ) : null}

            {assignmentDetail ? (
              <div className='space-y-4'>
                <div className='rounded-lg border p-3'>
                  <p className='text-xs text-muted-foreground'>Program</p>
                  <p className='text-sm font-medium'>
                    {assignmentDetail.topic.programTitle ??
                      selectedAssignment?.programTitle ??
                      'Untitled Program'}
                  </p>
                  <p className='text-xs text-muted-foreground mt-2'>Topic</p>
                  <p className='text-sm font-medium'>{assignmentDetail.topic.title}</p>
                  <p className='text-xs text-muted-foreground'>
                    {assignmentDetail.topic.moduleTitle ?? 'Module not specified'}
                    {assignmentDetail.topic.type
                      ? ` • ${assignmentDetail.topic.type}`
                      : ''}
                    {assignmentDetail.topic.durationMinutes > 0
                      ? ` • ${assignmentDetail.topic.durationMinutes} minutes`
                      : ''}
                  </p>
                  {assignmentDetail.topic.description ? (
                    <p className='text-xs text-muted-foreground mt-2'>
                      {assignmentDetail.topic.description}
                    </p>
                  ) : null}
                </div>

                <div className='rounded-lg border p-3 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium'>Requests</p>
                    <Badge variant='outline'>
                      {assignmentDetail.totalRequests} total
                    </Badge>
                  </div>
                  {assignmentDetail.requests.length === 0 ? (
                    <p className='text-xs text-muted-foreground'>
                      No request records found.
                    </p>
                  ) : (
                    <div className='space-y-2'>
                      {assignmentDetail.requests.map((request) => (
                        <div key={request.id} className='rounded-md border p-2'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <p className='text-sm font-medium'>{request.mentorName}</p>
                            <Badge variant='secondary'>{request.status}</Badge>
                            {request.proposedHourlyRate ? (
                              <span className='text-xs text-muted-foreground'>
                                ₦{request.proposedHourlyRate.toLocaleString()}/hr
                              </span>
                            ) : null}
                          </div>
                          {request.customMessage ? (
                            <p className='text-xs text-muted-foreground mt-1'>
                              Message: {request.customMessage}
                            </p>
                          ) : null}
                          {request.rejectionMessage ? (
                            <p className='text-xs text-destructive mt-1'>
                              Rejection reason: {request.rejectionMessage}
                            </p>
                          ) : null}
                          <p className='text-xs text-muted-foreground mt-1'>
                            Created: {formatDateTime(request.createdAt)}
                            {' • '}
                            Responded: {formatDateTime(request.respondedAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className='rounded-lg border p-3 space-y-2'>
                  <p className='text-sm font-medium'>Timeline</p>
                  {assignmentDetail.timeline.length === 0 ? (
                    <p className='text-xs text-muted-foreground'>
                      No timeline events available.
                    </p>
                  ) : (
                    <div className='space-y-2'>
                      {assignmentDetail.timeline.map((event) => (
                        <div
                          key={event.id}
                          className='rounded-md border p-2 flex flex-col gap-1'
                        >
                          <div className='flex flex-wrap items-center gap-2'>
                            <Badge variant='outline'>{event.action}</Badge>
                            <span className='text-xs text-muted-foreground'>
                              {event.actorName}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {formatDateTime(event.createdAt)}
                            </span>
                          </div>
                          {event.message ? (
                            <p className='text-xs text-muted-foreground'>
                              {event.message}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className='space-y-2'>
              <p className='text-sm font-medium'>Decision Reason</p>
              <Textarea
                value={decisionReason}
                onChange={(event) => setDecisionReason(event.target.value)}
                placeholder='Provide your reason for approval or rejection'
                rows={3}
                disabled={isSubmittingDecision}
              />
              <p className='text-xs text-muted-foreground'>
                A reason is required for both approval and rejection.
              </p>
            </div>

            <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => {
                  setIsAssignmentModalOpen(false)
                }}
                disabled={isSubmittingDecision}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={() => {
                  void submitAssignmentDecision('REJECTED')
                }}
                disabled={isSubmittingDecision || isAssignmentDetailLoading}
              >
                {isSubmittingDecision ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <XCircle className='h-4 w-4 mr-2' />
                )}
                Reject
              </Button>
              <Button
                className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
                onClick={() => {
                  void submitAssignmentDecision('APPROVED')
                }}
                disabled={isSubmittingDecision || isAssignmentDetailLoading}
              >
                {isSubmittingDecision ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <CheckCircle2 className='h-4 w-4 mr-2' />
                )}
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
