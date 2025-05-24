"use client"

import * as React from "react"
import { DayPicker, DayMouseEventHandler, type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = Omit<React.ComponentProps<typeof DayPicker>, "selected" | "mode" | "onSelect"> & {
  selected?: DateRange | undefined;
  mode?: "range";
  onSelect?: (range: DateRange | undefined) => void;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  onDayClick,
  onSelect,
  selected,
  mode = "range", // Default to range mode
  ...props
}: CalendarProps) {
  // Custom day click handler to reset range selection
  const handleDayClick: DayMouseEventHandler = (day, modifiers, e) => {
    // Check if we have a complete range already selected
    if (selected && 
        selected.from && 
        selected.to) {
      // If we have a complete range, we want to reset and start a new selection
      if (onDayClick) {
        // Reset the selection by passing just the clicked day
        const newSelected: DateRange = { from: day };
        onDayClick(day, modifiers, e);
        
        // Force reset of selection on next tick to avoid React-Day-Picker's default handling
        setTimeout(() => {
          if (onSelect) {
            onSelect(newSelected);
          }
        }, 0);
      }
    } else if (onDayClick) {
      // Normal behavior for incomplete ranges
      onDayClick(day, modifiers, e);
    }
  };

  return (
    <DayPicker
      mode={mode}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_previous: "absolute left-1",
        button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        weekdays: "grid grid-cols-7 w-full",
        weekday:
          "text-muted-foreground w-full font-normal text-[0.8rem] text-center",
        row: "grid grid-cols-7 w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        selected: "bg-primary text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        range_start: "rounded-l-md aria-selected:bg-primary aria-selected:text-primary-foreground",
        range_end: "rounded-r-md aria-selected:bg-primary aria-selected:text-primary-foreground",
        ...classNames,
      }}
      onDayClick={handleDayClick}
      onSelect={onSelect}
      selected={selected}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }