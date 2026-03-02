'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Clock, TrendingUp, Award, ChevronRight } from 'lucide-react'

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
import { DashboardHeader } from '@/components/dashboard-header'
import { ApiError } from '@/lib/api-client'
import { getCurrentUserDetails } from '@/lib/current-user'
import { programApi } from '@/lib/programs'

type ActiveProgramCard = {
  id: string
  title: string
  mentor: string
  progress: number
  focusArea: string
  nextSession: string
}

type RecommendedProgramCard = {
  id: string
  title: string
  mentor: string
  focusArea: string
  duration: string
  rating: number
  reason: string
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
  }

  return null
}

const extractArrayFromPayload = (payload: unknown, keys: string[]) => {
  if (Array.isArray(payload)) {
    return payload
  }

  const root = asObject(payload)

  if (!root) {
    return []
  }

  const dataRecord = asObject(root.data)

  for (const key of keys) {
    if (Array.isArray(root[key])) {
      return root[key] as unknown[]
    }

    if (dataRecord && Array.isArray(dataRecord[key])) {
      return dataRecord[key] as unknown[]
    }
  }

  const fallbackGroups: unknown[] = [
    root.data,
    root.items,
    root.results,
    dataRecord?.items,
    dataRecord?.results,
  ]

  for (const group of fallbackGroups) {
    if (Array.isArray(group)) {
      return group
    }
  }

  return []
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

const mapEnrollmentProgram = (
  rawEnrollment: unknown,
  index: number,
): ActiveProgramCard | null => {
  const record = asObject(rawEnrollment)

  if (!record) {
    return null
  }

  const programRecord = asObject(record.program) ?? record
  const mentorRecord =
    asObject(programRecord.mentor) ??
    asObject(record.mentor) ??
    asObject(Array.isArray(programRecord.mentors) ? programRecord.mentors[0] : null) ??
    asObject(
      Array.isArray(programRecord.assignedMentors)
        ? programRecord.assignedMentors[0]
        : null,
    ) ??
    null

  const id =
    pickString(
      record.programId,
      programRecord.id,
      record.id,
      record.enrollmentId,
    ) ?? `program-${index + 1}`

  const completedTopics = pickNumber(
    record.completedTopics,
    record.completed_topics,
    record.completedSessions,
  )
  const totalTopics = pickNumber(
    record.totalTopics,
    record.total_topics,
    programRecord.numberOfSessions,
  )
  const explicitProgress = pickNumber(
    record.progress,
    record.completionPercent,
    record.completion_percentage,
    record.completionRate,
  )
  const computedProgress =
    completedTopics !== null &&
    totalTopics !== null &&
    totalTopics > 0
      ? (completedTopics / totalTopics) * 100
      : null
  const progress = Math.max(
    0,
    Math.min(100, Math.round(explicitProgress ?? computedProgress ?? 0)),
  )

  return {
    id,
    title:
      pickString(
        programRecord.title,
        programRecord.programTitle,
        record.programTitle,
      ) ?? 'Untitled Program',
    mentor:
      pickString(
        mentorRecord?.name,
        mentorRecord?.fullName,
        record.mentorName,
      ) ?? 'Mentor to be assigned',
    progress,
    focusArea:
      pickString(
        programRecord.category,
        programRecord.focusArea,
        programRecord.tagline,
      ) ?? 'General',
    nextSession: formatNextSession(
      pickString(
        record.nextSession,
        record.nextSessionDate,
        programRecord.nextSessionDate,
        programRecord.startDate,
      ),
    ),
  }
}

const mapRecommendedProgram = (
  rawProgram: unknown,
  index: number,
): RecommendedProgramCard | null => {
  const record = asObject(rawProgram)

  if (!record) {
    return null
  }

  const mentorRecord =
    asObject(record.mentor) ??
    asObject(record.trainer) ??
    asObject(Array.isArray(record.mentors) ? record.mentors[0] : null) ??
    null

  const id =
    pickString(record.id, record.programId, record.program_id) ??
    `recommended-${index + 1}`
  const durationWeeks = pickNumber(record.duration, record.durationWeeks)
  const durationLabel =
    pickString(record.durationLabel, record.durationText) ??
    (durationWeeks ? `${durationWeeks} week${durationWeeks > 1 ? 's' : ''}` : 'Self paced')

  return {
    id,
    title:
      pickString(record.title, record.programTitle, record.name) ??
      'Untitled Program',
    mentor:
      pickString(mentorRecord?.name, mentorRecord?.fullName, record.mentorName) ??
      'Mentor',
    focusArea:
      pickString(record.category, record.focusArea, record.tagline) ?? 'General',
    duration: durationLabel,
    rating: pickNumber(record.rating, record.averageRating, record.avgRating) ?? 0,
    reason:
      pickString(
        record.reason,
        record.recommendationReason,
        record.description,
      ) ?? 'Recommended based on your learning profile',
  }
}

const toErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return fallback
}

