"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Star, Clock, Users, BookOpen, Play, ArrowRight, Sparkles, GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data for different program types
const mentorshipPrograms = [
  {
    id: 1,
    title: "1:1 Business Strategy Mentorship",
    mentor: {
      name: "Sarah Johnson",
      title: "Former McKinsey Partner",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.9,
    },
    type: "mentorship",
    format: "1:1",
    duration: "3 months",
    price: 2500,
    rating: 4.8,
    reviews: 127,
    category: "Business",
    level: "Advanced",
    description: "Get personalized guidance on business strategy, growth planning, and leadership development.",
  },
  {
    id: 2,
    title: "Product Management Career Acceleration",
    mentor: {
      name: "Michael Chen",
      title: "VP Product at Stripe",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.9,
    },
    type: "mentorship",
    format: "1:1",
    duration: "6 months",
    price: 3200,
    rating: 4.9,
    reviews: 89,
    category: "Product",
    level: "Intermediate",
    description: "Accelerate your product management career with guidance from a seasoned VP of Product.",
  },
]

const trainingPrograms = [
  {
    id: 3,
    title: "Complete Digital Marketing Bootcamp",
    trainer: {
      name: "Emily Rodriguez",
      title: "Digital Marketing Expert",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.8,
      students: 2847,
    },
    type: "training",
    format: "Self-paced",
    duration: "12 weeks",
    modules: 24,
    price: 299,
    rating: 4.7,
    reviews: 1247,
    category: "Marketing",
    level: "Beginner",
    description: "Master digital marketing from SEO to social media advertising in this comprehensive bootcamp.",
    skills: ["SEO", "Social Media", "PPC", "Analytics"],
    freeSessionsIncluded: 1,
  },
  {
    id: 4,
    title: "Advanced Data Science with Python",
    trainer: {
      name: "Dr. James Wilson",
      title: "Data Science Lead",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.9,
      students: 1523,
    },
    type: "training",
    format: "Live sessions",
    duration: "16 weeks",
    modules: 32,
    price: 599,
    rating: 4.8,
    reviews: 892,
    category: "Technology",
    level: "Advanced",
    description: "Deep dive into machine learning, data analysis, and statistical modeling with Python.",
    skills: ["Python", "Machine Learning", "Statistics", "Data Visualization"],
  },
  {
    id: 5,
    title: "UX Design Fundamentals",
    trainer: {
      name: "Lisa Park",
      title: "Senior UX Designer",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.7,
      students: 1876,
    },
    type: "training",
    format: "Hybrid",
    duration: "10 weeks",
    modules: 20,
    price: 399,
    rating: 4.6,
    reviews: 1034,
    category: "Design",
    level: "Beginner",
    description: "Learn user experience design principles, research methods, and prototyping tools.",
    skills: ["User Research", "Prototyping", "Figma", "Design Thinking"],
  },
]

const groupPrograms = [
  {
    id: 6,
    title: "Startup Accelerator Program",
    mentor: {
      name: "Alex Thompson",
      title: "Serial Entrepreneur",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.8,
    },
    type: "group",
    format: "Cohort",
    duration: "12 weeks",
    participants: 25,
    price: 1500,
    rating: 4.7,
    reviews: 156,
    category: "Entrepreneurship",
    level: "Intermediate",
    description: "Join a cohort of entrepreneurs to build, validate, and launch your startup idea.",
    freeSessionsIncluded: 2,
  },
]

const allPrograms = [...mentorshipPrograms, ...trainingPrograms, ...groupPrograms]

