"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, Calendar, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  SECTORS,
  SKILLS_CAPABILITIES,
  getSkillsForSectors,
  getSkillsGroupedBySector,
} from "@/lib/constants/onboarding";
import { useMemo } from "react";

export default function TrainerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Goals
    impactGoal: "",
    revenueGoal: "",
    timeframe: "",
    // Personal Information
    name: "",
    companyName: "",
    email: "",
    password: "",
    // Expertise
    selectedSectors: [] as string[],
    selectedSubSectorSkills: [] as string[],
    selectedSkillsCapabilities: [] as string[],
    experience: "",
    // Profile
    bio: "",
    profilePhoto: "",
    linkedinUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    websiteUrl: "",
    // Scheduling
    availability: [] as string[],
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAvailability = (day: string) => {
    setFormData((prev) => {
      const currentDays = [...prev.availability];
      if (currentDays.includes(day)) {
        return { ...prev, availability: currentDays.filter((d) => d !== day) };
      } else {
        return { ...prev, availability: [...currentDays, day] };
      }
    });
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

  const nextStep = () => {
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit the data to your backend
    router.push("/trainer/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/">
              <img
                src="/images/mentwork-logo.png"
                alt="Mentwork"
                className="h-8"
              />
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Become a Trainer</h1>
            <div className="text-sm font-medium">Step {step} of 6</div>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div
              className="bg-[#FFD500] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="border-none shadow-lg rounded-xl">
          <CardContent className="p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Your Goals</h2>
                <p className="text-gray-600 mb-6">
                  Help us understand what you want to achieve as a trainer
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="impactGoal">
                      Impact Goal - How many people do you want to train?
                    </Label>
                    <Input
                      id="impactGoal"
                      type="number"
                      value={formData.impactGoal}
                      onChange={(e) => updateFormData("impactGoal", e.target.value)}
                      placeholder="e.g., 50, 100, 500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenueGoal">
                      Revenue Goal (in USD)
                    </Label>
                    <Input
                      id="revenueGoal"
                      type="number"
                      value={formData.revenueGoal}
                      onChange={(e) => updateFormData("revenueGoal", e.target.value)}
                      placeholder="e.g., 10000, 50000, 100000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeframe">
                      Timeframe to achieve these goals
                    </Label>
                    <Select
                      value={formData.timeframe}
                      onValueChange={(value) =>
                        updateFormData("timeframe", value)
                      }
                    >
                      <SelectTrigger id="timeframe">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                <p className="text-gray-600 mb-6">
                  Let's start with your basic information
                </p>

                <div className="space-y-4">
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
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) =>
                        updateFormData("companyName", e.target.value)
                      }
                      placeholder="Enter your company name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        updateFormData("email", e.target.value)
                      }
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                      placeholder="Create a password (min. 8 characters)"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500">
                      Must be at least 8 characters long
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Your Expertise</h2>
                <p className="text-gray-600 mb-6">
                  What areas do you train in?
                </p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <MultiSelect
                      options={sectorsOptions}
                      selected={formData.selectedSectors}
                      onSelectionChange={(selected) => {
                        updateFormData("selectedSectors", selected);
                        // Clear sub-sector skills when sectors change
                        const newSubSectorSkills =
                          getSkillsForSectors(selected);
                        updateFormData(
                          "selectedSubSectorSkills",
                          formData.selectedSubSectorSkills.filter((skill) =>
                            newSubSectorSkills.includes(skill)
                          )
                        );
                      }}
                      placeholder="Select sector(s)"
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
                      placeholder="Select skill(s)"
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

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
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
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Your Profile</h2>
                <p className="text-gray-600 mb-6">
                  Build your professional profile
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateFormData("bio", e.target.value)}
                      placeholder="Tell us about your background, experience, and what makes you a great trainer..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="p-4 bg-[#f8f8f8] rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Upload className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Upload Profile Photo</p>
                        <p className="text-sm text-gray-500">
                          Professional headshot recommended (JPG, PNG)
                        </p>
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
                        <span className="text-sm font-medium w-24">
                          LinkedIn:
                        </span>
                        <Input
                          value={formData.linkedinUrl}
                          onChange={(e) =>
                            updateFormData("linkedinUrl", e.target.value)
                          }
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium w-24">
                          Twitter:
                        </span>
                        <Input
                          value={formData.twitterUrl}
                          onChange={(e) =>
                            updateFormData("twitterUrl", e.target.value)
                          }
                          placeholder="https://twitter.com/yourhandle"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium w-24">
                          Website:
                        </span>
                        <Input
                          value={formData.websiteUrl}
                          onChange={(e) =>
                            updateFormData("websiteUrl", e.target.value)
                          }
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">
                  Availability & Scheduling
                </h2>
                <p className="text-gray-600 mb-6">
                  Set your availability and connect your calendar
                </p>

                <div className="space-y-4">
                  <Label>Available Days (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={
                          formData.availability.includes(day)
                            ? "default"
                            : "outline"
                        }
                        className={
                          formData.availability.includes(day)
                            ? "bg-[#FFD500] text-black"
                            : ""
                        }
                        onClick={() => toggleAvailability(day)}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </Button>
                    ))}
                  </div>

                  <div className="p-6 bg-[#f8f8f8] rounded-lg border border-gray-200 mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Calendar Integration</p>
                        <p className="text-sm text-gray-500">
                          Connect your calendar to manage availability
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
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
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 text-blue-500"
                        >
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

            {step === 6 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">
                  Commission Model & Payment Setup
                </h2>
                <p className="text-gray-600 mb-6">
                  Understand our business model and set up payment details
                </p>

                <div className="space-y-6">
                  <div className="bg-[#f8f8f8] p-6 rounded-lg border border-gray-200">
                    <h3 className="font-bold mb-4">Commission Tiers</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      The more sessions you conduct, the lower our commission
                      rates. Here's how it works:
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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900 mb-1">
                          Payment Details Required
                        </h4>
                        <p className="text-sm text-blue-700 mb-3">
                          To receive payments for your programs, you'll need to add your payment details in Settings after completing registration.
                        </p>
                        <p className="text-xs text-blue-600">
                          You can add bank account, mobile money, or other payment methods in your profile settings.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to Mentwork's{" "}
                      <Link
                        href="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-blue-600 hover:underline"
                      >
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

              {step < 6 ? (
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
                  Complete Registration{" "}
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
