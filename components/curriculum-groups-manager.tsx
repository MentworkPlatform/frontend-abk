"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Plus, Edit, Trash2, ChevronDown, ChevronUp, Target, Clock, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CurriculumGroup {
  id: string
  title: string
  description: string
  orderIndex: number
  estimatedDuration: number
  learningObjectives: string[]
  sessions: Session[]
  prerequisites: string[]
  completionRate: number
}

interface Session {
  id: string
  title: string
  description: string
  duration: number
  orderIndex: number
  isCompleted: boolean
  materials: string[]
}

// Mock data
const mockCurriculumGroups: CurriculumGroup[] = [
  {
    id: "group-1",
    title: "Fundamentals of Entrepreneurship",
    description: "Core concepts and mindset development for aspiring entrepreneurs",
    orderIndex: 0,
    estimatedDuration: 120, // minutes
    learningObjectives: [
      "Understand the entrepreneurial mindset",
      "Identify personal strengths and weaknesses",
      "Learn about different types of entrepreneurship",
    ],
    sessions: [
      {
        id: "session-1",
        title: "Introduction to Entrepreneurship",
        description: "What is entrepreneurship and why it matters",
        duration: 60,
        orderIndex: 0,
        isCompleted: true,
        materials: ["Intro Slides", "Reading Material"],
      },
      {
        id: "session-2",
        title: "Entrepreneurial Mindset",
        description: "Developing the right mindset for success",
        duration: 60,
        orderIndex: 1,
        isCompleted: true,
        materials: ["Mindset Assessment", "Case Studies"],
      },
    ],
    prerequisites: [],
    completionRate: 100,
  },
  {
    id: "group-2",
    title: "Market Research & Validation",
    description: "Understanding markets and validating business ideas",
    orderIndex: 1,
    estimatedDuration: 180,
    learningObjectives: [
      "Conduct effective market research",
      "Validate business assumptions",
      "Understand customer needs and pain points",
    ],
    sessions: [
      {
        id: "session-3",
        title: "Market Research Techniques",
        description: "Methods for researching your target market",
        duration: 90,
        orderIndex: 0,
        isCompleted: true,
        materials: ["Research Guide", "Templates"],
      },
      {
        id: "session-4",
        title: "Customer Discovery",
        description: "Finding and understanding your customers",
        duration: 90,
        orderIndex: 1,
        isCompleted: false,
        materials: ["Interview Guide"],
      },
    ],
    prerequisites: ["group-1"],
    completionRate: 50,
  },
  {
    id: "group-3",
    title: "Business Model Development",
    description: "Creating and refining your business model",
    orderIndex: 2,
    estimatedDuration: 240,
    learningObjectives: ["Create a business model canvas", "Understand value propositions", "Design revenue streams"],
    sessions: [
      {
        id: "session-5",
        title: "Business Model Canvas",
        description: "Creating your business model canvas",
        duration: 120,
        orderIndex: 0,
        isCompleted: false,
        materials: [],
      },
      {
        id: "session-6",
        title: "Revenue Models",
        description: "Different ways to generate revenue",
        duration: 120,
        orderIndex: 1,
        isCompleted: false,
        materials: [],
      },
    ],
    prerequisites: ["group-2"],
    completionRate: 0,
  },
]

