'use client'

import { useState, useEffect, ReactNode } from 'react'

interface PasswordGateProps {
  formId: string
  correctPassword: string
  children: ReactNode
}

export default function PasswordGate({ formId, correctPassword, children }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const storageKey = `form_pw_${formId}`

  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey)
    if (stored === correctPassword) {
      setUnlocked(true)
    }
  }, [storageKey, correctPassword])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === correctPassword) {
      sessionStorage.setItem(storageKey, input)
      setUnlocked(true)
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div className="form-password-gate">
      <div className="form-password-gate__inner">
        <div className="form-password-gate__icon">🔒</div>
        <h2 className="form-password-gate__title">Password required</h2>
        <p className="form-password-gate__description">This form is password protected.</p>
        <form onSubmit={handleSubmit} className="form-password-gate__form">
          <input
            type="password"
            className="form-input"
            value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            placeholder="Enter password"
            autoFocus
          />
          {error && <p className="form-field-error">{error}</p>}
          <button type="submit" className="form-btn form-btn--primary">
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
