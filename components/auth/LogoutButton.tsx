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
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition duration-200"
    >
      Logout
    </button>
  )
}
