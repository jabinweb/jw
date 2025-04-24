'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Code2 } from 'lucide-react';

import { useAuth } from '@payloadcms/ui'




const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Designs', href: '/designs' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/posts' },
  { name: 'Contact', href: '/contact' },
];


export function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = React.useState<{
    id: string;
    email: string;
    name?: string;
    image?: string;
  } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    // Directly fetch user data from your API
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me'); // Replace with your actual API endpoint
        if (!response.ok) throw new Error('Failed to fetch user');
        const userData = await response.json();
        setUser({
          id: userData.user.id,
          email: userData.user.email,
          name: userData.user.name || 'Anonymous User',
          image: userData.user.image || '/default-avatar.png', // Default avatar fallback
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="h-6 w-6" />
          <span className="font-bold">Jabin Web</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-1 items-center justify-center space-x-6">
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

        {/* User Profile and Theme Toggle */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              {/* Profile Button */}
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2"
              >
                <img
                  src={user.image} // User profile image
                  alt="User Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name || user.email}</span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border">
                  <div className="py-2 px-4 text-sm text-gray-700">
                    <p className="mb-2">{user.email}</p>
                    <Link href="/profile" className="block py-2">
                      Profile
                    </Link>
                    <Link href="/admin" className="block py-2">
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setUser(null);
                        console.log('Sign out logic to be implemented');
                      }}
                      className="block w-full py-2 text-left text-red-500 hover:text-red-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Please sign in</div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Get Started Button */}
          <Button asChild>
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