export default function DashboardPage() {
  const [activePrograms, setActivePrograms] = useState<ActiveProgramCard[]>([])
  const [recommendedPrograms, setRecommendedPrograms] = useState<
    RecommendedProgramCard[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const userName = useMemo(() => {
    const currentUser = getCurrentUserDetails()

    return (
      currentUser.name?.split(' ')[0] ??
      currentUser.email?.split('@')[0] ??
      'Learner'
    )
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      setIsLoading(true)
      setError(null)

      const [enrollmentResult, recommendedResult] = await Promise.allSettled([
        programApi.getMyEnrollments<unknown>(),
        programApi.getRecommendedPrograms<unknown>(10),
      ])

      if (!isMounted) {
        return
      }

      if (
        enrollmentResult.status === 'rejected' &&
        recommendedResult.status === 'rejected'
      ) {
        setError(toErrorMessage(enrollmentResult.reason, 'Unable to load dashboard.'))
        setIsLoading(false)
        return
      }

      if (enrollmentResult.status === 'fulfilled') {
        const mappedEnrollments = extractArrayFromPayload(enrollmentResult.value, [
          'enrollments',
          'programs',
          'items',
        ])
          .map((item, index) => mapEnrollmentProgram(item, index))
          .filter((item): item is ActiveProgramCard => Boolean(item))

        setActivePrograms(mappedEnrollments)
      }

      if (recommendedResult.status === 'fulfilled') {
        const mappedRecommended = extractArrayFromPayload(recommendedResult.value, [
          'programs',
          'recommended',
          'items',
        ])
          .map((item, index) => mapRecommendedProgram(item, index))
          .filter((item): item is RecommendedProgramCard => Boolean(item))

        setRecommendedPrograms(mappedRecommended)
      }

      setIsLoading(false)
    }

    void loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  const suggestedPrograms = useMemo(
    () => recommendedPrograms.slice(0, 3),
    [recommendedPrograms],
  )
  const growthPrograms = useMemo(
    () => recommendedPrograms.slice(3),
    [recommendedPrograms],
  )

  return (
    <div className='w-full'>
      <DashboardHeader
        title={`Welcome back, ${userName}!`}
        description='Continue your entrepreneurial journey with personalized recommendations'
        actionButton={{
          label: 'Explore Programs',
          href: '/programs',
          icon: Plus,
        }}
      />

      <div className='w-full pt-4 sm:pt-6 space-y-6 sm:space-y-8 md:px-6 md:pt-8 md:pb-8'>
        {error ? (
          <div className='rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive'>
            {error}
          </div>
        ) : null}

        <div className='space-y-4 sm:space-y-6'>
          <div className='flex items-center justify-between'>
            <div className='min-w-0'>
              <h2 className='text-lg sm:text-xl font-bold'>Your Programs</h2>
              <p className='text-sm sm:text-base text-gray-600'>
                Active programs and personalized recommendations
              </p>
            </div>
          </div>

          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-sm font-semibold text-gray-900'>Currently Active</h3>
            {isLoading ? (
              <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                Loading current programs...
              </div>
            ) : activePrograms.length === 0 ? (
              <Card className='border-dashed'>
                <CardContent className='py-8 text-center space-y-3'>
                  <p className='text-sm text-muted-foreground'>
                    No active enrollments yet.
                  </p>
                  <Button asChild className='bg-[#FFD500] text-black hover:bg-[#e6c000]'>
                    <Link href='/programs'>Explore Programs</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                {activePrograms.map((program) => (
                  <Card key={program.id} className='hover:shadow-md transition-shadow'>
                    <CardHeader className='p-4 sm:p-6 pb-2 sm:pb-3'>
                      <div className='flex justify-between items-start gap-2'>
                        <div className='min-w-0 flex-1'>
                          <CardTitle className='text-base sm:text-lg leading-tight'>
                            {program.title}
                          </CardTitle>
                          <CardDescription className='text-xs sm:text-sm'>
                            with {program.mentor}
                          </CardDescription>
                        </div>
                        <Badge variant='secondary' className='text-xs shrink-0'>
                          {program.focusArea}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='p-4 sm:p-6 space-y-2 sm:space-y-3'>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Progress</span>
                          <span className='font-medium'>{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className='h-2' />
                      </div>
                      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                        <Link
                          href={`/mentee/dashboard/programs/${program.id}`}
                          className='flex items-center text-xs sm:text-sm text-gray-600 hover:text-[#FFD500] transition-colors cursor-pointer'
                        >
                          <Clock className='mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0' />
                          {program.nextSession}
                        </Link>
                        <Button
                          size='sm'
                          className='w-full sm:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000] text-sm'
                          asChild
                        >
                          <Link href={`/mentee/dashboard/programs/${program.id}`}>
                            Continue
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className='space-y-3 sm:space-y-4 pt-4 border-t'>
            <h3 className='text-sm font-medium text-gray-500 mb-2 sm:mb-3'>
              Recommended for You
            </h3>
            {isLoading ? (
              <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                Loading recommendations...
              </div>
            ) : suggestedPrograms.length === 0 ? (
              <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                No recommendations available yet.
              </div>
            ) : (
              <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                {suggestedPrograms.map((program) => (
                  <Card
                    key={program.id}
                    className='hover:shadow-sm transition-shadow border-gray-200 bg-gray-50/50'
                  >
                    <CardHeader className='pb-2 pt-3 px-4'>
                      <div className='flex justify-between items-start gap-2'>
                        <div className='flex-1 min-w-0'>
                          <CardTitle className='text-sm font-semibold leading-tight mb-1'>
                            {program.title}
                          </CardTitle>
                          <CardDescription className='text-xs'>
                            with {program.mentor}
                          </CardDescription>
                        </div>
                        <Badge className='bg-gray-200 text-gray-700 text-xs shrink-0'>
                          {program.focusArea}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-2 px-4 pb-3'>
                      <p className='text-xs text-gray-500 line-clamp-2'>{program.reason}</p>
                      <div className='flex items-center justify-between text-xs'>
                        <div className='flex items-center gap-3 text-gray-500'>
                          <span>{program.duration}</span>
                          <div className='flex items-center'>
                            <Award className='mr-1 h-3 w-3 text-yellow-500' />
                            <span>{program.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-7 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          asChild
                        >
                          <Link href={`/programs/${program.id}`}>
                            View
                            <ChevronRight className='ml-1 h-3 w-3' />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='space-y-3 sm:space-y-4 pt-4 border-t'>
          <div>
            <h3 className='text-sm font-medium text-gray-500 flex items-center gap-2 mb-2 sm:mb-3'>
              <TrendingUp className='h-4 w-4 text-gray-400 shrink-0' />
              Recommended for Growth
            </h3>
            <p className='text-xs text-gray-500 mb-3 sm:mb-4'>
              Opportunities to strengthen your entrepreneurial toolkit
            </p>
          </div>

          {isLoading ? (
            <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
              Loading growth recommendations...
            </div>
          ) : growthPrograms.length === 0 ? (
            <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
              More recommendations will appear as you engage with programs.
            </div>
          ) : (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
              {growthPrograms.map((program) => (
                <Card
                  key={program.id}
                  className='hover:shadow-sm transition-shadow border-gray-200 bg-gray-50/50'
                >
                  <CardHeader className='pb-2 pt-3 px-4'>
                    <div className='flex justify-between items-start gap-2'>
                      <div className='flex-1 min-w-0'>
                        <CardTitle className='text-sm font-semibold leading-tight mb-1'>
                          {program.title}
                        </CardTitle>
                        <CardDescription className='text-xs'>
                          with {program.mentor}
                        </CardDescription>
                      </div>
                      <Badge
                        variant='outline'
                        className='border-gray-300 text-gray-600 text-xs shrink-0'
                      >
                        {program.focusArea}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-2 px-4 pb-3'>
                    <p className='text-xs text-gray-500 line-clamp-2'>{program.reason}</p>
                    <div className='flex items-center justify-between text-xs'>
                      <div className='flex items-center gap-3 text-gray-500'>
                        <span>{program.duration}</span>
                        <div className='flex items-center'>
                          <Award className='mr-1 h-3 w-3 text-yellow-500' />
                          <span>{program.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-7 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        asChild
                      >
                        <Link href={`/programs/${program.id}`}>
                          View
                          <ChevronRight className='ml-1 h-3 w-3' />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
