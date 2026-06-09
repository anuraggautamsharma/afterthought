import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const DEV_FALLBACK = 'fallback-dev-secret-change-in-prod'
const COOKIE  = 'at_admin_session'

/** Resolve the signing secret, refusing the dev fallback in production. */
function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET
  if ((!s || s === DEV_FALLBACK) && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set (and not the dev fallback) in production.')
  }
  return new TextEncoder().encode(s || DEV_FALLBACK)
}

export async function signToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as { email: string }
  } catch {
    return null
  }
}

export async function getSession() {
  const jar   = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

/** Throws if there's no valid admin session. Call at the top of admin server actions. */
export async function requireSession() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function setSessionCookie(token: string) {
  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function clearSessionCookie() {
  const jar = await cookies()
  jar.delete(COOKIE)
}
