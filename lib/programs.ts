import { apiClient } from '@/lib/api-client'

const buildQueryString = (
  query: Record<string, string | number | boolean | null | undefined>,
) => {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return
    }

    params.set(key, String(value))
  })

  return params.toString()
}

export type ProgramFullEnrollmentPayload = {
  amount: number
  currency?: string
  paymentMethod?: string
  email?: string
  reference?: string
  status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  gateway?: string
  gatewayResponse?: string
  channel?: string
  fees?: number
  netAmount?: number
  paidAt?: string
  metadata?: Record<string, unknown>
}

export const programApi = {
  getMyEnrollments: <TResponse = unknown>() =>
    apiClient.get<TResponse>('/programs/enrollments/me'),

  getRecommendedPrograms: <TResponse = unknown>(limit = 10) => {
    const qs = buildQueryString({ limit })
    const endpoint = qs
      ? `/programs/recommended/me?${qs}`
      : '/programs/recommended/me'

    return apiClient.get<TResponse>(endpoint)
  },

  getPublishedPrograms: <TResponse = unknown>() =>
    apiClient.get<TResponse>('/programs/published'),

  getPublicProgramById: <TResponse = unknown>(programId: string | number) =>
    apiClient.get<TResponse>(
      `/programs/public/${encodeURIComponent(String(programId))}`,
    ),

  enrollFull: <TResponse = unknown>(
    programId: string | number,
    payload: ProgramFullEnrollmentPayload,
  ) =>
    apiClient.post<TResponse, ProgramFullEnrollmentPayload>(
      `/programs/${encodeURIComponent(String(programId))}/enrollments`,
      payload,
    ),
}
