"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/context/auth-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="fixed inset-0 z-50 flex h-screen overflow-hidden bg-background">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Main area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Admin header */}
          <header className="flex h-14 items-center justify-between border-b border-border px-4" style={{ backgroundColor: "#0d0d14" }}>
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 overflow-y-auto p-0">
                <VisuallyHidden>
                  <SheetTitle>Menú de Administración</SheetTitle>
                </VisuallyHidden>
                <AdminSidebar />
              </SheetContent>
            </Sheet>

            <span className="text-sm font-medium text-foreground md:hidden">Panel Admin</span>

            <div className="hidden md:block" />

            {/* Admin avatar */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user?.name} {user?.lastname}</span>
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user?.name?.[0]}{user?.lastname?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
