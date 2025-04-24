import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  experimental: {
    reactCompiler: false,
  },
  images: {
    domains: ['localhost', 'your-payload-cms-domain.com'], // Add localhost here
  },
}

// Wrap your `nextConfig` with the `withPayload` plugin
export default withPayload(nextConfig)
