'use client'

import { useState } from 'react'
import { submitForm } from '@/app/actions/forms'

type Payload = {
  name: string
  email: string
  message: string
  data: Record<string, unknown>
}

const ROLE_TITLES: Record<string, string> = {
  'motion-designer': 'Motion Designer',
  'visual-designer': 'Visual / Brand Designer',
}

function Chips({ options, selected, onChange }: {
  options: string[]
  selected: string[]
  onChange: (v: string) => void
}) {
  return (
    <div className="chip-row" style={{ marginTop: '8px' }}>
      {options.map(o => (
        <label key={o} className={`chip${selected.includes(o) ? ' is-on' : ''}`}>
          <input type="checkbox" checked={selected.includes(o)} onChange={() => onChange(o)} />
          {o}
        </label>
      ))}
    </div>
  )
}

function SubmitRow({ pending, error }: { pending: boolean; error: string }) {
  return (
    <div className="submit-row">
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? 'Sending…' : 'Send application →'}
      </button>
      <span className="caption" style={{ opacity: error ? 1 : 0.5, color: error ? '#b91c1c' : undefined }}>
        {error || 'We read every one.'}
      </span>
    </div>
  )
}

function MotionForm({ onSubmit, pending, error }: { onSubmit: (p: Payload) => void; pending: boolean; error: string }) {
  const [tools,    setTools]    = useState<string[]>([])
  const [types,    setTypes]    = useState<string[]>([])
  const [exp,      setExp]      = useState<string[]>([])
  const [workType, setWorkType] = useState<string[]>([])
  const [avail,    setAvail]    = useState<string[]>([])

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) =>
    set(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])

  const handle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      message: String(fd.get('why') ?? ''),
      data: {
        experience: exp, tools, motion_types: types,
        portfolio: String(fd.get('portfolio') ?? ''),
        proud_project: String(fd.get('proud') ?? ''),
        availability: avail, work_type: workType,
      },
    })
  }

  return (
    <form className="contact-form" style={{ background: 'transparent', padding: 0 }} onSubmit={handle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-row"><label>Full name</label><input name="name" type="text" required placeholder="Your name" /></div>
        <div className="form-row"><label>Email</label><input name="email" type="email" required placeholder="you@email.com" /></div>
      </div>

      <div className="form-row">
        <label>Years of experience</label>
        <Chips options={['0–2 yrs', '2–5 yrs', '5+ yrs']} selected={exp} onChange={toggle(setExp)} />
      </div>

      <div className="form-row">
        <label>Primary tools</label>
        <Chips options={['After Effects', 'Cinema 4D', 'Blender', 'Premiere Pro', 'Illustrator', 'Expressions / JS', 'Other']} selected={tools} onChange={toggle(setTools)} />
      </div>

      <div className="form-row">
        <label>Type of motion work you do most</label>
        <Chips options={['Brand Motion', 'Social Content', 'Explainer Video', 'UI Animation', 'Title Sequences', 'Other']} selected={types} onChange={toggle(setTypes)} />
      </div>

      <div className="form-row">
        <label>Portfolio / reel link <span style={{ opacity: 0.5 }}>(required)</span></label>
        <input name="portfolio" type="url" required placeholder="https://your-reel.com" />
      </div>

      <div className="form-row">
        <label>A specific project you're proud of <span style={{ opacity: 0.5 }}>(link or describe)</span></label>
        <input name="proud" type="text" placeholder="Link or name of the project" />
      </div>

      <div className="form-row">
        <label>Availability</label>
        <Chips options={['Immediate', 'Within 1 month', '3+ months']} selected={avail} onChange={toggle(setAvail)} />
      </div>

      <div className="form-row">
        <label>Work type preference</label>
        <Chips options={['Full-time', 'Contract / Freelance']} selected={workType} onChange={toggle(setWorkType)} />
      </div>

      <div className="form-row">
        <label>Why Afterthought? What kind of briefs bring out your best work?</label>
        <textarea name="why" placeholder="Keep it real — a few sentences is fine." />
      </div>

      <SubmitRow pending={pending} error={error} />
    </form>
  )
}

