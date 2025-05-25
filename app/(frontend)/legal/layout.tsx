import Link from "next/link"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { Route } from "next"

const legalPages = [
  { title: "Privacy Policy", href: "/legal/privacy" },
  { title: "Terms of Service", href: "/legal/terms" },
  { title: "Cookie Policy", href: "/legal/cookie-policy" },
]

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Container className="border-b py-4">
        <nav className="flex justify-center space-x-2">
          {legalPages.map((page) => (
            <LegalPageLink 
              key={page.href} 
              href={page.href} 
              title={page.title} 
            />
          ))}
        </nav>
      </Container>
      {children}
      <Container className="py-12 border-t">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Jabin Web. All rights reserved.</p>
        </div>
      </Container>
    </>
  )
}

function LegalPageLink({ href, title }: { href: string; title: string }) {
  return (
    <Link 
      href={href as Route}
      className={buttonVariants({
        variant: "link",
        size: "sm"
      })}
    >
      {title}
    </Link>
  )
}
