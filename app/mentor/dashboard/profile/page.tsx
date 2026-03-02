"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
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
import { getCurrentUserDetails } from "@/lib/current-user"
import { useToast } from "@/hooks/use-toast"
import { ApiError, apiClient } from "@/lib/api-client"
import { mentorApi } from "@/lib/mentor"

const asObject = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>
  }

  return null
}

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim()
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value)
    }
  }

  return null
}

const pickNumber = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value
    }

    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number(value)

      if (!Number.isNaN(parsed)) {
        return parsed
      }
    }
  }

  return null
}

const pickStringArray = (...values: unknown[]) => {
  for (const value of values) {
    if (!Array.isArray(value)) {
      continue
    }

    const mapped = value
      .map((item) => pickString(item))
      .filter((item): item is string => Boolean(item))

    if (mapped.length > 0) {
      return mapped
    }
  }

  return []
}

type MentorProfileViewModel = {
  mentorId: string | null
  profileData: {
    name: string
    company: string
    email: string
    bio: string
    achievements: string
    linkedin: string
    twitter: string
    website: string
  }
  selectedSector: string
  selectedSkills: string[]
  revenueGoal: string
  impactGoal: string
}

const mapAuthMeToProfileViewModel = (payload: unknown): MentorProfileViewModel => {
  const root = asObject(payload)
  const dataRecord = asObject(root?.data)
  const userRecord =
    asObject(root?.user) ??
    asObject(dataRecord?.user) ??
    dataRecord ??
    root ??
    {}
  const profileRecord =
    asObject(userRecord.profile) ??
    asObject(userRecord.mentorProfile) ??
    asObject(userRecord.mentor_profile) ??
    asObject(dataRecord?.profile) ??
    asObject(dataRecord?.mentorProfile) ??
    {}

  const mentorId =
    pickString(
      userRecord.id,
      userRecord.userId,
      userRecord.mentorId,
      profileRecord.id,
      profileRecord.mentorId,
      dataRecord?.id,
    ) ?? null
  const name =
    pickString(
      userRecord.name,
      userRecord.fullName,
      profileRecord.name,
      profileRecord.fullName,
    ) ?? ""
  const company =
    pickString(
      profileRecord.company,
      profileRecord.companyName,
      userRecord.company,
      userRecord.companyName,
    ) ?? ""
  const email =
    pickString(profileRecord.email, userRecord.email, userRecord.upn) ?? ""
  const bio = pickString(profileRecord.bio, userRecord.bio) ?? ""
  const achievements =
    pickString(profileRecord.achievements, userRecord.achievements) ?? ""
  const linkedin =
    pickString(profileRecord.linkedin, profileRecord.linkedinUrl, userRecord.linkedin) ??
    ""
  const twitter =
    pickString(profileRecord.twitter, profileRecord.twitterUrl, userRecord.twitter) ??
    ""
  const website =
    pickString(profileRecord.website, profileRecord.websiteUrl, userRecord.website) ??
    ""
  const selectedSector =
    pickString(
      profileRecord.sector,
      profileRecord.primarySector,
      Array.isArray(profileRecord.sectors) ? profileRecord.sectors[0] : null,
    ) ?? ""
  const selectedSkills = pickStringArray(
    profileRecord.skillsCapabilities,
    profileRecord.skills_capabilities,
    profileRecord.skills,
  )
  const revenueGoalValue = pickNumber(
    profileRecord.revenueGoal,
    profileRecord.revenue_goal,
  )
  const impactGoalValue = pickNumber(
    profileRecord.impactGoal,
    profileRecord.impact_goal,
  )

  return {
    mentorId,
    profileData: {
      name,
      company,
      email,
      bio,
      achievements,
      linkedin,
      twitter,
      website,
    },
    selectedSector,
    selectedSkills,
    revenueGoal: revenueGoalValue !== null ? String(revenueGoalValue) : "",
    impactGoal: impactGoalValue !== null ? String(impactGoalValue) : "",
  }
}

