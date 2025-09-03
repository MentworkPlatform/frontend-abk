export type MentorshipProgramStatus = "open" | "closed" | "in_progress"
export type InvitationStatus = "invited" | "accepted" | "declined"
export type ApplicationStatus = "applied" | "accepted" | "rejected" | "pending"

export interface SchoolMentorshipProgram {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: MentorshipProgramStatus
  compensationRate: number
}

export interface MentorInvitation {
  id: string
  programId: string
  mentorId: string
  status: InvitationStatus
  compensationRate: number
  invitedAt: string
  respondedAt?: string
}

export interface MentorApplication {
  id: string
  programId: string
  mentorId: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string
}

export interface Mentor {
  id: string
  name: string
  email: string
  expertise: string[]
  skills: string[]
  avatar: string
}
