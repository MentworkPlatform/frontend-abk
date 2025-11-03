"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, BookOpen, Users, BarChart3, Settings, DollarSign, Award, Target, School } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import MobileNav from "@/components/mobile-nav"

export default function MentorDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navLinks = [
    {
      href: "/mentor/dashboard",
      label: "Overview",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      href: "/mentor/dashboard/sessions",
      label: "Sessions",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      href: "/mentor/dashboard/programs",
      label: "Programs",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      href: "/mentor/dashboard/school-programs",
      label: "School Programs",
      icon: <School className="h-4 w-4" />,
    },
    {
      href: "/mentor/dashboard/earnings",
      label: "Earnings",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      href: "/mentor/rewards",
      label: "My Rewards",
      icon: <Award className="h-4 w-4" />,
    },
    {
      href: "/mentor/dashboard/profile",
      label: "Profile",
      icon: <Users className="h-4 w-4" />,
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#f5f5f5]">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-4">
              <Link href="/">
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
                    <SidebarMenuButton asChild isActive={pathname === "/mentor/dashboard"}>
                      <Link href="/mentor/dashboard">
                        <BarChart3 className="h-4 w-4" />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/mentor/dashboard/sessions"}>
                      <Link href="/mentor/dashboard/sessions">
                        <Calendar className="h-4 w-4" />
                        <span>Sessions</span>
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
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === "/mentor/dashboard/programs" || pathname.startsWith("/mentor/dashboard/programs/")
                      }
                    >
                      <Link href="/mentor/dashboard/programs">
                        <BookOpen className="h-4 w-4" />
                        <span>My Programs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/mentor/dashboard/school-programs"}>
                      <Link href="/mentor/dashboard/school-programs">
                        <School className="h-4 w-4" />
                        <span>School Programs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/mentor/dashboard/earnings"}>
                      <Link href="/mentor/dashboard/earnings">
                        <DollarSign className="h-4 w-4" />
                        <span>Earnings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Growth</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/mentor/goals"}>
                      <Link href="/mentor/goals">
                        <Target className="h-4 w-4" />
                        <span>My Goals</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/mentor/rewards"}>
                      <Link href="/mentor/rewards">
                        <Award className="h-4 w-4" />
                        <span>My Rewards</span>
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
                    <SidebarMenuButton asChild isActive={pathname === "/mentor/dashboard/profile"}>
                      <Link href="/mentor/dashboard/profile">
                        <Users className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/mentor/dashboard/settings"}>
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
              <Button variant="outline" className="w-full bg-transparent">
                View Public Profile
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b md:hidden">
          <div className="flex items-center justify-between p-4">
            <Link href="/">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-6" />
            </Link>
            <MobileNav userType="mentor" userName="Sarah Johnson" userRole="Business Mentor" links={navLinks} />
          </div>
        </div>

        <SidebarInset>
          <div className="flex-1 md:p-8 p-4 pt-16 md:pt-8">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
