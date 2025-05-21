"use client"

import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignInButton() {
  return (
    <Button 
      variant="outline" 
      onClick={() => signIn()}
    >
      Sign In
    </Button>
  )
}

export function SignOutButton() {
  return (
    <Button 
      variant="outline" 
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  )
}
