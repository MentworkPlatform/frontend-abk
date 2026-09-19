"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Target,
  CheckCircle,
  Plus,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { CurriculumTemplate } from "@/types/curriculum";

// Mock demand data - in real app, this would come from API
const mockDemandSignals = [
  {
    id: 1,
    goal: "Start a business",
    stage: "Just exploring",
    description: "People want to launch their first business with a validated idea",
    demandLevel: "High",
    estimatedParticipants: 150,
  },
  {
    id: 2,
    goal: "Grow an existing business",
    stage: "Actively growing",
    description: "Business owners need help scaling from $10K to $100K+ monthly revenue",
    demandLevel: "High",
    estimatedParticipants: 89,
  },
  {
    id: 3,
    goal: "Improve digital marketing skills",
    stage: "Already started",
    description: "Entrepreneurs want to master SEO, social media, and paid advertising",
    demandLevel: "Very High",
    estimatedParticipants: 234,
  },
  {
    id: 4,
    goal: "Access market opportunities",
    stage: "Scaling / expanding",
    description: "Businesses need help connecting with investors, partners, and customers",
    demandLevel: "Medium",
    estimatedParticipants: 67,
  },
  {
    id: 5,
    goal: "Learn financial management",
    stage: "Actively growing",
    description: "Entrepreneurs need guidance on managing cash flow and securing funding",
    demandLevel: "High",
    estimatedParticipants: 112,
  },
  {
    id: 6,
    goal: "Develop leadership skills",
    stage: "Scaling / expanding",
    description: "Growing businesses need help building and managing teams effectively",
    demandLevel: "Medium",
    estimatedParticipants: 78,
  },
  {
    id: 7,
    goal: "Master tech skills",
    stage: "Just exploring",
    description: "People want to learn web development, data analysis, and technical skills",
    demandLevel: "Very High",
    estimatedParticipants: 189,
  },
];

// Mock templates - simplified for onboarding
const mockTemplates: CurriculumTemplate[] = [
  {
    id: "1",
    name: "Digital Marketing Bootcamp",
    description: "Complete curriculum covering SEO, social media, content marketing, and analytics",
    category: "Marketing",
    level: "beginner",
    estimatedDuration: 8,
    modules: [
      {
        id: "1",
        title: "Introduction to Digital Marketing",
        description: "Overview of digital marketing landscape",
        order: 1,
        estimatedDuration: 4,
        topics: [],
        learningObjectives: ["Understand digital marketing basics", "Identify key channels"],
        prerequisites: [],
      },
      {
        id: "2",
        title: "SEO Fundamentals",
        description: "On-page and off-page SEO techniques",
        order: 2,
        estimatedDuration: 8,
        topics: [],
        learningObjectives: ["Master SEO fundamentals", "Implement SEO strategies"],
        prerequisites: [],
      },
    ],
    tags: ["marketing", "seo", "social-media"],
    isPopular: true,
    usageCount: 1247,
    createdBy: "Mentwork Team",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Business Strategy & Planning",
    description: "Strategic planning framework for business growth",
    category: "Business",
    level: "intermediate",
    estimatedDuration: 6,
    modules: [
      {
        id: "1",
        title: "Strategic Planning Basics",
        description: "Foundation of strategic planning",
        order: 1,
        estimatedDuration: 4,
        topics: [],
        learningObjectives: ["Understand strategic planning", "Create strategic frameworks"],
        prerequisites: [],
      },
    ],
    tags: ["strategy", "planning", "business"],
    isPopular: true,
    usageCount: 892,
    createdBy: "Mentwork Team",
    createdAt: "2024-01-01",
  },
];

