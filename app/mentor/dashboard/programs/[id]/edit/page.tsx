"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Plus, Image, Info, Save, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Sample program data for editing
const sampleProgram = {
  id: 1,
  title: "Startup Funding Masterclass",
  tagline: "Learn how to secure funding for your startup with proven strategies",
  description:
    "This comprehensive program covers everything you need to know about securing funding for your startup, from creating a compelling pitch deck to negotiating with investors. Learn directly from an experienced investor who has helped startups raise over $10M in venture capital.",
  highlights: [
    "Create a compelling pitch deck that gets investors' attention",
    "Develop realistic financial projections that build credibility",
    "Learn effective valuation strategies for early-stage startups",
    "Master investor negotiation tactics that protect your interests",
  ],
  category: "business-growth",
  industry: "technology",
  level: "intermediate",
  language: "english",
  format: "virtual",
  type: "group",
  price: "1200",
  hasFreeSession: true,
  autoApproveApplications: false,
  isPublic: true,
  offerCertificate: true,
  sessions: [
    {
      id: "session_1",
      title: "Introduction to Startup Funding",
      description: "Overview of funding options and understanding investor expectations",
      isFree: true,
      duration: "90",
      date: "2025-06-15",
      time: "10:00",
      contentItems: [
        "Different types of startup funding",
        "When to raise capital vs. bootstrapping",
        "Understanding the funding landscape in Africa",
        "What investors look for in early-stage startups",
      ],
    },
    {
      id: "session_2",
      title: "Creating a Compelling Pitch Deck",
      description: "Learn how to structure your pitch deck to attract investors",
      isFree: false,
      duration: "90",
      date: "2025-06-22",
      time: "10:00",
      contentItems: [
        "Key components of an effective pitch deck",
        "Storytelling techniques that captivate investors",
        "Common pitch deck mistakes to avoid",
        "Live critique of real pitch decks",
      ],
    },
    {
      id: "session_3",
      title: "Financial Projections",
      description: "How to create realistic financial projections that investors trust",
      isFree: false,
      duration: "90",
      date: "2025-06-29",
      time: "10:00",
      contentItems: [
        "Building financial models for early-stage startups",
        "Revenue forecasting methods that make sense",
        "Understanding unit economics and growth metrics",
        "How to present your financials in a compelling way",
      ],
    },
  ],
  bonuses: [
    {
      id: "bonus_1",
      title: "Pitch Deck Template Bundle",
      description: "Ready-to-use templates to create your investor pitch deck",
    },
    {
      id: "bonus_2",
      title: "Financial Model Spreadsheet",
      description: "Customizable Excel/Google Sheets template for creating financial projections",
    },
  ],
  coverImage: null,
}

type ProgramSession = {
  id: string
  title: string
  description: string
  isFree: boolean
  duration: string
  date: string
  time: string
  contentItems: string[]
}

type ProgramBonus = {
  id: string
  title: string
  description: string
}

