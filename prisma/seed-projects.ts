import { db } from "../lib/db";
import { ProjectStatus } from "@prisma/client";

async function seedProjects() {
  console.log('Seeding projects...');
  
  // Find admin user for client association
  const adminUser = await db.user.findFirst({
    where: { role: "admin" }
  });

  if (!adminUser) {
    console.error('No admin user found. Create an admin user first.');
    return;
  }

  const projectsData = [
    {
      title: "North India Baptist Seminary",
      slug: "nibs-seminary",
      description: "Modern seminary website with course management and student portal",
      content: {
        sections: [
          {
            type: "text",
            content: "Complete redesign of the seminary website with modern design and functionality. The project included a student portal, course management system, and online application process."
          },
          {
            type: "challenges",
            content: "The main challenge was integrating legacy systems while providing a modern interface."
          },
          {
            type: "solutions",
            content: "We implemented a custom WordPress solution with advanced plugins and custom PHP development to meet the seminary's specific needs."
          }
        ]
      },
      status: "completed" as ProjectStatus,
      featured: true,
      clientId: adminUser.id,
      coverImage: "/projects/nibs-fallback.jpg",
      images: ["/projects/nibs/detail-1.jpg", "/projects/nibs/detail-2.jpg"],
      category: "Education Website",
      tags: ["Education", "WordPress", "PHP", "Custom Plugins"],
      metadata: {
        clientWebsite: "https://nibsindia.com",
        clientName: "Henry John",
        projectDuration: "3 months",
        technology: "WordPress",
        testimonial: "The new website has significantly improved our student enrollment process."
      }
    },
    {
      title: "Holy Blessing Trust",
      slug: "holy-blessing-trust",
      description: "Trust website with donation system and event management",
      content: {
        sections: [
          {
            type: "text",
            content: "Developed a comprehensive website for Holy Blessing Trust with donation capabilities, event management, and volunteer coordination."
          },
          {
            type: "challenges",
            content: "Creating a secure payment system while maintaining ease of use for non-technical administrators."
          },
          {
            type: "solutions",
            content: "Implemented WordPress with WooCommerce and donation plugins, along with custom theme development."
          }
        ]
      },
      status: "completed" as ProjectStatus,
      featured: true,
      clientId: adminUser.id,
      coverImage: "/projects/hbt-fallback.jpg",
      images: ["/projects/hbt/detail-1.jpg", "/projects/hbt/detail-2.jpg"],
      category: "Non-Profit Organization",
      tags: ["Non-Profit", "WordPress", "WooCommerce", "Donations"],
      metadata: {
        clientWebsite: "https://holyblessingtrust.org",
        clientName: "Deepak",
        projectDuration: "2 months",
        technology: "WordPress",
        testimonial: "The donation system has increased our online contributions by 300%."
      }
    },
    {
      title: "Spurring Ventures India",
      slug: "spurring-ventures",
      description: "Corporate website with modern design and animations",
      content: {
        sections: [
          {
            type: "text",
            content: "Created a dynamic corporate website that showcases Spurring Ventures' portfolio, team, and investment strategy."
          },
          {
            type: "challenges",
            content: "Balancing sophisticated animations with performance and accessibility."
          },
          {
            type: "solutions",
            content: "Used Next.js with Framer Motion for smooth animations, along with optimized performance strategies and AA accessibility compliance."
          }
        ]
      },
      status: "completed" as ProjectStatus,
      featured: true,
      clientId: adminUser.id,
      coverImage: "/projects/spurring-fallback.jpg",
      images: ["/projects/spurring/detail-1.jpg", "/projects/spurring/detail-2.jpg"],
      category: "Business Website",
      tags: ["Corporate", "Next.js", "TypeScript", "Framer Motion"],
      metadata: {
        clientWebsite: "https://spurringventures.com",
        clientName: "Jason",
        projectDuration: "1.5 months",
        technology: "Next.js",
        testimonial: "Our new website perfectly represents our brand identity and has improved lead generation."
      }
    },
    {
      title: "ScioSprints",
      slug: "sciosprints",
      description: "Project management tool with agile methodology",
      content: {
        sections: [
          {
            type: "text",
            content: "Built a custom project management tool tailored for agile development teams with sprint planning, task tracking, and reporting."
          },
          {
            type: "challenges",
            content: "Creating an intuitive interface for complex project relationships and dependencies."
          },
          {
            type: "solutions",
            content: "Implemented a Next.js application with real-time features using WebSockets and a modern React component architecture."
          }
        ]
      },
      status: "active" as ProjectStatus,
      featured: true,
      clientId: adminUser.id,
      coverImage: "/projects/sciosprints-fallback.jpg",
      images: ["/projects/sciosprints/detail-1.jpg", "/projects/sciosprints/detail-2.jpg"],
      category: "Web Application",
      tags: ["SaaS", "Next.js", "React", "WebSockets"],
      metadata: {
        clientWebsite: "https://sprints.sciolabs.in",
        clientName: "Davis Abraham",
        projectDuration: "4 months",
        technology: "Next.js",
        testimonial: "ScioSprints has transformed how our teams collaborate and track progress."
      }
    },
    {
      title: "Scio Labs",
      slug: "scio-labs",
      description: "Research and development company website",
      content: {
        sections: [
          {
            type: "text",
            content: "Designed and developed a professional website for Scio Labs, showcasing their research initiatives, team members, and scientific publications."
          },
          {
            type: "challenges",
            content: "Presenting complex technical information in an accessible and engaging way."
          },
          {
            type: "solutions",
            content: "Created a custom WordPress theme with interactive data visualizations and simplified technical concepts with infographics."
          }
        ]
      },
      status: "completed" as ProjectStatus,
      featured: false,
      clientId: adminUser.id,
      coverImage: "/projects/sciolabs-fallback.jpg",
      images: ["/projects/sciolabs/detail-1.jpg", "/projects/sciolabs/detail-2.jpg"],
      category: "Corporate Website",
      tags: ["Research", "WordPress", "Data Visualization", "Custom Theme"],
      metadata: {
        clientWebsite: "http://sciolabs.in",
        clientName: "Davis Abraham",
        projectDuration: "2.5 months",
        technology: "WordPress",
        testimonial: "The visualization of our research data has made our work much more accessible to non-specialists."
      }
    },
    {
      title: "City Holidays",
      slug: "city-holidays",
      description: "Tour and travel booking website with customizable itineraries",
      content: {
        sections: [
          {
            type: "text",
            content: "Developed a comprehensive travel booking platform that allows users to browse destinations, create custom itineraries, and book travel services."
          },
          {
            type: "challenges",
            content: "Building a complex booking system with flexible itinerary options and real-time availability checking."
          },
          {
            type: "solutions",
            content: "Created a Next.js application with server-side rendering for SEO optimization and integrated with multiple travel APIs for comprehensive service offerings."
          }
        ]
      },
      status: "completed" as ProjectStatus,
      featured: true,
      clientId: adminUser.id,
      coverImage: "/projects/cityholidays-fallback.jpg",
      images: ["/projects/cityholidays/detail-1.jpg", "/projects/cityholidays/detail-2.jpg"],
      category: "Travel & Tourism",
      tags: ["Travel", "Next.js", "Booking System", "API Integration"],
      metadata: {
        clientWebsite: "https://cityholidays.in",
        clientName: "Jitendra",
        projectDuration: "3 months",
        technology: "Next.js",
        testimonial: "The new booking system has streamlined our operations and significantly increased our online bookings."
      }
    }
  ];

  for (const project of projectsData) {
    const existing = await db.project.findUnique({
      where: { slug: project.slug }
    });

    if (!existing) {
      await db.project.create({
        data: project
      });
      console.log(`Created project: ${project.title}`);
    } else {
      console.log(`Project already exists: ${project.title}`);
    }
  }
}

seedProjects()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
