import { apiClient } from '@/lib/api-client'

export type MentorTopicAssignmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

type MentorTopicAssignmentsQuery = {
  status?: MentorTopicAssignmentStatus | string
}

export type MentorProfileUpdatePayload = {
  name?: string
  fullName?: string
  email?: string
  company?: string
  companyName?: string
  bio?: string
  achievements?: string
  sector?: string
  sectors?: string[]
  skillsCapabilities?: string[]
  revenueGoal?: number
  impactGoal?: number
  linkedinUrl?: string
  twitterUrl?: string
  websiteUrl?: string
}

type MentorTopicAssignmentDecisionPayload = {
  decision: 'APPROVED' | 'REJECTED' | string
  message?: string
}

const buildTopicAssignmentsQuery = (
  query: MentorTopicAssignmentsQuery = {},
) => {
  const params = new URLSearchParams()

  if (query.status) {
    params.set('status', query.status)
  }

  return params.toString()
}

const encodeMentorId = (mentorId: string | number) =>
  encodeURIComponent(String(mentorId))

const encodeResourceId = (value: string | number) =>
  encodeURIComponent(String(value))

export const mentorApi = {
  getMentorSessions: <TResponse = unknown>(mentorId: string | number) =>
    apiClient.get<TResponse>(`/mentors/${encodeMentorId(mentorId)}/sessions`),

  getMentorPrograms: <TResponse = unknown>(mentorId: string | number) =>
    apiClient.get<TResponse>(`/mentors/${encodeMentorId(mentorId)}/programs`),

  getMentorProgramById: <TResponse = unknown>(
    mentorId: string | number,
    programId: string | number,
  ) =>
    apiClient.get<TResponse>(
      `/mentors/${encodeMentorId(mentorId)}/programs/${encodeURIComponent(
        String(programId),
      )}`,
    ),

  getMentorTopicAssignments: <TResponse = unknown>(
    mentorId: string | number,
    query: MentorTopicAssignmentsQuery = {},
  ) => {
    const qs = buildTopicAssignmentsQuery(query)
    const endpoint = qs
      ? `/mentors/${encodeMentorId(mentorId)}/topic-assignments?${qs}`
      : `/mentors/${encodeMentorId(mentorId)}/topic-assignments`

    return apiClient.get<TResponse>(endpoint)
  },

  getMentorTopicAssignmentById: <TResponse = unknown>(
    mentorId: string | number,
    assignmentId: string | number,
  ) =>
    apiClient.get<TResponse>(
      `/mentors/${encodeMentorId(mentorId)}/topic-assignments/${encodeResourceId(
        assignmentId,
      )}`,
    ),

  respondToMentorTopicAssignment: <
    TResponse = unknown,
    TPayload extends MentorTopicAssignmentDecisionPayload = MentorTopicAssignmentDecisionPayload,
  >(
    assignmentId: string | number,
    payload: TPayload,
  ) =>
    apiClient.post<TResponse, TPayload>(
      `/programs/topic-mentors/${encodeResourceId(assignmentId)}/respond`,
      payload,
    ),

  updateMentorProfile: <
    TResponse = unknown,
    TPayload extends MentorProfileUpdatePayload = MentorProfileUpdatePayload,
  >(
    mentorId: string | number,
    payload: TPayload,
  ) =>
    apiClient.put<TResponse, TPayload>(
      `/mentors/${encodeMentorId(mentorId)}`,
      payload,
    ),
}
