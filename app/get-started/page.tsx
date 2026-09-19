"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans flex flex-col">
      {/* Header - Translucent Sticky Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#E7E5E1]/80 bg-white/70 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Mentwork home">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto sm:h-9" />
          </Link>
          <Button variant="ghost" asChild className="text-sm font-semibold text-[#6B6B6B] hover:text-[#0A0A0A]">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 w-full flex flex-col">
        {/* Title Section */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0A0A0A]">
            Choose your path
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6B6B6B] max-w-xl mx-auto leading-relaxed">
            Join Mentwork and start today — whether you want to learn, teach, or build programmes.
          </p>
        </div>

        {/* 3 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Learn Card */}
          <div className="group rounded-2xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex flex-col transition-all hover:shadow-md hover:border-[#D8D5CF]">
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-[#5B7B6E]">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&q=80"
                alt="Mentee learning"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0A0A0A]">I want to learn</h2>
                <p className="mt-2 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                  Find mentors and join programmes to accelerate your growth.
                </p>
              </div>
              <div className="mt-6 pt-4">
                <Button className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-12 hover:bg-[#e0b300]" asChild>
                  <Link href="/onboarding">
                    Get started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Mentor Card */}
          <div className="group rounded-2xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex flex-col transition-all hover:shadow-md hover:border-[#D8D5CF]">
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-[#B0674A]">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&q=80"
                alt="Mentor guiding others"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0A0A0A]">I want to mentor</h2>
                <p className="mt-2 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                  Share your expertise and guide learners one-on-one.
                </p>
              </div>
              <div className="mt-6 pt-4">
                <Button className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-12 hover:bg-[#e0b300]" asChild>
                  <Link href="/onboarding/mentor">
                    Get started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Trainer Card */}
          <div className="group rounded-2xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex flex-col transition-all hover:shadow-md hover:border-[#D8D5CF]">
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-[#2B2B2B]">
              <Image
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&q=80"
                alt="Trainer leading workshop"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0A0A0A]">I want to train</h2>
                <p className="mt-2 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                  Design and run your own programmes end to end.
                </p>
              </div>
              <div className="mt-6 pt-4">
                <Button className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-12 hover:bg-[#e0b300]" asChild>
                  <Link href="/onboarding/trainer">
                    Get started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Dark Banner */}
        <div className="rounded-2xl bg-[#0A0A0A] p-8 sm:p-12 text-center text-white mt-auto">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-3">Ready to get started?</h2>
          <p className="text-xs sm:text-sm text-[#B8B8B8] max-w-md mx-auto mb-6">
            Join thousands of learners, mentors, and trainers growing together on Mentwork.
          </p>
          <Button asChild className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl px-8 h-12 hover:bg-[#e0b300]">
            <Link href="/onboarding">Start learning</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E5E1] bg-white py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-6 w-auto" />
            <span className="text-xs text-[#9B9B9B]">© 2026 Mentwork. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#0A0A0A]">Home</Link>
            <Link href="/programs" className="hover:text-[#0A0A0A]">Programmes</Link>
            <Link href="/login" className="hover:text-[#0A0A0A]">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
