"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import {
  Building2,
  GraduationCap,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Sun,
  Code2,
  Database,
  Clock,
  MapPin,
  CheckSquare2,
  FileCheck,
  Coins,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface InitiativeDetail {
  slug: string
  title: string
  partner: string
  partnerFullName: string
  badgeText: string
  headline: string
  description: string
  bannerImage: string
  stats: { label: string; value: string; sub?: string }[]
  ecosystemSteps: { step: string; title: string; desc: string }[]
  tracks: { title: string; duration: string; icon: any; desc: string; skills: string[] }[]
  zones: { zone: string; states: string; schoolsCount: number }[]
  trainerPerks: { title: string; desc: string }[]
  requirements: string[]
  applyCta: { text: string; href: string }
}

const INITIATIVES_MAP: Record<string, InitiativeDetail> = {
  build: {
    slug: "build",
    title: "BUILD: The STEM Space",
    partner: "NASENI",
    partnerFullName: "National Agency for Science and Engineering Infrastructure",
    badgeText: "NASENI × MENTWORK NATIONAL INITIATIVE",
    headline: "Equipping 120 schools nationwide with accredited robotics labs and certified field trainers.",
    description: "BUILD: The STEM Space is Nigeria's flagship technical education partnership between NASENI and Mentwork. We deploy specialized hardware labs, modular robotics kits, and vetted industry master trainers into secondary and technical colleges nationwide to bridge the gap between academic theory and high-demand engineering skills.",
    bannerImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=600&fit=crop&q=80",
    stats: [
      { label: "Partner Schools", value: "120", sub: "Federal & State Colleges" },
      { label: "Students per Term", value: "2,400+", sub: "Enrolled in active cohorts" },
      { label: "Hardware Labs", value: "48", sub: "Fully equipped centers" },
      { label: "Trainer Stipend", value: "₦85k/mo", sub: "+ hardware lab toolkit" },
    ],
    ecosystemSteps: [
      {
        step: "01",
        title: "Federal Agency Infrastructure",
        desc: "NASENI sponsors and equips dedicated on-campus STEM labs with 3D printers, IoT controllers, and renewable energy test benches.",
      },
      {
        step: "02",
        title: "Accredited Trainer Deployment",
        desc: "Mentwork runs rigorous vetting and evidence verification to certify professional engineers and educators as accredited BUILD Trainers.",
      },
      {
        step: "03",
        title: "Practical Cohort Execution",
        desc: "Trainers deliver 12-week modular terms with weekly hands-on project milestones, student assessments, and live lab work.",
      },
      {
        step: "04",
        title: "Agency Certification & Apprenticeship",
        desc: "Graduating students receive recognized NASENI certifications, while trainers build accredited credentials and earn competitive recurring stipends.",
      },
    ],
    tracks: [
      {
        title: "Robotics & Embedded IoT Systems",
        duration: "12 Weeks",
        icon: Cpu,
        desc: "Microcontroller architecture, sensor integration, servo motors, autonomous navigation, and IoT telemetry.",
        skills: ["Arduino", "Raspberry Pi", "C++ Basics", "Circuit Design"],
      },
      {
        title: "Renewable Energy & Solar Installation",
        duration: "10 Weeks",
        icon: Sun,
        desc: "Photovoltaic panel sizing, battery management systems, charge controllers, inverter wiring, and safety standards.",
        skills: ["Solar PV", "Inverter Sizing", "Battery Chemistry", "Safety Compliance"],
      },
      {
        title: "Modern Web & Software Engineering",
        duration: "12 Weeks",
        icon: Code2,
        desc: "Foundations of responsive web development, logic building, API interactions, and client deployment.",
        skills: ["HTML5 / CSS3", "JavaScript", "Python Fundamentals", "Git"],
      },
      {
        title: "Applied AI & Computer Vision",
        duration: "8 Weeks",
        icon: Database,
        desc: "Image classification with Edge devices, dataset collection, and embedded machine learning applications.",
        skills: ["Edge AI", "Data Annotation", "Python", "Sensor Logic"],
      },
    ],
    zones: [
      { zone: "North-Central", states: "FCT Abuja, Nasarawa, Niger, Plateau, Benue", schoolsCount: 28 },
      { zone: "South-West", states: "Lagos, Ogun, Oyo, Osun, Ondo, Ekiti", schoolsCount: 34 },
      { zone: "North-West", states: "Kano, Kaduna, Katsina, Sokoto", schoolsCount: 22 },
      { zone: "South-South", states: "Rivers, Edo, Delta, Akwa Ibom", schoolsCount: 20 },
      { zone: "South-East", states: "Enugu, Anambra, Imo, Abia", schoolsCount: 16 },
    ],
    trainerPerks: [
      {
        title: "Competitive Monthly Compensation",
        desc: "Guaranteed monthly stipend of ₦85,000 to ₦150,000 paid bi-weekly via Mentwork Wallet directly to your bank account.",
      },
      {
        title: "Official NASENI Accreditation",
        desc: "Receive government co-branded credentials establishing you as a nationally accredited STEM instructor.",
      },
      {
        title: "Lab Hardware Toolkits",
        desc: "Get an allocated trainer toolkit valued at ₦250,000 containing development boards, oscilloscopes, and tools.",
      },
      {
        title: "Structured Mentorship Network",
        desc: "Access institutional resources, pre-built syllabi, and peer forums with hundreds of active master trainers.",
      },
    ],
    requirements: [
      "B.Sc, B.Eng, HND, or demonstrated practical competence in a relevant STEM discipline",
      "At least 1 year of hands-on technical instruction or professional engineering experience",
      "Availability for a minimum of 12 hours/week of on-campus lab instruction",
      "Valid National Identification Number (NIN) or International Passport for vetting",
      "Submission of professional CV and sample lesson plan or teaching portfolio",
    ],
    applyCta: {
      text: "Apply for BUILD Trainer Accreditation",
      href: "/initiatives/build/apply",
    },
  },
  "small-business": {
    slug: "small-business",
    title: "Small Business Coalition",
    partner: "ECOWAS",
    partnerFullName: "Economic Community of West African States Youth Directorate",
    badgeText: "ECOWAS REGIONAL INITIATIVE",
    headline: "Zero-equity grants, export compliance, and cross-border trade mentorship for 450+ SMEs.",
    description: "The Small Business Coalition unites youth-led businesses across West Africa to accelerate regional trade, product standardization, and access to zero-equity capital.",
    bannerImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop&q=80",
    stats: [
      { label: "Participating SMEs", value: "450+" },
      { label: "Grant Capital", value: "₦120M" },
      { label: "Trade Mentors", value: "85" },
      { label: "West African Countries", value: "8" },
    ],
    ecosystemSteps: [
      { step: "01", title: "Diagnostic Assessment", desc: "SMEs undergo financial and product audits to pinpoint growth bottlenecks." },
      { step: "02", title: "Trade Mentor Matching", desc: "Paired 1:1 with vetted regional trade veterans for 8 weeks." },
      { step: "03", title: "Zero-Equity Grants", desc: "Capital disbursements ranging from ₦500k to ₦2.5M for machinery and inventory." },
      { step: "04", title: "Regional Distribution", desc: "Access ECOWAS trade exhibitions and cross-border payment corridors." },
    ],
    tracks: [
      {
        title: "Agro-Processing & Food Standards",
        duration: "8 Weeks",
        icon: Sun,
        desc: "Packaging, shelf-life stabilization, and NAFDAC / regional standards.",
        skills: ["Packaging", "Supply Chain", "Export Logistics"],
      },
      {
        title: "Light Manufacturing & Textiles",
        duration: "8 Weeks",
        icon: Cpu,
        desc: "Batch production optimization and regional distributor sourcing.",
        skills: ["QC Standards", "B2B Sales", "Inventory Control"],
      },
    ],
    zones: [
      { zone: "Nigeria Hub", states: "Lagos, Kano, Aba, Onitsha, Abuja", schoolsCount: 210 },
      { zone: "Ghana & Francophone Hub", states: "Accra, Kumasi, Cotonou, Lomé", schoolsCount: 240 },
    ],
    trainerPerks: [
      { title: "Honorarium", desc: "₦75,000 per business diagnostic sprint." },
      { title: "Regional Recognition", desc: "Featured in ECOWAS youth enterprise registry." },
    ],
    requirements: [
      "5+ years of senior executive or entrepreneurial experience in West Africa",
      "Demonstrated track record of scaling small businesses or export logistics",
    ],
    applyCta: {
      text: "Apply as Business Mentor",
      href: "/onboarding/mentor",
    },
  },
  "industry-academia": {
    slug: "industry-academia",
    title: "Bridging Industry & Academia",
    partner: "SMEDAN",
    partnerFullName: "Small and Medium Enterprises Development Agency of Nigeria",
    badgeText: "SMEDAN TERTIARY NETWORK",
    headline: "Connecting tertiary institution curricula with live industry demand through structured apprenticeships.",
    description: "Partnering with 85 universities and polytechnics to transition final-year engineering, computer science, and business students into corporate apprenticeships.",
    bannerImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop&q=80",
    stats: [
      { label: "Colleges & Polys", value: "85" },
      { label: "Corporate Partners", value: "64" },
      { label: "Apprenticeships", value: "3,200" },
      { label: "Placement Rate", value: "78%" },
    ],
    ecosystemSteps: [
      { step: "01", title: "Curriculum Alignment", desc: "Updating academic syllabi with real-time industrial software stacks." },
      { step: "02", title: "Adjunct Faculty Delivery", desc: "Industry trainers deliver accredited elective modules." },
      { step: "03", title: "Capstone Challenges", desc: "Students solve live challenges provided by corporate sponsors." },
      { step: "04", title: "Direct Placement", desc: "Vetted students hired directly into full-time roles." },
    ],
    tracks: [
      {
        title: "Enterprise Software & Cloud",
        duration: "14 Weeks",
        icon: Code2,
        desc: "Full-stack architectures, Docker, SQL, and enterprise cloud deployments.",
        skills: ["Node.js", "React", "PostgreSQL", "DevOps Basics"],
      },
    ],
    zones: [
      { zone: "Federal Universities", states: "UNILAG, ABU Zaria, UNN, UI, UniAbuja", schoolsCount: 45 },
      { zone: "Polytechnics", states: "YabaTech, Kaduna Poly, Federal Poly Nekede", schoolsCount: 40 },
    ],
    trainerPerks: [
      { title: "Adjunct Honorarium", desc: "₦100,000/mo for delivered lecture hours." },
      { title: "Academic Fellowship", desc: "Official partnership standing with university departments." },
    ],
    requirements: [
      "Master's degree or 4+ years of senior engineering industry experience",
      "Commitment of 8 hours/week for hybrid lecture delivery",
    ],
    applyCta: {
      text: "Join Industry Faculty",
      href: "/onboarding/trainer",
    },
  },
}

