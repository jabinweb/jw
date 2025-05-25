import { Container } from "@/components/ui/container"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Jabin Web",
  description: "Our terms and conditions for using Jabin Web services and website."
}

export default function TermsPage() {
  return (
    <Container className="py-20">
      <div className="max-w-4xl mx-auto prose prose-headings:font-bold prose-headings:tracking-tight">
        <h1 className="mb-8">Terms of Service</h1>
        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <h2>1. Introduction</h2>
        <p>
          These terms and conditions govern your use of the Jabin Web website and services. By using our website 
          or services, you accept these terms and conditions in full. If you disagree with these terms and conditions 
          or any part of these terms and conditions, you must not use our website or services.
        </p>

        <h2>2. License to Use Website</h2>
        <p>
          Unless otherwise stated, Jabin Web and/or its licensors own the intellectual property rights in the website 
          and material on the website. Subject to the license below, all these intellectual property rights are reserved.
        </p>
        <p>
          You may view, download for caching purposes only, and print pages from the website for your own personal use, 
          subject to the restrictions set out below and elsewhere in these terms and conditions.
        </p>

        <h2>3. Acceptable Use</h2>
        <p>You must not use our website in any way that causes, or may cause, damage to the website or impairment 
        of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent 
        or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.</p>
        <p>You must not use our website to copy, store, host, transmit, send, use, publish or distribute any material 
        which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, 
        rootkit or other malicious computer software.</p>
        <p>You must not conduct any systematic or automated data collection activities (including without limitation 
        scraping, data mining, data extraction and data harvesting) on or in relation to our website without our 
        express written consent.</p>

        <h2>4. Service Eligibility</h2>
        <p>
          To be eligible to use the Services, you must meet the following criteria:
        </p>
        <ul>
          <li>You must be at least 18 years of age</li>
          <li>You must provide your legal full name, a valid email address, and any other information requested to complete the signup process</li>
          <li>You must not be a resident of a country embargoed by the United States or that is on a U.S. government list of prohibited countries</li>
        </ul>

        <h2>5. Your Content</h2>
        <p>
          In these terms and conditions, &ldquo;your content&rdquo; means all material that you submit to our website, including 
          any text, images, audio material, video material, and audio-visual material. You grant to us a worldwide, 
          irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute 
          your content in any existing or future media. You also grant to us the right to sub-license these rights, 
          and the right to bring an action for infringement of these rights.
        </p>

        <h2>6. Variation</h2>
        <p>
          We may revise these terms and conditions from time-to-time. Revised terms and conditions will apply to the 
          use of our website from the date of the publication of the revised terms and conditions on our website.
        </p>

        <h2>7. Entire Agreement</h2>
        <p>
          These terms and conditions, together with our privacy policy, constitute the entire agreement between you and 
          Jabin Web in relation to your use of our website, and supersede all previous agreements in respect of your 
          use of this website.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about our terms and conditions, please contact us:<br/>
          <strong>Email:</strong> legal@jabinweb.com<br/>
          <strong>Postal Address:</strong> Jabin Web, 123 Web Avenue, Internet City, 12345
        </p>
      </div>
    </Container>
  )
}
