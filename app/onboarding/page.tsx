'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Building,
  Briefcase,
  Target,
  Users,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react'

import { API_URL } from '@/components/Serverurl'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // const [formData, setFormData] = useState({
  //   goal: '',
  //   name: '',
  //   email: '',
  //   industry: '',
  //   password: '',
  //   businessStage: '',
  //   supportAreas: [] as string[],
  //   specificGoals: '',
  //   timeframe: '',
  // })

  const [formData, setFormData] = useState({
    step1: { goal: '', timeframe: '' },
    step2: { name: '', email: '', password: '' },
    step3: { businessStage: '' },
    step4: {
      supportAreas: [] as string[],
      specificGoals: '',
    },
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // const updateFormData = (Step: string, field: string, value: any) => {
  //   setFormData((prev) => ({ ...prev, Step, [field]: value }))
  // }

  const updateFormData = (step: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [`step${step}`]: { ...prev[`step${step}`], [field]: value },
    }))
  }

  const toggleSupportArea = (area: string) => {
    setFormData((prev) => {
      const currentAreas = [...prev.step4.supportAreas]
      if (currentAreas.includes(area)) {
        return { ...prev, supportAreas: currentAreas.filter((a) => a !== area) }
      } else {
        return { ...prev, supportAreas: [...currentAreas, area] }
      }
    })
  }

  // const nextStep = () => {
  //   setStep((prev) => prev + 1)
  //   window.scrollTo(0, 0)
  // }

  const ErrorMessage = ({ error }: { error: string }) => {
    return <div style={{ color: 'red' }}>{error}</div>
  }

  const nextStep = () => {
    // const currentStepData = formData[`step${step}`]
    const currentStepData = formData[`step${step}` as keyof typeof formData]
    const errors = validateStep(currentStepData)
    if (Object.keys(errors).length > 0) {
      console.log('Errors:', errors)
      setErrors(errors)
    } else {
      console.log('No errors found')
      setStep((prev) => prev + 1)
      window.scrollTo(0, 0)
      setErrors({})
    }
  }

  const validateStep = (stepData: any) => {
    const errors = {}
    Object.keys(stepData).forEach((field) => {
      if (stepData[field] === '') {
        errors[field] = `This ${field} field is required`
      }
    })
    return errors
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    setShowError(false)
    setError('')
    // Retry the registration
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }, 1000) // Small delay for better UX
  }

  const dismissError = () => {
    setShowError(false)
    setError('')
  }

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // In a real app, you would submit the data to your backend
  //   router.push("/dashboard")
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setShowError(false)
    setError('')

    try {
      const transformedData: Record<string, any> = {}
      Object.keys(formData).forEach((step: string) => {
        const stepData = (formData as any)[step]
        Object.keys(stepData).forEach((field: string) => {
          transformedData[field] = stepData[field]
        })
      })

      console.log('Submitting mentee data:', transformedData) // Debug log

      const response = await fetch(API_URL + '/mentees/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      })

      console.log('Response status:', response.status) // Debug log
      console.log('Response ok:', response.ok) // Debug log

      let data
      try {
        data = await response.json()
        console.log('Response data:', data) // Debug log
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        throw new Error('Server returned invalid response format')
      }

      if (!response.ok) {
        // Handle HTTP errors (4xx, 5xx)
        const errorMessage =
          data?.error ||
          data?.message ||
          `Server error (${response.status}). Please try again.`
        setError(errorMessage)
        setShowError(true)
        console.error('HTTP error:', response.status, data)
        return
      }

      if (data.success) {
        router.push('/login')
      } else {
        // Handle application errors (success: false)
        const errorMessage =
          data?.error ||
          data?.message ||
          'Registration failed. Please check your information and try again.'
        setError(errorMessage)
        setShowError(true)
        console.error('Application error:', data)
      }
    } catch (error) {
      console.error('Network/API error:', error)

      let errorMessage =
        'Unable to connect to the server. Please check your internet connection and try again.'

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage =
            'Network connection failed. Please check your internet connection.'
        } else if (error.message.includes('HTTP error')) {
          errorMessage =
            'Server error occurred. Please try again in a few moments.'
        } else if (error.message.includes('400')) {
          errorMessage =
            'Invalid information provided. Please check your details.'
        } else if (error.message.includes('409')) {
          errorMessage =
            'An account with this email already exists. Please use a different email.'
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error occurred. Please try again later.'
        } else if (error.message.includes('invalid response format')) {
          errorMessage =
            'Server returned an invalid response. Please try again.'
        }
      }

      setError(errorMessage)
      setShowError(true)
      console.error('Final error state:', { errorMessage, showError: true })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#F5F5F5] py-12'>
      <div className='container max-w-3xl'>
        <div className='mb-8'>
          <div className='flex items-center gap-2 mb-8'>
            <Link href='/'>
              <img
                src='/images/mentwork-logo.png'
                alt='Mentwork'
                className='h-8'
              />
            </Link>
          </div>

          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl md:text-3xl font-bold'>
              Let's Personalize Your Journey
            </h1>
            <div className='text-sm font-medium'>Step {step} of 3</div>
          </div>

          {/* Error Display */}
          {showError && error && (
            <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4'>
              <Alert className='border-red-200 bg-red-50 shadow-lg'>
                <AlertCircle className='h-4 w-4 text-red-600' />
                <AlertDescription className='flex items-center justify-between'>
                  <span className='text-red-800 text-sm'>{error}</span>
                  <div className='flex items-center space-x-2 ml-4'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleRetry}
                      disabled={isLoading}
                      className='border-red-300 text-red-700 hover:bg-red-100 h-8 px-3'
                    >
                      <RefreshCw
                        className={`h-3 w-3 mr-1 ${
                          isLoading ? 'animate-spin' : ''
                        }`}
                      />
                      Retry
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={dismissError}
                      className='text-red-700 hover:bg-red-100 h-8 w-8 p-0'
                    >
                      <X className='h-3 w-3' />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Fallback inline error display */}
          {showError && error && (
            <Alert className='border-red-200 bg-red-50 mb-6'>
              <AlertCircle className='h-4 w-4 text-red-600' />
              <AlertDescription className='flex items-center justify-between'>
                <span className='text-red-800'>{error}</span>
                <div className='flex items-center space-x-2 ml-4'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleRetry}
                    disabled={isLoading}
                    className='border-red-300 text-red-700 hover:bg-red-100'
                  >
                    <RefreshCw
                      className={`h-3 w-3 mr-1 ${
                        isLoading ? 'animate-spin' : ''
                      }`}
                    />
                    Retry
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={dismissError}
                    className='text-red-700 hover:bg-red-100'
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className='w-full bg-gray-200 h-2 rounded-full mb-8'>
            <div
              className='bg-[#FFD500] h-2 rounded-full transition-all duration-300'
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className='border-none shadow-lg rounded-xl'>
          <CardContent className='p-6 md:p-8'>
            {step === 1 && (
              <div className='space-y-6'>
                <h2 className='text-xl font-bold mb-4'>What are your goals?</h2>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='goal'>
                      Share your main professional goal
                    </Label>
                    <Textarea
                      id='goal'
                      value={formData.step1.goal}
                      onChange={(e) =>
                        updateFormData(1, 'goal', e.target.value)
                      }
                      placeholder='e.g., Scale my startup, Secure funding, Improve team management...'
                      rows={3}
                      required
                    />
                    {errors?.goal && <ErrorMessage error={errors.goal} />}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='timeframe'>
                      When do you want to achieve this?
                    </Label>
                    <Select
                      value={formData.step1.timeframe}
                      onValueChange={(value) =>
                        updateFormData(1, 'timeframe', value)
                      }
                    >
                      <SelectTrigger id='timeframe'>
                        <SelectValue placeholder='Select a timeframe' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1-3-months'>1-3 months</SelectItem>
                        <SelectItem value='3-6-months'>3-6 months</SelectItem>
                        <SelectItem value='6-12-months'>6-12 months</SelectItem>
                        <SelectItem value='1-2-years'>1-2 years</SelectItem>
                        <SelectItem value='2-plus-years'>2+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors?.timeframe && (
                      <ErrorMessage error={errors.timeframe} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className='space-y-6'>
                <h2 className='text-xl font-bold mb-4'>
                  Tell us about yourself
                </h2>

                <div className='space-y-4'>
                  <div className='grid grid-cols-1 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Full Name</Label>
                      <Input
                        id='name'
                        value={formData.step2.name}
                        onChange={(e) =>
                          updateFormData(2, 'name', e.target.value)
                        }
                        placeholder='Enter your full name'
                        required
                      />
                      {errors?.name && <ErrorMessage error={errors.name} />}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email Address</Label>
                      <Input
                        id='email'
                        type='email'
                        value={formData.step2.email}
                        onChange={(e) =>
                          updateFormData(2, 'email', e.target.value)
                        }
                        placeholder='Enter your email address'
                        required
                      />
                      {errors?.email && <ErrorMessage error={errors.email} />}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='password'>Password</Label>
                      <Input
                        id='email'
                        type='email'
                        value={formData.step2.password}
                        onChange={(e) =>
                          updateFormData(2, 'password', e.target.value)
                        }
                        placeholder='Enter your password'
                        required
                      />
                      {errors?.password && (
                        <ErrorMessage error={errors.password} />
                      )}
                    </div>

                    {/* <div className='space-y-2'>
                      <Label htmlFor='industry'>Industry</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) =>
                          updateFormData('industry', value)
                        }
                      >
                        <SelectTrigger id='industry'>
                          <SelectValue placeholder='Select your industry' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='technology'>Technology</SelectItem>
                          <SelectItem value='finance'>Finance</SelectItem>
                          <SelectItem value='healthcare'>Healthcare</SelectItem>
                          <SelectItem value='education'>Education</SelectItem>
                          <SelectItem value='retail'>Retail</SelectItem>
                          <SelectItem value='manufacturing'>
                            Manufacturing
                          </SelectItem>
                          <SelectItem value='agriculture'>
                            Agriculture
                          </SelectItem>
                          <SelectItem value='other'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className='space-y-6'>
                <h2 className='text-xl font-bold mb-4'>Your Business</h2>

                <div className='space-y-4'>
                  <Label>What stage is your business at?</Label>
                  <RadioGroup
                    value={formData.step3.businessStage}
                    onValueChange={(value) =>
                      updateFormData(3, 'businessStage', value)
                    }
                    className='space-y-3'
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='idea' id='idea' />
                      <Label htmlFor='idea' className='font-normal'>
                        Idea Stage
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value='early-startup'
                        id='early-startup'
                      />
                      <Label htmlFor='early-startup' className='font-normal'>
                        Early Startup (Pre-revenue)
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='growing' id='growing' />
                      <Label htmlFor='growing' className='font-normal'>
                        Growing Business (Revenue generating)
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='established' id='established' />
                      <Label htmlFor='established' className='font-normal'>
                        Established Business
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='scaling' id='scaling' />
                      <Label htmlFor='scaling' className='font-normal'>
                        Scaling (Rapid growth phase)
                      </Label>
                    </div>
                  </RadioGroup>

                  {errors?.businessStage && (
                    <ErrorMessage error={errors.businessStage} />
                  )}
                </div>
              </div>
            )}

            {/* {step === 4 && (
              <div className='space-y-6'>
                <h2 className='text-xl font-bold mb-4'>Areas of Support</h2>

                <div className='space-y-4'>
                  <Label>
                    What areas do you need support with? (Select all that apply)
                  </Label>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-2'>
                    <Button
                      type='button'
                      variant={
                        formData.step4.supportAreas.includes('funding')
                          ? 'default'
                          : 'outline'
                      }
                      className={
                        formData.step4.supportAreas.includes('funding')
                          ? 'bg-[#FFD500] text-black'
                          : ''
                      }
                      onClick={() => toggleSupportArea('funding')}
                    >
                      <Building className='mr-2 h-4 w-4' /> Funding & Investment
                    </Button>
                    <Button
                      type='button'
                      variant={
                        formData.step4.supportAreas.includes('marketing')
                          ? 'default'
                          : 'outline'
                      }
                      className={
                        formData.step4.supportAreas.includes('marketing')
                          ? 'bg-[#FFD500] text-black'
                          : ''
                      }
                      onClick={() => toggleSupportArea('marketing')}
                    >
                      <Target className='mr-2 h-4 w-4' /> Marketing & Visibility
                    </Button>
                    <Button
                      type='button'
                      variant={
                        formData.step4.supportAreas.includes('operations')
                          ? 'default'
                          : 'outline'
                      }
                      className={
                        formData.supportAreas.includes('operations')
                          ? 'bg-[#FFD500] text-black'
                          : ''
                      }
                      onClick={() => toggleSupportArea('operations')}
                    >
                      <Briefcase className='mr-2 h-4 w-4' /> Operations &
                      Processes
                    </Button>
                    <Button
                      type='button'
                      variant={
                        formData.step4.supportAreas.includes('team')
                          ? 'default'
                          : 'outline'
                      }
                      className={
                        formData.supportAreas.includes('team')
                          ? 'bg-[#FFD500] text-black'
                          : ''
                      }
                      onClick={() => toggleSupportArea('team')}
                    >
                      <Users className='mr-2 h-4 w-4' /> Team & Leadership
                    </Button>
                  </div>

                  <div className='space-y-2 mt-6'>
                    <Label htmlFor='specificGoals'>Specific Objectives</Label>
                    <Textarea
                      id='specificGoals'
                      value={formData.step4.specificGoals}
                      onChange={(e) =>
                        updateFormData(4, 'specificGoals', e.target.value)
                      }
                      placeholder='What specific objectives do you want to achieve through mentorship?'
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )} */}

            <div className='flex justify-between mt-8'>
              {step > 1 ? (
                <Button
                  type='button'
                  variant='outline'
                  onClick={prevStep}
                  className='flex items-center gap-2'
                >
                  <ArrowLeft className='h-4 w-4' /> Back
                </Button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <Button
                  type='button'
                  onClick={nextStep}
                  className='bg-[#FFD500] text-black hover:bg-[#e6c000] flex items-center gap-2'
                >
                  Next <ArrowRight className='h-4 w-4' />
                </Button>
              ) : (
                <Button
                  type='button'
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className='bg-[#FFD500] text-black hover:bg-[#e6c000] flex items-center gap-2'
                >
                  {isLoading ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2' />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Find My Mentors <CheckCircle2 className='h-4 w-4 ml-2' />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
