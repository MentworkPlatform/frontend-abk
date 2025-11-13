"use client"

import Link from "next/link"
import { BookOpen, Users, Building, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <nav className="border-b bg-white">
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
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-[#FFD500]">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">I Want to Learn</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">Find mentors and join training programs to accelerate your growth</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/get-started">
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-[#FFD500]">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">I Want to Teach</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">Share your expertise and mentor learners one-on-one</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/get-started">
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-[#FFD500]">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit">
                    <Building className="h-8 w-8 text-yellow-600" />
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
