"use client"

import Link from "next/link"
import { Monitor, Laptop, MonitorSmartphone, Keyboard, Mouse, Cpu, Headphones } from "lucide-react"
import type { Category } from "@/types"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

const categoryIcons: Record<string, LucideIcon> = {
  "monitores": Monitor,
  "notebooks": Laptop,
  "smartphones": MonitorSmartphone,
  "teclados": Keyboard,
  "mouse": Mouse,
  "componentes": Cpu,
  "accesorios": Headphones,
}

interface CategoryNavProps {
  categories: Category[]
  activeSlug?: string | null
}

export function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  return (
    <nav className="w-full py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
          {categories
            .filter((cat) => cat.active)
            .map((category) => {
              const Icon = categoryIcons[category.slug] ?? Monitor
              const isActive = activeSlug === category.slug
              return (
                <Link
                  key={category.id}
                  href={isActive ? "/catalogo" : `/catalogo?cat=${category.slug}`}
                  scroll={false}
                  className={cn(
                    "group flex shrink-0 items-center gap-2.5 rounded-lg border px-4 py-3 transition-all duration-300",
                    isActive
                      ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                      : "border-border bg-surface hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-[0_8px_20px_rgba(0,212,255,0.12)]"
                  )}
                >
                  <Icon className={cn(
                    "size-4 transition-all duration-300",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:scale-125 group-hover:text-primary"
                  )} />
                  <span className={cn(
                    "whitespace-nowrap text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}>
                    {category.name}
                  </span>
                </Link>
              )
            })}
        </div>
      </div>
    </nav>
  )
}
