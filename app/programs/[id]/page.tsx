"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
  CheckCircle,
  Award,
  Target,
  Share2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ApiError } from "@/lib/api-client"
import { getCurrentUserDetails } from "@/lib/current-user"
import { type ProgramFullEnrollmentPayload, programApi } from "@/lib/programs"

type ProgramTrainerViewModel = {
  id: string
  name: string
  title: string
  bio: string
  image: string
  rating: number
  totalStudents: number
  totalCourses: number
  expertise: string[]
  socialLinks: {
    linkedin: string
    twitter: string
    website: string
  }
}

type ProgramCurriculumModuleViewModel = {
  id: string
  title: string
  duration: string
  lessons: number
  topics: string[]
}

type ProgramReviewViewModel = {
  id: string
  student: string
  avatar: string
  rating: number
  date: string
  comment: string
}

type ProgramMentorViewModel = {
  id: string
  name: string
  title: string
  bio: string
  image: string
  rating: number
  expertise: string[]
}

type ProgramDetailViewModel = {
  id: string
  title: string
  tagline: string
  description: string
  longDescription: string
  type: string
  category: string
  level: string
  format: string
  duration: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  students: number
  modules: number
  totalHours: number
  language: string
  lastUpdated: string
  certificateIncluded: boolean
  freeSessionsIncluded: number
  sessions: number
  mentorCompensation: string
  trainer: ProgramTrainerViewModel
  skills: string[]
  learningOutcomes: string[]
  curriculum: ProgramCurriculumModuleViewModel[]
  prerequisites: string[]
  includes: string[]
  reviewList: ProgramReviewViewModel[]
  mentors: ProgramMentorViewModel[]
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

type PendingProgramEnrollment = {
  programId: string
  payload: ProgramFullEnrollmentPayload
  redirectPath: string
  createdAt: string
}

const PENDING_PROGRAM_ENROLLMENT_STORAGE_KEY = "pending-program-enrollment"

const asObject = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>
  }

  return null
}

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim()
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value)
    }
  }

  return null
}

const pickNumber = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value
    }

    if (typeof value === "string" && value.trim().length > 0) {
      const parsedValue = Number(value)

      if (!Number.isNaN(parsedValue)) {
        return parsedValue
      }
    }

    if (Array.isArray(value)) {
      return value.length
    }
  }

  return 0
}

const mapToStringArray = (...values: unknown[]) => {
  for (const value of values) {
    if (!Array.isArray(value)) {
      continue
    }

    const mapped = value
      .map((item) => pickString(item))
      .filter((item): item is string => Boolean(item))

    if (mapped.length > 0) {
      return mapped
    }
  }

  return []
}

const formatCurrency = (amount: number) => `₦${Math.round(amount).toLocaleString()}`

const readPendingProgramEnrollment = (): PendingProgramEnrollment | null => {
  if (typeof window === "undefined") {
    return null
  }

  const rawValue = window.localStorage.getItem(PENDING_PROGRAM_ENROLLMENT_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as PendingProgramEnrollment

    if (
      typeof parsedValue?.programId !== "string" ||
      typeof parsedValue?.redirectPath !== "string" ||
      typeof parsedValue?.createdAt !== "string" ||
      typeof parsedValue?.payload !== "object" ||
      parsedValue.payload === null
    ) {
      window.localStorage.removeItem(PENDING_PROGRAM_ENROLLMENT_STORAGE_KEY)
      return null
    }

    return parsedValue
  } catch {
    window.localStorage.removeItem(PENDING_PROGRAM_ENROLLMENT_STORAGE_KEY)
    return null
  }
}

const savePendingProgramEnrollment = (payload: PendingProgramEnrollment) => {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(
    PENDING_PROGRAM_ENROLLMENT_STORAGE_KEY,
    JSON.stringify(payload),
  )
}

const clearPendingProgramEnrollment = () => {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(PENDING_PROGRAM_ENROLLMENT_STORAGE_KEY)
}

