'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  User,
  BookOpen,
  Settings,
  Play,
  Target,
  Award,
  Lightbulb,
  GraduationCap,
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { API_URL } from '@/components/Serverurl'
import { profile } from 'console'

export default function TrainerOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1: Profile Setup
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    title: '',
    password: '',
    bio: '',
    expertise: [] as string[],
    experience: '',
    education: '',
    certifications: '',
    linkedinUrl: '',
    websiteUrl: '',
    timezone: '',
    languages: [] as string[],
    expertises: '',
    roleName: '',
  })

  // Step 2: Program Creation
  const [programData, setProgramData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    format: '',
    type: '',
    price: '',
    duration: '',
    maxParticipants: '',
    learningOutcomes: ['', '', ''],
    prerequisites: [''],
    targetAudience: '',
  })

  // Step 3: LMS Setup
  const [lmsSettings, setLmsSettings] = useState({
    enableCertificates: true,
    enableDiscussions: true,
    enableAssignments: true,
    enableQuizzes: true,
    allowDownloads: true,
    requireApproval: false,
    sendNotifications: true,
    trackProgress: true,
  })

  const totalSteps = 4
  const currentProgress = (step / totalSteps) * 100

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    let dataObject = profileData
    dataObject.expertises = profileData.expertise.join(', ')
    dataObject.roleName = 'Trainer'

    try {
      const response = await fetch(API_URL + '/mentors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObject),
      })
      const data = await response.json()
      setIsLoading(false)
      if (data.success) {
        router.push('/login')
      } else {
        setError(data?.error)
        console.error(data.error)
      }
    } catch (error) {
      setIsLoading(false)
      console.error(error)
      setError('Something went wrong..pls try again')
    }

    // Simulate API calls to create trainer profile and program
    // setTimeout(() => {
    //   setIsLoading(false)
    //   router.push('/trainer/dashboard')
    // }, 3000)
  }

  const updateExpertise = (skill: string) => {
    setProfileData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(skill)
        ? prev.expertise.filter((s) => s !== skill)
        : [...prev.expertise, skill],
    }))
  }

  const updateLanguages = (language: string) => {
    setProfileData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }))
  }

  const updateLearningOutcome = (index: number, value: string) => {
    const updated = [...programData.learningOutcomes]
    updated[index] = value
    setProgramData({ ...programData, learningOutcomes: updated })
  }

  const addLearningOutcome = () => {
    setProgramData({
      ...programData,
      learningOutcomes: [...programData.learningOutcomes, ''],
    })
  }

  const removeLearningOutcome = (index: number) => {
    if (programData.learningOutcomes.length > 1) {
      const updated = programData.learningOutcomes.filter((_, i) => i !== index)
      setProgramData({ ...programData, learningOutcomes: updated })
    }
  }

  const expertiseOptions = [
    'Digital Marketing',
    'Business Strategy',
    'Leadership',
    'Product Management',
    'Data Science',
    'Software Development',
    'UX/UI Design',
    'Sales',
    'Finance',
    'Operations',
    'HR',
    'Project Management',
    'Entrepreneurship',
    'E-commerce',
    'Content Marketing',
    'SEO',
  ]

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Mandarin',
    'Japanese',
    'Korean',
    'Arabic',
    'Hindi',
    'Russian',
  ]

  return (
    <div className='min-h-screen bg-[#F5F5F5] py-8'>
      <div className='container max-w-4xl'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/get-started'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back
              </Button>
            </Link>
            <Link href='/'>
              <img
                src='/images/mentwork-logo.png'
                alt='Mentwork'
                className='h-8'
              />
            </Link>
          </div>

          <div className='text-center mb-8'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <GraduationCap className='h-8 w-8 text-[#FFD500]' />
              <h1 className='text-3xl font-bold'>
                Welcome to Mentwork Training
              </h1>
            </div>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Let's set up your trainer profile and create your first training
              program. This process will take about 10 minutes.
            </p>
          </div>

          {/* Progress Bar */}
          {/* <div className='mb-8'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm font-medium'>
                Step {step} of {totalSteps}
              </span>
              <span className='text-sm text-gray-500'>
                {Math.round(currentProgress)}% Complete
              </span>
            </div>
            <Progress value={currentProgress} className='h-2' />
          </div> */}

          {/* Step Indicators */}
          {/* <div className='flex items-center justify-between mb-8'>
            {[
              { number: 1, title: 'Profile Setup', icon: User },
              { number: 2, title: 'Create Program', icon: BookOpen },
              { number: 3, title: 'LMS Setup', icon: Settings },
              { number: 4, title: 'Launch', icon: Play },
            ].map((stepItem, index) => (
              <div key={stepItem.number} className='flex items-center'>
                <div className='flex flex-col items-center'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepItem.number
                        ? 'bg-[#FFD500] text-black'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step > stepItem.number ? (
                      <CheckCircle2 className='h-5 w-5' />
                    ) : (
                      <stepItem.icon className='h-5 w-5' />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${
                      step >= stepItem.number ? 'font-medium' : 'text-gray-500'
                    }`}
                  >
                    {stepItem.title}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`flex-1 h-px mx-4 ${
                      step > stepItem.number ? 'bg-[#FFD500]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div> */}
        </div>

        {/* Step Content */}
        <Card className='border-none shadow-lg'>
          <CardContent className='p-8'>
            {step === 1 && (
              <ProfileSetupStep
                profileData={profileData}
                setProfileData={setProfileData}
                expertiseOptions={expertiseOptions}
                languageOptions={languageOptions}
                updateExpertise={updateExpertise}
                updateLanguages={updateLanguages}
                onComplete={handleComplete}
                // onNext={nextStep}
              />
            )}

            {/* {step === 2 && (
              <ProgramCreationStep
                programData={programData}
                setProgramData={setProgramData}
                updateLearningOutcome={updateLearningOutcome}
                addLearningOutcome={addLearningOutcome}
                removeLearningOutcome={removeLearningOutcome}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {step === 3 && (
              <LMSSetupStep
                lmsSettings={lmsSettings}
                setLmsSettings={setLmsSettings}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {step === 4 && (
              <LaunchStep
                profileData={profileData}
                programData={programData}
                lmsSettings={lmsSettings}
                onComplete={handleComplete}
                onPrev={prevStep}
                isLoading={isLoading}
              />
            )} */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Step 1: Profile Setup
function ProfileSetupStep({
  profileData,
  setProfileData,
  expertiseOptions,
  languageOptions,
  updateExpertise,
  updateLanguages,
  onComplete,
}: any) {
  const isValid =
    profileData.name &&
    profileData.email &&
    profileData.title &&
    profileData.bio &&
    profileData.password &&
    profileData.expertise.length > 0

  return (
    <div className='space-y-6'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold mb-2'>Set Up Your Trainer Profile</h2>
        <p className='text-gray-600'>
          Tell us about yourself and your expertise
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Full Name *</Label>
          <Input
            id='name'
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
            placeholder='Enter your full name'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email Address *</Label>
          <Input
            id='email'
            type='email'
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            placeholder='Enter your email'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='title'>Password *</Label>
        <Input
          id='title'
          type='password'
          value={profileData.password}
          onChange={(e) =>
            setProfileData({ ...profileData, password: e.target.value })
          }
          placeholder='e.g., *****'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='title'>Professional Title *</Label>
        <Input
          id='title'
          value={profileData.title}
          onChange={(e) =>
            setProfileData({ ...profileData, title: e.target.value })
          }
          placeholder='e.g., Senior Digital Marketing Manager, Business Strategy Consultant'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='bio'>Professional Bio *</Label>
        <Textarea
          id='bio'
          value={profileData.bio}
          onChange={(e) =>
            setProfileData({ ...profileData, bio: e.target.value })
          }
          placeholder='Tell potential students about your background, experience, and what makes you a great trainer...'
          rows={4}
        />
      </div>

      <div className='space-y-3'>
        <Label>Areas of Expertise * (Select all that apply)</Label>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
          {expertiseOptions.map((skill: any) => (
            <Button
              key={skill}
              type='button'
              variant={
                profileData.expertise.includes(skill) ? 'default' : 'outline'
              }
              size='sm'
              className={
                profileData.expertise.includes(skill)
                  ? 'bg-[#FFD500] text-black'
                  : ''
              }
              onClick={() => updateExpertise(skill)}
            >
              {skill}
            </Button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='experience'>Years of Experience</Label>
          <Select
            value={profileData.experience}
            onValueChange={(value) =>
              setProfileData({ ...profileData, experience: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select experience level' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1-3'>1-3 years</SelectItem>
              <SelectItem value='4-7'>4-7 years</SelectItem>
              <SelectItem value='8-12'>8-12 years</SelectItem>
              <SelectItem value='13-20'>13-20 years</SelectItem>
              <SelectItem value='20+'>20+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='timezone'>Timezone</Label>
          <Select
            value={profileData.timezone}
            onValueChange={(value) =>
              setProfileData({ ...profileData, timezone: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select your timezone' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='PST'>Pacific Time (PST)</SelectItem>
              <SelectItem value='MST'>Mountain Time (MST)</SelectItem>
              <SelectItem value='CST'>Central Time (CST)</SelectItem>
              <SelectItem value='EST'>Eastern Time (EST)</SelectItem>
              <SelectItem value='GMT'>Greenwich Mean Time (GMT)</SelectItem>
              <SelectItem value='CET'>Central European Time (CET)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='space-y-3'>
        <Label>Languages (Select all that apply)</Label>
        <div className='grid grid-cols-3 md:grid-cols-6 gap-2'>
          {languageOptions.map((language: any) => (
            <Button
              key={language}
              type='button'
              variant={
                profileData.languages.includes(language) ? 'default' : 'outline'
              }
              size='sm'
              className={
                profileData.languages.includes(language)
                  ? 'bg-[#FFD500] text-black'
                  : ''
              }
              onClick={() => updateLanguages(language)}
            >
              {language}
            </Button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='linkedinUrl'>LinkedIn Profile (Optional)</Label>
          <Input
            id='linkedinUrl'
            value={profileData.linkedinUrl}
            onChange={(e) =>
              setProfileData({ ...profileData, linkedinUrl: e.target.value })
            }
            placeholder='https://linkedin.com/in/yourprofile'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='websiteUrl'>Website (Optional)</Label>
          <Input
            id='websiteUrl'
            value={profileData.websiteUrl}
            onChange={(e) =>
              setProfileData({ ...profileData, websiteUrl: e.target.value })
            }
            placeholder='https://yourwebsite.com'
          />
        </div>
      </div>

      <div className='flex justify-end pt-6'>
        <Button
          onClick={onComplete}
          disabled={!isValid}
          className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
        >
          Create Profile
        </Button>
      </div>
    </div>
  )
}

// Step 2: Program Creation
function ProgramCreationStep({
  programData,
  setProgramData,
  updateLearningOutcome,
  addLearningOutcome,
  removeLearningOutcome,
  onNext,
  onPrev,
}: any) {
  const isValid =
    programData.title &&
    programData.description &&
    programData.category &&
    programData.level &&
    programData.format &&
    programData.price &&
    programData.duration

  return (
    <div className='space-y-6'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold mb-2'>
          Create Your First Training Program
        </h2>
        <p className='text-gray-600'>
          Design a comprehensive learning experience for your students
        </p>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='title'>Program Title *</Label>
        <Input
          id='title'
          value={programData.title}
          onChange={(e) =>
            setProgramData({ ...programData, title: e.target.value })
          }
          placeholder='e.g., Complete Digital Marketing Bootcamp'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Program Description *</Label>
        <Textarea
          id='description'
          value={programData.description}
          onChange={(e) =>
            setProgramData({ ...programData, description: e.target.value })
          }
          placeholder='Describe what students will learn and achieve in this program...'
          rows={4}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='category'>Category *</Label>
          <Select
            value={programData.category}
            onValueChange={(value) =>
              setProgramData({ ...programData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='business'>Business</SelectItem>
              <SelectItem value='marketing'>Marketing</SelectItem>
              <SelectItem value='technology'>Technology</SelectItem>
              <SelectItem value='design'>Design</SelectItem>
              <SelectItem value='leadership'>Leadership</SelectItem>
              <SelectItem value='finance'>Finance</SelectItem>
              <SelectItem value='operations'>Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='level'>Experience Level *</Label>
          <Select
            value={programData.level}
            onValueChange={(value) =>
              setProgramData({ ...programData, level: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select level' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='beginner'>Beginner</SelectItem>
              <SelectItem value='intermediate'>Intermediate</SelectItem>
              <SelectItem value='advanced'>Advanced</SelectItem>
              <SelectItem value='all-levels'>All Levels</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='format'>Format *</Label>
          <Select
            value={programData.format}
            onValueChange={(value) =>
              setProgramData({ ...programData, format: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select format' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='virtual'>Virtual</SelectItem>
              <SelectItem value='in-person'>In-Person</SelectItem>
              <SelectItem value='hybrid'>Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='space-y-3'>
        <Label>Program Type *</Label>
        <RadioGroup
          value={programData.type}
          onValueChange={(value) =>
            setProgramData({ ...programData, type: value })
          }
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='self-paced' id='self-paced' />
            <Label htmlFor='self-paced'>
              Self-Paced (Students learn at their own speed)
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='live' id='live' />
            <Label htmlFor='live'>
              Live Sessions (Scheduled classes with real-time interaction)
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='blended' id='blended' />
            <Label htmlFor='blended'>
              Blended (Mix of self-paced content and live sessions)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='price'>Price (USD) *</Label>
          <Input
            id='price'
            type='number'
            value={programData.price}
            onChange={(e) =>
              setProgramData({ ...programData, price: e.target.value })
            }
            placeholder='299'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='duration'>Duration (weeks) *</Label>
          <Input
            id='duration'
            type='number'
            value={programData.duration}
            onChange={(e) =>
              setProgramData({ ...programData, duration: e.target.value })
            }
            placeholder='8'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='maxParticipants'>Max Students</Label>
          <Input
            id='maxParticipants'
            type='number'
            value={programData.maxParticipants}
            onChange={(e) =>
              setProgramData({
                ...programData,
                maxParticipants: e.target.value,
              })
            }
            placeholder='50'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='targetAudience'>Target Audience</Label>
        <Textarea
          id='targetAudience'
          value={programData.targetAudience}
          onChange={(e) =>
            setProgramData({ ...programData, targetAudience: e.target.value })
          }
          placeholder='Who is this program designed for? e.g., Marketing professionals, Small business owners, Career changers...'
          rows={2}
        />
      </div>

      <div className='space-y-4'>
        <Label>Learning Outcomes (What will students achieve?)</Label>
        {programData.learningOutcomes.map((outcome: string, index: number) => (
          <div key={index} className='flex items-center space-x-2'>
            <Input
              placeholder={`Learning outcome ${index + 1}`}
              value={outcome}
              onChange={(e) => updateLearningOutcome(index, e.target.value)}
            />
            {programData.learningOutcomes.length > 1 && (
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={() => removeLearningOutcome(index)}
              >
                ×
              </Button>
            )}
          </div>
        ))}
        <Button
          type='button'
          variant='outline'
          onClick={addLearningOutcome}
          className='w-full bg-transparent'
        >
          + Add Learning Outcome
        </Button>
      </div>

      <div className='flex justify-between pt-6'>
        <Button variant='outline' onClick={onPrev}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
        >
          Next: Configure LMS
          <ArrowRight className='h-4 w-4 ml-2' />
        </Button>
      </div>
    </div>
  )
}

// Step 3: LMS Setup
function LMSSetupStep({ lmsSettings, setLmsSettings, onNext, onPrev }: any) {
  return (
    <div className='space-y-6'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold mb-2'>
          Configure Your Learning Management System
        </h2>
        <p className='text-gray-600'>
          Set up features and controls for your training program
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Award className='h-5 w-5 text-[#FFD500]' />
              Student Features
            </CardTitle>
            <CardDescription>
              Configure what students can access and do
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label>Issue Certificates</Label>
                <p className='text-sm text-gray-500'>
                  Automatically issue completion certificates
                </p>
              </div>
              <Checkbox
                checked={lmsSettings.enableCertificates}
                onCheckedChange={(checked) =>
                  setLmsSettings({
                    ...lmsSettings,
                    enableCertificates: checked,
                  })
                }
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <Label>Discussion Forums</Label>
                <p className='text-sm text-gray-500'>
                  Allow students to discuss and ask questions
                </p>
              </div>
              <Checkbox
                checked={lmsSettings.enableDiscussions}
                onCheckedChange={(checked) =>
                  setLmsSettings({ ...lmsSettings, enableDiscussions: checked })
                }
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <Label>Download Materials</Label>
                <p className='text-sm text-gray-500'>
                  Let students download course materials
                </p>
              </div>
              <Checkbox
                checked={lmsSettings.allowDownloads}
                onCheckedChange={(checked) =>
                  setLmsSettings({ ...lmsSettings, allowDownloads: checked })
                }
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <Label>Progress Tracking</Label>
                <p className='text-sm text-gray-500'>
                  Track and display student progress
                </p>
              </div>
              <Checkbox
                checked={lmsSettings.trackProgress}
                onCheckedChange={(checked) =>
                  setLmsSettings({ ...lmsSettings, trackProgress: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5 text-[#FFD500]' />
              Assessment Tools
            </CardTitle>
            <CardDescription>
              Enable different types of assessments
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label>Quizzes & Tests</Label>
                <p className='text-sm text-gray-500'>
                  Create interactive quizzes and tests
                </p>
              </div>
              <Checkbox
                checked={lmsSettings.enableQuizzes}
                onCheckedChange={(checked) =>
                  setLmsSettings({ ...lmsSettings, enableQuizzes: checked })
                }
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <Label>Assignments</Label>
                <p className='text-sm text-gray-500'>
                  Assign projects and homework
                </p>
              </div>
              <Checkbox
                checked={lmsSettings.enableAssignments}
                onCheckedChange={(checked) =>
                  setLmsSettings({ ...lmsSettings, enableAssignments: checked })
                }
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <Label>Manual Approval</Label>
                <p className='text-sm text-gray-500'>
                  Manually approve student enrollments
                </p>
              </div>
              <Checkbox
                checked={lmsSettings.requireApproval}
                onCheckedChange={(checked) =>
                  setLmsSettings({ ...lmsSettings, requireApproval: checked })
                }
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <Label>Email Notifications</Label>
                <p className='text-sm text-gray-500'>
                  Send progress and announcement emails
                </p>
              </div>
              <Checkbox
                checked={lmsSettings.sendNotifications}
                onCheckedChange={(checked) =>
                  setLmsSettings({ ...lmsSettings, sendNotifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='bg-blue-50 border-blue-200'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Lightbulb className='h-5 w-5 text-blue-600' />
            LMS Features Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div>
              <h4 className='font-medium mb-2'>Content Management</h4>
              <ul className='space-y-1 text-gray-600'>
                <li>• Upload videos, documents, and presentations</li>
                <li>• Create interactive lessons and modules</li>
                <li>• Schedule content release dates</li>
                <li>• Organize content in logical sequences</li>
              </ul>
            </div>
            <div>
              <h4 className='font-medium mb-2'>Student Management</h4>
              <ul className='space-y-1 text-gray-600'>
                <li>• Track individual student progress</li>
                <li>• Send personalized messages</li>
                <li>• Generate progress reports</li>
                <li>• Manage enrollments and access</li>
              </ul>
            </div>
            <div>
              <h4 className='font-medium mb-2'>Analytics & Insights</h4>
              <ul className='space-y-1 text-gray-600'>
                <li>• View engagement metrics</li>
                <li>• Track completion rates</li>
                <li>• Monitor student activity</li>
                <li>• Export detailed reports</li>
              </ul>
            </div>
            <div>
              <h4 className='font-medium mb-2'>Communication Tools</h4>
              <ul className='space-y-1 text-gray-600'>
                <li>• Send announcements to all students</li>
                <li>• Moderate discussion forums</li>
                <li>• Provide feedback on assignments</li>
                <li>• Schedule live Q&A sessions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-between pt-6'>
        <Button variant='outline' onClick={onPrev}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
        <Button
          onClick={onNext}
          className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
        >
          Next: Review & Launch
          <ArrowRight className='h-4 w-4 ml-2' />
        </Button>
      </div>
    </div>
  )
}

// Step 4: Launch
function LaunchStep({
  profileData,
  programData,
  lmsSettings,
  onComplete,
  onPrev,
  isLoading,
}: any) {
  return (
    <div className='space-y-6'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold mb-2'>Ready to Launch!</h2>
        <p className='text-gray-600'>
          Review your setup and launch your training program
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5 text-[#FFD500]' />
              Trainer Profile
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div>
              <Label className='text-sm font-medium'>Name</Label>
              <p className='text-sm text-gray-600'>{profileData.name}</p>
            </div>
            <div>
              <Label className='text-sm font-medium'>Title</Label>
              <p className='text-sm text-gray-600'>{profileData.title}</p>
            </div>
            <div>
              <Label className='text-sm font-medium'>Expertise</Label>
              <div className='flex flex-wrap gap-1 mt-1'>
                {profileData.expertise.slice(0, 3).map((skill: string) => (
                  <Badge key={skill} variant='secondary' className='text-xs'>
                    {skill}
                  </Badge>
                ))}
                {profileData.expertise.length > 3 && (
                  <Badge variant='secondary' className='text-xs'>
                    +{profileData.expertise.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <Label className='text-sm font-medium'>Languages</Label>
              <p className='text-sm text-gray-600'>
                {profileData.languages.join(', ') || 'Not specified'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BookOpen className='h-5 w-5 text-[#FFD500]' />
              Training Program
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div>
              <Label className='text-sm font-medium'>Title</Label>
              <p className='text-sm text-gray-600'>{programData.title}</p>
            </div>
            <div>
              <Label className='text-sm font-medium'>Category & Level</Label>
              <p className='text-sm text-gray-600'>
                {programData.category} • {programData.level}
              </p>
            </div>
            <div>
              <Label className='text-sm font-medium'>Format & Type</Label>
              <p className='text-sm text-gray-600'>
                {programData.format} • {programData.type}
              </p>
            </div>
            <div className='grid grid-cols-3 gap-2'>
              <div>
                <Label className='text-sm font-medium'>Price</Label>
                <p className='text-sm text-gray-600'>${programData.price}</p>
              </div>
              <div>
                <Label className='text-sm font-medium'>Duration</Label>
                <p className='text-sm text-gray-600'>
                  {programData.duration} weeks
                </p>
              </div>
              <div>
                <Label className='text-sm font-medium'>Max Students</Label>
                <p className='text-sm text-gray-600'>
                  {programData.maxParticipants || 'Unlimited'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5 text-[#FFD500]' />
            LMS Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              { key: 'enableCertificates', label: 'Certificates' },
              { key: 'enableDiscussions', label: 'Discussions' },
              { key: 'enableQuizzes', label: 'Quizzes' },
              { key: 'enableAssignments', label: 'Assignments' },
              { key: 'allowDownloads', label: 'Downloads' },
              { key: 'trackProgress', label: 'Progress Tracking' },
              { key: 'requireApproval', label: 'Manual Approval' },
              { key: 'sendNotifications', label: 'Notifications' },
            ].map((setting) => (
              <div key={setting.key} className='flex items-center gap-2'>
                <div
                  className={`w-3 h-3 rounded-full ${
                    lmsSettings[setting.key] ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <span className='text-sm'>{setting.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className='bg-green-50 border-green-200'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            What Happens Next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3 text-sm'>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                <span className='text-xs font-medium text-green-600'>1</span>
              </div>
              <div>
                <p className='font-medium'>
                  Your trainer profile will be created
                </p>
                <p className='text-gray-600'>
                  Students can discover you and your expertise
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                <span className='text-xs font-medium text-green-600'>2</span>
              </div>
              <div>
                <p className='font-medium'>
                  Your program will be set up in the LMS
                </p>
                <p className='text-gray-600'>
                  You can start adding content, modules, and lessons
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                <span className='text-xs font-medium text-green-600'>3</span>
              </div>
              <div>
                <p className='font-medium'>Access your trainer dashboard</p>
                <p className='text-gray-600'>
                  Manage programs, track students, and view analytics
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                <span className='text-xs font-medium text-green-600'>4</span>
              </div>
              <div>
                <p className='font-medium'>Start accepting students</p>
                <p className='text-gray-600'>
                  Your program will be listed and ready for enrollment
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-between pt-6'>
        <Button variant='outline' onClick={onPrev} disabled={isLoading}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
        <Button
          onClick={onComplete}
          disabled={isLoading}
          className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
        >
          {isLoading ? (
            <>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2' />
              Setting up your account...
            </>
          ) : (
            <>
              Launch My Training Program
              <Play className='h-4 w-4 ml-2' />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
