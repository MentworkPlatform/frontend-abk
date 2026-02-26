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
    <div className="bg-white border-b w-full px-4 py-3 sm:py-4 md:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
          <p className="text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-none">{description}</p>
        </div>
        {actionButton && (
          actionButton.onClick ? (
            <Button
              size="sm"
              onClick={actionButton.onClick}
              className="w-full sm:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000] shrink-0"
            >
              {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
              {actionButton.label}
            </Button>
          ) : actionButton.href ? (
            <Button
              asChild
              size="sm"
              className="w-full sm:w-auto bg-[#FFD500] text-black hover:bg-[#e6c000] shrink-0"
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
