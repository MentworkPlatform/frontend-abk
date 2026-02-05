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
    setStep((prev) => prev - 1);
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

  const handleSkipAccount = () => {
    setNeedsAccount(false);
    setStep(6); // Go to next steps
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, create account and save draft, then continue to program creation
    router.push(`/trainer/dashboard/programs/create?from=onboarding&title=${encodeURIComponent(formData.programTitle)}&outcome=${encodeURIComponent(formData.programOutcome)}&template=${selectedTemplate?.id || ''}`);
  };

  const totalSteps = 6;

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
              {step === 1 && "Here are problems people want help with"}
              {step === 2 && "Create a program for this"}
              {step === 3 && "Build your program"}
              {step === 4 && "Program draft – Step 1 of 3"}
              {step === 5 && "Create your account"}
              {step === 6 && "What's next?"}
            </h1>
            <div className="text-sm font-medium">
              {step === 4 ? "Program draft – Step 1 of 3" : `Step ${step} of ${totalSteps}`}
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
            {/* Step 1: Demand Snapshot */}
            {step === 1 && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-6">
                  Based on system signals and market data, here are problems people want help with
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockDemandSignals.map((demand) => (
                    <Card
                      key={demand.id}
                      className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-[#FFD500]"
                      onClick={() => handleSelectDemand(demand)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{demand.goal}</CardTitle>
                          <Badge
                            variant={
                              demand.demandLevel === "Very High"
                                ? "default"
                                : demand.demandLevel === "High"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {demand.demandLevel} Demand
                          </Badge>
                        </div>
                        <CardDescription>{demand.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Target className="h-4 w-4" />
                            <span>{demand.stage}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">{demand.estimatedParticipants}</span>
                            <span>interested</span>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4 bg-[#FFD500] text-black hover:bg-[#e6c000]"
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
              <div className="space-y-6">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-[#FFD500]" />
                  <h2 className="text-xl font-bold mb-2">You're creating a program for:</h2>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-2">{selectedDemand.goal}</h3>
                      <p className="text-gray-700 mb-4">{selectedDemand.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Badge variant="outline">{selectedDemand.stage}</Badge>
                        <span>{selectedDemand.estimatedParticipants} people interested</span>
                      </div>
                    </CardContent>
                  </Card>
                    </div>

                <Button
                  className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000] h-14 text-lg"
                  onClick={handleStartProgram}
                >
                  Start Program
                </Button>
                    </div>
            )}

            {/* Step 3: Program Creation (Scaffolded) */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">Build your program</h2>
                  <p className="text-gray-600">
                    Choose a template to get started quickly, or build from scratch
                  </p>
                    </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Template Option */}
                  <Card className="hover:shadow-md transition-shadow border-2 hover:border-[#FFD500] cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-8 w-8 text-[#FFD500]" />
                        <CardTitle>Start from Template</CardTitle>
                      </div>
                      <CardDescription>
                        Recommended: Use a proven curriculum structure
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockTemplates.map((template) => (
                          <div
                            key={template.id}
                            onClick={() => handleSelectTemplate(template)}
                            className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-sm">{template.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {template.description}
                                </p>
                              </div>
                              {template.isPopular && (
                                <Badge variant="default" className="text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
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
                  <Card className="hover:shadow-md transition-shadow border-2 hover:border-[#FFD500] cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Plus className="h-8 w-8 text-[#FFD500]" />
                        <CardTitle>Start from Scratch</CardTitle>
                      </div>
                      <CardDescription>
                        Build a custom program tailored to your needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full h-20"
                        onClick={handleStartFromScratch}
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        Create Custom Program
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 4: Minimum Program Structure */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    Add the essential details to save your program draft
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Program draft – Step 1 of 3
                  </p>
                </div>

                <div className="space-y-4">
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
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            {programModules.map((module, index) => (
                              <div
                                key={module.id}
                                className="flex items-center gap-2 p-2 bg-white rounded border"
                              >
                                <span className="text-sm font-medium text-gray-500 w-8">
                                  {index + 1}.
                                </span>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{module.title}</p>
                                  {module.description && (
                                    <p className="text-xs text-gray-500">{module.description}</p>
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
                      <Card className="bg-gray-50 border-dashed">
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
                    className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]"
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
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    Create an account to save your program draft and continue building
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    After creating your account, you'll continue to Step 2: Build Curriculum
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
                      Create Account & Continue Building
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        // Continue to program creation without account (session-based)
                        router.push(`/trainer/dashboard/programs/create?from=onboarding&title=${encodeURIComponent(formData.programTitle)}&outcome=${encodeURIComponent(formData.programOutcome)}&template=${selectedTemplate?.id || ''}`);
                      }}
                    >
                      Continue without account (progress may not be saved)
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 6: Post-Onboarding Next Actions */}
            {step === 6 && (
              <div className="space-y-6 text-center">
                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Program Draft Saved!</h2>
                <p className="text-gray-600 mb-6">
                  Continue building your program or explore other options
                </p>

                <div className="space-y-4">
                  <Button
                    className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000] h-14 text-lg"
                    onClick={() => router.push(`/trainer/dashboard/programs/create?from=onboarding&title=${encodeURIComponent(formData.programTitle)}&outcome=${encodeURIComponent(formData.programOutcome)}&template=${selectedTemplate?.id || ''}`)}
                  >
                    Continue Building Program (Step 2: Build Curriculum)
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">Invite Mentors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          Find and invite mentors to teach specific topics
                        </p>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => router.push("/trainer/dashboard")}
                        >
                          Manage Program
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">Review Demand Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          See more demand signals and market data
                        </p>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => router.push("/trainer/dashboard")}
                        >
                          View Insights
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 6 && (
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
                    variant="outline"
                    onClick={() => router.push("/trainer/dashboard")}
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
