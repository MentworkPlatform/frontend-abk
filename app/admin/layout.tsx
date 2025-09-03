import type React from "react"
import Link from "next/link"
import { Users, School, Settings, BarChart, Home, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Header */}
      <header className="bg-[#333333] text-white py-3 px-4 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard" className="font-bold text-xl flex items-center">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 mr-2" />
              <span>Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" asChild>
              <Link href="/logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-gray-50 border-r hidden md:block">
          <nav className="p-4 space-y-1">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100">
              <Home className="h-5 w-5 text-gray-500" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/mentors" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100">
              <Users className="h-5 w-5 text-gray-500" />
              <span>Mentors</span>
            </Link>
            <Link
              href="/admin/school-programs-management"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <School className="h-5 w-5 text-gray-500" />
              <span>School Programs</span>
            </Link>
            <Link href="/admin/analytics" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100">
              <BarChart className="h-5 w-5 text-gray-500" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/admin/incentive-settings"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <Settings className="h-5 w-5 text-gray-500" />
              <span>Incentive Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
