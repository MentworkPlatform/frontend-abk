export interface LMSProgram {
  id: string
  title: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  format: "virtual" | "in-person" | "hybrid"
  type: "self-paced" | "live" | "blended"
  price: number
  duration: number // in weeks
  maxParticipants: number
  currentParticipants: number
  status: "draft" | "published" | "active" | "completed" | "archived"
  isPublished: boolean
  allowEnrollment: boolean
  requireApproval: boolean
  certificateEnabled: boolean
  forumEnabled: boolean
  notificationsEnabled: boolean
  createdAt: string
  updatedAt: string
  trainerId: string
  trainer: LMSTrainer
  modules: LMSModule[]
  participants: LMSParticipant[]
  analytics: LMSAnalytics
}

export interface LMSTrainer {
  id: string
  name: string
  email: string
  avatar?: string
  title: string
  bio: string
  expertise: string[]
  rating: number
  totalStudents: number
  totalPrograms: number
  totalRevenue: number
  joinedAt: string
}

export interface LMSModule {
  id: string
  title: string
  description: string
  order: number
  duration: number // in minutes
  isPublished: boolean
  topics: LMSTopic[]
  learningObjectives: string[]
  prerequisites: string[]
}

export interface LMSTopic {
  id: string
  title: string
  description: string
  type: "video" | "document" | "quiz" | "assignment" | "live_session" | "discussion"
  duration: number // in minutes
  order: number
  isPublished: boolean
  content?: string
  videoUrl?: string
  documentUrl?: string
  quizQuestions?: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  type: "multiple_choice" | "true_false" | "short_answer"
  options?: string[]
  correctAnswer: string | number
  explanation?: string
}

export interface LMSParticipant {
  id: string
  name: string
  email: string
  avatar?: string
  enrolledAt: string
  status: "active" | "completed" | "dropped" | "suspended"
  progress: number // percentage
  lastActive: string
  completedModules: string[]
  currentModule?: string
  timeSpent: number // in minutes
  certificateIssued?: boolean
  certificateUrl?: string
}

export interface LMSAnalytics {
  totalEnrollments: number
  activeStudents: number
  completionRate: number
  averageProgress: number
  totalRevenue: number
  averageRating: number
  totalReviews: number
  engagementRate: number
  dropoutRate: number
  averageTimeToComplete: number // in days
  monthlyEnrollments: number[]
  weeklyActivity: number[]
}

export interface LMSAnnouncement {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  isEmailSent: boolean
  createdAt: string
  createdBy: string
}

export interface LMSAssignment {
  id: string
  title: string
  description: string
  dueDate: string
  maxScore: number
  submissions: LMSSubmission[]
  isPublished: boolean
}

export interface LMSSubmission {
  id: string
  participantId: string
  participant: LMSParticipant
  submittedAt: string
  content: string
  attachments: string[]
  score?: number
  feedback?: string
  gradedAt?: string
  gradedBy?: string
}
