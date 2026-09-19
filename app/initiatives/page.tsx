"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Building2,
  GraduationCap,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const INITIATIVES_DATA = [
  {
    id: "build",
    slug: "build",
    title: "BUILD: The STEM Space",
    tagline: "Equipping 120 secondary and technical schools nationwide with accredited robotics labs, solar energy training, and expert master trainers.",
    partner: "NASENI",
    partnerFullName: "National Agency for Science and Engineering Infrastructure",
    partnerLogo: "🌐",
    category: "STEM & Robotics",
    status: "Active Cohort • Accepting Trainers",
    statusType: "active",
    stats: [
      { label: "Partner Schools", value: "120" },
      { label: "Lab Stations", value: "480+" },
      { label: "Students Enrolled", value: "6,500+" },
      { label: "Trainer Stipend", value: "₦85k/mo" },
    ],
    highlight: "Flagship National Program",
    bannerBg: "bg-[#0A0A0A]",
    bannerImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&h=600&fit=crop&q=80",
    roles: [
      {
        role: "BUILD Trainer",
        desc: "Lead on-campus hands-on robotics, IoT, and solar energy cohorts in accredited schools.",
        cta: "Apply as Trainer",
        href: "/initiatives/build/apply",
        primary: true,
      },
      {
        role: "School / Institution",
        desc: "Nominate your technical college or secondary school to receive sponsored lab kits.",
        cta: "Nominate School",
        href: "/initiatives/build#school",
        primary: false,
      },
      {
        role: "Student / Learner",
        desc: "Explore upcoming term cohorts and certified STEM qualification tracks.",
        cta: "View Curriculum",
        href: "/initiatives/build#curriculum",
        primary: false,
      },
    ],
  },
  {
    id: "small-business",
    slug: "small-business",
    title: "Small Business Coalition",
    tagline: "Empowering young West African entrepreneurs with zero-equity micro-grants, cross-border trade mentorship, and market distribution channels.",
    partner: "ECOWAS",
    partnerFullName: "Economic Community of West African States Youth Directorate",
    partnerLogo: "🌍",
    category: "Entrepreneurship & Trade",
    status: "Active Cohort",
    statusType: "active",
    stats: [
      { label: "Participating SMEs", value: "450+" },
      { label: "Grant Capital", value: "₦120M" },
      { label: "Trade Mentors", value: "85" },
      { label: "Cross-Border Deals", value: "1,200+" },
    ],
    highlight: "West Africa Regional",
    bannerBg: "bg-[#6E7BA8]",
    bannerImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&h=600&fit=crop&q=80",
    roles: [
      {
        role: "Business Mentor",
        desc: "Guide active SMEs through financial modeling, regional export compliance, and sales expansion.",
        cta: "Mentor a Business",
        href: "/initiatives/small-business",
        primary: true,
      },
      {
        role: "SME Founder",
        desc: "Apply for micro-grant sponsorship and direct 1:1 business diagnostic sessions.",
        cta: "Explore Grant",
        href: "/initiatives/small-business",
        primary: false,
      },
    ],
  },
  {
    id: "industry-academia",
    slug: "industry-academia",
    title: "Bridging Industry & Academia",
    tagline: "Connecting tertiary institution curricula with live industry demand through structured apprenticeships, corporate challenges, and lab sabbaticals.",
    partner: "SMEDAN",
    partnerFullName: "Small and Medium Enterprises Development Agency of Nigeria",
    partnerLogo: "🏛️",
    category: "Institutional Innovation",
    status: "Upcoming Term",
    statusType: "upcoming",
    stats: [
      { label: "Colleges & Polys", value: "85" },
      { label: "Corporate Partners", value: "64" },
      { label: "Apprenticeships", value: "3,200" },
      { label: "Job Placement", value: "78%" },
    ],
    highlight: "Higher Education Network",
    bannerBg: "bg-[#B0674A]",
    bannerImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&h=600&fit=crop&q=80",
    roles: [
      {
        role: "Industry Trainer",
        desc: "Deliver practical engineering and product modules to final-year students and faculty.",
        cta: "Join Faculty",
        href: "/initiatives/industry-academia",
        primary: true,
      },
      {
        role: "Corporate Partner",
        desc: "Sponsor a capstone challenge and hire vetted graduate apprentices.",
        cta: "Partner With Us",
        href: "/initiatives/industry-academia",
        primary: false,
      },
    ],
  },
]

