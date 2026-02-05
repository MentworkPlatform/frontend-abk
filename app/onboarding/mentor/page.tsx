"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Clock,
  Users,
  Bell,
  Heart,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  SECTORS,
  getSkillsForSectors,
  getSkillsGroupedBySector,
} from "@/lib/constants/onboarding";

// Mock opportunity data - in real app, this would come from API based on expertise
const mockOpportunities = [
  {
    id: 1,
    programTitle: "Start Your Business Bootcamp",
    programOutcome: "Launch your first business with a validated idea and go-to-market strategy",
    topic: "Business Strategy & Planning",
    timeCommitment: "2 hours per week",
    cohortTiming: "Next cohort starts in 2 weeks",
    facilitator: "Alex Thompson",
    compensation: "$150/session",
    format: "Hybrid",
  },
  {
    id: 2,
    programTitle: "Digital Marketing Mastery",
    programOutcome: "Master SEO, social media, and paid advertising to grow your brand",
    topic: "Digital Marketing Strategy",
    timeCommitment: "3 hours per week",
    cohortTiming: "Next cohort starts in 1 month",
    facilitator: "Emily Rodriguez",
    compensation: "$200/session",
    format: "Online",
  },
  {
    id: 3,
    programTitle: "Scale Your Business Program",
    programOutcome: "Grow from $10K to $100K+ monthly revenue with proven frameworks",
    topic: "Growth Strategy & Scaling",
    timeCommitment: "2.5 hours per week",
    cohortTiming: "Next cohort starts in 3 weeks",
    facilitator: "Sarah Johnson",
    compensation: "$250/session",
    format: "Hybrid",
  },
  {
    id: 4,
    programTitle: "Tech Skills Accelerator",
    programOutcome: "Learn in-demand tech skills: Web Development, Data Analysis, and more",
    topic: "Technical Skills Development",
    timeCommitment: "4 hours per week",
    cohortTiming: "Next cohort starts in 2 weeks",
    facilitator: "Dr. James Wilson",
    compensation: "$180/session",
    format: "Online",
  },
];

