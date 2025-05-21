'use client'

import { useState, useEffect } from 'react';

interface UserCountryData {
  country: string;
}
import { PricingCard } from '@/components/pricing/pricing-card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Palette, Search, Smartphone } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { servicePricing, currencyRates } from '@/config/pricing-data'
import { PricingComparison } from "@/components/pricing/pricing-comparison"

export default function PricingPage() {
  const [activeService, setActiveService] = useState('website');
  const [currency, setCurrency] = useState<keyof typeof currencyRates>('INR');
  const [isYearly, setIsYearly] = useState(false);
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
        setCurrency((countryCurrency[data.country] || 'USD') as keyof typeof currencyRates);
        setUserCountry(data.country);
      })
      .catch(() => setCurrency('USD')); 
  }, []);

  const convertedPlans = servicePricing[activeService].map((plan) => ({
    ...plan,
    price: {
      setup: plan.price[isYearly ? 'yearly' : 'monthly'].setup * (currencyRates[currency]?.rate || 1),
      maintenance: plan.price[isYearly ? 'yearly' : 'monthly'].maintenance * (currencyRates[currency]?.rate || 1),
    },
    currencySymbol: currencyRates[currency]?.symbol,
  }));

  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-3xl text-center px-4">
        <h1 className="mb-4 text-3xl md:text-4xl font-bold">Our Services & Pricing</h1>
        <p className="mb-8 md:mb-12 text-base md:text-lg text-muted-foreground">
          Transparent pricing for all your digital needs. Choose a service to see detailed pricing options.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 px-4">
        <Tabs defaultValue="website" className="w-full md:w-auto" onValueChange={setActiveService}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-transparent w-full">
            <TabsTrigger value="website" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Globe className="mr-2 h-4 w-4" />
              Website Design
            </TabsTrigger>
            <TabsTrigger value="branding" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette className="mr-2 h-4 w-4" />
              Logo & Branding
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Search className="mr-2 h-4 w-4" />
              SEO & Marketing
            </TabsTrigger>
            <TabsTrigger value="app" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Smartphone className="mr-2 h-4 w-4" />
              App Development
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-toggle" className="whitespace-nowrap text-sm md:text-base">
              Bill {isYearly ? 'Yearly' : 'Monthly'}
              {isYearly && <span className="ml-2 text-sm text-primary">Save 10%</span>}
            </Label>
          </div>

          <select
            className="border border-input rounded-md px-3 py-2 text-sm w-full sm:w-auto"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as keyof typeof currencyRates)}
          >
            {Object.keys(currencyRates).map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile view: Cards */}
      <div className="block lg:hidden px-4">
        <div className="grid gap-6 sm:gap-8">
          {convertedPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative ${
                plan.popular 
                  ? 'scale-105 shadow-xl border-2 border-primary rounded-xl' 
                  : 'hover:scale-102 transition-transform duration-300'
              }`}
            >
              <PricingCard
                title={plan.name}
                description={plan.description}
                features={plan.features}
                price={
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl font-bold">
                        {plan.currencySymbol}{Math.floor(plan.price.setup)}
                      </span>
                      <span className="text-sm text-muted-foreground">setup</span>
                    </div>
                    {plan.price.maintenance > 0 && (
                      <>
                        <div className='flex justify-center !m-0 text-base'>+</div>
                        <div className="flex items-baseline justify-center !mt-0">
                          <span className="text-xl font-medium">
                            {plan.currencySymbol}{Math.floor(plan.price.maintenance)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /{isYearly ? 'year' : 'month'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                }
                monthly={
                  plan.price.maintenance > 0
                    ? `${plan.currencySymbol}${Math.floor(plan.price.maintenance)}/${isYearly ? 'year' : 'month'}`
                    : ''
                }
                buttonColor={plan.buttonColor}
              />
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop view: Comparison Table */}
      <div className="hidden lg:block">
        <PricingComparison 
          tiers={convertedPlans}
          isYearly={isYearly}
          currencySymbol={currencyRates[currency].symbol}
        />
      </div>

      <div className="mt-12 md:mt-16 text-center space-y-4 px-4">
        <p className="text-sm md:text-base text-muted-foreground">
          * Domain registration is free for the first year with annual plans
        </p>
        <p className="text-base md:text-lg">
          Need a custom solution?{' '}
          <a href="/contact" className="text-primary hover:underline font-medium">
            Contact us
          </a>{' '}
          for a tailored package that meets your specific requirements.
        </p>
      </div>
    </div>
  );
}
