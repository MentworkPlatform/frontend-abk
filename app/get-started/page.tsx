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
          <Card className="flex flex-col h-full hover:shadow-lg transition-all border-2 hover:border-blue-500">
            <div className="h-1 bg-blue-500" />
            <CardHeader className="pb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">I Want to Learn</CardTitle>
              <CardDescription className="text-base">
                Find mentors and join training programs to accelerate your growth
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Connect with industry experts</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Learn through structured programs</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Get personalized feedback</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Earn certificates</span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/onboarding">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Mentor Card */}
          <Card className="flex flex-col h-full hover:shadow-lg transition-all border-2 hover:border-purple-500">
            <div className="h-1 bg-purple-500" />
            <CardHeader className="pb-4">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">I Want to Teach</CardTitle>
              <CardDescription className="text-base">
                Share your expertise and mentor learners one-on-one
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">1:1 mentorship opportunities</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Flexible scheduling</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Earn per session</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Build your reputation</span>
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                <Link href="/onboarding/mentor">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Trainer Card */}
          <Card className="flex flex-col h-full hover:shadow-lg transition-all border-2 hover:border-[#FFD500]">
            <div className="h-1 bg-[#FFD500]" />
            <CardHeader className="pb-4">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Building className="h-7 w-7 text-yellow-600" />
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
