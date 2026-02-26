"use client";

import { useState, useMemo } from "react";
import { Save, User, Briefcase, Target, Globe, Linkedin, DollarSign, Lock, Bell } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiSelect } from "@/components/ui/multi-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  SECTORS,
  SKILLS_CAPABILITIES,
  getSkillsForSectors,
  getSkillsGroupedBySector,
} from "@/lib/constants/onboarding";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    goal: "Scale my startup and secure funding",
    name: "John Doe",
    email: "john.doe@example.com",
    industry: "technology",
    businessStage: "growing",
    selectedSectors: ["technology-it", "creative-arts"],
    selectedSubSectorSkills: ["Software", "Web development"],
    selectedSkillsCapabilities: [
      "Leadership, People & Culture",
      "Business Planning & Strategic Thinking",
      "Branding, Marketing & Digital Presence",
    ],
    specificGoals:
      "I want to improve my leadership skills and develop a solid business strategy for scaling.",
    timeframe: "6-12-months",
    linkedinUrl: "",
    websiteUrl: "",
    goalBudget: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

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
    // const response = await fetch(API_URL + '/profile', {
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      setIsPasswordLoading(false);
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      setIsPasswordLoading(false);
      return;
    }

    // TODO: Add API call to update password
    // const response = await fetch(API_URL + '/auth/change-password', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + localStorage.getItem('token'),
    //   },
    //   body: JSON.stringify({
    //     currentPassword: passwordData.currentPassword,
    //     newPassword: passwordData.newPassword,
    //   }),
    // })

    // Simulate API call
    setTimeout(() => {
      setIsPasswordLoading(false);
      alert("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  return (
    <div className="w-full">
      <DashboardHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="w-full space-y-4 md:px-6 md:pt-8 md:pb-8">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="w-full md:w-auto flex-wrap h-auto">
            <TabsTrigger value="profile" className="flex-1 md:flex-initial">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Profile</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 md:flex-initial">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notifs</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 md:flex-initial">
              <Lock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
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
                      <Label htmlFor="industry">Industry *</Label>
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
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeframe">Timeframe *</Label>
                      <Select
                        value={formData.timeframe}
                        onValueChange={(value) =>
                          updateFormData("timeframe", value)
                        }
                      >
                        <SelectTrigger id="timeframe">
                          <SelectValue placeholder="Select a timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3-months">1-3 months</SelectItem>
                          <SelectItem value="3-6-months">3-6 months</SelectItem>
                          <SelectItem value="6-12-months">6-12 months</SelectItem>
                          <SelectItem value="1-2-years">1-2 years</SelectItem>
                          <SelectItem value="2-plus-years">2+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Business Stage *</Label>
                    <RadioGroup
                      value={formData.businessStage}
                      onValueChange={(value) =>
                        updateFormData("businessStage", value)
                      }
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="idea" id="idea" />
                        <Label htmlFor="idea" className="font-normal">
                          Idea Stage
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="early-startup" id="early-startup" />
                        <Label htmlFor="early-startup" className="font-normal">
                          Early Startup (Pre-revenue)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="growing" id="growing" />
                        <Label htmlFor="growing" className="font-normal">
                          Growing Business (Revenue generating)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="established" id="established" />
                        <Label htmlFor="established" className="font-normal">
                          Established Business
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="scaling" id="scaling" />
                        <Label htmlFor="scaling" className="font-normal">
                          Scaling (Rapid growth phase)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Goals & Objectives */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Goals & Objectives
                  </CardTitle>
                  <CardDescription>What you want to achieve</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal">Main Professional Goal *</Label>
                    <Textarea
                      id="goal"
                      value={formData.goal}
                      onChange={(e) => updateFormData("goal", e.target.value)}
                      placeholder="e.g., Scale my startup, Secure funding, Improve team management..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specificGoals">Specific Objectives</Label>
                    <Textarea
                      id="specificGoals"
                      value={formData.specificGoals}
                      onChange={(e) =>
                        updateFormData("specificGoals", e.target.value)
                      }
                      placeholder="What specific objectives do you want to achieve through mentorship?"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Goal Budget */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Goal Budget
                  </CardTitle>
                  <CardDescription>Budget allocated for achieving your goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goalBudget">Budget Range</Label>
                    <Select
                      value={formData.goalBudget}
                      onValueChange={(value) => updateFormData("goalBudget", value)}
                    >
                      <SelectTrigger id="goalBudget">
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-500">Under ₦750,000</SelectItem>
                        <SelectItem value="500-1000">₦750,000 - ₦1,500,000</SelectItem>
                        <SelectItem value="1000-2500">₦1,500,000 - ₦3,750,000</SelectItem>
                        <SelectItem value="2500-5000">₦3,750,000 - ₦7,500,000</SelectItem>
                        <SelectItem value="5000-10000">₦7,500,000 - ₦15,000,000</SelectItem>
                        <SelectItem value="10000-plus">₦15,000,000+</SelectItem>
                        <SelectItem value="not-sure">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      This helps us recommend programs that fit your budget
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Areas of Interest */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Areas of Interest & Skills
                  </CardTitle>
                  <CardDescription>
                    Your sectors, skills, and capabilities
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

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Social Media & Website
                  </CardTitle>
                  <CardDescription>
                    Add your professional links (optional)
                  </CardDescription>
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
                      value={formData.linkedinUrl || ""}
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
                      value={formData.websiteUrl || ""}
                      onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  type="submit"
                  className="bg-[#FFD500] text-black hover:bg-[#e6c000] w-full md:w-auto"
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Program Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about program enrollment and updates</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminded before upcoming sessions</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mentor Messages</Label>
                      <p className="text-sm text-muted-foreground">Get notified when your mentor sends a message</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                </div>
                <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000] w-full md:w-auto">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      placeholder="Enter your current password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      placeholder="Enter your new password (min. 8 characters)"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      placeholder="Confirm your new password"
                      required
                      minLength={8}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-[#FFD500] text-black hover:bg-[#e6c000] w-full md:w-auto"
                    disabled={isPasswordLoading}
                  >
                    {isPasswordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
