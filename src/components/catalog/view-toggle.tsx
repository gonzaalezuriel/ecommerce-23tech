"use client"

import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ViewToggleProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onViewChange("grid")}
        className={cn(
          "transition-colors",
          view === "grid" && "bg-primary/20 text-primary"
        )}
        aria-label="Vista en grilla"
      >
        <LayoutGrid className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onViewChange("list")}
        className={cn(
          "transition-colors",
          view === "list" && "bg-primary/20 text-primary"
        )}
        aria-label="Vista en lista"
      >
        <List className="size-4" />
      </Button>
    </div>
  )
}