const STATS_DATA = [
  {
    label: "Partner Institutions",
    value: "120+",
    sub: "Technical colleges & schools",
    icon: Building2,
  },
  {
    label: "Sponsored Learners",
    value: "15,000+",
    sub: "Trained across all initiatives",
    icon: Users,
  },
  {
    label: "Grant & Equipment Capital",
    value: "₦450M+",
    sub: "Direct lab kits & stipends",
    icon: Award,
  },
  {
    label: "Accredited Trainers",
    value: "420+",
    sub: "Active field instructors",
    icon: GraduationCap,
  },
]

const PARTNERS = [
  { name: "NASENI", description: "Science & Engineering Infrastructure", logo: "🌐" },
  { name: "ECOWAS", description: "West African Youth Directorate", logo: "🌍" },
  { name: "SMEDAN", description: "SME Development Agency", logo: "🏛️" },
  { name: "FMITI", description: "Industry, Trade & Investment", logo: "🇳🇬" },
]

export default function InitiativesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredInitiatives = INITIATIVES_DATA.filter((init) => {
    if (selectedCategory === "all") return true
    return (
      init.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      init.partner.toLowerCase().includes(selectedCategory.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans antialiased flex flex-col">
      {/* Translucent Sticky Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#E7E5E1]/80 bg-white/70 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" aria-label="Mentwork home">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto sm:h-9" />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/programs" className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">
                Explore Programmes
              </Link>
              <span className="text-sm font-bold text-[#0A0A0A] border-b-2 border-[#0A0A0A] pb-1">
                Initiatives
              </span>
              <Link href="/onboarding/trainer" className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">
                Become a Trainer
              </Link>
              <Link href="/onboarding/mentor" className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">
                Become a Mentor
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A]">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-full text-xs sm:text-sm px-4 sm:px-5 hover:bg-[#e0b300]">
              <Link href="/get-started">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6B6B] mb-6">
          <Link href="/" className="hover:text-[#0A0A0A]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#0A0A0A]">Initiatives</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F1EE] border border-[#E7E5E1] text-xs font-bold text-[#0A0A0A] mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#F5C400]" />
            National & Regional Impact Ecosystems
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0A0A0A] tracking-tight leading-[1.08] max-w-4xl">
            Where public institutions and master trainers build the future.
          </h1>
          <p className="text-base sm:text-lg text-[#6B6B6B] mt-4 max-w-2xl leading-relaxed">
            Mentwork partners with government agencies, multilateral development bodies, and industry coalitions to deliver accredited, high-stakes technical training across hundreds of schools.
          </p>

          {/* Quick Actions Header Row */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Button asChild size="lg" className="bg-[#F5C400] text-[#0A0A0A] font-extrabold rounded-full px-7 hover:bg-[#e0b300] shadow-sm">
              <Link href="/initiatives/build/apply">
                Apply for BUILD Trainer Accreditation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6 border-[#D8D5CF] font-bold text-[#0A0A0A]">
              <Link href="#all-initiatives">
                Browse All 3 Initiatives
              </Link>
            </Button>
          </div>
        </div>

        {/* Aggregate Impact Statistics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-6 rounded-3xl bg-[#FAF9F6] border border-[#E7E5E1] shadow-[0_4px_14px_rgba(0,0,0,0.03)] mb-14">
          {STATS_DATA.map((stat, idx) => {
            const IconComponent = stat.icon
            return (
              <div key={idx} className="p-3 sm:p-4">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#E7E5E1] flex items-center justify-center text-[#0A0A0A] mb-3 shadow-xs">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="text-2xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#2B2B2B] mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-[#6B6B6B] mt-0.5">
                  {stat.sub}
                </div>
              </div>
            )
          })}
        </div>

        {/* Institutional Partners Banner */}
        <div className="mb-14 pb-10 border-b border-[#E7E5E1]">
          <span className="text-[11px] font-extrabold tracking-wider text-[#6B6B6B] uppercase block mb-4">
            Authorized Institutional & Government Partners
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PARTNERS.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#E7E5E1] shadow-xs"
              >
                <div className="text-2xl">{p.logo}</div>
                <div>
                  <div className="text-sm font-black text-[#0A0A0A]">{p.name}</div>
                  <div className="text-[11px] text-[#6B6B6B] line-clamp-1">{p.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Flagship Spotlight: BUILD */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold tracking-wider text-[#B0674A] uppercase">
              Featured Flagship Initiative
            </span>
            <Badge variant="sage">Active Deployment</Badge>
          </div>

          <div className="rounded-3xl border border-[#0A0A0A] bg-[#0A0A0A] text-white overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    NASENI × MENTWORK
                  </span>
                  <span className="text-xs font-semibold text-[#F5C400] bg-[#F5C400]/10 border border-[#F5C400]/30 px-3 py-1 rounded-full">
                    National STEM Network
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  BUILD: The STEM Space
                </h2>
                <p className="text-sm sm:text-base text-[#D8D5CF] mt-3 max-w-xl leading-relaxed">
                  Transforming technical and secondary education across 120 schools nationwide. High-school and college students receive hands-on robotics kits, solar installation training, and software bootcamps directly from accredited industry trainers.
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 pt-6 border-t border-white/15">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-[#F5C400]">120</div>
                    <div className="text-xs text-white/70 mt-0.5">Partner Schools</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white">480+</div>
                    <div className="text-xs text-white/70 mt-0.5">Lab Stations</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white">₦85k/mo</div>
                    <div className="text-xs text-white/70 mt-0.5">Trainer Stipend</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white">36</div>
                    <div className="text-xs text-white/70 mt-0.5">States Covered</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Button asChild className="bg-[#F5C400] text-[#0A0A0A] font-extrabold rounded-full px-6 hover:bg-[#e0b300]">
                  <Link href="/initiatives/build/apply">
                    Apply as BUILD Trainer
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="text-white border-white/30 hover:bg-white/10 rounded-full font-bold">
                  <Link href="/initiatives/build">
                    View Initiative Details & Labs
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-[#2B2B2B]">
              <Image
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&h=800&fit=crop&q=80"
                alt="Students in BUILD STEM Lab"
                fill
                className="object-cover opacity-85"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0A0A0A] lg:via-transparent lg:to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <ShieldCheck className="h-4 w-4 text-[#5B7B6E]" />
                  Accredited by Federal Ministry of Science & Technology
                </div>
                <div className="text-[11px] text-white/70 mt-0.5">
                  Every BUILD trainer receives full lab toolkit kits + NASENI certification.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Initiatives Grid */}
        <section id="all-initiatives" className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-extrabold tracking-wider text-[#B0674A] uppercase">
                Active & Upcoming Cohorts
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A0A0A] mt-1">
                Explore All Initiatives
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-[#F2F1EE] text-[#6B6B6B] hover:text-[#0A0A0A]"
                }`}
              >
                All (3)
              </button>
              <button
                onClick={() => setSelectedCategory("STEM")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === "STEM"
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-[#F2F1EE] text-[#6B6B6B] hover:text-[#0A0A0A]"
                }`}
              >
                STEM & Robotics
              </button>
              <button
                onClick={() => setSelectedCategory("ECOWAS")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === "ECOWAS"
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-[#F2F1EE] text-[#6B6B6B] hover:text-[#0A0A0A]"
                }`}
              >
                Trade & Grants
              </button>
              <button
                onClick={() => setSelectedCategory("SMEDAN")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === "SMEDAN"
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-[#F2F1EE] text-[#6B6B6B] hover:text-[#0A0A0A]"
                }`}
              >
                Higher Education
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredInitiatives.map((init) => (
              <div
                key={init.id}
                className="rounded-3xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:border-[#D8D5CF] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Image Card */}
                  <div className="relative h-44 w-full overflow-hidden bg-[#0A0A0A]">
                    <Image
                      src={init.bannerImage}
                      alt={init.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="text-[11px] font-bold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                        {init.partner}
                      </span>
                      <Badge variant={init.statusType === "active" ? "sage" : "slate"}>
                        {init.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <span className="text-xs font-bold text-[#F5C400]">
                        {init.category}
                      </span>
                      <h3 className="text-lg font-black text-white leading-snug">
                        {init.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 sm:p-6">
                    <p className="text-xs sm:text-sm text-[#6B6B6B] line-clamp-3 leading-relaxed">
                      {init.tagline}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 my-5 p-3 rounded-2xl bg-[#F2F1EE] border border-[#E7E5E1]/60">
                      {init.stats.slice(0, 2).map((s, sIdx) => (
                        <div key={sIdx}>
                          <div className="text-base font-black text-[#0A0A0A]">{s.value}</div>
                          <div className="text-[10px] text-[#6B6B6B] font-semibold">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Roles Overview */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9B9B9B]">
                        Open Participation Roles:
                      </span>
                      {init.roles.map((r, rIdx) => (
                        <div key={rIdx} className="flex items-center justify-between text-xs py-1 border-b border-[#E7E5E1]/50 last:border-0">
                          <span className="font-bold text-[#2B2B2B]">{r.role}</span>
                          <span className="text-[11px] font-semibold text-[#6B6B6B]">{r.cta}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <Button asChild className="w-full bg-[#0A0A0A] text-white font-bold rounded-2xl text-xs hover:bg-[#2B2B2B] py-2.5">
                    <Link href={`/initiatives/${init.slug}`}>
                      View Initiative & Apply
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Role-Specific CTA Matrix */}
        <section className="p-6 sm:p-10 rounded-3xl bg-[#F2F1EE] border border-[#E7E5E1] mb-14">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-extrabold tracking-wider text-[#B0674A] uppercase">
              Get Involved
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] mt-1">
              Find your place in our national impact programs
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-2">
              Whether you are an engineering master, school administrator, or eager apprentice, there is an accredited track for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E1] flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F5C400]/20 text-[#0A0A0A] flex items-center justify-center font-black mb-4">
                  01
                </div>
                <h3 className="text-base font-black text-[#0A0A0A]">For Field Trainers</h3>
                <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                  Earn competitive monthly stipends (₦85k–₦150k), receive accredited agency credentials, and train verified high-school cohorts.
                </p>
              </div>
              <Button asChild className="mt-5 w-full bg-[#F5C400] text-[#0A0A0A] font-extrabold rounded-xl text-xs hover:bg-[#e0b300]">
                <Link href="/initiatives/build/apply">
                  Apply as BUILD Trainer
                </Link>
              </Button>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E1] flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#5B7B6E]/20 text-[#5B7B6E] flex items-center justify-center font-black mb-4">
                  02
                </div>
                <h3 className="text-base font-black text-[#0A0A0A]">For Secondary & Tech Colleges</h3>
                <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                  Equip your institution with sponsored robotics kits, IoT equipment, and dedicated certified instructors at zero school cost.
                </p>
              </div>
              <Button asChild variant="outline" className="mt-5 w-full rounded-xl text-xs font-bold border-[#D8D5CF]">
                <Link href="/initiatives/build#school">
                  Nominate Your School
                </Link>
              </Button>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E1] flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#6E7BA8]/20 text-[#6E7BA8] flex items-center justify-center font-black mb-4">
                  03
                </div>
                <h3 className="text-base font-black text-[#0A0A0A]">For Students & Apprentices</h3>
                <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                  Access sponsored hardware training, build real robotic & solar projects, and earn credentials recognized by NASENI and employers.
                </p>
              </div>
              <Button asChild variant="outline" className="mt-5 w-full rounded-xl text-xs font-bold border-[#D8D5CF]">
                <Link href="/programs">
                  Explore Open Cohorts
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E5E1] bg-white py-6 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-6 w-auto" />
            <span className="text-[#9B9B9B]">© 2026 Mentwork Initiatives. Verified Agency Programs.</span>
          </div>
          <div className="flex items-center gap-4 text-[#6B6B6B]">
            <Link href="/programs" className="hover:text-[#0A0A0A]">Explore</Link>
            <Link href="/initiatives" className="text-[#0A0A0A] font-bold">Initiatives</Link>
            <Link href="/initiatives/build/apply" className="hover:text-[#0A0A0A]">BUILD Accreditation</Link>
            <Link href="/login" className="hover:text-[#0A0A0A]">Trainer Login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
