import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, GraduationCap, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Mentee Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>Find a Mentor</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="programs">My Programs</TabsTrigger>
            <TabsTrigger value="mentors">My Mentors</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mentors Connected</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">School Programs</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">New this month</p>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/school-programs" className="w-full">
                    <Button variant="outline" className="w-full">
                      View Programs
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            {/* School Programs Section */}
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>School & Organization Programs</CardTitle>
                  <CardDescription>Access your school and organization entrepreneurship programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">TechStart Entrepreneurship Program</h3>
                          <p className="text-sm text-muted-foreground">Silicon Valley High School</p>
                          <div className="mt-2 flex items-center">
                            <div className="h-2 w-full max-w-[150px] rounded-full bg-slate-100">
                              <div className="h-full w-[65%] rounded-full bg-primary"></div>
                            </div>
                            <span className="ml-2 text-xs text-muted-foreground">65% complete</span>
                          </div>
                        </div>
                        <Link href="/dashboard/school-programs/1">
                          <Button>Continue Learning</Button>
                        </Link>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Youth Business Accelerator</h3>
                          <p className="text-sm text-muted-foreground">Entrepreneurship Foundation</p>
                          <p className="mt-1 text-xs text-muted-foreground">You've been invited to join this program</p>
                        </div>
                        <Link href="/dashboard/school-programs">
                          <Button variant="outline">View Invitation</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/school-programs" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Programs
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="programs" className="space-y-4">
            <div className="grid gap-4">
              {/* Program content */}
              <Card>
                <CardHeader>
                  <CardTitle>My Programs</CardTitle>
                  <CardDescription>View and manage your active mentorship programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-semibold">Career Development Mentorship</h3>
                      <p className="text-sm text-muted-foreground">With Sarah Johnson</p>
                      <div className="mt-2 flex items-center">
                        <div className="h-2 w-full max-w-[150px] rounded-full bg-slate-100">
                          <div className="h-full w-[75%] rounded-full bg-primary"></div>
                        </div>
                        <span className="ml-2 text-xs text-muted-foreground">75% complete</span>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="font-semibold">Startup Founder Mentorship</h3>
                      <p className="text-sm text-muted-foreground">With Michael Chen</p>
                      <div className="mt-2 flex items-center">
                        <div className="h-2 w-full max-w-[150px] rounded-full bg-slate-100">
                          <div className="h-full w-[30%] rounded-full bg-primary"></div>
                        </div>
                        <span className="ml-2 text-xs text-muted-foreground">30% complete</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="mentors" className="space-y-4">
            <div className="grid gap-4">
              {/* Mentors content */}
              <Card>
                <CardHeader>
                  <CardTitle>My Mentors</CardTitle>
                  <CardDescription>Your current mentorship connections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary"></div>
                        <div>
                          <h3 className="font-semibold">Sarah Johnson</h3>
                          <p className="text-sm text-muted-foreground">Career Development Specialist</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary"></div>
                        <div>
                          <h3 className="font-semibold">Michael Chen</h3>
                          <p className="text-sm text-muted-foreground">Startup Founder & Investor</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary"></div>
                        <div>
                          <h3 className="font-semibold">Priya Patel</h3>
                          <p className="text-sm text-muted-foreground">Tech Industry Leader</p>
                        </div>
                      </div>
                    </div>
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
