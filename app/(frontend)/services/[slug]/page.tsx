import { Container } from "@/components/ui/container"
import { notFound } from "next/navigation"

// This will be replaced with API call
const getServiceData = async (slug: string) => {
  const services = {
    "website-design": {
      title: "Website Design",
      description: "Custom website design and development services",
      content: [
        { title: "Custom Design", description: "..." },
        { title: "Responsive Development", description: "..." },
        // Add more sections
      ]
    },
    // Add other services
  }
  
  return services[slug as keyof typeof services]
}

export default async function ServicePage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const service = await getServiceData(slug)
  
  if (!service) {
    notFound()
  }

  return (
    <Container className="py-24">
      <h1 className="text-4xl font-bold mb-6">{service.title}</h1>
      <p className="text-lg text-muted-foreground mb-12">{service.description}</p>
      
      {/* Service content sections */}
      <div className="space-y-16">
        {service.content.map((section, i) => (
          <section key={i}>
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <p className="text-muted-foreground">{section.description}</p>
          </section>
        ))}
      </div>
    </Container>
  )
}
