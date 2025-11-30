/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: '/admin',
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/admin-panel',
      },
    ]
  },
}

export default nextConfig
