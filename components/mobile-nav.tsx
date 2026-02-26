"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MobileNavProps {
  userType: "mentor" | "mentee"
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
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4 pr-10">
              <Link href="/" onClick={() => setOpen(false)}>
                <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar || "/placeholder.svg?height=40&width=40"} alt={userName} />
                <AvatarFallback>
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-gray-500">{userRole || (userType === "mentor" ? "Mentor" : "Mentee")}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto py-4">
            <nav className="grid gap-2 px-2">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive ? "bg-[#FFD500]/20 text-black font-medium" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="border-t p-4">
            <Button variant="outline" className="w-full" asChild onClick={() => setOpen(false)}>
              <Link href={`/${userType}/settings`}>Settings</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
