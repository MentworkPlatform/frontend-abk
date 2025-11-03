"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, BookOpen, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TrainerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/trainer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/trainer/dashboard/programs", label: "Programs", icon: BookOpen },
    { href: "/trainer/profile", label: "Profile", icon: User },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Link href="/trainer/dashboard" className="font-bold text-lg">
            Mentwork
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r transform transition-transform lg:translate-x-0 lg:static z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b">
          <Link href="/trainer/dashboard" className="font-bold text-xl hidden lg:block">
            Mentwork
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? "default" : "ghost"}
                  className={`w-full justify-start ${active ? "bg-[#FFD500] text-black hover:bg-[#e6c000]" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-0 flex-1">{children}</main>
    </div>
  )
}
