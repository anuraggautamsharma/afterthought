/** @type {import('next').NextConfig} */
const config = {
  trailingSlash: true,
  // OAuth discovery + MCP endpoints are machine-to-machine and must not be
  // redirected by the trailing-slash rule.
  skipTrailingSlashRedirect: true,
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
  // Bundle brand fonts into the MCP route so the server-side hero renderer
  // can read them at runtime.
  outputFileTracingIncludes: {
    '/api/[transport]': ['./assets/fonts/**'],
  },
  async rewrites() {
    return [
      // RFC 9728 protected-resource metadata. Next ignores dot-folders in app/,
      // so serve it from a normal route and rewrite the well-known path to it.
      { source: '/.well-known/oauth-protected-resource', destination: '/api/oauth-protected-resource' },
      { source: '/.well-known/oauth-protected-resource/:path*', destination: '/api/oauth-protected-resource' },
    ]
  },
}
export default config
