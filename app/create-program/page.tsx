import Link from "next/link"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export default function CreateProgramPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-8">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Create a Mentorship Program</h1>
            <Button variant="outline" asChild>
              <Link href="/mentor/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-lg rounded-xl">
          <CardContent className="p-6 md:p-8">
            <form className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Program Details</h2>

                <div className="space-y-2">
                  <Label htmlFor="program-title">Program Title</Label>
                  <Input id="program-title" placeholder="e.g. Business Growth Strategy" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="program-description">Program Description</Label>
                  <Textarea
                    id="program-description"
                    placeholder="Describe what mentees will learn and achieve in this program"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="program-type">Program Type</Label>
                    <Select>
                      <SelectTrigger id="program-type">
                        <SelectValue placeholder="Select program type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-on-one">One-on-One</SelectItem>
                        <SelectItem value="group">Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program-category">Category</Label>
                    <Select>
                      <SelectTrigger id="program-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business-growth">Business Growth</SelectItem>
                        <SelectItem value="startup">Startup</SelectItem>
                        <SelectItem value="funding">Funding</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="program-price">Price (USD)</Label>
                    <Input id="program-price" type="number" placeholder="e.g. 1200" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program-sessions">Number of Sessions</Label>
                    <Input id="program-sessions" type="number" placeholder="e.g. 6" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold">Program Structure</h2>

                <div className="space-y-4">
                  <Label>Session Format</Label>
                  <RadioGroup defaultValue="video">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="video" id="video" />
                      <Label htmlFor="video" className="font-normal">
                        Video Call
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-person" id="in-person" />
                      <Label htmlFor="in-person" className="font-normal">
                        In-Person
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hybrid" id="hybrid" />
                      <Label htmlFor="hybrid" className="font-normal">
                        Hybrid
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Session Outline</Label>
                  <div className="space-y-4">
                    {[1, 2, 3].map((session) => (
                      <Card key={session} className="border border-[#F5F5F5]">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Session {session}</h3>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`session-${session}-title`}>Title</Label>
                              <Input
                                id={`session-${session}-title`}
                                placeholder="e.g. Introduction to Business Strategy"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`session-${session}-description`}>Description</Label>
                              <Textarea
                                id={`session-${session}-description`}
                                placeholder="What will be covered in this session"
                                rows={2}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Session
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold">Program Settings</h2>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-approve">Auto-approve applications</Label>
                    <p className="text-sm text-gray-500">Automatically approve mentee applications</p>
                  </div>
                  <Switch id="auto-approve" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-program">Public program</Label>
                    <p className="text-sm text-gray-500">Make this program visible in search results</p>
                  </div>
                  <Switch id="public-program" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="certificate">Offer certificate</Label>
                    <p className="text-sm text-gray-500">Provide a certificate upon program completion</p>
                  </div>
                  <Switch id="certificate" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline">Save as Draft</Button>
                <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000]">Publish Program</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
