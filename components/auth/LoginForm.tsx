'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginAsGuest } = useAuth()

  const redirect = searchParams.get('redirect') || '/'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push(redirect)
        router.refresh()
      }
    } catch {
      setError('Terjadi kesalahan saat login')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    loginAsGuest()
    router.push(redirect)
    router.refresh()
  }

  // Tampilan Form Login (Setelah klik "Masuk dengan Akun")
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Dekorasi Background - Cyan & Blue Glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10">
          <div className="mb-8">
            <button
              onClick={() => setShowLogin(false)}
              className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
            
            {/* Logo box identik dengan Sidebar */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Masuk</h1>
            <p className="text-sm text-slate-600">Gunakan akun Anda untuk mengakses sistem</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@example.com"
                required
                className="text-slate-900 w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="text-slate-900 w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex gap-2 items-center">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Masuk'}
            </button>
          </form>
          <p className="text-xs text-slate-400 text-center mt-6 uppercase tracking-widest font-medium">SPK SAW System</p>
        </div>
      </div>
    )
  }

  // Tampilan Welcome (Landing Page awal)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration - Ambient White/Cyan */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="max-w-md w-full relative z-10 text-center">
        {/* Ikon Logo Utama identik dengan Sidebar */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/20">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Workshop Terbaik</h1>
        <p className="text-lg text-blue-200 mb-2">Sistem Penunjang Keputusan</p>
        <p className="text-sm text-blue-400/80 mb-10 font-medium">Simple Additive Weighting</p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => setShowLogin(true)}
            className="w-full bg-white text-blue-900 hover:bg-cyan-50 font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            <span>Mulai Sekarang</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <button
            onClick={handleGuestLogin}
            className="w-full bg-blue-800/30 hover:bg-blue-800/50 text-blue-100 font-medium py-3.5 rounded-xl transition-all border border-blue-700/50 backdrop-blur-sm"
          >
            Lanjutkan sebagai Tamu
          </button>
        </div>

        <p className="text-xs text-blue-400/60 mt-12 font-medium tracking-wide">
          © 2026 SPK SAW SYSTEM • ANDALAS UNIVERSITY
        </p>
      </div>
    </div>
  )
}