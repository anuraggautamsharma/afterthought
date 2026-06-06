'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/admin/login/actions'

const initial = { error: undefined as string | undefined }

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial)

  return (
    <form action={action}>
      {state?.error && (
        <div className="admin-login__error">{state.error}</div>
      )}
      <div className="admin-login__fields">
        <div className="admin-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@afterthought.studio" />
        </div>
        <div className="admin-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••••" />
        </div>
      </div>
      <button type="submit" className="admin-btn-primary" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in →'}
      </button>
    </form>
  )
}
