export interface CurriculumTemplate {
  id: string
  name: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  estimatedDuration: number // in weeks
  modules: CurriculumModuleTemplate[]
  tags: string[]
  isPopular: boolean
  usageCount: number
  createdBy: string
  createdAt: string
}

export interface CurriculumModuleTemplate {
  id: string
  title: string
  description: string
  order: number
  estimatedDuration: number // in hours
  topics: CurriculumTopicTemplate[]
  learningObjectives: string[]
  prerequisites: string[]
}

export interface CurriculumTopicTemplate {
  id: string
  title: string
  description: string
  type: "video" | "document" | "quiz" | "assignment" | "live_session" | "discussion" | "project"
  estimatedDuration: number // in minutes
  order: number
  content?: string
  materials: string[]
  assessmentCriteria?: string[]
}

export interface CustomCurriculum {
  id: string
  programId: string
  templateId?: string
  modules: CurriculumModule[]
  totalDuration: number
  createdAt: string
  updatedAt: string
}

export interface CurriculumModule {
  id: string
  title: string
  description: string
  order: number
  duration: number // in minutes
  topics: CurriculumTopic[]
  learningObjectives: string[]
  materials: string[]
  assessments: string[]
  isPublished: boolean
}

export interface CurriculumTopic {
  id: string
  title: string
  description: string
  duration: number // in minutes
  order: number
  type: "video" | "document" | "quiz" | "assignment" | "live_session" | "discussion" | "project"
  materials: string[]
  prerequisites: string[]
  requiredExpertise: string[]
  feedbackLink?: string
  content?: TopicContent
  isPublished: boolean
}

export interface TopicContent {
  videoUrl?: string
  documentUrl?: string
  slides?: string[]
  quizQuestions?: QuizQuestion[]
  assignmentInstructions?: string
  discussionPrompts?: string[]
  projectRequirements?: string[]
}

export interface QuizQuestion {
  id: string
  question: string
  type: "multiple_choice" | "true_false" | "short_answer" | "essay"
  options?: string[]
  correctAnswer: string | number
  explanation?: string
  points: number
}
