"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
  CheckCircle,
  Award,
  MessageSquare,
  Download,
  Globe,
  Target,
  GraduationCap,
  Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function ProgramDetailPage() {
  const params = useParams()
  const programId = params.id as string

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
    reviews: [
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
    // Navigate to join/enrollment page
    window.location.href = `/programs/${programId}/join`
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/programs">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Programs
                </Link>
              </Button>
              <Link href="/">
                <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {program.type === "training" && (
                <Button variant="outline" asChild>
                  <Link href={`/lms/programs/${programId}`}>
                    <GraduationCap className="h-4 w-4 mr-2" />
                    LMS View
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{program.category}</Badge>
                <Badge className="bg-green-100 text-green-800">{program.level}</Badge>
                <Badge className="bg-blue-100 text-blue-800">{program.format}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-4">{program.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{program.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#FFD500] text-[#FFD500]" />
                  <span className="font-medium">{program.rating}</span>
                  <span>({program.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{program.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{program.totalHours} hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{program.language}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* What You'll Learn */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-[#FFD500]" />
                      What You'll Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {program.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills You'll Gain */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills You'll Gain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {program.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Course Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About This Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{program.longDescription}</p>
                  </CardContent>
                </Card>

                {/* Prerequisites */}
                <Card>
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {program.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Course Curriculum</h3>
                  <p className="text-gray-600">
                    {program.modules} modules • {program.totalHours} hours total length
                  </p>
                </div>

                {program.curriculum.map((module, index) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            Module {index + 1}: {module.title}
                          </CardTitle>
                          <CardDescription>
                            {module.lessons} lessons • {module.duration}
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-center gap-2 text-sm">
                            <Play className="h-3 w-3 text-gray-400" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={program.trainer.image || "/placeholder.svg"} alt={program.trainer.name} />
                        <AvatarFallback>
                          {program.trainer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{program.trainer.name}</CardTitle>
                        <CardDescription className="text-base">{program.trainer.title}</CardDescription>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-[#FFD500] text-[#FFD500]" />
                            <span>{program.trainer.rating} rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{program.trainer.totalStudents.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{program.trainer.totalCourses} courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{program.trainer.bio}</p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {program.trainer.expertise.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold">Student Reviews</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-[#FFD500] text-[#FFD500]" />
                        <span className="font-medium text-lg">{program.rating}</span>
                      </div>
                      <span className="text-gray-600">({program.reviews.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {program.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
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
                              <h4 className="font-medium">{review.student}</h4>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-[#FFD500] text-[#FFD500]" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold">${program.price}</span>
                    {program.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">${program.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">One-time payment • Lifetime access</p>
                </div>

                  <div className="space-y-4">
                    <Button className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]" onClick={handleEnroll}>
                      Enroll Now
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Instructor
                    </Button>
                  </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-medium">This course includes:</h4>
                  <ul className="space-y-2">
                    {program.includes.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{program.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total hours:</span>
                    <span className="font-medium">{program.totalHours} hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Modules:</span>
                    <span className="font-medium">{program.modules}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Language:</span>
                    <span className="font-medium">{program.language}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last updated:</span>
                    <span className="font-medium">{program.lastUpdated}</span>
                  </div>
                  {program.certificateIncluded && (
                    <div className="flex items-center justify-between">
                      <span>Certificate:</span>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-[#FFD500]" />
                        <span className="font-medium">Included</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share this course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
