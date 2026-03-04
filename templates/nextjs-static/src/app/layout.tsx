import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://{{DOMAIN}}'),
  title: {
    default: '{{BRAND_NAME}}',
    template: '%s | {{BRAND_NAME}}',
  },
  description: '{{DESCRIPTION}}',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: '{{BRAND_NAME}}',
    images: ['/og/default.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
