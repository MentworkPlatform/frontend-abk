"use client"

import Link from "next/link"
import { BookOpen, Users, Building, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/get-started">
              <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000]">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="flex-1 flex items-center justify-center py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">Connect. Learn. Grow.</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto text-balance">
            The simplest way to find mentors, create programs, and build meaningful learning relationships.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Link href="/get-started">
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-[#FFD500] overflow-hidden">
                <div className="h-1 bg-[#FFD500]" />
                <CardHeader className="text-center pb-4">
                  <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&q=80"
                      alt="Learning and growth"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-[#FFD500]/10"><svg class="w-12 h-12 text-[#FFD500]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>'
                        }
                      }}
                    />
                  </div>
                  <CardTitle className="text-xl">I Want to Learn</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">Find mentors and join training programs to accelerate your growth</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/get-started">
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-[#FFD500] overflow-hidden">
                <div className="h-1 bg-[#FFD500]" />
                <CardHeader className="text-center pb-4">
                  <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&q=80"
                      alt="Teaching and mentoring"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-[#FFD500]/10"><svg class="w-12 h-12 text-[#FFD500]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>'
                        }
                      }}
                    />
                  </div>
                  <CardTitle className="text-xl">I Want to Teach</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">Share your expertise and mentor learners one-on-one</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/get-started">
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-[#FFD500] overflow-hidden">
                <div className="h-1 bg-[#FFD500]" />
                <CardHeader className="text-center pb-4">
                  <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80"
                      alt="Program hosting and management"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-[#FFD500]/10"><svg class="w-12 h-12 text-[#FFD500]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>'
                        }
                      }}
                    />
                  </div>
                  <CardTitle className="text-xl">I Want to Host</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">Create and manage comprehensive training programs</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-12">
            <Button asChild size="lg" className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
              <Link href="/get-started">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-6" />
              <span className="text-gray-400">© 2025 Mentwork. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/about" className="text-gray-400 hover:text-white">
                About
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
              <Link href="/help" className="text-gray-400 hover:text-white">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
