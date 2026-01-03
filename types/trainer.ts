export interface Trainer {
  id: string
  name: string
  email: string
  avatar?: string
  organization?: string
  bio?: string
  expertise: string[]
  rating: number
  totalSessions: number
  hourlyRate: number
  availability: "available" | "busy" | "unavailable"
  languages: string[]
  timezone: string
  createdAt: string
  updatedAt: string
}

export interface TrainerProgram {
  id: string
  title: string
  tagline: string
  description: string
  category: string
  industry: string
  level: string
  language: string
  format: string
  type: "one-on-one" | "group"
  maxParticipants?: number
  price: number
  duration: number
  startDate: string
  endDate: string
  status: "draft" | "published" | "active" | "completed"
  coverImage?: string
  learningOutcomes: string[]
  prerequisites: string[]
  curriculum: CurriculumModule[]
  mentorAssignments: MentorAssignment[]
  createdAt: string
  updatedAt: string
}

export interface CurriculumModule {
  id: string
  title: string
  description: string
  duration: number // in minutes
  order: number
  topics: CurriculumTopic[]
  learningObjectives: string[]
  materials: string[]
  assessments: string[]
}

export interface CurriculumTopic {
  id: string
  title: string
  description: string
  duration: number // in minutes
  order: number
  type: "lecture" | "workshop" | "discussion" | "project" | "assessment"
  materials: string[]
  prerequisites: string[]
  requiredExpertise: string[] // What expertise areas this topic requires
  feedbackLink?: string
}

export interface MentorAssignment {
  id: string
  mentorId: string
  mentor: PlatformMentor
  moduleIds: string[]
  topicIds: string[]
  proposedRate: number
  status: "pending" | "invited" | "accepted" | "declined" | "active"
  invitedAt?: string
  respondedAt?: string
  message?: string
  customMessage?: string
}

export interface PlatformMentor {
  id: string
  name: string
  email: string
  avatar?: string
  title: string
  company?: string
  bio: string
  expertise: string[]
  rating: number
  totalReviews: number
  totalSessions: number
  hourlyRate: number
  availability: "available" | "busy" | "unavailable"
  languages: string[]
  timezone: string
  responseTime: string // e.g., "Usually responds within 2 hours"
  successRate: number // percentage of successful program completions
  specializations: string[]
  yearsOfExperience: number
  education: string[]
  certifications: string[]
  portfolioItems: PortfolioItem[]
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  type: "project" | "course" | "certification" | "achievement"
  url?: string
  imageUrl?: string
  date: string
}

export interface MentorInvitation {
  id: string
  programId: string
  mentorId: string
  mentor: PlatformMentor
  topicIds: string[]
  proposedRate: number
  status: "pending" | "accepted" | "declined" | "expired"
  invitedAt: string
  respondedAt?: string
  message: string
  customMessage?: string
  expiresAt: string
}

export interface TrainerDashboardStats {
  totalPrograms: number
  activePrograms: number
  totalMentors: number
  totalParticipants: number
  totalRevenue: number
  averageRating: number
}
