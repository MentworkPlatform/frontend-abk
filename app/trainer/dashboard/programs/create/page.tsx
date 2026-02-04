"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  X,
  Users,
  Clock,
  BookOpen,
  Search,
  Filter,
  Star,
  Globe,
  Info,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelect } from "@/components/ui/multi-select"
import type { MentorAssignment, PlatformMentor } from "@/types/trainer"
import type { CurriculumTemplate, CurriculumModule } from "@/types/curriculum"
import { CurriculumBuilder } from "@/components/curriculum/curriculum-builder"
import { TemplateSelector } from "@/components/curriculum/template-selector"
import {
  SECTORS,
  SKILLS_CAPABILITIES,
  getSkillsForSectors,
  getSkillsGroupedBySector,
} from "@/lib/constants/onboarding"
import { useMemo } from "react"

// Mock data for platform mentors
const mockMentors: PlatformMentor[] = [
  {
    id: "mentor-1",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Senior Digital Marketing Strategist",
    company: "Google",
    bio: "10+ years in digital marketing with expertise in SEO, content strategy, and performance marketing. Former marketing lead at 3 successful startups.",
    expertise: ["Digital Marketing", "SEO", "Content Marketing", "Social Media", "Analytics"],
    rating: 4.9,
    totalReviews: 127,
    totalSessions: 340,
    hourlyRate: 150,
    availability: "available",
    languages: ["English", "Mandarin"],
    timezone: "PST",
    responseTime: "Usually responds within 1 hour",
    successRate: 96,
    specializations: ["B2B Marketing", "SaaS Growth", "Content Strategy"],
    yearsOfExperience: 12,
    education: ["MBA Marketing - Stanford", "BS Computer Science - UC Berkeley"],
    certifications: ["Google Ads Certified", "HubSpot Content Marketing"],
    portfolioItems: [],
  },
  {
    id: "mentor-2",
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Lead Software Engineer",
    company: "Microsoft",
    bio: "Full-stack developer with 8 years of experience building scalable web applications. Passionate about mentoring and teaching modern development practices.",
    expertise: ["Web Development", "JavaScript", "React", "Node.js", "Cloud Architecture"],
    rating: 4.8,
    totalReviews: 89,
    totalSessions: 245,
    hourlyRate: 120,
    availability: "available",
    languages: ["English", "Spanish"],
    timezone: "EST",
    responseTime: "Usually responds within 2 hours",
    successRate: 94,
    specializations: ["React Development", "API Design", "Cloud Deployment"],
    yearsOfExperience: 8,
    education: ["MS Computer Science - MIT", "BS Software Engineering - Georgia Tech"],
    certifications: ["AWS Solutions Architect", "React Developer Certification"],
    portfolioItems: [],
  },
  {
    id: "mentor-3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "UX Research Director",
    company: "Airbnb",
    bio: "PhD in Human-Computer Interaction with 15 years of experience in user research and product design. Led UX teams at Fortune 500 companies.",
    expertise: ["UX Design", "User Research", "Product Strategy", "Design Thinking", "Prototyping"],
    rating: 5.0,
    totalReviews: 156,
    totalSessions: 420,
    hourlyRate: 180,
    availability: "busy",
    languages: ["English", "Spanish", "Portuguese"],
    timezone: "PST",
    responseTime: "Usually responds within 4 hours",
    successRate: 98,
    specializations: ["User Research", "Design Systems", "Product Strategy"],
    yearsOfExperience: 15,
    education: ["PhD HCI - Carnegie Mellon", "MS Design - RISD"],
    certifications: ["Google UX Design Certificate", "Nielsen Norman Group UX Certification"],
    portfolioItems: [],
  },
  {
    id: "mentor-4",
    name: "Alex Kim",
    email: "alex.kim@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Data Science Manager",
    company: "Netflix",
    bio: "Data scientist and machine learning engineer with expertise in recommendation systems, analytics, and AI product development.",
    expertise: ["Data Science", "Machine Learning", "Python", "Analytics", "AI"],
    rating: 4.7,
    totalReviews: 73,
    totalSessions: 180,
    hourlyRate: 140,
    availability: "available",
    languages: ["English", "Korean"],
    timezone: "PST",
    responseTime: "Usually responds within 3 hours",
    successRate: 92,
    specializations: ["ML Engineering", "Data Analytics", "Recommendation Systems"],
    yearsOfExperience: 7,
    education: ["MS Data Science - Stanford", "BS Mathematics - UCLA"],
    certifications: ["TensorFlow Developer", "AWS Machine Learning"],
    portfolioItems: [],
  },
  {
    id: "mentor-5",
    name: "Lisa Thompson",
    email: "lisa.thompson@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Product Management Lead",
    company: "Stripe",
    bio: "Product leader with 10 years of experience building fintech and B2B SaaS products. Expert in product strategy, roadmapping, and go-to-market.",
    expertise: ["Product Management", "Product Strategy", "Go-to-Market", "Analytics", "Leadership"],
    rating: 4.9,
    totalReviews: 112,
    totalSessions: 290,
    hourlyRate: 160,
    availability: "available",
    languages: ["English", "French"],
    timezone: "EST",
    responseTime: "Usually responds within 1 hour",
    successRate: 95,
    specializations: ["B2B Products", "Fintech", "Product Analytics"],
    yearsOfExperience: 10,
    education: ["MBA - Wharton", "BS Engineering - MIT"],
    certifications: ["Product Management Certificate - Berkeley", "Scrum Master"],
    portfolioItems: [],
  },
]

