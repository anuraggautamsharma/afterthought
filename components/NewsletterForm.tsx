'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false)

  return (
    <form
      style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap', maxWidth: '540px' }}
      onSubmit={(e) => {
        e.preventDefault()
        setSubscribed(true)
      }}
    >
      <input
        type="email"
        required
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
      <button type="submit" className="btn btn-primary">
        {subscribed ? 'Welcome →' : 'Subscribe →'}
      </button>
    </form>
  )
}
