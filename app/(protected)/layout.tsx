import Sidebar from '@/components/Sidebar'
import ProtectedLayout from '@/components/ProtectedLayout'

export default function ProtectedRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedLayout>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </ProtectedLayout>
  )
}