export default function CreateProgram() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Step 1: Program Overview
  const [programData, setProgramData] = useState({
    title: "",
    description: "",
    selectedSectors: [] as string[],
    selectedSubSectorSkills: [] as string[],
    selectedSkillsCapabilities: [] as string[],
    experienceLevel: "",
    format: "",
    maxParticipants: "",
    price: "",
    durationWeeks: "",
    numberOfSessions: "",
    learningOutcomes: ["", "", ""],
  })

  // Step 2: Curriculum
  const [selectedTemplate, setSelectedTemplate] = useState<CurriculumTemplate | null>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [curriculum, setCurriculum] = useState<CurriculumModule[]>([])

  // Step 3: Mentor Assignments
  const [mentorAssignments, setMentorAssignments] = useState<MentorAssignment[]>([])
  const [showMentorBrowser, setShowMentorBrowser] = useState(false)
  const [selectedMentorForAssignment, setSelectedMentorForAssignment] = useState<PlatformMentor | null>(null)
  const [mentorSearchQuery, setMentorSearchQuery] = useState("")
  const [mentorFilters, setMentorFilters] = useState({
    expertise: "all",
    availability: "all",
    priceRange: "all",
    rating: "all",
  })

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/trainer/dashboard")
    }, 2000)
  }

  // Memoized options for sectors and skills
  const sectorsOptions = useMemo(() => {
    return SECTORS.map((sector) => ({ value: sector.id, label: sector.name }))
  }, [])

  const subSectorSkillsOptions = useMemo(() => {
    const sectorSkills = getSkillsForSectors(programData.selectedSectors)
    return sectorSkills.map((skill) => ({ value: skill, label: skill }))
  }, [programData.selectedSectors])

  const subSectorSkillsGrouped = useMemo(() => {
    if (programData.selectedSectors.length === 0) return []
    const grouped = getSkillsGroupedBySector(programData.selectedSectors)
    return grouped.map((group) => ({
      groupLabel: group.sectorName,
      options: group.skills.map((skill) => ({ value: skill, label: skill })),
    }))
  }, [programData.selectedSectors])

  const skillsCapabilitiesOptions = useMemo(() => {
    return SKILLS_CAPABILITIES.map((skill) => ({ value: skill, label: skill }))
  }, [])

  // Step 1 validation
  const isStep1Valid = () => {
    return (
      programData.title.trim() !== "" &&
      programData.description.trim() !== "" &&
      programData.selectedSectors.length > 0 &&
      programData.experienceLevel !== "" &&
      programData.format !== "" &&
      programData.maxParticipants.trim() !== "" &&
      programData.price.trim() !== "" &&
      programData.durationWeeks.trim() !== "" &&
      programData.numberOfSessions.trim() !== "" &&
      programData.learningOutcomes.some((outcome) => outcome.trim() !== "")
    )
  }

  // Step 2 validation
  const isStep2Valid = () => {
    return (
      curriculum.length > 0 &&
      curriculum.every(
        (module) =>
          module.title.trim() !== "" &&
          module.description.trim() !== "" &&
          module.topics.length > 0 &&
          module.topics.every((topic) => topic.title.trim() !== "" && topic.description.trim() !== ""),
      )
    )
  }

  const getStepProgress = () => {
    return (currentStep / 3) * 100
  }

  const handleTemplateSelect = (template: CurriculumTemplate) => {
    setSelectedTemplate(template)
    // Convert template modules to curriculum modules
    const convertedModules: CurriculumModule[] = template.modules.map((templateModule) => ({
      id: templateModule.id,
      title: templateModule.title,
      description: templateModule.description,
      order: templateModule.order,
      duration: templateModule.estimatedDuration * 60, // Convert hours to minutes
      topics: templateModule.topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        duration: topic.estimatedDuration,
        order: topic.order,
        type: topic.type,
        materials: topic.materials,
        prerequisites: [],
        requiredExpertise: [],
        content: typeof topic.content === "string" ? undefined : topic.content,
        isPublished: false,
      })),
      learningObjectives: templateModule.learningObjectives,
      materials: [],
      assessments: [],
      isPublished: false,
    }))
    setCurriculum(convertedModules)
    setShowTemplateSelector(false) // Close the template selector after selection
  }

  // Filter mentors based on search and filters
  const filteredMentors = mockMentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(mentorSearchQuery.toLowerCase()) ||
      mentor.expertise.some((exp) => exp.toLowerCase().includes(mentorSearchQuery.toLowerCase())) ||
      mentor.title.toLowerCase().includes(mentorSearchQuery.toLowerCase())

    const matchesExpertise =
      !mentorFilters.expertise ||
      mentorFilters.expertise === "all" ||
      mentor.expertise.includes(mentorFilters.expertise)
    const matchesAvailability =
      !mentorFilters.availability ||
      mentorFilters.availability === "all" ||
      mentor.availability === mentorFilters.availability
    const matchesRating =
      !mentorFilters.rating ||
      mentorFilters.rating === "all" ||
      mentor.rating >= Number.parseFloat(mentorFilters.rating)

    let matchesPrice = true
    if (mentorFilters.priceRange && mentorFilters.priceRange !== "all") {
      const [min, max] = mentorFilters.priceRange.split("-").map(Number)
      matchesPrice = mentor.hourlyRate >= min && (max ? mentor.hourlyRate <= max : true)
    }

    return matchesSearch && matchesExpertise && matchesAvailability && matchesRating && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Create New Training Program</h1>
            <p className="text-muted-foreground">
              Build a comprehensive training program and invite expert mentors to teach
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of 3</span>
              <span className="text-sm text-muted-foreground">{Math.round(getStepProgress())}% Complete</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? "bg-[#FFD500] text-black" : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span className={`text-sm ${currentStep >= 1 ? "font-medium" : "text-muted-foreground"}`}>
                Program Overview
              </span>
            </div>

            <div className="flex-1 h-px bg-gray-200 mx-4" />

            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? "bg-[#FFD500] text-black" : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 2 ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <span className={`text-sm ${currentStep >= 2 ? "font-medium" : "text-muted-foreground"}`}>
                Curriculum
              </span>
            </div>

            <div className="flex-1 h-px bg-gray-200 mx-4" />

            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3 ? "bg-[#FFD500] text-black" : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <span className={`text-sm ${currentStep >= 3 ? "font-medium" : "text-muted-foreground"}`}>
                Assign Mentors
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <Step1ProgramOverview
            programData={programData}
            setProgramData={setProgramData}
            onNext={nextStep}
            isValid={isStep1Valid()}
            sectorsOptions={sectorsOptions}
            subSectorSkillsOptions={subSectorSkillsOptions}
            subSectorSkillsGrouped={subSectorSkillsGrouped}
            skillsCapabilitiesOptions={skillsCapabilitiesOptions}
          />
        )}

        {currentStep === 2 && (
          <Step2Curriculum
            curriculum={curriculum}
            setCurriculum={setCurriculum}
            onNext={nextStep}
            onPrev={prevStep}
            isValid={isStep2Valid()}
            onShowTemplateSelector={() => setShowTemplateSelector(true)}
            selectedTemplate={selectedTemplate}
          />
        )}

        {currentStep === 3 && (
          <Step3AssignMentors
            curriculum={curriculum}
            mentorAssignments={mentorAssignments}
            setMentorAssignments={setMentorAssignments}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onShowMentorBrowser={() => setShowMentorBrowser(true)}
          />
        )}

        {/* Mentor Browser Modal */}
        <MentorBrowserModal
          isOpen={showMentorBrowser}
          onClose={() => setShowMentorBrowser(false)}
          mentors={filteredMentors}
          curriculum={curriculum}
          searchQuery={mentorSearchQuery}
          setSearchQuery={setMentorSearchQuery}
          filters={mentorFilters}
          setFilters={setMentorFilters}
          onSelectMentor={(mentor) => {
            setSelectedMentorForAssignment(mentor)
            setShowMentorBrowser(false)
          }}
          existingAssignments={mentorAssignments}
        />

        {/* Mentor Assignment Modal */}
        {selectedMentorForAssignment && (
          <MentorAssignmentModal
            isOpen={!!selectedMentorForAssignment}
            onClose={() => setSelectedMentorForAssignment(null)}
            mentor={selectedMentorForAssignment}
            curriculum={curriculum}
            existingAssignments={mentorAssignments}
            onAssign={(assignment) => {
              setMentorAssignments([...mentorAssignments, assignment])
              setSelectedMentorForAssignment(null)
            }}
          />
        )}

        {/* Template Selector Modal */}
        <TemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
          onSelectTemplate={handleTemplateSelect}
        />
      </div>
    </div>
  )
}

