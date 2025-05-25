'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, X, Search } from 'lucide-react';
import { Logo } from '../ui/logo';
import Image from 'next/image';
import { GlobalSearch } from "@/components/search/global-search"
import { AISearch } from "@/components/search/ai-search"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Container } from '../ui/container';
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Logo />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex flex-1 items-center justify-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile and Desktop Actions Group */}
          <div className="flex items-center space-x-2">
            {/* Global Search - Desktop */}
            <div className="hidden md:block w-[200px] lg:w-[300px]">
              <GlobalSearch variant="input" />
            </div>
            
            {/* Global Search - Mobile (Icon Only) */}
            <div className="md:hidden">
              <GlobalSearch variant="icon" />
            </div>

            {/* AI Search - Both mobile and desktop */}
            <AISearch variant="icon" />
            
            <ThemeToggle />
            
            {status === "loading" ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : session?.user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 px-2"
                >
                  <Image
                    src={session.user.image || '/default-avatar.png'}
                    alt={session.user.name || 'User Profile'}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:inline">{session.user.name}</span>
                </Button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg border shadow-lg">
                    <div className="py-2 px-4 text-sm">
                      <div className="mb-2 text-muted-foreground">{session.user.email}</div>
                      <Link href="/profile" className="block py-2 hover:text-primary">
                        Profile
                      </Link>
                      {session.user.role === 'admin' && (
                        <Link href="/admin" className="block py-2 hover:text-primary">
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="block w-full py-2 text-left text-red-500 hover:text-red-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu - Show only on mobile */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="ml-1">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-base font-medium transition-colors hover:text-primary px-2 py-1 rounded-md',
                        pathname === item.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
