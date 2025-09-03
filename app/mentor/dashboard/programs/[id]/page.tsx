import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface Props {
  params: { id: string }
}

export default function ProgramDashboard({ params }: Props) {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Program Dashboard</h1>
        <p className="text-gray-500">Manage and monitor your program's progress.</p>
      </div>

      <Tabs defaultValue="overview" className="w-[100%]">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones & Tasks</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Students</CardTitle>
                <CardDescription>Number of students enrolled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">150</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completed Milestones</CardTitle>
                <CardDescription>Milestones achieved by students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Score</CardTitle>
                <CardDescription>Average student performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88%</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="milestones" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Milestones & Tasks</h3>
            <Button asChild>
              <Link href={`/mentor/dashboard/programs/${params.id}/milestones`}>Manage Milestones</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Milestones</CardTitle>
                <CardDescription>Important deadlines and tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Project Proposal Submission</span>
                    <span className="text-red-600">Due in 3 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Midterm Evaluation</span>
                    <span className="text-orange-600">Due in 1 week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Task Completion</CardTitle>
                <CardDescription>Track student progress on tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed Tasks</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending Tasks</span>
                    <span className="font-medium text-orange-600">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="curriculum" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Curriculum Management</h3>
            <Button asChild>
              <Link href={`/mentor/dashboard/programs/${params.id}/curriculum`}>Manage Curriculum</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Curriculum Groups</CardTitle>
                <CardDescription>Organize sessions into logical learning modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fundamentals</span>
                    <span className="text-green-600">100% Complete</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Market Research</span>
                    <span className="text-blue-600">50% Complete</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Business Model</span>
                    <span className="text-gray-500">Not Started</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assessments</CardTitle>
                <CardDescription>Track student progress and understanding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Assessments</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending Grades</span>
                    <span className="font-medium text-orange-600">7</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Score</span>
                    <span className="font-medium">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