export default function InitiativeDetailPage() {
  const params = useParams()
  const id = typeof params?.id === "string" ? params.id : "build"
  const initiative = INITIATIVES_MAP[id] || INITIATIVES_MAP.build

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
              <Link href="/initiatives" className="text-sm font-bold text-[#0A0A0A]">
                Initiatives
              </Link>
              <Link href="/onboarding/trainer" className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">
                Become a Trainer
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A]">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-full text-xs sm:text-sm px-4 sm:px-5 hover:bg-[#e0b300]">
              <Link href={initiative.applyCta.href}>Apply as Trainer</Link>
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
          <Link href="/initiatives" className="hover:text-[#0A0A0A]">Initiatives</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#0A0A0A]">{initiative.title}</span>
        </div>

        {/* Hero Section */}
        <div className="rounded-3xl border border-[#0A0A0A] bg-[#0A0A0A] text-white p-6 sm:p-12 mb-12 shadow-xl overflow-hidden relative">
          <div className="max-w-3xl relative z-10">
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="text-xs font-bold text-white/90 bg-white/10 px-3.5 py-1 rounded-full backdrop-blur-sm border border-white/15">
                {initiative.badgeText}
              </span>
              <Badge variant="sage">Active Cohort • Accepting Trainers</Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
              {initiative.title}
            </h1>
            <p className="text-base sm:text-xl font-bold text-[#F5C400] mt-3">
              {initiative.headline}
            </p>
            <p className="text-sm sm:text-base text-[#D8D5CF] mt-4 leading-relaxed">
              {initiative.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Button asChild size="lg" className="bg-[#F5C400] text-[#0A0A0A] font-extrabold rounded-full px-8 hover:bg-[#e0b300] shadow-md">
                <Link href={initiative.applyCta.href}>
                  {initiative.applyCta.text}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10 rounded-full font-bold">
                <Link href="#curriculum">
                  Explore Curriculum Tracks
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Initiative Statistics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-6 rounded-3xl bg-[#FAF9F6] border border-[#E7E5E1] mb-14">
          {initiative.stats.map((s, idx) => (
            <div key={idx} className="p-3 sm:p-4">
              <div className="text-2xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#2B2B2B] mt-1">
                {s.label}
              </div>
              {s.sub && (
                <div className="text-[11px] text-[#6B6B6B] mt-0.5">{s.sub}</div>
              )}
            </div>
          ))}
        </div>

        {/* The Ecosystem Model Section */}
        <section className="mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-extrabold tracking-wider text-[#B0674A] uppercase">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] mt-1">
              The Public-Private Ecosystem Model
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-2 leading-relaxed">
              By aligning government capital, institutional infrastructure, and accredited independent trainers, Mentwork ensures sustainable and high-standard skill transfer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {initiative.ecosystemSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E7E5E1] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[#0A0A0A] text-white flex items-center justify-center font-black text-sm mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-base font-black text-[#0A0A0A]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Curriculum Tracks Section */}
        <section id="curriculum" className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold tracking-wider text-[#B0674A] uppercase">
                Learning & Training Tracks
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] mt-1">
                Standardized Curriculum Tracks
              </h2>
            </div>
            <Badge variant="yellow">Accredited by {initiative.partner}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initiative.tracks.map((track, idx) => {
              const TrackIcon = track.icon
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-[#E7E5E1] shadow-xs hover:border-[#D8D5CF] transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F2F1EE] border border-[#E7E5E1] flex items-center justify-center text-[#0A0A0A]">
                      <TrackIcon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="font-bold text-xs">
                      {track.duration}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-black text-[#0A0A0A]">{track.title}</h3>
                  <p className="text-xs sm:text-sm text-[#6B6B6B] mt-2 leading-relaxed">
                    {track.desc}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#E7E5E1]/60">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9B9B9B] block mb-2">
                      Key Competencies & Tools:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {track.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#E7E5E1] text-[#2B2B2B]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Geographic Zones Section */}
        <section className="p-6 sm:p-10 rounded-3xl bg-[#FAF9F6] border border-[#E7E5E1] mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-extrabold tracking-wider text-[#B0674A] uppercase">
              Nationwide Footprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] mt-1">
              Host Institutions & Geopolitical Zones
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-2">
              Trainers are assigned to accredited schools within their preferred zones with pre-arranged lab infrastructure and local student cohorts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {initiative.zones.map((z, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#E7E5E1] shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#0A0A0A]">{z.zone}</span>
                  <span className="text-xs font-bold text-[#5B7B6E] bg-[#5B7B6E]/10 px-2.5 py-0.5 rounded-full">
                    {z.schoolsCount} Schools
                  </span>
                </div>
                <div className="flex items-start gap-2 mt-3 text-xs text-[#6B6B6B]">
                  <MapPin className="h-4 w-4 text-[#9B9B9B] shrink-0 mt-0.5" />
                  <span>{z.states}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trainer Eligibility & Compensation Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <span className="text-xs font-extrabold tracking-wider text-[#B0674A] uppercase">
                Trainer Accreditation
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] mt-1">
                Trainer Role & Eligibility Requirements
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6B6B] mt-2 mb-6">
                Because BUILD operates in accredited school laboratories, trainers must undergo rigorous credential and background verification.
              </p>

              <div className="space-y-3">
                {initiative.requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#E7E5E1] shadow-xs"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#5B7B6E] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-[#2B2B2B]">
                      {req}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#0A0A0A] text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#F5C400] uppercase tracking-wider">
                  Compensation & Fellowships
                </span>
                <h3 className="text-xl font-black text-white mt-1 mb-4">
                  What Accredited Trainers Receive
                </h3>

                <div className="space-y-4">
                  {initiative.trainerPerks.map((p, idx) => (
                    <div key={idx} className="border-b border-white/10 pb-3 last:border-0">
                      <div className="text-sm font-bold text-white">{p.title}</div>
                      <div className="text-xs text-[#D8D5CF] mt-1">{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/15">
                <Button asChild className="w-full bg-[#F5C400] text-[#0A0A0A] font-extrabold rounded-2xl py-3 hover:bg-[#e0b300]">
                  <Link href={initiative.applyCta.href}>
                    {initiative.applyCta.text}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-[#2B2B2B] text-white text-center flex flex-col items-center justify-center mb-12">
          <Badge variant="yellow" className="mb-4">Official Application Period</Badge>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight max-w-xl">
            Ready to shape the next generation of Nigerian engineers?
          </h2>
          <p className="text-xs sm:text-sm text-[#D8D5CF] mt-3 max-w-md">
            Complete the official process-oriented application. Upload your credentials, specify your zone preference, and receive feedback within 3–5 working days.
          </p>
          <Button asChild size="lg" className="mt-6 bg-[#F5C400] text-[#0A0A0A] font-extrabold rounded-full px-8 hover:bg-[#e0b300] shadow-md">
            <Link href={initiative.applyCta.href}>
              {initiative.applyCta.text}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E5E1] bg-white py-6 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-6 w-auto" />
            <span className="text-[#9B9B9B]">© 2026 Mentwork × {initiative.partner}. Authorized Initiative.</span>
          </div>
          <div className="flex items-center gap-4 text-[#6B6B6B]">
            <Link href="/programs" className="hover:text-[#0A0A0A]">Explore</Link>
            <Link href="/initiatives" className="hover:text-[#0A0A0A]">All Initiatives</Link>
            <Link href="/initiatives/build/apply" className="text-[#0A0A0A] font-bold">BUILD Application</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
