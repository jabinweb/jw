import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "small" | "large";
}

export function Container({ 
  children, 
  className,
  size = "default",
  ...props 
}: ContainerProps) {
  const sizes = {
    small: "max-w-5xl",
    default: "max-w-7xl",
    large: "max-w-[1400px]"
  }

  return (
    <div
      className={cn(
        sizes[size],
        "mx-auto px-4 sm:px-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}