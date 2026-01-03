'use client'

import Link from 'next/link'
import {
  Calendar,
  MessageSquare,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Plus,
  DollarSign,
  Award,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useCallback, useEffect, useState } from 'react'
import { API_URL } from '@/components/Serverurl'

type PendingRequest = {
  id: string
  programTitle: string
  moduleTitle?: string
  topicTitle: string
  menteeName?: string
  requestedAt: string
  proposedRate: string
  status: 'pending' | 'approved' | 'declined'
  message?: string
}

export default function MentorDashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [userData, setUserData] = useState<{
    id?: string | number
    name: string
  } | null>(null)
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [isPendingLoading, setIsPendingLoading] = useState(true)
  const [pendingError, setPendingError] = useState<string | null>(null)
  const [requestStatuses, setRequestStatuses] = useState<
    Record<string, 'pending' | 'approved' | 'declined'>
  >({})
  const [requestNotes, setRequestNotes] = useState<Record<string, string>>({})
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  )
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({})
  const [isPendingOpen, setIsPendingOpen] = useState(false)

  const mapAssignmentStatus = (
    status: string | null | undefined
  ): PendingRequest['status'] => {
    const normalized = (status ?? '').toString().toLowerCase()
    if (
      normalized === 'approved' ||
      normalized === 'accepted' ||
      normalized === 'confirm'
    ) {
      return 'approved'
    }
    if (normalized === 'declined' || normalized === 'rejected') {
      return 'declined'
    }
    return 'pending'
  }

  const formatRate = (rate: any) => {
    const numericRate = Number(rate)
    if (!Number.isFinite(numericRate)) return 'Not specified'
    return `$${numericRate.toLocaleString()}/hr`
  }

  const formatDateTime = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleString()
  }

  const mapAssignmentToPendingRequest = (assignment: any): PendingRequest => {
    const topic = assignment?.topic ?? {}
    const module = topic?.module ?? {}
    const program = module?.program ?? {}

    return {
      id: assignment?.id
        ? String(assignment.id)
        : `assignment-${topic.topicId ?? Date.now()}`,
      programTitle: program?.title ?? 'Program',
      moduleTitle: module?.moduleTitle ?? undefined,
      topicTitle: topic?.topicTitle ?? 'Topic',
      menteeName:
        assignment?.menteeName ??
        assignment?.mentee?.name ??
        assignment?.mentee ??
        'Program Team',
      requestedAt: formatDateTime(
        assignment?.createdAt ??
          assignment?.updatedAt ??
          new Date().toISOString()
      ),
      proposedRate: formatRate(assignment?.proposedHourlyRate),
      status: mapAssignmentStatus(assignment?.status),
      message: assignment?.customMessage ?? undefined,
    }
  }

  useEffect(() => {
    const storedUserData = localStorage.getItem('user')
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData)
      setUserData({
        id: parsed.id ?? parsed.userId ?? parsed._id,
        name: parsed.name ?? 'User',
      })
    }
  }, [])

  const fetchPendingRequests = useCallback(async () => {
    if (!userData?.id) {
      setPendingRequests([])
      setPendingError('Missing mentor profile. Please re-login.')
      setIsPendingLoading(false)
      return
    }

    setIsPendingLoading(true)
    setPendingError(null)

    try {
      const response = await fetch(
        `${API_URL}/mentors/${userData.id}/topic-assignments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`)
      }

      const data = await response.json()
      if (data?.success && Array.isArray(data.assignments)) {
        const mapped = data.assignments.map(mapAssignmentToPendingRequest)
        const statusMap = mapped.reduce((acc, request) => {
          acc[request.id] = request.status
          return acc
        }, {} as Record<string, PendingRequest['status']>)
        setRequestStatuses(statusMap)
        setPendingRequests(mapped)
      } else {
        throw new Error('Unexpected response format')
      }
    } catch (error) {
      console.error('Error fetching pending requests', error)
      setPendingError('Unable to load pending requests. Please retry.')
      setPendingRequests([])
    } finally {
      setIsPendingLoading(false)
    }
  }, [userData?.id])

  useEffect(() => {
    fetchPendingRequests()
  }, [fetchPendingRequests])

  const pendingActionableRequests = pendingRequests.filter((request) => {
    const status = requestStatuses[request.id] ?? request.status ?? 'pending'
    return status === 'pending'
  })

  const handleNoteChange = useCallback((requestId: string, value: string) => {
    setRequestNotes((prev) => ({ ...prev, [requestId]: value }))
    setActionErrors((prev) => ({ ...prev, [requestId]: '' }))
  }, [])

  const handleRequestAction = useCallback(
    async (requestId: string, status: 'approved' | 'declined') => {
      const decision = status === 'approved' ? 'APPROVED' : 'REJECTED'
      const note = (requestNotes[requestId] ?? '').trim()

      if (decision === 'REJECTED' && !note) {
        setActionErrors((prev) => ({
          ...prev,
          [requestId]: 'Please add a rejection note before declining.',
        }))
        return
      }

      setActionErrors((prev) => ({ ...prev, [requestId]: '' }))
      setActionLoading((prev) => ({ ...prev, [requestId]: true }))

      try {
        const response = await fetch(
          `${API_URL}/programs/topic-mentors/${requestId}/respond`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({
              decision,
              message: note || undefined,
            }),
          }
        )

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`)
        }

        const data = await response.json()
        if (data?.success === false) {
          throw new Error(data?.message || 'Request failed')
        }

        setRequestStatuses((prev) => ({ ...prev, [requestId]: status }))
        setPendingRequests((prev) =>
          prev.map((request) =>
            request.id === requestId
              ? { ...request, status, message: note || request.message }
              : request
          )
        )
      } catch (error) {
        console.error('Error responding to request', error)
        setActionErrors((prev) => ({
          ...prev,
          [requestId]: 'Unable to submit decision. Please retry.',
        }))
      } finally {
        setActionLoading((prev) => ({ ...prev, [requestId]: false }))
      }
    },
    [requestNotes]
  )

  const toggleCardExpansion = (cardId: string) => {
    if (expandedCard === cardId) {
      setExpandedCard(null)
    } else {
      setExpandedCard(cardId)
    }
  }

  return (
    <SidebarProvider>
      <div className='flex min-h-screen'>
        {/* Desktop Sidebar */}

        {/* Mobile Header */}
        <div className='fixed top-0 left-0 right-0 z-30 bg-white border-b md:hidden'>
          <div className='flex items-center justify-between p-4'>
            <Link href='/'>
              <img
                src='/images/mentwork-logo.png'
                alt='Mentwork'
                className='h-6'
              />
            </Link>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className='fixed inset-0 z-20 bg-white pt-16 overflow-y-auto'>
              <div className='p-4'>
                <div className='flex items-center gap-3 p-3 border-b'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage
                      src='/placeholder.svg?height=40&width=40'
                      alt='User avatar'
                    />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <p className='font-medium'>{userData?.name || 'User'}</p>
                    <p className='text-xs text-gray-500'>Business Mentor</p>
                  </div>
                </div>

                <div className='py-2'>
                  <p className='text-xs font-semibold text-gray-500 px-3 py-2'>
                    DASHBOARD
                  </p>
                  <Link
                    href='/mentor/dashboard'
                    className='flex items-center gap-3 px-3 py-2 rounded-md bg-gray-100'
                  >
                    <BarChart3 className='h-4 w-4' />
                    <span className='font-medium'>Overview</span>
                  </Link>
                  <Link
                    href='/mentor/dashboard/sessions'
                    className='flex items-center gap-3 px-3 py-2'
                  >
                    <Calendar className='h-4 w-4' />
                    <span>Sessions</span>
                  </Link>
                  <Link
                    href='/mentor/dashboard/messages'
                    className='flex items-center gap-3 px-3 py-2'
                  >
                    <MessageSquare className='h-4 w-4' />
                    <span>Messages</span>
                  </Link>
                </div>

                {/* <div className='py-2'>
                  <p className='text-xs font-semibold text-gray-500 px-3 py-2'>
                    PROGRAMS
                  </p>
                  <Link
                    href='/mentor/dashboard/programs'
                    className='flex items-center gap-3 px-3 py-2'
                  >
                    <BookOpen className='h-4 w-4' />
                    <span>My Programs</span>
                  </Link>
                  <Link
                    href='/mentor/dashboard/earnings'
                    className='flex items-center gap-3 px-3 py-2'
                  >
                    <DollarSign className='h-4 w-4' />
                    <span>Earnings</span>
                  </Link>
                </div> */}

                <div className='py-2'>
                  <p className='text-xs font-semibold text-gray-500 px-3 py-2'>
                    GROWTH
                  </p>
                  <Link
                    href='/mentor/goals'
                    className='flex items-center gap-3 px-3 py-2'
                  >
                    <Target className='h-4 w-4' />
                    <span>My Goals</span>
                  </Link>
                  <Link
                    href='/mentor/dashboard/recommendations'
                    className='flex items-center gap-3 px-3 py-2'
                  >
                    <TrendingUp className='h-4 w-4' />
                    <span>Recommendations</span>
                  </Link>
                  <Link
                    href='/mentor/school-opportunities'
                    className='flex items-center gap-3 px-3 py-2'
                  >
                    <BookOpen className='h-4 w-4' />
                    <span>School Programs</span>
                  </Link>
                  <Link
                    href='/mentor/subscriptions'
                    className='flex items-center gap-3 px-3 py-2'
                  >
                    <Award className='h-4 w-4' />
                    <span>Subscription</span>
                  </Link>
                </div>

                <div className='py-2'>
                  <p className='text-xs font-semibold text-gray-500 px-3 py-2'>
                    ACCOUNT
                  </p>
                  <Link
                    href='/mentor/dashboard/profile'
                    className='flex items-center gap-3 px-3 py-2'
                  >
                    <Users className='h-4 w-4' />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href='/mentor/dashboard/settings'
                    className='flex items-center gap-3 px-3 py-2'
                  >
                    <Settings className='h-4 w-4' />
                    <span>Settings</span>
                  </Link>
                </div>

                <div className='mt-4 pt-4 border-t'>
                  <Button variant='outline' className='w-full'>
                    View Public Profile
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <SidebarInset className='w-full'>
          <div className='flex-1 p-4 md:p-8 pt-16 md:pt-8 max-w-[1200px] mx-auto'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
              <div>
                <h1 className='text-2xl font-bold'>
                  Welcome back, {userData?.name || 'User'}!
                </h1>
                <p className='text-gray-500'>
                  Here's an overview of your mentorship programs
                </p>
              </div>
              {/* <Button
                asChild
                className='w-full md:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000]'
                disabled={true}
              >
                <Link href='/mentor/dashboard/programs/create'>
                  <Plus className='mr-2 h-4 w-4' /> Create New Program
                </Link>
              </Button> */}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
              <PendingRequestsCard
                requests={pendingActionableRequests}
                isLoading={isPendingLoading}
                onOpen={() => setIsPendingOpen(true)}
                error={pendingError}
                onRetry={fetchPendingRequests}
              />
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium text-gray-500'>
                    Active Mentees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>24</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium text-gray-500'>
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>8</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium text-gray-500'>
                    Monthly Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$2,450</div>
                </CardContent>
              </Card>
            </div>

            <PendingRequestsManager
              open={isPendingOpen}
              onOpenChange={setIsPendingOpen}
              requests={pendingRequests}
              isLoading={isPendingLoading}
              requestStatuses={requestStatuses}
              onAction={handleRequestAction}
              error={pendingError}
              onRetry={fetchPendingRequests}
              requestNotes={requestNotes}
              onNoteChange={handleNoteChange}
              actionLoading={actionLoading}
              actionErrors={actionErrors}
            />

            <div className='mb-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Commission Structure</CardTitle>
                  <CardDescription>
                    Your commission is based on your subscription plan and
                    session count
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-6'>
                    <div>
                      <div className='flex justify-between mb-1'>
                        <span className='text-sm font-medium'>
                          Current Plan: Free
                        </span>
                        <span className='text-sm font-medium'>
                          15% Commission
                        </span>
                      </div>
                      <Progress value={75} className='h-2' />
                      <div className='flex justify-between mt-2'>
                        <p className='text-xs text-gray-500'>
                          15 more sessions to reach 5% commission tier
                        </p>
                        <Link
                          href='/mentor/subscriptions'
                          className='text-xs text-blue-600 hover:underline'
                        >
                          Upgrade to paid plan for 0% commission
                        </Link>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 mt-4'>
                      {[
                        { sessions: '0-5', rate: '25%' },
                        { sessions: '6-10', rate: '20%' },
                        { sessions: '11-20', rate: '15%', current: true },
                        { sessions: '21-50', rate: '10%' },
                        { sessions: '51+', rate: '5%' },
                      ].map((tier, i) => (
                        <Card
                          key={i}
                          className={`border-2 ${
                            tier.current
                              ? 'border-[#FFD500]'
                              : 'border-[#F5F5F5]'
                          }`}
                        >
                          <CardContent className='p-3 md:p-4'>
                            <h4 className='font-medium text-sm md:text-base mb-1'>
                              {tier.sessions}
                            </h4>
                            <p className='text-xl md:text-2xl font-bold mb-1'>
                              {tier.rate}
                            </p>
                            <p className='text-xs text-gray-500'>Sessions</p>
                            {tier.current && (
                              <Badge className='mt-1 bg-[#FFD500] text-black'>
                                Current
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue='programs' className='mb-6'>
              <TabsList className='w-full grid grid-cols-2'>
                <TabsTrigger value='programs'>My Programs</TabsTrigger>
                <TabsTrigger value='sessions'>Upcoming Sessions</TabsTrigger>
              </TabsList>
              <TabsContent value='programs' className='mt-4'>
                <div className='grid grid-cols-1 gap-4'>
                  {[
                    {
                      id: 'program1',
                      title: 'Startup Funding Masterclass',
                      type: 'Group Program',
                      sessions: 8,
                      price: 1200,
                      participants: 12,
                      nextSession: 'Tomorrow, 10:00 AM',
                    },
                    {
                      id: 'program2',
                      title: 'Business Growth Strategy',
                      type: '1:1 Program',
                      sessions: 6,
                      price: 2000,
                      participants: 8,
                      nextSession: 'Friday, 2:00 PM',
                    },
                  ].map((program) => (
                    <Card key={program.id}>
                      <CardHeader
                        className='cursor-pointer'
                        onClick={() => toggleCardExpansion(program.id)}
                      >
                        <div className='flex justify-between items-center'>
                          <div>
                            <CardTitle>{program.title}</CardTitle>
                            <CardDescription>
                              {program.type} • {program.sessions} Sessions
                            </CardDescription>
                          </div>
                          {expandedCard === program.id ? (
                            <ChevronUp className='h-5 w-5 text-gray-500' />
                          ) : (
                            <ChevronDown className='h-5 w-5 text-gray-500' />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent
                        className={
                          expandedCard === program.id
                            ? 'block'
                            : 'hidden md:block'
                        }
                      >
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div className='flex items-center gap-4'>
                            <DollarSign className='h-5 w-5 text-gray-500' />
                            <span>${program.price} per participant</span>
                          </div>
                          <div className='flex items-center gap-4'>
                            <Users className='h-5 w-5 text-gray-500' />
                            <span>
                              {program.participants} active participants
                            </span>
                          </div>
                          <div className='flex items-center gap-4'>
                            <Calendar className='h-5 w-5 text-gray-500' />
                            <span>Next session: {program.nextSession}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter
                        className={
                          expandedCard === program.id
                            ? 'block'
                            : 'hidden md:flex justify-between'
                        }
                      >
                        <div className='flex flex-col md:flex-row gap-2 w-full'>
                          <Button
                            variant='outline'
                            asChild
                            className='flex-1 md:flex-none'
                          >
                            <Link
                              href={`/mentor/dashboard/programs/${program.id}/edit`}
                            >
                              Edit Program
                            </Link>
                          </Button>
                          <Button
                            className='flex-1 md:flex-none bg-[#FFD500] text-black hover:bg-[#e6c000]'
                            asChild
                          >
                            <Link
                              href={`/mentor/dashboard/programs/${program.id}`}
                            >
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className='mt-4 text-center'>
                  <Button asChild variant='outline'>
                    <Link href='/mentor/dashboard/programs'>
                      View All Programs
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value='sessions' className='mt-4'>
                <div className='grid grid-cols-1 gap-4'>
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className='overflow-hidden'>
                      <div className='flex flex-col md:flex-row'>
                        <div className='p-4 md:w-1/4 flex flex-col justify-center items-center bg-[#F5F5F5] rounded-t-lg md:rounded-l-lg md:rounded-tr-none'>
                          <p className='text-lg font-bold'>Today</p>
                          <p className='text-2xl font-bold'>{10 + i}:00 AM</p>
                        </div>
                        <div className='p-4 md:w-3/4'>
                          <div className='flex flex-col md:flex-row justify-between mb-4'>
                            <div>
                              <h3 className='font-bold text-lg'>
                                Business Strategy Session
                              </h3>
                              <p className='text-gray-500'>1:1 with John Doe</p>
                            </div>
                            <Badge className='self-start mt-2 md:mt-0 bg-[#FFD500] text-black'>
                              {i === 1 ? '1:1 Session' : 'Group Session'}
                            </Badge>
                          </div>
                          <div className='flex items-center gap-2 mb-4'>
                            <Avatar>
                              <AvatarImage
                                src='/placeholder.svg?height=32&width=32'
                                alt='Mentee'
                              />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className='text-sm font-medium'>John Doe</p>
                              <p className='text-xs text-gray-500'>
                                CEO, TechStart
                              </p>
                            </div>
                          </div>
                          <div className='flex flex-col md:flex-row justify-end gap-2'>
                            <Button variant='outline' size='sm'>
                              Reschedule
                            </Button>
                            <Button
                              className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
                              size='sm'
                            >
                              Join Session
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className='mt-4 text-center'>
                  <Button asChild variant='outline'>
                    <Link href='/mentor/dashboard/sessions'>
                      View All Sessions
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Program Performance</CardTitle>
                <CardDescription>
                  Track the success of your mentorship programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <div className='flex justify-between mb-1'>
                      <span className='text-sm font-medium'>
                        Startup Funding Masterclass
                      </span>
                      <span className='text-sm font-medium'>
                        92% Satisfaction
                      </span>
                    </div>
                    <Progress value={92} className='h-2' />
                  </div>
                  <div>
                    <div className='flex justify-between mb-1'>
                      <span className='text-sm font-medium'>
                        Business Growth Strategy
                      </span>
                      <span className='text-sm font-medium'>
                        88% Satisfaction
                      </span>
                    </div>
                    <Progress value={88} className='h-2' />
                  </div>
                  <div>
                    <div className='flex justify-between mb-1'>
                      <span className='text-sm font-medium'>
                        Digital Marketing Essentials
                      </span>
                      <span className='text-sm font-medium'>
                        95% Satisfaction
                      </span>
                    </div>
                    <Progress value={95} className='h-2' />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full'>
                  View Detailed Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function PendingRequestsCard({
  requests,
  isLoading,
  onOpen,
  error,
  onRetry,
}: {
  requests: PendingRequest[]
  isLoading: boolean
  onOpen: () => void
  error: string | null
  onRetry: () => void
}) {
  const pendingCount = requests.length

  return (
    <Card
      className='h-full cursor-pointer transition hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FFD500]'
      onClick={onOpen}
      role='button'
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium text-gray-500'>
          Pending Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-3xl font-bold'>
          {isLoading ? '...' : pendingCount}
        </div>
        {error && (
          <div className='mt-2 flex items-center justify-between rounded-md bg-red-50 px-2 py-1 text-xs text-red-700'>
            <span className='flex items-center gap-1'>
              <AlertTriangle className='h-4 w-4' />
              {error}
            </span>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 text-red-700 hover:text-red-800'
              onClick={(event) => {
                event.stopPropagation()
                onRetry()
              }}
              aria-label='Retry fetching pending requests'
            >
              <RefreshCw className='h-4 w-4' />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PendingRequestsManager({
  open,
  onOpenChange,
  requests,
  isLoading,
  requestStatuses,
  onAction,
  error,
  onRetry,
  requestNotes,
  onNoteChange,
  actionLoading,
  actionErrors,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  requests: PendingRequest[]
  isLoading: boolean
  requestStatuses: Record<string, 'pending' | 'approved' | 'declined'>
  onAction: (id: string, status: 'approved' | 'declined') => void
  error: string | null
  onRetry: () => void
  requestNotes: Record<string, string>
  onNoteChange: (id: string, value: string) => void
  actionLoading: Record<string, boolean>
  actionErrors: Record<string, string>
}) {
  const statusLabel = {
    pending: 'Pending',
    approved: 'Approved',
    declined: 'Declined',
  } as const

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Pending Requests</DialogTitle>
          <DialogDescription>
            Review topics that need your approval or decline the assignments.
          </DialogDescription>
        </DialogHeader>

        {error && !isLoading && (
          <div className='mb-2 flex items-start justify-between rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-700'>
            <div className='flex items-start gap-2'>
              <AlertTriangle className='h-4 w-4 mt-[2px]' />
              <div>
                <p className='font-medium'>Could not load requests</p>
                <p className='text-xs text-red-600'>{error}</p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-red-700 hover:text-red-800'
              onClick={onRetry}
              aria-label='Retry fetching pending requests'
            >
              <RefreshCw className='h-4 w-4' />
            </Button>
          </div>
        )}

        {isLoading ? (
          <p className='text-sm text-gray-500'>Loading pending requests...</p>
        ) : requests.length === 0 ? (
          <p className='text-sm text-gray-500'>
            You&apos;re all caught up - no pending topic requests right now.
          </p>
        ) : (
          <div className='space-y-3'>
            {requests.map((request) => {
              const status =
                requestStatuses[request.id] ?? request.status ?? 'pending'
              const isResolved = status !== 'pending'

              return (
                <Card key={request.id} className='border border-gray-100'>
                  <CardContent className='p-4'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='space-y-1'>
                        <p className='text-sm text-gray-500'>
                          {request.programTitle}
                          {request.moduleTitle
                            ? ` - ${request.moduleTitle}`
                            : ''}
                        </p>
                        <h4 className='font-semibold text-base'>
                          {request.topicTitle}
                        </h4>
                        {request.menteeName && (
                          <p className='text-sm text-gray-600'>
                            Mentee: {request.menteeName}
                          </p>
                        )}
                        {request.message && (
                          <p className='text-sm text-gray-600 italic'>
                            "{request.message}"
                          </p>
                        )}
                        <p className='text-xs text-gray-500'>
                          Requested: {request.requestedAt} | Proposed Rate:{' '}
                          {request.proposedRate}
                        </p>
                        <div className='mt-3 space-y-1'>
                          <p className='text-xs font-medium text-gray-700'>
                            Decision note{' '}
                            {status === 'declined'
                              ? '(required for decline)'
                              : '(optional)'}
                          </p>
                          <Textarea
                            rows={2}
                            placeholder='Add a note for the requester'
                            value={requestNotes[request.id] ?? ''}
                            onChange={(e) =>
                              onNoteChange(request.id, e.target.value)
                            }
                          />
                          {actionErrors[request.id] && (
                            <p className='text-xs text-red-600'>
                              {actionErrors[request.id]}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={isResolved ? 'secondary' : 'outline'}
                        className={
                          status === 'approved'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : status === 'declined'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : ''
                        }
                      >
                        {statusLabel[status]}
                      </Badge>
                    </div>
                    <div className='flex justify-end gap-2 mt-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        disabled={isResolved || actionLoading[request.id]}
                        onClick={() => onAction(request.id, 'declined')}
                      >
                        {actionLoading[request.id]
                          ? 'Submitting...'
                          : 'Decline'}
                      </Button>
                      <Button
                        size='sm'
                        className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
                        disabled={isResolved || actionLoading[request.id]}
                        onClick={() => onAction(request.id, 'approved')}
                      >
                        {actionLoading[request.id]
                          ? 'Submitting...'
                          : 'Approve'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
