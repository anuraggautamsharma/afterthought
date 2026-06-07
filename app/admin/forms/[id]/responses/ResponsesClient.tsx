'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type Form, type FormField, FIELD_TYPE_ICONS } from '@/lib/forms'
import { getFormCsvAction } from '@/app/admin/forms/actions'
import { toast } from '@/lib/toastStore'

interface Response {
  id: string
  created_at: string
  name?: string | null
  email?: string | null
  responses?: Record<string, unknown>
  [key: string]: unknown
}

interface Props {
  form: Form
  fields: FormField[]
  responses: Response[]
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function timeAgo(iso: string) {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function isToday(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
}

export default function ResponsesClient({ form, fields, responses }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const today = responses.filter(r => isToday(r.created_at)).length
  const previewFields = fields.slice(0, 4)

  async function handleExport() {
    setExporting(true)
    try {
      const csv = await getFormCsvAction(form.id)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${form.slug}-responses.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('CSV exported')
    } catch {
      toast.error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  function toggleRow(id: string) {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Link href="/admin/forms" style={{ fontSize: 13, color: 'var(--c-ink-muted)', textDecoration: 'none' }}>
            ← Forms
          </Link>
          <span style={{ opacity: 0.3 }}>/</span>
          <Link href={`/admin/forms/${form.id}/edit`}
            style={{ fontSize: 13, color: 'var(--c-ink-muted)', textDecoration: 'none' }}>
            {form.title}
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 className="admin-page-title">Responses</h1>
            <p style={{ fontSize: 13, color: 'var(--c-ink-muted)', marginTop: 2 }}>
              {responses.length} total response{responses.length !== 1 ? 's' : ''}
            </p>
          </div>
          {responses.length > 0 && (
            <button
              type="button"
              className="admin-btn-secondary"
              style={{ padding: '9px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? 'Exporting…' : '↓ Export CSV'}
            </button>
          )}
        </div>
      </div>

      <div className="admin-page-body">

        {/* Stats */}
        {responses.length > 0 && (
          <div className="admin-responses-stats">
            <div className="admin-response-stat">
              <span className="admin-response-stat__num">{responses.length}</span>
              <span className="admin-response-stat__label">Total responses</span>
            </div>
            <div className="admin-response-stat">
              <span className="admin-response-stat__num">{today}</span>
              <span className="admin-response-stat__label">Today</span>
            </div>
            <div className="admin-response-stat">
              <span className="admin-response-stat__num">{fields.length}</span>
              <span className="admin-response-stat__label">Questions</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {responses.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 24px', textAlign: 'center', gap: 16,
          }}>
            <div style={{ fontSize: 48, opacity: 0.15 }}>📋</div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--c-ink)', marginBottom: 6 }}>
                No responses yet
              </p>
              <p style={{ fontSize: 14, color: 'var(--c-ink-muted)', maxWidth: 360 }}>
                Share your form to start collecting responses. They&apos;ll appear here.
              </p>
            </div>
            {form.status === 'published' && (
              <a
                href={`/forms/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn-secondary"
                style={{ textDecoration: 'none', padding: '9px 18px', fontSize: 13 }}
              >
                View form ↗
              </a>
            )}
          </div>
        )}

        {/* Table */}
        {responses.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-responses-table">
              <thead>
                <tr>
                  <th>Submitted</th>
                  <th>Name / Email</th>
                  {previewFields.map(f => (
                    <th key={f.id}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ opacity: 0.5 }}>{FIELD_TYPE_ICONS[f.type]}</span>
                        {f.label}
                      </span>
                    </th>
                  ))}
                  <th style={{ width: 32 }}></th>
                </tr>
              </thead>
              <tbody>
                {responses.map(response => {
                  const isExpanded = expandedId === response.id
                  const answers = (response.responses as Record<string, unknown>) ?? {}
                  return (
                    <>
                      <tr
                        key={response.id}
                        className={`admin-response-row${isExpanded ? ' admin-response-row--expanded' : ''}`}
                        onClick={() => toggleRow(response.id)}
                      >
                        <td>
                          <span title={new Date(response.created_at).toLocaleString()}
                            style={{ fontSize: 13 }}>
                            {timeAgo(response.created_at)}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>
                            {response.name || response.email || <span style={{ opacity: 0.4 }}>Anonymous</span>}
                          </div>
                          {response.name && response.email && (
                            <div style={{ fontSize: 11, color: 'var(--c-ink-muted)', marginTop: 1 }}>
                              {response.email}
                            </div>
                          )}
                        </td>
                        {previewFields.map(f => (
                          <td key={f.id}>
                            <span style={{ fontSize: 13, color: 'var(--c-ink)' }}>
                              {formatValue(answers[f.id])}
                            </span>
                          </td>
                        ))}
                        <td style={{ textAlign: 'center', color: 'var(--c-ink-muted)', fontSize: 12 }}>
                          {isExpanded ? '▲' : '▾'}
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <tr key={`${response.id}-detail`}>
                          <td colSpan={previewFields.length + 3} style={{ padding: 0 }}>
                            <div className="admin-response-detail">
                              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                                letterSpacing: '.07em', color: 'var(--c-ink-muted)', marginBottom: 12 }}>
                                All answers · Submitted {new Date(response.created_at).toLocaleString()}
                              </div>
                              <div className="admin-response-detail__grid">
                                {fields.map(f => (
                                  <div key={f.id} className="admin-response-field">
                                    <div className="admin-response-field__label">
                                      <span style={{ marginRight: 5 }}>{FIELD_TYPE_ICONS[f.type]}</span>
                                      {f.label}
                                    </div>
                                    <div className="admin-response-field__value">
                                      {formatValue(answers[f.id])}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}
