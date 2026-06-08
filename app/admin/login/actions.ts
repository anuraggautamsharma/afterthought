'use server'

import { compare } from 'bcryptjs'
import { signToken, setSessionCookie, clearSessionCookie } from '@/lib/auth'
import { getUserAuthByEmail } from '@/lib/users'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const ADMIN_HASH  = process.env.ADMIN_PASSWORD_HASH!

export async function loginAction(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const email    = ((formData.get('email') as string) ?? '').trim()
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email and password are required.' }

  const lower = email.toLowerCase()
  let authedEmail: string | null = null

  // 1) Permanent owner account (env vars) — never gets locked out.
  if (ADMIN_EMAIL && lower === ADMIN_EMAIL.toLowerCase()) {
    const ok = ADMIN_HASH ? await compare(password, ADMIN_HASH) : false
    if (!ok) return { error: 'Incorrect email or password.' }
    authedEmail = lower
  } else {
    // 2) CMS users table.
    try {
      const user = await getUserAuthByEmail(lower)
      if (user && (await compare(password, user.password_hash))) authedEmail = user.email
    } catch {
      // fall through to generic error below
    }
  }

  if (!authedEmail) return { error: 'Incorrect email or password.' }

  await setSessionCookie(await signToken(authedEmail))
  redirect('/admin/posts')
}

export async function logoutAction() {
  await clearSessionCookie()
  redirect('/admin/login')
}
