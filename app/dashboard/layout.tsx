"use client";

import type React from "react";
import Link from "next/link";
import { BookOpen, Users, BarChart3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DashboardSidebar, type NavItem } from "@/components/dashboard-sidebar";
import MobileNav from "@/components/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: BarChart3,
      exactMatch: true,
    },
    { href: "/dashboard/programs", label: "Programs", icon: BookOpen },
    { href: "/dashboard/profile", label: "Profile", icon: Users },
  ];

  const navLinks = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      href: "/dashboard/programs",
      label: "Programs",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: <Users className="h-4 w-4" />,
    },
  ];

  const logoContent = (
    <Link href="/">
      <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
    </Link>
  );

  const footerContent = (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Avatar>
          <AvatarImage
            src="/placeholder.svg?height=40&width=40"
            alt="User avatar"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">John Doe</p>
          <p className="text-xs text-gray-500">Free Plan</p>
        </div>
      </div>
      <Button variant="outline" className="w-full">
        Upgrade Plan
      </Button>
    </>
  );

  const customMobileHeader = (
    <div className="fixed top-0 left-0 right-0 z-30 w-full bg-white border-b md:hidden lg:hidden">
      <div className="flex items-center justify-between p-4">
        <Link href="/">
          <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-6" />
        </Link>
        <MobileNav
          userType="mentee"
          userName="John Doe"
          userRole="Free Plan"
          links={navLinks}
        />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        navItems={navItems}
        logoContent={logoContent}
        footerContent={footerContent}
        customMobileHeader={customMobileHeader}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-64px)] lg:h-screen bg-gray-50">
        <div className="w-full min-w-0 ">{children}</div>
      </main>
    </div>
  );
}
