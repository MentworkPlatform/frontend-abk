'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Loader2,
  Lock,
  AlertCircle,
  Check,
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { API_URL } from '@/components/Serverurl'

type ProgramModule = {
  id: string | number
  title: string
  description?: string
  order?: number
  topics: ProgramTopic[]
}

type ProgramTopic = {
  id: string | number
  title: string
  description?: string
  duration?: number
  order?: number
  type?: string
}

type MentorAssignment = {
  id: string | number
  topicId: string | number
  topicTitle: string
  mentor?: {
    name?: string
    profile?: { profile_picture_url?: string; bio?: string }
  }
  proposedRate?: number
  feedbacklink?: string
  status?: string
  rejectionMessage?: string
  customMessage?: string
}

export default function EditTrainerProgramPage() {
  const params = useParams()
  const router = useRouter()
  const programId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [programError, setProgramError] = useState<string | null>(null)
  const [programMeta, setProgramMeta] = useState({
    title: '',
    tagline: '',
    description: '',
    price: '',
    duration: '',
    level: '',
    category: '',
  })
  const [modules, setModules] = useState<ProgramModule[]>([])
  const [assignments, setAssignments] = useState<MentorAssignment[]>([])
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const applyPendingReassign = (base: MentorAssignment[]) => {
    try {
      const stored = localStorage.getItem('pending-mentor-reassign')
      if (!stored) return base
      const parsed = JSON.parse(stored)
      if (!parsed?.topicId || !parsed?.mentor) return base

      let updated = false
      const next = base.map((a) => {
        if (String(a.topicId) === String(parsed.topicId)) {
          updated = true
          return {
            ...a,
            mentor: parsed.mentor,
            proposedRate: parsed.proposedRate ?? a.proposedRate,
            customMessage: parsed.customMessage ?? a.customMessage,
            topicTitle: parsed.topicTitle ?? a.topicTitle,
            status: 'PENDING',
          }
        }
        return a
      })

      if (!updated) {
        next.push({
          id: `reassign-${parsed.topicId}`,
          topicId: parsed.topicId,
          topicTitle: parsed.topicTitle ?? '',
          mentor: parsed.mentor,
          proposedRate: parsed.proposedRate,
          customMessage: parsed.customMessage,
          status: 'PENDING',
        })
      }
      return next
    } catch (err) {
      console.error('Failed to apply pending mentor reassign', err)
      return base
    }
  }

  const lockedTopicIds = useMemo(() => {
    return new Set(
      assignments
        .filter((a) => {
          const status = (a.status || '').toString().trim().toUpperCase()
          return status !== 'REJECTED' && status !== 'DECLINED'
        })
        .map((a) => a.topicId)
    )
  }, [assignments])

  useEffect(() => {
    loadProgram()
  }, [programId])

  const loadProgram = async () => {
    setIsLoading(true)
    setProgramError(null)
    try {
      const response = await fetch(API_URL + `/programs/details/${programId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to load program (${response.status})`)
      }
      const data = await response.json()
      if (!data?.success || !data?.program) {
        throw new Error('Program not found')
      }

      const program = data.program
      setProgramMeta({
        title: program.title ?? '',
        tagline: program.tagline ?? '',
        description: program.description ?? '',
        price: program.price ?? '',
        duration: program.duration ?? '',
        level: program.level ?? '',
        category: program.category ?? '',
      })
      setModules(
        Array.isArray(program.curriculum)
          ? program.curriculum.map((m: any) => ({
              id: m.id ?? m.moduleId ?? m.title,
              title: m.title ?? '',
              description: m.description ?? '',
              order: m.order,
              topics: Array.isArray(m.topics)
                ? m.topics.map((t: any) => ({
                    id: t.id ?? t.topicId ?? t.title,
                    title: t.title ?? '',
                    description: t.description ?? '',
                    duration: t.duration ?? t.estimatedDuration,
                    order: t.order,
                    type: t.type,
                  }))
                : [],
            }))
          : []
      )
      const baseAssignments = program.mentorAssignments ?? []
      setAssignments(applyPendingReassign(baseAssignments))
    } catch (error) {
      console.error(error)
      setProgramError(
        error instanceof Error ? error.message : 'Unable to load program'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const updateModuleTopic = (
    moduleId: string | number,
    topicId: string | number,
    field: keyof ProgramTopic,
    value: string | number
  ) => {
    if (lockedTopicIds.has(topicId)) return
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId
          ? {
              ...mod,
              topics: mod.topics.map((topic) =>
                topic.id === topicId ? { ...topic, [field]: value } : topic
              ),
            }
          : mod
      )
    )
  }

  const updateFeedbackLink = (assignmentId: string | number, value: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId ? { ...a, feedbacklink: value } : a
      )
    )
  }

  const handleSave = async () => {
    setSaveError(null)
    setSaveSuccess(null)
    setIsSaving(true)

    console.log(assignments)

    try {
      const payload = {
        ...programMeta,
        curriculum: modules,
        mentorAssignments: assignments.map((a) => ({
          topicMentorId: a.id,
          feedbacklink: a.feedbacklink,
          topicId: a.topicId,
          proposedHourlyRate: a.proposedRate,
          customMessage: a.customMessage,
          mentorId: a.mentor ? (a.mentor as any).id : undefined,
        })),
      }

      const response = await fetch(`${API_URL}/programs/${programId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Save failed (${response.status})`)
      }
      const data = await response.json()
      if (data?.success === false) {
        throw new Error(data?.message || 'Unable to save program')
      }

      setSaveSuccess('Program updated successfully.')
      localStorage.removeItem('pending-mentor-reassign')
      await loadProgram()
    } catch (error) {
      console.error('Error saving program', error)
      setSaveError(
        error instanceof Error ? error.message : 'Something went wrong.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className='p-6'>
        <p>Loading program...</p>
      </div>
    )
  }

  if (programError) {
    return (
      <div className='p-6 space-y-3'>
        <Button
          variant='ghost'
          onClick={() => router.replace('/trainer/dashboard/programs')}
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center text-red-600 space-x-2'>
              <AlertCircle className='h-5 w-5' />
              <p>{programError}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='p-4 md:p-8 space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <Button variant='ghost' onClick={() => router.back()}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Button>
          <div>
            <h1 className='text-2xl font-bold'>Edit Program</h1>
            <p className='text-muted-foreground'>
              Update program details. Confirmed topics are locked except
              feedback links.
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
        >
          {isSaving ? (
            <>
              <Loader2 className='h-4 w-4 mr-2 animate-spin' /> Saving...
            </>
          ) : (
            <>
              <Save className='h-4 w-4 mr-2' />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {saveError && (
        <div className='rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700'>
          {saveError}
        </div>
      )}
      {saveSuccess && (
        <div className='rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700 flex items-center gap-2'>
          <Check className='h-4 w-4' />
          {saveSuccess}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Program Information</CardTitle>
          <CardDescription>General details visible to learners</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Title</label>
              <Input
                value={programMeta.title}
                onChange={(e) =>
                  setProgramMeta((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Tagline</label>
              <Input
                value={programMeta.tagline}
                onChange={(e) =>
                  setProgramMeta((prev) => ({
                    ...prev,
                    tagline: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Description</label>
            <Textarea
              rows={4}
              value={programMeta.description}
              onChange={(e) =>
                setProgramMeta((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className='grid md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Price</label>
              <Input
                value={programMeta.price}
                onChange={(e) =>
                  setProgramMeta((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Duration</label>
              <Input
                value={programMeta.duration}
                onChange={(e) =>
                  setProgramMeta((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Category</label>
              <Input
                value={programMeta.category}
                onChange={(e) =>
                  setProgramMeta((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum</CardTitle>
          <CardDescription>
            Topics with pending or confirmed mentors are locked. Only rejected
            assignments can be adjusted; feedback links remain editable.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {modules.map((module) => (
            <div key={module.id} className='border rounded-md'>
              <div className='p-4 border-b'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Module</p>
                    <h3 className='font-semibold'>{module.title}</h3>
                  </div>
                  <Badge variant='outline'>Module {module.order ?? ''}</Badge>
                </div>
                {module.description && (
                  <p className='text-sm text-muted-foreground mt-1'>
                    {module.description}
                  </p>
                )}
              </div>

              <div className='divide-y'>
                {module.topics.map((topic) => {
                  const locked = lockedTopicIds.has(topic.id)
                  const assignment = assignments.find(
                    (a) => a.topicId === topic.id
                  )

                  return (
                    <div key={topic.id} className='p-4 space-y-3'>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-1'>
                          <p className='text-xs text-muted-foreground'>Topic</p>
                          <div className='flex items-center gap-2'>
                            <Input
                              value={topic.title}
                              disabled={locked}
                              onChange={(e) =>
                                updateModuleTopic(
                                  module.id,
                                  topic.id,
                                  'title',
                                  e.target.value
                                )
                              }
                            />
                            {locked && (
                              <Badge
                                variant='secondary'
                                className='flex items-center gap-1'
                              >
                                <Lock className='h-3 w-3' />
                                Locked
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className='w-28'>
                          <label className='text-xs text-muted-foreground'>
                            Duration (mins)
                          </label>
                          <Input
                            type='number'
                            value={topic.duration ?? ''}
                            disabled={locked}
                            onChange={(e) =>
                              updateModuleTopic(
                                module.id,
                                topic.id,
                                'duration',
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <label className='text-xs text-muted-foreground'>
                          Description
                        </label>
                        <Textarea
                          rows={3}
                          value={topic.description ?? ''}
                          disabled={locked}
                          onChange={(e) =>
                            updateModuleTopic(
                              module.id,
                              topic.id,
                              'description',
                              e.target.value
                            )
                          }
                        />
                      </div>

                      {assignment && (
                        <div className='rounded-md border bg-muted/30 p-3 space-y-2'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <Avatar className='h-8 w-8'>
                                <AvatarImage
                                  src={
                                    assignment.mentor?.profile
                                      ?.profile_picture_url ||
                                    '/placeholder.svg'
                                  }
                                />
                                <AvatarFallback>
                                  {assignment.mentor?.name
                                    ?.split(' ')
                                    ?.map((n) => n[0])
                                    ?.join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className='text-sm font-medium'>
                                  {assignment.mentor?.name || 'Mentor'}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                  Status: {assignment.status || 'PENDING'}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                (assignment.status || '').toUpperCase() ===
                                'APPROVED'
                                  ? 'default'
                                  : (assignment.status || '').toUpperCase() ===
                                    'REJECTED'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {assignment.status || 'Pending'}
                            </Badge>
                          </div>
                          <div className='grid md:grid-cols-2 gap-3'>
                            <div className='space-y-1'>
                              <p className='text-xs text-muted-foreground'>
                                Proposed Rate
                              </p>
                              <p className='text-sm font-medium'>
                                ${assignment.proposedRate ?? '—'}/hr
                              </p>
                            </div>
                            <div className='space-y-1'>
                              <label className='text-xs text-muted-foreground'>
                                Feedback link (editable)
                              </label>
                              <Input
                                value={assignment.feedbacklink ?? ''}
                                onChange={(e) =>
                                  updateFeedbackLink(
                                    assignment.id,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          {assignment.rejectionMessage && (
                            <p className='text-xs text-red-600'>
                              Rejection note: {assignment.rejectionMessage}
                            </p>
                          )}
                          {['REJECTED', 'DECLINED'].includes(
                            (assignment.status || '')
                              .toString()
                              .trim()
                              .toUpperCase()
                          ) && (
                            <div className='flex flex-wrap gap-2'>
                              <Link
                                href={`/trainer/dashboard/programs/${programId}/mentors?topicId=${assignment.topicId}`}
                              >
                                <Button size='sm' variant='outline'>
                                  Change mentor for this topic
                                </Button>
                              </Link>
                            </div>
                          )}
                          {locked && (
                            <p className='text-xs text-muted-foreground'>
                              Topic details are locked while the mentor request
                              is pending or confirmed. You can still update the
                              feedback link.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {modules.length === 0 && (
            <p className='text-sm text-muted-foreground'>
              No curriculum found for this program.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mentor Assignments</CardTitle>
          <CardDescription>
            Confirmed mentors are locked. Only feedback links are editable.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {assignments.length === 0 && (
            <p className='text-sm text-muted-foreground'>
              No mentor assignments yet.
            </p>
          )}
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className='border rounded-md p-4 space-y-3'
            >
              <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage
                    src={
                      assignment.mentor?.profile?.profile_picture_url ||
                      '/placeholder.svg'
                    }
                  />
                  <AvatarFallback>
                    {assignment.mentor?.name
                      ?.split(' ')
                      ?.map((n) => n[0])
                      ?.join('')}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <p className='font-medium'>
                    {assignment.mentor?.name || 'Mentor'}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Topic: {assignment.topicTitle}
                  </p>
                </div>
                <Badge
                  variant={
                    (assignment.status || '').toUpperCase() === 'APPROVED'
                      ? 'default'
                      : (assignment.status || '').toUpperCase() === 'REJECTED'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {assignment.status || 'Pending'}
                </Badge>
              </div>
              <div className='grid md:grid-cols-2 gap-3'>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>
                    Proposed Rate
                  </p>
                  <p className='font-medium'>
                    ${assignment.proposedRate ?? '—'}/hr
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-xs text-muted-foreground'>Feedback link</p>
                  <Input
                    value={assignment.feedbacklink ?? ''}
                    onChange={(e) =>
                      updateFeedbackLink(assignment.id, e.target.value)
                    }
                  />
                </div>
              </div>
              {assignment.rejectionMessage && (
                <p className='text-xs text-red-600'>
                  Rejection note: {assignment.rejectionMessage}
                </p>
              )}
              {['REJECTED', 'DECLINED'].includes(
                (assignment.status || '').toString().trim().toUpperCase()
              ) ? (
                <div className='flex flex-wrap gap-2'>
                  <Link
                    href={`/trainer/dashboard/programs/${programId}/mentors?topicId=${assignment.topicId}`}
                  >
                    <Button size='sm' variant='outline'>
                      Change mentor for this topic
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className='text-xs text-muted-foreground flex items-center gap-1'>
                  <Lock className='h-3 w-3' />
                  Mentor and topic details are locked while pending/confirmed.
                  Update only the feedback link.
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <div className='flex items-center justify-between'>
        <Link href={`/trainer/dashboard/programs/${programId}`}>
          <Button variant='outline'>Cancel</Button>
        </Link>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
        >
          {isSaving ? (
            <>
              <Loader2 className='h-4 w-4 mr-2 animate-spin' /> Saving...
            </>
          ) : (
            <>
              <Save className='h-4 w-4 mr-2' />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
