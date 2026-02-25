"use client";

import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const navItems: NavItem[] = [
    {
      href: "/mentee/dashboard",
      label: "Overview",
      icon: BarChart3,
      exactMatch: true,
    },
    { href: "/mentee/dashboard/programs", label: "Programs", icon: BookOpen },
    { href: "/mentee/dashboard/profile", label: "Profile", icon: Users },
  ];

  const navLinks = [
    {
      href: "/mentee/dashboard",
      label: "Overview",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      href: "/mentee/dashboard/programs",
      label: "Programs",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      href: "/mentee/dashboard/profile",
      label: "Profile",
      icon: <Users className="h-4 w-4" />,
    },
  ];

  const logoContent = (
    <Link href="/mentee/dashboard">
      <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
    </Link>
  );

  const footerContent = (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src="/placeholder.svg?height=40&width=40"
            alt="User avatar"
          />
          <AvatarFallback className="text-xs">JD</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">John Doe</p>
        </div>
      </div>
    </div>
  );

  const customMobileHeader = (
    <div className="fixed top-0 left-0 right-0 z-30 w-full border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 md:hidden lg:hidden">
      <div className="flex items-center justify-between px-3 py-2.5">
        <Link href="/mentee/dashboard">
          <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
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
        showLogout={true}
        onLogout={() => {
          // In real app, clear auth tokens and redirect to login
          // localStorage.removeItem('token');
          router.push('/login');
        }}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-hidden h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] lg:h-screen bg-gray-50">
        <div className="w-full min-w-0 h-full overflow-y-auto px-3 py-4 pt-16 sm:px-6 sm:py-6 md:px-8 md:py-8 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
