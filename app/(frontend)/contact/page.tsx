'use client';

import { ContactForm } from "@/components/forms/contact-form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';
import { motion } from "framer-motion"
import { ArrowRight, Globe2 } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="container py-24">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl mb-16 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold">Let&apos;s Build Something Great Together</h1>
        <p className="text-lg text-muted-foreground">
          Ready to elevate your digital presence? We&apos;re here to help turn your vision into reality.
        </p>
      </motion.div>

      {/* Contact Methods Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
        {[
          {
            icon: <Mail className="h-6 w-6" />,
            title: "Email Us",
            description: "info@jabin.org",
            detail: "24/7 Support",
            href: "mailto:info@jabin.org"
          },
          {
            icon: <Phone className="h-6 w-6" />,
            title: "Call Us",
            description: "+91 7523944939",
            detail: "Mon-Sat 9am-6pm IST",
            href: "tel:+917523944939"
          },
          {
            icon: <MapPin className="h-6 w-6" />,
            title: "Visit Us",
            description: "Lucknow, UP, India",
            detail: "By Appointment",
            href: "https://maps.google.com"
          },
          {
            icon: <Globe2 className="h-6 w-6" />,
            title: "Social Media",
            description: "Connect Online",
            detail: "Instagram • LinkedIn",
            href: "#social"
          }
        ].map((item, i) => (
          <motion.a
            key={item.title}
            href={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group p-6 rounded-2xl border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="text-primary mb-4">{item.icon}</div>
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <p className="text-muted-foreground mb-2">{item.description}</p>
            <p className="text-sm text-primary">{item.detail}</p>
          </motion.a>
        ))}
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Replace existing form with new ContactForm component */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <ContactForm />
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-semibold">Quick Links</h2>
          <div className="space-y-6">
            <Link href="/services" className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <h3 className="font-medium mb-1">View Our Services</h3>
              <p className="text-sm text-muted-foreground">Explore our comprehensive web solutions</p>
            </Link>
            <Link href="/portfolio" className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <h3 className="font-medium mb-1">Browse Portfolio</h3>
              <p className="text-sm text-muted-foreground">See our latest work and success stories</p>
            </Link>
            <Link href="/pricing" className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <h3 className="font-medium mb-1">View Pricing</h3>
              <p className="text-sm text-muted-foreground">Find the perfect plan for your needs</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
