import type { Metadata } from 'next'
import { Mulish } from 'next/font/google' // ✅ Import Font
import './globals.css'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { Toaster } from '@/components/ui/toaster'

// ✅ Configure Font with swap strategy
const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mulish',
})

export const metadata: Metadata = {
  title: 'Fuegos d\'Azur - Panel de Administración',
  description: 'Panel de administración para gestionar pedidos de catering',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={mulish.variable}>
      <head>
        {/* ✅ Preconnect to Supabase for faster API calls */}
        <link rel="preconnect" href="https://fygptwzqzjgomumixuqc.supabase.co" />
        <link rel="dns-prefetch" href="https://fygptwzqzjgomumixuqc.supabase.co" />
      </head>
      <body className={mulish.className}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  )
}