"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Save, User, Briefcase, Award, Globe, Linkedin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  SECTORS,
  SKILLS_CAPABILITIES,
  getSkillsForSectors,
  getSkillsGroupedBySector,
} from "@/lib/constants/onboarding";
import { getCurrentUserDetails } from "@/lib/current-user";
import { ApiError, apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

const INDUSTRY_OPTIONS = [
  "technology",
  "finance",
  "healthcare",
  "education",
  "marketing",
  "business",
  "other",
] as const;

const asObject = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }

  return null;
};

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return null;
};

const pickStringArray = (...values: unknown[]) => {
  for (const value of values) {
    if (!Array.isArray(value)) {
      continue;
    }

    const mapped = value
      .map((item) => pickString(item))
      .filter((item): item is string => Boolean(item));

    if (mapped.length > 0) {
      return mapped;
    }
  }

  return [] as string[];
};

const normalizeIndustry = (value: string | null) => {
  if (!value) {
    return "";
  }

  const normalizedValue = value.toLowerCase().trim();

  if (
    (INDUSTRY_OPTIONS as readonly string[]).includes(normalizedValue)
  ) {
    return normalizedValue;
  }

  return "other";
};

const normalizeExperience = (value: string | null) => {
  if (!value) {
    return "";
  }

  const normalizedValue = value.trim();
  const mappedByRange: Record<string, string> = {
    "1": "1-3",
    "2": "1-3",
    "3": "1-3",
    "4": "4-7",
    "5": "4-7",
    "6": "4-7",
    "7": "4-7",
    "8": "8-12",
    "9": "8-12",
    "10": "8-12",
    "11": "8-12",
    "12": "8-12",
    "13": "13-20",
    "14": "13-20",
    "15": "13-20",
    "16": "13-20",
    "17": "13-20",
    "18": "13-20",
    "19": "13-20",
    "20": "13-20",
  };

  if (mappedByRange[normalizedValue]) {
    return mappedByRange[normalizedValue];
  }

  if (
    normalizedValue === "1-3" ||
    normalizedValue === "4-7" ||
    normalizedValue === "8-12" ||
    normalizedValue === "13-20" ||
    normalizedValue === "20+"
  ) {
    return normalizedValue;
  }

  return "";
};

const normalizeSectorIds = (values: string[]) => {
  return values
    .map((value) => {
      const normalized = value.toLowerCase().trim();
      const matchedById = SECTORS.find(
        (sector) => sector.id.toLowerCase() === normalized,
      );
      if (matchedById) {
        return matchedById.id;
      }

      const matchedByName = SECTORS.find(
        (sector) => sector.name.toLowerCase() === normalized,
      );
      if (matchedByName) {
        return matchedByName.id;
      }

      return null;
    })
    .filter((value): value is string => Boolean(value));
};

