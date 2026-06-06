import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { SiteNav, SiteFooter } from '@/components/SiteShell'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import GsapAnimations from '@/components/GsapAnimations'
import { getSettings } from '@/lib/settings'

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
  title: 'Afterthought — A design & creative studio',
  description:
    'Afterthought is an independent design & creative studio based in Bangalore, working internationally. Brand identity, naming, packaging and digital, by Anurag Gautam and Tina Gidwani.',
  icons: {
    icon: '/assets/favicon.png',
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
