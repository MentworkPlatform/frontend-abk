"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface GroupedOption {
  groupLabel: string;
  options: MultiSelectOption[];
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: string;
  groupedOptions?: GroupedOption[];
}

export function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = "Select options",
  disabled = false,
  className,
  maxHeight = "400px",
  groupedOptions,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onSelectionChange(selected.filter((s) => s !== item));
  };

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onSelectionChange(selected.filter((s) => s !== value));
    } else {
      onSelectionChange([...selected, value]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-[42px] h-auto",
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selected.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {selected.length > 0 && selected.length <= 2 ? (
              selected.map((item) => {
                const option = options.find((opt) => opt.value === item);
                return (
                  <div
                    key={item}
                    className="flex items-center gap-1 bg-[#FFD500] text-black px-2 py-1 rounded-md text-sm"
                  >
                    {option?.label || item}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(item);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleUnselect(item)}
                    >
                      <X className="h-3 w-3 text-black" />
                    </button>
                  </div>
                );
              })
            ) : selected.length > 2 ? (
              <div className="flex items-center gap-1 bg-[#FFD500] text-black px-2 py-1 rounded-md text-sm">
                {selected.length} selected
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSelectionChange([]);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => onSelectionChange([])}
                >
                  <X className="h-3 w-3 text-black" />
                </button>
              </div>
            ) : null}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div style={{ maxHeight }} className="overflow-y-auto">
          <div className="p-2">
            {groupedOptions && groupedOptions.length > 0 ? (
              groupedOptions.map((group, groupIndex) => (
                <div
                  key={group.groupLabel}
                  className={groupIndex > 0 ? "mt-4" : ""}
                >
                  <div className="px-2 py-2 text-sm font-semibold text-foreground bg-muted/50 rounded-md mb-2">
                    {group.groupLabel}
                  </div>
                  <div className="space-y-1">
                    {group.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground rounded-md p-2 cursor-pointer ml-2"
                        onClick={() => handleToggle(option.value)}
                      >
                        <Checkbox
                          checked={selected.includes(option.value)}
                          onCheckedChange={() => handleToggle(option.value)}
                        />
                        <label
                          className="flex-1 cursor-pointer text-sm"
                          onClick={(e) => e.preventDefault()}
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-2">
                {options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground rounded-md p-2 cursor-pointer"
                    onClick={() => handleToggle(option.value)}
                  >
                    <Checkbox
                      checked={selected.includes(option.value)}
                      onCheckedChange={() => handleToggle(option.value)}
                    />
                    <label
                      className="flex-1 cursor-pointer text-sm"
                      onClick={(e) => e.preventDefault()}
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
                {options.length === 0 && (
                  <div className="text-sm text-muted-foreground p-2 text-center">
                    No options available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {selected.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onSelectionChange([]);
                setOpen(false);
              }}
            >
              Clear all ({selected.length})
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
