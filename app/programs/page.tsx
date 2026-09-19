"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Star, Clock, Users, BookOpen, Play, ArrowRight, Sparkles, GraduationCap, Menu, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
    price: 3750000,
    rating: 4.8,
    reviews: 127,
    category: "Business",
    level: "Advanced",
    description: "Get personalized guidance on business strategy, growth planning, and leadership development.",
    bannerBg: "bg-[#2B2B2B]",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop&q=80",
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
    price: 4800000,
    rating: 4.9,
    reviews: 89,
    category: "Product",
    level: "Intermediate",
    description: "Accelerate your product management career with guidance from a seasoned VP of Product.",
    bannerBg: "bg-[#6E7BA8]",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80",
  },
]

const trainingPrograms = [
  {
    id: 3,
    title: "Digital Marketing for SMEs",
    trainer: {
      name: "Zainab Nadada",
      title: "Digital Marketing Expert",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.8,
      students: 2847,
    },
    type: "training",
    format: "Hybrid",
    duration: "12 weeks",
    modules: 24,
    price: 45000,
    rating: 4.8,
    reviews: 1247,
    category: "Marketing",
    level: "Beginner",
    description: "Master digital marketing from SEO to social media advertising in this practical bootcamp.",
    skills: ["SEO", "Social Media", "Paid Ads", "Analytics"],
    freeSessionsIncluded: 1,
    bannerBg: "bg-[#2B2B2B]",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Web & Mobile App Development",
    trainer: {
      name: "Tunde Aro",
      title: "Full Stack Engineer",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.9,
      students: 1523,
    },
    type: "training",
    format: "Hybrid",
    duration: "10 weeks",
    modules: 32,
    price: 180000,
    rating: 4.8,
    reviews: 892,
    category: "Technology",
    level: "Intermediate",
    description: "Hands-on bootcamp covering full-stack fundamentals through real-world client projects.",
    skills: ["React", "Node.js", "TypeScript", "Next.js"],
    bannerBg: "bg-[#5B7B6E]",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop&q=80",
  },
  {
    id: 5,
    title: "UX Research Foundations",
    trainer: {
      name: "Amaka Obi",
      title: "Senior Product Designer",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.9,
      students: 1876,
    },
    type: "training",
    format: "Online",
    duration: "6 weeks",
    modules: 16,
    price: 0,
    rating: 4.9,
    reviews: 1034,
    category: "Design",
    level: "Beginner",
    description: "Learn user experience design principles, research methods, and wireframing tools.",
    skills: ["User Research", "Wireframing", "Figma", "Design Thinking"],
    freeSessionsIncluded: 1,
    bannerBg: "bg-[#6E7BA8]",
    image: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=600&h=400&fit=crop&q=80",
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
    price: 2250000,
    rating: 4.7,
    reviews: 156,
    category: "Entrepreneurship",
    level: "Intermediate",
    description: "Join a cohort of entrepreneurs to build, validate, and launch your startup idea.",
    freeSessionsIncluded: 2,
    bannerBg: "bg-[#B0674A]",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop&q=80",
  },
]

const INITIATIVES = [
  {
    id: "build",
    title: "BUILD: The STEM Space",
    partner: "With NASENI",
    description: "212 trained · 14 placements · 120 schools",
    badge: "NASENI",
    bg: "bg-[#0A0A0A]",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&fit=crop&q=80",
    href: "/initiatives/build",
  },
  {
    id: "msme",
    title: "MSME Growth Ecosystem",
    partner: "With SMEDAN",
    description: "High-impact incubation for Nigerian SMEs",
    badge: "SMEDAN",
    bg: "bg-[#2B2B2B]",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop&q=80",
    href: "/initiatives/industry-academia",
  },
  {
    id: "ecowas",
    title: "Small Business Coalition",
    partner: "With ECOWAS",
    description: "Youth entrepreneurship across West Africa",
    badge: "ECOWAS",
    bg: "bg-[#5B7B6E]",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=500&fit=crop&q=80",
    href: "/initiatives/small-business",
  },
]

const allPrograms = [...mentorshipPrograms, ...trainingPrograms, ...groupPrograms]