// Step 1: Program Overview Component (same as before)
interface Step1Props {
  programData: any
  setProgramData: (data: any) => void
  onNext: () => void
  isValid: boolean
  sectorsOptions: { value: string; label: string }[]
  subSectorSkillsOptions: { value: string; label: string }[]
  subSectorSkillsGrouped: { groupLabel: string; options: { value: string; label: string }[] }[]
  skillsCapabilitiesOptions: { value: string; label: string }[]
}

function Step1ProgramOverview({
  programData,
  setProgramData,
  onNext,
  isValid,
  sectorsOptions,
  subSectorSkillsOptions,
  subSectorSkillsGrouped,
  skillsCapabilitiesOptions,
}: Step1Props) {
  const updateLearningOutcome = (index: number, value: string) => {
    const updated = [...programData.learningOutcomes]
    updated[index] = value
    setProgramData({ ...programData, learningOutcomes: updated })
  }

  const addLearningOutcome = () => {
    setProgramData({
      ...programData,
      learningOutcomes: [...programData.learningOutcomes, ""],
    })
  }

  const removeLearningOutcome = (index: number) => {
    if (programData.learningOutcomes.length > 1) {
      const updated = programData.learningOutcomes.filter((_: string, i: number) => i !== index)
      setProgramData({ ...programData, learningOutcomes: updated })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Tell us about your training program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Program Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Digital Marketing Bootcamp"
                value={programData.title}
                onChange={(e) => setProgramData({ ...programData, title: e.target.value })}
              />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Program Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what participants will learn and achieve..."
              rows={4}
              value={programData.description}
              onChange={(e) => setProgramData({ ...programData, description: e.target.value })}
            />
          </div>

            <div className="space-y-2">
            <Label>Sector *</Label>
            <MultiSelect
              options={sectorsOptions}
              selected={programData.selectedSectors}
              onSelectionChange={(selected) => {
                // Clear sub-sector skills when sectors change
                const newSubSectorSkills = getSkillsForSectors(selected)
                setProgramData({
                  ...programData,
                  selectedSectors: selected,
                  selectedSubSectorSkills: programData.selectedSubSectorSkills.filter((skill: string) =>
                    newSubSectorSkills.includes(skill),
                  ),
                })
              }}
              placeholder="Select sector(s)"
            />
            </div>

            <div className="space-y-2">
            <Label>Sub-Sector (Skill) *</Label>
            <MultiSelect
              options={subSectorSkillsOptions}
              selected={programData.selectedSubSectorSkills}
              onSelectionChange={(selected) =>
                setProgramData({ ...programData, selectedSubSectorSkills: selected })
              }
              placeholder="Select skill(s)"
              disabled={programData.selectedSectors.length === 0}
              groupedOptions={subSectorSkillsGrouped}
            />
            {programData.selectedSectors.length === 0 && (
              <p className="text-sm text-gray-500">Please select a sector first</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Skills & Capabilities *</Label>
            <MultiSelect
              options={skillsCapabilitiesOptions}
              selected={programData.selectedSkillsCapabilities}
              onSelectionChange={(selected) =>
                setProgramData({ ...programData, selectedSkillsCapabilities: selected })
              }
              placeholder="Select skills & capabilities"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level *</Label>
              <Select
                value={programData.experienceLevel}
                onValueChange={(value) => setProgramData({ ...programData, experienceLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="all-levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Format *</Label>
              <Select
                value={programData.format}
                onValueChange={(value) => setProgramData({ ...programData, format: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants *</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="e.g., 25"
                  value={programData.maxParticipants}
                  onChange={(e) => setProgramData({ ...programData, maxParticipants: e.target.value })}
                />
              </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 1500"
                value={programData.price}
                onChange={(e) => setProgramData({ ...programData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationWeeks">Duration (Weeks) *</Label>
              <Input
                id="durationWeeks"
                type="number"
                placeholder="e.g., 12"
                value={programData.durationWeeks}
                onChange={(e) => setProgramData({ ...programData, durationWeeks: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfSessions">Number of Sessions *</Label>
              <Input
                id="numberOfSessions"
                type="number"
                placeholder="e.g., 8"
                value={programData.numberOfSessions}
                onChange={(e) => setProgramData({ ...programData, numberOfSessions: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Outcomes</CardTitle>
          <CardDescription>What will participants achieve by completing this program?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {programData.learningOutcomes.map((outcome: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={`Learning outcome ${index + 1}`}
                value={outcome}
                onChange={(e) => updateLearningOutcome(index, e.target.value)}
              />
              {programData.learningOutcomes.length > 1 && (
                <Button type="button" variant="outline" size="icon" onClick={() => removeLearningOutcome(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addLearningOutcome} className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Learning Outcome
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!isValid} className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
          Next: Build Curriculum
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

// Step 2: Curriculum Component (same as before)
interface Step2Props {
  curriculum: CurriculumModule[]
  setCurriculum: (curriculum: CurriculumModule[]) => void
  onNext: () => void
  onPrev: () => void
  isValid: boolean
  onShowTemplateSelector: () => void
  selectedTemplate: CurriculumTemplate | null
}

function Step2Curriculum({
  curriculum,
  setCurriculum,
  onNext,
  onPrev,
  isValid,
  onShowTemplateSelector,
  selectedTemplate,
}: Step2Props) {
  const getTotalDuration = () => {
    return curriculum.reduce(
      (total, module) => total + module.topics.reduce((moduleTotal, topic) => moduleTotal + topic.duration, 0),
      0,
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Program Curriculum</CardTitle>
              <CardDescription>Structure your program into modules and topics</CardDescription>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div>Total Duration: {Math.round(getTotalDuration() / 60)} hours</div>
              <div>
                {curriculum.length} modules, {curriculum.reduce((total, m) => total + m.topics.length, 0)} topics
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {curriculum.length === 0 && !selectedTemplate ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">Start building your curriculum</p>
              <p className="text-sm text-muted-foreground mb-4">
                Choose a template to get started or build from scratch.
              </p>
              <div className="flex justify-center gap-2">
                <Button onClick={onShowTemplateSelector} className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurriculum([
                      {
                        id: `module-${Date.now()}`,
                        title: "",
                        description: "",
                        order: 1,
                        duration: 0,
                        topics: [],
                        learningObjectives: [""],
                        materials: [],
                        assessments: [],
                        isPublished: false,
                      },
                    ])
                  }
                >
                  Start from Scratch
                </Button>
              </div>
            </div>
          ) : (
            <CurriculumBuilder
              initialTemplate={selectedTemplate || undefined}
              modules={curriculum}
              setModules={setCurriculum}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
          Next: Assign Mentors
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

// Step 3: Assign Mentors Component (Updated)
interface Step3Props {
  curriculum: CurriculumModule[]
  mentorAssignments: MentorAssignment[]
  setMentorAssignments: (assignments: MentorAssignment[]) => void
  onPrev: () => void
  onSubmit: () => void
  isLoading: boolean
  onShowMentorBrowser: () => void
}

function Step3AssignMentors({
  curriculum,
  mentorAssignments,
  setMentorAssignments,
  onPrev,
  onSubmit,
  isLoading,
  onShowMentorBrowser,
}: Step3Props) {
  const removeMentorAssignment = (assignmentId: string) => {
    setMentorAssignments(mentorAssignments.filter((a) => a.id !== assignmentId))
  }

  const getAssignedTopicsCount = () => {
    const assignedTopicIds = new Set(mentorAssignments.flatMap((a) => a.topicIds))
    return assignedTopicIds.size
  }

  const getTotalTopicsCount = () => {
    return curriculum.reduce((total, module) => total + module.topics.length, 0)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assign Platform Mentors</CardTitle>
              <CardDescription>
                Browse and invite expert mentors from our platform to teach specific topics
              </CardDescription>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div>
                {getAssignedTopicsCount()} of {getTotalTopicsCount()} topics assigned
              </div>
              <div>{mentorAssignments.length} mentors invited</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Curriculum Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Curriculum Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {curriculum.map((module, moduleIndex) => (
              <div key={module.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">
                      Module {moduleIndex + 1}: {module.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{module.topics.length} topics</p>
                  </div>
                  <Badge variant="outline">
                    {Math.round(module.topics.reduce((total, topic) => total + topic.duration, 0) / 60)}h
                  </Badge>
                </div>

                <div className="grid gap-2">
                  {module.topics.map((topic, topicIndex) => {
                    const isAssigned = mentorAssignments.some((a) => a.topicIds.includes(topic.id))
                    const assignedMentor = mentorAssignments.find((a) => a.topicIds.includes(topic.id))

                    return (
                      <div
                        key={topic.id}
                        className={`flex items-center justify-between p-2 rounded ${
                          isAssigned ? "bg-green-50 border border-green-200" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="text-xs">
                            {topicIndex + 1}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium">{topic.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {topic.duration} min • {topic.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isAssigned ? (
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={assignedMentor?.mentor.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {assignedMentor?.mentor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <Badge className="bg-green-100 text-green-800">{assignedMentor?.mentor.name}</Badge>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Unassigned
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mentor Assignments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Assigned Mentors</CardTitle>
            <Button onClick={onShowMentorBrowser} className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
              <Search className="h-4 w-4 mr-2" />
              Browse Mentors
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mentorAssignments.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">No mentors assigned yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our platform's expert mentors and assign them to specific topics
              </p>
              <Button onClick={onShowMentorBrowser} className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
                <Search className="h-4 w-4 mr-2" />
                Browse Platform Mentors
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {mentorAssignments.map((assignment) => (
                <Card key={assignment.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={assignment.mentor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {assignment.mentor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{assignment.mentor.name}</h4>
                          <p className="text-sm text-muted-foreground">{assignment.mentor.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs ml-1">{assignment.mentor.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {assignment.mentor.totalSessions} sessions
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">${assignment.proposedRate}/session</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMentorAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.topicIds.length} topics assigned</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {assignment.topicIds.map((topicId) => {
                          const topic = curriculum.flatMap((m) => m.topics).find((t) => t.id === topicId)
                          return topic ? (
                            <Badge key={topicId} variant="secondary" className="text-xs">
                              {topic.title}
                            </Badge>
                          ) : null
                        })}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {assignment.mentor.expertise.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {assignment.mentor.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{assignment.mentor.expertise.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Program Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>
                {curriculum.length} modules, {getTotalTopicsCount()} topics
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{mentorAssignments.length} mentors assigned</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {Math.round(
                  curriculum.reduce((total, m) => total + m.topics.reduce((t, topic) => t + topic.duration, 0), 0) / 60,
                )}{" "}
                total hours
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="space-x-2">
          <Button variant="outline">Save as Draft</Button>
          <Button onClick={onSubmit} disabled={isLoading} className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
            {isLoading ? "Creating Program..." : "Create Program"}
            {!isLoading && <Check className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Mentor Browser Modal
interface MentorBrowserModalProps {
  isOpen: boolean
  onClose: () => void
  mentors: PlatformMentor[]
  curriculum: CurriculumModule[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: any
  setFilters: (filters: any) => void
  onSelectMentor: (mentor: PlatformMentor) => void
  existingAssignments: MentorAssignment[]
}

function MentorBrowserModal({
  isOpen,
  onClose,
  mentors,
  curriculum,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  onSelectMentor,
  existingAssignments,
}: MentorBrowserModalProps) {
  const allExpertiseAreas = Array.from(new Set(mentors.flatMap((m) => m.expertise)))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Browse Platform Mentors
          </DialogTitle>
          <DialogDescription>
            Find and invite expert mentors from our platform to teach in your program
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-4 pb-4 border-b">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search mentors by name, expertise, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select value={filters.expertise} onValueChange={(value) => setFilters({ ...filters, expertise: value })}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expertise</SelectItem>
                {allExpertiseAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.availability}
              onValueChange={(value) => setFilters({ ...filters, availability: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priceRange} onValueChange={(value) => setFilters({ ...filters, priceRange: value })}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-100">$0 - $100</SelectItem>
                <SelectItem value="100-150">$100 - $150</SelectItem>
                <SelectItem value="150-200">$150 - $200</SelectItem>
                <SelectItem value="200">$200+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.rating} onValueChange={(value) => setFilters({ ...filters, rating: value })}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4.0">4.0+ Stars</SelectItem>
                <SelectItem value="3.5">3.5+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mentors List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 pr-2">
            {mentors.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No mentors found matching your criteria</p>
              </div>
            ) : (
              mentors.map((mentor) => {
                const isAlreadyAssigned = existingAssignments.some((a) => a.mentorId === mentor.id)

                return (
                  <Card
                    key={mentor.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${isAlreadyAssigned ? "opacity-50" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {mentor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-sm">{mentor.name}</h3>
                              <p className="text-sm text-muted-foreground">{mentor.title}</p>
                              {mentor.company && <p className="text-xs text-muted-foreground">{mentor.company}</p>}
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{mentor.rating}</span>
                                <span className="text-xs text-muted-foreground">({mentor.totalReviews})</span>
                              </div>
                              <p className="text-sm font-medium">${mentor.hourlyRate}/hr</p>
                              <Badge
                                variant={mentor.availability === "available" ? "default" : "secondary"}
                                className="text-xs mt-1"
                              >
                                {mentor.availability}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{mentor.bio}</p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex flex-wrap gap-1">
                              {mentor.expertise.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {mentor.expertise.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{mentor.expertise.length - 3}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {mentor.totalSessions} sessions
                              </div>
                              <div className="flex items-center">
                                <Globe className="h-3 w-3 mr-1" />
                                {mentor.timezone}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end mt-3">
                            <Button
                              size="sm"
                              onClick={() => onSelectMentor(mentor)}
                              disabled={isAlreadyAssigned}
                              className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                            >
                              {isAlreadyAssigned ? "Already Assigned" : "Assign Topics"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Mentor Assignment Modal
interface MentorAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  mentor: PlatformMentor
  curriculum: CurriculumModule[]
  existingAssignments: MentorAssignment[]
  onAssign: (assignment: MentorAssignment) => void
}

function MentorAssignmentModal({
  isOpen,
  onClose,
  mentor,
  curriculum,
  existingAssignments,
  onAssign,
}: MentorAssignmentModalProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [proposedRate, setProposedRate] = useState(150) // Default pay per session
  const [customMessage, setCustomMessage] = useState("")

  const handleAssign = () => {
    const assignment: MentorAssignment = {
      id: `assignment-${Date.now()}`,
      mentorId: mentor.id,
      mentor: mentor,
      moduleIds: [],
      topicIds: selectedTopics,
      proposedRate: proposedRate,
      status: "pending",
      customMessage: customMessage,
    }

    onAssign(assignment)
    setSelectedTopics([])
    setCustomMessage("")
  }

  const getSelectedTopicsDuration = () => {
    return curriculum
      .flatMap((m) => m.topics)
      .filter((topic) => selectedTopics.includes(topic.id))
      .reduce((total, topic) => total + topic.duration, 0)
  }

  const getAssignedTopics = () => {
    const assignedTopicIds = new Set(existingAssignments.flatMap((a) => a.topicIds))
    return assignedTopicIds
  }

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Assign Topics to {mentor.name}
          </DialogTitle>
          <DialogDescription>Select which topics you'd like {mentor.name} to teach in your program</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mentor Info */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground">{mentor.title}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">
                        {mentor.rating} ({mentor.totalReviews} reviews)
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{mentor.totalSessions} sessions</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">${mentor.hourlyRate}/session</p>
                  <Badge variant={mentor.availability === "available" ? "default" : "secondary"}>
                    {mentor.availability}
                  </Badge>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">Expertise:</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.expertise.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proposed Rate */}
          <div className="space-y-2">
            <Label htmlFor="proposedRate">Pay Per Session ($)</Label>
            <Input
              id="proposedRate"
              type="number"
              min="0"
              step="5"
              value={proposedRate}
              onChange={(e) => setProposedRate(Number.parseInt(e.target.value) || 150)}
            />
            <p className="text-xs text-muted-foreground">Enter the amount to pay per session</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Info className="h-3 w-3 mr-1" />
              Mentors are paid on the platform after completion of their assigned sessions.
            </div>
          </div>

          {/* Topic Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Select Topics to Assign</Label>
              <div className="text-sm text-muted-foreground">
                {selectedTopics.length} topics selected
                {selectedTopics.length > 0 && <span> • {Math.round(getSelectedTopicsDuration() / 60)} hours</span>}
              </div>
            </div>

            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              {curriculum.map((module) => (
                <div key={module.id} className="mb-4 last:mb-0">
                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">{module.title}</h4>
                  <div className="space-y-2 pl-4">
                    {module.topics.map((topic) => {
                      const isAlreadyAssigned = getAssignedTopics().has(topic.id)
                      const isSelected = selectedTopics.includes(topic.id)

                      return (
                        <div key={topic.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={topic.id}
                            checked={isSelected}
                            disabled={isAlreadyAssigned}
                            onCheckedChange={() => !isAlreadyAssigned && toggleTopic(topic.id)}
                          />
                          <label
                            htmlFor={topic.id}
                            className={`text-sm flex-1 cursor-pointer ${
                              isAlreadyAssigned ? "text-muted-foreground line-through" : ""
                            }`}
                          >
                            {topic.title}
                            <span className="text-muted-foreground ml-2">({topic.duration} min)</span>
                            {isAlreadyAssigned && <span className="ml-2 text-xs text-red-600">(Already assigned)</span>}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="customMessage">Custom Message (Optional)</Label>
            <Textarea
              id="customMessage"
              placeholder="Add a personal message to your invitation..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary */}
          {selectedTopics.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Assignment Summary</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Topics:</strong> {selectedTopics.length} selected
                  </p>
                  <p>
                    <strong>Total Duration:</strong> {Math.round(getSelectedTopicsDuration() / 60)} hours
                  </p>
                  <p>
                    <strong>Pay Per Session:</strong> ${proposedRate}/session
                  </p>
                  <p>
                    <strong>Estimated Cost:</strong> ${selectedTopics.length * proposedRate} ({selectedTopics.length} sessions × ${proposedRate})
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={selectedTopics.length === 0}
              className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
            >
              Assign Topics & Send Invitation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
