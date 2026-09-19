"use client"

import { useState } from "react"
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
  Download,
  Globe,
  Target,
  Share2,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ProgramDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const programId = params.id as string
  const viewAsMentor = searchParams.get("view") === "mentor"
  const [showMentorModal, setShowMentorModal] = useState(false)
  const { toast } = useToast()

  // Mock program data - in real app, this would be fetched based on programId
  const program = {
    id: programId,
    title: "Complete Digital Marketing Bootcamp",
    tagline: "Master digital marketing from SEO to social media advertising in this comprehensive bootcamp",
    description:
      "Master digital marketing from SEO to social media advertising in this comprehensive bootcamp. Learn from industry experts and build real-world campaigns.",
    longDescription:
      "This comprehensive digital marketing bootcamp covers everything you need to know to become a successful digital marketer. From search engine optimization and content marketing to paid advertising and analytics, you'll gain hands-on experience with the tools and strategies used by top companies worldwide.",
    type: "training", // training, mentorship, or group
    category: "Marketing",
    level: "Beginner",
    format: "Self-paced",
    duration: "12 weeks",
    price: 299000,
    originalPrice: 399000,
    rating: 4.7,
    reviews: 1247,
    students: 2847,
    modules: 24,
    totalHours: 48,
    language: "English",
    lastUpdated: "December 2023",
    certificateIncluded: true,
    freeSessionsIncluded: 1,
    sessions: 8,
    mentorCompensation: "₦225,000/session",
    trainer: {
      id: "trainer-1",
      name: "Emily Rodriguez",
      title: "Digital Marketing Expert",
      bio: "Emily has over 10 years of experience in digital marketing, having worked with Fortune 500 companies and successful startups. She's helped generate over $50M in revenue through digital campaigns.",
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.8,
      totalStudents: 15000,
      totalCourses: 8,
      expertise: ["Digital Marketing", "SEO", "Social Media", "PPC", "Analytics"],
      socialLinks: {
        linkedin: "https://linkedin.com/in/emilyrodriguez",
        twitter: "https://twitter.com/emilymarketing",
        website: "https://emilyrodriguez.com",
      },
    },
    skills: [
      "SEO",
      "Social Media Marketing",
      "Google Ads",
      "Facebook Ads",
      "Email Marketing",
      "Content Marketing",
      "Analytics",
      "Conversion Optimization",
    ],
    learningOutcomes: [
      "Build and execute comprehensive digital marketing strategies",
      "Master SEO techniques to rank higher in search results",
      "Create effective social media campaigns across all platforms",
      "Set up and optimize Google Ads and Facebook advertising campaigns",
      "Analyze marketing performance using Google Analytics and other tools",
      "Develop content marketing strategies that drive engagement",
      "Implement email marketing automation sequences",
      "Optimize conversion rates and improve ROI",
    ],
    curriculum: [
      {
        id: 1,
        title: "Digital Marketing Fundamentals",
        duration: "4 hours",
        lessons: 8,
        topics: [
          "Introduction to Digital Marketing",
          "Understanding Your Target Audience",
          "Digital Marketing Channels Overview",
          "Setting SMART Marketing Goals",
        ],
      },
      {
        id: 2,
        title: "Search Engine Optimization (SEO)",
        duration: "8 hours",
        lessons: 12,
        topics: [
          "SEO Fundamentals and How Search Engines Work",
          "Keyword Research and Analysis",
          "On-Page SEO Optimization",
          "Technical SEO Best Practices",
          "Link Building Strategies",
        ],
      },
      {
        id: 3,
        title: "Social Media Marketing",
        duration: "6 hours",
        lessons: 10,
        topics: [
          "Platform-Specific Strategies",
          "Content Creation and Curation",
          "Community Management",
          "Social Media Advertising",
        ],
      },
      {
        id: 4,
        title: "Paid Advertising",
        duration: "10 hours",
        lessons: 15,
        topics: [
          "Google Ads Setup and Optimization",
          "Facebook and Instagram Advertising",
          "Display and Video Advertising",
          "Retargeting Campaigns",
        ],
      },
      {
        id: 5,
        title: "Content Marketing",
        duration: "6 hours",
        lessons: 9,
        topics: [
          "Content Strategy Development",
          "Blog Writing and SEO",
          "Video Marketing",
          "Email Marketing Automation",
        ],
      },
      {
        id: 6,
        title: "Analytics and Optimization",
        duration: "8 hours",
        lessons: 12,
        topics: [
          "Google Analytics Setup and Analysis",
          "Conversion Tracking",
          "A/B Testing",
          "ROI Measurement and Reporting",
        ],
      },
    ],
    prerequisites: [
      "Basic computer skills and internet familiarity",
      "No prior marketing experience required",
      "Access to a computer with internet connection",
    ],
    includes: [
      "24 comprehensive modules with video lessons",
      "Downloadable resources and templates",
      "Real-world project assignments",
      "Certificate of completion",
      "Lifetime access to course materials",
      "Private student community access",
      "Direct instructor support",
    ],
    reviewList: [
      {
        id: 1,
        student: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "This course completely transformed my understanding of digital marketing. Emily's teaching style is clear and practical. I was able to implement what I learned immediately and saw results within a month!",
      },
      {
        id: 2,
        student: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        date: "1 month ago",
        comment:
          "Excellent course! The content is up-to-date and covers everything you need to know. The hands-on projects really helped me build a portfolio. Highly recommend!",
      },
      {
        id: 3,
        student: "Lisa Park",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4,
        date: "2 months ago",
        comment:
          "Great comprehensive course. Emily knows her stuff and explains complex concepts in an easy-to-understand way. The only thing I'd like to see is more advanced topics.",
      },
    ],
    mentors: [
      {
        id: "mentor-1",
        name: "David Okonkwo",
        title: "Marketing Strategy Consultant",
        bio: "David specializes in helping startups build effective marketing strategies.",
        image: "/placeholder.svg?height=80&width=80",
        rating: 4.9,
        expertise: ["Strategy", "Growth Marketing", "Brand Development"],
      },
      {
        id: "mentor-2",
        name: "Amina Bello",
        title: "Social Media Expert",
        bio: "Amina has managed social media campaigns for leading Nigerian brands.",
        image: "/placeholder.svg?height=80&width=80",
        rating: 4.7,
        expertise: ["Social Media", "Content Creation", "Community Building"],
      },
      {
        id: "mentor-3",
        name: "Chidi Eze",
        title: "SEO Specialist",
        bio: "Chidi has over 7 years of experience in search engine optimization.",
        image: "/placeholder.svg?height=80&width=80",
        rating: 4.8,
        expertise: ["SEO", "Technical SEO", "Analytics"],
      },
    ],
  }

  const handleEnroll = () => {
    if (viewAsMentor) {
      // Show mentor interest modal
      setShowMentorModal(true)
    } else {
      // Navigate to join/enrollment page
      window.location.href = `/programs/${programId}/join`
    }
  }

  const handleShare = async () => {
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

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0A0A0A] font-sans pb-24 lg:pb-12">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="border-b border-[#E7E5E1] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-[#2B2B2B] hover:text-[#0A0A0A] hover:bg-[#FAF9F6] font-semibold gap-2 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to programmes
          </Button>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-[#E7E5E1] text-[#0A0A0A] font-bold">
              {program.category}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-[#E7E5E1] hover:border-[#0A0A0A] text-[#0A0A0A] font-semibold rounded-xl text-xs"
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Programme Header Area */}
      <div className="border-b border-[#E7E5E1] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="max-w-4xl space-y-4">
            {!viewAsMentor && program.freeSessionsIncluded > 0 && (
              <div className="inline-flex items-center gap-2 bg-[#5B7B6E]/10 text-[#5B7B6E] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#5B7B6E]/20">
                <Sparkles className="h-3.5 w-3.5 text-[#5B7B6E]" />
                <span>Try {program.freeSessionsIncluded} session{program.freeSessionsIncluded > 1 ? 's' : ''} free before committing</span>
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0A0A0A] leading-tight">
              {program.title}
            </h1>

            <p className="text-sm sm:text-base text-[#2B2B2B]/80 leading-relaxed max-w-3xl">
              {program.tagline || program.description}
            </p>

            {/* Meta badges row */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#2B2B2B]/70 pt-2 font-medium">
              <div className="flex items-center gap-1.5 font-bold text-[#0A0A0A]">
                <Star className="h-4 w-4 fill-[#F5C400] text-[#F5C400]" />
                <span>{program.rating}</span>
                <span className="font-normal text-[#2B2B2B]/60">({program.reviews.toLocaleString()} reviews)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#2B2B2B]/60" />
                <span>{program.duration} ({program.totalHours} hours)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Target className="h-4 w-4 text-[#2B2B2B]/60" />
                <span>{program.level}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-[#2B2B2B]/60" />
                <span>{program.students.toLocaleString()} enrolled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - 2 Columns on Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Left Column (7 cols on lg, 8 on xl) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">

            {/* About Section */}
            <section className="bg-white rounded-3xl border border-[#E7E5E1] p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] mb-4">About This Programme</h2>
              <p className="text-sm sm:text-base text-[#2B2B2B]/80 leading-relaxed mb-8">
                {program.longDescription}
              </p>

              {/* What You'll Learn */}
              <div className="border-t border-[#E7E5E1] pt-6 mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-[#0A0A0A] mb-4">
                  {viewAsMentor ? "What You'll Be Teaching" : "What You'll Learn"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {program.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#5B7B6E]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-[#5B7B6E]" />
                      </div>
                      <span className="text-xs sm:text-sm text-[#2B2B2B]/80 font-medium leading-relaxed">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor Compensation (Mentor View Only) */}
              {viewAsMentor && (
                <div className="border-t border-[#E7E5E1] pt-6">
                  <div className="bg-[#FAF9F6] border-2 border-[#0A0A0A] rounded-2xl p-5">
                    <span className="text-xs font-bold text-[#2B2B2B]/70 uppercase tracking-wider block mb-1">Mentor Compensation</span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] mb-1">{program.mentorCompensation}</p>
                    <p className="text-xs text-[#2B2B2B]/70">
                      {program.sessions} sessions total • Direct milestone compensation
                    </p>
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              <div className="border-t border-[#E7E5E1] pt-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#0A0A0A] mb-4">Prerequisites</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {program.prerequisites.map((item, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] mt-2 shrink-0" />
                      <span className="text-xs sm:text-sm text-[#2B2B2B]/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Curriculum & Reviews Tabs */}
            <section className="bg-white rounded-3xl border border-[#E7E5E1] p-6 sm:p-8 shadow-xs">
              <Tabs defaultValue="curriculum" className="w-full">
                <TabsList className="w-full justify-start border-b border-[#E7E5E1] rounded-none h-auto p-0 bg-transparent space-x-6">
                  <TabsTrigger 
                    value="curriculum"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0A0A0A] data-[state=active]:text-[#0A0A0A] pb-3 font-bold text-sm bg-transparent"
                  >
                    Curriculum ({program.modules} Modules)
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0A0A0A] data-[state=active]:text-[#0A0A0A] pb-3 font-bold text-sm bg-transparent"
                  >
                    Student Reviews ({program.reviews.toLocaleString()})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum" className="space-y-4 mt-6">
                  <div className="mb-4">
                    <p className="text-xs sm:text-sm text-[#2B2B2B]/70">
                      Structured into {program.modules} modules covering {program.totalHours} total learning hours
                    </p>
                  </div>

                  <div className="space-y-3">
                    {program.curriculum.map((module, index) => (
                      <div key={module.id} className="border border-[#E7E5E1] rounded-2xl p-5 hover:border-[#0A0A0A] transition-colors bg-[#FAF9F6]">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-sm sm:text-base text-[#0A0A0A]">
                              Module {index + 1}: {module.title}
                            </h4>
                            <p className="text-xs text-[#2B2B2B]/60 mt-0.5">
                              {module.lessons} lessons • {module.duration}
                            </p>
                          </div>
                        </div>
                        <ul className="space-y-1.5 mt-3 pt-3 border-t border-[#E7E5E1]">
                          {module.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-center gap-2 text-xs text-[#2B2B2B]/80">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]/40 shrink-0" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="mb-6 flex items-center gap-4 p-4 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E1]">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-7 w-7 fill-[#F5C400] text-[#F5C400]" />
                      <span className="font-extrabold text-3xl text-[#0A0A0A]">{program.rating}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0A0A0A]">Overall Rating</p>
                      <p className="text-xs text-[#2B2B2B]/60">Based on {program.reviews.toLocaleString()} student reviews</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {program.reviewList.map((review) => (
                      <div key={review.id} className="border border-[#E7E5E1] rounded-2xl p-5 bg-white">
                        <div className="flex items-start gap-3.5">
                          <Avatar className="h-10 w-10 border border-[#E7E5E1]">
                            <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.student} />
                            <AvatarFallback className="font-bold text-xs bg-[#FAF9F6]">
                              {review.student.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-sm text-[#0A0A0A]">{review.student}</h4>
                              <span className="text-xs text-[#2B2B2B]/50">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating ? "fill-[#F5C400] text-[#F5C400]" : "text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs sm:text-sm text-[#2B2B2B]/80 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          </div>

          {/* Right Persistent Column (5 cols on lg, 4 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Primary Enrollment / Purchase Card */}
            <Card className="rounded-3xl border-2 border-[#0A0A0A] bg-white overflow-hidden shadow-md">
              <CardContent className="p-6 sm:p-7 space-y-6">
                {/* Price Display */}
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#0A0A0A]">
                      {program.price === 0 ? "Free" : `₦${program.price.toLocaleString()}`}
                    </span>
                    {program.originalPrice && program.originalPrice > program.price && (
                      <span className="text-base text-[#2B2B2B]/40 line-through font-semibold">
                        ₦{program.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {!viewAsMentor && (
                    <p className="text-xs text-[#2B2B2B]/60 mt-1 font-medium">
                      One-time enrollment fee • Lifetime curriculum access
                    </p>
                  )}
                </div>

                {/* Primary Action Button (The single dominant yellow CTA) */}
                <Button 
                  size="lg"
                  className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold text-base h-13 rounded-xl shadow-xs transition-transform active:scale-[0.99]"
                  onClick={handleEnroll}
                >
                  {viewAsMentor
                    ? `Express Interest • ${program.mentorCompensation}`
                    : `Enroll Now • ${program.price === 0 ? "Free" : `₦${program.price.toLocaleString()}`}`}
                </Button>

                {/* Free session banner if applicable */}
                {!viewAsMentor && program.freeSessionsIncluded > 0 && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#5B7B6E] text-[#5B7B6E] hover:bg-[#5B7B6E]/10 font-bold rounded-xl h-11 text-xs"
                  >
                    <Link href={`/programs/${programId}/join?type=free`}>
                      Claim Free Session Trial
                    </Link>
                  </Button>
                )}

                {/* Highlights checklist */}
                <div className="border-t border-[#E7E5E1] pt-5 space-y-3">
                  <span className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider block">This programme includes:</span>
                  <div className="space-y-2 text-xs text-[#2B2B2B]/80 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#0A0A0A] shrink-0" />
                      <span>{program.duration} ({program.totalHours} hours live & practical)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#0A0A0A] shrink-0" />
                      <span>{program.modules} modular topics with templates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#0A0A0A] shrink-0" />
                      <span>Verified Mentwork Certificate of Completion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#0A0A0A] shrink-0" />
                      <span>Cohort peer group & mentor office hours</span>
                    </div>
                  </div>
                </div>

                {/* Trainer mini badge */}
                <div className="border-t border-[#E7E5E1] pt-5 flex items-center gap-3">
                  <Avatar className="h-11 w-11 border border-[#E7E5E1] shrink-0">
                    <AvatarImage src={program.trainer.image || "/placeholder.svg"} alt={program.trainer.name} />
                    <AvatarFallback className="text-xs font-bold bg-[#FAF9F6]">
                      {program.trainer.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-xs text-[#2B2B2B]/60">Instructed by</p>
                    <p className="text-sm font-bold text-[#0A0A0A] truncate">{program.trainer.name}</p>
                    <p className="text-[11px] text-[#2B2B2B]/70 truncate">{program.trainer.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentors Card */}
            <Card className="rounded-3xl border border-[#E7E5E1] bg-white shadow-xs">
              <CardHeader className="pb-3 border-b border-[#E7E5E1]">
                <CardTitle className="text-xs uppercase tracking-wider font-bold text-[#2B2B2B]/70">Cohort Mentors</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {program.mentors.map((mentor) => (
                  <div key={mentor.id} className="flex gap-3 items-start">
                    <Avatar className="h-10 w-10 border border-[#E7E5E1] shrink-0">
                      <AvatarImage src={mentor.image} alt={mentor.name} />
                      <AvatarFallback className="text-xs font-bold bg-[#FAF9F6]">
                        {mentor.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-[#0A0A0A]">{mentor.name}</h4>
                      <p className="text-[11px] text-[#2B2B2B]/60 truncate">{mentor.title}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {mentor.expertise.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-[10px] px-1.5 py-0 border-[#E7E5E1] font-semibold text-[#2B2B2B]">
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

      {/* Mobile Sticky Bottom Bar (ensures CTA remains accessible on mobile) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E7E5E1] p-3.5 z-40 flex items-center justify-between gap-4 lg:hidden shadow-lg">
        <div>
          <span className="text-xs text-[#2B2B2B]/60 block font-medium">Programme fee</span>
          <span className="text-xl font-black text-[#0A0A0A]">
            {program.price === 0 ? "Free" : `₦${program.price.toLocaleString()}`}
          </span>
        </div>
        <Button
          size="lg"
          className="bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl text-sm px-6 h-11 shadow-xs"
          onClick={handleEnroll}
        >
          {viewAsMentor ? "Express Interest" : "Enroll Now"}
        </Button>
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
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowMentorModal(false)} className="rounded-xl border-[#E7E5E1] font-semibold">
              Cancel
            </Button>
            <Button 
              className="bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl shadow-xs"
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
