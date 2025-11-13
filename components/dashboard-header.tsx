import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  actionButton?: {
    label: string;
    href: string;
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
    <div className="bg-white border-b w-full px-4 md:px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        {actionButton && (
          <Button
            asChild
            className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
          >
            <Link href={actionButton.href}>
              {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
              {actionButton.label}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
