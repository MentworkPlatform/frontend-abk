'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Users,
  BookOpen,
  Eye,
  ArrowRight,
  Calendar,
  Clock,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DashboardHeader } from '@/components/dashboard-header'
import { ApiError, apiClient, getAuthToken } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'
import {
  type WalletTransactionReason,
  type WalletTransactionType,
  walletApi,
} from '@/lib/wallet'

type ProgramStatus = 'active' | 'draft' | 'published'

type DashboardProgram = {
  id: string
  draftProgramId?: string
  title: string
  participants: number
  mentors: number
  status: ProgramStatus
  startDate: string | null
  hasLMS: boolean
}

type WalletRecord = {
  balance: number
  currency: string
}

type DashboardWalletTransaction = {
  id: string
  amount: number
  type: WalletTransactionType
  reason: WalletTransactionReason | string
  createdAt: string
  narration?: string
}

type PaystackPopupInstance = {
  newTransaction: (options: {
    key: string
    email: string
    amount: number
    currency?: string
    reference?: string
    metadata?: Record<string, unknown>
    onSuccess?: (response: { reference?: string; trxref?: string }) => void
    onCancel?: () => void
    onError?: (response: {
      message?: string
      reference?: string
      trxref?: string
    }) => void
  }) => void
}

type PaystackPopupConstructor = new () => PaystackPopupInstance

const upcomingSessions = [
  {
    id: 1,
    programId: '1',
    programTitle: 'Digital Marketing Bootcamp',
    topic: 'Topic 5: Social Media Strategy',
    time: 'Today, 3:00 PM',
    duration: '90 minutes',
    participants: 25,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    meetingId: '123-456-789',
  },
  {
    id: 2,
    programId: '2',
    programTitle: 'Leadership Excellence Program',
    topic: 'Topic 8: Team Building',
    time: 'Tomorrow, 11:00 AM',
    duration: '120 minutes',
    participants: 18,
    meetingLink: 'https://zoom.us/j/123456789',
    meetingId: '123 456 789',
  },
  {
    id: 3,
    programId: '1',
    programTitle: 'Digital Marketing Bootcamp',
    topic: 'Topic 6: Content Marketing',
    time: 'Friday, 3:00 PM',
    duration: '90 minutes',
    participants: 25,
    meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
    meetingId: '987-654-321',
  },
]

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

    if (typeof value === 'number') {
      return value.toString()
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
      const numericValue = Number(value)

      if (!Number.isNaN(numericValue)) {
        return numericValue
      }
    }

    if (Array.isArray(value)) {
      return value.length
    }
  }

  return 0
}

const extractProgramsArray = (payload: unknown) => {
  if (Array.isArray(payload)) {
    return payload
  }

  const root = asObject(payload)

  if (!root) {
    return []
  }

  const candidates: unknown[] = [
    root.data,
    root.programs,
    root.draftPrograms,
    root.drafts,
    root.draft,
    root.program,
    root.item,
    root.result,
    root.results,
    root.items,
    root.payload,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
    }

    const nested = asObject(candidate)

    if (!nested) {
      continue
    }

    const nestedCandidates: unknown[] = [
      nested.data,
      nested.programs,
      nested.draftPrograms,
      nested.drafts,
      nested.draft,
      nested.program,
      nested.item,
      nested.result,
      nested.results,
      nested.items,
    ]

    for (const nestedCandidate of nestedCandidates) {
      if (Array.isArray(nestedCandidate)) {
        return nestedCandidate
      }

      if (nestedCandidate && typeof nestedCandidate === 'object') {
        return [nestedCandidate]
      }
    }

    return [nested]
  }

  return []
}

