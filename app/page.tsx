"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Menu, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"

const SAMPLE_PROGRAMMES = [
  {
    title: "Digital Marketing for SMEs",
    category: "Bootcamp",
    price: "₦45,000",
    rating: "4.8★",
    bannerBg: "bg-[#2B2B2B]",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop&q=80",
    href: "/programs/1",
  },
  {
    title: "Financial Literacy",
    category: "Workshop",
    price: "₦30,000",
    rating: "4.9★",
    bannerBg: "bg-[#5B7B6E]",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop&q=80",
    href: "/programs/2",
  },
  {
    title: "Poultry Business Bootcamp",
    category: "Cohort",
    price: "₦38,000",
    rating: "4.7★",
    bannerBg: "bg-[#B0674A]",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&h=400&fit=crop&q=80",
    href: "/programs/3",
  },
  {
    title: "UX Research Foundations",
    category: "Bootcamp",
    price: "Free",
    rating: "4.9★",
    bannerBg: "bg-[#6E7BA8]",
    image: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=600&h=400&fit=crop&q=80",
    href: "/programs/4",
  },
]

const INITIATIVES = [
  {
    title: "BUILD: The STEM Space",
    partner: "NASENI",
    description: "STEM ecosystem · 120 schools nationwide",
    tag: "NASENI",
    bannerBg: "bg-[#0A0A0A]",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&fit=crop&q=80",
    href: "/initiatives/build",
  },
  {
    title: "Small Business Coalition",
    partner: "ECOWAS",
    description: "Youth entrepreneurship · West Africa",
    tag: "ECOWAS",
    bannerBg: "bg-[#6E7BA8]",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=500&fit=crop&q=80",
    href: "/initiatives/small-business",
  },
  {
    title: "Bridging Industry and Academia",
    partner: "SMEDAN",
    description: "School-facing ecosystem model",
    tag: "Schools",
    bannerBg: "bg-[#B0674A]",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop&q=80",
    href: "/initiatives/industry-academia",
  },
]

const ROLES = [
  {
    title: "Become a Trainer",
    description: "Design impactful programmes, mentor cohorts, and run your business.",
    cta: "Start Training",
    href: "/onboarding/trainer",
    bannerColor: "bg-[#2B2B2B]",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Become a Mentor",
    description: "Guide learners one-on-one, on your schedule, and earn competitive rewards.",
    cta: "Start Mentoring",
    href: "/onboarding/mentor",
    bannerColor: "bg-[#5B7B6E]",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Become a Mentee",
    description: "Find mentors, enroll in top programmes, and accelerate your career.",
    cta: "Start Learning",
    href: "/onboarding",
    bannerColor: "bg-[#6E7BA8]",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&q=80",
  },
]

const TRUSTED_LOGOS = [
  { name: "NASENI", icon: "🌐" },
  { name: "ECOWAS", icon: "◆" },
  { name: "SMEDAN", icon: "▲" },
  { name: "Outliers", icon: "▣" },
  { name: "Innovate Hub", icon: "✦" },
]

