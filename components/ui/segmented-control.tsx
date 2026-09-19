"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SegmentedControlOption<T extends string = string> {
  value: T
  label: string
  badge?: string | number
  icon?: React.ReactNode
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: "sm" | "default" | "lg"
  fullWidth?: boolean
  className?: string
  disabled?: boolean
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = "default",
  fullWidth = true,
  className,
  disabled = false,
}: SegmentedControlProps<T>) {
  const sizeClasses = {
    sm: "p-0.5 text-xs h-9",
    default: "p-1 text-xs sm:text-sm h-11",
    lg: "p-1.5 text-sm sm:text-base h-12",
  }

  const itemPadding = {
    sm: "px-2.5 py-1",
    default: "px-3.5 py-1.5",
    lg: "px-5 py-2",
  }

  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center rounded-xl bg-[#F2F1EE] border border-[#E7E5E1]",
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        disabled ? "opacity-50 pointer-events-none" : "",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-1 select-none",
              itemPadding[size],
              isSelected
                ? "bg-[#0A0A0A] text-white shadow-sm"
                : "text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-black/5"
            )}
          >
            {option.icon}
            <span>{option.label}</span>
            {option.badge !== undefined && (
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold",
                  isSelected
                    ? "bg-white text-[#0A0A0A]"
                    : "bg-[#E7E5E1] text-[#6B6B6B]"
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
