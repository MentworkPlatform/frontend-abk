"use client";

import type React from "react";
import Link from "next/link";
import { LayoutDashboard, BookOpen, User } from "lucide-react";
import { DashboardSidebar, type NavItem } from "@/components/dashboard-sidebar";

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems: NavItem[] = [
    {
      href: "/trainer/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      exactMatch: true,
    },
    { href: "/trainer/dashboard/programs", label: "Programs", icon: BookOpen },
    { href: "/trainer/profile", label: "Profile", icon: User },
  ];

  const logoContent = (
    <Link href="/trainer/dashboard">
      <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        navItems={navItems}
        logoContent={logoContent}
        showLogout={true}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-64px)] lg:h-screen bg-gray-50">
        <div className="w-full min-w-0">{children}</div>
      </main>
    </div>
  );
}