export default function TrainerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDemand, setSelectedDemand] = useState<typeof mockDemandSignals[0] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CurriculumTemplate | null>(null);
  const [useTemplate, setUseTemplate] = useState<boolean | null>(null);
  const [needsAccount, setNeedsAccount] = useState(false);
  const [formData, setFormData] = useState({
    // Step 4: Minimum Program Structure
    programTitle: "",
    programOutcome: "",
    // Step 5: Account Creation (only if needed)
    name: "",
    email: "",
    password: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get modules from template or empty
  const programModules = useMemo(() => {
    if (selectedTemplate) {
      return selectedTemplate.modules.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        order: m.order,
      }));
    }
    return [];
  }, [selectedTemplate]);

  const nextStep = () => {
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    // If on step 5 (account) and no demand/program data selected, go back to step 1
    if (step === 5 && !selectedDemand && !formData.programTitle) {
      setStep(1);
    } else {
    setStep((prev) => prev - 1);
    }
    window.scrollTo(0, 0);
  };

  const handleSelectDemand = (demand: typeof mockDemandSignals[0]) => {
    setSelectedDemand(demand);
    nextStep();
  };

  const handleStartProgram = () => {
    nextStep();
  };

  const handleSelectTemplate = (template: CurriculumTemplate) => {
    setSelectedTemplate(template);
    setUseTemplate(true);
    nextStep();
  };

  const handleStartFromScratch = () => {
    setSelectedTemplate(null);
    setUseTemplate(false);
    nextStep();
  };

  const handleSaveDraft = () => {
    // In real app, check if user is logged in
    // If logged in, save draft and continue to program creation
    // If not logged in, prompt for account
    // For now, check if we have account info
    if (!formData.name || !formData.email) {
      setNeedsAccount(true);
      nextStep();
    } else {
      // Already have account info, continue to program creation
      router.push(`/trainer/dashboard/programs/create?from=onboarding&title=${encodeURIComponent(formData.programTitle)}&outcome=${encodeURIComponent(formData.programOutcome)}&template=${selectedTemplate?.id || ''}`);
    }
  };


  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, create account and save draft
    // After account creation, show Step 6 with options to complete profile or complete program
    nextStep();
  };

  const totalSteps = 6;

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
              {step === 1 && "What problem do you want to solve?"}
              {step === 2 && "Confirm problem focus"}
              {step === 3 && "Build your program"}
              {step === 4 && "Add program details"}
              {step === 5 && "Save your program draft"}
              {step === 6 && "What's next?"}
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
            {/* Step 1: Demand Snapshot */}
            {step === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <p className="text-[#6B6B6B] text-sm sm:text-base mb-4 sm:mb-6">
                  Based on system signals and market data, here are problems people want help with
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {mockDemandSignals.map((demand) => (
                    <Card
                      key={demand.id}
                      className="hover:shadow-md transition-all cursor-pointer border border-[#E7E5E1] hover:border-[#0A0A0A] rounded-2xl bg-white"
                      onClick={() => handleSelectDemand(demand)}
                    >
                      <CardHeader className="p-4 sm:p-5 pb-2 sm:pb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-base sm:text-lg font-bold text-[#0A0A0A] leading-tight break-words">{demand.goal}</CardTitle>
                          <Badge
                            variant={
                              demand.demandLevel === "Very High"
                                ? "default"
                                : demand.demandLevel === "High"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs border-[#E7E5E1]"
                          >
                            {demand.demandLevel}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs sm:text-sm text-[#6B6B6B] line-clamp-2">{demand.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-5 pt-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B6B6B]">
                          <div className="flex items-center gap-1.5">
                            <Target className="h-3.5 w-3.5 shrink-0" />
                            <span>{demand.stage}</span>
                          </div>
                          <div className="font-semibold text-[#0A0A0A]">
                            <span>{demand.estimatedParticipants} interested</span>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-3 sm:mt-4 bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl hover:bg-[#E5B700] text-xs sm:text-sm h-11 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDemand(demand);
                          }}
                        >
                          Design a program for this
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Problem Selection */}
            {step === 2 && selectedDemand && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center">
                  <Target className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-[#0A0A0A]" />
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#0A0A0A] mb-1 sm:mb-2">You&apos;re creating a program for:</h2>
                  <Card className="bg-[#FAF9F6] border border-[#E7E5E1] rounded-2xl text-left">
                    <CardContent className="p-5 sm:p-6">
                      <h3 className="text-base sm:text-lg font-bold text-[#0A0A0A] mb-1 sm:mb-2 leading-tight">{selectedDemand.goal}</h3>
                      <p className="text-[#4B4B4B] text-sm sm:text-base mb-3 sm:mb-4">{selectedDemand.description}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[#6B6B6B]">
                        <Badge variant="outline" className="border-[#E7E5E1]">{selectedDemand.stage}</Badge>
                        <span className="font-semibold text-[#0A0A0A]">{selectedDemand.estimatedParticipants} people interested</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button
                  className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl hover:bg-[#E5B700] h-12 sm:h-14 text-sm sm:text-base shadow-xs"
                  onClick={handleStartProgram}
                >
                  Start Program
                </Button>
              </div>
            )}

            {/* Step 3: Program Creation (Scaffolded) */}
            {step === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Build your program</h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Choose a template to get started quickly, or build from scratch
                  </p>
                    </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Template Option */}
                  <Card className="hover:shadow-md transition-shadow border-2 hover:border-[#0A0A0A] cursor-pointer active:border-[#0A0A0A]">
                    <CardHeader className="pb-2 sm:pb-6">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-[#0A0A0A] shrink-0" />
                        <CardTitle className="text-base sm:text-lg">Start from Template</CardTitle>
                      </div>
                      <CardDescription className="text-sm">
                        Recommended: Use a proven curriculum structure
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 sm:space-y-3">
                        {mockTemplates.map((template) => (
                          <div
                            key={template.id}
                            onClick={() => handleSelectTemplate(template)}
                            className="p-2.5 sm:p-3 border border-[#E7E5E1] rounded-xl hover:bg-[#FAF9F6] cursor-pointer transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-xs sm:text-sm text-[#0A0A0A] break-words">{template.name}</p>
                                <p className="text-xs text-[#2B2B2B]/70 mt-1 line-clamp-2">
                                  {template.description}
                                </p>
                              </div>
                              {template.isPopular && (
                                <Badge className="text-xs bg-[#FAF9F6] text-[#0A0A0A] border border-[#E7E5E1] font-semibold">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-[#2B2B2B]/60 font-medium">
                              <span>{template.estimatedDuration} weeks</span>
                              <span>•</span>
                              <span>{template.modules.length} modules</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Scratch Option */}
                  <Card className="hover:shadow-md transition-shadow border-2 hover:border-[#0A0A0A] cursor-pointer active:border-[#0A0A0A]">
                    <CardHeader className="pb-2 sm:pb-6">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-[#0A0A0A] shrink-0" />
                        <CardTitle className="text-base sm:text-lg">Start from Scratch</CardTitle>
                      </div>
                      <CardDescription className="text-sm">
                        Build a custom program tailored to your needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full h-14 sm:h-20 text-sm sm:text-base border-[#E7E5E1] hover:border-[#0A0A0A] font-semibold rounded-xl"
                        onClick={handleStartFromScratch}
                      >
                        <FileText className="h-5 w-5 mr-2 text-[#0A0A0A]" />
                        Create Custom Program
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 4: Minimum Program Structure */}
            {step === 4 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-4 sm:mb-6">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Add the essential details to save your program draft
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                    Program draft – Step 1 of 3
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="programTitle">Program Title *</Label>
                    <Input
                      id="programTitle"
                      value={formData.programTitle}
                      onChange={(e) => updateFormData("programTitle", e.target.value)}
                      placeholder="e.g., Digital Marketing Bootcamp"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="programOutcome">High-level Outcome *</Label>
                    <Textarea
                      id="programOutcome"
                      value={formData.programOutcome}
                      onChange={(e) => updateFormData("programOutcome", e.target.value)}
                      placeholder="What will participants achieve? e.g., Master digital marketing from SEO to social media advertising"
                      rows={3}
                      required
                    />
                  </div>

                  {programModules.length > 0 && (
                    <div className="space-y-2">
                      <Label>Module Structure (Pre-filled from template)</Label>
                      <Card className="bg-[#FAF9F6] border-[#E7E5E1]">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            {programModules.map((module, index) => (
                              <div
                                key={module.id}
                                className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#E7E5E1]"
                              >
                                <span className="text-xs font-bold text-[#0A0A0A] w-6">
                                  {index + 1}.
                                </span>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-[#0A0A0A]">{module.title}</p>
                                  {module.description && (
                                    <p className="text-xs text-[#2B2B2B]/70">{module.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {programModules.length === 0 && (
                    <div className="space-y-2">
                      <Label>Module Structure</Label>
                      <Card className="bg-[#FAF9F6] border-dashed border-[#E7E5E1]">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-500">
                            You'll add modules in the next step
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl h-12 text-sm shadow-xs"
                    onClick={handleSaveDraft}
                    disabled={!formData.programTitle || !formData.programOutcome}
                  >
                    Save Draft & Continue Building
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    You'll continue to Step 2: Build Curriculum. Account creation will be prompted if needed to save your progress.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Account Creation */}
            {step === 5 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-4 sm:mb-6">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Create an account to save your program draft and continue building
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                    After creating your account, you'll continue to Step 2: Build Curriculum
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
                    <p className="text-xs text-gray-500">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl h-12 text-sm shadow-xs"
                    >
                      Create Account & Continue Building
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 6: Post-Onboarding Next Actions */}
            {step === 6 && (
              <div className="space-y-4 sm:space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#5B7B6E]/10 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <CheckCircle className="h-8 w-8 text-[#5B7B6E]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-[#0A0A0A]">Account Created!</h2>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                  What would you like to do next?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <Card className="bg-white border-2 border-[#0A0A0A] hover:shadow-md transition-shadow cursor-pointer text-left">
                    <CardHeader className="pb-2 sm:pb-6">
                      <CardTitle className="text-base sm:text-lg text-[#0A0A0A]">Complete Program</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mb-3 sm:mb-4">
                        Continue building your program draft and add curriculum modules
                      </p>
                      <Button
                        className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl h-11 text-sm shadow-xs"
                        onClick={() => router.push(`/trainer/dashboard/programs/create?from=onboarding&title=${encodeURIComponent(formData.programTitle)}&outcome=${encodeURIComponent(formData.programOutcome)}&template=${selectedTemplate?.id || ''}`)}
                      >
                        Continue Building Program
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#E7E5E1] hover:border-[#0A0A0A] hover:shadow-md transition-shadow cursor-pointer text-left">
                    <CardHeader className="pb-2 sm:pb-6">
                      <CardTitle className="text-base sm:text-lg text-[#0A0A0A]">Complete Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mb-3 sm:mb-4">
                        Add your expertise, experience, and profile details
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-[#E7E5E1] hover:border-[#0A0A0A] font-semibold rounded-xl h-11 text-sm"
                        onClick={() => router.push("/trainer/profile")}
                      >
                        Go to Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-4 sm:pt-6">
                  <Button
                    variant="ghost"
                    className="w-full text-[#2B2B2B] hover:text-[#0A0A0A] font-medium"
                    onClick={() => router.push("/trainer/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 6 && (
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-6 sm:mt-8">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <div className="hidden sm:block" />
              )}

                {step === 1 && (
                <Button
                  type="button"
                    variant="outline"
                    onClick={() => {
                      setNeedsAccount(true);
                      setStep(5); // Go to account creation
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2"
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