export function CurriculumGroupsManager() {
  const [groups, setGroups] = useState<CurriculumGroup[]>(mockCurriculumGroups)
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false)
  const [showEditGroupDialog, setShowEditGroupDialog] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<CurriculumGroup | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["group-1"])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(groups)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order indices
    const updatedItems = items.map((item, index) => ({
      ...item,
      orderIndex: index,
    }))

    setGroups(updatedItems)
  }

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const handleEditGroup = (group: CurriculumGroup) => {
    setSelectedGroup(group)
    setShowEditGroupDialog(true)
  }

  const handleDeleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((group) => group.id !== groupId))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Curriculum Groups</h2>
          <p className="text-gray-500">Organize your program content into logical learning modules</p>
        </div>
        <Dialog open={showAddGroupDialog} onOpenChange={setShowAddGroupDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Curriculum Group</DialogTitle>
              <DialogDescription>Create a new curriculum group to organize your sessions.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="group-title">Group Title</Label>
                <Input id="group-title" placeholder="e.g., Fundamentals of Entrepreneurship" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-description">Description</Label>
                <Textarea id="group-description" placeholder="Describe what this group covers..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated-duration">Estimated Duration (hours)</Label>
                <Input id="estimated-duration" type="number" placeholder="e.g., 2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="learning-objectives">Learning Objectives</Label>
                <Textarea id="learning-objectives" placeholder="Enter learning objectives (one per line)..." rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddGroupDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddGroupDialog(false)}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="curriculum-groups">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {groups.map((group, index) => (
                <Draggable key={group.id} draggableId={group.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? "shadow-lg" : ""}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <CardTitle className="text-lg">{group.title}</CardTitle>
                                <Badge variant="outline">
                                  {group.sessions.length} session{group.sessions.length !== 1 ? "s" : ""}
                                </Badge>
                                {group.prerequisites.length > 0 && <Badge variant="secondary">Has Prerequisites</Badge>}
                              </div>
                              <CardDescription className="mt-1">{group.description}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right text-sm">
                              <div className="flex items-center space-x-2">
                                <Progress value={group.completionRate} className="h-2 w-20" />
                                <span className="text-xs">{group.completionRate}%</span>
                              </div>
                              <p className="text-gray-500 mt-1">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {Math.floor(group.estimatedDuration / 60)}h {group.estimatedDuration % 60}m
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => toggleGroupExpansion(group.id)}>
                              {expandedGroups.includes(group.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditGroup(group)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteGroup(group.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {expandedGroups.includes(group.id) && (
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            {/* Learning Objectives */}
                            <div>
                              <h4 className="font-medium mb-2 flex items-center">
                                <Target className="h-4 w-4 mr-2" />
                                Learning Objectives
                              </h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                {group.learningObjectives.map((objective, idx) => (
                                  <li key={idx}>{objective}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Prerequisites */}
                            {group.prerequisites.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Prerequisites</h4>
                                <div className="flex flex-wrap gap-2">
                                  {group.prerequisites.map((prereqId) => {
                                    const prereqGroup = groups.find((g) => g.id === prereqId)
                                    return prereqGroup ? (
                                      <Badge key={prereqId} variant="outline">
                                        {prereqGroup.title}
                                      </Badge>
                                    ) : null
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Sessions */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">Sessions</h4>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-3 w-3 mr-2" />
                                  Add Session
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {group.sessions.map((session, sessionIdx) => (
                                  <div
                                    key={session.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="flex items-center">
                                        {session.isCompleted ? (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <div className="h-4 w-4 rounded-full border border-gray-300" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">{session.title}</p>
                                        <p className="text-xs text-gray-500">{session.description}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-gray-500">{session.duration} min</span>
                                      <Button variant="ghost" size="icon">
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Group Dialog */}
      <Dialog open={showEditGroupDialog} onOpenChange={setShowEditGroupDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Curriculum Group</DialogTitle>
            <DialogDescription>Update the curriculum group details.</DialogDescription>
          </DialogHeader>
          {selectedGroup && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-group-title">Group Title</Label>
                <Input id="edit-group-title" defaultValue={selectedGroup.title} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-group-description">Description</Label>
                <Textarea id="edit-group-description" defaultValue={selectedGroup.description} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estimated-duration">Estimated Duration (hours)</Label>
                <Input
                  id="edit-estimated-duration"
                  type="number"
                  defaultValue={Math.floor(selectedGroup.estimatedDuration / 60)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-learning-objectives">Learning Objectives</Label>
                <Textarea
                  id="edit-learning-objectives"
                  defaultValue={selectedGroup.learningObjectives.join("\n")}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditGroupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowEditGroupDialog(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
