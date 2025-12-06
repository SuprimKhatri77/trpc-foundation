import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    // Only rewrite if EXTERNAL_API_URL is set (production)
    if (process.env.EXTERNAL_API_URL) {
      return [
        {
          source: '/api/auth/:path*',
          destination: `${process.env.EXTERNAL_API_URL}/api/auth/:path*`,
        },
      ]
    }
    return []
  },
}

export default nextConfig
