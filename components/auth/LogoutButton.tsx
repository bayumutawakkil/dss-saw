'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function LogoutButton() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full px-3 py-2 text-sm font-medium text-center text-white bg-red-600/80 hover:bg-red-600 rounded-lg transition duration-200"
    >
      Keluar
    </button>
  )
}
