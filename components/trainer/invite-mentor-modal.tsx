"use client"

import type React from "react"

import { useState } from "react"
import { Mail, MessageSquare, Send, Star, Clock, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { PlatformMentor } from "@/types/trainer"

interface InviteMentorModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (mentorData: any) => void
  programTitle: string
  availableMentors?: PlatformMentor[]
}

export function InviteMentorModal({
  isOpen,
  onClose,
  onInvite,
  programTitle,
  availableMentors = [],
}: InviteMentorModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<PlatformMentor | null>(null)
  const [formData, setFormData] = useState({
    compensationRate: 100,
    selectedTopics: [] as string[],
    message: `Hi there!

I'd love to invite you to be a mentor in our "${programTitle}" program. Your expertise would be invaluable to our participants.

The program includes:
- Interactive sessions with participants
- Flexible scheduling that works with your availability
- Competitive compensation
- Opportunity to make a real impact

Would you be interested in learning more? I'd be happy to discuss the details with you.

Best regards!`,
  })

  // Mock curriculum topics for demonstration
  const [availableTopics] = useState([
    { id: "1", title: "SEO Fundamentals", module: "Digital Marketing Basics", duration: 90 },
    { id: "2", title: "Content Marketing Strategy", module: "Digital Marketing Basics", duration: 120 },
    { id: "3", title: "Social Media Marketing", module: "Social Media", duration: 90 },
    { id: "4", title: "Facebook Advertising", module: "Social Media", duration: 120 },
    { id: "5", title: "Google Ads Setup", module: "Paid Advertising", duration: 90 },
    { id: "6", title: "Email Marketing Campaigns", module: "Email Marketing", duration: 90 },
    { id: "7", title: "Analytics and Reporting", module: "Analytics", duration: 120 },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMentor) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      onInvite({
        mentor: selectedMentor,
        ...formData,
      })
      setIsLoading(false)
      handleClose()
    }, 1500)
  }

  const handleClose = () => {
    onClose()
    setSelectedMentor(null)
    setFormData({
      compensationRate: 100,
      selectedTopics: [],
      message: `Hi there!

I'd love to invite you to be a mentor in our "${programTitle}" program. Your expertise would be invaluable to our participants.

The program includes:
- Interactive sessions with participants
- Flexible scheduling that works with your availability
- Competitive compensation
- Opportunity to make a real impact

Would you be interested in learning more? I'd be happy to discuss the details with you.

Best regards!`,
    })
  }

  const toggleTopic = (topicId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTopics: prev.selectedTopics.includes(topicId)
        ? prev.selectedTopics.filter((id) => id !== topicId)
        : [...prev.selectedTopics, topicId],
    }))
  }

  const getSelectedTopicsDuration = () => {
    return availableTopics
      .filter((topic) => formData.selectedTopics.includes(topic.id))
      .reduce((total, topic) => total + topic.duration, 0)
  }

  const groupedTopics = availableTopics.reduce(
    (acc, topic) => {
      if (!acc[topic.module]) {
        acc[topic.module] = []
      }
      acc[topic.module].push(topic)
      return acc
    },
    {} as Record<string, typeof availableTopics>,
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Invite Platform Mentor to {programTitle}
          </DialogTitle>
          <DialogDescription>
            Select a mentor from our platform and assign them to specific topics in your program
          </DialogDescription>
        </DialogHeader>

        {!selectedMentor ? (
          // Mentor Selection View
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Select a Mentor</Label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableMentors.map((mentor) => (
                  <Card
                    key={mentor.id}
                    className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-[#FFD500]"
                    onClick={() => {
                      setSelectedMentor(mentor)
                      setFormData((prev) => ({ ...prev, compensationRate: mentor.hourlyRate }))
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {mentor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{mentor.name}</h3>
                              <p className="text-sm text-muted-foreground">{mentor.title}</p>
                              {mentor.company && <p className="text-xs text-muted-foreground">{mentor.company}</p>}
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{mentor.rating}</span>
                                <span className="text-xs text-muted-foreground">({mentor.totalReviews})</span>
                              </div>
                              <p className="text-sm font-medium">${mentor.hourlyRate}/hr</p>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{mentor.bio}</p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex flex-wrap gap-1">
                              {mentor.expertise.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {mentor.expertise.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{mentor.expertise.length - 3}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {mentor.totalSessions} sessions
                              </div>
                              <div className="flex items-center">
                                <Globe className="h-3 w-3 mr-1" />
                                {mentor.timezone}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Assignment Form View
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Mentor Info */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedMentor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedMentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedMentor.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedMentor.title}</p>
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setSelectedMentor(null)}>
                    Change Mentor
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="compensationRate">Compensation Rate ($/hour)</Label>
              <Input
                id="compensationRate"
                type="number"
                min="0"
                step="5"
                placeholder="100"
                value={formData.compensationRate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    compensationRate: Number.parseInt(e.target.value) || selectedMentor.hourlyRate,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">Mentor's standard rate: ${selectedMentor.hourlyRate}/hr</p>
            </div>

            {/* Topic Assignment */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Assign Topics</Label>
                <div className="text-sm text-muted-foreground">
                  {formData.selectedTopics.length} topics selected
                  {formData.selectedTopics.length > 0 && (
                    <span> • {Math.round(getSelectedTopicsDuration() / 60)} hours</span>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                {Object.entries(groupedTopics).map(([moduleName, topics]) => (
                  <div key={moduleName} className="mb-4 last:mb-0">
                    <h4 className="font-medium text-sm mb-2 text-muted-foreground">{moduleName}</h4>
                    <div className="space-y-2 pl-4">
                      {topics.map((topic) => (
                        <div key={topic.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={topic.id}
                            checked={formData.selectedTopics.includes(topic.id)}
                            onCheckedChange={() => toggleTopic(topic.id)}
                          />
                          <label htmlFor={topic.id} className="text-sm flex-1 cursor-pointer">
                            {topic.title}
                            <span className="text-muted-foreground ml-2">({topic.duration} min)</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invitation Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Invitation Message</Label>
              <div className="relative">
                <MessageSquare className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="message"
                  placeholder="Write a personalized invitation message..."
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  rows={8}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Invitation Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <strong>Program:</strong> {programTitle}
                </p>
                <p>
                  <strong>Mentor:</strong> {selectedMentor.name}
                </p>
                <p>
                  <strong>Compensation:</strong> ${formData.compensationRate}/hour
                </p>
                <p>
                  <strong>Topics:</strong> {formData.selectedTopics.length} assigned
                </p>
                {formData.selectedTopics.length > 0 && (
                  <p>
                    <strong>Estimated Hours:</strong> {Math.round(getSelectedTopicsDuration() / 60)} hours
                  </p>
                )}
              </div>

              {formData.selectedTopics.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">Selected Topics:</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.selectedTopics.map((topicId) => {
                      const topic = availableTopics.find((t) => t.id === topicId)
                      return topic ? (
                        <Badge key={topicId} variant="outline" className="text-xs">
                          {topic.title}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
                disabled={isLoading || formData.selectedTopics.length === 0}
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