const mapPublicProgramResponse = (
  payload: unknown,
  fallbackProgramId: string,
): ProgramDetailViewModel => {
  const root = asObject(payload)
  const dataRecord = asObject(root?.data)
  const programRecord =
    asObject(root?.program) ??
    asObject(dataRecord?.program) ??
    dataRecord ??
    root ??
    {}

  const trainerRecord =
    asObject(programRecord.trainer) ??
    asObject(programRecord.createdByUser) ??
    asObject(programRecord.createdByProfile) ??
    asObject(programRecord.facilitator) ??
    asObject(programRecord.createdBy) ??
    {}

  const mentorsArray = Array.isArray(programRecord.mentors)
    ? programRecord.mentors
    : []
  const reviewArray =
    (Array.isArray(programRecord.reviewList) ? programRecord.reviewList : null) ??
    (Array.isArray(programRecord.reviewsList) ? programRecord.reviewsList : null) ??
    (Array.isArray(programRecord.reviews) ? programRecord.reviews : null) ??
    []
  const curriculumArray =
    (Array.isArray(programRecord.curriculum) ? programRecord.curriculum : null) ??
    (Array.isArray(programRecord.modules) ? programRecord.modules : null) ??
    []

  const mappedCurriculum = curriculumArray.map((moduleItem, index) => {
    const moduleRecord = asObject(moduleItem)

    const durationValue = pickNumber(
      moduleRecord?.duration,
      moduleRecord?.estimatedDuration,
      moduleRecord?.durationMinutes,
    )
    const topics = mapToStringArray(
      moduleRecord?.topics,
      moduleRecord?.learningObjectives,
      moduleRecord?.learningOutcomes,
    )

    return {
      id: pickString(moduleRecord?.id, moduleRecord?.moduleId) ?? `module-${index + 1}`,
      title:
        pickString(moduleRecord?.title, moduleRecord?.moduleTitle) ??
        `Module ${index + 1}`,
      duration: durationValue > 0 ? `${durationValue} mins` : "TBD",
      lessons: Math.max(
        1,
        pickNumber(moduleRecord?.lessons, moduleRecord?.numberOfSessions, topics),
      ),
      topics,
    } satisfies ProgramCurriculumModuleViewModel
  })

  const totalHoursFromModules = mappedCurriculum.reduce((accumulator, moduleItem) => {
    const durationNumber = pickNumber(moduleItem.duration.replace(" mins", ""))

    return accumulator + durationNumber
  }, 0) / 60

  const price = pickNumber(
    programRecord.price,
    programRecord.amount,
    programRecord.fee,
  )
  const rating = pickNumber(
    programRecord.rating,
    programRecord.averageRating,
    programRecord.avgRating,
  )
  const sessions = pickNumber(
    programRecord.sessions,
    programRecord.numberOfSessions,
  )
  const mentorCompensationValue = pickNumber(
    programRecord.mentorCompensation,
    programRecord.proposedHourlyRate,
  )

  return {
    id: pickString(programRecord.id, programRecord.programId, fallbackProgramId) ?? fallbackProgramId,
    title: pickString(programRecord.title, programRecord.name) ?? "Untitled Program",
    tagline:
      pickString(programRecord.tagline) ??
      pickString(programRecord.description) ??
      "Program overview",
    description:
      pickString(programRecord.description, programRecord.tagline) ??
      "Program description not available.",
    longDescription:
      pickString(
        programRecord.longDescription,
        programRecord.description,
        programRecord.tagline,
      ) ?? "Program details are not available yet.",
    type: pickString(programRecord.type) ?? "training",
    category: pickString(programRecord.category, programRecord.industry) ?? "General",
    level: pickString(programRecord.level) ?? "Intermediate",
    format: pickString(programRecord.format) ?? "Online",
    duration: pickString(programRecord.duration) ?? `${Math.max(1, sessions)} weeks`,
    price,
    originalPrice: pickNumber(programRecord.originalPrice, price),
    rating,
    reviews: pickNumber(programRecord.reviews, programRecord.reviewCount, reviewArray),
    students: pickNumber(
      programRecord.students,
      programRecord.participants,
      programRecord.participantCount,
      programRecord.maxParticipants,
    ),
    modules: pickNumber(programRecord.modules, curriculumArray),
    totalHours: Math.max(
      0,
      pickNumber(programRecord.totalHours, totalHoursFromModules),
    ),
    language: pickString(programRecord.language) ?? "English",
    lastUpdated:
      pickString(programRecord.updatedAt, programRecord.createdAt) ?? "Recently",
    certificateIncluded: Boolean(
      programRecord.certificateIncluded ?? programRecord.certificate,
    ),
    freeSessionsIncluded: pickNumber(programRecord.freeSessionsIncluded),
    sessions,
    mentorCompensation:
      mentorCompensationValue > 0
        ? `${formatCurrency(mentorCompensationValue)}/session`
        : "Compensation shared on request",
    trainer: {
      id: pickString(trainerRecord.id, trainerRecord.userId) ?? "trainer",
      name:
        pickString(
          trainerRecord.name,
          trainerRecord.fullName,
          trainerRecord.firstName &&
            trainerRecord.lastName
            ? `${String(trainerRecord.firstName)} ${String(trainerRecord.lastName)}`
            : null,
        ) ?? "Mentwork Facilitator",
      title: pickString(trainerRecord.title, trainerRecord.role) ?? "Trainer",
      bio: pickString(trainerRecord.bio) ?? "Trainer profile details unavailable.",
      image:
        pickString(trainerRecord.image, trainerRecord.avatar, trainerRecord.photo) ??
        "/placeholder.svg?height=120&width=120",
      rating: pickNumber(trainerRecord.rating, trainerRecord.averageRating),
      totalStudents: pickNumber(trainerRecord.totalStudents),
      totalCourses: pickNumber(trainerRecord.totalCourses),
      expertise: mapToStringArray(
        trainerRecord.expertise,
        trainerRecord.skills,
        programRecord.skillsCapabilities,
      ),
      socialLinks: {
        linkedin: pickString(asObject(trainerRecord.socialLinks)?.linkedin) ?? "",
        twitter: pickString(asObject(trainerRecord.socialLinks)?.twitter) ?? "",
        website: pickString(asObject(trainerRecord.socialLinks)?.website) ?? "",
      },
    },
    skills: mapToStringArray(
      programRecord.skills,
      programRecord.skillsCapabilities,
      programRecord.subSectorSkills,
    ),
    learningOutcomes: mapToStringArray(
      programRecord.learningOutcomes,
      programRecord.objectives,
    ),
    curriculum: mappedCurriculum,
    prerequisites: mapToStringArray(programRecord.prerequisites),
    includes: mapToStringArray(programRecord.includes, programRecord.benefits),
    reviewList: reviewArray.map((reviewItem, index) => {
      const reviewRecord = asObject(reviewItem)

      return {
        id:
          pickString(reviewRecord?.id, reviewRecord?.reviewId) ??
          `review-${index + 1}`,
        student:
          pickString(reviewRecord?.student, reviewRecord?.name) ??
          "Anonymous Learner",
        avatar:
          pickString(reviewRecord?.avatar, reviewRecord?.image) ??
          "/placeholder.svg?height=40&width=40",
        rating: Math.max(0, pickNumber(reviewRecord?.rating)),
        date: pickString(reviewRecord?.date, reviewRecord?.createdAt) ?? "Recently",
        comment:
          pickString(reviewRecord?.comment, reviewRecord?.message) ??
          "No written review.",
      } satisfies ProgramReviewViewModel
    }),
    mentors: mentorsArray.map((mentorItem, index) => {
      const mentorRecord = asObject(mentorItem)

      return {
        id:
          pickString(mentorRecord?.id, mentorRecord?.mentorId) ??
          `mentor-${index + 1}`,
        name:
          pickString(
            mentorRecord?.name,
            mentorRecord?.fullName,
            mentorRecord?.firstName && mentorRecord?.lastName
              ? `${String(mentorRecord.firstName)} ${String(mentorRecord.lastName)}`
              : null,
          ) ?? "Program Mentor",
        title: pickString(mentorRecord?.title, mentorRecord?.role) ?? "Mentor",
        bio: pickString(mentorRecord?.bio) ?? "Mentor profile not provided.",
        image:
          pickString(mentorRecord?.image, mentorRecord?.avatar) ??
          "/placeholder.svg?height=80&width=80",
        rating: pickNumber(mentorRecord?.rating, mentorRecord?.averageRating),
        expertise: mapToStringArray(
          mentorRecord?.expertise,
          mentorRecord?.skills,
          mentorRecord?.skillsCapabilities,
        ),
      } satisfies ProgramMentorViewModel
    }),
  }
}

