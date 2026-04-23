import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SPK SAW - Sistem Penunjang Keputusan',
  description: 'Perankingan mata kuliah menggunakan metode Simple Additive Weighting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 overflow-auto pt-16 md:pt-0">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