const extractWalletRecord = (payload: unknown): WalletRecord => {
  const root = asObject(payload)
  const dataRecord = asObject(root?.data)
  const walletRecord =
    asObject(root?.wallet) ??
    asObject(dataRecord?.wallet) ??
    dataRecord ??
    root ??
    {}

  const summaryRecord = asObject(walletRecord.summary)
  const balance = pickNumber(
    walletRecord.balance,
    walletRecord.walletBalance,
    walletRecord.availableBalance,
    walletRecord.available_balance,
    walletRecord.amount,
    summaryRecord?.balance,
    summaryRecord?.availableBalance,
  )
  const currency =
    pickString(
      walletRecord.currency,
      walletRecord.currencyCode,
      walletRecord.currency_code,
      summaryRecord?.currency,
    ) ?? 'NGN'

  return { balance, currency }
}

const extractWalletTransactionsArray = (payload: unknown) => {
  const root = asObject(payload)
  const dataRecord = asObject(root?.data)
  const transactionGroups: unknown[] = [
    root?.transactions,
    root?.items,
    dataRecord?.transactions,
    dataRecord?.items,
    dataRecord?.results,
    dataRecord?.rows,
    root?.results,
    root?.rows,
  ]

  for (const group of transactionGroups) {
    if (Array.isArray(group)) {
      return group
    }
  }

  if (Array.isArray(payload)) {
    return payload
  }

  return []
}

const mapWalletTransaction = (
  rawTransaction: unknown,
): DashboardWalletTransaction | null => {
  const record = asObject(rawTransaction)

  if (!record) {
    return null
  }

  const id = pickString(record.id, record.reference, record.transactionId)

  if (!id) {
    return null
  }

  const typeValue = pickString(record.type, record.transactionType)
  const normalizedType = (typeValue ?? '').toUpperCase()
  const type: WalletTransactionType =
    normalizedType === 'DEBIT' ? 'DEBIT' : 'CREDIT'
  const amount = pickNumber(record.amount, record.value, record.total)
  const reason =
    pickString(record.reason, record.transactionReason, record.category) ??
    'ADJUSTMENT'
  const createdAt =
    pickString(
      record.createdAt,
      record.created_at,
      record.transactionDate,
      record.date,
    ) ?? new Date().toISOString()
  const narration = pickString(
    record.narration,
    record.description,
    record.note,
  )

  return {
    id,
    amount,
    type,
    reason,
    createdAt,
    narration: narration ?? undefined,
  }
}

const getUserEmailFallback = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const authToken = getAuthToken()

  if (authToken) {
    try {
      const tokenPayload = authToken.split('.')[1] ?? ''
      const normalizedPayload = tokenPayload
        .replace(/-/g, '+')
        .replace(/_/g, '/')
      const paddedPayload =
        normalizedPayload +
        '='.repeat((4 - (normalizedPayload.length % 4)) % 4)
      const parsedToken = JSON.parse(window.atob(paddedPayload))
      const tokenRecord = asObject(parsedToken)
      const tokenEmail =
        pickString(
          tokenRecord?.email,
          tokenRecord?.upn,
          tokenRecord?.preferred_username,
          asObject(tokenRecord?.user)?.email,
          asObject(tokenRecord?.data)?.email,
        ) ??
        (typeof tokenRecord?.sub === 'string' && tokenRecord.sub.includes('@')
          ? tokenRecord.sub
          : null)

      if (tokenEmail) {
        return tokenEmail
      }
    } catch {
      // Fall back to persisted profile blobs when token payload cannot be parsed.
    }
  }

  const candidates = ['user', 'profile', 'authUser']

  for (const key of candidates) {
    const rawValue = window.localStorage.getItem(key)

    if (!rawValue) {
      continue
    }

    try {
      const parsedValue = JSON.parse(rawValue)
      const parsedRecord = asObject(parsedValue)

      const email =
        pickString(
          parsedRecord?.email,
          asObject(parsedRecord?.user)?.email,
          asObject(parsedRecord?.data)?.email,
        ) ?? null

      if (email) {
        return email
      }
    } catch {
      continue
    }
  }

  return null
}

