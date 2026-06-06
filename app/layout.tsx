import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PageLoader } from '@/components/PageLoader'
import { inriaSerifBold, inriaSerifRegular } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://serpay.penjire.com'),
  title: {
    default: 'Serpaý – Goşgular Çemeni',
    template: '%s | Serpaý'
  },
  description: 'Türkmen edebiýatyndan goşgular çemeni',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tk">
      <body className={`${inriaSerifBold.variable} ${inriaSerifRegular.variable}`}>
        <PageLoader />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}