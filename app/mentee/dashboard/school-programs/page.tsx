import Link from "next/link"
import { GraduationCap, School, Building, Clock, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function SchoolProgramsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">School & Organization Programs</h2>
        </div>

        <Tabs defaultValue="enrolled" className="space-y-4">
          <TabsList>
            <TabsTrigger value="enrolled">Enrolled Programs</TabsTrigger>
            <TabsTrigger value="available">Available Programs</TabsTrigger>
            <TabsTrigger value="completed">Completed Programs</TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge className="mb-2">In Progress</Badge>
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">TechStart Entrepreneurship Program</CardTitle>
                  <CardDescription>Silicon Valley High School</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div className="h-full w-[65%] rounded-full bg-primary"></div>
                    </div>
                    <div className="pt-2 flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Current week: Week 6 - Market Validation</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      <span>5 assignments completed</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/mentee/dashboard/school-programs/1" className="w-full">
                    <Button className="w-full">Continue Learning</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="mb-2">
                      Invitation
                    </Badge>
                    <Building className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">Youth Business Accelerator</CardTitle>
                  <CardDescription>Entrepreneurship Foundation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      A 10-week program designed to help young entrepreneurs develop their business ideas from concept
                      to launch.
                    </p>
                    <div className="pt-2 flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Duration: 10 weeks</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                  <Button variant="outline" className="w-full">
                    Decline
                  </Button>
                  <Button className="w-full">Accept Invitation</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="mb-2">
                      Open Enrollment
                    </Badge>
                    <School className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">Social Entrepreneurship Workshop</CardTitle>
                  <CardDescription>Community Impact Network</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Learn how to create businesses that address social and environmental challenges while generating
                      sustainable revenue.
                    </p>
                    <div className="pt-2 flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Duration: 6 weeks</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="mb-2">
                      Completed
                    </Badge>
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">Intro to Business Fundamentals</CardTitle>
                  <CardDescription>Westside High School</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Final Grade</span>
                      <span className="font-medium">A (95%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div className="h-full w-[95%] rounded-full bg-green-500"></div>
                    </div>
                    <div className="pt-2 flex items-center text-sm text-muted-foreground">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      <span>Certificate Earned</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                  <Button variant="outline" className="w-full">
                    View Certificate
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Review Materials
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
