import '../globals.css'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { PWAInstallPrompt } from '@/components/pwa/install-prompt'

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Jabin Web | Modern Web Solutions',
//   description: 'Professional web design and development services for businesses of all sizes.',
// };


export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <PWAInstallPrompt />
      <Toaster />
    </>
  )
}


