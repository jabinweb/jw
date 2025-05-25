import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/db';
import { servicePricing, currencyRates } from '@/config/pricing-data';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Extract pricing information from pricing-data.ts
function getPricingInformation() {
  let pricingInfo = 'PRICING INFORMATION:\n\n';
  
  // Loop through each service category
  Object.entries(servicePricing).forEach(([category, tiers]) => {
    pricingInfo += `${category.toUpperCase()} SERVICES:\n`;
    
    // Loop through each pricing tier
    tiers.forEach(tier => {
      // Fix: Don't divide by 100 - pricing is already in the correct format
      const monthlySetup = tier.price.monthly.setup;
      const monthlyMaintenance = tier.price.monthly.maintenance;
      
      pricingInfo += `- ${tier.name} (${tier.popular ? 'POPULAR' : ''})\n`;
      pricingInfo += `  Description: ${tier.description}\n`;
      pricingInfo += `  Setup Fee: ₹${monthlySetup}\n`;
      
      if (tier.price.monthly.maintenance > 0) {
        pricingInfo += `  Monthly Maintenance: ₹${monthlyMaintenance}\n`;
      }
      
      pricingInfo += `  Features: ${tier.features.join(', ')}\n\n`;
    });
  });
  
  return pricingInfo;
}

// Function to gather all website information
async function getWebsiteInformation() {
  try {
    // Get services information
    const services = await db.service.findMany({
      where: { published: true },
      select: {
        title: true,
        description: true,
        content: true,
        slug: true
      }
    });
    
    // Get blog post titles and excerpts to understand content focus
    const recentBlogPosts = await db.post.findMany({
      where: { status: 'published' },
      select: {
        title: true,
        excerpt: true,
        slug: true
      },
      orderBy: { publishedAt: 'desc' },
      take: 5
    });
    
    // Get projects to understand company portfolio
    const projects = await db.project.findMany({
      where: { status: { in: ['active', 'completed'] } },
      select: {
        title: true,
        description: true,
        category: true,
        tags: true
      },
      take: 10
    });
    
    // Get contact form to extract contact information
    const contactInfo = await db.form.findFirst({
      where: { name: 'contact' }
    });
    
    // Get pricing information from the config file
    const pricingInfo = getPricingInformation();
    
    // Compile all information
    let websiteInfo = `
ABOUT JABIN WEB:
Jabin Web is a premium web design and development agency specializing in creating custom, high-performing websites and digital solutions for businesses of all sizes. We focus on delivering personalized service and results-driven solutions.

SERVICES OFFERED:
${services.map((service, index) => `
${index + 1}. ${service.title}
   - ${service.description}
   - URL: /services/${service.slug}
`).join('')}

${pricingInfo}

CONTACT INFORMATION:
- Email: info@jabin.org
- Phone: +91 75239444939
- Address: Vrindavan Yojna, Lucknow, India
- Hours: Monday-Friday, 9am-6pm IST

RECENT BLOG TOPICS:
${recentBlogPosts.map(post => `- ${post.title}${post.excerpt ? `: ${post.excerpt}` : ''}`).join('\n')}

PROJECT PORTFOLIO HIGHLIGHTS:
${projects.map(project => `- ${project.title}${project.category ? ` (${project.category})` : ''}${project.description ? `: ${project.description}` : ''}`).join('\n')}

COMPANY VALUES:
- Client-first approach with personalized service
- Transparent communication and project management
- Results-driven solutions focused on ROI
- Continuous improvement and staying current with industry trends
- Long-term partnerships rather than one-off projects

PROCESS:
1. Discovery & Strategy
2. Design & Prototyping
3. Development
4. Testing & Quality Assurance
5. Launch
6. Ongoing Support & Optimization

FAQ:
Q: How long does it take to build a website?
A: Typically 4-12 weeks depending on complexity and project scope.

Q: Do you provide hosting services?
A: Yes, we offer managed hosting solutions for all our clients.

Q: Can you help with existing websites?
A: Yes, we offer redesign, optimization, and maintenance services for existing websites.

Q: What CMS do you use?
A: We primarily work with WordPress, Shopify, and our own custom CMS depending on client needs.
`;

    return websiteInfo;
  } catch (error) {
    console.error('Error gathering website information:', error);
    // Return fallback basic info if DB fetch fails
    return `
      Jabin Web is a web design and development agency offering custom websites, 
      eCommerce solutions, branding, SEO, and digital marketing services.
      Please contact us at hello@jabinweb.com for pricing and more information.
    `;
  }
}

// Cache the website information
let websiteInfoCache: {
  data: string;
  timestamp: number;
} = {
  data: '',
  timestamp: 0
};

// Cache time-to-live: 24 hours
const CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Get a response from Gemini AI for search queries
 */
export async function getAISearchResults(query: string, context?: string) {
  try {
    // Get cached website info or fetch new
    const now = Date.now();
    if (!websiteInfoCache.data || (now - websiteInfoCache.timestamp) > CACHE_TTL) {
      console.log('[Gemini] Refreshing website information cache');
      websiteInfoCache = {
        data: await getWebsiteInformation(),
        timestamp: now
      };
    }
    
    // For text-only input, use the gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Combine website information with any specific context
    const enhancedContext = context 
      ? `${websiteInfoCache.data}\n\n${context}`
      : websiteInfoCache.data;
    
    // Construct the prompt with enhanced context
    const prompt = `Based on the following information about Jabin Web, answer the user's query:
         
         COMPANY INFORMATION:
         ${enhancedContext}
         
         USER QUERY:
         ${query}
         
         Please provide a helpful, concise answer with relevant information from the context.
         Focus on being accurate and providing specific details about our services, pricing, or process when relevant.
         If the information isn't covered in the context, provide a general helpful response about web design and development.
         Format your answer professionally as if you're a customer service representative.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      query,
      aiResponse: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Gemini AI error:', error);
    throw new Error('Failed to get AI response');
  }
}

/**
 * Summarize content using Gemini AI
 */
export async function summarizeContent(content: string, type: 'blog' | 'project' | 'service') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Summarize the following ${type} content in 2-3 concise sentences:
    
    ${content.substring(0, 15000)} // Limiting content length to avoid token limits
    
    Focus on the main points and key takeaways. Keep it professional and informative.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini AI summarization error:', error);
    return null; // Return null instead of throwing to avoid breaking calling code
  }
}
