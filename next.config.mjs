/** @type {import('next').NextConfig} */
const config = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
    ],
  },
  experimental: {
    // Allow form file uploads through server actions (default is 1 MB).
    serverActions: { bodySizeLimit: '25mb' },
  },
}
export default config
