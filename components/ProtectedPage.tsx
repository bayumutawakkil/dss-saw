'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Routes accessible to guests
const GUEST_ALLOWED_ROUTES = [
  '/',
  '/laporan',
  '/penilaian',
  '/leaderboard',
  '/tentang',
]

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isGuest, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  const isGuestAllowedRoute = GUEST_ALLOWED_ROUTES.includes(pathname)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !loading && !user && !isGuest) {
      // Redirect to login if neither authenticated user nor guest
      router.push(`/auth/login?redirect=${pathname}`)
    } else if (isMounted && !loading && isGuest && !isGuestAllowedRoute) {
      // Redirect guest away from admin-only routes
      router.push('/')
    }
  }, [user, isGuest, loading, router, pathname, isMounted, isGuestAllowedRoute])

  // Show loading state during initial auth check
  if (loading || !isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children until we confirm user or guest is authenticated
  if (!user && !isGuest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
