'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  isGuest: boolean
  loading: boolean
  signOut: () => Promise<void>
  loginAsGuest: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check stored guest status (sessionStorage so it expires when tab closes)
    const storedGuestStatus = sessionStorage.getItem('isGuest')
    if (storedGuestStatus === 'true') {
      setIsGuest(true)
    }

    // Check active session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsGuest(false)
    sessionStorage.removeItem('isGuest')
  }

  const loginAsGuest = () => {
    setIsGuest(true)
    sessionStorage.setItem('isGuest', 'true')
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, signOut, loginAsGuest }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
