'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Play,
  Star,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardHeader } from '@/components/dashboard-header'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApiError, apiClient } from '@/lib/api-client'

type TopicStatus = 'completed' | 'active' | 'upcoming'

type ProgramTopicViewModel = {
  id: string
  title: string
  description: string
  status: TopicStatus
  durationLabel: string
  mentorName: string
  type: string
  moduleTitle: string
  format: string
  joinLink: string | null
  feedbackLink: string | null
  surveySlug: string | null
}

type ProgramDetailsViewModel = {
  id: string
  title: string
  description: string
  focusArea: string
  progress: number
  totalTopics: number
  completedTopics: number
  nextSession: string
  format: string
  canUseFeedback: boolean
  topics: ProgramTopicViewModel[]
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
      const parsedValue = Number(value)

      if (!Number.isNaN(parsedValue)) {
        return parsedValue
      }
    }

    if (Array.isArray(value)) {
      return value.length
    }
  }

  return null
}

const normalizeStatus = (value: string | null): TopicStatus => {
  const normalized = (value ?? '').toLowerCase()

  if (
    normalized.includes('complete') ||
    normalized.includes('done') ||
    normalized.includes('approved')
  ) {
    return 'completed'
  }

  if (
    normalized.includes('active') ||
    normalized.includes('progress') ||
    normalized.includes('ongoing')
  ) {
    return 'active'
  }

  return 'upcoming'
}

const formatNextSession = (value: string | null) => {
  if (!value) {
    return 'Schedule pending'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleString()
}

const isJoinableFormat = (format: string) => {
  const normalized = format.toLowerCase()
  return normalized.includes('online') || normalized.includes('hybrid')
}

const extractSurveySlug = (value: string | null) => {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return null
  }

  const fromPath = (pathValue: string) => {
    const segments = pathValue
      .split('/')
      .map((segment) => segment.trim())
      .filter(Boolean)
    const surveysIndex = segments.findIndex((segment) => {
      const normalizedSegment = segment.toLowerCase()
      return normalizedSegment === 'surveys' || normalizedSegment === 'survey'
    })

    if (surveysIndex < 0 || surveysIndex + 1 >= segments.length) {
      return null
    }

    try {
      return decodeURIComponent(segments[surveysIndex + 1])
    } catch {
      return segments[surveysIndex + 1]
    }
  }

  if (trimmed.includes('/surveys/') || trimmed.includes('/survey/')) {
    const parsedFromRaw = fromPath(trimmed)

    if (parsedFromRaw) {
      return parsedFromRaw
    }
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsedUrl = new URL(trimmed)
      const parsedFromUrl = fromPath(parsedUrl.pathname)

      if (parsedFromUrl) {
        return parsedFromUrl
      }
    } catch {
      // Fallback handled below.
    }
  }

  try {
    return decodeURIComponent(trimmed)
  } catch {
    return trimmed
  }
}

