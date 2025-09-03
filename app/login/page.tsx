'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Users,
  BookOpen,
  Award,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { API_URL } from '@/components/Serverurl'
import { Alert } from '@/components/ui/alert'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('mentee')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setIsLoading(false)
      if (data.success) {
        console.log(data)
        const user = data.user
        const token = data.token

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        let roleName = data.user?.role?.name
        switch (roleName) {
          case 'Mentee':
            router.push('/dashboard')
            break
          case 'Mentor':
            router.push('/mentor/dashboard')
            break
          case 'Trainer':
            router.push('/trainer/dashboard')
            break
          default:
            console.log('No Role')
        }
      } else {
        setError(data?.error)
        console.error(data.error)
      }
    } catch (error) {
      setIsLoading(false)
      console.error(error)
      setError('Something went wrong..pls try again')
    }

    // Simulate login and redirect based on user type
    // setTimeout(() => {
    //   setIsLoading(false)
    //   switch (activeTab) {
    //     case 'mentee':
    //       router.push('/dashboard')
    //       break
    //     case 'mentor':
    //       router.push('/mentor/dashboard')
    //       break
    //     case 'trainer':
    //       router.push('/trainer/dashboard')
    //       break
    //     default:
    //       router.push('/dashboard')
    //   }
    // }, 2000)
  }

  const getUserTypeInfo = (userType: string) => {
    switch (userType) {
      case 'mentee':
        return {
          title: 'Student Portal',
          description: 'Access your learning programs and connect with mentors',
          icon: <BookOpen className='h-5 w-5' />,
          benefits: [
            'Join training programs and bootcamps',
            'Connect with expert mentors',
            'Track your learning progress',
            'Access exclusive resources and materials',
          ],
        }
      case 'mentor':
        return {
          title: 'Mentor Portal',
          description: 'Teach students and share your expertise',
          icon: <Users className='h-5 w-5' />,
          benefits: [
            'Teach in training programs',
            'Earn competitive compensation',
            'Build your professional network',
            'Make a meaningful impact on students',
          ],
        }
      case 'trainer':
        return {
          title: 'Trainer Portal',
          description: 'Create and manage comprehensive training programs',
          icon: <Award className='h-5 w-5' />,
          benefits: [
            'Build comprehensive training programs',
            'Invite expert mentors to teach',
            'Manage curriculum and assessments',
            'Track program success and revenue',
          ],
        }
      default:
        return {
          title: 'Login',
          description: 'Access your account',
          icon: <Users className='h-5 w-5' />,
          benefits: [],
        }
    }
  }

  const userTypeInfo = getUserTypeInfo(activeTab)

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <Link href='/' className='inline-block'>
            <img
              src='/images/mentwork-logo.png'
              alt='Mentwork'
              className='h-12 w-auto mx-auto'
            />
          </Link>
          <h2 className='mt-6 text-3xl font-bold text-gray-900'>
            Welcome Back
          </h2>
          <p className='mt-2 text-sm text-gray-600'>Sign in to continue</p>
        </div>

        <Card>
          <CardHeader>
            {/* <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='mentee' className='text-xs'>
                  Student
                </TabsTrigger>
                <TabsTrigger value='mentor' className='text-xs'>
                  Mentor
                </TabsTrigger>
                <TabsTrigger value='trainer' className='text-xs'>
                  Trainer
                </TabsTrigger>
              </TabsList>
            </Tabs> */}

            {error && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Alert
                  variant='destructive'
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  {error}
                </Alert>
              </div>
            )}

            {/* <div className='flex items-center space-x-2 pt-2'>
              {userTypeInfo.icon}
              <div>
                <CardTitle className='text-lg'>{userTypeInfo.title}</CardTitle>
                <CardDescription className='text-sm'>
                  {userTypeInfo.description}
                </CardDescription>
              </div>
            </div> */}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <div className='relative'>
                  <Mail className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='email'
                    type='email'
                    placeholder={`${activeTab}@example.com`}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className='pl-8'
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Lock className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className='pl-8 pr-10'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-gray-700'
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='remember'
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        rememberMe: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor='remember' className='text-sm'>
                    Remember me
                  </Label>
                </div>
                <Link
                  href='/forgot-password'
                  className='text-sm text-[#FFD500] hover:text-[#e6c000]'
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type='submit'
                className='w-full bg-[#FFD500] text-black hover:bg-[#e6c000]'
                disabled={isLoading}
              >
                {isLoading ? (
                  'Signing in...'
                ) : (
                  <>
                    Sign In
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </>
                )}
              </Button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600'>
                New to Mentwork?{' '}
                <Link
                  href='/get-started'
                  className='font-medium text-[#FFD500] hover:text-[#e6c000]'
                >
                  Get started
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Type Benefits */}
        {userTypeInfo.benefits.length > 0 && (
          <Card className='bg-gradient-to-r from-[#FFD500]/10 to-[#FFD500]/5'>
            <CardContent className='p-4'>
              <h3 className='font-medium text-sm mb-2'>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{' '}
                Benefits
              </h3>
              <ul className='text-xs text-gray-600 space-y-1'>
                {userTypeInfo.benefits.map((benefit, index) => (
                  <li key={index}>• {benefit}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
