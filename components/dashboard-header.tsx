import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  actionButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
}

export function DashboardHeader({
  title,
  description,
  actionButton,
}: DashboardHeaderProps) {
  const ActionIcon = actionButton?.icon;

  return (
    <div className="bg-white border-b border-[#E7E5E1] w-full px-4 py-4 sm:py-5 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A0A0A] truncate">{title}</h1>
          <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1 line-clamp-2 sm:line-clamp-none">{description}</p>
        </div>
        {actionButton && (
          actionButton.onClick ? (
            <Button
              size="sm"
              onClick={actionButton.onClick}
              className="w-full sm:w-auto bg-[#F5C400] text-[#0A0A0A] font-bold hover:bg-[#E5B700] rounded-xl shadow-xs transition-all active:scale-[0.98] shrink-0"
            >
              {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
              {actionButton.label}
            </Button>
          ) : actionButton.href ? (
            <Button
              asChild
              size="sm"
              className="w-full sm:w-auto bg-[#F5C400] text-[#0A0A0A] font-bold hover:bg-[#E5B700] rounded-xl shadow-xs transition-all active:scale-[0.98] shrink-0"
            >
              <Link href={actionButton.href}>
                {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                {actionButton.label}
              </Link>
            </Button>
          ) : null
        )}
      </div>
    </div>
  );
}

