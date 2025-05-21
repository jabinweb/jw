"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Providers } from '@/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { SidebarProvider } from "@/components/ui/sidebar"
import type { SidebarData } from "@/types/navigation"
import { Session } from "next-auth"

interface AdminLayoutClientProps {
  children: React.ReactNode
  sidebarData: SidebarData
  session: Session | null
}

export function AdminLayoutClient({ children, sidebarData, session }: AdminLayoutClientProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <div className="relative min-h-screen">
          <div className="fixed inset-0 bg-zinc-900/50" />
          <AppSidebar className="border-r" data={sidebarData} />
          <div className="ml-[var(--sidebar-width)] transition-[margin]">
            <main className="p-8">      
              <Providers session={session}>
                {children}
              </Providers>
            </main>
          </div>
        </div>
      </SidebarProvider>
      <Toaster />
    </ThemeProvider>
  )
}
