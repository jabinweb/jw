'use client'

import { useState, useEffect } from 'react';
import { PricingCard } from '@/components/pricing-card';

// Define types for plans, pricing, and currencies
interface Price {
  setup: number;
  maintenance: number;
}


interface Plan {
  name: string;
  description: string;
  features: string[];
  price: Price;
  buttonColor: string;
  popular?: boolean;
  currencySymbol?: string;
}

interface CurrencyRate {
  symbol: string;
  rate: number;
}

const plans: Plan[] = [
  {
    name: 'Starter',
    description: 'Choose if you just want your online presence',
    features: [
      "1,000 MB file storage", "Email and Chat support", "Homepage, Contact Form", "SEO Optimization, Responsive Design", 
      "Free Domain*", "Readymade Templates", "Contact Form", "Social Media Integration", "Image Gallery"
    ],
    price: { setup: 4999, maintenance: 499 },
    buttonColor: 'gray-500',
  },
  {
    name: 'Pro',
    description: 'Recommended for small websites',
    features: [
      "10GB file storage", "Email and chat support", "E-commerce Integration, Blogging Platform", "SSL Certificate, Analytics Integration",
      "Free Domain*", "10-15 Pages", "Readymade Templates", "SEO Tools", "Payment Integration", "Contact Forms", 
      "Social Media Integration", "Image Gallery", "Video Integration", "Newsletter Signup", "Advanced Security", 
      "Content Management", "Events Calendar"
    ],
    price: { setup: 24999, maintenance: 1499 },
    buttonColor: 'indigo-500',
    popular: true, // Marking this as a recommended plan
  },
  {
    name: 'Advanced',
    description: 'For large custom websites',
    features: [
      "Unlimited file storage", "Dedicated support", "Custom Features", "Customizable Templates, CRM Integration", 
      "Free Domain", "Unlimited Pages", "E-commerce", "Blogging", "SEO Tools", "Advanced Analytics", "Payment Integration", 
      "SSL Certificate", "Contact Forms", "Social Media Integration", "Image Gallery", "Video Integration", "Newsletter Signup", 
      "Advanced Security", "Content Management", "Events Calendar", "Multi-language Support"
    ],
    price: { setup: 49999, maintenance: 4999 },
    buttonColor: 'gray-500',
  },
];

const currencyRates: Record<string, CurrencyRate> = {
  INR: { symbol: '₹', rate: 1 },
  USD: { symbol: '$', rate: 0.012 },
  AED: { symbol: 'AED', rate: 0.044 },
  GBP: { symbol: '£', rate: 0.01 },
};

// Define types for the state variables
interface UserCountryData {
  country: string;
}

export default function PricingPage() {
  const [currency, setCurrency] = useState<string>('INR');
  const [userCountry, setUserCountry] = useState<string>('');

  useEffect(() => {
    // Fetch the user's country without API key
    fetch('https://ipinfo.io/json')
      .then((res) => res.json())
      .then((data: UserCountryData) => {
        const countryCurrency: Record<string, string> = {
          IN: 'INR',
          US: 'USD',
          AE: 'AED',
          GB: 'GBP',
        };
        setCurrency(countryCurrency[data.country] || 'USD');
        setUserCountry(data.country);
      })
      .catch(() => setCurrency('USD')); 
  }, []);

  // Map plans to converted prices and ensure the price stays a number
  const convertedPlans: Plan[] = plans.map((plan) => ({
    ...plan,
    price: {
      setup: plan.price.setup * (currencyRates[currency]?.rate || 1), 
      maintenance: plan.price.maintenance * (currencyRates[currency]?.rate || 1), 
    },
    currencySymbol: currencyRates[currency]?.symbol,
  }));

  return (
    <div className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          Choose the perfect plan for your business needs. All plans include our
          core features with different levels of support and customization.
        </p>
      </div>
      <div className="text-end mb-4">
        <select
          className="border border-gray-300 rounded px-4 py-2"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {Object.keys(currencyRates).map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {convertedPlans.map((plan, index) => (
          <div
            key={plan.name}
            className={`relative ${plan.popular ? 'bg-yellow-100 border-2 border-blue-500 rounded-lg self-start' : ''}`}
          >
           <PricingCard
              title={plan.name}
              description={plan.description}
              features={plan.features}
              price={
                <>
                  <span className="text-3xl font-bold">{plan.currencySymbol}{plan.price.setup.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground"> Setup</span>
                  <br />
                </>
              }
              monthly={
                  <span className="text-xl">{plan.currencySymbol}{plan.price.maintenance.toFixed(2)}</span>
              }
              buttonColor={plan.buttonColor}
            />
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded-tr-lg text-sm">
                Recommended
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <p className="text-muted-foreground">
          Need a custom solution?{' '}
          <a href="/contact" className="text-primary hover:underline">
            Contact us
          </a>{' '}
          for a tailored package that meets your specific requirements.
        </p>
      </div>
    </div>
  );
}
