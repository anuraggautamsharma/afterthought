// Canonical site URL, used for metadata, sitemap and robots.
// Set NEXT_PUBLIC_SITE_URL in Vercel to your production domain.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  'https://afterthought.studio'
).replace(/\/$/, '')

export const SITE_NAME = 'Afterthought'
export const SITE_DESCRIPTION =
  'Afterthought is an independent design & creative studio based in Bangalore, working internationally. Brand identity, naming, packaging and digital, by Anurag Gautam and Tina Gidwani.'
