"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const ROLES = [
  {
    title: "Become a Mentor",
    description: "Teach flexibly and guide others with your expertise.",
    cta: "Start Your Mentor Journey",
    href: "/onboarding/mentor",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&q=80",
    imageAlt: "Mentor on video call",
  },
  {
    title: "Become a Trainer",
    description: "Design impactful programs and lead the way in skill development.",
    cta: "Start Your Trainer Journey",
    href: "/onboarding/trainer",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&q=80",
    imageAlt: "Trainer leading workshop",
  },
  {
    title: "Become a Mentee",
    description: "Grow your business and accelerate your career with guidance.",
    cta: "Start Your Mentee Journey",
    href: "/onboarding",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&q=80",
    imageAlt: "Mentee learning",
  },
]

const TRUSTED_LOGOS = [
  { name: "Innovate Global", icon: "🌐" },
  { name: "Synergy Corp", icon: "◆" },
  { name: "Future Builders", icon: "F" },
  { name: "Pinnacle Edu", icon: "▲" },
  { name: "Growth Labs", icon: "▣" },
]

function RoleCard({
  role,
}: {
  role: (typeof ROLES)[0]
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100">
        <Image
          src={role.image}
          alt={role.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{role.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{role.description}</p>
        <Button
          asChild
          className="mt-4 w-full bg-[#FFD500] text-black hover:bg-[#e6c000] sm:mt-5"
        >
          <Link href={role.href}>{role.cta}</Link>
        </Button>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const updateCurrent = useCallback((api: CarouselApi) => {
    setCurrent(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!carouselApi) return
    updateCurrent(carouselApi)
    carouselApi.on("select", () => updateCurrent(carouselApi))
  }, [carouselApi, updateCurrent])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95">
        <div className="container flex h-14 sm:h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Resource
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/programs">Programs</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/get-started">Get Started</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/programs"
              className="hidden sm:inline-flex rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="/#contact"
              className="hidden sm:inline-flex rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Log in
            </Link>
            <Button asChild className="bg-[#FFD500] text-black hover:bg-[#e6c000] shrink-0">
              <Link href="/get-started">Explore Now</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="w-full bg-gray-900 px-4 py-16 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Build a Sector, Build a
            <br />
            Business, Build Yourself.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-300 sm:text-lg">
            Empowering trainers, mentors, and mentees to achieve growth through Mentwork&apos;s
            dedicated pathways. Join our community and unlock your potential.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-[#FFD500] text-black hover:bg-[#e6c000]"
          >
            <Link href="/get-started">Explore Your Journey</Link>
          </Button>
        </div>
      </section>

      {/* Role cards - carousel on mobile, grid on desktop */}
      <section className="relative z-10 -mt-8 sm:-mt-12 px-4 pb-12 sm:pb-16">
        <div className="container mx-auto max-w-5xl">
          {/* Mobile/tablet: carousel */}
          <div className="md:hidden">
            <Carousel
              setApi={setCarouselApi}
              opts={{ align: "center", loop: true }}
              className="relative w-full"
            >
              <CarouselContent className="-ml-2 sm:-ml-4">
                {ROLES.map((role) => (
                  <CarouselItem key={role.title} className="pl-2 sm:pl-4">
                    <div className="p-1">
                      <RoleCard role={role} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 top-1/2 h-9 w-9 -translate-y-1/2 border-gray-200 bg-white shadow-md hover:bg-gray-50 sm:-left-4" />
              <CarouselNext className="-right-2 top-1/2 h-9 w-9 -translate-y-1/2 border-gray-200 bg-white shadow-md hover:bg-gray-50 sm:-right-4" />
              <div className="mt-6 flex justify-center gap-2">
                {ROLES.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={`h-2 rounded-full transition-all ${
                      current === index ? "w-6 bg-[#FFD500]" : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
          {/* Desktop: 3-column grid */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-6">
            {ROLES.map((role) => (
              <RoleCard key={role.title} role={role} />
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-t border-gray-200 bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-base font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
            Trusted by leading organizations
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {TRUSTED_LOGOS.map((company) => (
              <div
                key={company.name}
                className="flex h-12 w-24 items-center justify-center rounded-lg border border-gray-200 bg-gray-50/80 text-lg font-semibold text-gray-600"
                title={company.name}
              >
                {company.icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-6" />
            <span className="text-sm text-gray-500">© 2025 Mentwork. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/programs" className="text-sm text-gray-500 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/#contact" className="text-sm text-gray-500 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">
              Log in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
