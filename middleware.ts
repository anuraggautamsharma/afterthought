import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const DEV_FALLBACK = 'fallback-dev-secret-change-in-prod'

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET
  if ((!s || s === DEV_FALLBACK) && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set (and not the dev fallback) in production.')
  }
  return new TextEncoder().encode(s || DEV_FALLBACK)
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('at_admin_session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    try {
      await jwtVerify(token, getSecret())
    } catch {
      const res = NextResponse.redirect(new URL('/admin/login', req.url))
      res.cookies.delete('at_admin_session')
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
