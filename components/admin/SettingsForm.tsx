'use client'

import { useState, useTransition } from 'react'
import type { SiteSettings } from '@/lib/settings'
import { saveSettingsAction } from '@/app/admin/settings/actions'

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState<SiteSettings>(initial)
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState('')

  const field = (key: keyof SiteSettings) => ({
    value: s[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setS(prev => ({ ...prev, [key]: e.target.value })),
  })

  const save = () => {
    startTransition(async () => {
      setStatus('Saving…')
      const res = await saveSettingsAction(s)
      if (res.error) setStatus(`Error: ${res.error}`)
      else {
        setStatus('Saved')
        setTimeout(() => setStatus(''), 2500)
      }
    })
  }

  return (
    <div className="admin-settings">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Studio-wide details shown across the site</p>
        </div>
        <div className="admin-settings__save">
          {status && (
            <span className={`admin-save-pill ${status.startsWith('Error') ? 'is-error' : ''}`}>
              {status}
            </span>
          )}
          <button className="admin-btn-primary" disabled={pending} onClick={save}
            style={{ width: 'auto', padding: '10px 22px' }}>
            {pending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Availability */}
      <section className="admin-settings-card">
        <h2 className="admin-settings-card__title">Availability</h2>
        <p className="admin-settings-card__hint">
          Shown in the navigation, footer, home page badge and contact page.
        </p>
        <div className="admin-settings-grid">
          <div className="admin-field">
            <label>Short status</label>
            <input type="text" placeholder="Open for briefs" {...field('status_short')} />
            <span className="admin-settings-where">Nav menu · home badge</span>
          </div>
          <div className="admin-field">
            <label>Long status</label>
            <input type="text" placeholder="Currently reading briefs for Summer 2026" {...field('status_long')} />
            <span className="admin-settings-where">Footer · contact page</span>
          </div>
          <div className="admin-field">
            <label>Location</label>
            <input type="text" placeholder="Bangalore" {...field('location')} />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="admin-settings-card">
        <h2 className="admin-settings-card__title">Contact</h2>
        <p className="admin-settings-card__hint">Email addresses and studio details.</p>
        <div className="admin-settings-grid">
          <div className="admin-field">
            <label>General email</label>
            <input type="email" {...field('email_general')} />
          </div>
          <div className="admin-field">
            <label>Press email</label>
            <input type="email" {...field('email_press')} />
          </div>
          <div className="admin-field">
            <label>Anurag&apos;s email</label>
            <input type="email" {...field('email_anurag')} />
          </div>
          <div className="admin-field">
            <label>Tina&apos;s email</label>
            <input type="email" {...field('email_tina')} />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Studio address</label>
            <input type="text" {...field('studio_address')} />
          </div>
          <div className="admin-field admin-field--wide">
            <label>Hours</label>
            <input type="text" {...field('studio_hours')} />
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="admin-settings-card">
        <h2 className="admin-settings-card__title">Social links</h2>
        <p className="admin-settings-card__hint">
          Full URLs. Leave a field empty to hide that link everywhere.
        </p>
        <div className="admin-settings-grid">
          <div className="admin-field">
            <label>Instagram</label>
            <input type="url" placeholder="https://instagram.com/…" {...field('social_instagram')} />
          </div>
          <div className="admin-field">
            <label>LinkedIn</label>
            <input type="url" placeholder="https://linkedin.com/company/…" {...field('social_linkedin')} />
          </div>
          <div className="admin-field">
            <label>Behance</label>
            <input type="url" placeholder="https://behance.net/…" {...field('social_behance')} />
          </div>
          <div className="admin-field">
            <label>Medium</label>
            <input type="url" placeholder="https://medium.com/@…" {...field('social_medium')} />
          </div>
        </div>
      </section>
    </div>
  )
}
