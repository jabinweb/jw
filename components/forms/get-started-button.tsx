"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GetStartedDialog } from "@/components/forms/get-started-dialog"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface GetStartedButtonProps {
  text?: string
  size?: "sm" | "default" | "lg"
  icon?: LucideIcon
  variant?: "default" | "outline" | "ghost"
  className?: string
  fullWidth?: boolean
  showIcon?: boolean
}

export function GetStartedButton({
  text = "Get Started",
  size = "default",
  icon: Icon = ArrowRight,
  variant = "default",
  className,
  fullWidth = false,
  showIcon = false,
}: GetStartedButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        size={size}
        variant={variant}
        className={cn(
          "relative rounded-full",
          "bg-primary text-primary-foreground",
          "hover:bg-gradient-to-r hover:from-primary hover:to-primary/80",
          "dark:bg-primary dark:text-primary-foreground",
          "dark:hover:bg-gradient-to-r dark:hover:from-primary dark:hover:to-primary/80",
          "transition-all duration-300",
          fullWidth && "w-full",
          className
        )}
      >
        {text}
        {showIcon && Icon && <Icon className="ml-2 h-4 w-4" />}
      </Button>
      <GetStartedDialog open={open} onOpenChange={setOpen} />
    </>
  )
}