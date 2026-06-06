/** @type {import('next').NextConfig} */
const config = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
    ],
  },
}
export default config
