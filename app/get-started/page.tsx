'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Users,
  GraduationCap,
  Building,
  BookOpen,
  Star,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function GetStartedPage() {
  return (
    <div className='min-h-screen bg-[#f5f5f5]'>
      {/* Header */}
      <header className='bg-white border-b'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <Link href='/'>
              <img
                src='/images/mentwork-logo.png'
                alt='Mentwork'
                className='h-8'
              />
            </Link>
            <div className='flex items-center space-x-4'>
              <Button variant='ghost' asChild>
                <Link href='/login'>Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-6 py-12'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold mb-4'>Choose Your Path</h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Whether you're looking to learn new skills, share your expertise, or
            manage educational programs, we have the perfect solution for you.
          </p>
        </div>

        {/* Main Options */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          {/* For Learners */}
          <Card className='relative overflow-hidden hover:shadow-lg transition-shadow'>
            <div className='absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600' />
            <CardHeader className='text-center pb-4'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Users className='h-8 w-8 text-blue-600' />
              </div>
              <CardTitle className='text-2xl'>I Want to Learn</CardTitle>
              <CardDescription className='text-base'>
                Find mentors, join training programs, and accelerate your career
                growth
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full' />
                  <span className='text-sm'>
                    1:1 mentorship with industry experts
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full' />
                  <span className='text-sm'>
                    Comprehensive training courses
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full' />
                  <span className='text-sm'>Group learning experiences</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full' />
                  <span className='text-sm'>
                    Certificates and skill validation
                  </span>
                </div>
              </div>
              <div className='pt-4'>
                <Button
                  className='w-full bg-blue-600 hover:bg-blue-700'
                  asChild
                >
                  <Link href='/programs'>
                    Explore Programs
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  className='w-full mt-2 bg-transparent'
                  asChild
                >
                  <Link href='/onboarding'>Start Onboarding</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* For Mentors */}
          <Card className='relative overflow-hidden hover:shadow-lg transition-shadow border-2 border-[#FFD500]'>
            <div className='absolute top-0 left-0 w-full h-2 bg-[#FFD500]' />
            <div className='absolute top-4 right-4'>
              <Badge className='bg-[#FFD500] text-black'>Popular!</Badge>
            </div>
            <CardHeader className='text-center pb-4'>
              <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Users className='h-8 w-8 text-yellow-600' />
              </div>
              <CardTitle className='text-2xl'>I Want to Mentor</CardTitle>
              <CardDescription className='text-base'>
                Share your expertise, guide aspiring professionals, and make a
                lasting impact on careers
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-[#FFD500] rounded-full' />
                  <span className='text-sm'>
                    1:1 and group mentorship sessions
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-[#FFD500] rounded-full' />
                  <span className='text-sm'>
                    Flexible scheduling and session management
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-[#FFD500] rounded-full' />
                  <span className='text-sm'>
                    Mentee progress tracking and feedback
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-[#FFD500] rounded-full' />
                  <span className='text-sm'>
                    Earnings dashboard and payment management
                  </span>
                </div>
              </div>
              <div className='pt-4'>
                <Button
                  className='w-full bg-[#FFD500] text-black hover:bg-[#e6c000]'
                  asChild
                >
                  <Link href='/onboarding/mentor'>
                    Start Mentoring Journey
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  className='w-full mt-2 bg-transparent'
                  asChild
                >
                  <Link href='/mentor/dashboard'>View Mentor Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* For Trainers */}
          <Card className='relative overflow-hidden hover:shadow-lg transition-shadow'>
            <div className='absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-teal-600' />
            <div className='absolute top-4 right-4'>
              <Badge className='bg-green-600 text-white'>New!</Badge>
            </div>
            <CardHeader className='text-center pb-4'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <GraduationCap className='h-8 w-8 text-green-600' />
              </div>
              <CardTitle className='text-2xl'>I Want to Train</CardTitle>
              <CardDescription className='text-base'>
                Create comprehensive training programs and build your teaching
                business on our LMS platform
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-500 rounded-full' />
                  <span className='text-sm'>Full-featured LMS platform</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-500 rounded-full' />
                  <span className='text-sm'>
                    Course creation and management tools
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-500 rounded-full' />
                  <span className='text-sm'>Student progress tracking</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-500 rounded-full' />
                  <span className='text-sm'>
                    Revenue management and analytics
                  </span>
                </div>
              </div>
              <div className='pt-4'>
                <Button
                  className='w-full bg-green-600 hover:bg-green-700'
                  asChild
                >
                  <Link href='/onboarding/trainer'>
                    Start Training Journey
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  className='w-full mt-2 bg-transparent'
                  asChild
                >
                  <Link href='/lms/dashboard'>View LMS Demo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trainer Spotlight Section */}
        <div className='bg-gradient-to-r from-[#FFD500] to-[#FFA500] rounded-2xl p-8 mb-16'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold text-black mb-4'>
                Become a Trainer on Mentwork
              </h2>
              <p className='text-lg text-black/80'>
                Join thousands of expert trainers who are building successful
                teaching businesses on our platform
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <div className='text-center'>
                <div className='w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <BookOpen className='h-6 w-6 text-black' />
                </div>
                <h3 className='font-semibold text-black mb-2'>
                  Create Courses
                </h3>
                <p className='text-sm text-black/70'>
                  Build comprehensive training programs with our intuitive
                  course builder
                </p>
              </div>
              <div className='text-center'>
                <div className='w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Users className='h-6 w-6 text-black' />
                </div>
                <h3 className='font-semibold text-black mb-2'>
                  Reach Students
                </h3>
                <p className='text-sm text-black/70'>
                  Connect with learners worldwide through our marketplace
                </p>
              </div>
              <div className='text-center'>
                <div className='w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <DollarSign className='h-6 w-6 text-black' />
                </div>
                <h3 className='font-semibold text-black mb-2'>Earn Revenue</h3>
                <p className='text-sm text-black/70'>
                  Monetize your expertise with flexible pricing and payment
                  options
                </p>
              </div>
            </div>

            <div className='text-center'>
              <Button
                size='lg'
                className='bg-black text-white hover:bg-black/90'
                asChild
              >
                <Link href='/onboarding/trainer'>
                  Start Your Training Business
                  <ArrowRight className='h-5 w-5 ml-2' />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className='mb-16'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Success Stories</h2>
            <p className='text-xl text-gray-600'>
              See how our platform has transformed careers and businesses
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                    <Users className='h-6 w-6 text-blue-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold'>Sarah M.</h3>
                    <p className='text-sm text-gray-500'>
                      Marketing Professional
                    </p>
                  </div>
                </div>
                <p className='text-gray-700 mb-4'>
                  "The mentorship program helped me transition from junior to
                  senior marketing manager in just 8 months. The personalized
                  guidance was invaluable."
                </p>
                <div className='flex items-center gap-2'>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className='h-4 w-4 fill-yellow-400 text-yellow-400'
                      />
                    ))}
                  </div>
                  <span className='text-sm text-gray-500'>5.0</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center'>
                    <GraduationCap className='h-6 w-6 text-yellow-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold'>Dr. James W.</h3>
                    <p className='text-sm text-gray-500'>
                      Data Science Trainer
                    </p>
                  </div>
                </div>
                <p className='text-gray-700 mb-4'>
                  "I've built a six-figure training business using Mentwork's
                  LMS. The platform handles everything so I can focus on
                  creating great content."
                </p>
                <div className='flex items-center gap-4 text-sm text-gray-600'>
                  <span className='flex items-center gap-1'>
                    <TrendingUp className='h-4 w-4' />
                    $120K revenue
                  </span>
                  <span className='flex items-center gap-1'>
                    <Users className='h-4 w-4' />
                    2,500 students
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center'>
                    <Building className='h-6 w-6 text-indigo-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold'>John D.</h3>
                    <p className='text-sm text-gray-500'>Software Engineer</p>
                  </div>
                </div>
                <p className='text-gray-700 mb-4'>
                  "Mentwork's platform has revolutionized the way I manage
                  training programs. It's a game-changer!"
                </p>
                <div className='flex items-center gap-2'>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className='h-4 w-4 fill-yellow-400 text-yellow-400'
                      />
                    ))}
                  </div>
                  <span className='text-sm text-gray-500'>5.0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