const mapProgramDetailsResponse = (
  payload: unknown,
  fallbackProgramId: string,
): ProgramDetailsViewModel => {
  const root = asObject(payload)
  const dataRecord = asObject(root?.data)
  const enrollmentRecord =
    asObject(root?.enrollment) ??
    asObject(dataRecord?.enrollment) ??
    null
  const programRecord =
    asObject(enrollmentRecord?.program) ??
    asObject(root?.program) ??
    asObject(dataRecord?.program) ??
    dataRecord ??
    root ??
    null

  if (!programRecord) {
    throw new Error('Program details payload is missing program data.')
  }

  const programId =
    pickString(programRecord.id, programRecord.programId, fallbackProgramId) ??
    fallbackProgramId
  const programTitle = pickString(programRecord.title, programRecord.programTitle)

  if (!programTitle) {
    throw new Error('Program details payload is missing title.')
  }

  const programFormat =
    pickString(programRecord.format, programRecord.deliveryMode) ?? 'Online'

  const mentorAssignments = Array.isArray(programRecord.mentorAssignments)
    ? programRecord.mentorAssignments
    : []
  const curriculum = Array.isArray(programRecord.curriculum)
    ? programRecord.curriculum
    : []

  const topics: ProgramTopicViewModel[] = []

  curriculum.forEach((moduleItem, moduleIndex) => {
    const moduleRecord = asObject(moduleItem)

    if (!moduleRecord) {
      return
    }

    const moduleTitle =
      pickString(moduleRecord.title, moduleRecord.name) ??
      `Module ${moduleIndex + 1}`
    const moduleTopics = Array.isArray(moduleRecord.topics) ? moduleRecord.topics : []

    moduleTopics.forEach((topicItem, topicIndex) => {
      const topicRecord = asObject(topicItem)

      if (!topicRecord) {
        return
      }

      const topicId =
        pickString(
          topicRecord.id,
          topicRecord.topicId,
          `${moduleIndex + 1}-${topicIndex + 1}`,
        ) ?? `${moduleIndex + 1}-${topicIndex + 1}`
      const topicTitle =
        pickString(topicRecord.title, topicRecord.name) ??
        `Topic ${topicIndex + 1}`
      const normalizedTopicTitle = topicTitle.toLowerCase().trim()
      const assignmentRecord =
        mentorAssignments.find((assignment) => {
          const assignmentRecord = asObject(assignment)

          if (!assignmentRecord) {
            return false
          }

          const assignmentTopicId = pickString(
            assignmentRecord.topicId,
            asObject(assignmentRecord.topic)?.id,
            assignmentRecord.id,
          )
          const assignmentTopicTitle = pickString(
            assignmentRecord.topicTitle,
            asObject(assignmentRecord.topic)?.title,
            assignmentRecord.title,
          )
          const normalizedAssignmentTopicTitle =
            (assignmentTopicTitle ?? '').toLowerCase().trim()
          const topicIdAsNumber = Number(topicId)
          const assignmentTopicIdAsNumber = Number(assignmentTopicId)
          const idMatches =
            assignmentTopicId === topicId ||
            (!Number.isNaN(topicIdAsNumber) &&
              !Number.isNaN(assignmentTopicIdAsNumber) &&
              assignmentTopicIdAsNumber === topicIdAsNumber)

          return (
            idMatches ||
            normalizedAssignmentTopicTitle === normalizedTopicTitle
          )
        }) ?? null
      const assignment = asObject(assignmentRecord)
      const assignmentMentor = asObject(assignment?.mentor)
      const firstMentor =
        asObject(Array.isArray(topicRecord.mentors) ? topicRecord.mentors[0] : null) ??
        null

      const topicFormat =
        pickString(
          topicRecord.format,
          topicRecord.mode,
          topicRecord.deliveryMode,
          moduleRecord.format,
          programFormat,
        ) ?? programFormat
      const topicStatus = normalizeStatus(
        pickString(topicRecord.status, assignment?.status),
      )
      const durationValue =
        pickNumber(topicRecord.duration, topicRecord.durationHours) ?? 0
      const feedbackLink =
        pickString(
          assignment?.feedbacklink,
          assignment?.feedbackLink,
          assignment?.feedback_link,
          assignment?.surveyLink,
          assignment?.surveylink,
          assignment?.survey_link,
          assignment?.formLink,
          assignment?.formlink,
          assignment?.form_link,
          assignment?.googleFormLink,
          assignment?.questionnaireLink,
          asObject(assignment?.topic)?.feedbackLink,
          asObject(assignment?.topic)?.feedbacklink,
          asObject(assignment?.topic)?.surveyLink,
          asObject(assignment?.topic)?.surveylink,
          topicRecord.feedbacklink,
          topicRecord.feedbackLink,
          topicRecord.feedback_link,
          topicRecord.surveyLink,
          topicRecord.surveylink,
          topicRecord.survey_link,
          topicRecord.formLink,
          topicRecord.formlink,
          topicRecord.form_link,
          topicRecord.googleFormLink,
          topicRecord.questionnaireLink,
        ) ?? null

      topics.push({
        id: topicId,
        title: topicTitle,
        description:
          pickString(topicRecord.description, topicRecord.summary) ??
          'No description provided.',
        status: topicStatus,
        durationLabel:
          durationValue > 0 ? `${durationValue} hour(s)` : 'Duration pending',
        mentorName:
          pickString(
            assignmentMentor?.name,
            firstMentor?.name,
            firstMentor?.fullName,
          ) ?? 'Mentor to be assigned',
        type: pickString(topicRecord.type) ?? 'SESSION',
        moduleTitle,
        format: topicFormat,
        joinLink:
          pickString(
            topicRecord.joinUrl,
            topicRecord.meetingLink,
            topicRecord.meetingUrl,
            topicRecord.sessionLink,
            topicRecord.zoomLink,
            topicRecord.googleMeetLink,
            assignment?.joinUrl,
            assignment?.meetingLink,
            assignment?.sessionLink,
          ) ?? null,
        feedbackLink,
        surveySlug: extractSurveySlug(feedbackLink),
      })
    })
  })

  const totalTopics =
    pickNumber(
      enrollmentRecord?.totalTopics,
      enrollmentRecord?.total_topics,
      programRecord.numberOfSessions,
      topics,
    ) ?? topics.length
  const completedTopicsFromStatus = topics.filter(
    (topic) => topic.status === 'completed',
  ).length
  const completedTopics =
    pickNumber(
      enrollmentRecord?.completedTopics,
      enrollmentRecord?.completed_topics,
      enrollmentRecord?.completedSessions,
      completedTopicsFromStatus,
    ) ?? completedTopicsFromStatus
  const explicitProgress = pickNumber(
    enrollmentRecord?.progress,
    enrollmentRecord?.completionPercent,
    enrollmentRecord?.completionRate,
  )
  const enrollmentStatus = pickString(
    enrollmentRecord?.status,
    enrollmentRecord?.enrollmentStatus,
  )
  const canUseFeedback =
    Boolean(enrollmentRecord) &&
    !['cancelled', 'rejected', 'failed'].includes(
      (enrollmentStatus ?? '').toLowerCase(),
    )
  const computedProgress =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  return {
    id: programId,
    title: programTitle,
    description:
      pickString(programRecord.description, programRecord.tagline) ??
      'Program details not available.',
    focusArea:
      pickString(programRecord.category, programRecord.industry) ?? 'General',
    progress: Math.max(0, Math.min(100, Math.round(explicitProgress ?? computedProgress))),
    totalTopics,
    completedTopics,
    nextSession: formatNextSession(
      pickString(
        enrollmentRecord?.nextSessionDate,
        enrollmentRecord?.nextSession,
        programRecord.startDate,
      ),
    ),
    format: programFormat,
    canUseFeedback,
    topics,
  }
}

