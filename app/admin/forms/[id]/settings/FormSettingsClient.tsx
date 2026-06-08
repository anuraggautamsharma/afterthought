'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { type Form } from '@/lib/forms'
import { updateFormAction, closeFormAction, deleteFormAction, publishFormAction } from '@/app/admin/forms/actions'
import SaveBar from '@/components/admin/SaveBar'
import { toast } from '@/lib/toastStore'
import { openConfirm } from '@/lib/confirmStore'

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="admin-fb-toggle-row" style={{ marginBottom: 8 }}>
      <span className="admin-fb-toggle-label">{label}</span>
      <label className="admin-fb-toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="admin-fb-toggle-slider" />
      </label>
    </div>
  )
}

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'behavior', label: 'Behavior' },
  { id: 'scheduling', label: 'Scheduling' },
  { id: 'design', label: 'Design' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'integration', label: 'Integration' },
  { id: 'access', label: 'Access' },
  { id: 'danger', label: 'Danger' },
]

export default function FormSettingsClient({ initialForm }: { initialForm: Form }) {
  const [form, setForm] = useState<Form>(initialForm)
  const [activeTab, setActiveTab] = useState('general')
  const [saveState, setSaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSave = useCallback((updated: Form) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveState('dirty')
    saveTimer.current = setTimeout(async () => {
      setSaveState('saving')
      try {
        await updateFormAction(updated.id, {
          title: updated.title,
          slug: updated.slug,
          description: updated.description,
          confirmation_type: updated.confirmation_type,
          confirmation_message: updated.confirmation_message,
          redirect_url: updated.redirect_url,
          submit_label: updated.submit_label,
          show_progress: updated.show_progress,
          show_question_numbers: updated.show_question_numbers,
          shuffle_questions: updated.shuffle_questions,
          open_at: updated.open_at,
          close_at: updated.close_at,
          response_limit: updated.response_limit,
          allow_edit_after_submit: updated.allow_edit_after_submit,
          limit_one_response: updated.limit_one_response,
          theme_color: updated.theme_color,
          header_image: updated.header_image,
          custom_font: updated.custom_font,
          notify_emails: updated.notify_emails,
          auto_respond: updated.auto_respond,
          auto_respond_field: updated.auto_respond_field,
          auto_respond_subject: updated.auto_respond_subject,
          auto_respond_body: updated.auto_respond_body,
          webhook_url: updated.webhook_url,
          password: updated.password,
          allowed_domains: updated.allowed_domains,
        })
        setSaveState('saved')
        setSavedAt(new Date())
        setTimeout(() => setSaveState('idle'), 3000)
      } catch {
        setSaveState('error')
        toast.error('Failed to save settings')
      }
    }, 800)
  }, [])

  function handleChange(field: keyof Form, value: unknown) {
    const updated = { ...form, [field]: value } as Form
    setForm(updated)
    debouncedSave(updated)
  }

  async function handlePublishToggle() {
    try {
      if (form.status === 'published') {
        await updateFormAction(form.id, { status: 'draft' })
        setForm(prev => ({ ...prev, status: 'draft' }))
        toast.success('Form set to draft')
      } else {
        await publishFormAction(form.id)
        setForm(prev => ({ ...prev, status: 'published' }))
        toast.success('Form published')
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  async function handleCloseForm() {
    const confirmed = await openConfirm({
      title: 'Close form?',
      message: 'This will stop accepting new responses.',
      confirmLabel: 'Close form',
      danger: true,
    })
    if (!confirmed) return
    try {
      await closeFormAction(form.id)
      setForm(prev => ({ ...prev, status: 'closed' }))
      toast.success('Form closed')
    } catch {
      toast.error('Failed to close form')
    }
  }

  async function handleDeleteForm() {
    const confirmed = await openConfirm({
      title: 'Delete form permanently?',
      message: 'This cannot be undone. All responses and fields will be deleted.',
      confirmLabel: 'Delete forever',
      danger: true,
    })
    if (!confirmed) return
    try {
      await deleteFormAction(form.id)
    } catch {
      toast.error('Failed to delete form')
    }
  }

  function copyToClipboard(text: string, label = 'Copied') {
    navigator.clipboard.writeText(text).then(() => toast.success(label))
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const publicUrl = `${origin}/forms/${form.slug}`
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0" style="border:none;border-radius:8px;"></iframe>`

  return (
    <div className="admin-form-settings">
      {/* Header */}
      <div style={{ padding: '20px 32px 0', borderBottom: '1px solid var(--c-border)', background: 'var(--c-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Link href="/admin/forms" style={{ fontSize: 13, color: 'var(--c-ink-muted)', textDecoration: 'none' }}>
            ← Forms
          </Link>
          <span style={{ opacity: 0.3, fontSize: 13 }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--c-ink)' }}>{form.title}</span>
          <span className={`admin-status-badge admin-status-badge--${form.status}`}>{form.status}</span>
          <button
            type="button"
            onClick={handlePublishToggle}
            className={form.status === 'published' ? 'admin-btn-secondary' : 'admin-btn-primary'}
            style={{ padding: '5px 14px', fontSize: 13, width: 'auto', marginLeft: 8 }}
          >
            {form.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          {form.status === 'published' && (
            <a
              href={`/forms/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--c-ink-muted)', textDecoration: 'none' }}
            >
              View live ↗
            </a>
          )}
        </div>
        <h1 className="admin-page-title" style={{ marginBottom: 16 }}>Form settings</h1>

        <div className="admin-form-settings-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`admin-form-settings-tab${activeTab === tab.id ? ' admin-form-settings-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <SaveBar state={saveState} savedAt={savedAt} />

      <div style={{ padding: '28px 32px' }}>

        {/* ── General ─────────────────────────────────────── */}
        {activeTab === 'general' && (
          <div className="admin-form-settings-panel">
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Basic info</div>
              <div className="admin-field">
                <label className="admin-label">Title</label>
                <input className="admin-input" type="text" value={form.title}
                  onChange={e => handleChange('title', e.target.value)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Slug</label>
                <input className="admin-input" type="text" value={form.slug}
                  onChange={e => handleChange('slug', e.target.value)} />
                <p className="admin-field__hint">Public URL: /forms/{form.slug}</p>
              </div>
              <div className="admin-field">
                <label className="admin-label">Description</label>
                <textarea className="admin-input admin-input--textarea" rows={3}
                  value={form.description || ''}
                  onChange={e => handleChange('description', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── Behavior ─────────────────────────────────────── */}
        {activeTab === 'behavior' && (
          <div className="admin-form-settings-panel">
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">After submission</div>
              <div className="admin-field">
                <label className="admin-label">Confirmation type</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                    <input type="radio" name="conf_type" value="message"
                      checked={form.confirmation_type === 'message'}
                      onChange={() => handleChange('confirmation_type', 'message')} />
                    Show a message
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                    <input type="radio" name="conf_type" value="redirect"
                      checked={form.confirmation_type === 'redirect'}
                      onChange={() => handleChange('confirmation_type', 'redirect')} />
                    Redirect to URL
                  </label>
                </div>
              </div>
              {form.confirmation_type === 'message' && (
                <div className="admin-field">
                  <label className="admin-label">Confirmation message</label>
                  <textarea className="admin-input admin-input--textarea" rows={3}
                    value={form.confirmation_message || ''}
                    onChange={e => handleChange('confirmation_message', e.target.value)} />
                </div>
              )}
              {form.confirmation_type === 'redirect' && (
                <div className="admin-field">
                  <label className="admin-label">Redirect URL</label>
                  <input className="admin-input" type="text" placeholder="https://example.com/thanks"
                    value={form.redirect_url || ''}
                    onChange={e => handleChange('redirect_url', e.target.value)} />
                </div>
              )}
            </div>
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Submit button</div>
              <div className="admin-field">
                <label className="admin-label">Button label</label>
                <input className="admin-input" type="text" placeholder="Submit"
                  value={form.submit_label || ''}
                  onChange={e => handleChange('submit_label', e.target.value)} />
              </div>
            </div>
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Display</div>
              <Toggle label="Show progress bar" checked={form.show_progress}
                onChange={v => handleChange('show_progress', v)} />
              <Toggle label="Show question numbers" checked={form.show_question_numbers}
                onChange={v => handleChange('show_question_numbers', v)} />
              <Toggle label="Shuffle questions" checked={form.shuffle_questions}
                onChange={v => handleChange('shuffle_questions', v)} />
            </div>
          </div>
        )}

        {/* ── Scheduling ─────────────────────────────────── */}
        {activeTab === 'scheduling' && (
          <div className="admin-form-settings-panel">
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Open window</div>
              <div className="admin-field">
                <label className="admin-label">Open at</label>
                <input className="admin-input" type="datetime-local"
                  value={form.open_at ? form.open_at.slice(0, 16) : ''}
                  onChange={e => handleChange('open_at', e.target.value ? new Date(e.target.value).toISOString() : null)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Close at</label>
                <input className="admin-input" type="datetime-local"
                  value={form.close_at ? form.close_at.slice(0, 16) : ''}
                  onChange={e => handleChange('close_at', e.target.value ? new Date(e.target.value).toISOString() : null)} />
              </div>
            </div>
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Limits</div>
              <div className="admin-field">
                <label className="admin-label">Maximum responses</label>
                <input className="admin-input" type="number" min={1} placeholder="Unlimited"
                  value={form.response_limit ?? ''}
                  onChange={e => handleChange('response_limit', e.target.value ? parseInt(e.target.value) : null)} />
              </div>
              <Toggle label="Limit to one response per user" checked={form.limit_one_response}
                onChange={v => handleChange('limit_one_response', v)} />
              <Toggle label="Allow edit after submit" checked={form.allow_edit_after_submit}
                onChange={v => handleChange('allow_edit_after_submit', v)} />
            </div>
          </div>
        )}

        {/* ── Design ──────────────────────────────────────── */}
        {activeTab === 'design' && (
          <div className="admin-form-settings-panel">
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Appearance</div>
              <div className="admin-field">
                <label className="admin-label">Theme color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="color"
                    value={form.theme_color || '#111111'}
                    onChange={e => handleChange('theme_color', e.target.value)}
                    style={{ width: 44, height: 36, border: '1px solid var(--c-border)', borderRadius: 6, padding: 2, cursor: 'pointer', flexShrink: 0 }} />
                  <input className="admin-input" type="text"
                    value={form.theme_color || '#111111'}
                    onChange={e => handleChange('theme_color', e.target.value)}
                    style={{ maxWidth: 120 }} />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Header image URL</label>
                <input className="admin-input" type="text" placeholder="https://..."
                  value={form.header_image || ''}
                  onChange={e => handleChange('header_image', e.target.value || null)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Custom font</label>
                <select className="admin-input"
                  value={form.custom_font || 'Inter'}
                  onChange={e => handleChange('custom_font', e.target.value)}>
                  <option value="Inter">Inter</option>
                  <option value="Instrument Serif">Instrument Serif</option>
                  <option value="JetBrains Mono">JetBrains Mono</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Notifications ───────────────────────────────── */}
        {activeTab === 'notifications' && (
          <div className="admin-form-settings-panel">
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Email alerts</div>
              <div className="admin-field">
                <label className="admin-label">Notify these emails on each submission</label>
                <textarea className="admin-input admin-input--textarea" rows={4}
                  placeholder={'one@example.com\ntwo@example.com'}
                  value={Array.isArray(form.notify_emails) ? form.notify_emails.join('\n') : ''}
                  onChange={e => handleChange('notify_emails', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))} />
                <p className="admin-field__hint">One email address per line</p>
              </div>
            </div>
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Auto-response</div>
              <Toggle label="Send auto-response to submitter"
                checked={form.auto_respond}
                onChange={v => handleChange('auto_respond', v)} />
              {form.auto_respond && (
                <>
                  <div className="admin-field">
                    <label className="admin-label">Email field ID</label>
                    <input className="admin-input" type="text"
                      placeholder="Field ID of the email question"
                      value={form.auto_respond_field || ''}
                      onChange={e => handleChange('auto_respond_field', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Subject</label>
                    <input className="admin-input" type="text"
                      placeholder="Thanks for your submission"
                      value={form.auto_respond_subject || ''}
                      onChange={e => handleChange('auto_respond_subject', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Body</label>
                    <textarea className="admin-input admin-input--textarea" rows={5}
                      value={form.auto_respond_body || ''}
                      onChange={e => handleChange('auto_respond_body', e.target.value)} />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Integration ─────────────────────────────────── */}
        {activeTab === 'integration' && (
          <div className="admin-form-settings-panel">
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Webhook</div>
              <div className="admin-field">
                <label className="admin-label">Webhook URL</label>
                <input className="admin-input" type="text"
                  placeholder="https://hooks.example.com/..."
                  value={form.webhook_url || ''}
                  onChange={e => handleChange('webhook_url', e.target.value)} />
                <p className="admin-field__hint">Receives a POST request with each new response as JSON</p>
              </div>
            </div>
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Public URL</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="admin-input" type="text" readOnly
                  value={publicUrl}
                  style={{ flex: 1, background: 'var(--c-hover)', color: 'var(--c-ink-muted)', fontSize: 13, fontFamily: 'var(--font-mono)' }} />
                <button type="button" className="admin-btn-secondary"
                  style={{ flexShrink: 0, padding: '8px 14px', fontSize: 13 }}
                  onClick={() => copyToClipboard(publicUrl, 'URL copied!')}>
                  Copy
                </button>
              </div>
            </div>
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Embed code</div>
              <textarea className="admin-input admin-input--textarea" readOnly rows={4}
                value={embedCode}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--c-hover)', color: 'var(--c-ink-muted)' }} />
              <button type="button" className="admin-btn-secondary"
                style={{ alignSelf: 'flex-start', padding: '8px 14px', fontSize: 13, marginTop: 6 }}
                onClick={() => copyToClipboard(embedCode, 'Embed code copied!')}>
                Copy embed code
              </button>
            </div>
          </div>
        )}

        {/* ── Access ──────────────────────────────────────── */}
        {activeTab === 'access' && (
          <div className="admin-form-settings-panel">
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Password protection</div>
              <div className="admin-field">
                <label className="admin-label">Password</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="admin-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Leave empty for no password"
                    value={form.password || ''}
                    onChange={e => handleChange('password', e.target.value)}
                    style={{ flex: 1 }} />
                  <button type="button" className="admin-btn-secondary"
                    style={{ flexShrink: 0, padding: '8px 12px', fontSize: 12 }}
                    onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Domain restriction</div>
              <div className="admin-field">
                <label className="admin-label">Allowed domains</label>
                <textarea className="admin-input admin-input--textarea" rows={4}
                  placeholder={'example.com\npartner.org'}
                  value={Array.isArray(form.allowed_domains) ? form.allowed_domains.join('\n') : ''}
                  onChange={e => handleChange('allowed_domains', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))} />
                <p className="admin-field__hint">One domain per line. Leave empty to allow all.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Danger ──────────────────────────────────────── */}
        {activeTab === 'danger' && (
          <div className="admin-form-settings-panel">
            <div className="admin-form-settings-group">
              <div className="admin-form-settings-group__title">Close form</div>
              <p style={{ fontSize: 13, color: 'var(--c-ink-muted)', marginBottom: 14, lineHeight: 1.5 }}>
                Closing the form stops accepting new responses. The form URL stays accessible but shows a closed state.
              </p>
              <button type="button" className="admin-btn-secondary"
                disabled={form.status === 'closed'}
                onClick={handleCloseForm}
                style={{ padding: '9px 18px', fontSize: 13 }}>
                {form.status === 'closed' ? 'Form is already closed' : 'Close form'}
              </button>
            </div>
            <div className="admin-form-settings-group" style={{ borderTop: '1px solid var(--c-border)', paddingTop: 24 }}>
              <div className="admin-form-settings-group__title" style={{ color: '#dc2626' }}>
                Delete form
              </div>
              <p style={{ fontSize: 13, color: 'var(--c-ink-muted)', marginBottom: 14, lineHeight: 1.5 }}>
                Permanently deletes this form, all its fields, and all responses. This cannot be undone.
              </p>
              <button type="button" onClick={handleDeleteForm}
                style={{
                  padding: '9px 18px', fontSize: 13,
                  background: '#dc2626', color: '#fff',
                  border: 'none', borderRadius: 6,
                  cursor: 'pointer', fontFamily: 'inherit',
                  fontWeight: 500,
                }}>
                Delete form permanently
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
