"use client";

import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, User, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardSidebar, type NavItem } from "@/components/dashboard-sidebar";
import MobileNav from "@/components/mobile-nav";

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const navItems: NavItem[] = [
    {
      href: "/trainer/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      exactMatch: true,
    },
    { href: "/trainer/profile", label: "Profile", icon: User },
    { href: "/trainer/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const navLinks = [
    { href: "/trainer/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/trainer/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { href: "/trainer/dashboard/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const logoContent = (
    <Link href="/trainer/dashboard">
      <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
    </Link>
  );

  const footerContent = (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
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
      <div className="flex items-center justify-between px-4 py-2.5">
        <Link href="/trainer/dashboard">
          <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
        </Link>
        <MobileNav
          userType="trainer"
          userName="John Doe"
          userRole="Trainer"
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
        onLogout={() => router.push("/login")}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-hidden h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] lg:h-screen bg-gray-50">
        <div className="w-full min-w-0 h-full overflow-y-auto px-3 py-4 pt-16 sm:px-6 sm:py-6 md:p-0">{children}</div>
      </main>
    </div>
  );
}
