'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import LogoutButton from './auth/LogoutButton'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
  },
  {
    href: '/kriteria',
    label: 'Kelola Kriteria',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
  },
  {
    href: '/alternatif',
    label: 'Kelola Alternatif',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
    ),
  },
  {
    href: '/penilaian',
    label: 'Matriks Penilaian',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    href: '/laporan',
    label: 'Laporan Hasil',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
  },
  {
    href: '/leaderboard',
    label: 'Leaderboard Hasil',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>
    ),
  },
  {
    href: '/tentang',
    label: 'Tentang Kami',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-blue-800/40 transition-colors duration-200 group"
      aria-label="Toggle theme"
    >
      <span className="text-xs text-blue-300 font-medium">
        {isDark ? 'Mode Gelap' : 'Mode Terang'}
      </span>
      <div className="relative w-10 h-5 rounded-full bg-blue-800 border border-blue-700 transition-colors duration-200 group-hover:border-cyan-500/50">
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center
          ${isDark ? 'left-5 bg-cyan-400' : 'left-0.5 bg-blue-300'}`}>
          {isDark ? (
            <svg className="w-2.5 h-2.5 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg className="w-2.5 h-2.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user, isGuest, loading, signOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const guestAllowedRoutes = ['/', '/laporan', '/penilaian', '/leaderboard', '/tentang']

  useEffect(() => {
    if (!loading && !user && !isGuest && !pathname.startsWith('/auth')) {
      router.push('/auth/login')
    }
    setIsOpen(false)
  }, [user, isGuest, loading, pathname, router])

  if (pathname.startsWith('/auth')) {
    return null
  }

  const filteredNavItems = isGuest
    ? navItems.filter(item => guestAllowedRoutes.includes(item.href))
    : navItems

  return (
    <>
      {/* HEADER MOBILE */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-blue-950 text-white px-4 h-16 flex items-center justify-between border-b border-blue-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span className="font-bold tracking-wide text-sm">SPK SAW</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-blue-800 transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </header>

      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-900 to-blue-950 text-white shadow-2xl
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:sticky md:h-screen md:top-0
      `}>

        {/* Logo — desktop only */}
        <div className="hidden md:block px-6 py-8 border-b border-blue-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <p className="text-base font-bold leading-tight tracking-wide">SPK SAW</p>
              <p className="text-[11px] text-blue-300 leading-tight">Sistem Penunjang Keputusan</p>
            </div>
          </div>
        </div>

        {/* Mobile spacer */}
        <div className="h-16 md:hidden" />

        {/* Section label */}
        <div className="px-6 pt-8 pb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/80">Menu Utama</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-inner shadow-cyan-500/10'
                    : 'text-blue-200/70 hover:bg-blue-800/40 hover:text-cyan-200'
                }`}
              >
                <span className={`transition-colors duration-200 ${isActive ? 'text-cyan-400' : 'text-blue-400 group-hover:text-cyan-300'}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-800/50 bg-blue-950/30 space-y-3">
          {/* Theme toggle — always visible */}
          <ThemeToggle />

          <div className="border-t border-blue-800/50 pt-3">
            {loading ? (
              <div className="flex items-center justify-center py-2">
                <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              </div>
            ) : isGuest ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-9 h-9 rounded-full bg-blue-800/50 border border-blue-700 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-blue-100">Mode Tamu</p>
                    <p className="text-[10px] text-blue-400 truncate">Akses Terbatas</p>
                  </div>
                </div>
                <button
                  onClick={async () => { await signOut(); router.push('/auth/login') }}
                  className="w-full px-3 py-2 text-sm font-medium text-center text-white bg-red-600/80 hover:bg-red-600 rounded-lg transition duration-200"
                >
                  Keluar
                </button>
              </div>
            ) : user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <span className="text-sm font-bold text-white uppercase">{user.email?.[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-blue-50 truncate">
                      {user.user_metadata?.full_name || 'Administrator'}
                    </p>
                    <p className="text-[10px] text-blue-400 truncate">{user.email}</p>
                  </div>
                </div>
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="block w-full py-2.5 text-center text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-lg shadow-cyan-600/20"
              >
                Masuk Akun
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
