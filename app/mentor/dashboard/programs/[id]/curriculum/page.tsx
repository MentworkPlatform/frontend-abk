"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurriculumGroupsManager } from "@/components/curriculum-groups-manager"
import { AssessmentManager } from "@/components/assessment-manager"

export default function ProgramCurriculumPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Link href={`/mentor/dashboard/programs/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Program
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Program Curriculum</h1>
          <p className="text-gray-500">Organize content and manage assessments for your program</p>
        </div>
      </div>

      <Tabs defaultValue="curriculum" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="curriculum">Curriculum Groups</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum">
          <CurriculumGroupsManager />
        </TabsContent>

        <TabsContent value="assessments">
          <AssessmentManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