export default function HomePage() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const updateCurrent = useCallback((api: CarouselApi | undefined) => {
    if (api) setCurrent(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!carouselApi) return
    updateCurrent(carouselApi)
    carouselApi.on("select", () => updateCurrent(carouselApi))
  }, [carouselApi, updateCurrent])

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#0A0A0A] font-sans antialiased">
      {/* Navigation - Translucent Sticky Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#E7E5E1]/80 bg-white/70 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/60 transition-all">
        <div className="max-w-7xl mx-auto flex h-16 sm:h-20 items-center justify-between gap-4 px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Mentwork home">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto sm:h-9" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/initiatives"
              className="text-sm font-semibold text-[#0A0A0A] hover:text-[#6B6B6B] transition-colors"
            >
              Initiatives
            </Link>
            <Link
              href="/programs"
              className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
            >
              Programmes
            </Link>
            <Link
              href="/onboarding/trainer"
              className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
            >
              Become a Trainer
            </Link>
            <Link
              href="/onboarding/mentor"
              className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
            >
              Become a Mentor
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] px-3 py-2 transition-colors"
            >
              Log in
            </Link>
            <Button asChild className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-full px-6 py-2.5 hover:bg-[#e0b300]">
              <Link href="/get-started">Explore</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Button asChild size="sm" className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-full text-xs px-3.5">
              <Link href="/get-started">Explore</Link>
            </Button>
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-[#0A0A0A]" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100vw-2rem,320px)] p-6 bg-white flex flex-col">
                <div className="flex items-center justify-between pb-6 border-b border-[#E7E5E1]">
                  <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
                </div>
                <div className="flex flex-col gap-3 pt-6">
                  <Link
                    href="#initiatives"
                    className="text-base font-bold text-[#0A0A0A] py-2"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Initiatives
                  </Link>
                  <Link
                    href="/programs"
                    className="text-base font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] py-2"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Programmes
                  </Link>
                  <Link
                    href="/onboarding/trainer"
                    className="text-base font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] py-2"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Become a Trainer
                  </Link>
                  <Link
                    href="/onboarding/mentor"
                    className="text-base font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] py-2"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Become a Mentor
                  </Link>
                  <Link
                    href="/onboarding"
                    className="text-base font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] py-2"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Become a Mentee
                  </Link>
                  <Link
                    href="/login"
                    className="text-base font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] py-2"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Log in
                  </Link>
                </div>
                <div className="mt-auto pt-6">
                  <Button asChild className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-12" onClick={() => setMobileNavOpen(false)}>
                    <Link href="/get-started">Explore Your Journey</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full bg-[#0A0A0A] text-white px-4 sm:px-8 py-14 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Build a sector.<br />
              Build a business.<br />
              Build yourself.
            </h1>
            <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-[#B8B8B8] max-w-xl leading-relaxed">
              Empowering trainers, mentors, and mentees to grow through Mentwork&apos;s dedicated pathways.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                className="bg-[#F5C400] text-[#0A0A0A] font-bold h-12 px-8 rounded-xl hover:bg-[#e0b300] text-sm sm:text-base"
              >
                <Link href="/get-started">Explore your journey</Link>
              </Button>
            </div>
          </div>

          {/* Desktop Visual Grid / Geometry */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div className="h-32 sm:h-40 rounded-2xl bg-[#2B2B2B] p-5 flex flex-col justify-end">
              <span className="text-xs font-bold text-white/80">Trainer Network</span>
            </div>
            <div className="h-44 sm:h-52 rounded-2xl bg-[#5B7B6E] p-5 flex flex-col justify-end translate-y-3">
              <span className="text-xs font-bold text-white/90">Accredited Mentors</span>
            </div>
            <div className="h-44 sm:h-52 rounded-2xl bg-[#B0674A] p-5 flex flex-col justify-end">
              <span className="text-xs font-bold text-white/90">Active Initiatives</span>
            </div>
            <div className="h-32 sm:h-40 rounded-2xl bg-[#6E7BA8] p-5 flex flex-col justify-end translate-y-3">
              <span className="text-xs font-bold text-white/80">Verified Outcomes</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Featured Initiatives - Moved Above Explore Programmes */}
      <section id="initiatives" className="w-full py-12 sm:py-16 px-4 sm:px-8 bg-[#F2F1EE]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-[#B0674A] uppercase tracking-wider mb-1">Impact Ecosystem</p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0A0A0A] tracking-tight">
                Featured initiatives
              </h2>
            </div>
            <Link
              href="/initiatives"
              className="text-xs sm:text-sm font-bold text-[#0A0A0A] hover:underline flex items-center gap-1"
            >
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIATIVES.map((init) => (
              <div
                key={init.title}
                className="group rounded-2xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-[#D8D5CF] transition-all flex flex-col"
              >
                <div className="relative h-44 w-full overflow-hidden bg-[#0A0A0A]">
                  <Image
                    src={init.image}
                    alt={init.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between z-10">
                    <Badge variant="yellow">{init.tag}</Badge>
                    <span className="text-xs font-bold text-white/90 drop-shadow">{init.partner}</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0A0A0A] group-hover:text-black">{init.title}</h3>
                    <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1.5 leading-relaxed">
                      {init.description}
                    </p>
                  </div>
                  <div className="mt-5">
                    <Button asChild variant="outline" size="sm" className="w-full rounded-xl font-bold border-[#E7E5E1] hover:bg-[#F2F1EE]">
                      <Link href={init.href}>Learn more</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Explore Programmes */}
      <section className="w-full py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0A0A0A] tracking-tight">
              Explore programmes
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">High-impact cohorts, workshops, and bootcamps</p>
          </div>
          <Link
            href="/programs"
            className="text-xs sm:text-sm font-bold text-[#0A0A0A] hover:underline flex items-center gap-1"
          >
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_PROGRAMMES.map((prog) => (
            <Link
              key={prog.title}
              href={prog.href}
              className="group rounded-2xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-[#D8D5CF] transition-all flex flex-col"
            >
              <div className="relative h-44 w-full overflow-hidden bg-[#2B2B2B]">
                <Image
                  src={prog.image}
                  alt={prog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 top-0 p-3 sm:p-4 flex items-center justify-between z-10">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F5C400] text-[#0A0A0A] shadow-sm">
                    {prog.category}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#0A0A0A] group-hover:text-black leading-snug">
                    {prog.title}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E7E5E1] flex items-center justify-between text-xs font-semibold text-[#6B6B6B]">
                  <span className="font-extrabold text-[#0A0A0A] text-sm">{prog.price}</span>
                  <span>{prog.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Choose Your Path */}
      <section className="w-full py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A0A0A] tracking-tight">
            Choose your path
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#6B6B6B]">
            Join Mentwork and start today — whether you want to learn, teach, or build programmes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {ROLES.map((role) => (
            <div
              key={role.title}
              className="group rounded-2xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-[#D8D5CF] transition-all flex flex-col"
            >
              <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-[#2B2B2B]">
                <Image
                  src={role.image}
                  alt={role.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#0A0A0A]">{role.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                    {role.description}
                  </p>
                </div>
                <div className="mt-6">
                  <Button asChild className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-11 hover:bg-[#e0b300]">
                    <Link href={role.href}>{role.cta}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners / Trusted by */}
      <section className="w-full py-10 sm:py-14 border-t border-[#E7E5E1] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#9B9B9B]">
            Trusted by leading partners and organizations
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {TRUSTED_LOGOS.map((company) => (
              <div
                key={company.name}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F2F1EE] border border-[#E7E5E1] text-xs sm:text-sm font-bold text-[#0A0A0A]"
              >
                <span>{company.icon}</span>
                <span>{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E7E5E1] bg-white py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-6 w-auto" />
            <span className="text-xs text-[#9B9B9B]">© 2026 Mentwork. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-[#6B6B6B]">
            <Link href="#initiatives" className="hover:text-[#0A0A0A]">
              Initiatives
            </Link>
            <Link href="/programs" className="hover:text-[#0A0A0A]">
              Programmes
            </Link>
            <Link href="/get-started" className="hover:text-[#0A0A0A]">
              Get Started
            </Link>
            <Link href="/login" className="hover:text-[#0A0A0A]">
              Log in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
