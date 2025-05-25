"use client"
import React from 'react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { WifiOff, Home, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  return (
    <Container className="py-24">
      <div className="flex flex-col items-center justify-center text-center py-10">
        <div className="flex items-center justify-center p-6 bg-muted rounded-full mb-6">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-4">You&apos;re offline</h1>
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          It looks like you lost your internet connection. Check your connection and try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    </Container>
  )
}
