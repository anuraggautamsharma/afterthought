'use server'

import {
  createUser, updateUser, deleteUser, setUserPassword,
  getUserAuthByEmail, getUserById, type UserRole,
} from '@/lib/users'
import { getSession, requireSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

type Result = { ok?: boolean; error?: string }

export async function createUserAction(input: {
  email: string; name: string; role: UserRole; password: string
}): Promise<Result> {
  await requireSession()
  const email = input.email.trim().toLowerCase()
  if (!email || !input.password) return { error: 'Email and password are required.' }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: 'Please enter a valid email.' }
  if (input.password.length < 8) return { error: 'Password must be at least 8 characters.' }

  if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL.toLowerCase()) {
    return { error: 'That email is the owner account.' }
  }
  const existing = await getUserAuthByEmail(email).catch(() => null)
  if (existing) return { error: 'A user with that email already exists.' }

  try {
    await createUser({ email, name: input.name, role: input.role, password: input.password })
    revalidatePath('/admin/users')
    return { ok: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Could not create user.' }
  }
}

export async function updateUserAction(id: string, input: { name: string; role: UserRole }): Promise<Result> {
  await requireSession()
  try {
    await updateUser(id, input)
    revalidatePath('/admin/users')
    return { ok: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Could not update user.' }
  }
}

export async function setPasswordAction(id: string, password: string): Promise<Result> {
  await requireSession()
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' }
  try {
    await setUserPassword(id, password)
    revalidatePath('/admin/users')
    return { ok: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Could not set password.' }
  }
}

export async function deleteUserAction(id: string): Promise<Result> {
  await requireSession()
  const [session, target] = await Promise.all([getSession(), getUserById(id)])
  if (target && session && target.email.toLowerCase() === session.email.toLowerCase()) {
    return { error: 'You can’t delete your own account.' }
  }
  try {
    await deleteUser(id)
    revalidatePath('/admin/users')
    return { ok: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Could not delete user.' }
  }
}
