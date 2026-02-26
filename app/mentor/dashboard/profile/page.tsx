"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Target, TrendingUp } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SECTORS, SKILLS_CAPABILITIES } from "@/lib/constants/onboarding"
import { DashboardHeader } from "@/components/dashboard-header"

export default function MentorProfilePage() {
  const [selectedSector, setSelectedSector] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [revenueGoal, setRevenueGoal] = useState("")
  const [impactGoal, setImpactGoal] = useState("")
  return (
    <div className="w-full">
      <DashboardHeader
        title="Profile"
        description="Manage your profile information"
      />

      <div className="w-full space-y-4 md:px-6 md:pt-8 md:pb-8">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Sarah Johnson" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" defaultValue="Business Growth Inc." />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="sarah@example.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Professional Bio</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Tell others about your professional background</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={6} defaultValue="Experienced business mentor with 15+ years..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="achievements">Key Achievements</Label>
            <Textarea id="achievements" rows={4} defaultValue="Scaled 3 businesses to 7-figures..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Sector & Skills</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Select your sector and key skills/capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder="Select your sector" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Skills & Capabilities</Label>
            <MultiSelect
              options={SKILLS_CAPABILITIES.map((skill) => ({ value: skill, label: skill }))}
              selected={selectedSkills}
              onSelectionChange={setSelectedSkills}
              placeholder="Select your skills"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="h-4 w-4 sm:h-5 sm:w-5" />
            Goals
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Set your revenue and impact goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue-goal" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Revenue Goal
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                <Input
                  id="revenue-goal"
                  type="number"
                  value={revenueGoal}
                  onChange={(e) => setRevenueGoal(e.target.value)}
                  placeholder="0"
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-muted-foreground">How much revenue do you plan on making?</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="impact-goal" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Impact Goal
              </Label>
              <Input
                id="impact-goal"
                type="number"
                value={impactGoal}
                onChange={(e) => setImpactGoal(e.target.value)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">How many people do you want to train?</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Social Media & Website</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Add your social media profiles and website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input id="twitter" type="url" placeholder="https://twitter.com/yourhandle" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="url" placeholder="https://yourwebsite.com" />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
        <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
        <Button className="w-full sm:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000]">Save Changes</Button>
      </div>
      </div>
    </div>
  )
}