const mapTrainerProfileResponse = (
  payload: unknown,
  fallbackName: string,
  fallbackEmail: string,
) => {
  const root = asObject(payload);
  const dataRecord = asObject(root?.data);
  const trainerRecord =
    asObject(root?.trainer) ??
    asObject(dataRecord?.trainer) ??
    dataRecord ??
    root ??
    {};
  const profileRecord =
    asObject(trainerRecord.profile) ??
    asObject(trainerRecord.trainerProfile) ??
    asObject(trainerRecord.trainer_profile) ??
    {};

  const name =
    pickString(
      trainerRecord.name,
      trainerRecord.fullName,
      profileRecord.name,
      profileRecord.fullName,
    ) ?? fallbackName;
  const email =
    pickString(trainerRecord.email, profileRecord.email) ?? fallbackEmail;
  const title =
    pickString(
      trainerRecord.title,
      profileRecord.title,
      profileRecord.professionalTitle,
      profileRecord.designation,
    ) ?? "";
  const industry = normalizeIndustry(
    pickString(
      trainerRecord.industry,
      profileRecord.industry,
      profileRecord.primaryIndustry,
    ),
  );
  const experience = normalizeExperience(
    pickString(
      trainerRecord.experience,
      profileRecord.experience,
      profileRecord.yearsOfExperience,
      profileRecord.experienceYears,
    ),
  );
  const selectedSectors = normalizeSectorIds(
    pickStringArray(
      trainerRecord.sectors,
      trainerRecord.selectedSectors,
      profileRecord.sectors,
      profileRecord.selectedSectors,
    ),
  );
  const selectedSubSectorSkills = pickStringArray(
    trainerRecord.subSectorSkills,
    trainerRecord.sub_sector_skills,
    trainerRecord.selectedSubSectorSkills,
    profileRecord.subSectorSkills,
    profileRecord.sub_sector_skills,
    profileRecord.selectedSubSectorSkills,
  );
  const selectedSkillsCapabilities = pickStringArray(
    trainerRecord.skillsCapabilities,
    trainerRecord.skills_capabilities,
    trainerRecord.selectedSkillsCapabilities,
    profileRecord.skillsCapabilities,
    profileRecord.skills_capabilities,
    profileRecord.selectedSkillsCapabilities,
  );
  const bio = pickString(trainerRecord.bio, profileRecord.bio) ?? "";
  const achievements =
    pickString(trainerRecord.achievements, profileRecord.achievements) ?? "";
  const linkedinUrl =
    pickString(
      trainerRecord.linkedinUrl,
      trainerRecord.linkedin,
      profileRecord.linkedinUrl,
      profileRecord.linkedin,
    ) ?? "";
  const websiteUrl =
    pickString(
      trainerRecord.websiteUrl,
      trainerRecord.website,
      profileRecord.websiteUrl,
      profileRecord.website,
    ) ?? "";

  return {
    name,
    email,
    title,
    industry,
    experience,
    selectedSectors,
    selectedSubSectorSkills,
    selectedSkillsCapabilities,
    bio,
    achievements,
    linkedinUrl,
    websiteUrl,
  };
};

export default function TrainerProfilePage() {
  const { toast } = useToast();
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    industry: "",
    experience: "",
    selectedSectors: [] as string[],
    selectedSubSectorSkills: [] as string[],
    selectedSkillsCapabilities: [] as string[],
    bio: "",
    achievements: "",
    linkedinUrl: "",
    websiteUrl: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsProfileLoading(true);
      const currentUser = getCurrentUserDetails();
      const resolvedTrainerId = currentUser.id;

      if (!isMounted) {
        return;
      }

      setTrainerId(resolvedTrainerId);
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name ?? prev.name,
        email: currentUser.email ?? prev.email,
      }));

      if (!resolvedTrainerId) {
        setIsProfileLoading(false);
        toast({
          title: "Unable to load profile",
          description: "Trainer ID was not found. Please sign in again.",
          variant: "destructive",
        });
        return;
      }

      try {
        const response = await apiClient.get<unknown>(
          `/trainer/id/${encodeURIComponent(resolvedTrainerId)}`,
          { cache: "no-store" },
        );
        const mappedProfile = mapTrainerProfileResponse(
          response,
          currentUser.name ?? "",
          currentUser.email ?? "",
        );

        if (!isMounted) {
          return;
        }

        setFormData((prev) => ({
          ...prev,
          ...mappedProfile,
        }));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Unable to load trainer profile.";

        toast({
          title: "Unable to load profile",
          description: message,
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setIsProfileLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const subSectorSkillsOptions = useMemo(() => {
    const sectorSkills = getSkillsForSectors(formData.selectedSectors);
    return sectorSkills.map((skill) => ({ value: skill, label: skill }));
  }, [formData.selectedSectors]);

  const subSectorSkillsGrouped = useMemo(() => {
    if (formData.selectedSectors.length === 0) return [];

    const grouped = getSkillsGroupedBySector(formData.selectedSectors);
    return grouped.map((group) => ({
      groupLabel: group.sectorName,
      options: group.skills.map((skill) => ({ value: skill, label: skill })),
    }));
  }, [formData.selectedSectors]);

  const skillsCapabilitiesOptions = useMemo(() => {
    return SKILLS_CAPABILITIES.map((skill) => ({ value: skill, label: skill }));
  }, []);

  const sectorsOptions = useMemo(() => {
    return SECTORS.map((sector) => ({ value: sector.id, label: sector.name }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trainerId) {
      toast({
        title: "Unable to save profile",
        description: "Trainer ID was not found. Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    const payload = {
      name: formData.name.trim(),
      fullName: formData.name.trim(),
      email: formData.email.trim(),
      title: formData.title.trim(),
      industry: formData.industry || undefined,
      experience: formData.experience || undefined,
      sectors: formData.selectedSectors,
      selectedSectors: formData.selectedSectors,
      subSectorSkills: formData.selectedSubSectorSkills,
      selectedSubSectorSkills: formData.selectedSubSectorSkills,
      skillsCapabilities: formData.selectedSkillsCapabilities,
      selectedSkillsCapabilities: formData.selectedSkillsCapabilities,
      bio: formData.bio.trim(),
      achievements: formData.achievements.trim(),
      linkedinUrl: formData.linkedinUrl.trim(),
      websiteUrl: formData.websiteUrl.trim(),
    };

    try {
      await apiClient.put<unknown, typeof payload>(
        `/trainer/${encodeURIComponent(trainerId)}`,
        payload,
      );

      toast({
        title: "Profile updated",
        description: "Your profile changes were saved successfully.",
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to save trainer profile.";

      toast({
        title: "Unable to save profile",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <DashboardHeader
        title="Profile Settings"
        description="Update your profile information and expertise"
      />
      <div className="w-full space-y-4 md:px-6 md:pt-8 md:pb-8">
        {isProfileLoading ? (
          <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
            Loading trainer profile...
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
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
                  <Label htmlFor="title" className="text-sm font-medium">Professional Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    placeholder="e.g., Senior Digital Marketing Manager"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium">Primary Industry *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => updateFormData("industry", value)}
                  >
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
                  <Label htmlFor="experience" className="text-sm font-medium">Years of Experience *</Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) =>
                      updateFormData("experience", value)
                    }
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
            </CardContent>
          </Card>

          {/* Expertise */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                Expertise & Skills
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Your areas of expertise and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sector</Label>
                <MultiSelect
                  options={sectorsOptions}
                  selected={formData.selectedSectors}
                  onSelectionChange={(selected) => {
                    updateFormData("selectedSectors", selected);
                    // Clear sub-sector skills when sectors change
                    const newSubSectorSkills = getSkillsForSectors(selected);
                    updateFormData(
                      "selectedSubSectorSkills",
                      formData.selectedSubSectorSkills.filter((skill) =>
                        newSubSectorSkills.includes(skill)
                      )
                    );
                  }}
                  placeholder="Select sector"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Sub-Sector (Skill)</Label>
                <MultiSelect
                  options={subSectorSkillsOptions}
                  selected={formData.selectedSubSectorSkills}
                  onSelectionChange={(selected) =>
                    updateFormData("selectedSubSectorSkills", selected)
                  }
                  placeholder="Select skill"
                  disabled={formData.selectedSectors.length === 0}
                  groupedOptions={subSectorSkillsGrouped}
                />
                {formData.selectedSectors.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Please select a sector first
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Skills & Capabilities</Label>
                <MultiSelect
                  options={skillsCapabilitiesOptions}
                  selected={formData.selectedSkillsCapabilities}
                  onSelectionChange={(selected) =>
                    updateFormData("selectedSkillsCapabilities", selected)
                  }
                  placeholder="Select skills & capabilities"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                Professional Details
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Tell others about your background and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">Professional Bio *</Label>
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
                <Label htmlFor="achievements" className="text-sm font-medium">Key Achievements</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) =>
                    updateFormData("achievements", e.target.value)
                  }
                  placeholder="Share your biggest professional achievements (e.g., 'Trained 500+ professionals', 'Built 3 successful programs')"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                Social Media & Website
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">Add your professional links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl" className="flex items-center gap-2 text-sm font-medium">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) =>
                    updateFormData("linkedinUrl", e.target.value)
                  }
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl" className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4" />
                  Website (Optional)
                </Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
            <Link href="/trainer/dashboard" className="w-full sm:w-auto">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000]"
              disabled={isSaving || isProfileLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
  </>
  );
}
