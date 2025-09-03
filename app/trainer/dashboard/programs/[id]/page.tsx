'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Edit,
  Users,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  Play,
  FileText,
  Award,
  MessageSquare,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import type { TrainerProgram } from '@/types/trainer'
import { API_URL } from '@/components/Serverurl'

export default function ProgramDetails() {
  const params = useParams()
  const router = useRouter()
  const programId = params.id as string

  const [program, setProgram] = useState<TrainerProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProgramDetails()
  }, [programId])

  const fetchProgramDetails = async () => {
    try {
      const response = await fetch(API_URL + `/programs/details/${programId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const data = await response.json()
      if (data.success) {
        setProgram(data.program)
      } else {
        setError(data.message || 'Failed to fetch program details')
      }
    } catch (err) {
      setError('Something went wrong')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

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

  const getTopicIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <Play className='h-4 w-4' />
      case 'document':
        return <FileText className='h-4 w-4' />
      case 'quiz':
        return <BookOpen className='h-4 w-4' />
      case 'assignment':
        return <Award className='h-4 w-4' />
      case 'live_session':
        return <Calendar className='h-4 w-4' />
      case 'discussion':
        return <MessageSquare className='h-4 w-4' />
      case 'project':
        return <BookOpen className='h-4 w-4' />
      default:
        return <FileText className='h-4 w-4' />
    }
  }

  const getTopicColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return 'bg-red-100 text-red-600'
      case 'document':
        return 'bg-blue-100 text-blue-600'
      case 'quiz':
        return 'bg-purple-100 text-purple-600'
      case 'assignment':
        return 'bg-green-100 text-green-600'
      case 'live_session':
        return 'bg-orange-100 text-orange-600'
      case 'discussion':
        return 'bg-yellow-100 text-yellow-600'
      case 'project':
        return 'bg-indigo-100 text-indigo-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-1/4 mb-4'></div>
          <div className='h-64 bg-gray-200 rounded mb-4'></div>
          <div className='h-32 bg-gray-200 rounded'></div>
        </div>
      </div>
    )
  }

  if (error || !program) {
    return (
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        <div className='text-center py-12'>
          <h2 className='text-2xl font-bold mb-2'>Error</h2>
          <p className='text-muted-foreground mb-4'>
            {error || 'Program not found'}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 space-y-6 p-4 md:p-8 pt-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' onClick={() => router.back()} className='p-0'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Programs
          </Button>
          <div>
            <h1 className='text-3xl font-bold'>{program.title}</h1>
            <p className='text-muted-foreground'>{program.tagline}</p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Badge variant={getStatusColor(program.status)}>
            {program.status}
          </Badge>
          <Link href={`/trainer/dashboard/programs/${program.id}/edit`}>
            <Button variant='outline'>
              <Edit className='h-4 w-4 mr-2' />
              Edit Program
            </Button>
          </Link>
        </div>
      </div>

      {/* Program Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Program Overview</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <img
                src={
                  program.coverImage || '/placeholder.svg?height=200&width=300'
                }
                alt={program.title}
                className='w-full h-48 object-cover rounded-lg'
              />
            </div>
            <div className='space-y-4'>
              <div>
                <h3 className='font-semibold mb-2'>Description</h3>
                <p className='text-muted-foreground'>{program.description}</p>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex items-center space-x-2'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>{program.duration} weeks</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Users className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>
                    {(program as any).type === 'individual'
                      ? '1:1 Program'
                      : (program as any).type === 'group'
                      ? `${
                          (program as any).maxParticipants || 'Multiple'
                        } participants`
                      : (program as any).type}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <BookOpen className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>{program.category}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <DollarSign className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>${program.price}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Curriculum Overview */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Curriculum</CardTitle>
              <CardDescription>
                {program.curriculum?.length || 0} modules,{' '}
                {program.curriculum?.reduce(
                  (total, m) => total + (m.topics?.length || 0),
                  0
                ) || 0}{' '}
                topics
              </CardDescription>
            </div>
            <Link href={`/trainer/dashboard/programs/${program.id}/curriculum`}>
              <Button variant='outline' size='sm'>
                <BookOpen className='h-4 w-4 mr-2' />
                View Full Curriculum
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {program.curriculum && program.curriculum.length > 0 ? (
            <div className='space-y-4'>
              {program.curriculum.slice(0, 3).map((module, index) => (
                <div key={module.id} className='border rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-medium'>
                      Module {index + 1}: {module.title}
                    </h4>
                    <Badge variant='outline'>
                      {Math.round(module.duration / 60)}h
                    </Badge>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    {module.description}
                  </p>
                  <div className='space-y-3'>
                    {module.topics?.slice(0, 5).map((topic) => (
                      <div
                        key={topic.id}
                        className='flex items-center justify-between p-2 bg-gray-50 rounded'
                      >
                        <div className='flex items-center space-x-3'>
                          <div
                            className={`w-8 h-8 rounded flex items-center justify-center ${getTopicColor(
                              topic.type
                            )}`}
                          >
                            {getTopicIcon(topic.type)}
                          </div>
                          <div>
                            <p className='text-sm font-medium'>{topic.title}</p>
                            <p className='text-xs text-muted-foreground'>
                              {topic.duration} min •{' '}
                              {topic.type?.replace('_', ' ').toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          {(topic as any).mentors &&
                            (topic as any).mentors.length > 0 && (
                              <div className='flex items-center space-x-1'>
                                <Avatar className='h-6 w-6'>
                                  <AvatarImage
                                    src={
                                      (topic as any).mentors[0].profile
                                        ?.profile_picture_url ||
                                      '/placeholder.svg'
                                    }
                                  />
                                  <AvatarFallback className='text-xs'>
                                    {(topic as any).mentors[0].name
                                      .split(' ')
                                      .map((n: string) => n[0])
                                      .join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className='text-xs text-muted-foreground'>
                                  {(topic as any).mentors[0].name}
                                </span>
                              </div>
                            )}
                          <Badge
                            variant={
                              (topic as any).mentors &&
                              (topic as any).mentors.length > 0
                                ? 'default'
                                : 'secondary'
                            }
                            className='text-xs'
                          >
                            {(topic as any).mentors &&
                            (topic as any).mentors.length > 0
                              ? 'Assigned'
                              : 'Unassigned'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {module.topics && module.topics.length > 5 && (
                      <div className='text-center'>
                        <Badge variant='outline' className='text-xs'>
                          +{module.topics.length - 5} more topics
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {program.curriculum.length > 3 && (
                <div className='text-center'>
                  <p className='text-muted-foreground mb-2'>
                    And {program.curriculum.length - 3} more modules...
                  </p>
                  <Link
                    href={`/trainer/dashboard/programs/${program.id}/curriculum`}
                  >
                    <Button variant='outline'>View All Modules</Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className='text-center py-8'>
              <BookOpen className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
              <p className='text-muted-foreground'>No curriculum defined yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mentors */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Mentors</CardTitle>
              <CardDescription>
                {program.mentorAssignments?.length || 0} mentors assigned
              </CardDescription>
            </div>
            <Link href={`/trainer/dashboard/programs/${program.id}/mentors`}>
              <Button variant='outline' size='sm'>
                <Users className='h-4 w-4 mr-2' />
                Manage Mentors
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {(program as any).mentorAssignments &&
          (program as any).mentorAssignments.length > 0 ? (
            <div className='grid gap-4 md:grid-cols-2'>
              {(program as any).mentorAssignments
                .slice(0, 4)
                .map((assignment: any, index: number) => (
                  <Card
                    key={assignment.topicId || index}
                    className='border-l-4 border-l-blue-500'
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-center space-x-3 mb-3'>
                        <Avatar className='h-10 w-10'>
                          <AvatarImage
                            src={
                              assignment.mentor?.profile?.profile_picture_url ||
                              '/placeholder.svg'
                            }
                          />
                          <AvatarFallback>
                            {assignment.mentor?.name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className='font-medium'>
                            {assignment.mentor?.name}
                          </h4>
                          <p className='text-sm text-muted-foreground'>
                            {assignment.mentor?.profile?.bio || 'Mentor'}
                          </p>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-muted-foreground'>Topic:</span>
                          <span>{assignment.topicTitle}</span>
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-muted-foreground'>Rate:</span>
                          <span>${assignment.proposedRate}/hr</span>
                        </div>
                        <Badge
                          variant={
                            assignment.confirmation ? 'default' : 'secondary'
                          }
                          className='text-xs'
                        >
                          {assignment.confirmation ? 'Confirmed' : 'Pending'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <Users className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
              <p className='text-muted-foreground mb-4'>
                No mentors assigned yet
              </p>
              <Link href={`/trainer/dashboard/programs/${program.id}/mentors`}>
                <Button>
                  <Users className='h-4 w-4 mr-2' />
                  Assign Mentors
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Link href={`/trainer/dashboard/programs/${program.id}/edit`}>
              <Button variant='outline' className='w-full justify-start'>
                <Edit className='h-4 w-4 mr-2' />
                Edit Program Details
              </Button>
            </Link>
            <Link href={`/trainer/dashboard/programs/${program.id}/mentors`}>
              <Button variant='outline' className='w-full justify-start'>
                <Users className='h-4 w-4 mr-2' />
                Manage Mentors
              </Button>
            </Link>
            {program.status === 'active' && (
              <Link href={`/lms/programs/${program.id}/manage`}>
                <Button variant='outline' className='w-full justify-start'>
                  <ExternalLink className='h-4 w-4 mr-2' />
                  Manage in LMS
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
