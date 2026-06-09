import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
import './forms/forms.css'
import { SiteNav, SiteFooter } from '@/components/SiteShell'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import GsapAnimations from '@/components/GsapAnimations'
import { getSettings } from '@/lib/settings'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'
import JsonLd from '@/components/JsonLd'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Afterthought — A design & creative studio',
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: '/assets/favicon.png',
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'Afterthought — Thinking' }],
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: 'Afterthought — A design & creative studio',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Afterthought — A design & creative studio',
    description: SITE_DESCRIPTION,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/favicon.png`,
    description: SITE_DESCRIPTION,
    ...(settings.email_general ? { email: settings.email_general } : {}),
    founder: [
      { '@type': 'Person', name: 'Anurag Gautam' },
      { '@type': 'Person', name: 'Tina Gidwani' },
    ],
    ...(settings.studio_address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: settings.studio_address,
            addressLocality: 'Bangalore',
            addressCountry: 'IN',
          },
        }
      : {}),
    sameAs: [
      settings.social_instagram,
      settings.social_linkedin,
      settings.social_behance,
      settings.social_medium,
    ].filter(Boolean),
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
  }

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}>
      <head>
        {/* Google Material Symbols (icon font) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body>
        <JsonLd data={[organization, website]} />
        <SiteNav><Nav settings={settings} /></SiteNav>
        {children}
        <SiteFooter><Footer settings={settings} /></SiteFooter>
        <SiteNav><GsapAnimations /></SiteNav>
        <Analytics />
      </body>
    </html>
  )
}
