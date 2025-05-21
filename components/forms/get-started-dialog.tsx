"use client"

import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface GetStartedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GetStartedDialog({ open, onOpenChange }: GetStartedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-full h-screen p-0 !m-0 !rounded-none [&>button]:hidden",
        "data-[state=open]:!duration-300 data-[state=open]:!transition-all"
      )}>
        {/* Hidden but accessible title and description */}
        <DialogTitle className="sr-only">Get Started with Jabin Web</DialogTitle>
        <DialogDescription className="sr-only">
          Tell us about your business needs and let&apos;s build something amazing together
        </DialogDescription>

        <div className="relative w-full h-full flex items-center justify-center bg-dot-pattern">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background" />
          
          {/* Custom close button */}
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute right-6 top-6 z-50 rounded-full w-10 h-10 bg-background/50 backdrop-blur border border-border flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          {/* Form container */}
          <div className="relative z-10 w-full max-w-3xl px-4">
            <MultiStepForm onComplete={() => onOpenChange(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}