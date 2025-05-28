import { Inter } from 'next/font/google'
import { auth } from "@/auth"
import { Providers } from '@/providers'
import { Toaster } from '@/components/ui/toaster'
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';

// Add these exports to control which pages are static vs dynamic
export const dynamic = 'auto';
export const dynamicParams = true;
export const revalidate = 60;

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Jabin Web - Professional Web Design & Development Services',
    template: '%s | Jabin Web'
  },
  description: 'Professional web design, development, and digital marketing services. Custom websites, e-commerce solutions, and digital transformation for businesses.',
  keywords: ['web design', 'web development', 'digital marketing', 'e-commerce', 'custom websites', 'responsive design'],
  authors: [{ name: 'Jabin Web Team' }],
  creator: 'Jabin Web',
  publisher: 'Jabin Web',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Jabin Web - Professional Web Design & Development Services',
    description: 'Professional web design, development, and digital marketing services. Custom websites, e-commerce solutions, and digital transformation for businesses.',
    siteName: 'Jabin Web',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jabin Web - Professional Web Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jabin Web - Professional Web Design & Development Services',
    description: 'Professional web design, development, and digital marketing services.',
    images: ['/og-image.jpg'],
  },
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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/jabinweb_logo.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/jabinweb_logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/jabinweb_logo.png',
  },
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
        <link rel="icon" href="/jabinweb_logo.png" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/jabinweb_logo.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <NextSSRPlugin 
          routerConfig={extractRouterConfig(ourFileRouter)} 
        />
        <Providers session={session}>
          {children}
        </Providers>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
