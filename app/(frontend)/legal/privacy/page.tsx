import { Container } from "@/components/ui/container"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Jabin Web",
  description: "Our privacy policy details how we collect, use, and protect your personal information."
}

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-20">
      <div className="max-w-4xl mx-auto prose prose-headings:font-bold prose-headings:tracking-tight">
        <h1 className="mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <h2>1. Introduction</h2>
        <p>
          Welcome to Jabin Web (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We respect your privacy and are committed to protecting 
          your personal data. This privacy policy will inform you about how we look after your personal data 
          when you visit our website and tell you about your privacy rights and how the law protects you.
        </p>

        <h2>2. The Data We Collect About You</h2>
        <p>
          Personal data, or personal information, means any information about an individual from which that 
          person can be identified. We may collect, use, store and transfer different kinds of personal data 
          about you which we have grouped together as follows:
        </p>
        <ul>
          <li><strong>Identity Data</strong> includes first name, last name, username, or similar identifier.</li>
          <li><strong>Contact Data</strong> includes email address, telephone numbers, and postal address.</li>
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, 
          time zone setting and location, browser plug-in types and versions, operating system and platform, 
          and other technology on the devices you use to access this website.</li>
          <li><strong>Usage Data</strong> includes information about how you use our website, products, and services.</li>
          <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing 
          from us and your communication preferences.</li>
        </ul>

        <h2>3. How We Collect Your Personal Data</h2>
        <p>We use different methods to collect data from and about you including through:</p>
        <ul>
          <li><strong>Direct interactions.</strong> You may give us your Identity and Contact Data by filling in forms 
          or by corresponding with us by post, phone, email, or otherwise.</li>
          <li><strong>Automated technologies or interactions.</strong> As you interact with our website, we may 
          automatically collect Technical Data about your equipment, browsing actions, and patterns.</li>
          <li><strong>Third parties or publicly available sources.</strong> We may receive personal data about you from 
          various third parties and public sources.</li>
        </ul>

        <h2>4. How We Use Your Personal Data</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal 
          data in the following circumstances:
        </p>
        <ul>
          <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
          <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests 
          and fundamental rights do not override those interests.</li>
          <li>Where we need to comply with a legal obligation.</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
          used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal 
          data to those employees, agents, contractors, and other third parties who have a business need to know.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected 
          it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements.
        </p>

        <h2>7. Your Legal Rights</h2>
        <p>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data. 
          These include the right to:
        </p>
        <ul>
          <li>Request access to your personal data.</li>
          <li>Request correction of your personal data.</li>
          <li>Request erasure of your personal data.</li>
          <li>Object to processing of your personal data.</li>
          <li>Request restriction of processing your personal data.</li>
          <li>Request transfer of your personal data.</li>
          <li>Right to withdraw consent.</li>
        </ul>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us at:<br/>
          <strong>Email:</strong> privacy@jabinweb.com<br/>
          <strong>Postal Address:</strong> Jabin Web, 123 Web Avenue, Internet City, 12345
        </p>
      </div>
    </Container>
  )
}
