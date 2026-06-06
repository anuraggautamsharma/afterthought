'use client'

import { useState } from 'react'
import { submitForm } from '@/app/actions/forms'

const niches = [
  'Brand Design',
  'Motion & Animation',
  'Strategy',
  'Copywriting',
  'Web Development',
  'Photography',
  'Illustration',
  'Other',
]

export default function FreelanceForm() {
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const toggle = (n: string) =>
    setSelected(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pending) return
    setPending(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const res = await submitForm({
      type: 'freelance',
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      subject: 'Freelance roster application',
      message: String(fd.get('about') ?? ''),
      data: {
        disciplines: selected,
        portfolio: String(fd.get('portfolio') ?? ''),
      },
    })
    setPending(false)
    if (res.ok) setSubmitted(true)
    else setError(res.error ?? 'Something went wrong. Please try again.')
  }

  if (submitted) {
    return (
      <div style={{ marginTop: '36px', padding: '32px 0' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
          Got it. We'll be in touch.
        </p>
        <p className="body-sm" style={{ opacity: 0.65 }}>We read every application. If there's a fit, we'll reach out directly.</p>
      </div>
    )
  }

  return (
    <form
      className="contact-form"
      style={{ marginTop: '36px', background: 'transparent', padding: 0 }}
      onSubmit={handleSubmit}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div className="form-row">
          <label>Name</label>
          <input name="name" type="text" required placeholder="Anurag Gautam" />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input name="email" type="email" required placeholder="you@studio.com" />
        </div>
      </div>

      <div className="form-row" style={{ marginBottom: '16px' }}>
        <label>What you do</label>
        <div className="chip-row" style={{ marginTop: '8px' }}>
          {niches.map(n => (
            <label key={n} className={`chip${selected.includes(n) ? ' is-on' : ''}`}>
              <input type="checkbox" checked={selected.includes(n)} onChange={() => toggle(n)} />
              {n}
            </label>
          ))}
        </div>
      </div>

      <div className="form-row" style={{ marginBottom: '16px' }}>
        <label>Portfolio or work link</label>
        <input name="portfolio" type="url" placeholder="https://your-work.com" />
      </div>

      <div className="form-row" style={{ marginBottom: '24px' }}>
        <label>A few words about your work</label>
        <textarea name="about" placeholder="What kind of briefs do you do your best work on?" style={{ minHeight: '100px' }} />
      </div>

      {error && <p className="caption" style={{ marginBottom: '12px', color: '#b91c1c' }}>{error}</p>}
      <button type="submit" className="btn btn-on-color" disabled={pending}>{pending ? 'Sending…' : 'Send application →'}</button>
    </form>
  )
}
