"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Users,
  Settings,
  Bell,
  User,
  GraduationCap,
  Rocket,
  Menu,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  { name: "Pre-Launch", href: "/lms/programs/pre-launch-overview", icon: Rocket },
  { name: "Students", href: "/lms/students", icon: Users },
  { name: "Analytics", href: "/lms/analytics", icon: BarChart3 },
  { name: "Settings", href: "/lms/settings", icon: Settings },
]

export default function LMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isNavActive = (href: string) => {
    if (pathname === href) return true
    if (href !== "/lms/dashboard" && pathname.startsWith(href)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0A0A0A]">
      {/* Top Navigation */}
      <Suspense fallback={<div className="h-16 bg-white border-b border-[#E7E5E1]" />}>
        <header className="sticky top-0 z-50 border-b border-[#E7E5E1] bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
          <div className="px-4 sm:px-8 py-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 sm:gap-8">
                {/* Mobile Menu Trigger */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-[#0A0A0A] hover:bg-[#F2F1EE] md:hidden rounded-xl"
                      aria-label="Toggle navigation menu"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[min(100vw-2rem,320px)] p-0 bg-white border-r border-[#E7E5E1] flex flex-col">
                    <div className="p-5 border-b border-[#E7E5E1] flex items-center justify-between">
                      <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                        <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-[#0A0A0A] text-white px-2 py-0.5 rounded-md">LMS</span>
                      </Link>
                    </div>
                    <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
                      {navigation.map((item) => {
                        const Icon = item.icon
                        const active = isNavActive(item.href)
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                              active
                                ? "bg-[#0A0A0A] text-white shadow-xs"
                                : "text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F2F1EE]"
                            }`}
                          >
                            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[#6B6B6B]"}`} />
                            <span>{item.name}</span>
                          </Link>
                        )
                      })}
                    </nav>
                    <div className="p-4 border-t border-[#E7E5E1] bg-[#FAF9F6]">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-[#E7E5E1]">
                          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Emily Rodriguez" />
                          <AvatarFallback className="text-xs bg-[#E7E5E1] text-[#0A0A0A] font-bold">ER</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#0A0A0A] truncate">Emily Rodriguez</p>
                          <p className="text-xs text-[#6B6B6B] truncate">Trainer</p>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <Link href="/" className="flex items-center gap-2.5" aria-label="Mentwork LMS">
                  <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F2F1EE] text-[#0A0A0A] px-2 py-0.5 rounded-md border border-[#E7E5E1]">
                    LMS
                  </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-1">
                  {navigation.map((item) => {
                    const active = isNavActive(item.href)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                          active
                            ? "bg-[#0A0A0A] text-white shadow-xs"
                            : "text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F2F1EE]"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 ${active ? "text-white" : "text-[#6B6B6B]"}`} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F2F1EE] rounded-xl"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 border border-[#E7E5E1] hover:ring-2 hover:ring-[#E7E5E1]">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Emily Rodriguez" />
                        <AvatarFallback className="text-xs bg-[#E7E5E1] text-[#0A0A0A] font-bold">ER</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 rounded-2xl border-[#E7E5E1] shadow-lg p-1.5" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal px-3 py-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold text-[#0A0A0A]">Emily Rodriguez</p>
                        <p className="text-xs text-[#6B6B6B]">emily@example.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#E7E5E1]" />
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm font-medium cursor-pointer">
                      <Link href="/trainer/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-[#6B6B6B]" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm font-medium cursor-pointer">
                      <Link href="/lms/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4 text-[#6B6B6B]" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#E7E5E1]" />
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm font-medium text-[#B0674A] hover:bg-[#FDF2F0] cursor-pointer">
                      <Link href="/logout" className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
      </Suspense>

      {/* Main Content */}
      <main className="min-w-0">{children}</main>
    </div>
  )
}
