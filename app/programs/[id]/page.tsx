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

export default function ProgramDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const programId = params.id as string
  const viewAsMentor = searchParams.get("view") === "mentor"
  const [showMentorModal, setShowMentorModal] = useState(false)

  // Mock program data - in real app, this would be fetched based on programId
  const program = {
    id: programId,
    title: "Complete Digital Marketing Bootcamp",
    description:
      "Master digital marketing from SEO to social media advertising in this comprehensive bootcamp. Learn from industry experts and build real-world campaigns.",
    longDescription:
      "This comprehensive digital marketing bootcamp covers everything you need to know to become a successful digital marketer. From search engine optimization and content marketing to paid advertising and analytics, you'll gain hands-on experience with the tools and strategies used by top companies worldwide.",
    type: "training", // training, mentorship, or group
    category: "Marketing",
    level: "Beginner",
    format: "Self-paced",
    duration: "12 weeks",
    price: 299,
    originalPrice: 399,
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

  const handleMentorInterest = () => {
    // In real app, this would submit mentor interest to backend
    console.log("Mentor interest submitted for program:", programId)
    setShowMentorModal(false)
    // Could show success message or redirect to mentor dashboard
  }

  return (
    <div className="min-h-screen bg-white">
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
              {program.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-4 mb-3">
              <Button 
                size="lg"
                className="bg-[#FFD500] text-black hover:bg-[#e6c000] font-semibold text-lg px-8"
                onClick={handleEnroll}
              >
                {viewAsMentor ? `Express Interest • ${program.mentorCompensation}` : `Enroll Now • $${program.price}`}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white bg-white text-gray-900 hover:bg-gray-100 font-semibold text-lg px-8"
              >
                Watch Trailer
              </Button>
            </div>
            {!viewAsMentor && (
              <p className="text-gray-300 text-sm">
                One-time payment • Lifetime access • {program.freeSessionsIncluded > 0 && 'Free trial included'}
              </p>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <p className="text-lg font-bold text-white">${program.price}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 mx-auto mb-3 text-[#FFD500]" />
                <p className="text-xs text-gray-300 uppercase tracking-wide mb-1">Language</p>
                <p className="text-lg font-bold text-white">{program.language}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-[#FFD500]" />
                <p className="text-xs text-gray-300 uppercase tracking-wide mb-1">Students</p>
                <p className="text-lg font-bold text-white">{program.students.toLocaleString()}</p>
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

            {/* About This Course */}
            <section>
              <h2 className="text-3xl font-bold mb-6">About This Course</h2>
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

              {/* What's Included */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-2xl font-bold mb-6">This course includes:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.includes.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#FFD500] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                </div>
                  ))}
                  {!viewAsMentor && program.freeSessionsIncluded > 0 && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 font-semibold">
                        {program.freeSessionsIncluded} free trial session{program.freeSessionsIncluded > 1 ? 's' : ''} before committing
                      </span>
                </div>
                  )}
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
            {/* Enrolled Students Card */}
            <Card className="border-t-4 border-t-[#FFD500]">
              <CardHeader className="border-b bg-gradient-to-r from-yellow-50 to-white">
                <CardTitle className="text-xl">Enrolled Students</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {/* Student avatars */}
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Avatar key={i} className="h-10 w-10 border-2 border-white">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${i}`} />
                        <AvatarFallback>{i}</AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">+{program.students - 5}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  Join <span className="font-bold text-black">{program.students.toLocaleString()}</span> other students in this transformative journey.
                </p>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-lg uppercase tracking-wide text-gray-600">Instructor</CardTitle>
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

                  <Button className="w-full bg-black text-white hover:bg-gray-800 mb-4">
                    View Profile
                    </Button>
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

            {/* Share Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
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
