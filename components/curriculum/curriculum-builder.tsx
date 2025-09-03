'use client'
import {
  Plus,
  GripVertical,
  Trash2,
  Play,
  FileText,
  Award,
  BookOpen,
  Calendar,
  MessageSquare,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import type {
  CurriculumModule,
  CurriculumTopic,
  CurriculumTemplate,
} from '@/types/curriculum'

interface CurriculumBuilderProps {
  initialTemplate?: CurriculumTemplate
  modules: CurriculumModule[]
  setModules: (modules: CurriculumModule[]) => void
}

export function CurriculumBuilder({
  initialTemplate,
  modules,
  setModules,
}: CurriculumBuilderProps) {
  const addModule = () => {
    const newModule: CurriculumModule = {
      id: `${Math.floor(Math.random() * 900000) + 1000}`,
      title: '',
      description: '',
      order: modules.length + 1,
      duration: 0,
      topics: [],
      learningObjectives: [''],
      materials: [],
      assessments: [],
      isPublished: false,
    }
    setModules([...modules, newModule])
  }

  const updateModule = (
    moduleId: string,
    updates: Partial<CurriculumModule>
  ) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId ? { ...module, ...updates } : module
      )
    )
  }

  const removeModule = (moduleId: string) => {
    setModules(modules.filter((module) => module.id !== moduleId))
  }

  const addTopic = (moduleId: string) => {
    const newTopic: CurriculumTopic = {
      id: `${Math.floor(Math.random() * 900000) + 1000}`,
      title: '',
      description: '',
      duration: 60,
      order: 1,
      type: 'live_session', // Default to live session
      materials: [],
      prerequisites: [],
      requiredExpertise: [],
      isPublished: false,
    }

    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, topics: [...module.topics, newTopic] }
          : module
      )
    )
  }

  const updateTopic = (
    moduleId: string,
    topicId: string,
    updates: Partial<CurriculumTopic>
  ) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                topic.id === topicId ? { ...topic, ...updates } : topic
              ),
            }
          : module
      )
    )
  }

  const removeTopic = (moduleId: string, topicId: string) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              topics: module.topics.filter((topic) => topic.id !== topicId),
            }
          : module
      )
    )
  }

  const updateLearningObjective = (
    moduleId: string,
    index: number,
    value: string
  ) => {
    const module = modules.find((m) => m.id === moduleId)
    if (module) {
      const updated = [...module.learningObjectives]
      updated[index] = value
      updateModule(moduleId, { learningObjectives: updated })
    }
  }

  const addLearningObjective = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId)
    if (module) {
      updateModule(moduleId, {
        learningObjectives: [...module.learningObjectives, ''],
      })
    }
  }

  const removeLearningObjective = (moduleId: string, index: number) => {
    const module = modules.find((m) => m.id === moduleId)
    if (module && module.learningObjectives.length > 1) {
      const updated = module.learningObjectives.filter((_, i) => i !== index)
      updateModule(moduleId, { learningObjectives: updated })
    }
  }

  const getTotalDuration = () => {
    return modules.reduce(
      (total, module) =>
        total +
        module.topics.reduce(
          (moduleTotal, topic) => moduleTotal + topic.duration,
          0
        ),
      0
    )
  }

  const getTopicIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className='h-4 w-4' />
      case 'document':
        return <FileText className='h-4 w-4' />
      case 'quiz':
        return <BookOpen className='h-4 w-4' />
      case 'assignment':
        return <Award className='h-4 w-4' />
      case 'live_session':
        return <Calendar className='h-4 w-4' />
      case 'discussion':
        return <MessageSquare className='h-4 w-4' />
      case 'project':
        return <BookOpen className='h-4 w-4' />
      default:
        return <FileText className='h-4 w-4' />
    }
  }

  const getTopicColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-600'
      case 'document':
        return 'bg-blue-100 text-blue-600'
      case 'quiz':
        return 'bg-purple-100 text-purple-600'
      case 'assignment':
        return 'bg-green-100 text-green-600'
      case 'live_session':
        return 'bg-orange-100 text-orange-600'
      case 'discussion':
        return 'bg-yellow-100 text-yellow-600'
      case 'project':
        return 'bg-indigo-100 text-indigo-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Curriculum Builder</CardTitle>
              <CardDescription>
                {initialTemplate
                  ? `Building from template: ${initialTemplate.name}`
                  : 'Create your custom curriculum from scratch'}
              </CardDescription>
            </div>
            <div className='text-right text-sm text-muted-foreground'>
              <div>
                Total Duration: {Math.round(getTotalDuration() / 60)} hours
              </div>
              <div>
                {modules.length} modules,{' '}
                {modules.reduce((total, m) => total + m.topics.length, 0)}{' '}
                topics
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Modules */}
      <div className='space-y-4'>
        {modules.map((module, moduleIndex) => (
          <Card key={module.id} className='border-l-4 border-l-[#FFD500]'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <GripVertical className='h-4 w-4 text-muted-foreground cursor-move' />
                  <Badge variant='outline'>Module {moduleIndex + 1}</Badge>
                  <Switch
                    checked={module.isPublished}
                    onCheckedChange={(checked) =>
                      updateModule(module.id, { isPublished: checked })
                    }
                  />
                  <Label className='text-sm'>Published</Label>
                </div>
                {modules.length > 1 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => removeModule(module.id)}
                    className='text-red-600 hover:text-red-700'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label>Module Title *</Label>
                  <Input
                    placeholder='e.g., Introduction to Digital Marketing'
                    value={module.title}
                    onChange={(e) =>
                      updateModule(module.id, { title: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Estimated Duration (hours)</Label>
                  <Input
                    type='number'
                    placeholder='e.g., 4'
                    value={module.duration / 60}
                    onChange={(e) =>
                      updateModule(module.id, {
                        duration: (Number.parseFloat(e.target.value) || 0) * 60,
                      })
                    }
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Module Description *</Label>
                <Textarea
                  placeholder='Describe what this module covers...'
                  value={module.description}
                  onChange={(e) =>
                    updateModule(module.id, { description: e.target.value })
                  }
                  rows={2}
                />
              </div>

              {/* Learning Objectives */}
              <div className='space-y-3'>
                <Label className='text-base font-medium'>
                  Learning Objectives
                </Label>
                {module.learningObjectives.map((objective, index) => (
                  <div key={index} className='flex items-center space-x-2'>
                    <Input
                      placeholder={`Learning objective ${index + 1}`}
                      value={objective}
                      onChange={(e) =>
                        updateLearningObjective(
                          module.id,
                          index,
                          e.target.value
                        )
                      }
                    />
                    {module.learningObjectives.length > 1 && (
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          removeLearningObjective(module.id, index)
                        }
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => addLearningObjective(module.id)}
                  className='w-full bg-transparent'
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Add Learning Objective
                </Button>
              </div>

              {/* Topics */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <Label className='text-base font-medium'>Topics</Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => addTopic(module.id)}
                  >
                    <Plus className='h-4 w-4 mr-1' />
                    Add Topic
                  </Button>
                </div>

                {module.topics.length === 0 ? (
                  <div className='text-center py-8 border-2 border-dashed border-gray-200 rounded-lg'>
                    <BookOpen className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
                    <p className='text-muted-foreground'>No topics yet</p>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => addTopic(module.id)}
                      className='mt-2'
                    >
                      Add First Topic
                    </Button>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {module.topics.map((topic, topicIndex) => (
                      <Card key={topic.id} className='bg-gray-50'>
                        <CardContent className='p-4'>
                          <div className='flex items-center justify-between mb-3'>
                            <div className='flex items-center gap-2'>
                              <div
                                className={`w-8 h-8 rounded flex items-center justify-center ${getTopicColor(
                                  topic.type
                                )}`}
                              >
                                {getTopicIcon(topic.type)}
                              </div>
                              <Badge variant='secondary'>
                                Topic {topicIndex + 1}
                              </Badge>
                              <Switch
                                checked={topic.isPublished}
                                onCheckedChange={(checked) =>
                                  updateTopic(module.id, topic.id, {
                                    isPublished: checked,
                                  })
                                }
                              />
                              <Label className='text-xs'>Published</Label>
                            </div>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => removeTopic(module.id, topic.id)}
                              className='text-red-600 hover:text-red-700'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>

                          <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-3'>
                            <div className='space-y-1'>
                              <Label className='text-xs'>Topic Title *</Label>
                              <Input
                                placeholder='e.g., SEO Fundamentals'
                                value={topic.title}
                                onChange={(e) =>
                                  updateTopic(module.id, topic.id, {
                                    title: e.target.value,
                                  })
                                }
                                className='h-8 text-sm'
                              />
                            </div>
                            <div className='space-y-1'>
                              <Label className='text-xs'>Duration (min)</Label>
                              <Input
                                type='number'
                                placeholder='60'
                                value={topic.duration}
                                onChange={(e) =>
                                  updateTopic(module.id, topic.id, {
                                    duration:
                                      Number.parseInt(e.target.value) || 60,
                                  })
                                }
                                className='h-8 text-sm'
                              />
                            </div>
                            <div className='space-y-1'>
                              <Label className='text-xs'>Type</Label>
                              <Select
                                value={topic.type}
                                onValueChange={(value) =>
                                  updateTopic(module.id, topic.id, {
                                    type: value as any,
                                  })
                                }
                              >
                                <SelectTrigger className='h-8 text-sm'>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='live_session'>
                                    Live Session
                                  </SelectItem>
                                  <SelectItem value='discussion'>
                                    Discussion
                                  </SelectItem>
                                  <SelectItem value='project'>
                                    Project
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className='space-y-1'>
                            <Label className='text-xs'>Description *</Label>
                            <Textarea
                              placeholder='Describe what will be covered in this topic...'
                              value={topic.description}
                              onChange={(e) =>
                                updateTopic(module.id, topic.id, {
                                  description: e.target.value,
                                })
                              }
                              rows={2}
                              className='text-sm'
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type='button'
          variant='outline'
          onClick={addModule}
          className='w-full border-dashed h-12 bg-transparent'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Module
        </Button>
      </div>
    </div>
  )
}
