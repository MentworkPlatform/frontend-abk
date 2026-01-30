'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Eye,
  TrendingUp,
  BarChart3,
  CheckCircle,
  AlertCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

export default function LMSDashboard2() {
  const [todaysPrograms] = useState([
    {
      id: '1',
      title: 'Digital Marketing Bootcamp',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      participants: 25,
      feedbackCount: 18,
      status: 'ongoing',
      progress: 65,
    },
    {
      id: '2',
      title: 'Leadership Excellence Program',
      startTime: '2:00 PM',
      endTime: '4:00 PM',
      participants: 20,
      feedbackCount: 15,
      status: 'scheduled',
      progress: 0,
    },
  ])

  const [upcomingPrograms] = useState([
    {
      id: '3',
      title: 'Data Science Fundamentals',
      date: '2024-01-30',
      startTime: '10:00 AM',
      participants: 30,
      status: 'confirmed',
    },
    {
      id: '4',
      title: 'Product Management Essentials',
      date: '2024-02-01',
      startTime: '2:00 PM',
      participants: 22,
      status: 'confirmed',
    },
  ])

  const [pastPrograms] = useState([
    {
      id: '5',
      title: 'Business Strategy Workshop',
      date: '2024-01-28',
      participants: 28,
      feedbackCount: 25,
      completionRate: 89,
      status: 'completed',
    },
    {
      id: '6',
      title: 'Advanced Marketing Techniques',
      date: '2024-01-27',
      participants: 35,
      feedbackCount: 32,
      completionRate: 91,
      status: 'completed',
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'default'
      case 'scheduled':
        return 'secondary'
      case 'confirmed':
        return 'outline'
      case 'completed':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <TrendingUp className='h-4 w-4' />
      case 'scheduled':
        return <Clock className='h-4 w-4' />
      case 'confirmed':
        return <CheckCircle className='h-4 w-4' />
      case 'completed':
        return <CheckCircle className='h-4 w-4' />
      default:
        return <AlertCircle className='h-4 w-4' />
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f5f5]'>
      {/* Header */}
      <header className='bg-white border-b'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link href='/'>
                <img
                  src='/images/mentwork-logo.png'
                  alt='Mentwork'
                  className='h-8'
                />
              </Link>
              <div>
                <h1 className='text-2xl font-bold'>LMS Progress Dashboard</h1>
                <p className='text-gray-500'>
                  Track program progress and feedback
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button variant='outline' asChild>
                <Link href='/lms/dashboard'>
                  <BarChart3 className='h-4 w-4 mr-2' />
                  Main Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-6 py-8'>
        {/* Today's Overview */}
        <div className='mb-8'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                Today's Overview
              </CardTitle>
              <CardDescription>
                Programs scheduled for today and their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {todaysPrograms.length}
                  </div>
                  <p className='text-sm text-gray-500'>Programs Today</p>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>
                    {todaysPrograms.reduce(
                      (sum, p) => sum + p.feedbackCount,
                      0,
                    )}
                  </div>
                  <p className='text-sm text-gray-500'>Total Feedbacks</p>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-purple-600'>
                    {todaysPrograms.reduce((sum, p) => sum + p.participants, 0)}
                  </div>
                  <p className='text-sm text-gray-500'>Total Participants</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue='today' className='space-y-6'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='today'>Today's Programs</TabsTrigger>
            <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
            <TabsTrigger value='past'>Past Programs</TabsTrigger>
          </TabsList>

          <TabsContent value='today' className='space-y-6'>
            <div className='grid gap-6'>
              {todaysPrograms.map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <div>
                        <CardTitle className='flex items-center gap-2'>
                          {getStatusIcon(program.status)}
                          {program.title}
                        </CardTitle>
                        <CardDescription className='flex items-center gap-4 mt-2'>
                          <span className='flex items-center gap-1'>
                            <Clock className='h-4 w-4' />
                            {program.startTime} - {program.endTime}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Users className='h-4 w-4' />
                            {program.participants} participants
                          </span>
                        </CardDescription>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge variant={getStatusColor(program.status)}>
                          {program.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>Progress</span>
                        <span className='text-sm text-gray-500'>
                          {program.progress}%
                        </span>
                      </div>
                      <Progress value={program.progress} className='h-2' />

                      <div className='flex items-center justify-between pt-4'>
                        <div className='flex items-center gap-2'>
                          <MessageSquare className='h-4 w-4 text-blue-500' />
                          <span className='text-sm'>
                            {program.feedbackCount} feedbacks received
                          </span>
                        </div>
                        <Button variant='outline' size='sm'>
                          <Eye className='h-4 w-4 mr-2' />
                          View Feedbacks
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='upcoming' className='space-y-6'>
            <div className='grid gap-6'>
              {upcomingPrograms.map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <div>
                        <CardTitle className='flex items-center gap-2'>
                          {getStatusIcon(program.status)}
                          {program.title}
                        </CardTitle>
                        <CardDescription className='flex items-center gap-4 mt-2'>
                          <span className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            {program.date}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Clock className='h-4 w-4' />
                            {program.startTime}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Users className='h-4 w-4' />
                            {program.participants} participants
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-gray-600'>
                      Program is scheduled and confirmed. Participants will
                      receive notifications.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='past' className='space-y-6'>
            <div className='grid gap-6'>
              {pastPrograms.map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <div>
                        <CardTitle className='flex items-center gap-2'>
                          {getStatusIcon(program.status)}
                          {program.title}
                        </CardTitle>
                        <CardDescription className='flex items-center gap-4 mt-2'>
                          <span className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            {program.date}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Users className='h-4 w-4' />
                            {program.participants} participants
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>
                          Completion Rate
                        </span>
                        <span className='text-sm text-gray-500'>
                          {program.completionRate}%
                        </span>
                      </div>
                      <Progress
                        value={program.completionRate}
                        className='h-2'
                      />

                      <div className='flex items-center justify-between pt-4'>
                        <div className='flex items-center gap-2'>
                          <MessageSquare className='h-4 w-4 text-blue-500' />
                          <span className='text-sm'>
                            {program.feedbackCount} feedbacks received
                          </span>
                        </div>
                        <Button variant='outline' size='sm'>
                          <Eye className='h-4 w-4 mr-2' />
                          View Feedbacks
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
