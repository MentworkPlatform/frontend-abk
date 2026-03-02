'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiError, apiClient, setAuthToken } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'
import { LOGIN_URL } from '@/lib/server-url'

type LoginResponse = {
  success?: boolean
  error?: string
  token?: string
  accessToken?: string
  user?: {
    role?: string | { name?: string }
    userType?: string
  }
  data?: {
    success?: boolean
    error?: string
    token?: string
    accessToken?: string
    user?: {
      role?: string | { name?: string }
      userType?: string
    }
  }
}

const resolveLoginToken = (payload: LoginResponse) =>
  payload.token ??
  payload.accessToken ??
  payload.data?.token ??
  payload.data?.accessToken

const resolveUserType = (payload: LoginResponse) => {
  const roleValue =
    payload.user?.role ??
    payload.user?.userType ??
    payload.data?.user?.role ??
    payload.data?.user?.userType ??
    'mentee'

  const role =
    typeof roleValue === 'string' ? roleValue : (roleValue.name ?? 'mentee')

  const normalizedRole = role.toLowerCase()

  if (normalizedRole.includes('trainer')) {
    return 'trainer'
  }

  if (normalizedRole.includes('mentor')) {
    return 'mentor'
  }

  return 'mentee'
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await apiClient.post<
        LoginResponse,
        { email: string; password: string }
      >(
        LOGIN_URL,
        {
          email: formData.email,
          password: formData.password,
        },
        { withAuth: false },
      )

      if (response.success === false || response.data?.success === false) {
        throw new Error(
          response.error ?? response.data?.error ?? 'Invalid email or password',
        )
      }

      const token = resolveLoginToken(response)

      if (!token) {
        throw new Error('Login succeeded but no access token was returned.')
      }

      setAuthToken(token)

      const userType = resolveUserType(response)

      toast({
        title: 'Login successful',
        description: 'Redirecting to your dashboard...',
      })

      switch (userType) {
        case 'mentor':
          router.push('/mentor/dashboard')
          break
        case 'trainer':
          router.push('/trainer/dashboard')
          break
        default:
          router.push('/mentee/dashboard')
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Unable to sign in. Please try again.'

      toast({
        title: 'Login failed',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

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
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Welcome Back</CardTitle>
            <CardDescription className='text-sm'>
              Kindly provide your login credentials to access your account.
            </CardDescription>
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
                    placeholder='you@example.com'
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
      </div>
    </div>
  )
}