export default function ProgramsPage() {
  const searchParams = useSearchParams()
  const fromOnboarding = searchParams.get("from") === "onboarding"
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("all")

  // Filter function for programs
  const matchesFilters = (program: any) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || program.category.toLowerCase() === selectedCategory
    const matchesLevel = selectedLevel === "all" || program.level.toLowerCase() === selectedLevel
    const matchesFormat = (() => {
      if (selectedFormat === "all") return true
      const programFormat = program.format.toLowerCase()
      // Map program formats to filter values
      if (selectedFormat === "hybrid") {
        return programFormat.includes("hybrid")
      }
      if (selectedFormat === "online") {
        return programFormat.includes("self-paced") || programFormat.includes("live") || programFormat.includes("online")
      }
      if (selectedFormat === "in-person") {
        return programFormat.includes("in-person") || programFormat.includes("cohort") || programFormat.includes("1:1")
      }
      return false
    })()

    return matchesSearch && matchesCategory && matchesLevel && matchesFormat
  }

  // Simple matching logic - in real app, this would use onboarding data from backend
  // For now, we'll show some programs as "recommended" when coming from onboarding
  const recommendedPrograms = useMemo(() => {
    if (!fromOnboarding) return []
    // Mock: Show first 3-4 programs as recommended (in real app, match based on onboarding data)
    return allPrograms.slice(0, 4)
  }, [fromOnboarding])

  const filteredPrograms = allPrograms.filter(matchesFilters)
  const filteredRecommended = recommendedPrograms.filter(matchesFilters)

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
            </Link>
                <Button variant="ghost" size="sm" asChild>
              <Link href="/mentee/dashboard">Dashboard</Link>
                </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover Learning Programs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose from mentorship programs, comprehensive training courses, or group learning experiences designed by
            industry experts
          </p>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search programs, skills, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Recommended Programs Section (only when coming from onboarding) */}
        {fromOnboarding && filteredRecommended.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-[#FFD500]" />
              <h2 className="text-2xl font-bold">Recommended for You</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Based on your profile, here are programs that match your goals and interests
            </p>
            <ProgramGrid programs={filteredRecommended} />
          </div>
        )}

        {/* All Programs Section */}
        <div className={fromOnboarding ? "mb-12" : ""}>
          {fromOnboarding && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">All Programs</h2>
              <p className="text-gray-600">Browse all available programs</p>
            </div>
          )}

        {/* All Programs */}
        <ProgramGrid programs={filteredPrograms} />
        </div>

        {/* Featured Training Programs Section */}
        <div className="mt-16 mb-12">
          <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Featured Training Programs</h2>
              <p className="text-gray-600">Comprehensive courses created by expert trainers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingPrograms.slice(0, 3).map((program) => (
              <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  {program.freeSessionsIncluded && program.freeSessionsIncluded > 0 && (
                    <Badge className="absolute top-3 left-3 bg-[#FFD500] text-black font-semibold">
                      Free Trial Available
                    </Badge>
                  )}
                  <Badge className="absolute top-3 right-3 bg-green-500 text-white">{program.level}</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{program.category}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-[#FFD500] text-[#FFD500]" />
                      <span className="text-sm font-medium ml-1">{program.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({program.reviews})</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{program.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={program.trainer.image || "/placeholder.svg"} alt={program.trainer.name} />
                      <AvatarFallback>
                        {program.trainer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{program.trainer.name}</p>
                      <p className="text-xs text-gray-500">{program.trainer.students.toLocaleString()} students</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{program.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {program.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {program.modules} modules
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {program.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {program.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{program.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">₦{(program.price * 1500).toLocaleString()}</span>
                    <Button size="sm" className="bg-[#FFD500] text-black hover:bg-[#e6c000]" asChild>
                      <Link href={`/programs/${program.id}`}>View Course</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/programs?tab=training">
                View All Training Programs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Program Grid Component
function ProgramGrid({ programs }: { programs: any[] }) {
  if (programs.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  )
}

// Program Card Component
function ProgramCard({ program }: { program: any }) {
  const isTraining = program.type === "training"
  const isMentorship = program.type === "mentorship"
  const isGroup = program.type === "group"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {isTraining ? (
          <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Play className="h-12 w-12 text-white" />
          </div>
        ) : isMentorship ? (
          <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <Users className="h-12 w-12 text-white" />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
        )}
        {program.freeSessionsIncluded && program.freeSessionsIncluded > 0 && (
          <Badge className="absolute top-3 left-3 bg-[#FFD500] text-black font-semibold">
            Free Trial Available
          </Badge>
        )}
        <Badge className="absolute top-3 right-3 bg-green-500 text-white">{program.level}</Badge>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline">{program.category}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-[#FFD500] text-[#FFD500]" />
            <span className="text-sm font-medium ml-1">{program.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({program.reviews})</span>
          </div>
        </div>
        <h3 className="font-bold text-lg mb-2">{program.title}</h3>
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={program.mentor?.image || program.trainer?.image || "/placeholder.svg"}
              alt={program.mentor?.name || program.trainer?.name}
            />
            <AvatarFallback>
              {(program.mentor?.name || program.trainer?.name)
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{program.mentor?.name || program.trainer?.name}</p>
            <p className="text-xs text-gray-500">
              {program.mentor?.title || program.trainer?.title}
              {program.trainer?.students && ` • ${program.trainer.students.toLocaleString()} students`}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{program.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {program.duration}
          </span>
          {isTraining && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {program.modules} modules
            </span>
          )}
          {isGroup && (
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {program.participants} participants
            </span>
          )}
        </div>
        {isTraining && program.skills && (
          <div className="flex flex-wrap gap-1 mb-4">
            {program.skills.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {program.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{program.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">₦{(program.price * 1500).toLocaleString()}</span>
          <Button size="sm" className="bg-[#FFD500] text-black hover:bg-[#e6c000]" asChild>
            <Link href={`/programs/${program.id}`}>
              {isTraining ? "View Course" : isMentorship ? "View Program" : "Join Cohort"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
