'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  Star,
  Clock,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ApiError } from '@/lib/api-client'
import { programApi } from '@/lib/programs'

type PublishedProgramCard = {
  id: string
  title: string
  description: string
  category: string
  level: string
  format: string
  duration: string
  price: number
  rating: number
  reviews: number
  participants: number
  type: string
  mentorName: string
  mentorTitle: string
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
    root.programs,
    root.items,
    root.results,
    root.data,
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

const extractEnrolledProgramIds = (payload: unknown) => {
  const ids = new Set<string>()
  const enrollments = extractArrayFromPayload(payload)

  for (const item of enrollments) {
    const record = asObject(item)

    if (!record) {
      continue
    }

    const programRecord = asObject(record.program) ?? record
    const resolvedId =
      pickString(
        record.programId,
        record.program_id,
        programRecord.programId,
        programRecord.id,
      ) ??
      (!asObject(record.program) ? pickString(record.id) : null)

    if (resolvedId) {
      ids.add(resolvedId)
    }
  }

  return ids
}

const mapPublishedProgram = (
  rawProgram: unknown,
  index: number,
): PublishedProgramCard | null => {
  const record = asObject(rawProgram)

  if (!record) {
    return null
  }

  const mentorRecord =
    asObject(record.mentor) ??
    asObject(record.trainer) ??
    asObject(record.createdByUser) ??
    asObject(record.createdByProfile) ??
    asObject(record.createdBy) ??
    null

  const durationWeeks = pickNumber(record.duration, record.durationWeeks)
  const durationLabel =
    pickString(record.durationLabel) ??
    (durationWeeks
      ? `${durationWeeks} week${durationWeeks > 1 ? 's' : ''}`
      : 'Self paced')

  return {
    id: pickString(record.id, record.programId) ?? `program-${index + 1}`,
    title: pickString(record.title, record.programTitle) ?? 'Untitled Program',
    description:
      pickString(record.description, record.tagline) ??
      'Program details not available.',
    category: pickString(record.category, record.industry) ?? 'General',
    level: pickString(record.level) ?? 'Intermediate',
    format: pickString(record.format, record.deliveryMode) ?? 'Online',
    duration: durationLabel,
    price: pickNumber(record.price, record.fee, record.cost) ?? 0,
    rating: pickNumber(record.rating, record.averageRating, record.avgRating) ?? 0,
    reviews: pickNumber(record.reviews, record.reviewCount, record.totalReviews) ?? 0,
    participants:
      pickNumber(
        record.participants,
        record.participantCount,
        record.maxParticipants,
      ) ?? 0,
    type: pickString(record.type) ?? 'training',
    mentorName:
      pickString(mentorRecord?.name, mentorRecord?.fullName, record.mentorName) ??
      'Mentwork Mentor',
    mentorTitle:
      pickString(mentorRecord?.title, mentorRecord?.role, record.mentorTitle) ??
      'Program Facilitator',
  }
}

const matchFormatFilter = (format: string, selectedFormat: string) => {
  if (selectedFormat === 'all') {
    return true
  }

  const normalized = format.toLowerCase()

  if (selectedFormat === 'hybrid') {
    return normalized.includes('hybrid')
  }

  if (selectedFormat === 'online') {
    return (
      normalized.includes('online') ||
      normalized.includes('virtual') ||
      normalized.includes('self')
    )
  }

  if (selectedFormat === 'in-person') {
    return normalized.includes('in-person') || normalized.includes('physical')
  }

  return true
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
  const searchParams = useSearchParams()
  const fromOnboarding = searchParams.get('from') === 'onboarding'
  const viewAsMentor = searchParams.get('view') === 'mentor'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedFormat, setSelectedFormat] = useState('all')
  const [programs, setPrograms] = useState<PublishedProgramCard[]>([])
  const [enrolledProgramIds, setEnrolledProgramIds] = useState<Set<string>>(
    new Set(),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPublishedPrograms = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [publishedResult, enrollmentsResult] = await Promise.allSettled([
          programApi.getPublishedPrograms<unknown>(),
          viewAsMentor
            ? Promise.resolve<unknown>([])
            : programApi.getMyEnrollments<unknown>(),
        ])

        if (publishedResult.status === 'rejected') {
          throw publishedResult.reason
        }

        const mappedPrograms = extractArrayFromPayload(publishedResult.value)
          .map((item, index) => mapPublishedProgram(item, index))
          .filter((item): item is PublishedProgramCard => Boolean(item))
        const mappedEnrolledProgramIds =
          enrollmentsResult.status === 'fulfilled' && !viewAsMentor
            ? extractEnrolledProgramIds(enrollmentsResult.value)
            : new Set<string>()

        if (!isMounted) {
          return
        }

        setPrograms(mappedPrograms)
        setEnrolledProgramIds(mappedEnrolledProgramIds)
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        setEnrolledProgramIds(new Set())
        setError(toErrorMessage(loadError, 'Unable to load published programs.'))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadPublishedPrograms()

    return () => {
      isMounted = false
    }
  }, [viewAsMentor])

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(programs.map((program) => program.category).filter(Boolean)),
    )

    return unique.sort((a, b) => a.localeCompare(b))
  }, [programs])

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === 'all' ||
        program.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchesLevel =
        selectedLevel === 'all' ||
        program.level.toLowerCase() === selectedLevel.toLowerCase()
      const matchesFormat = matchFormatFilter(program.format, selectedFormat)

      return matchesSearch && matchesCategory && matchesLevel && matchesFormat
    })
  }, [programs, searchQuery, selectedCategory, selectedLevel, selectedFormat])

  const recommendedPrograms = useMemo(() => {
    if (!fromOnboarding) {
      return []
    }

    return filteredPrograms.slice(0, 4)
  }, [filteredPrograms, fromOnboarding])

  return (
    <div className='min-h-screen bg-[#f5f5f5]'>
      <header className='sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80'>
        <div className='container mx-auto px-4 py-2.5 sm:px-6'>
          <div className='flex items-center justify-between'>
            <Link href='/'>
              <img src='/images/mentwork-logo.png' alt='Mentwork' className='h-8' />
            </Link>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/mentee/dashboard'>Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-6 py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4'>
            {viewAsMentor ? 'Mentor Opportunities' : 'Discover Learning Programs'}
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
            Browse published programs and find the right learning experience for
            your goals.
          </p>

          <div className='max-w-4xl mx-auto'>
            <div className='flex flex-col md:flex-row gap-4 mb-6'>
              <div className='flex-1 relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Search programs, skills, or topics...'
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className='pl-10 h-12'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder='Sector' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Sectors</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder='Level' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Levels</SelectItem>
                  <SelectItem value='beginner'>Beginner</SelectItem>
                  <SelectItem value='intermediate'>Intermediate</SelectItem>
                  <SelectItem value='advanced'>Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue placeholder='Format' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Formats</SelectItem>
                  <SelectItem value='hybrid'>Hybrid</SelectItem>
                  <SelectItem value='online'>Online</SelectItem>
                  <SelectItem value='in-person'>In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {error ? (
          <div className='mb-8 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive'>
            {error}
          </div>
        ) : null}

        {fromOnboarding && recommendedPrograms.length > 0 ? (
          <div className='mb-12'>
            <div className='flex items-center gap-2 mb-6'>
              <Sparkles className='h-5 w-5 text-[#FFD500]' />
              <h2 className='text-2xl font-bold'>Recommended for You</h2>
            </div>
            <p className='text-gray-600 mb-6'>
              Based on your profile, here are programs that match your goals and
              interests.
            </p>
            <ProgramGrid
              programs={recommendedPrograms}
              viewAsMentor={viewAsMentor}
              enrolledProgramIds={enrolledProgramIds}
            />
          </div>
        ) : null}

        <div className={fromOnboarding ? 'mb-12' : ''}>
          {fromOnboarding ? (
            <div className='mb-6'>
              <h2 className='text-2xl font-bold mb-2'>All Programs</h2>
              <p className='text-gray-600'>Browse all available published programs</p>
            </div>
          ) : null}

          <ProgramGrid
            programs={filteredPrograms}
            isLoading={isLoading}
            viewAsMentor={viewAsMentor}
            enrolledProgramIds={enrolledProgramIds}
          />
        </div>

        {!isLoading && filteredPrograms.length > 0 ? (
          <div className='text-center mt-8'>
            <Button asChild variant='outline' size='lg'>
              <Link href='/programs'>
                View More Programs <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ProgramGrid({
  programs,
  isLoading = false,
  viewAsMentor = false,
  enrolledProgramIds = new Set<string>(),
}: {
  programs: PublishedProgramCard[]
  isLoading?: boolean
  viewAsMentor?: boolean
  enrolledProgramIds?: Set<string>
}) {
  if (isLoading) {
    return (
      <div className='rounded-lg border border-dashed p-6 text-sm text-muted-foreground'>
        Loading programs...
      </div>
    )
  }

  if (programs.length === 0) {
    return (
      <div className='text-center py-12'>
        <BookOpen className='h-12 w-12 text-gray-400 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-gray-900 mb-2'>No programs found</h3>
        <p className='text-gray-500'>Try adjusting your search criteria or filters</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          viewAsMentor={viewAsMentor}
          isEnrolled={enrolledProgramIds.has(program.id)}
        />
      ))}
    </div>
  )
}

function ProgramCard({
  program,
  viewAsMentor = false,
  isEnrolled = false,
}: {
  program: PublishedProgramCard
  viewAsMentor?: boolean
  isEnrolled?: boolean
}) {
  const formattedPrice = `₦${program.price.toLocaleString()}`
  const ratingLabel =
    program.rating > 0 ? program.rating.toFixed(1) : 'N/A'
  const reviewLabel = program.reviews > 0 ? `(${program.reviews})` : ''
  const mentorInitials = program.mentorName
    .split(' ')
    .filter(Boolean)
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow'>
      <div className='relative'>
        <div className='h-48 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center'>
          <GraduationCap className='h-12 w-12 text-white' />
        </div>
        <Badge className='absolute top-3 right-3 bg-green-500 text-white'>
          {program.level}
        </Badge>
      </div>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between mb-3'>
          <Badge variant='outline'>{program.category}</Badge>
          <div className='flex items-center'>
            <Star className='h-4 w-4 fill-[#FFD500] text-[#FFD500]' />
            <span className='text-sm font-medium ml-1'>{ratingLabel}</span>
            <span className='text-xs text-gray-500 ml-1'>{reviewLabel}</span>
          </div>
        </div>
        <h3 className='font-bold text-lg mb-2'>{program.title}</h3>
        <div className='flex items-center gap-2 mb-3'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/placeholder.svg?height=40&width=40' alt={program.mentorName} />
            <AvatarFallback>{mentorInitials || 'MW'}</AvatarFallback>
          </Avatar>
          <div className='text-sm'>
            <p className='font-medium'>{program.mentorName}</p>
            <p className='text-xs text-gray-500'>{program.mentorTitle}</p>
          </div>
        </div>
        <p className='text-sm text-gray-600 mb-4 line-clamp-3'>{program.description}</p>
        <div className='flex items-center gap-4 text-sm text-gray-600 mb-3'>
          <span className='flex items-center gap-1'>
            <Clock className='h-4 w-4' />
            {program.duration}
          </span>
          <span className='flex items-center gap-1'>
            <Users className='h-4 w-4' />
            {program.participants}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='font-bold text-lg'>{formattedPrice}</span>
          {viewAsMentor ? (
            <Button
              size='sm'
              className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
              asChild
            >
              <Link href={`/programs/${program.id}?view=mentor`}>Apply to Mentor</Link>
            </Button>
          ) : isEnrolled ? (
            <Button size='sm' variant='outline' asChild>
              <Link href={`/mentee/dashboard/programs/${program.id}`}>
                Already Enrolled
              </Link>
            </Button>
          ) : (
            <Button
              size='sm'
              className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
              asChild
            >
              <Link href={`/programs/${program.id}`}>Enroll Now</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
