"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
          sizes="(max-width: 768px) 90vw, 33vw"
          unoptimized
        />
      </div>
      <div className="p-3 sm:p-5">
        <h3 className="text-base font-bold text-gray-900 sm:text-xl">{role.title}</h3>
        <p className="mt-1.5 text-sm text-gray-600 sm:mt-2">{role.description}</p>
        <Button
          asChild
          className="mt-3 min-h-10 w-full bg-[#FFD500] text-black hover:bg-[#e6c000] sm:mt-5"
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
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Header - mobile: logo + hamburger menu; desktop: full nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95">
        <div className="container flex h-14 sm:h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-1.5 shrink-0" aria-label="Mentwork home">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto sm:h-9" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
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
              className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="/#contact"
              className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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

          {/* Mobile: hamburger menu */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw-2rem,320px)] p-0">
              <div className="flex flex-col h-full pt-6 pb-4">
                <div className="px-4 space-y-1">
                  <Link href="/programs" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileNavOpen(false)}>
                    Programs
                  </Link>
                  <Link href="/get-started" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileNavOpen(false)}>
                    Get Started
                  </Link>
                  <Link href="/programs" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileNavOpen(false)}>
                    Pricing
                  </Link>
                  <Link href="/#contact" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileNavOpen(false)}>
                    Contact
                  </Link>
                  <Link href="/login" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileNavOpen(false)}>
                    Log in
                  </Link>
                </div>
                <div className="mt-auto px-4 pt-4">
                  <Button asChild className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]" onClick={() => setMobileNavOpen(false)}>
                    <Link href="/get-started">Explore Now</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero - gradient, mobile-friendly padding and typography */}
      <section className="w-full bg-gradient-to-t from-black via-gray-900 to-gray-800 px-4 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            Build a Sector, Build a
            <br />
            Business, Build Yourself.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-300 sm:mt-4 sm:text-base md:text-lg">
            Empowering trainers, mentors, and mentees to achieve growth through Mentwork&apos;s
            dedicated pathways. Join our community and unlock your potential.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 min-h-11 w-full bg-[#FFD500] text-black hover:bg-[#e6c000] sm:mt-8 sm:w-auto sm:min-w-[200px]"
          >
            <Link href="/get-started">Explore Your Journey</Link>
          </Button>
        </div>
      </section>

      {/* Role cards - carousel on mobile, grid on desktop */}
      <section className="relative z-10 -mt-6 sm:-mt-10 px-2 pb-10 sm:px-4 sm:pb-16">
        <div className="container mx-auto max-w-5xl">
          {/* Mobile/tablet: carousel */}
          <div className="md:hidden">
            <Carousel
              setApi={setCarouselApi}
              opts={{ align: "center", loop: true }}
              className="relative w-full"
            >
              <CarouselContent className="-ml-3 sm:-ml-4">
                {ROLES.map((role) => (
                  <CarouselItem key={role.title} className="pl-3 sm:pl-4 basis-[85%] sm:basis-[80%]">
                    <div className="p-1">
                      <RoleCard role={role} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-1 top-1/2 h-10 w-10 -translate-y-1/2 border-gray-200 bg-white shadow-md hover:bg-gray-50 active:scale-95 sm:-left-2" />
              <CarouselNext className="-right-1 top-1/2 h-10 w-10 -translate-y-1/2 border-gray-200 bg-white shadow-md hover:bg-gray-50 active:scale-95 sm:-right-2" />
              <div className="mt-5 flex justify-center gap-2.5">
                {ROLES.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={`inline-block rounded-full transition-all touch-manipulation min-h-[10px] min-w-[10px] ${
                      current === index ? "w-6 bg-[#FFD500]" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
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

      {/* Trusted by - mobile friendly spacing and wrap */}
      <section className="border-t border-gray-200 bg-white py-8 sm:py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
            Trusted by leading organizations
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:mt-8 sm:gap-8 md:gap-12">
            {TRUSTED_LOGOS.map((company) => (
              <div
                key={company.name}
                className="flex h-10 w-16 items-center justify-center rounded-lg border border-gray-200 bg-gray-50/80 text-base font-semibold text-gray-600 sm:h-12 sm:w-24 sm:text-lg"
                title={company.name}
              >
                {company.icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - stack on mobile, comfortable tap targets */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-5 sm:py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-2 sm:text-left">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-5 sm:h-6" />
            <span className="text-xs text-gray-500 sm:text-sm">© 2025 Mentwork. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/programs" className="py-2 text-sm text-gray-500 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/#contact" className="py-2 text-sm text-gray-500 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/login" className="py-2 text-sm text-gray-500 hover:text-gray-900">
              Log in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
