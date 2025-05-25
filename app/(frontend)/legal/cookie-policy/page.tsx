import { Container } from "@/components/ui/container"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | Jabin Web",
  description: "Information about how Jabin Web uses cookies and similar technologies."
}

export default function CookiePolicyPage() {
  return (
    <Container className="py-20">
      <div className="max-w-4xl mx-auto prose prose-headings:font-bold prose-headings:tracking-tight">
        <h1 className="mb-8">Cookie Policy</h1>
        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file 
          is stored in your web browser and allows the site or a third party to recognize you and make your 
          next visit easier and the website more useful to you.
        </p>

        <h2>2. How We Use Cookies</h2>
        <p>
          We use cookies for the following purposes:
        </p>
        <ul>
          <li><strong>Authentication</strong> - We use cookies to identify you when you visit our website and as you navigate our website.</li>
          <li><strong>Status</strong> - We use cookies to help us to determine if you are logged into our website.</li>
          <li><strong>Personalization</strong> - We use cookies to store information about your preferences and to personalize the website for you.</li>
          <li><strong>Security</strong> - We use cookies as an element of the security measures used to protect user accounts, including preventing fraudulent use of login credentials, and to protect our website and services generally.</li>
          <li><strong>Analysis</strong> - We use cookies to help us to analyze the use and performance of our website and services.</li>
          <li><strong>Cookie Consent</strong> - We use cookies to store your preferences in relation to the use of cookies more generally.</li>
        </ul>

        <h2>3. Types of Cookies We Use</h2>
        <h3>Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function properly. They enable core functionality such as 
          security, network management, and accessibility. You may disable these by changing your browser settings, 
          but this may affect how the website functions.
        </p>

        <h3>Analytics Cookies</h3>
        <p>
          These cookies help us to understand how visitors interact with our website by collecting and reporting 
          information anonymously. They allow us to count visits and traffic sources so we can measure and improve 
          the performance of our site.
        </p>

        <h3>Marketing Cookies</h3>
        <p>
          These cookies are used to track visitors across websites. The intention is to display ads that are relevant 
          and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.
        </p>

        <h2>4. Managing Cookies</h2>
        <p>
          Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from 
          browser to browser, and from version to version. You can however obtain up-to-date information about blocking 
          and deleting cookies via these links:
        </p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647?hl=en" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
          <li><a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer">Microsoft Internet Explorer</a></li>
          <li><a href="https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
        </ul>
        <p>
          Please note that blocking cookies may have a negative impact on the functions of many websites, including our site. 
          Some features of the site may cease to be available to you.
        </p>

        <h2>5. Contact Us</h2>
        <p>
          If you have any questions about our Cookie Policy, please contact us:<br/>
          <strong>Email:</strong> privacy@jabinweb.com<br/>
          <strong>Postal Address:</strong> Jabin Web, 123 Web Avenue, Internet City, 12345
        </p>
      </div>
    </Container>
  )
}
