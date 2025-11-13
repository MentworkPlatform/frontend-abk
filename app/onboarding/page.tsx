"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  SECTORS,
  SKILLS_CAPABILITIES,
  getSkillsForSectors,
  getSkillsGroupedBySector,
} from "@/lib/constants/onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: "",
    name: "",
    email: "",
    industry: "",
    businessStage: "",
    supportAreas: [] as string[],
    selectedSectors: [] as string[],
    selectedSubSectorSkills: [] as string[],
    selectedSkillsCapabilities: [] as string[],
    specificGoals: "",
    timeframe: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSupportArea = (area: string) => {
    setFormData((prev) => {
      const currentAreas = [...prev.supportAreas];
      if (currentAreas.includes(area)) {
        return {
          ...prev,
          supportAreas: currentAreas.filter((a) => a !== area),
        };
      } else {
        return { ...prev, supportAreas: [...currentAreas, area] };
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
    router.push("/dashboard");
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
            <h1 className="text-2xl md:text-3xl font-bold">
              Let's Personalize Your Journey
            </h1>
            <div className="text-sm font-medium">Step {step} of 4</div>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div
              className="bg-[#FFD500] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="border-none shadow-lg rounded-xl">
          <CardContent className="p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">What are your goals?</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal">
                      Share your main professional goal
                    </Label>
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
                    <Label htmlFor="timeframe">
                      When do you want to achieve this?
                    </Label>
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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">
                  Tell us about yourself
                </h2>

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
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) =>
                          updateFormData("industry", value)
                        }
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
                          <SelectItem value="agriculture">
                            Agriculture
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Your Business</h2>

                <div className="space-y-4">
                  <Label>What stage is your business at?</Label>
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
                      <RadioGroupItem
                        value="early-startup"
                        id="early-startup"
                      />
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
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Areas of Support</h2>

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

                  <div className="space-y-2 mt-6">
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
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
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
                  Find My Programs <CheckCircle2 className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
