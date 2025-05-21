import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from './ui/logo';
import { Container } from './ui/container';

export function Footer() {
  return (
    <footer className="relative border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="py-0">
        <div className="absolute inset-0 -z-20 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Branding & Description */}
            <div className="lg:col-span-4 space-y-6">
              <Logo />
              <p className="text-sm text-muted-foreground max-w-sm">
                Creating exceptional digital experiences through innovative web solutions. We transform ideas into powerful digital realities.
              </p>
              <div className="flex items-center space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-base font-semibold">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-base font-semibold">Services</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/services/website-design" className="text-muted-foreground hover:text-foreground transition-colors">
                    Website Design
                  </Link>
                </li>
                <li>
                  <Link href="/services/ecommerce" className="text-muted-foreground hover:text-foreground transition-colors">
                    eCommerce
                  </Link>
                </li>
                <li>
                  <Link href="/services/branding" className="text-muted-foreground hover:text-foreground transition-colors">
                    Branding
                  </Link>
                </li>
                <li>
                  <Link href="/services/seo" className="text-muted-foreground hover:text-foreground transition-colors">
                    SEO
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="lg:col-span-4 space-y-6">
              <h4 className="text-base font-semibold">Stay Updated</h4>
              <p className="text-sm text-muted-foreground">
                Subscribe to our newsletter for digital insights and updates.
              </p>
              <form className="flex w-full max-w-sm space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button type="submit">Subscribe</Button>
              </form>
              {/* <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" /> hello@jabinweb.com
                </p>
                <p className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" /> (555) 123-4567
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" /> New York, NY 10001
                </p>
              </div> */}
            </div>
          </div>

          <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Jabin Web. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}