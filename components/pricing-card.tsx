'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface PricingCardProps {
  title: string;
  price: string;
  monthly: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonColor?: string
}

export function PricingCard({ title, price, monthly, description, features, popular }: PricingCardProps) {
  return (
    <Card className={popular ? 'border-primary shadow-lg rounded-lg' : ''}>
      <CardHeader>
        {popular && (
          <div className="mb-2 text-sm font-medium text-primary">Most Popular</div>
        )}
        <CardTitle className="text-2xl">{title}</CardTitle>
        <div className="">
          <h2 className="text-3xl font-bold">{price}</h2>
          <h4 className="text-muted-foreground">{monthly}/month Maintenance</h4>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild variant={popular ? 'default' : 'outline'}>
          <Link href="/contact">Get Started</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}