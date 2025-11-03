"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, Calendar, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MentorOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expertise: [] as string[],
    industry: "",
    experience: "",
    mentorshipStyle: [] as string[],
    bio: "",
    achievements: "",
    availability: [] as string[],
    linkedinUrl: "",
    twitterUrl: "",
    instagramUrl: "",
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

  const toggleMentorshipStyle = (style: string) => {
    setFormData((prev) => {
      const currentStyles = [...prev.mentorshipStyle]
      if (currentStyles.includes(style)) {
        return { ...prev, mentorshipStyle: currentStyles.filter((s) => s !== style) }
      } else {
        return { ...prev, mentorshipStyle: [...currentStyles, style] }
      }
    })
  }

  const toggleAvailability = (day: string) => {
    setFormData((prev) => {
      const currentDays = [...prev.availability]
      if (currentDays.includes(day)) {
        return { ...prev, availability: currentDays.filter((d) => d !== day) }
      } else {
        return { ...prev, availability: [...currentDays, day] }
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
    router.push("/mentor/dashboard")
  }

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
            <h1 className="text-2xl md:text-3xl font-bold">Become a Mentor</h1>
            <div className="text-sm font-medium">Step {step} of 5</div>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div
              className="bg-[#FFD500] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="border-none shadow-lg rounded-xl">
          <CardContent className="p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
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
                      <Label htmlFor="industry">Primary Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) => updateFormData("experience", value)}
                      >
                        <SelectTrigger id="experience">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10-15">10-15 years</SelectItem>
                          <SelectItem value="15-plus">15+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Your Expertise</h2>

                <div className="space-y-4">
                  <Label>Areas of Expertise (Select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <Button
                      type="button"
                      variant={formData.expertise.includes("business-strategy") ? "default" : "outline"}
                      className={formData.expertise.includes("business-strategy") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleExpertise("business-strategy")}
                    >
                      Business Strategy
                    </Button>
                    <Button
                      type="button"
                      variant={formData.expertise.includes("fundraising") ? "default" : "outline"}
                      className={formData.expertise.includes("fundraising") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleExpertise("fundraising")}
                    >
                      Fundraising
                    </Button>
                    <Button
                      type="button"
                      variant={formData.expertise.includes("marketing") ? "default" : "outline"}
                      className={formData.expertise.includes("marketing") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleExpertise("marketing")}
                    >
                      Marketing
                    </Button>
                    <Button
                      type="button"
                      variant={formData.expertise.includes("product-development") ? "default" : "outline"}
                      className={formData.expertise.includes("product-development") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleExpertise("product-development")}
                    >
                      Product Development
                    </Button>
                    <Button
                      type="button"
                      variant={formData.expertise.includes("operations") ? "default" : "outline"}
                      className={formData.expertise.includes("operations") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleExpertise("operations")}
                    >
                      Operations
                    </Button>
                    <Button
                      type="button"
                      variant={formData.expertise.includes("leadership") ? "default" : "outline"}
                      className={formData.expertise.includes("leadership") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleExpertise("leadership")}
                    >
                      Leadership
                    </Button>
                    <Button
                      type="button"
                      variant={formData.expertise.includes("sales") ? "default" : "outline"}
                      className={formData.expertise.includes("sales") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleExpertise("sales")}
                    >
                      Sales
                    </Button>
                    <Button
                      type="button"
                      variant={formData.expertise.includes("finance") ? "default" : "outline"}
                      className={formData.expertise.includes("finance") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleExpertise("finance")}
                    >
                      Finance
                    </Button>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label>Preferred Mentorship Style (Select all that apply)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      <Button
                        type="button"
                        variant={formData.mentorshipStyle.includes("one-on-one") ? "default" : "outline"}
                        className={formData.mentorshipStyle.includes("one-on-one") ? "bg-[#FFD500] text-black" : ""}
                        onClick={() => toggleMentorshipStyle("one-on-one")}
                      >
                        1:1 Sessions
                      </Button>
                      <Button
                        type="button"
                        variant={formData.mentorshipStyle.includes("group") ? "default" : "outline"}
                        className={formData.mentorshipStyle.includes("group") ? "bg-[#FFD500] text-black" : ""}
                        onClick={() => toggleMentorshipStyle("group")}
                      >
                        Group Sessions
                      </Button>
                      <Button
                        type="button"
                        variant={formData.mentorshipStyle.includes("workshop") ? "default" : "outline"}
                        className={formData.mentorshipStyle.includes("workshop") ? "bg-[#FFD500] text-black" : ""}
                        onClick={() => toggleMentorshipStyle("workshop")}
                      >
                        Workshops
                      </Button>
                      <Button
                        type="button"
                        variant={formData.mentorshipStyle.includes("course") ? "default" : "outline"}
                        className={formData.mentorshipStyle.includes("course") ? "bg-[#FFD500] text-black" : ""}
                        onClick={() => toggleMentorshipStyle("course")}
                      >
                        Courses
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Your Profile</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateFormData("bio", e.target.value)}
                      placeholder="Tell us about your professional background and experience..."
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
                      placeholder="Share your biggest professional achievements (e.g., 'Scaled 3 businesses to 7-figures', 'Raised $10M for startups')"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="p-4 bg-[#f8f8f8] rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Upload className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Upload Profile Photo</p>
                        <p className="text-sm text-gray-500">Professional headshot recommended (JPG, PNG)</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Choose File
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Social Media & Website</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium w-24">LinkedIn:</span>
                        <Input
                          value={formData.linkedinUrl}
                          onChange={(e) => updateFormData("linkedinUrl", e.target.value)}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium w-24">Twitter:</span>
                        <Input
                          value={formData.twitterUrl}
                          onChange={(e) => updateFormData("twitterUrl", e.target.value)}
                          placeholder="https://twitter.com/yourhandle"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium w-24">Website:</span>
                        <Input
                          value={formData.websiteUrl}
                          onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Availability & Scheduling</h2>

                <div className="space-y-4">
                  <Label>Available Days (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    <Button
                      type="button"
                      variant={formData.availability.includes("monday") ? "default" : "outline"}
                      className={formData.availability.includes("monday") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleAvailability("monday")}
                    >
                      Monday
                    </Button>
                    <Button
                      type="button"
                      variant={formData.availability.includes("tuesday") ? "default" : "outline"}
                      className={formData.availability.includes("tuesday") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleAvailability("tuesday")}
                    >
                      Tuesday
                    </Button>
                    <Button
                      type="button"
                      variant={formData.availability.includes("wednesday") ? "default" : "outline"}
                      className={formData.availability.includes("wednesday") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleAvailability("wednesday")}
                    >
                      Wednesday
                    </Button>
                    <Button
                      type="button"
                      variant={formData.availability.includes("thursday") ? "default" : "outline"}
                      className={formData.availability.includes("thursday") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleAvailability("thursday")}
                    >
                      Thursday
                    </Button>
                    <Button
                      type="button"
                      variant={formData.availability.includes("friday") ? "default" : "outline"}
                      className={formData.availability.includes("friday") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleAvailability("friday")}
                    >
                      Friday
                    </Button>
                    <Button
                      type="button"
                      variant={formData.availability.includes("saturday") ? "default" : "outline"}
                      className={formData.availability.includes("saturday") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleAvailability("saturday")}
                    >
                      Saturday
                    </Button>
                    <Button
                      type="button"
                      variant={formData.availability.includes("sunday") ? "default" : "outline"}
                      className={formData.availability.includes("sunday") ? "bg-[#FFD500] text-black" : ""}
                      onClick={() => toggleAvailability("sunday")}
                    >
                      Sunday
                    </Button>
                  </div>

                  <div className="p-6 bg-[#f8f8f8] rounded-lg border border-gray-200 mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Calendar Integration</p>
                        <p className="text-sm text-gray-500">Connect your calendar to manage availability</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="h-5 w-5">
                          <path
                            d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z"
                            fill="#4285F4"
                          ></path>
                          <path
                            d="M12 21a8.6 8.6 0 0 0 5.96-2.18l-2.91-2.26a5.4 5.4 0 0 1-8.09-2.85h-3v2.33A9 9 0 0 0 12 21z"
                            fill="#34A853"
                          ></path>
                          <path
                            d="M6.96 13.71a5.41 5.41 0 0 1 0-3.42V7.96h-3a9 9 0 0 0 0 8.08l3-2.33z"
                            fill="#FBBC05"
                          ></path>
                          <path
                            d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 0 0 3.96 7.95l3 2.34A5.36 5.36 0 0 1 12 6.58z"
                            fill="#EA4335"
                          ></path>
                        </svg>
                        Google Calendar
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-500">
                          <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        Outlook Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Commission Structure & Programs</h2>

                <div className="space-y-6">
                  <div className="bg-[#f8f8f8] p-6 rounded-lg border border-gray-200">
                    <h3 className="font-bold mb-4">Commission Tiers</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      The more sessions you conduct, the lower our commission rates. Here's how it works:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                        <p className="text-sm font-medium">Bronze</p>
                        <p className="text-xl font-bold my-1">25%</p>
                        <p className="text-xs text-gray-500">0-10 sessions</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                        <p className="text-sm font-medium">Silver</p>
                        <p className="text-xl font-bold my-1">20%</p>
                        <p className="text-xs text-gray-500">11-30 sessions</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                        <p className="text-sm font-medium">Gold</p>
                        <p className="text-xl font-bold my-1">15%</p>
                        <p className="text-xs text-gray-500">31-75 sessions</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                        <p className="text-sm font-medium">Platinum</p>
                        <p className="text-xl font-bold my-1">10%</p>
                        <p className="text-xs text-gray-500">76+ sessions</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8f8f8] p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-bold">Program Creation</h3>
                        <p className="text-sm text-gray-500">
                          After approval, you'll be able to create your own mentorship programs
                        </p>
                      </div>
                    </div>

                    <Tabs defaultValue="one-on-one" className="mt-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="one-on-one">1:1 Programs</TabsTrigger>
                        <TabsTrigger value="group">Group Programs</TabsTrigger>
                      </TabsList>
                      <TabsContent value="one-on-one" className="p-4 bg-white rounded-lg mt-2">
                        <p className="text-sm text-gray-600 mb-4">
                          Create personalized 1:1 mentorship programs with the following recommendations:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Include 1-2 free sessions to attract mentees
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Set your own pricing (recommended: $100-$300 per session)
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Create structured programs with 4-8 sessions
                          </li>
                        </ul>
                      </TabsContent>
                      <TabsContent value="group" className="p-4 bg-white rounded-lg mt-2">
                        <p className="text-sm text-gray-600 mb-4">
                          Create group mentorship programs with the following recommendations:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Include a free introductory session
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Set group size limits (recommended: 5-15 participants)
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Price competitively (recommended: $50-$150 per participant per session)
                          </li>
                        </ul>
                      </TabsContent>
                    </Tabs>
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
                <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <div></div>
              )}

              {step < 5 ? (
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
