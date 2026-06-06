'use client'
import { usePathname } from 'next/navigation'
import Nav from './Nav'
import Footer from './Footer'
import GsapAnimations from './GsapAnimations'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Nav />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <GsapAnimations />}
    </>
  )
}