const countMentorsFromCurriculum = (curriculum: unknown) => {
  if (!Array.isArray(curriculum)) {
    return 0
  }

  const mentorKeys = new Set<string>()

  for (const moduleItem of curriculum) {
    const moduleRecord = asObject(moduleItem)
    const topics = moduleRecord?.topics

    if (!Array.isArray(topics)) {
      continue
    }

    for (const topic of topics) {
      const topicRecord = asObject(topic)
      const mentors = topicRecord?.mentors

      if (!Array.isArray(mentors)) {
        continue
      }

      for (const mentor of mentors) {
        const mentorRecord = asObject(mentor)

        if (!mentorRecord) {
          continue
        }

        const mentorKey =
          pickString(mentorRecord.id, mentorRecord.email, mentorRecord.name) ??
          ''

        if (mentorKey.length > 0) {
          mentorKeys.add(mentorKey)
        }
      }
    }
  }

  return mentorKeys.size
}

const hasCurriculumTopics = (curriculum: unknown) => {
  if (!Array.isArray(curriculum)) {
    return false
  }

  return curriculum.some((moduleItem) => {
    const moduleRecord = asObject(moduleItem)
    const topics = moduleRecord?.topics

    return Array.isArray(topics) && topics.length > 0
  })
}

const isDraftProgramInCreation = (program: Record<string, unknown>) => {
  if (program.isPublished === true) {
    return false
  }

  if (program.isDraft === true) {
    return true
  }

  const statusValue = pickString(
    program.status,
    program.programStatus,
    program.program_status,
  )
  const normalizedStatus = statusValue?.toLowerCase() ?? ''

  if (normalizedStatus.includes('draft')) {
    return true
  }

  if (normalizedStatus.includes('publish')) {
    return false
  }

  const hasScheduleWindow = Boolean(
    pickString(
      program.startDate,
      program.start_date,
      program.endDate,
      program.end_date,
    ),
  )

  if (hasScheduleWindow) {
    return false
  }

  const hasMentorAssignments =
    Array.isArray(program.mentorAssignments) &&
    program.mentorAssignments.length > 0

  if (hasMentorAssignments) {
    return false
  }

  if (countMentorsFromCurriculum(program.curriculum) > 0) {
    return false
  }

  if (hasCurriculumTopics(program.curriculum)) {
    return false
  }

  return program.isPublished === false || normalizedStatus.includes('active')
}

const resolveProgramStatus = (
  program: Record<string, unknown>,
  fallbackStatus: ProgramStatus,
): ProgramStatus => {
  if (program.isPublished === true) {
    return 'published'
  }

  if (isDraftProgramInCreation(program)) {
    return 'draft'
  }

  if (
    program.isCompleted === true ||
    typeof program.completedAt === 'string' ||
    typeof program.completed_at === 'string'
  ) {
    return 'published'
  }

  const statusValue = pickString(
    program.status,
    program.programStatus,
    program.program_status,
  )

  if (!statusValue) {
    return fallbackStatus
  }

  const normalized = statusValue.toLowerCase()

  if (normalized.includes('draft')) {
    return 'draft'
  }

  if (
    normalized.includes('complete') ||
    normalized.includes('archived') ||
    normalized.includes('done') ||
    normalized.includes('ended')
  ) {
    return 'published'
  }

  if (normalized.includes('published')) {
    return 'published'
  }

  return 'active'
}

