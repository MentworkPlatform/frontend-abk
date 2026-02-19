"use client";

import type React from "react";
import Link from "next/link";
import { LayoutDashboard, BookOpen, User, Settings } from "lucide-react";
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
    { href: "/trainer/profile", label: "Profile", icon: User },
    { href: "/trainer/dashboard/settings", label: "Settings", icon: Settings },
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
      <main className="flex-1 min-w-0 overflow-hidden h-[calc(100vh-64px)] lg:h-screen bg-gray-50">
        <div className="w-full min-w-0 h-full overflow-y-auto md:p-8 p-4 pt-16 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
