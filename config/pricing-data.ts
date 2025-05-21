import { calculateYearlyPrice } from './pricing-constants';

interface PricingTier {
  name: string;
  description: string;
  features: string[];
  price: {
    monthly: {
      setup: number;
      maintenance: number;
    };
    yearly: {
      setup: number;
      maintenance: number;
    };
  };
  buttonColor: string;
  popular?: boolean;
}

export const servicePricing: Record<string, PricingTier[]> = {
  website: [
    {
      name: 'Starter',
      description: 'Perfect for small businesses starting their online journey',
      features: [
        "Responsive Website Design",
        "5 Custom Pages",
        "Contact Form Integration",
        "Mobile-Friendly Design",
        "Social Media Integration",
        "Basic SEO Setup",
        "Google Analytics",
        "Basic Security Features",
        "1 Year Free Domain*",
        "3 Professional Email Accounts",
        "1 Month Free Maintenance"
      ],
      price: {
        monthly: { setup: 4999, maintenance: 499 },
        yearly: { 
          setup: calculateYearlyPrice(14999),
          maintenance: calculateYearlyPrice(999, true)
        },
      },
      buttonColor: 'gray-500',
    },
    {
      name: 'Pro',
      description: 'Ideal for growing businesses needing more features',
      features: [
        "Everything in Basic, plus:",
        "Up to 15 Custom Pages",
        "Content Management System",
        "Blog Integration",
        "Advanced SEO Package",
        "Custom Forms & Integration",
        "Newsletter System",
        "Speed Optimization",
        "Enhanced Security",
        "5 Professional Email Accounts",
        "Priority Support",
        "2 Months Free Maintenance",
        "Regular Backups"
      ],
      price: {
        monthly: { setup: 14999, maintenance: 1499 },
        yearly: { 
          setup: calculateYearlyPrice(34999),
          maintenance: calculateYearlyPrice(2499, true)
        },
      },
      buttonColor: 'primary',
      popular: true,
    },
    {
      name: 'Advanced',
      description: 'Full-featured online store solution',
      features: [
        "Everything in Business, plus:",
        "Full E-commerce Setup",
        "Unlimited Products",
        "Payment Gateway Integration",
        "Order Management System",
        "Inventory Management",
        "Customer Account System",
        "Advanced Analytics",
        "Product Search & Filtering",
        "Multi-currency Support",
        "Abandoned Cart Recovery",
        "3 Months Free Maintenance",
        "24/7 Priority Support"
      ],
      price: {
        monthly: { setup: 49999, maintenance: 4999 },
        yearly: { 
          setup: calculateYearlyPrice(74999),
          maintenance: calculateYearlyPrice(4999, true)
        },
      },
      buttonColor: 'gray-500',
    }
  ],
  branding: [
    {
      name: 'Basic Branding',
      description: 'Essential branding package for startups',
      features: [
        "Logo Design (3 Concepts)",
        "Brand Color Palette",
        "Typography Selection",
        "Basic Brand Guidelines",
        "Business Card Design",
        "Social Media Templates (2)",
        "1 Round of Revisions",
        "Source Files"
      ],
      price: {
        monthly: { setup: 9999, maintenance: 0 },
        yearly: { 
          setup: calculateYearlyPrice(9999),
          maintenance: calculateYearlyPrice(0, true)
        },
      },
      buttonColor: 'gray-500',
    },
    {
      name: 'Professional',
      description: 'Complete branding solution for growing businesses',
      features: [
        "Logo Design (5 Concepts)",
        "Brand Color Palette",
        "Typography Selection",
        "Comprehensive Brand Guidelines",
        "Stationery Design Suite",
        "Social Media Kit",
        "Email Signature",
        "3 Rounds of Revisions",
        "Source Files",
        "1 Month Support"
      ],
      price: {
        monthly: { setup: 24999, maintenance: 0 },
        yearly: { 
          setup: calculateYearlyPrice(24999),
          maintenance: calculateYearlyPrice(0, true)
        },
      },
      buttonColor: 'primary',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Full-scale branding and identity system',
      features: [
        "Everything in Professional, plus:",
        "Logo Animation",
        "Extended Brand Guidelines",
        "Marketing Collateral Design",
        "Packaging Design",
        "Custom Illustrations",
        "Brand Strategy Document",
        "Unlimited Revisions",
        "3 Months Support"
      ],
      price: {
        monthly: { setup: 49999, maintenance: 0 },
        yearly: { 
          setup: calculateYearlyPrice(49999),
          maintenance: calculateYearlyPrice(0, true)
        },
      },
      buttonColor: 'gray-500',
    }
  ],
  seo: [
    {
      name: 'Basic SEO',
      description: 'Essential SEO package for local businesses',
      features: [
        "Keyword Research",
        "On-Page SEO",
        "Technical SEO Audit",
        "Google My Business Setup",
        "Monthly Performance Report",
        "Basic Content Optimization",
        "Local SEO Setup"
      ],
      price: {
        monthly: { setup: 7999, maintenance: 4999 },
        yearly: { 
          setup: calculateYearlyPrice(7999),
          maintenance: calculateYearlyPrice(4999, true)
        },
      },
      buttonColor: 'gray-500',
    },
    {
      name: 'Growth',
      description: 'Comprehensive SEO for growing businesses',
      features: [
        "Everything in Basic, plus:",
        "Content Strategy",
        "Link Building",
        "Competitor Analysis",
        "Weekly Performance Reports",
        "Social Media Integration",
        "Schema Markup",
        "Mobile SEO Optimization"
      ],
      price: {
        monthly: { setup: 14999, maintenance: 9999 },
        yearly: { 
          setup: calculateYearlyPrice(14999),
          maintenance: calculateYearlyPrice(9999, true)
        },
      },
      buttonColor: 'primary',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Advanced SEO for large websites',
      features: [
        "Everything in Growth, plus:",
        "International SEO",
        "E-commerce SEO",
        "Custom Strategy",
        "Priority Support",
        "Content Creation",
        "Advanced Analytics",
        "Conversion Optimization"
      ],
      price: {
        monthly: { setup: 29999, maintenance: 19999 },
        yearly: { 
          setup: calculateYearlyPrice(29999),
          maintenance: calculateYearlyPrice(19999, true)
        },
      },
      buttonColor: 'gray-500',
    }
  ],
  app: [
    {
      name: 'Starter App',
      description: 'Basic mobile app development',
      features: [
        "Native Android/iOS App",
        "Basic UI/UX Design",
        "3-5 Core Features",
        "User Authentication",
        "Basic API Integration",
        "App Store Submission",
        "3 Months Support"
      ],
      price: {
        monthly: { setup: 149999, maintenance: 9999 },
        yearly: { 
          setup: calculateYearlyPrice(149999),
          maintenance: calculateYearlyPrice(9999, true)
        },
      },
      buttonColor: 'gray-500',
    },
    {
      name: 'Professional',
      description: 'Full-featured application development',
      features: [
        "Cross-platform App",
        "Custom UI/UX Design",
        "10+ Features",
        "Advanced Authentication",
        "API Development",
        "Admin Dashboard",
        "Payment Integration",
        "6 Months Support"
      ],
      price: {
        monthly: { setup: 299999, maintenance: 19999 },
        yearly: { 
          setup: calculateYearlyPrice(299999),
          maintenance: calculateYearlyPrice(19999, true)
        },
      },
      buttonColor: 'primary',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Complex application solutions',
      features: [
        "Everything in Professional, plus:",
        "Custom Backend Development",
        "Unlimited Features",
        "Third-party Integrations",
        "Scalable Architecture",
        "Advanced Analytics",
        "12 Months Support"
      ],
      price: {
        monthly: { setup: 599999, maintenance: 49999 },
        yearly: { 
          setup: calculateYearlyPrice(599999),
          maintenance: calculateYearlyPrice(49999, true)
        },
      },
      buttonColor: 'gray-500',
    }
  ]
};

export const currencyRates = {
  INR: { symbol: '₹', rate: 1 },
  USD: { symbol: '$', rate: 0.012 },
  AED: { symbol: 'AED', rate: 0.044 },
  GBP: { symbol: '£', rate: 0.01 },
};
