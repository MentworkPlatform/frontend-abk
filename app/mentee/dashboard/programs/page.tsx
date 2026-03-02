'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, BookOpen, Plus } from 'lucide-react'

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
import { programApi } from '@/lib/programs'

type EnrolledProgramCard = {
  id: string
  title: string
  mentor: string
  progress: number
  focusArea: string
  nextSession: string
  totalTopics: number
  completedTopics: number
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

const extractArrayFromPayload = (payload: unknown) => {
  if (Array.isArray(payload)) {
    return payload
  }

  const root = asObject(payload)

  if (!root) {
    return []
  }

  const dataRecord = asObject(root.data)
  const candidates: unknown[] = [
    root.enrollments,
    root.programs,
    root.items,
    root.results,
    root.data,
    dataRecord?.enrollments,
    dataRecord?.programs,
    dataRecord?.items,
    dataRecord?.results,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
    }
  }

  return []
}

const formatDate = (value: string | null) => {
  if (!value) {
    return 'Schedule pending'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleString()
}

const mapEnrollment = (
  rawEnrollment: unknown,
  index: number,
): EnrolledProgramCard | null => {
  const record = asObject(rawEnrollment)

  if (!record) {
    return null
  }

  const programRecord = asObject(record.program) ?? record
  const mentorRecord =
    asObject(programRecord.mentor) ??
    asObject(record.mentor) ??
    asObject(Array.isArray(programRecord.mentors) ? programRecord.mentors[0] : null) ??
    null
  const totalTopics =
    pickNumber(
      record.totalTopics,
      record.total_topics,
      programRecord.numberOfSessions,
      programRecord.totalTopics,
    ) ?? 0
  const completedTopics =
    pickNumber(
      record.completedTopics,
      record.completed_topics,
      record.completedSessions,
    ) ?? 0
  const explicitProgress = pickNumber(
    record.progress,
    record.completionPercent,
    record.completionRate,
  )
  const computedProgress =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  return {
    id:
      pickString(record.programId, programRecord.id, record.id) ??
      `program-${index + 1}`,
    title:
      pickString(programRecord.title, record.programTitle) ?? 'Untitled Program',
    mentor:
      pickString(mentorRecord?.name, mentorRecord?.fullName, record.mentorName) ??
      'Mentor to be assigned',
    progress: Math.max(
      0,
      Math.min(100, Math.round(explicitProgress ?? computedProgress)),
    ),
    focusArea:
      pickString(
        programRecord.category,
        programRecord.focusArea,
        programRecord.tagline,
      ) ?? 'General',
    nextSession: formatDate(
      pickString(
        record.nextSession,
        record.nextSessionDate,
        programRecord.nextSessionDate,
        programRecord.startDate,
      ),
    ),
    totalTopics,
    completedTopics,
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

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<EnrolledProgramCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPrograms = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await programApi.getMyEnrollments<unknown>()
        const mappedPrograms = extractArrayFromPayload(response)
          .map((item, index) => mapEnrollment(item, index))
          .filter((item): item is EnrolledProgramCard => Boolean(item))

        if (!isMounted) {
          return
        }

        setPrograms(mappedPrograms)
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        setError(toErrorMessage(loadError, 'Unable to load your programs.'))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadPrograms()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className='w-full'>
      <DashboardHeader
        title='My Programs'
        description='View and manage all your enrolled programs'
        actionButton={{
          label: 'Explore Programs',
          href: '/programs',
          icon: Plus,
        }}
      />

      <div className='w-full pt-2 space-y-4 sm:space-y-6 md:px-6 md:pt-8 md:pb-8'>
        {error ? (
          <div className='rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive'>
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
            Loading enrolled programs...
          </div>
        ) : programs.length > 0 ? (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
            {programs.map((program) => (
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
                <CardContent className='p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3'>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Progress</span>
                      <span className='font-medium'>{program.progress}%</span>
                    </div>
                    <Progress value={program.progress} className='h-2' />
                    <div className='text-xs text-gray-500'>
                      {program.completedTopics}/{program.totalTopics} topics completed
                    </div>
                  </div>
                  <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-1'>
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
        ) : (
          <Card className='border-dashed'>
            <CardContent className='flex flex-col items-center justify-center py-12 px-6'>
              <BookOpen className='h-12 w-12 text-gray-300 mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                No programs yet
              </h3>
              <p className='text-sm text-gray-500 text-center mb-6 max-w-sm'>
                Enroll in a program to start learning. Your progress and sessions
                will show here.
              </p>
              <Button className='bg-[#FFD500] text-black hover:bg-[#e6c000]' asChild>
                <Link href='/programs'>Explore programs</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
