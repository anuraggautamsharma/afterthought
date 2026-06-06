'use client'

import { useActionState, useState } from 'react'
import { loginAction } from '@/app/admin/login/actions'

const initial = { error: undefined as string | undefined }

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial)
  const [showPassword, setShowPassword] = useState(false)

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
          <div className="admin-password-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••••"
            />
            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <button type="submit" className="admin-btn-primary" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in →'}
      </button>
    </form>
  )
}
