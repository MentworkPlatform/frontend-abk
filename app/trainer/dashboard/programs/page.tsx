'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  BookOpen,
  ExternalLink,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { TrainerProgram } from '@/types/trainer'
import { API_URL } from '@/components/Serverurl'

export const dynamic = 'force-dynamic'

export default function TrainerPrograms() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [programs, setPrograms] = useState<TrainerProgram[]>([])

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const [drafts, programs] = await Promise.all([
          getDraftPrograms(),
          getAllPrograms(),
        ])

        console.log(drafts, 'drafts')
        console.log(programs, 'programs')

        // Combine drafts first, then programs, and dedupe by id
        const combined = [...drafts, ...programs]
        const uniquePrograms = Array.from(
          combined
            .reduce((map, program) => {
              map.set(program.id, program)
              return map
            }, new Map())
            .values()
        )
        setPrograms(uniquePrograms)
      } catch (error) {
        console.error('Error fetching programs:', error)
      }
    }
    fetchPrograms()
  }, [])

  const getDraftPrograms = async (): Promise<TrainerProgram[]> => {
    try {
      const response = await fetch(API_URL + '/programs/drafts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const data = await response.json()
      if (data.success) {
        console.log(data.drafts)
        const transformedDrafts = data.drafts.map((item: any) => ({
          id: item.programId,
          title: item.data.title || item.data.name,
          tagline: item.data.description,
          description: item.data.description,
          category: item.data.category,
          industry: item.data.industry || '',
          level: item.data.level,
          language: item.data.language || 'English',
          format: item.data.format || 'virtual',
          type: item.data.type || 'group',
          maxParticipants: item.data.maxParticipants || '100',
          price: item.data.price || '0',
          duration: item.data.estimatedDuration || 0,
          startDate: item.data.startDate || '',
          endDate: item.data.endDate || '',
          status: item.data.isPublished ? 'published' : 'draft',
          coverImage:
            item.data.coverImage || '/placeholder.svg?height=200&width=300',
          learningOutcomes: item.data.learningObjectives || [],
          prerequisites: item.data.prerequisites || [],
          curriculum: item.data.modules || [],
          mentorAssignments: [],
          createdAt: item.data.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Preserve draft-specific information
          draftData: {
            step: item.step,
            programId: item.programId,
            data: item.data,
          },
        }))
        console.log(transformedDrafts + 'drafts')
        return transformedDrafts
      }
      return []
    } catch (error) {
      console.log(error)
      return []
    }
  }

  const getAllPrograms = async (): Promise<TrainerProgram[]> => {
    try {
      const response = await fetch(API_URL + '/programs/details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const data = await response.json()
      if (data.success) {
        console.log(data.programs)
        return data.programs
      }
      return []
    } catch (error) {
      console.log(error)
      return []
    }
  }

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program?.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program?.tagline.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      filterCategory === 'all' || program?.category === filterCategory
    const matchesStatus =
      filterStatus === 'all' || program?.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (
    status: string
  ): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (status) {
      case 'active':
        return 'default'
      case 'published':
        return 'secondary'
      case 'completed':
        return 'outline'
      case 'draft':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Your Programs</h2>
        <div className='flex items-center space-x-2'>
          <Link href='/trainer/dashboard/programs/create'>
            <Button className='bg-[#FFD500] text-black hover:bg-[#e6c000]'>
              <Plus className='mr-2 h-4 w-4' />
              Create New Program
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='flex items-center space-x-4'>
        <div className='relative flex-1 max-w-sm'>
          <Input
            placeholder='Search programs...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-8'
          />
          <Search className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Categories</SelectItem>
            <SelectItem value='Marketing'>Marketing</SelectItem>
            <SelectItem value='Technology'>Technology</SelectItem>
            <SelectItem value='Leadership'>Leadership</SelectItem>
            <SelectItem value='Business'>Business</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Statuses</SelectItem>
            <SelectItem value='active'>Active</SelectItem>
            <SelectItem value='published'>Published</SelectItem>
            <SelectItem value='completed'>Completed</SelectItem>
            <SelectItem value='draft'>Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button variant='outline'>
          <Filter className='h-4 w-4 mr-2' />
          Apply Filters
        </Button>
      </div>

      {/* Program List */}
      <Tabs defaultValue='all' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='all'>All ({filteredPrograms.length})</TabsTrigger>
          <TabsTrigger value='active'>
            Active ({programs.filter((p) => p.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value='published'>
            Published ({programs.filter((p) => p.status === 'published').length}
            )
          </TabsTrigger>
          <TabsTrigger value='completed'>
            Completed ({programs.filter((p) => p.status === 'completed').length}
            )
          </TabsTrigger>
          <TabsTrigger value='draft'>
            Draft ({programs.filter((p) => p.status === 'draft').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='all' className='space-y-4'>
          <ProgramList
            programs={filteredPrograms}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
        <TabsContent value='active' className='space-y-4'>
          <ProgramList
            programs={filteredPrograms.filter((p) => p.status === 'active')}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
        <TabsContent value='published' className='space-y-4'>
          <ProgramList
            programs={filteredPrograms.filter((p) => p.status === 'published')}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
        <TabsContent value='completed' className='space-y-4'>
          <ProgramList
            programs={filteredPrograms.filter((p) => p.status === 'completed')}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
        <TabsContent value='draft' className='space-y-4'>
          <ProgramList
            programs={filteredPrograms.filter((p) => p.status === 'draft')}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ProgramListProps {
  programs: TrainerProgram[]
  getStatusColor: (status: string) => string
}

function ProgramList({ programs, getStatusColor }: ProgramListProps) {
  if (programs.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-12'>
          <BookOpen className='h-12 w-12 text-muted-foreground mb-4' />
          <h3 className='text-lg font-medium mb-2'>No programs found</h3>
          <p className='text-muted-foreground text-center'>
            Try adjusting your filters or create a new program to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleProgramClick = (program: any) => {
    if (program.status === 'active') {
      return `/trainer/dashboard/programs/${program.id}`
    } else if (program.status === 'draft') {
      // Navigate to create page with draft data
      const draftData = program.draftData
      const step = draftData?.step || 1
      const programId = draftData?.programId || program.id
      return `/trainer/dashboard/programs/create?draft=true&step=${step}&programId=${programId}`
    }
    return null
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {programs.map((program) => {
        const isActive = program.status === 'active'
        const isDraft = program.status === 'draft'
        const navigationUrl = handleProgramClick(program)

        const cardContent = (
          <Card
            className={`flex flex-col ${
              isActive || isDraft
                ? 'cursor-pointer hover:shadow-lg transition-shadow'
                : ''
            }`}
          >
            <CardHeader className='relative p-0'>
              <img
                src={
                  program.coverImage || '/placeholder.svg?height=200&width=300'
                }
                alt={program.title}
                width={300}
                height={200}
                className='w-full h-40 object-cover rounded-t-lg'
              />
              <div className='absolute top-3 right-3 flex flex-col items-end space-y-1'>
                <Badge
                  variant={getStatusColor(program.status)}
                  className='text-xs px-2 py-1'
                >
                  {program.status}
                </Badge>
                {isDraft && (program as any).draftData?.step && (
                  <Badge
                    variant='outline'
                    className='text-xs px-2 py-1 bg-white/90'
                  >
                    Step {(program as any).draftData.step}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className='p-4 flex-1 flex flex-col'>
              <h3 className='text-lg font-semibold mb-1'>{program.title}</h3>
              <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
                {program.tagline}
              </p>
              <div className='grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4'>
                <div className='flex items-center'>
                  <Calendar className='h-4 w-4 mr-1' />
                  {program.duration} weeks
                </div>
                <div className='flex items-center'>
                  <Users className='h-4 w-4 mr-1' />
                  {program.type === 'group'
                    ? `${program.maxParticipants} participants`
                    : '1:1'}
                </div>
                <div className='flex items-center'>
                  <BookOpen className='h-4 w-4 mr-1' />
                  {program.category}
                </div>
                <div className='flex items-center'>
                  <span className='font-medium text-foreground'>
                    ${program.price}
                  </span>
                </div>
              </div>
              <div className='mt-auto flex justify-between items-center'>
                {isActive ? (
                  <Button variant='outline' size='sm'>
                    View Details
                  </Button>
                ) : isDraft ? (
                  <Button variant='outline' size='sm'>
                    Continue Editing
                  </Button>
                ) : (
                  <Button variant='outline' size='sm' disabled>
                    View Details
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Open menu</span>
                      <ExternalLink className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {isDraft && (
                      <DropdownMenuItem asChild>
                        <Link href={navigationUrl || '#'}>
                          Continue Editing
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/trainer/dashboard/programs/${program.id}/edit`}
                      >
                        Edit Program
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/trainer/dashboard/programs/${program.id}/mentors`}
                      >
                        Manage Mentors
                      </Link>
                    </DropdownMenuItem>
                    {program.status === 'active' && (
                      <DropdownMenuItem asChild>
                        <Link href={`/lms/programs/${program.id}/manage`}>
                          Manage in LMS
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='text-red-600'>
                      Delete Program
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        )

        if (isActive) {
          return (
            <Link
              key={program.id}
              href={`/trainer/dashboard/programs/${program.id}`}
            >
              {cardContent}
            </Link>
          )
        } else if (isDraft && navigationUrl) {
          return (
            <Link key={program.id} href={navigationUrl}>
              {cardContent}
            </Link>
          )
        }

        return <div key={program.id}>{cardContent}</div>
      })}
    </div>
  )
}
