import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pathway — Job Application Tracker',
  description: 'Keep momentum on your next career move with Pathway.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#202333' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
        <ClerkProvider>
    <html lang="en" className="bg-background">
      <body className="antialiased">
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
        </ClerkProvider>
  )
}