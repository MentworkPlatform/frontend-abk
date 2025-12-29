"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Calendar, MessageSquare, BookOpen, Users, BarChart3, Settings, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
} from "@/components/ui/sidebar"

// Sample program data
const mentorPrograms = [
  {
    id: 1,
    title: "Startup Funding Masterclass",
    type: "Group Program",
    status: "Active",
    mentees: 12,
    sessions: 8,
    completedSessions: 3,
    nextSession: "Tomorrow, 10:00 AM",
    revenue: "$14,400",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    title: "Business Growth Strategy",
    type: "1:1 Program",
    status: "Active",
    mentees: 8,
    sessions: 6,
    completedSessions: 2,
    nextSession: "Friday, 2:00 PM",
    revenue: "$16,000",
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    title: "Digital Marketing Essentials",
    type: "Group Program",
    status: "Upcoming",
    mentees: 15,
    sessions: 10,
    completedSessions: 0,
    nextSession: "June 15, 2025",
    revenue: "$14,250",
    rating: 0,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    title: "Leadership Development",
    type: "1:1 Program",
    status: "Completed",
    mentees: 5,
    sessions: 8,
    completedSessions: 8,
    nextSession: "N/A",
    revenue: "$10,000",
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=400",
  },
]

const MentorProgramsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Filter programs based on search query
  const filteredPrograms = mentorPrograms.filter((program) =>
    program.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Add proper error handling for search and filtering
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Ensure mobile menu closes when navigating
  const handleNavigation = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="hidden md:flex">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-4">
              <Link href="/" onClick={handleNavigation}>
                <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={handleNavigation}>
                      <Link href="/mentor/dashboard">
                        <BarChart3 className="h-4 w-4" />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={handleNavigation}>
                      <Link href="/mentor/dashboard/sessions">
                        <Calendar className="h-4 w-4" />
                        <span>Sessions</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={handleNavigation}>
                      <Link href="/mentor/dashboard/messages">
                        <MessageSquare className="h-4 w-4" />
                        <span>Messages</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Programs</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href="/mentor/dashboard/programs">
                        <BookOpen className="h-4 w-4" />
                        <span>My Programs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/mentor/dashboard/earnings">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                          <path d="M12 18V6" />
                        </svg>
                        <span>Earnings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/mentor/dashboard/profile">
                        <Users className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/mentor/dashboard/settings">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Business Mentor</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Public Profile
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile header - improved accessibility and interaction */}
        <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b md:hidden">
          <div className="flex items-center justify-between p-4">
            <Link href="/" onClick={handleNavigation}>
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-6" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </Button>
          </div>

          {/* Improved mobile menu with better navigation */}
          {isMobileMenuOpen && (
            <div className="bg-white p-4 border-t">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Link
                  href="/mentor/dashboard"
                  className="flex flex-col items-center p-3 rounded-lg bg-[#f5f5f5]"
                  onClick={handleNavigation}
                >
                  <BarChart3 className="h-5 w-5 mb-1" />
                  <span className="text-xs">Overview</span>
                </Link>
                <Link
                  href="/mentor/dashboard/sessions"
                  className="flex flex-col items-center p-3 rounded-lg bg-[#f5f5f5]"
                  onClick={handleNavigation}
                >
                  <Calendar className="h-5 w-5 mb-1" />
                  <span className="text-xs">Sessions</span>
                </Link>
                <Link
                  href="/mentor/dashboard/programs"
                  className="flex flex-col items-center p-3 rounded-lg bg-[#FFD500]/20"
                  onClick={handleNavigation}
                >
                  <BookOpen className="h-5 w-5 mb-1" />
                  <span className="text-xs font-bold">Programs</span>
                </Link>
                <Link
                  href="/mentor/dashboard/messages"
                  className="flex flex-col items-center p-3 rounded-lg bg-[#f5f5f5]"
                  onClick={handleNavigation}
                >
                  <MessageSquare className="h-5 w-5 mb-1" />
                  <span className="text-xs">Messages</span>
                </Link>
              </div>
              <div className="flex items-center gap-3 p-3 border-t">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User avatar" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Business Mentor</p>
                </div>
                <Button variant="ghost" size="icon" asChild onClick={handleNavigation}>
                  <Link href="/mentor/dashboard/settings">
                    <Settings className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        <SidebarInset>
          <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">My Programs</h1>
                <p className="text-gray-500">Manage your mentorship programs</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button asChild className="flex-1 md:flex-none bg-[#FFD500] text-black hover:bg-[#e6c000]">
                  <Link href="/trainer/dashboard/programs/create">
                    <Plus className="mr-2 h-4 w-4" /> Create Program
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search programs"
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearch}
                  aria-label="Search programs"
                />
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Programs</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map((program) => (
                    <Link href={`/mentor/dashboard/programs/${program.id}`} key={program.id}>
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <div className="relative h-40">
                          <img
                            src={program.image || "/placeholder.svg"}
                            alt={program.title}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 left-2 flex gap-2">
                            <Badge className="bg-[#FFD500] text-black">{program.type}</Badge>
                            <Badge
                              className={
                                program.status === "Active"
                                  ? "bg-green-500 text-white"
                                  : program.status === "Upcoming"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-500 text-white"
                              }
                            >
                              {program.status}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-2">{program.title}</h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Mentees:</span>
                              <span className="font-medium">{program.mentees}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Sessions:</span>
                              <span className="font-medium">
                                {program.completedSessions}/{program.sessions}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Next session:</span>
                              <span className="font-medium">{program.nextSession}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Revenue:</span>
                              <span className="font-medium">{program.revenue}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#FFD500"
                                className="w-4 h-4 mr-1"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium">
                                {program.rating > 0 ? program.rating : "No ratings yet"}
                              </span>
                            </div>
                            <div>
                              <Progress
                                value={(program.completedSessions / program.sessions) * 100}
                                className="h-2 w-20"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="active" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms
                    .filter((program) => program.status === "Active")
                    .map((program) => (
                      <Link href={`/mentor/dashboard/programs/${program.id}`} key={program.id}>
                        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                          <div className="relative h-40">
                            <img
                              src={program.image || "/placeholder.svg"}
                              alt={program.title}
                              className="w-full h-full object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 left-2 flex gap-2">
                              <Badge className="bg-[#FFD500] text-black">{program.type}</Badge>
                              <Badge className="bg-green-500 text-white">{program.status}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg mb-2">{program.title}</h3>
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Mentees:</span>
                                <span className="font-medium">{program.mentees}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Sessions:</span>
                                <span className="font-medium">
                                  {program.completedSessions}/{program.sessions}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Next session:</span>
                                <span className="font-medium">{program.nextSession}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Revenue:</span>
                                <span className="font-medium">{program.revenue}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="#FFD500"
                                  className="w-4 h-4 mr-1"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">
                                  {program.rating > 0 ? program.rating : "No ratings yet"}
                                </span>
                              </div>
                              <div>
                                <Progress
                                  value={(program.completedSessions / program.sessions) * 100}
                                  className="h-2 w-20"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms
                    .filter((program) => program.status === "Upcoming")
                    .map((program) => (
                      <Link href={`/mentor/dashboard/programs/${program.id}`} key={program.id}>
                        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                          <div className="relative h-40">
                            <img
                              src={program.image || "/placeholder.svg"}
                              alt={program.title}
                              className="w-full h-full object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 left-2 flex gap-2">
                              <Badge className="bg-[#FFD500] text-black">{program.type}</Badge>
                              <Badge className="bg-blue-500 text-white">{program.status}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg mb-2">{program.title}</h3>
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Mentees:</span>
                                <span className="font-medium">{program.mentees}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Sessions:</span>
                                <span className="font-medium">
                                  {program.completedSessions}/{program.sessions}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Start date:</span>
                                <span className="font-medium">{program.nextSession}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Expected revenue:</span>
                                <span className="font-medium">{program.revenue}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms
                    .filter((program) => program.status === "Completed")
                    .map((program) => (
                      <Link href={`/mentor/dashboard/programs/${program.id}`} key={program.id}>
                        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                          <div className="relative h-40">
                            <img
                              src={program.image || "/placeholder.svg"}
                              alt={program.title}
                              className="w-full h-full object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 left-2 flex gap-2">
                              <Badge className="bg-[#FFD500] text-black">{program.type}</Badge>
                              <Badge className="bg-gray-500 text-white">{program.status}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg mb-2">{program.title}</h3>
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Mentees:</span>
                                <span className="font-medium">{program.mentees}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Sessions:</span>
                                <span className="font-medium">
                                  {program.completedSessions}/{program.sessions}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Revenue:</span>
                                <span className="font-medium">{program.revenue}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="#FFD500"
                                  className="w-4 h-4 mr-1"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">{program.rating}</span>
                              </div>
                              <div>
                                <Progress value={100} className="h-2 w-20" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default MentorProgramsPage

