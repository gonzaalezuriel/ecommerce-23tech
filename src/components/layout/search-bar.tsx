"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/busqueda?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors peer-focus:text-primary" />
      <Input
        type="text"
        placeholder="¿Qué estás buscando?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="peer pl-9 bg-transparent border-border/50 transition-all duration-300 focus-visible:border-primary focus-visible:shadow-[0_0_15px_rgba(0,212,255,0.15)] focus-visible:ring-0"
      />
    </form>
  )
}
