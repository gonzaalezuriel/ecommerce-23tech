"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Menu,
  User,
  Search,
  LogOut,
  LayoutDashboard,
  UserCircle,
  History,
  LogIn,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { SearchBar } from "@/components/layout/search-bar"
import { CartIcon } from "@/components/cart/cart-icon"
import { Category } from "@/types"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

interface HeaderProps {
  categories: Category[]
}

export function Header({ categories }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileQuery, setMobileQuery] = useState("")
  const router = useRouter()
  const { user, role, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      toast.error("No se pudo cerrar sesión, intentá de nuevo")
    }
  }

  const handleMobileSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = mobileQuery.trim()
    if (trimmed) {
      router.push(`/busqueda?q=${encodeURIComponent(trimmed)}`)
      setMobileOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/50" style={{ backgroundColor: "#0d0d14" }}>
      {/* Main header row */}
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0" style={{ backgroundColor: "#0d0d14" }}>
            <SheetHeader className="p-4 border-b border-border/50">
              <SheetTitle>
                <span className="text-[#00d4ff] font-bold">23</span>
                <span className="text-white font-bold">Tech</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              {/* Mobile search */}
              <form onSubmit={handleMobileSearch} className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="¿Qué estás buscando?"
                  value={mobileQuery}
                  onChange={(e) => setMobileQuery(e.target.value)}
                  className="pl-9 bg-transparent border-border/50"
                />
              </form>

              <Separator className="my-2" />

              {/* Mobile category links */}
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Categorías</p>
              <Link
                href="/catalogo"
                onClick={() => setMobileOpen(false)}
                className="text-sm py-2 px-2 rounded-md hover:bg-accent hover:text-primary transition-colors font-semibold"
              >
                Ver todo el Catálogo
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalogo?cat=${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm py-2 px-2 rounded-md hover:bg-accent hover:text-primary transition-colors"
                >
                  {cat.name}
                </Link>
              ))}

              <Separator className="my-2" />

              {/* Mobile account links */}
              {isAuthenticated ? (
                <>
                  {role !== "ADMIN" && (
                    <>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Mi Cuenta</p>
                      <Link
                        href="/cuenta"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm py-2 px-2 rounded-md hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <UserCircle className="size-4" />
                        Mi Cuenta
                      </Link>
                      <Link
                        href="/historial"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm py-2 px-2 rounded-md hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <History className="size-4" />
                        Historial
                      </Link>
                    </>
                  )}
                  {role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm py-2 px-2 rounded-md hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="size-4" />
                      Panel Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      handleLogout()
                    }}
                    className="w-full text-left text-sm py-2 px-2 rounded-md hover:bg-accent hover:text-destructive transition-colors flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Cuenta</p>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm py-2 px-2 rounded-md hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <LogIn className="size-4" />
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/auth/registro"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm py-2 px-2 rounded-md hover:bg-accent hover:text-primary transition-colors flex items-center gap-2 text-primary"
                  >
                    <User className="size-4" />
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-[1.03]">
          <span className="text-xl font-bold">
            <span className="text-[#00d4ff] group-hover:brightness-125 transition-all">23</span>
            <span className="text-white group-hover:text-gray-100 transition-colors">Tech</span>
          </span>
        </Link>

        {/* Center: Search (hidden mobile) */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <SearchBar />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && role !== "ADMIN" && <CartIcon />}

          {/* User dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="size-8">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name}+${user?.lastname}&background=random`} />
                    <AvatarFallback>
                      {user?.name?.[0]}
                      {user?.lastname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name} {user?.lastname}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {role !== "ADMIN" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/cuenta" className="cursor-pointer">
                        <UserCircle className="mr-2 size-4" />
                        Mi Cuenta
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/historial" className="cursor-pointer">
                        <History className="mr-2 size-4" />
                        Historial
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 size-4" />
                        Panel Admin
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Ingresar</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/registro">Registrarme</Link>
              </Button>
            </div>
          )}
        </div>
      </div>


    </header>
  )
}