export default function MentorProfilePage() {
  const { toast } = useToast()
  const [mentorId, setMentorId] = useState<string | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedSector, setSelectedSector] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [revenueGoal, setRevenueGoal] = useState("")
  const [impactGoal, setImpactGoal] = useState("")
  const [profileData, setProfileData] = useState({
    name: "",
    company: "",
    email: "",
    bio: "",
    achievements: "",
    linkedin: "",
    twitter: "",
    website: "",
  })

  const loadProfileFromAuthMe = useCallback(async (options?: { showErrorToast?: boolean }) => {
    const showErrorToast = options?.showErrorToast ?? true
    setIsProfileLoading(true)

    try {
      const response = await apiClient.get<unknown>("/auth/me")
      const mapped = mapAuthMeToProfileViewModel(response)
      const fallbackUser = getCurrentUserDetails()

      setMentorId(mapped.mentorId ?? fallbackUser.id)
      setProfileData((prev) => ({
        ...prev,
        ...mapped.profileData,
        name: mapped.profileData.name || fallbackUser.name || prev.name,
        email: mapped.profileData.email || fallbackUser.email || prev.email,
      }))
      setSelectedSector(mapped.selectedSector)
      setSelectedSkills(mapped.selectedSkills)
      setRevenueGoal(mapped.revenueGoal)
      setImpactGoal(mapped.impactGoal)
      return true
    } catch (error) {
      const fallbackUser = getCurrentUserDetails()
      setMentorId(fallbackUser.id)
      setProfileData((prev) => ({
        ...prev,
        name: fallbackUser.name ?? prev.name,
        email: fallbackUser.email ?? prev.email,
      }))

      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to load profile."

      if (showErrorToast) {
        toast({
          title: "Unable to load profile",
          description: message,
          variant: "destructive",
        })
      }
      return false
    } finally {
      setIsProfileLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void loadProfileFromAuthMe({ showErrorToast: true })
  }, [loadProfileFromAuthMe])

  const avatarInitials = useMemo(() => {
    const initials = profileData.name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2)

    return initials || "P"
  }, [profileData.name])

  const updateProfileField = (field: keyof typeof profileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    if (!mentorId) {
      toast({
        title: "Unable to save profile",
        description: "Mentor account could not be resolved. Please sign in again.",
        variant: "destructive",
      })
      return
    }

    const normalizedRevenueGoal = Number(revenueGoal)
    const normalizedImpactGoal = Number(impactGoal)

    const payload = {
      name: profileData.name.trim(),
      fullName: profileData.name.trim(),
      email: profileData.email.trim(),
      company: profileData.company.trim(),
      companyName: profileData.company.trim(),
      bio: profileData.bio.trim(),
      achievements: profileData.achievements.trim(),
      sector: selectedSector || undefined,
      sectors: selectedSector ? [selectedSector] : [],
      skillsCapabilities: selectedSkills,
      revenueGoal:
        Number.isFinite(normalizedRevenueGoal) && normalizedRevenueGoal > 0
          ? normalizedRevenueGoal
          : undefined,
      impactGoal:
        Number.isFinite(normalizedImpactGoal) && normalizedImpactGoal > 0
          ? normalizedImpactGoal
          : undefined,
      linkedinUrl: profileData.linkedin.trim(),
      twitterUrl: profileData.twitter.trim(),
      websiteUrl: profileData.website.trim(),
    }

    setIsSaving(true)
    try {
      await mentorApi.updateMentorProfile(mentorId, payload)
      const refreshed = await loadProfileFromAuthMe({ showErrorToast: false })

      if (refreshed) {
        toast({
          title: "Profile updated",
          description: "Your profile has been saved successfully.",
        })
      } else {
        toast({
          title: "Profile updated",
          description:
            "Profile was saved, but we could not refresh latest profile data.",
        })
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to save mentor profile."

      toast({
        title: "Unable to save profile",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full">
      <DashboardHeader
        title="Profile"
        description="Manage your profile information"
      />

      <div className="w-full space-y-4 md:px-6 md:pt-8 md:pb-8">
      {isProfileLoading ? (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Loading profile...
        </div>
      ) : null}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback>{avatarInitials}</AvatarFallback>
            </Avatar>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => updateProfileField("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={profileData.company}
                onChange={(e) => updateProfileField("company", e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => updateProfileField("email", e.target.value)}
              />
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
            <Textarea
              id="bio"
              rows={6}
              value={profileData.bio}
              onChange={(e) => updateProfileField("bio", e.target.value)}
              placeholder="Tell others about your background and expertise"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="achievements">Key Achievements</Label>
            <Textarea
              id="achievements"
              rows={4}
              value={profileData.achievements}
              onChange={(e) =>
                updateProfileField("achievements", e.target.value)
              }
              placeholder="Share major career milestones"
            />
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
            <Input
              id="linkedin"
              type="url"
              value={profileData.linkedin}
              onChange={(e) => updateProfileField("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              type="url"
              value={profileData.twitter}
              onChange={(e) => updateProfileField("twitter", e.target.value)}
              placeholder="https://twitter.com/yourhandle"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={profileData.website}
              onChange={(e) => updateProfileField("website", e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          disabled={isSaving || isProfileLoading}
        >
          Cancel
        </Button>
        <Button
          className="w-full sm:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000]"
          onClick={() => {
            void handleSaveProfile()
          }}
          disabled={isSaving || isProfileLoading}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      </div>
    </div>
  )
}

