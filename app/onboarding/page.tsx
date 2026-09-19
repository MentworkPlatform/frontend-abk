"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Clock, Users, Star, Heart, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { SECTORS } from "@/lib/constants/onboarding";

// Mock program data - in real app, this would come from API based on intent
const mockPrograms = [
  {
    id: 1,
    title: "Start Your Business Bootcamp",
    outcome: "Launch your first business with a validated idea and go-to-market strategy",
    duration: "8 weeks",
    stage: "Just exploring",
    facilitator: {
      name: "Alex Thompson",
      credibility: "Serial Entrepreneur, 3 exits",
    },
    format: "Hybrid",
    price: 1500,
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 2,
    title: "Scale Your Business Program",
    outcome: "Grow from $10K to $100K+ monthly revenue with proven frameworks",
    duration: "12 weeks",
    stage: "Actively growing",
    facilitator: {
      name: "Sarah Johnson",
      credibility: "Former McKinsey Partner",
    },
    format: "Online",
    price: 2500,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 3,
    title: "Digital Marketing Mastery",
    outcome: "Master SEO, social media, and paid advertising to grow your brand",
    duration: "10 weeks",
    stage: "Already started",
    facilitator: {
      name: "Emily Rodriguez",
      credibility: "Digital Marketing Expert, 2.8K+ students",
    },
    format: "Hybrid",
    price: 899,
    rating: 4.7,
    reviews: 1247,
  },
  {
    id: 4,
    title: "Tech Skills Accelerator",
    outcome: "Learn in-demand tech skills: Web Development, Data Analysis, and more",
    duration: "16 weeks",
    stage: "Just exploring",
    facilitator: {
      name: "Dr. James Wilson",
      credibility: "Data Science Lead, 1.5K+ students",
    },
    format: "Online",
    price: 599,
    rating: 4.8,
    reviews: 892,
  },
  {
    id: 5,
    title: "Access Market Opportunities",
    outcome: "Connect with investors, partners, and customers in your industry",
    duration: "6 weeks",
    stage: "Scaling / expanding",
    facilitator: {
      name: "Michael Chen",
      credibility: "VP Product at Stripe",
    },
    format: "Hybrid",
    price: 1999,
    rating: 4.9,
    reviews: 89,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [needsAccount, setNeedsAccount] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Intent Snapshot
    goals: [] as string[], // Max 2 selections
    timeframe: "", // Timeframe for goals
    area: [] as string[], // Multi-select using sectors
    stage: "", // Single selection
    // Step 4: Account Creation (only if needed)
    name: "",
    email: "",
    password: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => {
      const currentGoals = [...prev.goals];
      if (currentGoals.includes(goal)) {
        return { ...prev, goals: currentGoals.filter((g) => g !== goal) };
      } else if (currentGoals.length < 2) {
        return { ...prev, goals: [...currentGoals, goal] };
      }
      return prev;
    });
  };

  // Sector options for dropdown
  const sectorsOptions = useMemo(() => {
    return SECTORS.map((sector) => ({ value: sector.id, label: sector.name }));
  }, []);

  // Filter programs based on intent (simplified matching logic)
  const relevantPrograms = useMemo(() => {
    // In real app, this would be API call with intent data
    // For now, return all programs (will be filtered by backend)
    return mockPrograms.slice(0, 5);
  }, [formData.goals, formData.area, formData.stage]);

  const nextStep = () => {
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleProgramClick = (programId: number) => {
    setSelectedProgram(programId);
    setNeedsAccount(true); // In real app, check if user is logged in
    nextStep(); // Go to micro-commitment step
  };


  const handleSkipAccount = () => {
    // Allow user to continue without account
    setNeedsAccount(false);
    setStep(5); // Go to next steps
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, create account via API
    // After account creation, show Step 5 (What's next?)
    nextStep();
  };

  const handleContinueWithoutAccount = () => {
    // In real app, save session data
    router.push("/programs");
  };

  // Dynamic step count: 5 steps total, but step 4 (account) is conditional
  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0A0A0A] font-sans py-6 px-4 sm:py-10 sm:px-6 md:py-14 md:px-8">
      <div className="max-w-3xl mx-auto p-0">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Link href="/" aria-label="Mentwork home">
              <img
                src="/images/mentwork-logo.png"
                alt="Mentwork"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A0A0A] leading-tight pr-2">
              {step === 1 && "Let's understand your goals"}
              {step === 2 && "Programs designed for people with your goals"}
              {step === 3 && "Save your progress"}
              {step === 4 && "Create your account"}
              {step === 5 && "What's next?"}
            </h1>
            <div className="text-xs sm:text-sm font-bold text-[#6B6B6B] bg-[#F2F1EE] px-3 py-1 rounded-full border border-[#E7E5E1] shrink-0">
              Step {step} of {totalSteps}
            </div>
          </div>

          <div className="w-full bg-[#E7E5E1] h-2 rounded-full overflow-hidden mb-6 sm:mb-8">
            <div
              className="bg-[#F5C400] h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="border border-[#E7E5E1] shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-5 sm:p-8 md:p-10">
            {/* Step 1: Intent Snapshot */}
            {step === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <p className="text-[#6B6B6B] text-sm sm:text-base mb-4 sm:mb-6">
                  Help us match you with the right programs (takes 30 seconds)
                </p>

                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-sm sm:text-base font-semibold">
                      What are you trying to achieve right now? (Select up to 2)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Start a business",
                        "Grow an existing business",
                        "Improve a specific skill",
                        "Access opportunities / market",
                        "Learn from others",
                      ].map((goal) => (
                        <div
                          key={goal}
                          onClick={() => toggleGoal(goal)}
                          className={`p-3.5 rounded-xl cursor-pointer transition-all ${
                            formData.goals.includes(goal)
                              ? "border-2 border-[#0A0A0A] bg-[#FAF9F6] text-[#0A0A0A] shadow-xs"
                              : "border border-[#E7E5E1] hover:border-[#D8D5CF] bg-white text-[#4B4B4B]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{goal}</span>
                            {formData.goals.includes(goal) && (
                              <CheckCircle2 className="h-4 w-4 text-[#0A0A0A]" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {formData.goals.length > 0 && (
                      <p className="text-xs text-[#6B6B6B]">
                        {formData.goals.length} of 2 selected
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-sm sm:text-base font-bold text-[#0A0A0A]">
                      What timeframe are you looking at?
                    </Label>
                    <Select
                      value={formData.timeframe}
                      onValueChange={(value) => updateFormData("timeframe", value)}
                    >
                      <SelectTrigger className="w-full h-12 rounded-xl border-[#D8D5CF] bg-white">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediately">Immediately</SelectItem>
                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-12-months">6-12 months</SelectItem>
                        <SelectItem value="12-plus-months">12+ months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-sm sm:text-base font-bold text-[#0A0A0A]">
                      Which area best describes your interest?
                    </Label>
                    <MultiSelect
                      options={sectorsOptions}
                      selected={formData.area}
                      onSelectionChange={(selected) => updateFormData("area", selected)}
                      placeholder="Select area(s) of interest"
                    />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-sm sm:text-base font-bold text-[#0A0A0A]">
                      Which stage feels closest to you?
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Just exploring",
                        "Already started",
                        "Actively growing",
                        "Scaling / expanding",
                      ].map((stage) => (
                        <div
                          key={stage}
                          onClick={() => updateFormData("stage", stage)}
                          className={`p-3.5 rounded-xl cursor-pointer transition-all ${
                            formData.stage === stage
                              ? "border-2 border-[#0A0A0A] bg-[#FAF9F6] text-[#0A0A0A] shadow-xs font-semibold"
                              : "border border-[#E7E5E1] hover:border-[#D8D5CF] bg-white text-[#4B4B4B]"
                          }`}
                        >
                          <span className="text-sm font-semibold">{stage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Immediate Program Exposure */}
            {step === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                  Based on your goals, here are programs that might interest you
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {relevantPrograms.map((program) => (
                    <Card
                      key={program.id}
                      className="hover:shadow-md transition-all cursor-pointer border border-[#E7E5E1] hover:border-[#0A0A0A] rounded-2xl bg-white"
                      onClick={() => handleProgramClick(program.id)}
                    >
                      <CardHeader className="p-4 sm:p-5 pb-2 sm:pb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-base sm:text-lg font-bold text-[#0A0A0A] leading-tight break-words">
                            {program.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#6B6B6B] hover:text-[#0A0A0A]"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription className="text-xs sm:text-sm text-[#6B6B6B] min-h-[2.5rem] sm:min-h-[3rem] line-clamp-2">
                          {program.outcome}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#6B6B6B]">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {program.duration}
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-[#0A0A0A]">
                            <Star className="h-4 w-4 fill-[#F5C400] text-[#F5C400]" />
                            {program.rating}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-[#E7E5E1] text-[#4B4B4B]">
                            {program.stage}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-[#E7E5E1] text-[#4B4B4B]">
                            {program.format}
                          </Badge>
                        </div>
                        <div className="pt-2 border-t border-[#E7E5E1]">
                          <p className="text-xs font-bold text-[#0A0A0A]">
                            By {program.facilitator.name}
                          </p>
                          <p className="text-xs text-[#6B6B6B]">
                            {program.facilitator.credibility}
                          </p>
                        </div>
                        <Button
                          className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl hover:bg-[#E5B700] mt-3 h-11 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProgramClick(program.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Program
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#E7E5E1]">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-[#E7E5E1] text-[#0A0A0A] hover:bg-[#FAF9F6] h-11 font-semibold"
                    onClick={() => router.push("/programs")}
                  >
                    Explore All Programs
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Micro-Commitment */}
            {step === 3 && selectedProgram && (() => {
              const program = relevantPrograms.find((p) => p.id === selectedProgram);
              if (!program) return null;
              
              return (
                <div className="space-y-4 sm:space-y-6">
                  <Card className="border border-[#E7E5E1] rounded-2xl bg-[#FAF9F6] shadow-xs overflow-hidden">
                    <CardHeader className="p-5 sm:p-6 pb-2 sm:pb-4">
                      <div className="flex items-start gap-3 mb-2">
                        <BookOpen className="h-6 w-6 text-[#0A0A0A] flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg sm:text-xl font-bold text-[#0A0A0A] mb-1 leading-tight break-words">{program.title}</CardTitle>
                          <CardDescription className="text-sm text-[#6B6B6B] line-clamp-3">
                            {program.outcome}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 text-sm text-[#4B4B4B]">
                          <Clock className="h-4 w-4 text-[#6B6B6B]" />
                          <span>{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#0A0A0A] font-semibold">
                          <Star className="h-4 w-4 fill-[#F5C400] text-[#F5C400]" />
                          <span>{program.rating} ({program.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs border-[#E7E5E1] text-[#4B4B4B]">
                          {program.stage}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-[#E7E5E1] text-[#4B4B4B]">
                          {program.format}
                        </Badge>
                      </div>
                      
                      <div className="pt-3 border-t border-[#E7E5E1]">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#9B9B9B] mb-1">
                          Facilitator
                        </p>
                        <p className="text-sm font-bold text-[#0A0A0A]">{program.facilitator.name}</p>
                        <p className="text-xs text-[#6B6B6B]">{program.facilitator.credibility}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl hover:bg-[#E5B700] h-12 sm:h-14 text-sm sm:text-base shadow-xs"
                      onClick={() => {
                        setNeedsAccount(true);
                        nextStep();
                      }}
                    >
                      Create Account to Continue
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 shrink-0" />
                    </Button>
                    <p className="text-xs text-center text-[#6B6B6B]">
                      Create an account to view full program details and enroll
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Step 4: Lightweight Account Creation */}
            {step === 4 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-4 sm:mb-6">
                  <p className="text-[#6B6B6B] text-sm sm:text-base">
                    Create an account to save your progress
                  </p>
                </div>

                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-[11px] font-bold text-[#4B4B4B] uppercase tracking-wider">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      placeholder="Enter your full name"
                      className="h-12 rounded-xl text-sm border-[#D8D5CF] focus-visible:ring-[#0A0A0A] bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[11px] font-bold text-[#4B4B4B] uppercase tracking-wider">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="Enter your email address"
                      className="h-12 rounded-xl text-sm border-[#D8D5CF] focus-visible:ring-[#0A0A0A] bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-[11px] font-bold text-[#4B4B4B] uppercase tracking-wider">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      placeholder="Create a password (min. 8 characters)"
                      className="h-12 rounded-xl text-sm border-[#D8D5CF] focus-visible:ring-[#0A0A0A] bg-white"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-[#9B9B9B]">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl hover:bg-[#E5B700] h-12 shadow-xs"
                    >
                      Create Account & Continue
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 5: Clear Next Step */}
            {step === 5 && (
              <div className="space-y-4 sm:space-y-6 text-center">
                <CheckCircle2 className="h-14 w-14 mx-auto text-[#5B7B6E] mb-2 sm:mb-4" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A0A0A] mb-1">You&apos;re all set!</h2>
                <p className="text-[#6B6B6B] text-sm sm:text-base mb-4 sm:mb-6">
                  Here&apos;s what you can do next
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-left">
                  <Card className="border border-[#E7E5E1] rounded-2xl bg-white shadow-xs p-5">
                    <h3 className="text-base font-bold text-[#0A0A0A] mb-1">Join Next Session</h3>
                    <p className="text-xs text-[#6B6B6B] mb-4">
                      Enroll in the program you&apos;re interested in
                    </p>
                    <Button
                      className="w-full bg-[#0A0A0A] text-white font-bold rounded-xl hover:bg-[#2B2B2B] h-11 text-xs"
                      onClick={() => router.push(`/programs/${selectedProgram}`)}
                    >
                      View Program
                    </Button>
                  </Card>

                  <Card className="border border-[#E7E5E1] rounded-2xl bg-white shadow-xs p-5">
                    <h3 className="text-base font-bold text-[#0A0A0A] mb-1">Explore Programs</h3>
                    <p className="text-xs text-[#6B6B6B] mb-4">
                      Discover more programs matching your goals
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-[#E7E5E1] rounded-xl hover:bg-[#FAF9F6] text-[#0A0A0A] font-bold h-11 text-xs"
                      onClick={() => router.push("/programs")}
                    >
                      Browse Programs
                    </Button>
                  </Card>

                  <Card className="border border-[#E7E5E1] rounded-2xl bg-[#FAF9F6] shadow-xs p-5">
                    <h3 className="text-base font-bold text-[#0A0A0A] mb-1">Improve Matches</h3>
                    <p className="text-xs text-[#6B6B6B] mb-4">
                      Add more details to get better recommendations
                    </p>
                    <Button
                      className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl hover:bg-[#E5B700] h-11 text-xs"
                      onClick={() => router.push("/mentee/dashboard/profile")}
                    >
                      Complete Profile
                    </Button>
                  </Card>
                </div>

                <div className="pt-4 sm:pt-6 border-t border-[#E7E5E1]">
                  <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="w-full sm:w-[25%] rounded-xl border-[#E7E5E1] text-[#0A0A0A] hover:bg-[#FAF9F6] h-12 font-semibold flex items-center justify-center gap-2 shrink-0"
                      onClick={() => setStep(4)}
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button
                      className="w-full sm:flex-1 bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl hover:bg-[#E5B700] h-12 shadow-xs"
                      onClick={() => router.push("/mentee/dashboard")}
                    >
                      Go to Dashboard
                    </Button>
                  </div>
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
                    onClick={() => {
                      if (step === 4 && !selectedProgram) {
                        setStep(2);
                      } else {
                        prevStep();
                      }
                    }}
                    className="w-full sm:w-auto rounded-xl border-[#E7E5E1] text-[#0A0A0A] hover:bg-[#FAF9F6] h-12 px-5 font-semibold flex items-center justify-center gap-2"
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
                    disabled={formData.goals.length === 0 || !formData.timeframe || formData.area.length === 0 || !formData.stage}
                    className="w-full sm:w-auto bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl hover:bg-[#E5B700] h-12 px-6 shadow-xs flex items-center justify-center gap-2"
                  >
                    See Programs <ArrowRight className="h-4 w-4" />
                  </Button>
                )}

                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNeedsAccount(true);
                      setStep(4);
                    }}
                    className="w-full sm:w-auto rounded-xl border-[#E7E5E1] text-[#0A0A0A] hover:bg-[#FAF9F6] h-12 px-5 font-semibold flex items-center justify-center gap-2"
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
