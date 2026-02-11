"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Target,
  CalendarIcon,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  Edit,
  Trash2,
  Send,
} from "lucide-react"
import { format, differenceInDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar" // shadcn/ui Calendar component for date selection

export default function PreLaunchPage() {
  const params = useParams()
  const programId = params.id as string

  const [program] = useState({
    id: programId,
    title: "Digital Marketing Mastery",
    launchDate: "2024-03-15",
    status: "pre-launch",
    daysUntilLaunch: 45,
  })

  const [checklist, setChecklist] = useState([
    { id: "1", task: "Define program objectives and outcomes", completed: true, category: "planning" },
    { id: "2", task: "Create detailed curriculum structure", completed: true, category: "content" },
    { id: "3", task: "Recruit and onboard mentors", completed: false, category: "mentors" },
    { id: "4", task: "Set up marketing campaigns", completed: false, category: "marketing" },
    { id: "5", task: "Configure payment processing", completed: true, category: "technical" },
    { id: "6", task: "Create promotional materials", completed: false, category: "marketing" },
    { id: "7", task: "Test platform functionality", completed: false, category: "technical" },
    { id: "8", task: "Schedule mentor training sessions", completed: false, category: "mentors" },
    { id: "9", task: "Launch early bird pricing", completed: false, category: "marketing" },
    { id: "10", task: "Final program review and approval", completed: false, category: "planning" },
  ])

  const [marketingCampaigns, setMarketingCampaigns] = useState([
    {
      id: "1",
      name: "Early Bird Campaign",
      type: "Email",
      status: "draft",
      targetAudience: "Previous participants",
      budget: 500,
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      expectedReach: 1200,
    },
    {
      id: "2",
      name: "Social Media Awareness",
      type: "Social Media",
      status: "active",
      targetAudience: "Digital marketers",
      budget: 800,
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      expectedReach: 5000,
    },
    {
      id: "3",
      name: "Partner Referrals",
      type: "Partnership",
      status: "planned",
      targetAudience: "Industry partners",
      budget: 300,
      startDate: "2024-02-15",
      endDate: "2024-03-10",
      expectedReach: 800,
    },
  ])

  const [mentorNegotiations, setMentorNegotiations] = useState([
    {
      id: "1",
      mentorName: "Sarah Johnson",
      expertise: "SEO & Content Strategy",
      status: "negotiating",
      proposedRate: 150,
      requestedRate: 180,
      sessions: 4,
      lastContact: "2024-01-20",
      notes: "Interested but wants higher rate due to premium expertise",
    },
    {
      id: "2",
      mentorName: "Michael Chen",
      expertise: "Paid Advertising",
      status: "agreed",
      proposedRate: 120,
      requestedRate: 120,
      sessions: 3,
      lastContact: "2024-01-18",
      notes: "Agreed to terms, contract sent",
    },
    {
      id: "3",
      mentorName: "Emily Rodriguez",
      expertise: "Email Marketing",
      status: "pending",
      proposedRate: 130,
      requestedRate: 140,
      sessions: 2,
      lastContact: "2022-01-22",
      notes: "Awaiting response to counter-offer",
    },
  ])

  // Milestones are now stateful to allow adding/deleting
  const [milestones, setMilestones] = useState([
    {
      id: "m1",
      date: "2024-01-30",
      title: "Mentor Recruitment Complete",
      description: "All mentors confirmed and contracts signed",
      status: "pending",
    },
    {
      id: "m2",
      date: "2024-02-05",
      title: "Marketing Campaign Launch",
      description: "Begin early bird promotion and social media campaign",
      status: "pending",
    },
    {
      id: "m3",
      date: "2024-02-15",
      title: "Platform Testing Complete",
      description: "All technical systems tested and ready",
      status: "pending",
    },
    {
      id: "m4",
      date: "2024-02-28",
      title: "Mentor Training Sessions",
      description: "Conduct orientation and training for all mentors",
      status: "pending",
    },
    {
      id: "m5",
      date: "2024-03-10",
      title: "Final Review & Approval",
      description: "Last chance to make adjustments before launch",
      status: "pending",
    },
    {
      id: "m6",
      date: "2024-03-15",
      title: "Program Launch",
      description: "Official program start date",
      status: "upcoming",
    },
  ])

  // State for modals and new item inputs
  const [isAddChecklistModalOpen, setIsAddChecklistModalOpen] = useState(false)
  const [newChecklistTask, setNewChecklistTask] = useState({ task: "", category: "planning" })

  const [isAddCampaignModalOpen, setIsAddCampaignModalOpen] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "Email",
    targetAudience: "",
    budget: 0,
    startDate: "",
    endDate: "",
    expectedReach: 0,
  })

  const [isAddMentorNegotiationModalOpen, setIsAddMentorNegotiationModalOpen] = useState(false)
  const [newMentorNegotiation, setNewMentorNegotiation] = useState({
    mentorName: "",
    expertise: "",
    proposedRate: 0,
    requestedRate: 0,
    sessions: 0,
    notes: "",
  })

  // New state for adding milestones
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false)
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    date: "",
    status: "pending",
  })

  // State for calendar and event details modal
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false)
  const [currentEventDetails, setCurrentEventDetails] = useState<any>(null) // To store details of the clicked event

  // Functions for checklist management
  const addChecklistItem = () => {
    if (newChecklistTask.task.trim() && newChecklistTask.category) {
      setChecklist([
        ...checklist,
        {
          id: Date.now().toString(),
          task: newChecklistTask.task,
          completed: false,
          category: newChecklistTask.category,
        },
      ])
      setNewChecklistTask({ task: "", category: "planning" })
      setIsAddChecklistModalOpen(false)
    }
  }

  const deleteChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id))
  }

  // Functions for marketing campaign management
  const addMarketingCampaign = () => {
    if (newCampaign.name.trim() && newCampaign.type && newCampaign.budget >= 0) {
      setMarketingCampaigns([
        ...marketingCampaigns,
        {
          id: Date.now().toString(),
          name: newCampaign.name,
          type: newCampaign.type,
          status: "draft", // Default status for new campaigns
          targetAudience: newCampaign.targetAudience,
          budget: newCampaign.budget,
          startDate: newCampaign.startDate || new Date().toISOString().split("T")[0],
          endDate: newCampaign.endDate || new Date().toISOString().split("T")[0],
          expectedReach: newCampaign.expectedReach,
        },
      ])
      setNewCampaign({
        name: "",
        type: "Email",
        targetAudience: "",
        budget: 0,
        startDate: "",
        endDate: "",
        expectedReach: 0,
      })
      setIsAddCampaignModalOpen(false)
    }
  }

  const deleteMarketingCampaign = (id: string) => {
    setMarketingCampaigns(marketingCampaigns.filter((campaign) => campaign.id !== id))
  }

  // Functions for mentor negotiation management
  const addMentorNegotiation = () => {
    if (newMentorNegotiation.mentorName.trim() && newMentorNegotiation.expertise) {
      setMentorNegotiations([
        ...mentorNegotiations,
        {
          id: Date.now().toString(),
          mentorName: newMentorNegotiation.mentorName,
          expertise: newMentorNegotiation.expertise,
          status: "pending", // Default status for new negotiations
          proposedRate: newMentorNegotiation.proposedRate,
          requestedRate: newMentorNegotiation.requestedRate,
          sessions: newMentorNegotiation.sessions,
          lastContact: new Date().toISOString().split("T")[0],
          notes: newMentorNegotiation.notes,
        },
      ])
      setNewMentorNegotiation({
        mentorName: "",
        expertise: "",
        proposedRate: 0,
        requestedRate: 0,
        sessions: 0,
        notes: "",
      })
      setIsAddMentorNegotiationModalOpen(false)
    }
  }

  const deleteMentorNegotiation = (id: string) => {
    setMentorNegotiations(mentorNegotiations.filter((negotiation) => negotiation.id !== id))
  }

  // Functions for milestone management
  const addMilestone = () => {
    if (newMilestone.title.trim() && newMilestone.date) {
      setMilestones([
        ...milestones,
        {
          id: Date.now().toString(),
          title: newMilestone.title,
          description: newMilestone.description,
          date: newMilestone.date,
          status: newMilestone.status,
        },
      ])
      setNewMilestone({ title: "", description: "", date: "", status: "pending" })
      setIsAddMilestoneModalOpen(false)
    }
  }

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter((milestone) => milestone.id !== id))
  }

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const completedTasks = checklist.filter((item) => item.completed).length
  const completionPercentage = (completedTasks / checklist.length) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "agreed":
      case "completed":
        return "default"
      case "draft":
      case "negotiating":
      case "upcoming":
        return "secondary"
      case "planned":
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "agreed":
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "negotiating":
        return <MessageSquare className="h-4 w-4" />
      case "pending":
      case "upcoming":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Aggregate all events for the calendar
  const allEvents = useMemo(() => {
    const events: {
      id: string
      date: Date
      title: string
      description: string
      type: string
      status?: string
      originalId?: string
    }[] = []

    milestones.forEach((m) => {
      events.push({
        id: `milestone-${m.id}`,
        date: new Date(m.date),
        title: m.title,
        description: m.description,
        type: "Milestone",
        status: m.status,
        originalId: m.id,
      })
    })

    marketingCampaigns.forEach((c) => {
      events.push({
        id: `campaign-${c.id}`,
        date: new Date(c.startDate),
        title: c.name,
        description: `Type: ${c.type}, Audience: ${c.targetAudience}`,
        type: "Marketing Campaign",
        status: c.status,
        originalId: c.id,
      })
    })

    mentorNegotiations.forEach((n) => {
      events.push({
        id: `negotiation-${n.id}`,
        date: new Date(n.lastContact),
        title: `Mentor: ${n.mentorName}`,
        description: `Expertise: ${n.expertise}, Status: ${n.status}`,
        type: "Mentor Negotiation",
        status: n.status,
        originalId: n.id,
      })
    })

    return events
  }, [milestones, marketingCampaigns, mentorNegotiations])

  // Filter events for the selected date
  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return []
    return allEvents.filter(
      (event) =>
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear(),
    )
  }, [selectedDate, allEvents])

  // Modifiers for react-day-picker to highlight dates with events
  const modifiers = {
    events: allEvents.map((event) => event.date),
  }

  const modifiersStyles = {
    events: {
      border: "2px solid currentColor",
      borderRadius: "50%",
    },
  }

  const handleEventClick = (event: any) => {
    setCurrentEventDetails(event)
    setIsEventDetailsModalOpen(true)
  }

  const handleDeleteEvent = () => {
    if (!currentEventDetails) return

    const { type, originalId } = currentEventDetails

    switch (type) {
      case "Milestone":
        deleteMilestone(originalId)
        break
      case "Marketing Campaign":
        deleteMarketingCampaign(originalId)
        break
      case "Mentor Negotiation":
        deleteMentorNegotiation(originalId)
        break
      default:
        console.warn("Unknown event type for deletion:", type)
    }
    setIsEventDetailsModalOpen(false)
    setCurrentEventDetails(null)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/lms/programs/${programId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Program
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Pre-Launch Management</h1>
                <p className="text-gray-500">
                  {program.title} • {program.daysUntilLaunch} days until launch
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                Pre-Launch
              </Badge>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Program Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Launch Readiness</p>
                  <p className="text-2xl font-bold">{Math.round(completionPercentage)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={completionPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Days Until Launch</p>
                  <p className="text-2xl font-bold">{program.daysUntilLaunch}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Target: {new Date(program.launchDate).toLocaleDateString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Marketing Budget</p>
                  <p className="text-2xl font-bold">
                    ${marketingCampaigns.reduce((sum, campaign) => sum + campaign.budget, 0)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Across {marketingCampaigns.length} campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Mentor Status</p>
                  <p className="text-2xl font-bold">
                    {mentorNegotiations.filter((m) => m.status === "agreed").length}/{mentorNegotiations.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Confirmed mentors</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList>
            <TabsTrigger value="checklist">Launch Checklist</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Strategy</TabsTrigger>
            <TabsTrigger value="mentors">Mentor Negotiations</TabsTrigger>
            <TabsTrigger value="timeline">Launch Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pre-Launch Checklist</CardTitle>
                    <CardDescription>
                      Complete all tasks before program launch ({completedTasks}/{checklist.length} completed)
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setIsAddChecklistModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["planning", "content", "mentors", "marketing", "technical"].map((category) => (
                    <div key={category} className="space-y-3">
                      <h4 className="font-medium text-sm uppercase tracking-wide text-gray-500 capitalize">
                        {category}
                      </h4>
                      {checklist
                        .filter((item) => item.category === category)
                        .map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <button
                              onClick={() => toggleChecklistItem(item.id)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                item.completed
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {item.completed && <CheckCircle className="h-3 w-3" />}
                            </button>
                            <span className={`flex-1 ${item.completed ? "line-through text-gray-500" : ""}`}>
                              {item.task}
                            </span>
                            <Badge variant={item.completed ? "default" : "secondary"}>
                              {item.completed ? "Complete" : "Pending"}
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => deleteChecklistItem(item.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Marketing Strategy</h2>
                  <p className="text-gray-600">Plan and execute marketing campaigns for program launch</p>
                </div>
                <Button onClick={() => setIsAddCampaignModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Performance</CardTitle>
                    <CardDescription>Expected reach and budget allocation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Budget</span>
                        <span className="font-medium">
                          ${marketingCampaigns.reduce((sum, campaign) => sum + campaign.budget, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Expected Reach</span>
                        <span className="font-medium">
                          {marketingCampaigns
                            .reduce((sum, campaign) => sum + campaign.expectedReach, 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Campaigns</span>
                        <span className="font-medium">
                          {marketingCampaigns.filter((c) => c.status === "active").length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common marketing tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Landing Page
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Send className="h-4 w-4 mr-2" />
                      Send Email Campaign
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Target className="h-4 w-4 mr-2" />
                      Set Up Ads
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Users className="h-4 w-4 mr-2" />
                      Partner Outreach
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Marketing Campaigns</CardTitle>
                  <CardDescription>Manage your promotional campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketingCampaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{campaign.name}</h4>
                              <Badge variant={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>Type: {campaign.type}</div>
                              <div>Budget: ${campaign.budget}</div>
                              <div>Audience: {campaign.targetAudience}</div>
                              <div>Expected Reach: {campaign.expectedReach.toLocaleString()}</div>
                              <div>Start: {new Date(campaign.startDate).toLocaleDateString()}</div>
                              <div>End: {new Date(campaign.endDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => console.log("Edit campaign:", campaign.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteMarketingCampaign(campaign.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mentors">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Mentor Negotiations</h2>
                  <p className="text-gray-600">Manage mentor recruitment and contract negotiations</p>
                </div>
                <Button onClick={() => setIsAddMentorNegotiationModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mentor
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Confirmed</p>
                        <p className="text-2xl font-bold text-green-600">
                          {mentorNegotiations.filter((m) => m.status === "agreed").length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">In Negotiation</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {mentorNegotiations.filter((m) => m.status === "negotiating").length}
                        </p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Pending Response</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {mentorNegotiations.filter((m) => m.status === "pending").length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Mentor Negotiations</CardTitle>
                  <CardDescription>Track progress with potential mentors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mentorNegotiations.map((negotiation) => (
                      <div key={negotiation.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{negotiation.mentorName}</h4>
                              <Badge variant={getStatusColor(negotiation.status)} className="flex items-center gap-1">
                                {getStatusIcon(negotiation.status)}
                                {negotiation.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{negotiation.expertise}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Proposed Rate:</span>
                                <span className="ml-1 font-medium">${negotiation.proposedRate}/hour</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Requested Rate:</span>
                                <span className="ml-1 font-medium">${negotiation.requestedRate}/hour</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Sessions:</span>
                                <span className="ml-1 font-medium">{negotiation.sessions}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Last Contact:</span>
                                <span className="ml-1 font-medium">
                                  {new Date(negotiation.lastContact).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {negotiation.notes && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                <span className="text-gray-500">Notes:</span> {negotiation.notes}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => console.log("Contact mentor:", negotiation.id)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contact
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => console.log("Edit negotiation:", negotiation.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteMentorNegotiation(negotiation.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Launch Timeline</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsAddMilestoneModalOpen(true)
                      if (selectedDate) {
                        setNewMilestone((prev) => ({ ...prev, date: format(selectedDate, "yyyy-MM-dd") }))
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
                <CardDescription>Key milestones and deadlines leading to program launch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border w-full"
                      modifiers={modifiers}
                      modifiersStyles={modifiersStyles}
                    />
                  </div>
                  <div className="lg:w-1/2 space-y-4">
                    <h3 className="text-lg font-semibold">
                      Events on {selectedDate ? format(selectedDate, "PPP") : "No date selected"}
                    </h3>
                    {eventsForSelectedDate.length > 0 ? (
                      <div className="space-y-3">
                        {eventsForSelectedDate.map((event) => (
                          <div
                            key={event.id}
                            className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{event.title}</h4>
                              <Badge variant={getStatusColor(event.status || "")}>{event.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {format(event.date, "PPP")} • {differenceInDays(event.date, new Date())} days from now
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No events for this date.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Add Checklist Item Modal */}
      <Dialog open={isAddChecklistModalOpen} onOpenChange={setIsAddChecklistModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Checklist Task</DialogTitle>
            <DialogDescription>Add a new task to your pre-launch checklist.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task">Task Description</Label>
              <Input
                id="task"
                value={newChecklistTask.task}
                onChange={(e) => setNewChecklistTask({ ...newChecklistTask, task: e.target.value })}
                placeholder="e.g., Finalize program content"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newChecklistTask.category}
                onValueChange={(value) => setNewChecklistTask({ ...newChecklistTask, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="mentors">Mentors</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddChecklistModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addChecklistItem}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Add Marketing Campaign Modal */}
      <Dialog open={isAddCampaignModalOpen} onOpenChange={setIsAddCampaignModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Marketing Campaign</DialogTitle>
            <DialogDescription>Plan a new marketing campaign for your program.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                placeholder="e.g., Spring Enrollment Drive"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-type">Type</Label>
                <Select
                  value={newCampaign.type}
                  onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="Ads">Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-budget">Budget ($)</Label>
                <Input
                  id="campaign-budget"
                  type="number"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                  placeholder="e.g., 1000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-audience">Target Audience</Label>
              <Input
                id="target-audience"
                value={newCampaign.targetAudience}
                onChange={(e) => setNewCampaign({ ...newCampaign, targetAudience: e.target.value })}
                placeholder="e.g., Aspiring digital marketers"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected-reach">Expected Reach</Label>
              <Input
                id="expected-reach"
                type="number"
                value={newCampaign.expectedReach}
                onChange={(e) => setNewCampaign({ ...newCampaign, expectedReach: Number(e.target.value) })}
                placeholder="e.g., 5000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCampaignModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addMarketingCampaign}>Add Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Add Mentor Negotiation Modal */}
      <Dialog open={isAddMentorNegotiationModalOpen} onOpenChange={setIsAddMentorNegotiationModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Mentor Negotiation</DialogTitle>
            <DialogDescription>Track a new mentor recruitment and negotiation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mentor-name">Mentor Name</Label>
              <Input
                id="mentor-name"
                value={newMentorNegotiation.mentorName}
                onChange={(e) => setNewMentorNegotiation({ ...newMentorNegotiation, mentorName: e.target.value })}
                placeholder="e.g., Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertise">Expertise</Label>
              <Input
                id="expertise"
                value={newMentorNegotiation.expertise}
                onChange={(e) => setNewMentorNegotiation({ ...newMentorNegotiation, expertise: e.target.value })}
                placeholder="e.g., UI/UX Design"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proposed-rate">Proposed Rate ($/hr)</Label>
                <Input
                  id="proposed-rate"
                  type="number"
                  value={newMentorNegotiation.proposedRate}
                  onChange={(e) =>
                    setNewMentorNegotiation({ ...newMentorNegotiation, proposedRate: Number(e.target.value) })
                  }
                  placeholder="e.g., 120"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requested-rate">Requested Rate ($/hr)</Label>
                <Input
                  id="requested-rate"
                  type="number"
                  value={newMentorNegotiation.requestedRate}
                  onChange={(e) =>
                    setNewMentorNegotiation({ ...newMentorNegotiation, requestedRate: Number(e.target.value) })
                  }
                  placeholder="e.g., 150"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessions">Number of Sessions</Label>
              <Input
                id="sessions"
                type="number"
                value={newMentorNegotiation.sessions}
                onChange={(e) => setNewMentorNegotiation({ ...newMentorNegotiation, sessions: Number(e.target.value) })}
                placeholder="e.g., 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newMentorNegotiation.notes}
                onChange={(e) => setNewMentorNegotiation({ ...newMentorNegotiation, notes: e.target.value })}
                placeholder="Add any relevant notes about the negotiation..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMentorNegotiationModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addMentorNegotiation}>Add Negotiation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Milestone Modal */}
      <Dialog open={isAddMilestoneModalOpen} onOpenChange={setIsAddMilestoneModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Milestone</DialogTitle>
            <DialogDescription>Add a new key milestone to your program timeline.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="milestone-title">Title</Label>
              <Input
                id="milestone-title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                placeholder="e.g., Final Curriculum Review"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="milestone-description">Description</Label>
              <Textarea
                id="milestone-description"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                placeholder="Brief description of the milestone"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="milestone-date">Date</Label>
              <Input
                id="milestone-date"
                type="date"
                value={newMilestone.date}
                onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="milestone-status">Status</Label>
              <Select
                value={newMilestone.status}
                onValueChange={(value) => setNewMilestone({ ...newMilestone, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMilestoneModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addMilestone}>Add Milestone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Modal */}
      <Dialog open={isEventDetailsModalOpen} onOpenChange={setIsEventDetailsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentEventDetails?.title}</DialogTitle>
            <DialogDescription>Details for this {currentEventDetails?.type}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="font-semibold">{currentEventDetails?.type}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="font-semibold">
                {currentEventDetails?.date ? format(currentEventDetails.date, "PPP") : "N/A"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p>{currentEventDetails?.description}</p>
            </div>
            {currentEventDetails?.status && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge variant={getStatusColor(currentEventDetails.status)}>{currentEventDetails.status}</Badge>
              </div>
            )}
            {/* Add more details based on event type if needed */}
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={handleDeleteEvent}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="outline" onClick={() => console.log("Edit functionality to be implemented.")}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
