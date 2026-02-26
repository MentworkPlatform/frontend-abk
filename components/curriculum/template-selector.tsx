"use client"

import { useState } from "react"
import { Search, Filter, Users, Clock, BookOpen, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { CurriculumTemplate } from "@/types/curriculum"

const mockTemplates: CurriculumTemplate[] = [
  {
    id: "1",
    name: "Digital Marketing Fundamentals",
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
        title: "Search Engine Optimization",
        description: "On-page and off-page SEO techniques",
        order: 2,
        estimatedDuration: 8,
        topics: [],
        learningObjectives: ["Master SEO fundamentals", "Implement SEO strategies"],
        prerequisites: [],
      },
    ],
    tags: ["marketing", "seo", "social-media", "analytics"],
    isPopular: true,
    usageCount: 1247,
    createdBy: "Mentwork Team",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Business Strategy & Leadership",
    description: "Strategic thinking, leadership skills, and business development",
    category: "Business",
    level: "intermediate",
    estimatedDuration: 12,
    modules: [
      {
        id: "1",
        title: "Strategic Planning",
        description: "Develop comprehensive business strategies",
        order: 1,
        estimatedDuration: 6,
        topics: [],
        learningObjectives: ["Create strategic plans", "Analyze market opportunities"],
        prerequisites: [],
      },
    ],
    tags: ["strategy", "leadership", "business-development"],
    isPopular: true,
    usageCount: 892,
    createdBy: "Mentwork Team",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Product Management Essentials",
    description: "End-to-end product management from ideation to launch",
    category: "Product",
    level: "intermediate",
    estimatedDuration: 10,
    modules: [
      {
        id: "1",
        title: "Product Strategy",
        description: "Define product vision and roadmap",
        order: 1,
        estimatedDuration: 5,
        topics: [],
        learningObjectives: ["Define product strategy", "Create product roadmaps"],
        prerequisites: [],
      },
    ],
    tags: ["product-management", "strategy", "roadmapping"],
    isPopular: false,
    usageCount: 456,
    createdBy: "Mentwork Team",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "Data Science & Analytics",
    description: "Statistical analysis, machine learning, and data visualization",
    category: "Technology",
    level: "advanced",
    estimatedDuration: 16,
    modules: [
      {
        id: "1",
        title: "Statistical Foundations",
        description: "Core statistical concepts and methods",
        order: 1,
        estimatedDuration: 8,
        topics: [],
        learningObjectives: ["Master statistical analysis", "Apply statistical methods"],
        prerequisites: ["Basic mathematics"],
      },
    ],
    tags: ["data-science", "analytics", "machine-learning"],
    isPopular: true,
    usageCount: 723,
    createdBy: "Mentwork Team",
    createdAt: "2024-01-01",
  },
]

interface TemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: CurriculumTemplate) => void
}

export function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<CurriculumTemplate | null>(null)

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesLevel = selectedLevel === "all" || template.level === selectedLevel

    return matchesSearch && matchesCategory && matchesLevel
  })

  const categories = Array.from(new Set(mockTemplates.map((t) => t.category)))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[min(100%,36rem)] sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose a Curriculum Template</DialogTitle>
          <DialogDescription>
            Start with a proven curriculum template and customize it for your program
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-4 pb-4 border-b">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-[#FFD500]"
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {template.isPopular && <Badge className="bg-[#FFD500] text-black">Popular</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{template.category}</Badge>
                        <Badge variant="secondary">{template.level}</Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{template.estimatedDuration} weeks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{template.modules.length} modules</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{template.usageCount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or create a custom curriculum</p>
            </div>
          )}
        </div>

        {/* Template Preview */}
        {selectedTemplate && (
          <TemplatePreview
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            onSelect={() => {
              onSelectTemplate(selectedTemplate)
              onClose()
            }}
          />
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Create blank curriculum
              onClose()
            }}
            className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
          >
            Start from Scratch
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface TemplatePreviewProps {
  template: CurriculumTemplate
  onClose: () => void
  onSelect: () => void
}

function TemplatePreview({ template, onClose, onSelect }: TemplatePreviewProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[min(100%,24rem)] sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {template.name}
            {template.isPopular && <Badge className="bg-[#FFD500] text-black">Popular</Badge>}
          </DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{template.category}</Badge>
                <Badge variant="secondary">{template.level}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{template.estimatedDuration} weeks</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{template.modules.length} modules</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{template.usageCount.toLocaleString()} trainers used this</span>
              </div>
            </div>
          </div>

          {/* Modules Preview */}
          <div className="space-y-4">
            <h4 className="font-medium">Curriculum Modules</h4>
            <div className="space-y-3">
              {template.modules.map((module, index) => (
                <div key={module.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium">
                        Module {index + 1}: {module.title}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{module.estimatedDuration} hours</span>
                        <span>•</span>
                        <span>{module.learningObjectives.length} learning objectives</span>
                      </div>
                    </div>
                  </div>

                  {module.learningObjectives.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Learning Objectives:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {module.learningObjectives.slice(0, 2).map((objective, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-[#FFD500] mt-1">•</span>
                            <span>{objective}</span>
                          </li>
                        ))}
                        {module.learningObjectives.length > 2 && (
                          <li className="text-gray-500">+{module.learningObjectives.length - 2} more objectives</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <h4 className="font-medium">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Back to Templates
          </Button>
          <Button onClick={onSelect} className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
            Use This Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
