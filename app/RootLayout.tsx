import './globals.css'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AdminBar } from '@/components/AdminBar'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { getServerSideURL } from '@/utilities/getURL'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Jabin Web | Modern Web Solutions',
//   description: 'Professional web design and development services for businesses of all sizes.',
// };

export default async function RootFrontLayout({
  
  children,
}: {
  children: React.ReactNode;
}) {   const { isEnabled } = await draftMode()

  return (
    <html lang="en" suppressHydrationWarning>
        <head>
          <InitTheme />
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
          <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">      <Providers>
        <AdminBar
          adminBarProps={{
            preview: isEnabled,
          }}
        />
        <LivePreviewListener />
        {children}
      </Providers></main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}


export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}