import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Palette, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl">
              Transforming Ideas into{' '}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Digital Reality
              </span>
            </h1>
            <p className="mb-12 text-lg text-muted-foreground">
              We create stunning websites and digital experiences that help businesses
              thrive in the modern world. Let's build something amazing together.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Start Your Project <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/designs">View Designs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Web Development</h3>
              <p className="text-muted-foreground">
                Custom websites and applications built with the latest technologies
                and best practices.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">UI/UX Design</h3>
              <p className="text-muted-foreground">
                Beautiful and intuitive interfaces that provide exceptional user
                experiences.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Digital Strategy</h3>
              <p className="text-muted-foreground">
                Strategic planning and consulting to help your business grow online.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}