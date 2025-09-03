"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Users,
  MessageSquare,
  Settings,
  Bell,
  Search,
  User,
  GraduationCap,
  Rocket,
} from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Dashboard", href: "/lms/dashboard", icon: BarChart3 },
  { name: "Programs", href: "/lms/programs", icon: BookOpen },
  // Changed the href for Pre-Launch to point to a new overview page
  { name: "Pre-Launch", href: "/lms/programs/pre-launch-overview", icon: Rocket },
  { name: "Students", href: "/lms/students", icon: Users },
  { name: "Messages", href: "/lms/messages", icon: MessageSquare },
  { name: "Analytics", href: "/lms/analytics", icon: BarChart3 },
  { name: "Settings", href: "/lms/settings", icon: Settings },
]

export default function LMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Top Navigation */}
      <Suspense fallback={<div>Loading...</div>}>
        <header className="bg-white border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2">
                  <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-5 w-5 text-[#FFD500]" />
                    <span className="font-semibold text-gray-700">LMS</span>
                  </div>
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                          isActive ? "text-[#FFD500]" : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search programs, students..." className="pl-10 w-64" />
                </div>

                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Trainer" />
                        <AvatarFallback>TR</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Emily Rodriguez</p>
                        <p className="text-xs leading-none text-muted-foreground">emily@example.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/trainer/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/lms/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
      </Suspense>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
