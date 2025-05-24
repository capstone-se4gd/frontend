"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerWithRangeProps {
  date: DateRange | undefined
  onSelect: (range: DateRange | undefined) => void
  className?: string
}

export function DatePickerWithRange({
  date,
  onSelect,
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={onSelect} // Use onSelect instead of onDayClick
        numberOfMonths={2}
        className="rounded-md border"
      />
      
      <div className="flex items-center justify-between px-4 pb-3">
        <div className="text-sm text-muted-foreground">
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            "Pick a date range"
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onSelect(undefined)}
          className="text-xs"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}