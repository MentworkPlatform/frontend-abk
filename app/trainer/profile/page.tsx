"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useMemo } from "react";

export default function TrainerProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    title: "Senior Digital Marketing Manager",
    industry: "technology",
    experience: "8-12",
    selectedSectors: ["technology-it", "creative-arts"],
    selectedSubSectorSkills: ["Software", "Web development", "Graphic design"],
    selectedSkillsCapabilities: [
      "Leadership, People & Culture",
      "Business Planning & Strategic Thinking",
      "Branding, Marketing & Digital Presence",
    ],
    bio: "Experienced trainer with 10+ years in digital marketing and creative design. Passionate about helping others grow their skills.",
    achievements: "Trained 500+ professionals, Built 3 successful programs",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    websiteUrl: "https://johndoe.com",
  });

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
    setIsLoading(true);

    // TODO: Add API call to save profile data
    // const response = await fetch(API_URL + '/trainer/profile', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + localStorage.getItem('token'),
    //   },
    //   body: JSON.stringify(formData),
    // })

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
      alert("Profile updated successfully!");
    }, 1000);
  };

  return (
    <div className="flex-1 space-y-6">
      <DashboardHeader
        title="Profile Settings"
        description="Update your profile information and expertise"
      />

      <div className="w-full space-y-6 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="experience">Years of Experience *</Label>
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Expertise & Skills
              </CardTitle>
              <CardDescription>
                Your areas of expertise and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Sector</Label>
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
                <Label>Sub-Sector (Skill)</Label>
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
                <Label>Skills & Capabilities</Label>
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Professional Details
              </CardTitle>
              <CardDescription>
                Tell others about your background and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media & Website
              </CardTitle>
              <CardDescription>Add your professional links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="linkedinUrl"
                  className="flex items-center gap-2"
                >
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
                <Label htmlFor="websiteUrl" className="flex items-center gap-2">
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
          <div className="flex justify-end gap-4">
            <Link href="/trainer/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
