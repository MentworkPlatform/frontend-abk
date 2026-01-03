'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, ArrowLeft, BookOpen, Users } from 'lucide-react'

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
import { API_URL } from '@/components/Serverurl'

type SessionTag = 'today' | 'upcoming' | 'past'

type MentorSession = {
  topicMentorId: number | string
  topicId: number | string
  topicTitle: string
  programId: number | string
  programTitle: string
  startDate: string
  endDate: string
  tag: SessionTag
}

const dummySessions: MentorSession[] = [
  {
    topicMentorId: '1',
    topicId: 't1',
    topicTitle: 'Business Strategy 101',
    programId: 'p1',
    programTitle: 'Startup Mastery',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    tag: 'today',
  },
  {
    topicMentorId: '2',
    topicId: 't2',
    topicTitle: 'Marketing Funnels',
    programId: 'p2',
    programTitle: 'Growth Marketing',
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
    tag: 'upcoming',
  },
  {
    topicMentorId: '3',
    topicId: 't3',
    topicTitle: 'Retrospective Review',
    programId: 'p3',
    programTitle: 'Leadership Lab',
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    tag: 'past',
  },
]

export default function MentorSessionsPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<MentorSession[]>(dummySessions)
  const [activeTab, setActiveTab] = useState<SessionTag>('today')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessions = async () => {
      const storedUser = localStorage.getItem('user')
      const user = storedUser ? JSON.parse(storedUser) : null
      const mentorId =
        user?.id ?? user?.userId ?? user?._id ?? user?.mentorId ?? null
      if (!mentorId) return

      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${API_URL}/mentors/${mentorId}/sessions`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        )
        const data = await response.json()
        if (data?.success && Array.isArray(data.sessions)) {
          setSessions(
            data.sessions.map((s: any) => ({
              topicMentorId: s.topicMentorId,
              topicId: s.topicId,
              topicTitle: s.topicTitle,
              programId: s.programId,
              programTitle: s.programTitle,
              startDate: s.startDate,
              endDate: s.endDate,
              tag: (s.tag || 'today') as SessionTag,
            }))
          )
        } else {
          throw new Error(data?.message || 'Failed to load sessions')
        }
      } catch (err) {
        console.error(err)
        setError('Unable to load sessions. Showing sample data.')
        setSessions(dummySessions)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const stats = useMemo(() => {
    const counts = { today: 0, upcoming: 0, past: 0 }
    sessions.forEach((s) => {
      if (s.tag === 'today') counts.today += 1
      if (s.tag === 'upcoming') counts.upcoming += 1
      if (s.tag === 'past') counts.past += 1
    })
    return counts
  }, [sessions])

  const filteredSessions = sessions.filter((s) => s.tag === activeTab)

  const formatDate = (value: string) => {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return 'Unknown'
    return d.toLocaleString()
  }

  return (
    <div className='flex-1 p-4 md:p-8 pt-16 md:pt-8 max-w-[1200px] mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold'>Sessions</h1>
          <p className='text-muted-foreground'>
            Track today&apos;s, upcoming, and past sessions.
          </p>
        </div>
        <Button variant='ghost' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>
              Today&apos;s Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{stats.today}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{stats.upcoming}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>
              Past Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{stats.past}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue='today'
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as SessionTag)}
      >
        <TabsList>
          <TabsTrigger value='today'>Today</TabsTrigger>
          <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
          <TabsTrigger value='past'>Past</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className='mt-4 space-y-3'>
          {error && (
            <p className='text-xs text-red-600'>
              {error} ({sessions.length} session
              {sessions.length === 1 ? '' : 's'} loaded)
            </p>
          )}
          {isLoading ? (
            <p className='text-sm text-muted-foreground'>Loading sessions...</p>
          ) : filteredSessions.length === 0 ? (
            <Card>
              <CardContent className='py-8 text-center space-y-2'>
                <Users className='h-8 w-8 text-muted-foreground mx-auto' />
                <p className='text-muted-foreground'>No sessions found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredSessions.map((session) => (
              <Card key={session.topicMentorId}>
                <CardContent className='p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <Badge variant='secondary'>{session.tag}</Badge>
                      <p className='font-semibold'>{session.topicTitle}</p>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {session.programTitle}
                    </p>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                      <span className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        {formatDate(session.startDate)}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-4 w-4' />
                        Ends {formatDate(session.endDate)}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Link
                      href={`/mentor/dashboard/programs/${session.programId}`}
                      className='text-sm text-blue-600 hover:underline'
                    >
                      View Program
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