const mapProgram = (
  rawProgram: unknown,
  fallbackStatus: ProgramStatus = 'active',
): DashboardProgram | null => {
  const rawRecord = asObject(rawProgram)

  if (!rawRecord) {
    return null
  }

  const nestedProgramData = asObject(rawRecord.data)
  const program = nestedProgramData
    ? ({
        ...rawRecord,
        ...nestedProgramData,
      } as Record<string, unknown>)
    : rawRecord

  const stats = asObject(program.stats)
  const mentorAssignments = Array.isArray(program.mentorAssignments)
    ? program.mentorAssignments
    : []

  const draftProgramId = pickString(program.programId, program.program_id)
  const id =
    fallbackStatus === 'draft'
      ? pickString(draftProgramId, program.id)
      : pickString(program.id, draftProgramId)

  if (!id) {
    return null
  }

  const title =
    pickString(
      program.title,
      program.name,
      program.programTitle,
      program.slug,
    ) ?? 'Untitled Program'

  return {
    id,
    draftProgramId: draftProgramId ?? undefined,
    title,
    participants: pickNumber(
      program.participants,
      program.participantCount,
      program.totalParticipants,
      program.enrollmentCount,
      program.enrolled,
      program.maxParticipant,
      program.maxParticipants,
      stats?.participants,
      stats?.participantCount,
    ),
    mentors: pickNumber(
      program.mentorsCount,
      program.mentorCount,
      program.totalMentors,
      program.mentors,
      mentorAssignments,
      countMentorsFromCurriculum(program.curriculum),
      stats?.mentors,
      stats?.mentorCount,
    ),
    status: resolveProgramStatus(program, fallbackStatus),
    startDate: pickString(
      program.startDate,
      program.start_date,
      program.created_at,
      program.createdAt,
    ),
    hasLMS: Boolean(
      program.hasLMS ??
      program.has_lms ??
      program.lmsEnabled ??
      program.lms_enabled,
    ),
  }
}

const mergePrograms = (
  detailedPrograms: DashboardProgram[],
  draftPrograms: DashboardProgram[],
) => {
  const programMap = new Map<string, DashboardProgram>()

  for (const program of detailedPrograms) {
    programMap.set(program.id, program)
  }

  for (const draftProgram of draftPrograms) {
    const existingProgram = programMap.get(draftProgram.id)

    if (!existingProgram) {
      programMap.set(draftProgram.id, draftProgram)
      continue
    }

    programMap.set(draftProgram.id, {
      ...existingProgram,
      ...draftProgram,
      participants: Math.max(
        existingProgram.participants,
        draftProgram.participants,
      ),
      mentors: Math.max(existingProgram.mentors, draftProgram.mentors),
      status: 'draft',
      startDate: existingProgram.startDate ?? draftProgram.startDate,
      hasLMS: existingProgram.hasLMS || draftProgram.hasLMS,
    })
  }

  return Array.from(programMap.values()).sort((a, b) =>
    a.title.localeCompare(b.title),
  )
}

