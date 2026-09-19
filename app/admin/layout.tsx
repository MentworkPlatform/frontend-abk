"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, School, Settings, BarChart, Home, LogOut, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface AdminNavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const adminNavItems: AdminNavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Mentors", href: "/admin/mentors", icon: Users },
  { name: "School Programs", href: "/admin/school-programs-management", icon: School },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart },
  { name: "Incentive Settings", href: "/admin/incentive-settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isNavActive = (href: string) => {
    if (pathname === href) return true
    if (href !== "/admin/dashboard" && pathname.startsWith(href)) return true
    return false
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0A0A0A]">
      {/* Admin Top Header */}
      <header className="bg-[#0A0A0A] text-white py-3.5 px-4 sm:px-6 border-b border-[#2B2B2B] sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            {/* Mobile Nav Toggle */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-white hover:bg-[#2B2B2B] md:hidden rounded-xl"
                  aria-label="Toggle admin menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(100vw-2rem,300px)] p-0 bg-white border-r border-[#E7E5E1] flex flex-col">
                <div className="p-5 border-b border-[#E7E5E1] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#0A0A0A] text-white px-2 py-0.5 rounded-md">Admin</span>
                  </div>
                </div>
                <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
                  {adminNavItems.map((item) => {
                    const Icon = item.icon
                    const active = isNavActive(item.href)
                    return (
                      <Link
                        key={item.href}
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
                <div className="p-4 border-t border-[#E7E5E1] bg-[#FAF9F6] space-y-2">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[#4B4B4B] hover:text-[#0A0A0A] rounded-xl hover:bg-[#F2F1EE] transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    <span>View Site</span>
                  </Link>
                  <Link
                    href="/logout"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[#6B6B6B] hover:text-[#B0674A] rounded-xl hover:bg-[#FDF2F0] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/admin/dashboard" className="flex items-center gap-2.5" aria-label="Admin Dashboard">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto brightness-0 invert" />
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#2B2B2B] text-white px-2 py-0.5 rounded-md border border-[#3E3E3E]">
                Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-[#2B2B2B] rounded-xl font-medium text-xs sm:text-sm"
              asChild
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">View Site</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-[#F28B82] hover:bg-[#2B2B2B] rounded-xl font-medium text-xs sm:text-sm"
              asChild
            >
              <Link href="/logout">
                <LogOut className="h-4 w-4 mr-1.5" />
                <span>Logout</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-w-0">
        {/* Admin Desktop Sidebar */}
        <aside className="w-64 bg-white border-r border-[#E7E5E1] hidden md:flex md:flex-col shrink-0 min-h-[calc(100vh-61px)]">
          <nav className="p-3 space-y-1 flex-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon
              const active = isNavActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-[#FAF9F6]">
          {children}
        </main>
      </div>
    </div>
  )
}
