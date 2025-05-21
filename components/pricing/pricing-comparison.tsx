"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import React from "react"

interface ComparisonTableProps {
  tiers: Array<{
    name: string;
    description: string;
    price: {
      setup: number;
      maintenance: number;
    };
    features: string[];
    popular?: boolean;
    buttonColor?: string;
  }>;
  isYearly?: boolean;
  currencySymbol?: string;
}

export function PricingComparison({ tiers, isYearly, currencySymbol = "₹" }: ComparisonTableProps) {
  return (
    <div className="w-full rounded-xl border bg-card overflow-hidden">
      {/* Header Row */}
      <div className="grid grid-cols-3">
        
        {tiers.map((tier) => (
          <div 
            key={tier.name}
            className={cn(
              "p-8 text-center relative",
              tier.popular && "bg-primary/5"
            )}
          >
            {tier.popular && (
              <span className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground py-1 text-sm font-medium">
                Most Popular
              </span>
            )}
            <div className={cn("mt-2", tier.popular && "mt-6")}>
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
              
              <div className="mt-4 space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {currencySymbol}{Math.floor(tier.price.setup).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">One-time Setup</div>
                
                {tier.price.maintenance > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xl font-semibold">
                      + {currencySymbol}{Math.floor(tier.price.maintenance).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per {isYearly ? 'year' : 'month'}
                    </div>
                  </div>
                )}
              </div>

              <Button 
                className="mt-6 w-full" 
                variant={tier.popular ? "default" : "outline"}
              >
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="mt-8 text-left">
                <div className="font-medium mb-4">What&apos;s included:</div>
                <ul className="space-y-4 text-sm">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
