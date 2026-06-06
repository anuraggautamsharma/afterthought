'use server'

import { compare } from 'bcryptjs'
import { signToken, setSessionCookie, clearSessionCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const ADMIN_HASH  = process.env.ADMIN_PASSWORD_HASH!

export async function loginAction(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const email    = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email and password are required.' }

  const emailMatch    = email.trim().toLowerCase() === ADMIN_EMAIL?.toLowerCase()
  const passwordMatch = ADMIN_HASH ? await compare(password, ADMIN_HASH) : false

  if (!emailMatch || !passwordMatch) {
    return { error: 'Incorrect email or password.' }
  }

  const token = await signToken(email)
  await setSessionCookie(token)
  redirect('/admin/posts')
}

export async function logoutAction() {
  await clearSessionCookie()
  redirect('/admin/login')
}
