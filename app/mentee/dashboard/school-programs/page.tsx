import Link from "next/link"
import { GraduationCap, School, Building, Clock, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function SchoolProgramsPage() {
  return (
    <div className="flex flex-col w-full md:px-6 md:pt-8 md:pb-8">
      <div className="flex-1 space-y-4 pt-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">School & Organization Programs</h2>
        </div>

        <Tabs defaultValue="enrolled" className="space-y-4">
          <TabsList className="w-full flex-wrap h-auto gap-1 p-1 sm:w-auto">
            <TabsTrigger value="enrolled" className="flex-1 min-w-0 text-xs sm:text-sm sm:flex-initial">Enrolled</TabsTrigger>
            <TabsTrigger value="available" className="flex-1 min-w-0 text-xs sm:text-sm sm:flex-initial">Available</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 min-w-0 text-xs sm:text-sm sm:flex-initial">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="space-y-4 mt-4">
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="p-4 pb-2 sm:p-6">
                  <div className="flex justify-between items-center">
                    <Badge className="mb-2">In Progress</Badge>
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-xl leading-tight">TechStart Entrepreneurship Program</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Silicon Valley High School</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
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
                <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <Link href="/mentee/dashboard/school-programs/1" className="w-full">
                    <Button className="w-full" size="sm">Continue Learning</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-4 mt-4">
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="p-4 pb-2 sm:p-6">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="mb-2">
                      Invitation
                    </Badge>
                    <Building className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-base sm:text-xl leading-tight">Youth Business Accelerator</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Entrepreneurship Foundation</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">
                      A 10-week program designed to help young entrepreneurs develop their business ideas from concept
                      to launch.
                    </p>
                    <div className="pt-2 flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Duration: 10 weeks</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 p-4 pt-0 sm:p-6 sm:pt-0">
                  <Button variant="outline" className="w-full" size="sm">Decline</Button>
                  <Button className="w-full" size="sm">Accept Invitation</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2 sm:p-6">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="mb-2">
                      Open Enrollment
                    </Badge>
                    <School className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-base sm:text-xl leading-tight">Social Entrepreneurship Workshop</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Community Impact Network</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">
                      Learn how to create businesses that address social and environmental challenges while generating
                      sustainable revenue.
                    </p>
                    <div className="pt-2 flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Duration: 6 weeks</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <Button variant="outline" className="w-full" size="sm">Apply Now</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="p-4 pb-2 sm:p-6">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="mb-2">
                      Completed
                    </Badge>
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-base sm:text-xl leading-tight">Intro to Business Fundamentals</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Westside High School</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
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
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 p-4 pt-0 sm:p-6 sm:pt-0">
                  <Button variant="outline" className="w-full" size="sm">View Certificate</Button>
                  <Button variant="secondary" className="w-full" size="sm">Review Materials</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