function TopicDetailPanel({
  canUseFeedback,
  topic,
  topicIndex,
}: {
  canUseFeedback: boolean
  topic: ProgramTopicViewModel
  topicIndex: number
}) {
  const canJoin = isJoinableFormat(topic.format)

  return (
    <Card className='bg-gray-50/80 border border-gray-200'>
      <CardHeader className='p-4 pb-2 sm:p-6 sm:pb-6'>
        <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
          <span className='w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-semibold shrink-0'>
            {topicIndex + 1}
          </span>
          {topic.title}
        </CardTitle>
        <CardDescription className='text-sm'>{topic.description}</CardDescription>
      </CardHeader>
      <CardContent className='p-4 pt-0 sm:p-6 sm:pt-0'>
        <Tabs defaultValue='sessions' className='w-full'>
          <TabsList className='grid w-full grid-cols-3 h-9'>
            <TabsTrigger value='sessions' className='text-xs sm:text-sm'>
              Sessions
            </TabsTrigger>
            <TabsTrigger value='overview' className='text-xs sm:text-sm'>
              Overview
            </TabsTrigger>
            <TabsTrigger value='feedback' className='text-xs sm:text-sm'>
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value='sessions' className='space-y-4 mt-3'>
            <Card>
              <CardHeader className='pb-2 p-4 sm:pb-3 sm:p-6'>
                <div className='flex justify-between items-start gap-2'>
                  <div className='min-w-0'>
                    <CardTitle className='text-sm sm:text-base'>{topic.title}</CardTitle>
                    <CardDescription className='text-xs sm:text-sm'>
                      {topic.durationLabel} • {topic.format}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={topic.status === 'completed' ? 'default' : 'secondary'}
                    className='text-xs shrink-0'
                  >
                    {topic.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-3 p-4 pt-0 sm:p-6 sm:pt-0'>
                {canJoin ? (
                  topic.joinLink ? (
                    <Button className='w-full bg-[#FFD500] text-black hover:bg-[#e6c000] text-sm' asChild>
                      <a href={topic.joinLink} target='_blank' rel='noopener noreferrer'>
                        <Video className='mr-2 h-4 w-4' />
                        Join Meeting
                      </a>
                    </Button>
                  ) : (
                    <>
                      <Button className='w-full text-sm' disabled>
                        <Video className='mr-2 h-4 w-4' />
                        Join Meeting (Unavailable)
                      </Button>
                      <div className='rounded-md border border-dashed p-3 text-xs text-muted-foreground'>
                        This session is {topic.format}. Meeting access will appear once published.
                      </div>
                    </>
                  )
                ) : (
                  <div className='rounded-md border border-dashed p-3 text-xs text-muted-foreground'>
                    Join link is only available for online/hybrid sessions.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='overview' className='space-y-4 mt-3'>
            <Card>
              <CardContent className='p-4 sm:p-6 space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Module</span>
                  <span className='font-medium'>{topic.moduleTitle}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Mentor</span>
                  <span className='font-medium'>{topic.mentorName}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Type</span>
                  <span className='font-medium'>{topic.type}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='feedback' className='space-y-4 mt-3'>
            <Card className='border-2 border-[#FFD500]'>
              <CardHeader className='pb-2 p-4 sm:pb-3 sm:p-6'>
                <CardTitle className='text-base sm:text-lg'>Feedback</CardTitle>
                <CardDescription className='text-sm'>
                  Access the assigned feedback survey for this topic.
                </CardDescription>
              </CardHeader>
              <CardContent className='p-4 pt-0 sm:p-6 sm:pt-0 space-y-4'>
                {!canUseFeedback ? (
                  <div className='rounded-md border border-dashed p-3 text-xs text-muted-foreground'>
                    Only enrolled mentees can use feedback resources for this topic.
                  </div>
                ) : topic.surveySlug ? (
                  <Button className='bg-[#FFD500] text-black hover:bg-[#e6c000]' asChild>
                    <a href={`/survey/${encodeURIComponent(topic.surveySlug)}`}>
                      Open Feedback Survey
                      <ExternalLink className='ml-2 h-4 w-4' />
                    </a>
                  </Button>
                ) : (
                  <div className='rounded-md border border-dashed p-3 text-xs text-muted-foreground'>
                    Feedback link is not available yet for this topic.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function LearnerProgramPage() {
  const params = useParams()
  const router = useRouter()
  const programId = String(params.id ?? '')

  const [program, setProgram] = useState<ProgramDetailsViewModel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadProgram = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiClient.get<unknown>(
          `/programs/${encodeURIComponent(programId)}/enrollments/me/details`,
          { cache: 'no-store' },
        )
        const mappedProgram = mapProgramDetailsResponse(response, programId)

        if (!isMounted) {
          return
        }

        setProgram(mappedProgram)
        setSelectedTopic((previous) => previous ?? mappedProgram.topics[0]?.id ?? null)
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        const message =
          loadError instanceof ApiError
            ? loadError.message
            : loadError instanceof Error
              ? loadError.message
              : 'Unable to load enrolled program details.'

        setError(message)
        setProgram(null)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (programId.length > 0) {
      void loadProgram()
    } else {
      setError('Program ID is missing.')
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [programId])

  const selectedTopicData = useMemo(() => {
    if (!program || !selectedTopic) {
      return null
    }

    const topic = program.topics.find((item) => item.id === selectedTopic) ?? null

    if (!topic) {
      return null
    }

    return {
      topic,
      topicIndex: program.topics.findIndex((item) => item.id === topic.id),
    }
  }, [program, selectedTopic])

  const getStatusColor = (status: TopicStatus) => {
    if (status === 'completed') {
      return 'bg-gray-700'
    }

    if (status === 'active') {
      return 'bg-gray-600'
    }

    return 'bg-gray-500'
  }

  const getStatusIcon = (status: TopicStatus) => {
    if (status === 'completed') {
      return <CheckCircle className='h-4 w-4 text-white' />
    }

    if (status === 'active') {
      return <Play className='h-4 w-4 text-white' />
    }

    return <Clock className='h-4 w-4 text-white' />
  }

  if (isLoading) {
    return (
      <div className='w-full md:px-6 md:pt-8 md:pb-8'>
        <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
          Loading enrolled program...
        </div>
      </div>
    )
  }

  if (!program || error) {
    return (
      <div className='w-full md:px-6 md:pt-8 md:pb-8 space-y-4'>
        <div className='rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive'>
          {error ?? 'Unable to load enrolled program.'}
        </div>
        <Button variant='outline' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6 md:px-6 md:pt-8 md:pb-8'>
      <div className='flex flex-col'>
        <div className='order-2 md:order-1'>
          <DashboardHeader
            title={program.title}
            description={`${program.completedTopics}/${program.totalTopics} topics completed`}
          />
        </div>
        <div className='order-1 md:order-2 space-y-1'>
          <button
            type='button'
            onClick={() => router.back()}
            className='text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0 font-inherit mb-2 md:mt-4'
          >
            <ArrowLeft className='h-3.5 w-3.5' /> Back
          </button>
        </div>
      </div>

      <Card className='border-none shadow-none bg-transparent'>
        <CardContent className='space-y-3 p-0'>
          <div className='flex items-center justify-between'>
            <Badge variant='secondary'>{program.focusArea}</Badge>
            <div className='text-right'>
              <div className='text-xl sm:text-2xl font-semibold text-[#FFD500]'>
                {program.progress}%
              </div>
              <p className='text-xs sm:text-sm text-gray-600 font-medium'>Overall Progress</p>
            </div>
          </div>
          <Progress value={program.progress} className='h-2' />
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Clock className='h-3.5 w-3.5' />
            Next session: {program.nextSession}
          </div>
        </CardContent>
      </Card>

      <div className='grid lg:grid-cols-3 gap-4 lg:gap-8'>
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader className='p-4 pb-2 sm:p-6 sm:pb-3'>
              <CardTitle className='text-base sm:text-lg'>Learning Path</CardTitle>
              <CardDescription className='text-sm'>
                Track your topics and open each one for sessions, details, and feedback.
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4 pt-0 space-y-4 sm:space-y-6 sm:p-6 sm:pt-0'>
              {program.topics.length === 0 ? (
                <div className='rounded-md border border-dashed p-4 text-sm text-muted-foreground'>
                  No topics are available for this enrolled program yet.
                </div>
              ) : (
                program.topics.map((topic, index) => (
                  <div key={topic.id}>
                    <div className='flex gap-3 sm:gap-4 items-stretch'>
                      <div className='flex flex-col items-center flex-shrink-0 self-stretch'>
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${getStatusColor(
                            topic.status,
                          )} flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0`}
                        >
                          {index + 1}
                        </div>
                        {index < program.topics.length - 1 ? (
                          <div className='w-0.5 flex-1 min-h-3 bg-gray-200 rounded-full mt-0.5' />
                        ) : null}
                      </div>

                      <div className='flex-1 min-w-0 flex flex-col min-h-0'>
                        <Card
                          className={`cursor-pointer transition-all hover:shadow-md flex-1 ${
                            selectedTopic === topic.id ? 'ring-2 ring-[#FFD500]' : ''
                          }`}
                          onClick={() =>
                            setSelectedTopic((previous) =>
                              previous === topic.id ? null : topic.id,
                            )
                          }
                        >
                          <CardHeader className='p-4 sm:pb-3 sm:p-6'>
                            <div className='flex justify-between items-start gap-2'>
                              <div className='min-w-0 flex-1'>
                                <CardTitle className='text-base sm:text-lg leading-tight'>
                                  {topic.title}
                                </CardTitle>
                                <CardDescription className='text-xs sm:text-sm'>
                                  {topic.description}
                                </CardDescription>
                              </div>
                              <div className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0'>
                                {getStatusIcon(topic.status)}
                                <Badge
                                  variant={
                                    topic.status === 'completed'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className='text-xs'
                                >
                                  {topic.status}
                                </Badge>
                                <span className='lg:hidden text-muted-foreground'>
                                  {selectedTopic === topic.id ? (
                                    <ChevronUp className='h-4 w-4' />
                                  ) : (
                                    <ChevronDown className='h-4 w-4' />
                                  )}
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className='p-4 pt-0 sm:p-6 sm:pt-0'>
                            <div className='flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-gray-600'>
                              <div className='flex items-center gap-3 sm:gap-4'>
                                <span className='flex items-center gap-1'>
                                  <Clock className='h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0' />
                                  {topic.durationLabel}
                                </span>
                                <span className='flex items-center gap-1'>
                                  <Users className='h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0' />
                                  {topic.mentorName}
                                </span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <Badge variant='outline' className='text-xs'>
                                  {topic.type}
                                </Badge>
                                <Badge variant='outline' className='text-xs'>
                                  {topic.format}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {selectedTopic === topic.id ? (
                      <div className='mt-4 lg:hidden w-full'>
                        <TopicDetailPanel
                          canUseFeedback={program.canUseFeedback}
                          topic={topic}
                          topicIndex={index}
                        />
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className='hidden lg:block space-y-6'>
          {selectedTopicData ? (
            <TopicDetailPanel
              canUseFeedback={program.canUseFeedback}
              topic={selectedTopicData.topic}
              topicIndex={selectedTopicData.topicIndex}
            />
          ) : (
            <Card>
              <CardContent className='text-center py-8'>
                <TrendingUp className='h-8 w-8 mx-auto mb-4 text-gray-400' />
                <p className='text-gray-500'>Select a topic to view details</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base flex items-center gap-2'>
                <BookOpen className='h-4 w-4' />
                Program Info
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-gray-600'>Delivery</span>
                <span className='font-medium'>{program.format}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-600'>Topics</span>
                <span className='font-medium'>{program.totalTopics}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-600'>Completed</span>
                <span className='font-medium'>{program.completedTopics}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-600'>Progress</span>
                <span className='font-medium'>{program.progress}%</span>
              </div>
              <div className='pt-2'>
                <Button variant='outline' className='w-full' asChild>
                  <a
                    href={`/programs/${program.id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Award className='mr-2 h-4 w-4' />
                    View Public Program
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className='border-2 border-[#FFD500]/40 bg-[#FFFBEB]'>
        <CardContent className='p-4 sm:p-6'>
          <div className='flex items-start gap-3'>
            <Star className='h-5 w-5 text-[#FFD500] mt-0.5' />
            <div>
              <p className='font-medium text-sm sm:text-base'>Session Links</p>
              <p className='text-xs sm:text-sm text-gray-600'>
                For online or hybrid sessions, open each topic and use the Join Meeting button
                when a meeting link is available.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
