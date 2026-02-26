"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exactMatch?: boolean; // If true, only matches exact path, not sub-routes
}

interface DashboardSidebarProps {
  navItems: NavItem[];
  logoHref?: string;
  logoContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  showLogout?: boolean;
  onLogout?: () => void;
  customMobileHeader?: React.ReactNode; // Optional custom mobile header to replace the default one
}

export function DashboardSidebar({
  navItems,
  logoHref = "/",
  logoContent,
  footerContent,
  showLogout = false,
  onLogout,
  customMobileHeader,
}: DashboardSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (pathname === item.href) return true;
    // If exactMatch is true, only match exact path
    if (item.exactMatch) {
      return pathname === item.href;
    }
    // Otherwise, match exact or sub-routes
    return pathname.startsWith(item.href + "/");
  };

  const defaultLogo = (
    <Link href={logoHref} className="font-bold text-xl">
      Mentwork
    </Link>
  );

  return (
    <>
      {/* Mobile Header */}
      {customMobileHeader ? (
        customMobileHeader
      ) : (
        <header className="lg:hidden sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
          <div className="flex items-center justify-between px-4 py-2.5">
            {logoContent || defaultLogo}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-56 bg-white border-r transform transition-transform lg:translate-x-0 lg:static lg:h-screen z-30 flex-shrink-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex-shrink-0">
          <div className="hidden lg:block [&_img]:h-8">{logoContent || defaultLogo}</div>
        </div>

        <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start h-9 text-sm font-medium ${
                    active ? "bg-[#FFD500] text-black hover:bg-[#e6c000]" : ""
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-4 w-4 mr-2 shrink-0" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {(footerContent || showLogout) && (
          <div className="p-3 border-t flex-shrink-0">
            {footerContent}
            {showLogout && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start h-9 text-sm bg-transparent"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4 mr-2 shrink-0" />
                Logout
              </Button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
