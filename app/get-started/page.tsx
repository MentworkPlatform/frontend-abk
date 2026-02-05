"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Users, Building } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" asChild className="text-sm sm:text-base">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-balance">Choose Your Path</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto text-balance">
            Join Mentwork and start your journey today. Whether you want to learn, teach, or build programs, we have the
            perfect solution for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Learner Card */}
          <Card className="flex flex-col h-full hover:shadow-lg transition-all border-2 hover:border-[#FFD500] overflow-hidden">
            <div className="h-1 bg-[#FFD500]" />
            <CardHeader className="pb-4">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&q=80"
                  alt="Learning and growth"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-[#FFD500]/10"><svg class="w-16 h-16 text-[#FFD500]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>'
                    }
                  }}
                />
              </div>
              <CardTitle className="text-2xl">I Want to Learn</CardTitle>
              <CardDescription className="text-base">
                Find mentors and join training programs to accelerate your growth
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Connect with industry experts</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Learn through structured programs</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Get personalized feedback</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Earn certificates</span>
                </div>
              </div>
              <Button className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]" asChild>
                <Link href="/onboarding">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Mentor Card */}
          <Card className="flex flex-col h-full hover:shadow-lg transition-all border-2 hover:border-[#FFD500] overflow-hidden">
            <div className="h-1 bg-[#FFD500]" />
            <CardHeader className="pb-4">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&q=80"
                  alt="Teaching and mentoring"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-[#FFD500]/10"><svg class="w-16 h-16 text-[#FFD500]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>'
                    }
                  }}
                />
              </div>
              <CardTitle className="text-2xl">I Want to Teach</CardTitle>
              <CardDescription className="text-base">
                Share your expertise and mentor learners one-on-one
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">1:1 mentorship opportunities</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Flexible scheduling</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Earn per session</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Build your reputation</span>
                </div>
              </div>
              <Button className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]" asChild>
                <Link href="/onboarding/mentor">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Trainer Card */}
          <Card className="flex flex-col h-full hover:shadow-lg transition-all border-2 hover:border-[#FFD500] overflow-hidden">
            <div className="h-1 bg-[#FFD500]" />
            <CardHeader className="pb-4">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80"
                  alt="Program hosting and management"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-[#FFD500]/10"><svg class="w-16 h-16 text-[#FFD500]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>'
                    }
                  }}
                />
              </div>
              <CardTitle className="text-2xl">I Want to Host</CardTitle>
              <CardDescription className="text-base">Create and manage comprehensive training programs</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Full-featured LMS platform</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Invite expert mentors</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Manage payments & sessions</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD500] rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Track student progress</span>
                </div>
              </div>
              <Button className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]" asChild>
                <Link href="/onboarding/trainer">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-balance">
            Join thousands of learners, mentors, and trainers building meaningful connections on Mentwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100" asChild>
              <Link href="/onboarding">Start Learning</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16 sm:mt-20">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-6 w-auto" />
              <span className="text-sm text-gray-600">© 2025 Mentwork. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-gray-900">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
