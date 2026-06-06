'use client'

import { useState } from 'react'
import { submitForm } from '@/app/actions/forms'

export default function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pending || subscribed) return
    setPending(true)
    const res = await submitForm({ type: 'newsletter', email, subject: 'Newsletter signup' })
    setPending(false)
    if (res.ok) setSubscribed(true)
  }

  return (
    <form
      style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap', maxWidth: '540px' }}
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={subscribed}
        placeholder="your@email.com"
        style={{
          flex: 1,
          minWidth: '220px',
          background: 'var(--c-canvas)',
          border: '1px solid rgba(0,0,0,0.18)',
          borderRadius: 'var(--r-pill)',
          padding: '12px 20px',
          fontFamily: 'inherit',
          fontSize: '16px',
          color: 'var(--c-ink)',
          outline: 'none',
        }}
      />
      <button type="submit" className="btn btn-primary" disabled={pending || subscribed}>
        {subscribed ? 'Welcome →' : pending ? 'Subscribing…' : 'Subscribe →'}
      </button>
    </form>
  )
}