function VisualForm({ onSubmit, pending, error }: { onSubmit: (p: Payload) => void; pending: boolean; error: string }) {
  const [tools,     setTools]     = useState<string[]>([])
  const [strengths, setStrengths] = useState<string[]>([])
  const [projects,  setProjects]  = useState<string[]>([])
  const [workType,  setWorkType]  = useState<string[]>([])
  const [avail,     setAvail]     = useState<string[]>([])

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) =>
    set(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])

  const handle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      message: String(fd.get('approach') ?? ''),
      data: {
        projects_completed: projects, tools, strengths,
        portfolio: String(fd.get('portfolio') ?? ''),
        case_study: String(fd.get('casestudy') ?? ''),
        availability: avail, work_type: workType,
      },
    })
  }

  return (
    <form className="contact-form" style={{ background: 'transparent', padding: 0 }} onSubmit={handle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-row"><label>Full name</label><input name="name" type="text" required placeholder="Your name" /></div>
        <div className="form-row"><label>Email</label><input name="email" type="email" required placeholder="you@email.com" /></div>
      </div>

      <div className="form-row">
        <label>Brand identity projects completed</label>
        <Chips options={['1–5 projects', '6–10 projects', '10+ projects']} selected={projects} onChange={toggle(setProjects)} />
      </div>

      <div className="form-row">
        <label>Primary tools</label>
        <Chips options={['Figma', 'Illustrator', 'Photoshop', 'InDesign', 'Other']} selected={tools} onChange={toggle(setTools)} />
      </div>

      <div className="form-row">
        <label>Where do you do your strongest work?</label>
        <Chips options={['Logo Design', 'Colour & Type Systems', 'Brand Guidelines', 'Multi-touchpoint Adaptation', 'Packaging', 'Other']} selected={strengths} onChange={toggle(setStrengths)} />
      </div>

      <div className="form-row">
        <label>Portfolio link <span style={{ opacity: 0.5 }}>(required)</span></label>
        <input name="portfolio" type="url" required placeholder="https://your-portfolio.com" />
      </div>

      <div className="form-row">
        <label>Link to one complete brand identity case study</label>
        <input name="casestudy" type="url" placeholder="https://case-study-link.com" />
      </div>

      <div className="form-row">
        <label>Availability</label>
        <Chips options={['Immediate', 'Within 1 month', '3+ months']} selected={avail} onChange={toggle(setAvail)} />
      </div>

      <div className="form-row">
        <label>Work type preference</label>
        <Chips options={['Full-time', 'Contract / Freelance']} selected={workType} onChange={toggle(setWorkType)} />
      </div>

      <div className="form-row">
        <label>Walk us through how you approach a brand brief — from first conversation to final delivery.</label>
        <textarea name="approach" placeholder="~150 words. We want to understand how you think, not just what you make." style={{ minHeight: '120px' }} />
      </div>

      <SubmitRow pending={pending} error={error} />
    </form>
  )
}

function GenericForm({ onSubmit, pending, error }: { onSubmit: (p: Payload) => void; pending: boolean; error: string }) {
  const [avail,    setAvail]    = useState<string[]>([])
  const [workType, setWorkType] = useState<string[]>([])

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) =>
    set(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])

  const handle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      message: String(fd.get('why') ?? ''),
      data: {
        portfolio: String(fd.get('portfolio') ?? ''),
        availability: avail, work_type: workType,
      },
    })
  }

  return (
    <form className="contact-form" style={{ background: 'transparent', padding: 0 }} onSubmit={handle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-row"><label>Full name</label><input name="name" type="text" required placeholder="Your name" /></div>
        <div className="form-row"><label>Email</label><input name="email" type="email" required placeholder="you@email.com" /></div>
      </div>

      <div className="form-row">
        <label>Portfolio / work link <span style={{ opacity: 0.5 }}>(required)</span></label>
        <input name="portfolio" type="url" required placeholder="https://your-work.com" />
      </div>

      <div className="form-row">
        <label>Availability</label>
        <Chips options={['Immediate', 'Within 1 month', '3+ months']} selected={avail} onChange={toggle(setAvail)} />
      </div>

      <div className="form-row">
        <label>Work type preference</label>
        <Chips options={['Full-time', 'Contract / Freelance']} selected={workType} onChange={toggle(setWorkType)} />
      </div>

      <div className="form-row">
        <label>Why Afterthought? Tell us a bit about yourself and the work you want to do.</label>
        <textarea name="why" placeholder="Keep it real — a few sentences is fine." style={{ minHeight: '120px' }} />
      </div>

      <SubmitRow pending={pending} error={error} />
    </form>
  )
}

export default function RoleApplyForm({ id }: { id: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const roleTitle = ROLE_TITLES[id] ?? id.replace(/-/g, ' ')

  const handleSubmit = async (p: Payload) => {
    if (pending) return
    setPending(true)
    setError('')
    const res = await submitForm({
      type: 'application',
      name: p.name,
      email: p.email,
      subject: `Application — ${roleTitle}`,
      message: p.message,
      data: { role: roleTitle, role_id: id, ...p.data },
    })
    setPending(false)
    if (res.ok) setSubmitted(true)
    else setError(res.error ?? 'Something went wrong. Please try again.')
  }

  if (submitted) {
    return (
      <div style={{ padding: '48px 0' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
          Application received. We&apos;ll be in touch.
        </p>
        <p className="body-sm" style={{ opacity: 0.65 }}>We read every application personally. If there&apos;s a fit, we&apos;ll reach out directly.</p>
      </div>
    )
  }

  if (id === 'motion-designer') return <MotionForm onSubmit={handleSubmit} pending={pending} error={error} />
  if (id === 'visual-designer') return <VisualForm onSubmit={handleSubmit} pending={pending} error={error} />
  return <GenericForm onSubmit={handleSubmit} pending={pending} error={error} />
}
