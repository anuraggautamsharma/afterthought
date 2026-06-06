'use client'

import { useState } from 'react'
import { submitForm } from '@/app/actions/forms'

const TOPICS = ['Identity', 'Naming', 'Packaging', 'Digital & web', 'Editorial', 'Campaign', 'Not sure yet']

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [topics, setTopics] = useState<string[]>([])

  const toggleTopic = (t: string) =>
    setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pending) return
    setPending(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '')
    const email = String(fd.get('email') ?? '')
    const company = String(fd.get('company') ?? '')
    const budget = String(fd.get('budget') ?? '')
    const when = String(fd.get('when') ?? '')
    const message = String(fd.get('msg') ?? '')

    const res = await submitForm({
      type: 'contact',
      name,
      email,
      subject: company ? `Brief — ${company}` : 'New brief',
      message,
      data: { company, topics, budget, timeline: when },
    })

    setPending(false)
    if (res.ok) setSubmitted(true)
    else setError(res.error ?? 'Something went wrong. Please try again.')
  }

  return (
    <>
      {!submitted ? (
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Start a brief.</h3>
          <div className="form-row">
            <label htmlFor="name">Your name</label>
            <input id="name" name="name" type="text" required placeholder="First &amp; last" />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="you@company.com" />
          </div>
          <div className="form-row">
            <label htmlFor="company">Company / project</label>
            <input id="company" name="company" type="text" placeholder="The thing you're making" />
          </div>
          <div className="form-row">
            <label>What might this be about? <span style={{ opacity: 0.5, textTransform: 'none', letterSpacing: 0 }}>— pick a few</span></label>
            <div className="chip-row">
              {TOPICS.map(t => (
                <label key={t} className={`chip${topics.includes(t) ? ' is-on' : ''}`}>
                  <input type="checkbox" checked={topics.includes(t)} onChange={() => toggleTopic(t)} />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="budget">Budget — a rough sense is fine</label>
            <select id="budget" name="budget" defaultValue="I'd rather discuss">
              <option>I&apos;d rather discuss</option>
              <option>Under ₹15L / $20k</option>
              <option>₹15–40L / $20–50k</option>
              <option>₹40L–1Cr / $50–125k</option>
              <option>Above ₹1Cr / $125k</option>
              <option>Pro bono / cultural</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="when">When are you hoping to start?</label>
            <select id="when" name="when" defaultValue="Summer 2026 (we're reading)">
              <option>Summer 2026 (we&apos;re reading)</option>
              <option>Autumn 2026</option>
              <option>Winter 2026 / 27</option>
              <option>Whenever the right answer arrives</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="msg">A paragraph or two. The brief, the question, the half-formed thing.</label>
            <textarea id="msg" name="msg" placeholder="No length minimum. Plain English is better than headings."></textarea>
          </div>
          <div className="submit-row">
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? 'Sending…' : 'Send the note →'}
            </button>
            <span className="caption">{error ? error : 'We reply within a week. Promise.'}</span>
          </div>
        </form>
      ) : (
        <div style={{ background: 'var(--c-block-lime)', padding: '48px', borderRadius: 'var(--r-lg)' }}>
          <h3 style={{ fontSize: '32px', letterSpacing: '-0.5px', fontVariationSettings: "'wght' 480", fontWeight: 480, marginBottom: '16px' }}>Got it — thank you.</h3>
          <p className="body-lg">One of us will read it tomorrow morning over coffee, and write back within the week. If the brief looks like a fit, we&apos;ll suggest a 30-minute call.</p>
          <p className="body-sm" style={{ marginTop: '16px', opacity: 0.7 }}>In the meantime, there&apos;s <a href="/work" style={{ color: 'inherit', borderBottom: '1px solid currentColor' }}>a little more of our work over here</a>.</p>
        </div>
      )}
    </>
  )
}
