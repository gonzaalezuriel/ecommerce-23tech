"use client"

import { useSession } from "next-auth/react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

// Note: Route protection is now handled by middleware.ts (auth.config.ts authorized callback).
// This component only prevents flash of content while session is loading.
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
