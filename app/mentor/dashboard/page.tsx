'use client'

import { useState } from 'react'
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

export default function MentorDashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

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
        <Sidebar className='hidden md:flex'>
          <SidebarHeader>
            <div className='flex items-center gap-2 p-4'>
              <Link href='/'>
                <img
                  src='/images/mentwork-logo.png'
                  alt='Mentwork'
                  className='h-8'
                />
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href='/mentor/dashboard'>
                        <BarChart3 className='h-4 w-4' />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/dashboard/sessions'>
                        <Calendar className='h-4 w-4' />
                        <span>Sessions</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/dashboard/messages'>
                        <MessageSquare className='h-4 w-4' />
                        <span>Messages</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Programs</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/dashboard/programs'>
                        <BookOpen className='h-4 w-4' />
                        <span>My Programs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/dashboard/earnings'>
                        <DollarSign className='h-4 w-4' />
                        <span>Earnings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Growth</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/goals'>
                        <Target className='h-4 w-4' />
                        <span>My Goals</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/dashboard/recommendations'>
                        <TrendingUp className='h-4 w-4' />
                        <span>Recommendations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/school-opportunities'>
                        <BookOpen className='h-4 w-4' />
                        <span>School Programs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/subscriptions'>
                        <Award className='h-4 w-4' />
                        <span>Subscription</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/dashboard/profile'>
                        <Users className='h-4 w-4' />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/dashboard/settings'>
                        <Settings className='h-4 w-4' />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className='p-4'>
              <div className='flex items-center gap-4 mb-4'>
                <Avatar>
                  <AvatarImage
                    src='/placeholder.svg?height=40&width=40'
                    alt='User avatar'
                  />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>
                    {localStorage.getItem('user') &&
                      JSON.parse(localStorage.getItem('user') as string).name}
                  </p>
                  <p className='text-xs text-gray-500'>Business Mentor</p>
                </div>
              </div>
              <Button variant='outline' className='w-full'>
                View Public Profile
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

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
                    <p className='font-medium'>
                      {localStorage.getItem('user') &&
                        JSON.parse(localStorage.getItem('user') as string).name}
                    </p>
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

                <div className='py-2'>
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
                </div>

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
                  Welcome back,{' '}
                  {localStorage.getItem('user') &&
                    JSON.parse(localStorage.getItem('user') as string).name}
                  !
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

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
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
