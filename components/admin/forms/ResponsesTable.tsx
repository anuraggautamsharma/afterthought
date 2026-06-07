'use client'

import { useState } from 'react'
import { type FormField, FIELD_TYPE_ICONS } from '@/lib/forms'

interface ResponseRow {
  id: string
  created_at: string
  name?: string | null
  email?: string | null
  responses?: Record<string, unknown>
}

interface Props {
  fields: FormField[]
  responses: ResponseRow[]
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

export default function ResponsesTable({ fields, responses }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const previewFields = fields.slice(0, 4)

  return (
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
                  onClick={() => setExpandedId(prev => (prev === response.id ? null : response.id))}
                >
                  <td>
                    <span title={new Date(response.created_at).toLocaleString()} style={{ fontSize: 13 }}>
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
                      <span style={{ fontSize: 13, color: 'var(--c-ink)' }}>{formatValue(answers[f.id])}</span>
                    </td>
                  ))}
                  <td style={{ textAlign: 'center', color: 'var(--c-ink-muted)', fontSize: 12 }}>
                    {isExpanded ? '▲' : '▾'}
                  </td>
                </tr>

                {isExpanded && (
                  <tr key={`${response.id}-detail`}>
                    <td colSpan={previewFields.length + 3} style={{ padding: 0 }}>
                      <div className="admin-response-detail">
                        <div
                          style={{
                            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                            letterSpacing: '.07em', color: 'var(--c-ink-muted)', marginBottom: 12,
                          }}
                        >
                          All answers · Submitted {new Date(response.created_at).toLocaleString()}
                        </div>
                        <div className="admin-response-detail__grid">
                          {fields.map(f => (
                            <div key={f.id} className="admin-response-field">
                              <div className="admin-response-field__label">
                                <span style={{ marginRight: 5 }}>{FIELD_TYPE_ICONS[f.type]}</span>
                                {f.label}
                              </div>
                              <div className="admin-response-field__value">{formatValue(answers[f.id])}</div>
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
  )
}
