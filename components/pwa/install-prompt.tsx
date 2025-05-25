"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent default prompt
      e.preventDefault()
      // Store the event for later use
      setInstallPrompt(e)
      // Show our custom prompt
      setShowPrompt(true)
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handler)

    // Don't show if already installed (check display-mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    
    // Show the native prompt
    installPrompt.prompt()
    
    // Wait for user choice
    const outcome = await installPrompt.userChoice
    
    // Hide our prompt regardless of outcome
    setShowPrompt(false)
    setInstallPrompt(null)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 bg-card border shadow-lg rounded-lg p-4 max-w-xs z-40">
      <div className="flex items-start gap-4">
        <div>
          <h3 className="font-semibold mb-2">Install our App</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Add Jabin Web to your home screen for quicker access and offline capabilities.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPrompt(false)}>
              Not now
            </Button>
            <Button size="sm" onClick={handleInstall}>
              <Download className="mr-2 h-4 w-4" />
              Install
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