export default function ProgramsPage() {
  const searchParams = useSearchParams()
  const fromOnboarding = searchParams.get("from") === "onboarding"
  const viewAsMentor = searchParams.get("view") === "mentor"
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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
      if (selectedFormat === "hybrid") return programFormat.includes("hybrid")
      if (selectedFormat === "online") return programFormat.includes("self-paced") || programFormat.includes("live") || programFormat.includes("online")
      if (selectedFormat === "in-person") return programFormat.includes("in-person") || programFormat.includes("cohort") || programFormat.includes("1:1")
      return false
    })()

    return matchesSearch && matchesCategory && matchesLevel && matchesFormat
  }

  const recommendedPrograms = useMemo(() => {
    if (!fromOnboarding) return []
    return allPrograms.slice(0, 4)
  }, [fromOnboarding])

  const filteredPrograms = allPrograms.filter(matchesFilters)
  const filteredRecommended = recommendedPrograms.filter(matchesFilters)

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans antialiased flex flex-col">
      {/* Header - Translucent Sticky Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#E7E5E1]/80 bg-white/70 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" aria-label="Mentwork home">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto sm:h-9" />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <span className="text-sm font-bold text-[#0A0A0A] border-b-2 border-[#0A0A0A] pb-1">Explore</span>
              <Link href="/initiatives" className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">Initiatives</Link>
              <Link href="/onboarding/trainer" className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">Become a Trainer</Link>
              <Link href="/onboarding/mentor" className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">Become a Mentor</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A]">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-full text-xs sm:text-sm px-4 sm:px-5 hover:bg-[#e0b300]">
              <Link href="/get-started">Get Started</Link>
            </Button>

            {/* Mobile Nav Toggle */}
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 text-[#0A0A0A] rounded-xl hover:bg-[#F2F1EE]" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100vw-2rem,320px)] p-6 bg-white flex flex-col border-l border-[#E7E5E1]">
                <div className="flex items-center justify-between pb-6 border-b border-[#E7E5E1]">
                  <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
                </div>
                <div className="flex flex-col gap-2 pt-6 flex-1">
                  <span className="text-base font-bold text-[#0A0A0A] py-2 px-3 bg-[#F2F1EE] rounded-xl">
                    Explore Programmes
                  </span>
                  <Link
                    href="/#initiatives"
                    className="text-base font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] py-2 px-3 rounded-xl hover:bg-[#FAF9F6] transition-colors"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Initiatives
                  </Link>
                  <Link
                    href="/onboarding/trainer"
                    className="text-base font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] py-2 px-3 rounded-xl hover:bg-[#FAF9F6] transition-colors"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Become a Trainer
                  </Link>
                  <Link
                    href="/onboarding/mentor"
                    className="text-base font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] py-2 px-3 rounded-xl hover:bg-[#FAF9F6] transition-colors"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Become a Mentor
                  </Link>
                  <Link
                    href="/onboarding"
                    className="text-base font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] py-2 px-3 rounded-xl hover:bg-[#FAF9F6] transition-colors"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Become a Mentee
                  </Link>
                  <Link
                    href="/login"
                    className="text-base font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] py-2 px-3 rounded-xl hover:bg-[#FAF9F6] transition-colors"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Log in
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 w-full">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
            {viewAsMentor ? "Mentor Opportunities" : "Explore programmes"}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1.5 max-w-2xl">
            {viewAsMentor
              ? "Apply to mentor in high-impact programmes and guide next-generation learners."
              : "Discover vetted bootcamps, workshops, and cohorts across leading sectors."}
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-[#F2F1EE] rounded-2xl p-4 sm:p-5 mb-10 border border-[#E7E5E1]">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#9B9B9B] h-4 w-4" />
              <Input
                placeholder="Search programmes, skills, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white border-[#D8D5CF] rounded-xl text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-11 bg-white border-[#D8D5CF] rounded-xl text-xs sm:text-sm font-semibold">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="h-11 bg-white border-[#D8D5CF] rounded-xl text-xs sm:text-sm font-semibold">
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
                <SelectTrigger className="h-11 bg-white border-[#D8D5CF] rounded-xl text-xs sm:text-sm font-semibold">
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

        {/* Dedicated Initiatives Row */}
        <section id="initiatives" className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold tracking-wider text-[#B0674A] uppercase">
              Impact Initiatives
            </span>
            <Link
              href="/initiatives"
              className="text-xs font-bold text-[#0A0A0A] hover:underline flex items-center gap-1"
            >
              See all initiatives <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {INITIATIVES.map((init) => (
              <Link
                key={init.id}
                href={init.href}
                className="group rounded-2xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:border-[#D8D5CF] hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-32 w-full overflow-hidden bg-[#0A0A0A]">
                  <Image
                    src={init.image}
                    alt={init.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-between z-10">
                    <Badge variant="yellow">{init.badge}</Badge>
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#0A0A0A] group-hover:text-[#F5C400] transition-colors">{init.title}</h3>
                    <p className="text-xs font-semibold text-[#6B6B6B] mt-0.5">{init.partner}</p>
                    <p className="text-xs text-[#9B9B9B] mt-2">{init.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E7E5E1] flex items-center justify-between text-xs font-bold text-[#0A0A0A]">
                    <span>Learn more</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recommended Programs Section (when from onboarding) */}
        {fromOnboarding && filteredRecommended.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-[#F5C400]" />
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0A0A0A]">Recommended for You</h2>
            </div>
            <ProgramGrid programs={filteredRecommended} viewAsMentor={viewAsMentor} />
          </div>
        )}

        {/* All Programmes Header & Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-extrabold tracking-wider text-[#B0674A] uppercase">
              All Programmes ({filteredPrograms.length})
            </span>
          </div>
          <ProgramGrid programs={filteredPrograms} viewAsMentor={viewAsMentor} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E5E1] bg-white py-6 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-6 w-auto" />
            <span className="text-[#9B9B9B]">© 2026 Mentwork. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-[#6B6B6B] font-semibold">
            <Link href="/" className="hover:text-[#0A0A0A]">Home</Link>
            <Link href="/get-started" className="hover:text-[#0A0A0A]">Get Started</Link>
            <Link href="/login" className="hover:text-[#0A0A0A]">Log in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProgramGrid({ programs, viewAsMentor = false }: { programs: any[]; viewAsMentor?: boolean }) {
  if (programs.length === 0) {
    return (
      <div className="text-center py-16 bg-[#F2F1EE] rounded-2xl border border-[#E7E5E1]">
        <BookOpen className="h-10 w-10 text-[#9B9B9B] mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#0A0A0A] mb-1">No programmes found</h3>
        <p className="text-xs text-[#6B6B6B]">Try adjusting your search criteria or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} viewAsMentor={viewAsMentor} />
      ))}
    </div>
  )
}

function ProgramCard({ program, viewAsMentor = false }: { program: any; viewAsMentor?: boolean }) {
  const isTraining = program.type === "training"
  const bannerBg = program.bannerBg || (isTraining ? "bg-[#2B2B2B]" : "bg-[#5B7B6E]")

  return (
    <div className="group rounded-2xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-[#D8D5CF] transition-all flex flex-col justify-between">
      <div>
        <div className={`relative h-44 w-full overflow-hidden ${bannerBg}`}>
          {program.image ? (
            <Image
              src={program.image}
              alt={program.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between z-10">
            <Badge variant="yellow">{program.category}</Badge>
            {program.freeSessionsIncluded && program.freeSessionsIncluded > 0 ? (
              <Badge variant="black">Free Session</Badge>
            ) : (
              <Badge variant="outline" className="bg-white/80 border-none text-[#0A0A0A] font-bold">
                {program.level}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-[#6B6B6B]">{program.format} · {program.duration}</span>
            <div className="flex items-center gap-1 text-xs font-bold text-[#0A0A0A]">
              <Star className="h-3.5 w-3.5 fill-[#F5C400] text-[#F5C400]" />
              <span>{program.rating}</span>
              <span className="text-[#9B9B9B] font-normal">({program.reviews})</span>
            </div>
          </div>

          <h3 className="text-base font-extrabold text-[#0A0A0A] leading-snug mb-2">
            {program.title}
          </h3>

          <p className="text-xs text-[#6B6B6B] line-clamp-2 leading-relaxed mb-4">
            {program.description}
          </p>

          <div className="flex items-center gap-2 pt-3 border-t border-[#E7E5E1]">
            <Avatar className="h-7 w-7 border border-[#E7E5E1]">
              <AvatarImage src={program.mentor?.image || program.trainer?.image} />
              <AvatarFallback className="text-[10px] font-bold bg-[#F2F1EE]">
                {(program.mentor?.name || program.trainer?.name || "M")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs truncate">
              <span className="font-bold text-[#0A0A0A] block truncate">
                {program.mentor?.name || program.trainer?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-[#E7E5E1]">
          <div>
            <span className="text-sm sm:text-base font-black text-[#0A0A0A]">
              {program.price === 0 ? "Free" : `₦${program.price.toLocaleString()}`}
            </span>
          </div>
          <Button asChild size="sm" className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-10 px-4 hover:bg-[#e0b300]">
            <Link href={`/programs/${program.id}${viewAsMentor ? '?view=mentor' : ''}`}>
              {viewAsMentor ? "Request to mentor" : "View programme"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