export default function EditProgramPage() {
  const params = useParams()
  const router = useRouter()
  const programId = params.id
  
  const [activeTab, setActiveTab] = useState("basic")
  const [programData, setProgramData] = useState(sampleProgram)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Fetch program data
  useEffect(() => {
    // In a real app, you would fetch the program data from your API
    setIsLoading(false)
  }, [programId])

  // Session management
  const addSession = () => {
    const newSession = {
      id: `session_${Date.now()}`,
      title: "",
      description: "",
      isFree: false,
      duration: "60",
      date: "",
      time: "",
      contentItems: ["", "", "", ""]
    }
    setProgramData({
      ...programData,
      sessions: [...programData.sessions, newSession]
    })
  }

  const updateSession = (index: number, data: Partial<ProgramSession>) => {
    const updatedSessions = [...programData.sessions]
    updatedSessions[index] = { ...updatedSessions[index], ...data }
    setProgramData({ ...programData, sessions: updatedSessions })
  }

  const removeSession = (index: number) => {
    const updatedSessions = [...programData.sessions]
    updatedSessions.splice(index, 1)
    setProgramData({ ...programData, sessions: updatedSessions })
  }

  const updateSessionContentItem = (sessionIndex: number, itemIndex: number, value: string) => {
    const updatedSessions = [...programData.sessions]
    const updatedContentItems = [...updatedSessions[sessionIndex].contentItems]
    updatedContentItems[itemIndex] = value
    updatedSessions[sessionIndex].contentItems = updatedContentItems
    setProgramData({ ...programData, sessions: updatedSessions })
  }

  const addSessionContentItem = (sessionIndex: number) => {
    const updatedSessions = [...programData.sessions]
    updatedSessions[sessionIndex].contentItems.push("")
    setProgramData({ ...programData, sessions: updatedSessions })
  }

  const removeSessionContentItem = (sessionIndex: number, itemIndex: number) => {
    const updatedSessions = [...programData.sessions]
    updatedSessions[sessionIndex].contentItems.splice(itemIndex, 1)
    setProgramData({ ...programData, sessions: updatedSessions })
  }

  // Highlight management
  const updateHighlight = (index: number, value: string) => {
    const updatedHighlights = [...programData.highlights]
    updatedHighlights[index] = value
    setProgramData({ ...programData, highlights: updatedHighlights })
  }

  const addHighlight = () => {
    setProgramData({
      ...programData,
      highlights: [...programData.highlights, ""]
    })
  }

  const removeHighlight = (index: number) => {
    const updatedHighlights = [...programData.highlights]
    updatedHighlights.splice(index, 1)
    setProgramData({ ...programData, highlights: updatedHighlights })
  }

  // Bonus management
  const addBonus = () => {
    const newBonus = {
      id: `bonus_${Date.now()}`,
      title: "",
      description: ""
    }
    setProgramData({
      ...programData,
      bonuses: [...programData.bonuses, newBonus]
    })
  }

  const updateBonus = (index: number, data: Partial<ProgramBonus>) => {
    const updatedBonuses = [...programData.bonuses]
    updatedBonuses[index] = { ...updatedBonuses[index], ...data }
    setProgramData({ ...programData, bonuses: updatedBonuses })
  }

  const removeBonus = (index: number) => {
    const updatedBonuses = [...programData.bonuses]
    updatedBonuses.splice(index, 1)
    setProgramData({ ...programData, bonuses: updatedBonuses })
  }

  // Image upload handling
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProgramData({ ...programData, coverImage: e.target.files[0] })
    }
  }

  // Save program
  const handleSave = async () => {
    setIsSaving(true)
    
    // In a real app, you would send the data to your API
    console.log("Saving program data:", programData)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1500)
  }

  // Delete program
  const handleDelete = async () => {
    // In a real app, you would send a delete request to your API
    console.log("Deleting program:", programId)
    
    // Navigate to the programs page after deletion
    router.push("/mentor/dashboard/programs")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD500] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading program...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Link href={`/mentor/dashboard/programs/${programId}`} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Program
              </Link>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold">Edit Program</h1>
                <Badge variant="outline">{programData.isPublic ? "Published" : "Draft"}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Program</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this program? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      Delete Program
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Program is published</h3>
                <p className="text-sm text-gray-600">
                  Changes you make will be immediately visible to users. Consider creating a duplicate if you want to make major changes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Program Basic Information</CardTitle>
                <CardDescription>Edit the essential details about your mentorship program</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="program-title">Program Title*</Label>
                  <Input 
                    id="program-title" 
                    placeholder="e.g., Startup Funding Masterclass"
                    value={programData.title}
                    onChange={(e) => setProgramData({ ...programData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="program-tagline">Tagline/Subtitle*</Label>
                  <Input 
                    id="program-tagline" 
                    placeholder="A brief, catchy description of your program"
                    value={programData.tagline}
                    onChange={(e) => setProgramData({ ...programData, tagline: e.target.value })}
                    required
                  />
                  <p className="text-sm text-gray-500">This will appear under your title and in search results</p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="program-description">Program Description*</Label>
                  <Textarea 
                    id="program-description" 
                    placeholder="Provide a detailed description of your program and its benefits"
                    rows={5}
                    value={programData.description}
                    onChange={(e) => setProgramData({ ...programData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="program-category">Category*</Label>
                    <Select 
                      value={programData.category} 
                      onValueChange={(value) => setProgramData({ ...programData, category: value })}
                      required
                    >
                      <SelectTrigger id="program-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business-growth">Business Growth</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="product-development">Product Development</SelectItem>
                        <SelectItem value="strategy">Strategy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="program-industry">Industry*</Label>
                    <Select 
                      value={programData.industry} 
                      onValueChange={(value) => setProgramData({ ...programData, industry: value })}
                      required
                    >
                      <SelectTrigger id="program-industry">
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="all">All Industries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="program-level">Experience Level*</Label>
                    <Select 
                      value={programData.level} 
                      onValueChange={(value) => setProgramData({ ...programData, level: value })}
                      required
                    >
                      <SelectTrigger id="program-level">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="all-levels">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="program-language">Language*</Label>
                    <Select 
                      value={programData.language} 
                      onValueChange={(value) => setProgramData({ ...programData, language: value })}
                      required
                    >
                      <SelectTrigger id="program-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                        <SelectItem value="swahili">Swahili</SelectItem>
                        <SelectItem value="yoruba">Yoruba</SelectItem>
                        <SelectItem value="hausa">Hausa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Program Type*</Label>
                  <RadioGroup 
                    value={programData.type} 
                    onValueChange={(value) => setProgramData({ ...programData, type: value })}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="one-on-one" id="one-on-one" />
                      <Label htmlFor="one-on-one" className="font-normal">1:1 Program (Individual mentees)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="group" id="group" />
                      <Label htmlFor="group" className="font-normal">Group Program (Multiple mentees)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="program-format">Program Format*</Label>
                  <Select 
                    value={programData.format} 
                    onValueChange={(value) => setProgramData({ ...programData, format: value })}
                    required
                  >
                    <SelectTrigger id="program-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual (Online sessions)</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="hybrid">Hybrid (Mix of online and in-person)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Cover Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
                    {programData.coverImage ? (
                      <div className="space-y-3">
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mx-auto max-w-md">
                          <img 
                            src="/placeholder.svg?height=300&width=500" 
                            alt="Program cover" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setProgramData({ ...programData, coverImage: null })}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="cover-image-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                          >
                            <span>Upload an image</span>
                            <input
                              id="cover-image-upload"
                              name="cover-image-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          High-quality image recommended (PNG, JPG, WEBP)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Program Content</CardTitle>
                <CardDescription>Define what participants will learn and the structure of your program</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">What Participants Will Learn</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add 3-5 key learning outcomes that will appear on your program page</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-3">
                    {programData.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={highlight}
                          onChange={(e) => updateHighlight(index, e.target.value)}
                          placeholder={`Learning outcome #${index + 1}`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeHighlight(index)}
                          disabled={programData.highlights.length <= 3}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addHighlight}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Learning Outcome
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">Program Sessions</Label>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Define the sessions that make up your program</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="free-session"
                          checked={programData.hasFreeSession}
                          onCheckedChange={(checked) => {
                            setProgramData({ ...programData, hasFreeSession: checked })
                            if (programData.sessions.length > 0) {
                              // Update first session free status
                              const updatedSessions = [...programData.sessions]
                              updatedSessions[0].isFree = checked
                              setProgramData({ ...programData, sessions: updatedSessions, hasFreeSession: checked })
                            }
                          }}
                        />
                        <Label htmlFor="free-session" className="text-sm">Include free session</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {programData.sessions.map((session, index) => (
                      <Card key={session.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">
                              Session {index + 1}: {session.title || "Untitled Session"}
                              {session.isFree && <Badge className="ml-2 bg-green-500 text-white">Free</Badge>}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSession(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`session-${index}-title`}>Session Title*</Label>
                              <Input
                                id={`session-${index}-title`}
                                value={session.title}
                                onChange={(e) => updateSession(index, { title: e.target.value })}
                                placeholder="e.g., Introduction to Startup Funding"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`session-${index}-free`}>Session Type</Label>
                              <div className="flex items-center h-10">
                                <Switch
                                  id={`session-${index}-free`}
                                  checked={session.isFree}
                                  onCheckedChange={(checked) => {
                                    // Only first session can be free
                                    if (index === 0) {
                                      updateSession(index, { isFree: checked })
                                      setProgramData({ ...programData, hasFreeSession: checked })
                                    }
                                  }}
                                  disabled={index !== 0}
                                />
                                <Label htmlFor={`session-${index}-free`} className="ml-2">
                                  {index === 0 ? "Free preview session" : "Paid session"}
                                </Label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`session-${index}-description`}>Session Description*</Label>
                            <Textarea
                              id={`session-${index}-description`}
                              value={session.description}
                              onChange={(e) => updateSession(index, { description: e.target.value })}
                              placeholder="Describe what this session will cover"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`session-${index}-duration`}>Duration (minutes)*</Label>
                              <Input
                                id={`session-${index}-duration`}
                                type="number"
                                value={session.duration}
                                onChange={(e) => updateSession(index, { duration: e.target.value })}
                                placeholder="e.g., 60"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`session-${index}-date`}>Date</Label>
                              <Input
                                id={`session-${index}-date`}
                                type="date"
                                value={session.date}
                                onChange={(e) => updateSession(index, { date: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`session-${index}-time`}>Time</Label>
                              <Input
                                id={`session-${index}-time`}
                                type="time"
                                value={session.time}
                                onChange={(e) => updateSession(index, { time: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Session Content</Label>
                            <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
                              {session.contentItems.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex gap-2">
                                  <Input
                                    value={item}
                                    onChange={(e) => updateSessionContentItem(index, itemIndex, e.target.value)}
                                    placeholder={`Content item #${itemIndex + 1}`}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSessionContentItem(index, itemIndex)}
                                    disabled={session.contentItems.length <= 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => addSessionContentItem(index)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Content Item
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSession}
                    className="w-full border-dashed"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Session
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">Bonus Materials</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add valuable resources that will be included in your program</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {programData.bonuses.map((bonus, index) => (
                    <div key={bonus.id} className="space-y-3 border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Bonus #{index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBonus(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`bonus-${index}-title`}>Title*</Label>
                          <Input
                            id={`bonus-${index}-title`}
                            value={bonus.title}
                            onChange={(e) => updateBonus(index, { title: e.target.value })}
                            placeholder="e.g., Financial Model Template"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`bonus-${index}-description`}>Description*</Label>
                          <Input
                            id={`bonus-${index}-description`}
                            value={bonus.description}
                            onChange={(e) => updateBonus(index, { description: e.target.value })}
                            placeholder="e.g., Ready-to-use Excel template for financial projections"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addBonus}
                    className="w-full border-dashed"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bonus Material
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Program Pricing</CardTitle>
                <CardDescription>Set the price for your program and manage enrollment options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="program-price">Program Price (USD)*</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <Input
                      id="program-price"
                      type="number"
                      placeholder="e.g., 1200"
                      className="pl-8"
                      value={programData.price}
                      onChange={(e) => setProgramData({ ...programData, price: e.target.value })}
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Recommended price: $800-$1500 for group programs, $1500-$3000 for 1:1 programs
                  </p>
                </div>

                <div className="py-4 px-6 bg-[#f8f8f8] rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-3">Commission Structure</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    As a mentor, you'll receive a percentage of the program price based on your activity level:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="border rounded p-3 bg-white">
                      <p className="text-sm font-medium">Bronze</p>
                      <p className="text-lg font-bold">75%</p>
                      <p className="text-xs text-gray-500">0-10 sessions</p>
                    </div>
                    <div className="border rounded p-3 bg-white">
                      <p className="text-sm font-medium">Silver</p>
                      <p className="text-lg font-bold">80%</p>
                      <p className="text-xs text-gray-500">11-30 sessions</p>
                    </div>
                    <div className="border rounded p-3 bg-white">
                      <p className="text-sm font-medium">Gold</p>
                      <p className="text-lg font-bold">85%</p>
                      <p className="text-xs text-gray-500">31-75 sessions</p>
                    </div>
                    <div className="border rounded p-3 bg-white">
                      <p className="text-sm font-medium">Platinum</p>
                      <p className="text-lg font-bold">90%</p>
                      <p className="text-xs text-gray-500">76+ sessions</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="program-limit" className="block">Group Size Limit</Label>
                      <p className="text-sm text-gray-500">Maximum number of participants (Group programs only)</p>
                    </div>
                    <Select disabled={programData.type !== "group"}>
                      <SelectTrigger id="program-limit" className="w-24">
                        <SelectValue placeholder="10" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="unlimited">No limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Price Calculator</Label>
                  <Card>
                    <CardContent className="py-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-200">
                          <span className="text-gray-600">Program Price</span>
                          <span className="font-medium">${programData.price || "0"}</span>
                        </div>
                        
                        <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-200">
                          <span className="text-gray-600">Platform Fee (15%)</span>
                          <span className="font-medium text-red-500">-${(Number(programData.price || 0) * 0.15).toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className="font-medium">Your Earnings per Enrollment</span>
                          <span className="font-bold text-lg">${(Number(programData.price || 0) * 0.85).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Program Settings</CardTitle>
                <CardDescription>Configure additional settings for your program</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <Label htmlFor="auto-approve" className="block font-medium">Auto-approve applications</Label>
                    <p className="text-sm text-gray-500">Automatically approve mentee applications without review</p>
                  </div>
                  <Switch
                    id="auto-approve"
                    checked={programData.autoApproveApplications}
                    onCheckedChange={(checked) => setProgramData({ ...programData, autoApproveApplications: checked })}
                  />
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <Label htmlFor="public-program" className="block font-medium">Public program</Label>
                    <p className="text-sm text-gray-500">Make this program visible in search results and program listings</p>
                  </div>
                  <Switch
                    id="public-program"
                    checked={programData.isPublic}
                    onCheckedChange={(checked) => setProgramData({ ...programData, isPublic: checked })}
                  />
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <Label htmlFor="certificate" className="block font-medium">Offer certificate</Label>
                    <p className="text-sm text-gray-500">Provide a certificate of completion to participants</p>
                  </div>
                  <Switch
                    id="certificate"
                    checked={programData.offerCertificate}
                    onCheckedChange={(checked) => setProgramData({ ...programData, offerCertificate: checked })}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-gray-50 border-dashed"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Custom Setting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent\
