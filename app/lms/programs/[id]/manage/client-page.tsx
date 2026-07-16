"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Upload,
  Play,
  BookOpen,
  FileText,
  Calendar,
  Award,
  MessageSquare,
  Trash2,
  Edit,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ManageProgramPage() {
  const params = useParams()
  const programId = params.id as string

  const [program, setProgram] = useState({
    id: programId,
    title: "Digital Marketing Mastery",
    description: "Comprehensive digital marketing training program covering all aspects from strategy to execution.",
    category: "Marketing",
    level: "Beginner",
    format: "Self-paced",
    price: 299,
    duration: 12,
    maxStudents: 500,
    isPublished: true,
    allowEnrollment: true,
    requireApproval: false,
    certificateEnabled: true,
    forumEnabled: true,
    notificationsEnabled: true,
    modules: [
      {
        id: "1",
        title: "Digital Marketing Fundamentals",
        description: "Introduction to core concepts and strategies",
        order: 1,
        isPublished: true,
        topics: [
          { id: "1", title: "Introduction to Digital Marketing", type: "video", duration: 15, isPublished: true },
          { id: "2", title: "Market Research Basics", type: "document", duration: 20, isPublished: true },
          { id: "3", title: "Strategy Planning Assignment", type: "assignment", duration: 30, isPublished: true },
        ],
      },
      {
        id: "2",
        title: "Social Media Marketing",
        description: "Platform strategies and content creation",
        order: 2,
        isPublished: true,
        topics: [
          { id: "4", title: "Platform Overview", type: "video", duration: 25, isPublished: true },
          { id: "5", title: "Content Creation Workshop", type: "live_session", duration: 60, isPublished: false },
        ],
      },
    ],
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Show success message
    }, 1000)
  }

  const addModule = () => {
    const newModule = {
      id: Date.now().toString(),
      title: "New Module",
      description: "",
      order: program.modules.length + 1,
      isPublished: false,
      topics: [],
    }
    setProgram({ ...program, modules: [...program.modules, newModule] })
  }

  const addTopic = (moduleId: string) => {
    const newTopic = {
      id: Date.now().toString(),
      title: "New Topic",
      type: "video",
      duration: 0,
      isPublished: false,
    }

    setProgram({
      ...program,
      modules: program.modules.map((module) =>
        module.id === moduleId ? { ...module, topics: [...module.topics, newTopic] } : module,
      ),
    })
  }

  const updateModule = (moduleId: string, updates: any) => {
    setProgram({
      ...program,
      modules: program.modules.map((module) => (module.id === moduleId ? { ...module, ...updates } : module)),
    })
  }

  const updateTopic = (moduleId: string, topicId: string, updates: any) => {
    setProgram({
      ...program,
      modules: program.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) => (topic.id === topicId ? { ...topic, ...updates } : topic)),
            }
          : module,
      ),
    })
  }

  const deleteModule = (moduleId: string) => {
    setProgram({
      ...program,
      modules: program.modules.filter((module) => module.id !== moduleId),
    })
  }

  const deleteTopic = (moduleId: string, topicId: string) => {
    setProgram({
      ...program,
      modules: program.modules.map((module) =>
        module.id === moduleId ? { ...module, topics: module.topics.filter((topic) => topic.id !== topicId) } : module,
      ),
    })
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
                <h1 className="text-2xl font-bold">Manage Program</h1>
                <p className="text-gray-500">Edit content, settings, and configuration</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/programs/${programId}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update your program's basic details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Program Title</Label>
                      <Input
                        id="title"
                        value={program.title}
                        onChange={(e) => setProgram({ ...program, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={program.description}
                        onChange={(e) => setProgram({ ...program, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={program.category}
                          onValueChange={(value) => setProgram({ ...program, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="level">Level</Label>
                        <Select
                          value={program.level}
                          onValueChange={(value) => setProgram({ ...program, level: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={program.price}
                          onChange={(e) => setProgram({ ...program, price: Number.parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (weeks)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={program.duration}
                          onChange={(e) => setProgram({ ...program, duration: Number.parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxStudents">Max Students</Label>
                        <Input
                          id="maxStudents"
                          type="number"
                          value={program.maxStudents}
                          onChange={(e) => setProgram({ ...program, maxStudents: Number.parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Program Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Published</Label>
                        <p className="text-sm text-gray-500">Make program visible to students</p>
                      </div>
                      <Switch
                        checked={program.isPublished}
                        onCheckedChange={(checked) => setProgram({ ...program, isPublished: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Enrollment</Label>
                        <p className="text-sm text-gray-500">Students can enroll in this program</p>
                      </div>
                      <Switch
                        checked={program.allowEnrollment}
                        onCheckedChange={(checked) => setProgram({ ...program, allowEnrollment: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require Approval</Label>
                        <p className="text-sm text-gray-500">Manually approve enrollments</p>
                      </div>
                      <Switch
                        checked={program.requireApproval}
                        onCheckedChange={(checked) => setProgram({ ...program, requireApproval: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Students</span>
                      <span className="font-medium">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Completion Rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Rating</span>
                      <span className="font-medium">4.8 ⭐</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue</span>
                      <span className="font-medium">$12,450</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Course Content</h2>
                  <p className="text-gray-600">Organize your program into modules and topics</p>
                </div>
                <Button onClick={addModule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </div>

              <div className="space-y-6">
                {program.modules.map((module, moduleIndex) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              value={module.title}
                              onChange={(e) => updateModule(module.id, { title: e.target.value })}
                              className="text-lg font-medium"
                            />
                            <Badge variant={module.isPublished ? "default" : "secondary"}>
                              {module.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          <Textarea
                            value={module.description}
                            onChange={(e) => updateModule(module.id, { description: e.target.value })}
                            placeholder="Module description..."
                            rows={2}
                          />
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Switch
                            checked={module.isPublished}
                            onCheckedChange={(checked) => updateModule(module.id, { isPublished: checked })}
                          />
                          <Button variant="outline" size="sm" onClick={() => deleteModule(module.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Topics</h4>
                          <Button variant="outline" size="sm" onClick={() => addTopic(module.id)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Topic
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {module.topics.map((topic, topicIndex) => (
                            <div key={topic.id} className="border rounded-lg p-4">
                              <div className="flex items-start gap-4">
                                <div
                                  className={`w-10 h-10 rounded flex items-center justify-center ${
                                    topic.type === "video"
                                      ? "bg-red-100 text-red-600"
                                      : topic.type === "document"
                                        ? "bg-blue-100 text-blue-600"
                                        : topic.type === "assignment"
                                          ? "bg-green-100 text-green-600"
                                          : topic.type === "quiz"
                                            ? "bg-purple-100 text-purple-600"
                                            : "bg-orange-100 text-orange-600"
                                  }`}
                                >
                                  {topic.type === "video" && <Play className="h-5 w-5" />}
                                  {topic.type === "document" && <FileText className="h-5 w-5" />}
                                  {topic.type === "assignment" && <Award className="h-5 w-5" />}
                                  {topic.type === "quiz" && <BookOpen className="h-5 w-5" />}
                                  {topic.type === "live_session" && <Calendar className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 space-y-3">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                      value={topic.title}
                                      onChange={(e) => updateTopic(module.id, topic.id, { title: e.target.value })}
                                      placeholder="Topic title"
                                    />
                                    <Select
                                      value={topic.type}
                                      onValueChange={(value) => updateTopic(module.id, topic.id, { type: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="document">Document</SelectItem>
                                        <SelectItem value="assignment">Assignment</SelectItem>
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="live_session">Live Session</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        value={topic.duration}
                                        onChange={(e) =>
                                          updateTopic(module.id, topic.id, {
                                            duration: Number.parseInt(e.target.value),
                                          })
                                        }
                                        placeholder="Duration (min)"
                                        className="flex-1"
                                      />
                                      <span className="text-sm text-gray-500">min</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={topic.isPublished}
                                        onCheckedChange={(checked) =>
                                          updateTopic(module.id, topic.id, { isPublished: checked })
                                        }
                                      />
                                      <Label className="text-sm">Published</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Content
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteTopic(module.id, topic.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Features</CardTitle>
                  <CardDescription>Configure learning tools and features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Certificates</Label>
                      <p className="text-sm text-gray-500">Issue completion certificates</p>
                    </div>
                    <Switch
                      checked={program.certificateEnabled}
                      onCheckedChange={(checked) => setProgram({ ...program, certificateEnabled: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Discussion Forum</Label>
                      <p className="text-sm text-gray-500">Enable student discussions</p>
                    </div>
                    <Switch
                      checked={program.forumEnabled}
                      onCheckedChange={(checked) => setProgram({ ...program, forumEnabled: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Send progress notifications</p>
                    </div>
                    <Switch
                      checked={program.notificationsEnabled}
                      onCheckedChange={(checked) => setProgram({ ...program, notificationsEnabled: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>Manage student access and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Enrollment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select enrollment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open Enrollment</SelectItem>
                        <SelectItem value="approval">Requires Approval</SelectItem>
                        <SelectItem value="invite">Invite Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Content Access</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sequential">Sequential (unlock as you progress)</SelectItem>
                        <SelectItem value="open">All content available</SelectItem>
                        <SelectItem value="scheduled">Scheduled release</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Manage enrolled students and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Input placeholder="Search students..." className="w-64" />
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Students</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="dropped">Dropped</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message All
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <div className="grid grid-cols-5 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                      <span>Student</span>
                      <span>Progress</span>
                      <span>Last Active</span>
                      <span>Status</span>
                      <span>Actions</span>
                    </div>
                    {[
                      {
                        name: "Sarah Johnson",
                        email: "sarah@example.com",
                        progress: 85,
                        lastActive: "2 hours ago",
                        status: "active",
                      },
                      {
                        name: "Michael Chen",
                        email: "michael@example.com",
                        progress: 92,
                        lastActive: "1 day ago",
                        status: "active",
                      },
                      {
                        name: "Lisa Park",
                        email: "lisa@example.com",
                        progress: 67,
                        lastActive: "3 hours ago",
                        status: "active",
                      },
                    ].map((student, index) => (
                      <div key={index} className="grid grid-cols-5 gap-4 p-4 border-b items-center">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{student.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.progress}%` }} />
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">{student.lastActive}</span>
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Announcements</h2>
                  <p className="text-gray-600">Send updates and notifications to your students</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Create Announcement</CardTitle>
                  <CardDescription>Send a message to all enrolled students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="announcement-title">Title</Label>
                    <Input id="announcement-title" placeholder="Announcement title..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="announcement-message">Message</Label>
                    <Textarea id="announcement-message" placeholder="Write your announcement message..." rows={4} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="send-email" />
                      <Label htmlFor="send-email">Send email notification</Label>
                    </div>
                    <Button>Send Announcement</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "New Module Released: Advanced Analytics",
                        message: "We've just released a new module covering advanced analytics techniques...",
                        date: "2 days ago",
                        emailSent: true,
                      },
                      {
                        title: "Live Q&A Session This Friday",
                        message: "Join us for a live Q&A session this Friday at 2 PM EST...",
                        date: "1 week ago",
                        emailSent: true,
                      },
                    ].map((announcement, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{announcement.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{announcement.message}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{announcement.date}</span>
                              {announcement.emailSent && (
                                <Badge variant="secondary" className="text-xs">
                                  Email sent
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