export default function MentorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);
  const [needsAccount, setNeedsAccount] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Expertise Snapshot
    teachingAreas: [] as string[], // Max 3 selections
    preferredStage: "", // Single selection
    // Step 4: Account Creation (only if needed)
    name: "",
    email: "",
    password: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTeachingArea = (area: string) => {
    setFormData((prev) => {
      const currentAreas = [...prev.teachingAreas];
      if (currentAreas.includes(area)) {
        return { ...prev, teachingAreas: currentAreas.filter((a) => a !== area) };
      } else if (currentAreas.length < 3) {
        return { ...prev, teachingAreas: [...currentAreas, area] };
      }
      return prev;
    });
  };

  // Get teaching areas from sectors and skills
  const teachingAreaOptions = useMemo(() => {
    const areas: string[] = [];
    SECTORS.forEach((sector) => {
      areas.push(sector.name);
      const skills = getSkillsForSectors([sector.id]);
      skills.forEach((skill) => {
        if (!areas.includes(skill)) {
          areas.push(skill);
        }
      });
    });
    return areas.slice(0, 20); // Limit to reasonable number
  }, []);

  // Filter opportunities based on expertise (simplified matching logic)
  const relevantOpportunities = useMemo(() => {
    // In real app, this would be API call with expertise data
    return mockOpportunities;
  }, [formData.teachingAreas, formData.preferredStage]);

  const nextStep = () => {
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleExpressInterest = (opportunityId: number) => {
    setSelectedOpportunity(opportunityId);
    setNeedsAccount(true); // In real app, check if user is logged in
    nextStep(); // Go to micro-commitment step
  };

  const handleSaveInterest = () => {
    // In real app, save interest and notify facilitator
    setNeedsAccount(true);
    nextStep();
  };

  const handleSkipAccount = () => {
    setNeedsAccount(false);
    setStep(5); // Go to next steps
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, create account and save interest
    router.push("/mentor/dashboard");
  };

  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container max-w-4xl">
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
              {step === 1 && "Let's understand your expertise"}
              {step === 2 && "Programs looking for mentors like you"}
              {step === 3 && "Save your interest"}
              {step === 4 && "Create your account"}
              {step === 5 && "What's next?"}
            </h1>
            <div className="text-sm font-medium">
              {step === 4 ? "Step 2 of 3 – Save your interest" : `Step ${step} of ${totalSteps}`}
            </div>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div
              className="bg-[#FFD500] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="border-none shadow-lg rounded-xl">
          <CardContent className="p-6 md:p-8">
            {/* Step 1: Expertise Snapshot */}
            {step === 1 && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-6">
                  Help us match you with the right teaching opportunities (takes 30 seconds)
                </p>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Which areas can you teach confidently? (Select up to 3)
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {teachingAreaOptions.map((area) => (
                        <div
                          key={area}
                          onClick={() => toggleTeachingArea(area)}
                          className={`p-2.5 border rounded-md cursor-pointer transition-all text-center ${
                            formData.teachingAreas.includes(area)
                              ? "border-[#FFD500] bg-yellow-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm font-medium">{area}</span>
                            {formData.teachingAreas.includes(area) && (
                              <CheckCircle2 className="h-4 w-4 text-[#FFD500]" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {formData.teachingAreas.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {formData.teachingAreas.length} of 3 selected
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Which stage do you prefer teaching?
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        "Beginner",
                        "Early-stage",
                        "Growth",
                        "Advanced",
                      ].map((stage) => (
                        <div
                          key={stage}
                          onClick={() => updateFormData("preferredStage", stage)}
                          className={`p-2.5 border rounded-md cursor-pointer text-center transition-all ${
                            formData.preferredStage === stage
                              ? "border-[#FFD500] bg-yellow-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <span className="text-sm font-medium">{stage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Opportunity Preview */}
            {step === 2 && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-6">
                  Based on your expertise, here are programs looking for mentors
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relevantOpportunities.map((opportunity) => (
                    <Card
                      key={opportunity.id}
                      className="hover:shadow-md transition-shadow border-2 hover:border-[#FFD500]"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg leading-tight">
                            {opportunity.programTitle}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle save/favorite
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription className="text-sm min-h-[3rem]">
                          {opportunity.programOutcome}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Topic:</span>
                            <span className="text-gray-600">{opportunity.topic}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Time:</span>
                            <span className="text-gray-600">{opportunity.timeCommitment}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Cohort:</span>
                            <span className="text-gray-600">{opportunity.cohortTiming}</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500">By {opportunity.facilitator}</p>
                              <p className="text-sm font-medium text-[#FFD500] mt-1">
                                {opportunity.compensation}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {opportunity.format}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            className="flex-1 bg-[#FFD500] text-black hover:bg-[#e6c000]"
                            onClick={() => handleExpressInterest(opportunity.id)}
                          >
                            I'm Interested
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              // Skip this opportunity
                            }}
                          >
                            Not Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/programs")}
                  >
                    Explore All Opportunities
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Micro-Commitment */}
            {step === 3 && selectedOpportunity && (
              <div className="space-y-6">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-[#FFD500]" />
                  <h2 className="text-xl font-bold mb-2">
                    {relevantOpportunities.find((o) => o.id === selectedOpportunity)?.programTitle}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {relevantOpportunities.find((o) => o.id === selectedOpportunity)?.topic}
                  </p>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Time Commitment:</span>
                        <span>{relevantOpportunities.find((o) => o.id === selectedOpportunity)?.timeCommitment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Cohort Timing:</span>
                        <span>{relevantOpportunities.find((o) => o.id === selectedOpportunity)?.cohortTiming}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Compensation:</span>
                        <span className="text-[#FFD500] font-bold">
                          {relevantOpportunities.find((o) => o.id === selectedOpportunity)?.compensation}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000] h-14"
                    onClick={handleSaveInterest}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Save Interest & Notify Facilitator
                  </Button>
                </div>

                <p className="text-xs text-center text-gray-500">
                  Create an account to save your interest and get notified when facilitators confirm teaching slots
                </p>
              </div>
            )}

            {/* Step 4: Lightweight Account Creation */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    Create an account to save your interest
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Step 2 of 3 – Save your interest
                  </p>
                </div>

                <form onSubmit={handleCreateAccount} className="space-y-4">
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      placeholder="Create a password (min. 8 characters)"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]"
                    >
                      Create Account & Save Interest
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={handleSkipAccount}
                    >
                      Continue without account
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 5: Clear Next Step */}
            {step === 5 && (
              <div className="space-y-6 text-center">
                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Interest Saved!</h2>
                <p className="text-gray-600 mb-6">
                  You'll be notified when facilitators confirm teaching slots
                </p>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <Bell className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <p className="text-sm text-gray-700 mb-4">
                      We'll send you an email when the facilitator reviews your interest and confirms the teaching opportunity.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/mentor/dashboard")}
                    >
                      Go to Dashboard
                    </Button>
                  </CardContent>
                </Card>

                <div className="pt-4">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => router.push("/mentor/dashboard/profile")}
                  >
                    Improve Matching by Adding More Details
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 5 && (
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

                {step === 1 && (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={formData.teachingAreas.length === 0 || !formData.preferredStage}
                    className="bg-[#FFD500] text-black hover:bg-[#e6c000] flex items-center gap-2"
                  >
                    See Opportunities <ArrowRight className="h-4 w-4" />
                  </Button>
                )}

                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNeedsAccount(false);
                      setStep(5);
                    }}
                    className="flex items-center gap-2"
                  >
                    Skip for now
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
