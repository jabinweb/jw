'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Message sent!',
      description: 'We\'ll get back to you as soon as possible.',
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-3xl mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">We’d Love to Serve You!</h1>
        <p className="mb-4 text-lg text-muted-foreground">
          Are you ready to purchase an app or website? Complete our start form.
        </p>
        <p className="mb-4 text-lg text-muted-foreground">
          Do you have questions before getting started? Get in touch.
        </p>
        <p className="mb-4 text-lg text-muted-foreground">
          Do you want to see our work before buying? Check our designs.
        </p>
        <p className="mb-4 text-lg text-muted-foreground">
          Something else? Complete our contact form below.
        </p>
      </div>
      <div className="grid gap-12 md:grid-cols-2">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea id="message" required className="min-h-[150px]" />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Card>
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-muted-foreground">
                32A Yashoda Nagar Chauraha, Fzd Road Chinhat, Malhaur, Lucknow, Uttar Pradesh, India, 226028
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">info@jabin.org</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-muted-foreground">+917523944939</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
