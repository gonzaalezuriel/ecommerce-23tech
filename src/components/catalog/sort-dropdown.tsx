"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"

const sortOptions = [
  { value: "popular", label: "Más popular" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "newest", label: "Más nuevo" },
]

interface SortDropdownProps {
  value: string
  onValueChange: (value: string) => void
}

export function SortDropdown({ value, onValueChange }: SortDropdownProps) {
  const { isAuthenticated } = useAuth()

  const visibleOptions = sortOptions.filter(option => {
    if (!isAuthenticated && (option.value === "price-asc" || option.value === "price-desc")) {
      return false
    }
    return true
  })

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline whitespace-nowrap text-xs text-muted-foreground">
        Ordenar por:
      </span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-8 w-[150px] sm:w-[180px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {visibleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
