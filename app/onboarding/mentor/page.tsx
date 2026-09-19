"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
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
import { MultiSelect } from "@/components/ui/multi-select";
import {
  SECTORS,
} from "@/lib/constants/onboarding"

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
    compensation: "₦225,000/session",
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
    compensation: "₦300,000/session",
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
    compensation: "₦375,000/session",
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
    compensation: "₦270,000/session",
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
    selectedSectors: [] as string[], // Max 3 selections using sector IDs
    preferredStage: "", // Single selection
    // Step 4: Account Creation (only if needed)
    name: "",
    email: "",
    password: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Sector options for dropdown
  const sectorsOptions = useMemo(() => {
    return SECTORS.map((sector) => ({ value: sector.id, label: sector.name }));
  }, []);

  // Filter opportunities based on expertise (simplified matching logic)
  const relevantOpportunities = useMemo(() => {
    // In real app, this would be API call with expertise data
    return mockOpportunities;
  }, [formData.selectedSectors, formData.preferredStage]);

  const nextStep = () => {
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    // If on step 4 (account) and no opportunity selected, go back to step 2
    if (step === 4 && !selectedOpportunity) {
      setStep(2);
    } else {
    setStep((prev) => prev - 1);
    }
    window.scrollTo(0, 0);
  };

  const handleExpressInterest = (opportunityId: number) => {
    setSelectedOpportunity(opportunityId);
    setNeedsAccount(true); // In real app, check if user is logged in
    nextStep(); // Go to micro-commitment step
  };

  const handleSaveInterest = () => {
    // In real app, save interest
    setNeedsAccount(true);
    nextStep();
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, create account and save interest
    nextStep(); // Go to Step 5 (Done page)
  };

  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-6 px-4 sm:py-10 sm:px-6 md:py-12 md:px-8">
      <div className="container max-w-4xl mx-auto p-0">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Link href="/">
              <img
                src="/images/mentwork-logo.png"
                alt="Mentwork"
                className="h-8"
              />
            </Link>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight pr-2 text-[#0A0A0A]">
              {step === 1 && "Let's understand your expertise"}
              {step === 2 && "Programs looking for mentors like you"}
              {step === 3 && "Save your interest"}
              {step === 4 && "Create your account"}
              {step === 5 && "What's next?"}
            </h1>
            <div className="text-xs sm:text-sm font-semibold text-[#2B2B2B]/60 shrink-0">
              Step {step} of {totalSteps}
            </div>
          </div>

          <div className="w-full bg-[#E7E5E1] h-2 rounded-full overflow-hidden mb-6 sm:mb-8">
            <div
              className="bg-[#F5C400] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="border border-[#E7E5E1] bg-white shadow-xs rounded-2xl overflow-hidden">
          <CardContent className="p-5 sm:p-7 md:p-9">
            {/* Step 1: Expertise Snapshot */}
            {step === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <p className="text-[#2B2B2B]/80 text-sm sm:text-base mb-4 sm:mb-6">
                  Help us match you with the right teaching opportunities (takes 30 seconds)
                </p>

                <div className="space-y-5 sm:space-y-7">
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-sm sm:text-base font-bold text-[#0A0A0A]">
                      Which areas can you teach confidently? (Select up to 3)
                    </Label>
                    <MultiSelect
                      options={sectorsOptions}
                      selected={formData.selectedSectors}
                      onSelectionChange={(selected) => {
                        // Limit to 3 selections
                        if (selected.length <= 3) {
                          updateFormData("selectedSectors", selected);
                        }
                      }}
                      placeholder="Select sector(s)"
                    />
                    {formData.selectedSectors.length > 0 && (
                      <p className="text-xs text-[#2B2B2B]/60 font-medium">
                        {formData.selectedSectors.length} of 3 selected
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-sm sm:text-base font-bold text-[#0A0A0A]">
                      Which stage do you prefer teaching?
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                      {[
                        "Beginner",
                        "Early-stage",
                        "Growth",
                        "Advanced",
                      ].map((stage) => {
                        const isSelected = formData.preferredStage === stage;
                        return (
                          <div
                            key={stage}
                            onClick={() => updateFormData("preferredStage", stage)}
                            className={`p-3 border rounded-xl cursor-pointer text-center transition-all ${
                              isSelected
                                ? "border-2 border-[#0A0A0A] bg-[#FAF9F6] text-[#0A0A0A] font-bold shadow-xs"
                                : "border-[#E7E5E1] bg-white text-[#2B2B2B] hover:border-[#0A0A0A]/40 font-medium"
                            }`}
                          >
                            <span className="text-sm">{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Opportunity Preview */}
            {step === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <p className="text-[#2B2B2B]/80 text-sm sm:text-base mb-4 sm:mb-6">
                  Based on your expertise, here are programs looking for mentors
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {relevantOpportunities.map((opportunity) => (
                    <Card
                      key={opportunity.id}
                      className="hover:shadow-md transition-shadow border border-[#E7E5E1] hover:border-[#0A0A0A] rounded-xl overflow-hidden"
                    >
                      <CardHeader className="pb-2 sm:pb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-base sm:text-lg leading-tight break-words text-[#0A0A0A]">
                            {opportunity.programTitle}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#2B2B2B]/60 hover:text-[#0A0A0A]"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle save/favorite
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription className="text-xs sm:text-sm min-h-[2.5rem] sm:min-h-[3rem] line-clamp-2 text-[#2B2B2B]/70">
                          {opportunity.programOutcome}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                            <BookOpen className="h-4 w-4 text-[#2B2B2B]/50 shrink-0" />
                            <span className="font-semibold text-[#0A0A0A]">Topic:</span>
                            <span className="text-[#2B2B2B]/70">{opportunity.topic}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <Clock className="h-4 w-4 text-[#2B2B2B]/50 shrink-0" />
                            <span className="font-semibold text-[#0A0A0A]">Time:</span>
                            <span className="text-[#2B2B2B]/70">{opportunity.timeCommitment}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <Users className="h-4 w-4 text-[#2B2B2B]/50 shrink-0" />
                            <span className="font-semibold text-[#0A0A0A]">Cohort:</span>
                            <span className="text-[#2B2B2B]/70">{opportunity.cohortTiming}</span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-[#E7E5E1]">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-[#2B2B2B]/60">By {opportunity.facilitator}</p>
                              <p className="text-base font-bold text-[#0A0A0A] mt-0.5">
                                {opportunity.compensation}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs border-[#E7E5E1] text-[#2B2B2B]">
                              {opportunity.format}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <Button
                            className="w-full sm:flex-1 bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl h-11 text-sm shadow-xs"
                            onClick={() => handleExpressInterest(opportunity.id)}
                          >
                            I'm Interested
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full sm:flex-1 border-[#E7E5E1] hover:border-[#0A0A0A] text-[#2B2B2B] font-semibold rounded-xl h-11 text-sm"
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

                <div className="pt-4 border-t border-[#E7E5E1]">
                  <Button
                    variant="outline"
                    className="w-full border-[#E7E5E1] hover:border-[#0A0A0A] font-semibold rounded-xl h-11"
                    onClick={() => router.push("/programs?view=mentor")}
                  >
                    Explore All Opportunities
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Micro-Commitment */}
            {step === 3 && selectedOpportunity && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#FAF9F6] border border-[#E7E5E1] flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <BookOpen className="h-7 w-7 text-[#0A0A0A]" />
                  </div>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 leading-tight px-1 text-[#0A0A0A]">
                    {relevantOpportunities.find((o) => o.id === selectedOpportunity)?.programTitle}
                  </h2>
                  <p className="text-[#2B2B2B]/70 text-sm sm:text-base mb-3 sm:mb-4">
                    {relevantOpportunities.find((o) => o.id === selectedOpportunity)?.topic}
                  </p>
                </div>

                <Card className="bg-[#FAF9F6] border border-[#E7E5E1] rounded-xl">
                  <CardContent className="p-4 sm:p-5">
                    <div className="space-y-2.5 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#2B2B2B]/60" />
                        <span className="font-semibold text-[#0A0A0A]">Time Commitment:</span>
                        <span className="text-[#2B2B2B]/80">{relevantOpportunities.find((o) => o.id === selectedOpportunity)?.timeCommitment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#2B2B2B]/60" />
                        <span className="font-semibold text-[#0A0A0A]">Cohort Timing:</span>
                        <span className="text-[#2B2B2B]/80">{relevantOpportunities.find((o) => o.id === selectedOpportunity)?.cohortTiming}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#0A0A0A]">Compensation:</span>
                        <span className="text-[#0A0A0A] font-bold">
                          {relevantOpportunities.find((o) => o.id === selectedOpportunity)?.compensation}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2 sm:space-y-3">
                  <Button
                    className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] h-12 sm:h-14 text-sm sm:text-base font-bold rounded-xl shadow-xs"
                    onClick={handleSaveInterest}
                  >
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 shrink-0 text-[#0A0A0A]" />
                    Save Interest
                  </Button>
                </div>

                <p className="text-xs text-center text-[#2B2B2B]/60">
                  Create an account to save your interest and get notified when facilitators confirm teaching slots
                </p>
              </div>
            )}

            {/* Step 4: Lightweight Account Creation */}
            {step === 4 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-4 sm:mb-6">
                  <p className="text-[#2B2B2B]/70 text-sm sm:text-base">
                    Create an account to save your interest
                  </p>
                </div>

                <form onSubmit={handleCreateAccount} className="space-y-3 sm:space-y-4">
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
                    <p className="text-xs text-[#2B2B2B]/60">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl h-12 text-sm shadow-xs"
                    >
                      Create Account & Save Interest
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 5: Clear Next Step - Done Page */}
            {step === 5 && (
              <div className="space-y-4 sm:space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#5B7B6E]/10 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <CheckCircle className="h-8 w-8 text-[#5B7B6E]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-[#0A0A0A]">All Set!</h2>
                <p className="text-[#2B2B2B]/70 text-sm sm:text-base mb-4 sm:mb-6">
                  You'll be notified when facilitators confirm teaching slots
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <Card className="border border-[#E7E5E1] hover:border-[#0A0A0A] hover:shadow-md transition-shadow cursor-pointer text-left rounded-xl">
                    <CardContent className="p-4 sm:p-6">
                      <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#E7E5E1] flex items-center justify-center mb-3">
                        <Bell className="h-5 w-5 text-[#0A0A0A]" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-2 text-[#0A0A0A]">Explore More Opportunities</h3>
                      <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mb-3 sm:mb-4">
                        Browse all available programs looking for mentors
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-[#E7E5E1] hover:border-[#0A0A0A] font-semibold rounded-xl"
                        onClick={() => router.push("/programs?view=mentor")}
                      >
                        Explore Programs
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-[#0A0A0A] bg-white hover:shadow-md transition-shadow cursor-pointer text-left rounded-xl">
                    <CardContent className="p-4 sm:p-6">
                      <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#E7E5E1] flex items-center justify-center mb-3">
                        <Users className="h-5 w-5 text-[#0A0A0A]" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-2 text-[#0A0A0A]">Improve Recommendations</h3>
                      <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mb-3 sm:mb-4">
                        Complete your profile to get better matched with opportunities
                      </p>
                      <Button
                        className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl shadow-xs"
                        onClick={() => router.push("/mentor/dashboard/profile")}
                      >
                        Complete Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-4">
                  <Button
                    variant="ghost"
                    className="w-full text-[#2B2B2B] hover:text-[#0A0A0A] font-medium"
                    onClick={() => router.push("/mentor/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 5 && (
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-6 sm:mt-8">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 border-[#E7E5E1] font-semibold rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                ) : (
                  <div className="hidden sm:block" />
                )}

                {step === 1 && (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={formData.selectedSectors.length === 0 || !formData.preferredStage}
                    className="w-full sm:w-auto bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs"
                  >
                    See Opportunities <ArrowRight className="h-4 w-4" />
                  </Button>
                )}

                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNeedsAccount(true);
                      setStep(4); // Go to account creation
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 border-[#E7E5E1] font-semibold rounded-xl"
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
