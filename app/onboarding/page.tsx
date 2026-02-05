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
              {step === 1 && "Let's understand your goals"}
              {step === 2 && "Programs designed for people with your goals"}
              {step === 3 && "Save your progress"}
              {step === 4 && "Create your account"}
              {step === 5 && "What's next?"}
            </h1>
            <div className="text-sm font-medium">
              Step {step} of {totalSteps}
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
            {/* Step 1: Intent Snapshot */}
            {step === 1 && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-6">
                  Help us match you with the right programs (takes 30 seconds)
                </p>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
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
                          className={`p-2.5 border rounded-md cursor-pointer transition-all ${
                            formData.goals.includes(goal)
                              ? "border-[#FFD500] bg-yellow-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{goal}</span>
                            {formData.goals.includes(goal) && (
                              <CheckCircle2 className="h-4 w-4 text-[#FFD500]" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {formData.goals.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {formData.goals.length} of 2 selected
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      What timeframe are you looking at?
                    </Label>
                    <Select
                      value={formData.timeframe}
                      onValueChange={(value) => updateFormData("timeframe", value)}
                    >
                      <SelectTrigger className="w-full">
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

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Which area best describes your interest?
                    </Label>
                    <MultiSelect
                      options={sectorsOptions}
                      selected={formData.area}
                      onSelectionChange={(selected) => updateFormData("area", selected)}
                      placeholder="Select area(s) of interest"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
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
                          className={`p-2.5 border rounded-md cursor-pointer transition-all ${
                            formData.stage === stage
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

            {/* Step 2: Immediate Program Exposure */}
            {step === 2 && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-6">
                  Based on your goals, here are programs that might interest you
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relevantPrograms.map((program) => (
                    <Card
                      key={program.id}
                      className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-[#FFD500]"
                      onClick={() => handleProgramClick(program.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg leading-tight">
                            {program.title}
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
                          {program.outcome}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {program.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {program.rating}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {program.stage}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {program.format}
                          </Badge>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500">
                            By {program.facilitator.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {program.facilitator.credibility}
                          </p>
                        </div>
                        <Button
                          className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000] mt-3"
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

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
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
                <div className="space-y-6">
                  <Card className="border-2 border-[#FFD500]">
                    <CardHeader>
                      <div className="flex items-start gap-3 mb-4">
                        <BookOpen className="h-8 w-8 text-[#FFD500] flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                          <CardDescription className="text-base mb-4">
                            {program.outcome}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-700">{program.rating} ({program.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {program.stage}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {program.format}
                        </Badge>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Facilitator
                        </p>
                        <p className="text-sm text-gray-600">{program.facilitator.name}</p>
                        <p className="text-xs text-gray-500">{program.facilitator.credibility}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000] h-14"
                      onClick={() => {
                        setNeedsAccount(true);
                        nextStep();
                      }}
                    >
                      Create Account to Continue
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                      Create an account to view full program details and enroll
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Step 4: Lightweight Account Creation */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    Create an account to save your progress
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
                      Create Account & Continue
                    </Button>
                    </div>
                </form>
              </div>
            )}

            {/* Step 5: Clear Next Step */}
            {step === 5 && (
              <div className="space-y-6 text-center">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
                <p className="text-gray-600 mb-6">
                  Here's what you can do next
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">Join Next Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Enroll in the program you're interested in
                      </p>
                      <Button
                        className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]"
                        onClick={() => router.push(`/programs/${selectedProgram}`)}
                      >
                        View Program
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">Explore Similar Programs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Discover more programs matching your goals
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push("/programs")}
                      >
                        Browse Programs
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow border-2 border-[#FFD500] bg-yellow-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Improve Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Add more details to get better matches
                      </p>
                      <Button
                        className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]"
                        onClick={() => router.push("/mentee/dashboard/profile")}
                      >
                        Complete Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-6 border-t">
                  <Button
                    className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]"
                    onClick={() => router.push("/mentee/dashboard")}
                  >
                    Go to Dashboard
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
                    disabled={formData.goals.length === 0 || !formData.timeframe || formData.area.length === 0 || !formData.stage}
                  className="bg-[#FFD500] text-black hover:bg-[#e6c000] flex items-center gap-2"
                >
                    See Programs <ArrowRight className="h-4 w-4" />
                </Button>
                )}

                {step === 2 && (
                <Button
                  type="button"
                    variant="outline"
                    onClick={() => {
                      // Skip to next steps without selecting a program
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