export default function ProgramDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const programId = params.id as string
  const viewAsMentor = searchParams.get("view") === "mentor"
  const [showMentorModal, setShowMentorModal] = useState(false)
  const { toast } = useToast()

  const [program, setProgram] = useState<ProgramDetailViewModel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEnrollPaymentLoading, setIsEnrollPaymentLoading] = useState(false)
  const [isEnrollmentSyncing, setIsEnrollmentSyncing] = useState(false)
  const [paystackPopupConstructor, setPaystackPopupConstructor] =
    useState<PaystackPopupConstructor | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadProgram = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await programApi.getPublicProgramById<unknown>(programId)
        const mappedProgram = mapPublicProgramResponse(response, programId)

        if (!isMounted) {
          return
        }

        setProgram(mappedProgram)
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        const message =
          loadError instanceof ApiError
            ? loadError.message
            : loadError instanceof Error
              ? loadError.message
              : "Unable to load program details."

        setError(message)
        setProgram(null)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProgram()

    return () => {
      isMounted = false
    }
  }, [programId])

  useEffect(() => {
    let isMounted = true

    void import("@paystack/inline-js")
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

  const syncEnrollmentToBackend = async (
    pendingEnrollment: PendingProgramEnrollment,
    options: { isRetry?: boolean } = {},
  ) => {
    const { isRetry = false } = options

    setIsEnrollmentSyncing(true)

    try {
      await programApi.enrollFull<unknown>(
        pendingEnrollment.programId,
        pendingEnrollment.payload,
      )

      const resolvedRedirectPath = `/mentee/dashboard/programs/${encodeURIComponent(
        pendingEnrollment.programId,
      )}`

      clearPendingProgramEnrollment()
      setIsEnrollPaymentLoading(false)

      toast({
        title: "Payment successful",
        description: isRetry
          ? "Payment was confirmed and enrollment has now been completed."
          : "Enrollment completed successfully.",
      })

      window.location.href = resolvedRedirectPath
    } catch (enrollError) {
      savePendingProgramEnrollment(pendingEnrollment)

      const message =
        enrollError instanceof ApiError
          ? enrollError.message
          : enrollError instanceof Error
            ? enrollError.message
            : "Payment succeeded, but enrollment confirmation failed."

      toast({
        title: "Enrollment sync failed",
        description: `${message} Your payment has been saved and will be retried automatically.`,
        variant: "destructive",
      })
    } finally {
      setIsEnrollmentSyncing(false)
      setIsEnrollPaymentLoading(false)
    }
  }

  useEffect(() => {
    if (!program || viewAsMentor) {
      return
    }

    const pendingEnrollment = readPendingProgramEnrollment()
    const currentEmail = getCurrentUserDetails().email?.trim() ?? ""

    if (
      !pendingEnrollment ||
      pendingEnrollment.programId !== program.id ||
      (typeof pendingEnrollment.payload.email === "string" &&
        pendingEnrollment.payload.email.length > 0 &&
        pendingEnrollment.payload.email !== currentEmail)
    ) {
      return
    }

    void syncEnrollmentToBackend(pendingEnrollment, { isRetry: true })
  }, [program, viewAsMentor])

  const handleEnroll = () => {
    if (!program) {
      return
    }

    if (viewAsMentor) {
      // Show mentor interest modal
      setShowMentorModal(true)
    } else {
      const amount = Number(program.price)

      if (!Number.isFinite(amount) || amount <= 0) {
        window.location.href = `/programs/${program.id}/join`
        return
      }

      const email = getCurrentUserDetails().email?.trim() ?? ""

      if (!email) {
        toast({
          title: "Email not found",
          description: "Unable to resolve your logged-in email. Sign in again.",
          variant: "destructive",
        })
        return
      }

      if (!email.includes("@")) {
        toast({
          title: "Email required",
          description: "Enter a valid email to continue with Paystack.",
          variant: "destructive",
        })
        return
      }

      const pendingEnrollment = readPendingProgramEnrollment()

      if (
        pendingEnrollment &&
        pendingEnrollment.programId === program.id &&
        pendingEnrollment.payload.email === email
      ) {
        void syncEnrollmentToBackend(pendingEnrollment, { isRetry: true })
        return
      }

      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim() ?? ""

      if (!publicKey) {
        toast({
          title: "Paystack key missing",
          description:
            "Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in your environment.",
          variant: "destructive",
        })
        return
      }

      if (!paystackPopupConstructor) {
        toast({
          title: "Payment not ready",
          description: "Paystack is still loading. Please try again.",
          variant: "destructive",
        })
        return
      }

      setIsEnrollPaymentLoading(true)

      const amountKobo = Math.round(amount * 100)
      const reference = `program-enrollment-${program.id}-${Date.now()}`

      const launchPaystack = () => {
        try {
          const popup = new paystackPopupConstructor()

          popup.newTransaction({
            key: publicKey,
            email,
            amount: amountKobo,
            currency: "NGN",
            reference,
            metadata: {
              source: "program-details-enroll",
              programId: program.id,
            },
            onSuccess: (response) => {
              const paymentReference =
                response.reference ?? response.trxref ?? reference

              const enrollmentPayload: ProgramFullEnrollmentPayload = {
                amount,
                currency: "NGN",
                paymentMethod: "card",
                email,
                reference: paymentReference,
                status: "SUCCESS",
                gateway: "paystack",
                gatewayResponse: "Approved",
                channel: "card",
                paidAt: new Date().toISOString(),
                metadata: {
                  source: "paystack-inline",
                  transactionId: response.trxref ?? paymentReference,
                  programId: program.id,
                },
              }

              const pendingEnrollmentPayload: PendingProgramEnrollment = {
                programId: program.id,
                payload: enrollmentPayload,
                redirectPath: `/mentee/dashboard/programs/${program.id}`,
                createdAt: new Date().toISOString(),
              }

              savePendingProgramEnrollment(pendingEnrollmentPayload)
              void syncEnrollmentToBackend(pendingEnrollmentPayload)
            },
            onCancel: () => {
              toast({
                title: "Payment cancelled",
                description: "You can try enrolling again.",
              })
              setIsEnrollPaymentLoading(false)
            },
            onError: (response) => {
              toast({
                title: "Payment failed",
                description: response.message ?? "Unable to complete payment.",
                variant: "destructive",
              })
              setIsEnrollPaymentLoading(false)
            },
          })
        } catch (paymentError) {
          const message =
            paymentError instanceof ApiError
              ? paymentError.message
              : paymentError instanceof Error
                ? paymentError.message
                : "Unable to initialize Paystack."

          toast({
            title: "Payment failed",
            description: message,
            variant: "destructive",
          })
          setIsEnrollPaymentLoading(false)
        }
      }

      window.setTimeout(launchPaystack, 150)
    }
  }

  const handleShare = async () => {
    if (!program) {
      return
    }

    const shareData = {
      title: program.title,
      text: `Check out this program: ${program.title}`,
      url: window.location.href,
    }

    try {
      // Check if Web Share API is available (mobile devices)
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Program link has been copied to clipboard",
        })
      }
    } catch (error) {
      // User cancelled share or clipboard failed
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Share failed",
          description: "Unable to share. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleMentorInterest = () => {
    // In real app, this would submit mentor interest to backend
    console.log("Mentor interest submitted for program:", programId)
    setShowMentorModal(false)
    // Could show success message or redirect to mentor dashboard
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            Loading program details...
          </div>
        </div>
      </div>
    )
  }

  if (!program || error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12 space-y-4">
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {error ?? "Unable to load program details."}
          </div>
          <Button
            variant="outline"
            onClick={() => {
              router.back()
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {isEnrollmentSyncing && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Finalizing enrollment</h3>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we confirm your payment with the server.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section - Dark Background */}
      <section className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Back button and category */}
          <div className="flex items-center gap-3 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="text-white hover:bg-white/10 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Badge className="bg-[#FFD500] text-black font-medium hover:bg-[#FFD500]">
              {program.category}
            </Badge>
          </div>

          {/* Title and Description */}
          <div className="max-w-4xl mb-8">
            {!viewAsMentor && program.freeSessionsIncluded > 0 && (
              <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full mb-4">
                <span className="text-sm font-medium">
                  Try {program.freeSessionsIncluded} session{program.freeSessionsIncluded > 1 ? 's' : ''} free before committing
                </span>
              </div>
            )}
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              {program.title}
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              {program.tagline || program.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-4 mb-3">
              <Button 
                size="lg"
                className="bg-[#FFD500] text-black hover:bg-[#e6c000] font-semibold text-lg px-8"
                onClick={handleEnroll}
                disabled={!viewAsMentor && (isEnrollPaymentLoading || isEnrollmentSyncing)}
              >
                {viewAsMentor ? `Express Interest • ${program.mentorCompensation}` : `Enroll Now • ₦${program.price.toLocaleString()}`}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white bg-white text-gray-900 hover:bg-gray-100 font-semibold text-lg px-8"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
            {!viewAsMentor && (
              <p className="text-gray-300 text-sm">
                One-time payment • Lifetime access • {program.freeSessionsIncluded > 0 && 'Free trial included'}
              </p>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-3 text-[#FFD500]" />
                <p className="text-xs text-gray-300 uppercase tracking-wide mb-1">Duration</p>
                <p className="text-lg font-bold text-white">{program.duration}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-3 text-[#FFD500]" />
                <p className="text-xs text-gray-300 uppercase tracking-wide mb-1">Level</p>
                <p className="text-lg font-bold text-white">{program.level}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 mx-auto mb-3 text-[#FFD500]" />
                <p className="text-xs text-gray-300 uppercase tracking-wide mb-1">Price</p>
                <p className="text-lg font-bold text-white">₦{program.price.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-3 text-[#FFD500]" />
                <p className="text-xs text-gray-300 uppercase tracking-wide mb-1">Rating</p>
                <p className="text-lg font-bold text-white">{program.rating}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* About This Program */}
            <section>
              <h2 className="text-3xl font-bold mb-6">About This Program</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">{program.longDescription}</p>

              {/* What You'll Learn */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6">
                  {viewAsMentor ? "What You'll Be Teaching" : "What You'll Learn"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor Compensation (Mentor View Only) */}
              {viewAsMentor && (
                <div className="border-t border-gray-200 pt-8">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">💰 Mentor Compensation</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{program.mentorCompensation}</p>
                    <p className="text-gray-600">
                      {program.sessions} sessions total • Paid per session upon completion
                    </p>
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-2xl font-bold mb-6">Prerequisites:</h3>
                <div className="grid grid-cols-1 gap-3">
                  {program.prerequisites.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Tabs for detailed content */}
            <Tabs defaultValue="curriculum" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="curriculum"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FFD500] data-[state=active]:bg-transparent"
                >
                  Curriculum
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FFD500] data-[state=active]:bg-transparent"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="space-y-4 mt-6">
                <div className="mb-6">
                  <p className="text-gray-600 text-lg">
                    {program.modules} modules • {program.totalHours} hours total length
                  </p>
                </div>

                <div className="space-y-3">
                {program.curriculum.map((module, index) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-1">
                            Module {index + 1}: {module.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {module.lessons} lessons • {module.duration}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400">
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                      <ul className="space-y-2 mt-4">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-center gap-3 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                          ))}
                        </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="h-6 w-6 fill-[#FFD500] text-[#FFD500]" />
                    <span className="font-bold text-3xl">{program.rating}</span>
                  </div>
                  <p className="text-gray-600">Based on {program.reviews.toLocaleString()} reviews</p>
                </div>

                <div className="space-y-6">
                  {program.reviewList.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.student} />
                            <AvatarFallback>
                              {review.student
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold">{review.student}</h4>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-[#FFD500] text-[#FFD500]" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Trainer Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-lg uppercase tracking-wide text-gray-600">Trainer</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={program.trainer.image || "/placeholder.svg"} alt={program.trainer.name} />
                    <AvatarFallback className="text-2xl">
                      {program.trainer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-xl mb-1">{program.trainer.name}</h3>
                  <p className="text-gray-600 mb-4">{program.trainer.title}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mb-4 w-full">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-[#FFD500] text-[#FFD500]" />
                      <span className="font-medium">{program.trainer.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{program.trainer.totalStudents.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{program.trainer.totalCourses}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="text-left mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{program.trainer.bio}</p>
                </div>

                {/* Expertise */}
                <div className="text-left">
                  <h4 className="font-bold text-sm mb-3">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.trainer.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs px-2 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentors Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-lg uppercase tracking-wide text-gray-600">Program Mentors</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {program.mentors.map((mentor) => (
                  <div key={mentor.id} className="flex gap-4">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                      <AvatarImage src={mentor.image} alt={mentor.name} />
                      <AvatarFallback>
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base mb-0.5">{mentor.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{mentor.title}</p>
                      <p className="text-xs text-gray-700 mb-2 line-clamp-2">{mentor.bio}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[#FFD500] text-[#FFD500]" />
                          <span className="text-xs font-medium">{mentor.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs px-2 py-0.5">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mentor Interest Modal */}
      <Dialog open={showMentorModal} onOpenChange={setShowMentorModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Express Interest as Mentor</DialogTitle>
            <DialogDescription>
              Confirm your interest in mentoring for "{program.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mentor-name">Full Name</Label>
              <Input
                id="mentor-name"
                placeholder="Your full name"
                defaultValue=""
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentor-email">Email</Label>
              <Input
                id="mentor-email"
                type="email"
                placeholder="your.email@example.com"
                defaultValue=""
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentor-expertise">Relevant Expertise</Label>
              <Input
                id="mentor-expertise"
                placeholder="e.g., 5 years in digital marketing"
                defaultValue=""
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Next steps:</strong> The program facilitator will review your application and contact you within 2-3 business days.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMentorModal(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
              onClick={handleMentorInterest}
            >
              Submit Interest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
