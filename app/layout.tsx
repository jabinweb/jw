import { Inter } from 'next/font/google'
import { auth } from "@/auth"
import { Providers } from '@/providers'
import { Toaster } from '@/components/ui/toaster'
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import './globals.css';
import type { Metadata, Viewport } from 'next';

// Add these exports to control which pages are static vs dynamic
export const dynamic = 'auto';
export const dynamicParams = true;
export const revalidate = 60;

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#7C3AED',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Jabin Web - Web Design and Development Services',
  description: 'Professional web design, development, and digital marketing services',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Jabin Web',
  },
  other: {
    "mobile-web-app-capable": "yes",
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <NextSSRPlugin 
          routerConfig={extractRouterConfig(ourFileRouter)} 
        />
        <Providers session={session}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
