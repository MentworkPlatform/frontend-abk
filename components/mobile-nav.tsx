"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Settings, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MobileNavProps {
  userType: "mentor" | "mentee" | "trainer"
  userName: string
  userRole?: string
  userAvatar?: string
  links: {
    href: string
    label: string
    icon: React.ReactNode
  }[]
}

export default function MobileNav({ userType, userName, userRole, userAvatar, links }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-[#0A0A0A] hover:bg-[#F2F1EE] active:scale-95 transition-transform md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(100vw-2rem,320px)] p-0 bg-white border-r border-[#E7E5E1] flex flex-col">
        <div className="flex flex-col h-full">
          {/* Header & User Profile */}
          <div className="p-5 border-b border-[#E7E5E1]">
            <div className="flex items-center justify-between mb-5 pr-8">
              <Link href="/" onClick={() => setOpen(false)} aria-label="Mentwork home">
                <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
              </Link>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E1]">
              <Avatar className="h-10 w-10 border border-[#E7E5E1]">
                <AvatarImage src={userAvatar || "/placeholder.svg?height=40&width=40"} alt={userName} />
                <AvatarFallback className="bg-[#E7E5E1] text-[#0A0A0A] font-bold text-sm">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-bold text-sm text-[#0A0A0A] truncate">{userName}</p>
                <p className="text-xs text-[#6B6B6B] truncate">
                  {userRole || (userType === "mentor" ? "Mentor" : userType === "trainer" ? "Trainer" : "Mentee")}
                </p>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto py-3 px-3">
            <nav className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href + "/") && link.href !== `/${userType}/dashboard`)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#0A0A0A] text-white shadow-xs"
                        : "text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F2F1EE]"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-[#6B6B6B]"}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Footer Settings */}
          <div className="border-t border-[#E7E5E1] p-4 bg-[#FAF9F6]">
            <Button
              variant="outline"
              className="w-full min-h-[44px] justify-center gap-2 rounded-xl border-[#E7E5E1] bg-white text-[#0A0A0A] font-semibold hover:bg-[#F2F1EE]"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link href={userType === "trainer" ? "/trainer/dashboard/settings" : `/${userType}/settings`}>
                <Settings className="h-4 w-4 text-[#6B6B6B]" />
                <span>Settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

