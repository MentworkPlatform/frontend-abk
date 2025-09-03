"use client"

import Link from "next/link"
import { BookOpen, Users, GraduationCap, Star, Clock, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample trainer programs data
const trainerPrograms = [
  {
    id: 1,
    title: "Complete Digital Marketing Bootcamp",
    trainer: {
      name: "Sarah Wilson",
      title: "Digital Marketing Expert",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.9,
      students: 2847,
    },
    category: "Marketing",
    duration: "12 weeks",
    modules: 24,
    price: 299,
    rating: 4.8,
    reviews: 1247,
    image: "/placeholder.svg?height=200&width=300",
    skills: ["SEO", "Social Media", "PPC", "Analytics"],
    level: "Beginner",
    format: "Self-paced",
  },
  {
    id: 2,
    title: "Advanced Business Strategy",
    trainer: {
      name: "Michael Chen",
      title: "Strategy Consultant",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.9,
      students: 1523,
    },
    category: "Business",
    duration: "8 weeks",
    modules: 16,
    price: 399,
    rating: 4.9,
    reviews: 892,
    image: "/placeholder.svg?height=200&width=300",
    skills: ["Strategic Planning", "Market Analysis", "Leadership"],
    level: "Advanced",
    format: "Live sessions",
  },
  {
    id: 3,
    title: "Product Management Essentials",
    trainer: {
      name: "Emily Rodriguez",
      title: "Senior Product Manager",
      image: "/placeholder.svg?height=60&width=60",
      rating: 4.8,
      students: 1876,
    },
    category: "Product",
    duration: "10 weeks",
    modules: 20,
    price: 349,
    rating: 4.7,
    reviews: 1034,
    image: "/placeholder.svg?height=200&width=300",
    skills: ["Product Strategy", "User Research", "Agile"],
    level: "Intermediate",
    format: "Hybrid",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/programs" className="transition-colors hover:text-foreground/80">
                Programs
              </Link>
              <Link href="/mentors" className="transition-colors hover:text-foreground/80">
                Find Mentors
              </Link>
              <Link href="/about" className="transition-colors hover:text-foreground/80">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/get-started">
                <Button size="sm" className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Badge variant="outline" className="px-3 py-1">
              🚀 Join 10,000+ learners worldwide
            </Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Learn from Industry Experts
              <br />
              <span className="text-[#FFD500]">Build Your Future</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Connect with experienced mentors, join comprehensive training programs, or create your own educational
              content. Whether you're learning, teaching, or training others - we've got you covered.
            </p>

            {/* User Type Selection */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/programs">
                <Card className="w-full sm:w-64 hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-[#FFD500]" />
                      <CardTitle className="text-lg">I want to Learn</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Find mentors and join programs to accelerate your growth</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/get-started">
                <Card className="w-full sm:w-64 hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-[#FFD500]" />
                      <CardTitle className="text-lg">I want to Mentor</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Share your expertise and guide others in their journey</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/get-started">
                <Card className="w-full sm:w-64 hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-[#FFD500]" />
                      <CardTitle className="text-lg">I want to Train</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Create comprehensive training programs and courses</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Training Programs */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Training Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive courses designed by industry experts to help you master new skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {trainerPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={program.image || "/placeholder.svg"}
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-[#FFD500] text-black">{program.format}</Badge>
                  <Badge className="absolute top-3 right-3 bg-green-500 text-white">{program.level}</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{program.category}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-[#FFD500] text-[#FFD500]" />
                      <span className="text-sm font-medium ml-1">{program.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({program.reviews})</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{program.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={program.trainer.image || "/placeholder.svg"} alt={program.trainer.name} />
                      <AvatarFallback>
                        {program.trainer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{program.trainer.name}</p>
                      <p className="text-xs text-gray-500">{program.trainer.students.toLocaleString()} students</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {program.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {program.modules} modules
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {program.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {program.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{program.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">${program.price}</span>
                    <Button size="sm" className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/programs">
                View All Programs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#FFD500] mb-2">10,000+</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FFD500] mb-2">500+</div>
              <div className="text-gray-600">Expert Mentors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FFD500] mb-2">200+</div>
              <div className="text-gray-600">Training Programs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FFD500] mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FFD500]">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Ready to Start Your Journey?</h2>
          <p className="text-black/80 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already transforming their careers with expert guidance
          </p>
          <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
            <Link href="/get-started">
              Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 mb-4" />
              <p className="text-gray-400">
                Connecting learners with expert mentors and comprehensive training programs.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">For Learners</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/programs" className="hover:text-white">
                    Browse Programs
                  </Link>
                </li>
                <li>
                  <Link href="/mentors" className="hover:text-white">
                    Find Mentors
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">For Experts</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/get-started" className="hover:text-white">
                    Become a Mentor
                  </Link>
                </li>
                <li>
                  <Link href="/get-started" className="hover:text-white">
                    Create Training
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mentwork. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
