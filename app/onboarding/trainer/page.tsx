"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function TrainerOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    industry: "",
    experience: "",
    expertise: [] as string[],
    bio: "",
    achievements: "",
    linkedinUrl: "",
    websiteUrl: "",
  })

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleExpertise = (area: string) => {
    setFormData((prev) => {
      const currentAreas = [...prev.expertise]
      if (currentAreas.includes(area)) {
        return { ...prev, expertise: currentAreas.filter((a) => a !== area) }
      } else {
        return { ...prev, expertise: [...currentAreas, area] }
      }
    })
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the data to your backend
    router.push("/trainer/dashboard")
  }

  const expertiseOptions = [
    "Digital Marketing",
    "Business Strategy",
    "Leadership",
    "Product Management",
    "Data Science",
    "Software Development",
    "UX/UI Design",
    "Sales",
    "Finance",
    "Operations",
    "HR",
    "Project Management",
    "Entrepreneurship",
    "E-commerce",
    "Content Marketing",
    "SEO",
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Become a Trainer</h1>
            <div className="text-sm font-medium">Step {step} of 3</div>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div
              className="bg-[#FFD500] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="border-none shadow-lg rounded-xl">
          <CardContent className="p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Personal Information</h2>
                  <p className="text-gray-600">Tell us about yourself</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => updateFormData("title", e.target.value)}
                        placeholder="e.g., Senior Digital Marketing Manager"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Primary Industry *</Label>
                      <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience *</Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) => updateFormData("experience", value)}
                      >
                        <SelectTrigger id="experience">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="4-7">4-7 years</SelectItem>
                          <SelectItem value="8-12">8-12 years</SelectItem>
                          <SelectItem value="13-20">13-20 years</SelectItem>
                          <SelectItem value="20+">20+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Your Expertise</h2>
                  <p className="text-gray-600">What areas do you train in?</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Areas of Expertise * (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                      {expertiseOptions.map((skill) => (
                        <Button
                          key={skill}
                          type="button"
                          variant={formData.expertise.includes(skill) ? "default" : "outline"}
                          size="sm"
                          className={formData.expertise.includes(skill) ? "bg-[#FFD500] text-black" : ""}
                          onClick={() => toggleExpertise(skill)}
                        >
                          {skill}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateFormData("bio", e.target.value)}
                      placeholder="Tell us about your background, experience, and what makes you a great trainer..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="achievements">Key Achievements</Label>
                    <Textarea
                      id="achievements"
                      value={formData.achievements}
                      onChange={(e) => updateFormData("achievements", e.target.value)}
                      placeholder="Share your biggest professional achievements (e.g., 'Trained 500+ professionals', 'Built 3 successful programs')"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Complete Your Profile</h2>
                  <p className="text-gray-600">Add your social links and confirm</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                    <Input
                      id="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={(e) => updateFormData("linkedinUrl", e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website (Optional)</Label>
                    <Input
                      id="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                    <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Your trainer profile will be created and visible to learners</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Access your trainer dashboard to create your first program</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Set up your LMS and start teaching</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to Mentwork's{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#FFD500] text-black hover:bg-[#e6c000] flex items-center gap-2"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-[#FFD500] text-black hover:bg-[#e6c000] flex items-center gap-2"
                >
                  Complete Registration <CheckCircle2 className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
