"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
    if (item.exactMatch) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href + "/");
  };

  const defaultLogo = (
    <Link href={logoHref} className="flex items-center gap-2" aria-label="Mentwork home">
      <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
    </Link>
  );

  return (
    <>
      {/* Mobile Header (when no custom header provided) */}
      {customMobileHeader ? (
        customMobileHeader
      ) : (
        <header className="lg:hidden sticky top-0 z-30 border-b border-[#E7E5E1] bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
          <div className="flex items-center justify-between px-4 py-3">
            {logoContent || defaultLogo}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-[#0A0A0A] hover:bg-[#F2F1EE]"
              aria-label="Toggle navigation menu"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>
      )}

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#E7E5E1] transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen z-50 flex-shrink-0 flex flex-col shadow-sm lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b border-[#E7E5E1] flex items-center justify-between flex-shrink-0">
          <div>{logoContent || defaultLogo}</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden h-8 w-8 text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F2F1EE]"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link key={item.href} href={item.href} className="block">
                <div
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none",
                    active
                      ? "bg-[#0A0A0A] text-white shadow-sm"
                      : "text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F2F1EE]"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-[#6B6B6B]")} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {(footerContent || showLogout) && (
          <div className="p-4 border-t border-[#E7E5E1] flex-shrink-0 bg-[#FAF9F6] space-y-3">
            {footerContent}
            {showLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#6B6B6B] hover:text-[#B0674A] hover:bg-[#FDF2F0] transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Log out</span>
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