export default function TrainerDashboard() {
  const [programs, setPrograms] = useState<DashboardProgram[]>([])
  const [isProgramsLoading, setIsProgramsLoading] = useState(true)
  const [programsError, setProgramsError] = useState<string | null>(null)
  const [wallet, setWallet] = useState<WalletRecord>({
    balance: 0,
    currency: 'NGN',
  })

  const [walletTransactions, setWalletTransactions] = useState<
    DashboardWalletTransaction[]
  >([])
  const [isWalletLoading, setIsWalletLoading] = useState(true)
  const [walletError, setWalletError] = useState<string | null>(null)
  const [showTopupDialog, setShowTopupDialog] = useState(false)
  const [topupAmount, setTopupAmount] = useState('')
  const [topupEmail, setTopupEmail] = useState(
    () => getUserEmailFallback() ?? '',
  )
  const [topupReason, setTopupReason] = useState('')
  const [isTopupLoading, setIsTopupLoading] = useState(false)
  const [paystackPopupConstructor, setPaystackPopupConstructor] =
    useState<PaystackPopupConstructor | null>(null)

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: wallet.currency || 'NGN',
        maximumFractionDigits: 2,
      }),
    [wallet.currency],
  )

  const fetchPrograms = useCallback(async () => {
    setIsProgramsLoading(true)
    setProgramsError(null)

    try {
      const [detailsResult, draftsResult] = await Promise.allSettled([
        apiClient.get<unknown>('/programs/details'),
        apiClient.get<unknown>('/programs/drafts'),
      ])

      const detailsPrograms =
        detailsResult.status === 'fulfilled'
          ? extractProgramsArray(detailsResult.value)
              .map((program) => mapProgram(program))
              .filter((program): program is DashboardProgram =>
                Boolean(program),
              )
          : []

      const onlyDraftPrograms =
        draftsResult.status === 'fulfilled'
          ? (extractProgramsArray(draftsResult.value)
              .map((program) => {
                const mappedProgram = mapProgram(program, 'draft')

                if (!mappedProgram) {
                  return null
                }

                return {
                  ...mappedProgram,
                  status: 'draft' as const,
                }
              })
              .filter((program) => Boolean(program)) as DashboardProgram[])
          : []

      if (
        detailsResult.status === 'rejected' &&
        draftsResult.status === 'rejected'
      ) {
        throw detailsResult.reason
      }

      setPrograms(mergePrograms(detailsPrograms, onlyDraftPrograms))
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Unable to load programs.'

      setProgramsError(message)
    } finally {
      setIsProgramsLoading(false)
    }
  }, [])

  const fetchWallet = useCallback(async () => {
    setIsWalletLoading(true)
    setWalletError(null)

    try {
      const [walletResult, transactionsResult] = await Promise.allSettled([
        walletApi.getMyWallet<unknown>(),
        walletApi.getMyWalletTransactions<unknown>({
          page: 1,
          limit: 20,
        }),
      ])

      if (
        walletResult.status === 'rejected' &&
        transactionsResult.status === 'rejected'
      ) {
        throw walletResult.reason
      }

      if (walletResult.status === 'fulfilled') {
        setWallet(extractWalletRecord(walletResult.value))
      }

      if (transactionsResult.status === 'fulfilled') {
        const mappedTransactions = extractWalletTransactionsArray(
          transactionsResult.value,
        )
          .map((transaction) => mapWalletTransaction(transaction))
          .filter((transaction): transaction is DashboardWalletTransaction =>
            Boolean(transaction),
          )

        setWalletTransactions(mappedTransactions)
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Unable to load wallet.'

      setWalletError(message)
    } finally {
      setIsWalletLoading(false)
    }
  }, [])

  const handleTopup = useCallback(() => {
    const amount = Number(topupAmount)
    const email = topupEmail.trim()
    const reason = topupReason.trim()

    if (!Number.isFinite(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Enter an amount greater than 0.',
        variant: 'destructive',
      })
      return
    }

    if (!email) {
      toast({
        title: 'Email not found',
        description: 'Unable to resolve your logged-in email. Sign in again.',
        variant: 'destructive',
      })
      return
    }

    if (!email.includes('@')) {
      toast({
        title: 'Email required',
        description: 'Enter a valid email to continue with Paystack.',
        variant: 'destructive',
      })
      return
    }

    if (!reason) {
      toast({
        title: 'Reason required',
        description: 'Please provide a reason for this wallet top-up.',
        variant: 'destructive',
      })
      return
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim() ?? ''

    if (!publicKey) {
      toast({
        title: 'Paystack key missing',
        description:
          'Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in your environment.',
        variant: 'destructive',
      })
      return
    }

    if (!paystackPopupConstructor) {
      toast({
        title: 'Payment not ready',
        description: 'Paystack is still loading. Please try again.',
        variant: 'destructive',
      })
      return
    }

    setIsTopupLoading(true)

    const amountKobo = Math.round(amount * 100)
    const reference = `wallet-topup-${Date.now()}`
    const currency = wallet.currency || 'NGN'
    const reportTopupStatus = async (
      status: 'SUCCESS' | 'FAILED' | 'CANCELLED',
      payload: {
        reference?: string
        gatewayResponse?: string
      } = {},
    ) => {
      try {
        await walletApi.topUp({
          amount,
          currency,
          paymentMethod: 'paystack',
          email,
          reference: payload.reference ?? reference,
          status,
          gateway: 'paystack',
          gatewayResponse: payload.gatewayResponse,
          metadata: {
            source: 'trainer-dashboard-wallet-topup',
            reason,
          },
        })

        if (status === 'SUCCESS') {
          await fetchWallet()
        }
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : 'Could not sync payment status to backend.'

        toast({
          title: 'Sync failed',
          description: message,
          variant: 'destructive',
        })
      }
    }

    const launchPaystack = () => {
      try {
        const popup = new paystackPopupConstructor()
        popup.newTransaction({
          key: publicKey,
          email,
          amount: amountKobo,
          currency,
          reference,
          metadata: {
            source: 'trainer-dashboard-wallet-topup',
            reason,
          },
          onSuccess: (response) => {
            const paymentReference =
              response.reference ?? response.trxref ?? reference
            void reportTopupStatus('SUCCESS', {
              reference: paymentReference,
            })

            toast({
              title: 'Payment successful',
              description: 'Payment completed via Paystack.',
            })
            setTopupAmount('')
            setTopupReason('')
            setIsTopupLoading(false)
          },
          onCancel: () => {
            void reportTopupStatus('FAILED', {
              reference,
              gatewayResponse: 'Payment cancelled by user.',
            })

            toast({
              title: 'Payment cancelled',
              description: 'You can try funding your wallet again.',
            })
            setIsTopupLoading(false)
          },
          onError: (response) => {
            const errorMessage =
              response.message ?? 'Unable to complete payment.'
            const paymentReference =
              response.reference ?? response.trxref ?? reference

            void reportTopupStatus('FAILED', {
              reference: paymentReference,
              gatewayResponse: errorMessage,
            })

            toast({
              title: 'Payment failed',
              description: errorMessage,
              variant: 'destructive',
            })
            setIsTopupLoading(false)
          },
        })
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : 'Unable to initialize Paystack.'

        toast({
          title: 'Payment failed',
          description: message,
          variant: 'destructive',
        })
        setIsTopupLoading(false)
      }
    }

    setShowTopupDialog(false)
    window.setTimeout(launchPaystack, 150)
  }, [
    fetchWallet,
    paystackPopupConstructor,
    topupAmount,
    topupEmail,
    topupReason,
    wallet.currency,
  ])

  useEffect(() => {
    void fetchPrograms()
  }, [fetchPrograms])

  useEffect(() => {
    void fetchWallet()
  }, [fetchWallet])

  useEffect(() => {
    let isMounted = true

    void import('@paystack/inline-js')
      .then((module) => {
        if (!isMounted) {
          return
        }

        setPaystackPopupConstructor(
          () => module.default as unknown as PaystackPopupConstructor,
        )
      })
      .catch(() => {
        if (!isMounted) {
          return
        }

        setPaystackPopupConstructor(null)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const activePrograms = useMemo(
    () => programs.filter((program) => program.status === 'active'),
    [programs],
  )
  const draftPrograms = useMemo(
    () => programs.filter((program) => program.status === 'draft'),
    [programs],
  )
  const publishedPrograms = useMemo(
    () => programs.filter((program) => program.status === 'published'),
    [programs],
  )

  const getStatusColor = (status: ProgramStatus) => {
    return status === 'active' ? 'default' : 'secondary'
  }

  const renderPrograms = (
    statusPrograms: DashboardProgram[],
    emptyMessage: string,
  ) => {
    if (isProgramsLoading) {
      return (
        <div className='rounded-lg border border-dashed p-6 text-sm text-muted-foreground'>
          Loading programs...
        </div>
      )
    }

    if (programsError) {
      return (
        <div className='rounded-lg border border-destructive/40 bg-destructive/5 p-4'>
          <p className='text-sm text-destructive'>{programsError}</p>
          <Button
            variant='outline'
            size='sm'
            className='mt-3'
            onClick={() => {
              void fetchPrograms()
            }}
          >
            Retry
          </Button>
        </div>
      )
    }

    if (statusPrograms.length === 0) {
      return (
        <div className='rounded-lg border border-dashed p-6 text-sm text-muted-foreground'>
          {emptyMessage}
        </div>
      )
    }

    return (
      <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {statusPrograms.map((program) => {
          const resumeProgramId = program.draftProgramId ?? program.id
          const programHref =
            program.status === 'draft'
              ? `/trainer/dashboard/programs/create?programId=${encodeURIComponent(resumeProgramId)}&id=${encodeURIComponent(resumeProgramId)}`
              : `/trainer/dashboard/programs/${program.id}`
          const actionLabel =
            program.status === 'draft'
              ? 'Continue Draft'
              : program.status === 'active'
                ? 'Manage Program'
                : 'View Program'

          return (
            <Card
              key={program.id}
              className={`hover:shadow-md transition-shadow cursor-pointer ${program.status === 'active' ? '' : 'opacity-75'}`}
            >
              <CardHeader className='p-4 pb-2'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <Avatar className='h-9 w-9 shrink-0'>
                      <AvatarImage
                        src='/placeholder.svg?height=40&width=40'
                        alt='Program'
                      />
                      <AvatarFallback className='text-xs'>
                        {program.title
                          .split(' ')
                          .filter(Boolean)
                          .map((word) => word[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0'>
                      <CardTitle className='text-base font-semibold leading-tight'>
                        {program.title}
                      </CardTitle>
                      <Badge
                        variant={getStatusColor(program.status)}
                        className='mt-1 text-xs'
                      >
                        {program.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <div className='flex items-center justify-between text-sm text-muted-foreground mb-3'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center'>
                      <Users className='h-4 w-4 mr-1' />
                      {program.participants}
                    </div>
                    <div className='flex items-center'>
                      <BookOpen className='h-4 w-4 mr-1' />
                      {program.mentors} mentors
                    </div>
                  </div>
                </div>
                <Link href={programHref}>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full bg-transparent h-8 text-xs sm:text-sm'
                  >
                    <Eye className='mr-1.5 h-3.5 w-3.5' />
                    {actionLabel}
                    <ArrowRight className='ml-1.5 h-3.5 w-3.5' />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        title='Trainer Dashboard'
        description='Manage your programs, sessions, and mentors'
        actionButton={{
          label: 'Create Program',
          href: '/trainer/dashboard/programs/create',
          icon: Plus,
        }}
      />
      <div className='w-full pt-2 space-y-4 sm:space-y-6 md:px-6 md:pt-5 md:pb-5'>
        <Card>
          <CardHeader className='p-4 pb-2'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='flex items-center gap-2 text-base font-semibold sm:text-lg'>
                  <Wallet className='h-4 w-4 sm:h-5 sm:w-5' />
                  Wallet Balance
                </CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  Manage your wallet and recent transactions
                </CardDescription>
              </div>

              <Dialog
                open={showTopupDialog}
                onOpenChange={(isOpen) => {
                  setShowTopupDialog(isOpen)

                  if (isOpen) {
                    setTopupEmail(getUserEmailFallback() ?? '')
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className='bg-[#FFD500] text-black hover:bg-[#e6c000]'>
                    Add To Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add To Wallet</DialogTitle>
                    <DialogDescription>
                      Enter the amount you want to top up.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='topup-email'>Email</Label>
                      <Input
                        id='topup-email'
                        type='email'
                        value={topupEmail}
                        readOnly
                        placeholder='Logged in user email'
                        className='bg-muted'
                      />
                      <p className='text-xs text-muted-foreground'>
                        Using your currently logged-in email.
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='topup-amount'>
                        Amount ({wallet.currency})
                      </Label>
                      <Input
                        id='topup-amount'
                        type='number'
                        min='1'
                        value={topupAmount}
                        onChange={(event) => setTopupAmount(event.target.value)}
                        placeholder='e.g. 50000'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='topup-reason'>Reason</Label>
                      <Input
                        id='topup-reason'
                        type='text'
                        value={topupReason}
                        onChange={(event) => setTopupReason(event.target.value)}
                        placeholder='e.g. Wallet funding for mentor payouts'
                      />
                    </div>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        onClick={() => setShowTopupDialog(false)}
                        disabled={isTopupLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          void handleTopup()
                        }}
                        disabled={isTopupLoading}
                        className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
                      >
                        {isTopupLoading ? 'Processing...' : 'Add Wallet'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className='p-4 pt-0'>
            {walletError ? (
              <div className='rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive'>
                {walletError}
              </div>
            ) : null}

            <div className='mb-4 rounded-lg border bg-gray-50 p-4'>
              <p className='text-xs text-muted-foreground'>Available Balance</p>
              <p className='mt-1 text-2xl font-semibold text-gray-900'>
                {isWalletLoading
                  ? 'Loading...'
                  : currencyFormatter.format(wallet.balance)}
              </p>
            </div>

            <div className='space-y-2'>
              <p className='text-sm font-medium text-gray-900'>
                Recent Transactions
              </p>
              {walletTransactions.length === 0 ? (
                <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
                  No wallet transactions yet.
                </div>
              ) : (
                <div className='space-y-2'>
                  {walletTransactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className='flex items-center justify-between rounded-lg border p-3'
                    >
                      <div className='flex items-center gap-2'>
                        {transaction.type === 'CREDIT' ? (
                          <ArrowDownCircle className='h-4 w-4 text-green-600' />
                        ) : (
                          <ArrowUpCircle className='h-4 w-4 text-red-600' />
                        )}
                        <div>
                          <p className='text-sm font-medium text-gray-900'>
                            {transaction.reason}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {new Date(transaction.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-sm font-semibold ${
                          transaction.type === 'CREDIT'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'CREDIT' ? '+' : '-'}
                        {currencyFormatter.format(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='p-4 pb-2'>
            <CardTitle className='text-base font-semibold sm:text-lg'>
              All Programs
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              View and manage all your programs
            </CardDescription>
          </CardHeader>
          <CardContent className='p-4 pt-0'>
            <Tabs defaultValue='active' className='w-full'>
              <TabsList className='grid w-full grid-cols-3 h-9'>
                <TabsTrigger value='active' className='text-xs sm:text-sm'>
                  Active ({activePrograms.length})
                </TabsTrigger>
                <TabsTrigger value='draft' className='text-xs sm:text-sm'>
                  Draft ({draftPrograms.length})
                </TabsTrigger>
                <TabsTrigger value='published' className='text-xs sm:text-sm'>
                  Published ({publishedPrograms.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value='active' className='mt-4'>
                {renderPrograms(
                  activePrograms,
                  'No active programs yet. Create one to get started.',
                )}
              </TabsContent>

              <TabsContent value='draft' className='mt-4'>
                {renderPrograms(draftPrograms, 'No draft programs found.')}
              </TabsContent>

              <TabsContent value='published' className='mt-4'>
                {renderPrograms(
                  publishedPrograms,
                  'No published programs yet.',
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='p-4 pb-2'>
            <CardTitle className='flex items-center gap-2 text-base font-semibold sm:text-lg'>
              <Calendar className='h-4 w-4 sm:h-5 sm:w-5' />
              Your Upcoming Sessions
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              Next sessions scheduled with meeting links
            </CardDescription>
          </CardHeader>
          <CardContent className='p-4 pt-0'>
            <div className='space-y-3'>
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className='flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-gray-50 gap-3'
                >
                  <Link
                    href={`/trainer/dashboard/programs/${session.programId}/lms`}
                    className='flex-1 cursor-pointer'
                  >
                    <div className='flex items-center gap-2 mb-1 flex-wrap'>
                      <h4 className='font-medium hover:text-[#FFD500] transition-colors'>
                        {session.programTitle}
                      </h4>
                      <Badge variant='outline' className='text-xs'>
                        {session.topic}
                      </Badge>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-4 w-4' />
                        {session.time} ({session.duration})
                      </div>
                      <div className='flex items-center gap-1'>
                        <Users className='h-4 w-4' />
                        {session.participants} participants
                      </div>
                    </div>
                  </Link>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto'>
                    <div className='text-right text-sm'>
                      <p className='font-mono text-xs text-muted-foreground'>
                        ID: {session.meetingId}
                      </p>
                    </div>
                    <Button
                      size='sm'
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        window.open(session.meetingLink, '_blank')
                      }}
                      className='bg-[#FFD500] hover:bg-[#e6c000] w-full sm:w-auto'
                    >
                      Join Meeting
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
