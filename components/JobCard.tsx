'use client'

import { useState } from 'react'

type RoleId = 'motion-designer' | 'visual-designer'

interface Props {
  id: RoleId
  title: string
  type: string
  location: string
  description: string
  lookingFor: string[]
  niceToHave: string
}

/* ── Chip helper ── */
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

/* ── Motion Graphic Designer form ── */
function MotionForm({ onSubmit }: { onSubmit: () => void }) {
  const [tools,    setTools]    = useState<string[]>([])
  const [types,    setTypes]    = useState<string[]>([])
  const [exp,      setExp]      = useState<string[]>([])
  const [workType, setWorkType] = useState<string[]>([])
  const [avail,    setAvail]    = useState<string[]>([])

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) =>
    set(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])

  return (
    <form className="job-apply-form contact-form" onSubmit={e => { e.preventDefault(); onSubmit() }}>
      <div className="job-apply-form__grid">
        <div className="form-row"><label>Full name</label><input type="text" required placeholder="Your name" /></div>
        <div className="form-row"><label>Email</label><input type="email" required placeholder="you@email.com" /></div>
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
        <input type="url" required placeholder="https://your-reel.com" />
      </div>

      <div className="form-row">
        <label>A specific project you're proud of <span style={{ opacity: 0.5 }}>(link or describe)</span></label>
        <input type="text" placeholder="Link or name of the project" />
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
        <textarea placeholder="Keep it real — a few sentences is fine." />
      </div>

      <div className="submit-row">
        <button type="submit" className="btn btn-primary">Send application →</button>
        <span className="caption" style={{ opacity: 0.5 }}>We read every one.</span>
      </div>
    </form>
  )
}

/* ── Visual Designer form ── */
function VisualForm({ onSubmit }: { onSubmit: () => void }) {
  const [tools,     setTools]     = useState<string[]>([])
  const [strengths, setStrengths] = useState<string[]>([])
  const [projects,  setProjects]  = useState<string[]>([])
  const [workType,  setWorkType]  = useState<string[]>([])
  const [avail,     setAvail]     = useState<string[]>([])

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) =>
    set(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])

  return (
    <form className="job-apply-form contact-form" onSubmit={e => { e.preventDefault(); onSubmit() }}>
      <div className="job-apply-form__grid">
        <div className="form-row"><label>Full name</label><input type="text" required placeholder="Your name" /></div>
        <div className="form-row"><label>Email</label><input type="email" required placeholder="you@email.com" /></div>
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
        <input type="url" required placeholder="https://your-portfolio.com" />
      </div>

      <div className="form-row">
        <label>Link to one complete brand identity case study</label>
        <input type="url" placeholder="https://case-study-link.com" />
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
        <textarea placeholder="~150 words. We want to understand how you think, not just what you make." style={{ minHeight: '120px' }} />
      </div>

      <div className="submit-row">
        <button type="submit" className="btn btn-primary">Send application →</button>
        <span className="caption" style={{ opacity: 0.5 }}>We read every one.</span>
      </div>
    </form>
  )
}

/* ── Main JobCard component ── */
export default function JobCard({ id, title, type, location, description, lookingFor, niceToHave }: Props) {
  const [applying,  setApplying]  = useState(false)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="job-card">
      <div className="job-card__head">
        <div className="job-card__meta">
          <span className="job-card__tag">{type}</span>
          <span className="job-card__tag">{location}</span>
        </div>
        <h3 className="job-card__title">{title}</h3>
        <p className="job-card__desc">{description}</p>
      </div>

      <div className="job-card__body">
        <div className="job-card__section">
          <span className="job-card__label">What we're looking for</span>
          <ul className="job-card__list">
            {lookingFor.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="job-card__section">
          <span className="job-card__label">Nice to have</span>
          <p className="job-card__nice">{niceToHave}</p>
        </div>
      </div>

      <div className="job-card__foot">
        {submitted ? (
          <div className="job-card__success">
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '22px', letterSpacing: '-0.3px' }}>
              Application received. We'll be in touch.
            </span>
          </div>
        ) : applying ? (
          <div className="job-card__form-wrap">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.55 }}>
                Applying for — {title}
              </span>
              <button className="job-card__cancel" onClick={() => setApplying(false)}>Cancel</button>
            </div>
            {id === 'motion-designer'
              ? <MotionForm onSubmit={() => setSubmitted(true)} />
              : <VisualForm onSubmit={() => setSubmitted(true)} />
            }
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => setApplying(true)}>
            Apply for this role →
          </button>
        )}
      </div>
    </div>
  )
}
