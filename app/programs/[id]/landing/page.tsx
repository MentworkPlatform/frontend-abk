"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Award,
  CheckCircle,
  User,
  MessageSquare,
  FileText,
  Linkedin,
  Twitter,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Sample detailed program data for landing page
const programsData = {
  1: {
    id: 1,
    title: "Startup Funding Masterclass",
    tagline: "Learn how to secure funding for your startup with proven strategies",
    description:
      "This comprehensive program covers everything you need to know about securing funding for your startup, from creating a compelling pitch deck to negotiating with investors. Learn directly from an experienced investor who has helped startups raise over $10M in venture capital.",
    highlights: [
      "Create a compelling pitch deck that gets investors' attention",
      "Develop realistic financial projections that build credibility",
      "Learn effective valuation strategies for early-stage startups",
      "Master investor negotiation tactics that protect your interests",
      "Build relationships with the right investors for your business",
    ],
    mentor: {
      name: "Dr. Amina Diallo",
      title: "Tech Entrepreneur & Investor",
      bio: "Dr. Amina Diallo is a serial entrepreneur and angel investor with over 15 years of experience in the tech industry. She has founded 3 successful startups and raised over $10M in venture capital. As an investor, she has funded over 20 early-stage startups across Africa, with 5 successful exits to date.",
      achievement: "Raised $10M for 3 startups",
      image: "/placeholder.svg?height=200&width=200",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      website: "https://example.com",
    },
    category: "Business Growth",
    industry: "Technology",
    type: "Group Program",
    format: "Virtual",
    level: "Intermediate",
    language: "English",
    sessions: 8,
    freeSessionsIncluded: 1,
    duration: "8 weeks",
    price: 1200,
    rating: 4.9,
    reviews: 124,
    studentsEnrolled: 437,
    startDate: "June 15, 2025",
    image: "/placeholder.svg?height=500&width=800",
    curriculum: [
      {
        title: "Introduction to Startup Funding",
        description: "Overview of funding options and understanding investor expectations",
        isFree: true,
        content: [
          "Different types of startup funding",
          "When to raise capital vs. bootstrapping",
          "Understanding the funding landscape in Africa",
          "What investors look for in early-stage startups",
        ],
      },
      {
        title: "Creating a Compelling Pitch Deck",
        description: "Learn how to structure your pitch deck to attract investors",
        isFree: false,
        content: [
          "Key components of an effective pitch deck",
          "Storytelling techniques that captivate investors",
          "Common pitch deck mistakes to avoid",
          "Live critique of real pitch decks",
        ],
      },
      {
        title: "Financial Projections",
        description: "How to create realistic financial projections that investors trust",
        isFree: false,
        content: [
          "Building financial models for early-stage startups",
          "Revenue forecasting methods that make sense",
          "Understanding unit economics and growth metrics",
          "How to present your financials in a compelling way",
        ],
      },
      {
        title: "Valuation Strategies",
        description: "Understanding company valuation methods and negotiation tactics",
        isFree: false,
        content: [
          "Valuation methodologies for pre-revenue startups",
          "Navigating pre-money vs. post-money valuations",
          "Cap tables and equity dilution considerations",
          "Negotiation strategies to maximize your valuation",
        ],
      },
      {
        title: "Finding the Right Investors",
        description: "Strategies for identifying and approaching potential investors",
        isFree: false,
        content: [
          "Creating your ideal investor profile",
          "Research techniques to find aligned investors",
          "Cold outreach strategies that get responses",
          "Building relationships before you need money",
        ],
      },
      {
        title: "Term Sheet Negotiation",
        description: "Understanding term sheets and how to negotiate favorable terms",
        isFree: false,
        content: [
          "Common term sheet clauses and their implications",
          "Red flags to watch out for in investor agreements",
          "Negotiation tactics for founder-friendly terms",
          "When to bring in legal help",
        ],
      },
      {
        title: "Due Diligence Process",
        description: "Preparing for and navigating the due diligence process",
        isFree: false,
        content: [
          "What to expect during investor due diligence",
          "Creating a comprehensive due diligence package",
          "Addressing potential concerns proactively",
          "Managing the timeline and process effectively",
        ],
      },
      {
        title: "Post-Funding Growth Strategies",
        description: "How to effectively use funding to accelerate growth",
        isFree: false,
        content: [
          "Strategic resource allocation after funding",
          "Balancing growth with runway preservation",
          "Building investor relationships post-funding",
          "Planning for your next funding round",
        ],
      },
    ],
    testimonials: [
      {
        name: "Sarah Johnson",
        title: "Founder, TechGrow",
        content:
          "This program helped me secure $500K in seed funding for my startup. The pitch deck strategies were invaluable, and Dr. Diallo's insights into investor psychology completely changed my approach to fundraising.",
        rating: 5,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: "Michael Okonkwo",
        title: "CEO, FinTech Solutions",
        content:
          "After struggling to get investor meetings for months, I implemented the strategies from this program and secured four meetings in just two weeks. We closed our round 30% oversubscribed. The program literally paid for itself a thousand times over.",
        rating: 5,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: "Fatima Ahmed",
        title: "Founder, EduTech Africa",
        content:
          "The financial modeling sessions alone were worth the price of the entire program. I now have a solid grasp on my numbers and can confidently discuss them with potential investors. Dr. Diallo is an incredible mentor.",
        rating: 4,
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    faqs: [
      {
        question: "How is this program different from other fundraising courses?",
        answer:
          "This program is led by an actual investor who's been on both sides of the table. You'll get practical, hands-on guidance rather than just theory. We focus specifically on the African startup ecosystem and its unique challenges and opportunities.",
      },
      {
        question: "Do I need to have a complete business plan to join?",
        answer:
          "No, you can join at any stage. If you're early in your journey, this program will help you build the foundation for future fundraising. If you're ready to raise, you'll refine your approach for immediate implementation.",
      },
      {
        question: "How many participants will be in the group sessions?",
        answer:
          "Each group is limited to 10 participants to ensure everyone gets personalized attention and opportunities to ask questions relevant to their specific situation.",
      },
      {
        question: "Is this program suitable for early-stage startups?",
        answer:
          "Yes, this program is designed for founders at all stages, from idea to Series A. The strategies are adaptable to your specific situation, and you'll learn what you need to prepare now for future fundraising success.",
      },
      {
        question: "Will there be recordings of the sessions?",
        answer:
          "Yes, all sessions will be recorded and available for participants to review for up to 6 months after the program ends.",
      },
      {
        question: "What happens if I miss a session?",
        answer:
          "You'll have access to the recording, and you can submit questions to be addressed in the next session. We also provide a community forum where you can catch up on discussions.",
      },
    ],
    bonuses: [
      {
        title: "Pitch Deck Template Bundle",
        description: "Ready-to-use templates to create your investor pitch deck",
      },
      {
        title: "Financial Model Spreadsheet",
        description: "Customizable Excel/Google Sheets template for creating financial projections",
      },
      {
        title: "Investor Research Database",
        description: "List of 100+ active investors in Africa with contact information",
      },
      {
        title: "Private Community Access",
        description: "6-month access to our community of founders for networking and support",
      },
    ],
    guarantee: "30-day money-back guarantee if you're not completely satisfied with the program",
  },
  // Add other program data as needed
}

export default function ProgramLandingPage() {
  const params = useParams()
  const router = useRouter()
  const [expandedSessionIndex, setExpandedSessionIndex] = useState<number | null>(null)

  // Get program ID from URL params
  const programId = Number(params.id)

  // Get program data based on ID
  const program = programsData[programId as keyof typeof programsData]

  // If program not found, show error or redirect
  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Program Not Found</CardTitle>
            <CardDescription>The program you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/programs">Browse Programs</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const toggleSessionExpand = (index: number) => {
    if (expandedSessionIndex === index) {
      setExpandedSessionIndex(null)
    } else {
      setExpandedSessionIndex(index)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link href="/">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#programs" className="text-sm font-medium hover:underline">
              Programs
            </Link>
            <Link href="/#how-it-works" className="text-sm font-medium hover:underline">
              How It Works
            </Link>
            <Link href="/#featured-programs" className="text-sm font-medium hover:underline">
              Featured Programs
            </Link>
            <Link href="/#partners" className="text-sm font-medium hover:underline">
              Partners
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline hidden md:block">
              Log in
            </Link>
            <Button asChild className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#f8f8f8] border-b">
        <div className="container py-12 px-4 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Link
                href="/programs"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
              </Link>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-[#FFD500] text-black">{program.type}</Badge>
                <Badge variant="outline" className="bg-white">
                  {program.category}
                </Badge>
                <Badge variant="outline" className="bg-white">
                  {program.industry}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{program.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{program.tagline}</p>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(program.rating) ? "fill-[#FFD500] text-[#FFD500]" : "fill-gray-200 text-gray-200"}`}
                    />
                  ))}
                </div>
                <span className="font-bold">{program.rating}</span>
                <span className="text-gray-600">({program.reviews} reviews)</span>
                <span className="text-gray-600 mx-2">•</span>
                <span className="text-gray-600">{program.studentsEnrolled} students enrolled</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={program.mentor.image || "/placeholder.svg"} alt={program.mentor.name} />
                  <AvatarFallback>
                    {program.mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Created by</p>
                  <p className="text-lg font-bold">{program.mentor.name}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000] text-lg px-8 py-6 h-auto">
                  Enroll Now for ${program.price}
                </Button>
                <Button variant="outline" className="text-lg px-8 py-6 h-auto">
                  Try Free Session
                </Button>
              </div>
              <p className="text-gray-500">
                Starting {program.startDate} • {program.sessions} sessions • {program.duration}
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src={program.image || "/placeholder.svg"}
                alt={program.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-12 px-4 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                    <p>{highlight}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Program Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">{program.description}</p>
                <p className="text-gray-700">
                  This program combines live instructor-led sessions, practical assignments, and personalized feedback
                  to ensure you develop the skills and confidence needed to secure funding for your startup. Whether
                  you're preparing for your first funding round or looking to improve your approach for future raises,
                  this program will provide you with the strategies and tools you need to succeed.
                </p>
              </div>
            </section>

            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Program Curriculum</h2>
              <div className="space-y-4">
                {program.curriculum.map((session, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg overflow-hidden ${session.isFree ? "border-green-200" : "border-gray-200"}`}
                  >
                    <div
                      className={`p-4 ${session.isFree ? "bg-green-50" : "bg-gray-50"} cursor-pointer`}
                      onClick={() => toggleSessionExpand(index)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">Session {index + 1}:</span>
                            <h3 className="font-medium">{session.title}</h3>
                            {session.isFree && <Badge className="bg-green-500 text-white">Free Preview</Badge>}
                          </div>
                          <p className="text-gray-600 mt-1">{session.description}</p>
                        </div>
                        <div>
                          {expandedSessionIndex === index ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    {expandedSessionIndex === index && (
                      <div className="p-4 border-t">
                        <h4 className="font-medium mb-2">Session Content:</h4>
                        <ul className="space-y-2">
                          {session.content.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="h-5 w-5 bg-[#FFD500] rounded-full flex items-center justify-center text-black font-medium text-xs mt-0.5">
                                {i + 1}
                              </div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Your Instructor</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={program.mentor.image || "/placeholder.svg"}
                      alt={program.mentor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={program.mentor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn profile"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={program.mentor.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter profile"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={program.mentor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Personal website"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">{program.mentor.name}</h3>
                  <p className="text-gray-600 mb-4">{program.mentor.title}</p>
                  <div className="bg-[#f5f5f5] p-3 rounded-lg mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#FFD500]" />
                    <p className="font-medium">{program.mentor.achievement}</p>
                  </div>
                  <p className="text-gray-700">{program.mentor.bio}</p>
                </div>
              </div>
            </section>

            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Student Testimonials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {program.testimonials.map((testimonial, index) => (
                  <Card key={index} className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? "fill-[#FFD500] text-[#FFD500]" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                          <AvatarFallback>
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {program.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl">₦{(program.price * 1500).toLocaleString()}</CardTitle>
                  <CardDescription>
                    {program.sessions} sessions ({program.freeSessionsIncluded} free)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>Starts {program.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>Duration: {program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-5 w-5 text-gray-500" />
                    <span>Level: {program.level}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                    <span>Language: {program.language}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span>Format: {program.format}</span>
                  </div>

                  <div className="pt-2">
                    <p className="font-medium mb-2">This program includes:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>
                          {program.sessions} live sessions with {program.mentor.name}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Lifetime access to session recordings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Practical assignments with feedback</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Certificate of completion</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000] h-12 text-lg">Enroll Now</Button>
                  <Button variant="outline" className="w-full h-12">
                    Try Free Session
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-2">{program.guarantee}</p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bonus Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {program.bonuses.map((bonus, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-5 w-5 bg-[#FFD500] rounded-full flex items-center justify-center text-black font-medium text-xs mt-0.5">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{bonus.title}</p>
                          <p className="text-sm text-gray-600">{bonus.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <section className="bg-[#f8f8f8] py-16">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Funding Journey?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join {program.studentsEnrolled}+ entrepreneurs who have already improved their funding prospects through
              this program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000] text-lg px-8 py-6 h-auto">
                Enroll Now for ${program.price}
              </Button>
              <Button variant="outline" className="text-lg px-8 py-6 h-auto">
                Try Free Session
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">{program.guarantee}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Mentwork</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/mission" className="text-sm text-gray-600 hover:underline">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-gray-600 hover:underline">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-600 hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Programs</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/programs" className="text-sm text-gray-600 hover:underline">
                    Browse All
                  </Link>
                </li>
                <li>
                  <Link href="/programs?category=business-growth" className="text-sm text-gray-600 hover:underline">
                    Business Growth
                  </Link>
                </li>
                <li>
                  <Link href="/programs?category=marketing" className="text-sm text-gray-600 hover:underline">
                    Marketing
                  </Link>
                </li>
                <li>
                  <Link href="/programs?category=leadership" className="text-sm text-gray-600 hover:underline">
                    Leadership
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-sm text-gray-600 hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-sm text-gray-600 hover:underline">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-sm text-gray-600 hover:underline">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-gray-600 hover:underline">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 hover:underline">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:underline">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-gray-600 hover:underline">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Mentwork by Outliers Institute. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
