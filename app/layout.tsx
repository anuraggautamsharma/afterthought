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

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}>
      <body>
        <SiteNav><Nav settings={settings} /></SiteNav>
        {children}
        <SiteFooter><Footer settings={settings} /></SiteFooter>
        <SiteNav><GsapAnimations /></SiteNav>
      </body>
    </html>
  )
}
