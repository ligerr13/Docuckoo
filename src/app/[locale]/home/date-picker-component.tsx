"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  error?: boolean;
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function DatePicker({ selected, onSelect, error }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleDateChange = (date: Date | undefined) => {
    onSelect(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            id="date"
            placeholder="YYYY-MM-DD"
            className={cn(
              "bg-background pr-10",
              error && "border-red-500"
            )}
            value={selected ? format(selected, "PPP") : ""}
            onChange={(e) => {
              const date = new Date(e.target.value)
              if (isValidDate(date)) {
                onSelect(date)
              }
            }}
          />
          <Button
            id="date-picker-button"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            aria-label="Select date"
          >
            <CalendarIcon className="size-3.5" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="end"
      >
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleDateChange}
          initialFocus
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}