'use client'

import { useRouter } from 'next/navigation'
import type { Submission } from '@/lib/submissions'
import {
  type FormField,
  type FormCategory,
  FIELD_TYPE_ICON_NAMES,
  FORM_CATEGORY_LABELS,
  formatAnswerForDisplay,
} from '@/lib/forms'
import Icon from '@/components/Icon'
import { Checkbox } from '@/components/admin/list/ListControls'

interface Props {
  responses: Submission[]
  /** A specific form's fields → one column per field. Empty = generic mode. */
  fields: FormField[]
  picked: Set<string>
  allPicked: boolean
  onToggle: (id: string) => void
  onToggleAll: () => void
  jobsById: Record<string, string>
  formTitleById: Record<string, string>
  showJob: boolean
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function catLabel(c: string) {
  return FORM_CATEGORY_LABELS[c as FormCategory] ?? c
}

export default function ResponsesTable({
  responses, fields, picked, allPicked, onToggle, onToggleAll, jobsById, formTitleById, showJob,
}: Props) {
  const router = useRouter()
  const generic = fields.length === 0

  return (
    <div className="admin-resp-table-wrap">
      <table className="admin-resp-table">
        <thead>
          <tr>
            <th className="admin-resp-table__check" onClick={e => e.stopPropagation()}>
              <Checkbox checked={allPicked} onChange={onToggleAll} label="Select all" />
            </th>
            <th className="admin-resp-table__datecol">Submitted</th>
            {showJob && <th>Job</th>}
            {generic ? (
              <>
                <th>Type</th>
                <th>Name</th>
                <th>Email</th>
                <th>Form</th>
                <th>Subject</th>
              </>
            ) : (
              fields.map(f => (
                <th key={f.id}>
                  <Icon name={FIELD_TYPE_ICON_NAMES[f.type]} size={13} style={{ verticalAlign: '-2px', marginRight: 5, opacity: 0.5 }} />
                  {f.label}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {responses.map(s => {
            const r = (s.responses ?? {}) as Record<string, unknown>
            return (
              <tr
                key={s.id}
                className={`${!s.is_read ? 'is-unread' : ''} ${picked.has(s.id) ? 'is-selected' : ''}`}
                onClick={() => router.push(`/admin/inbox/${s.id}`)}
              >
                <td className="admin-resp-table__check" onClick={e => e.stopPropagation()}>
                  <Checkbox checked={picked.has(s.id)} onChange={() => onToggle(s.id)} label={`Select ${s.name || s.email}`} />
                </td>
                <td className="admin-resp-table__datecol">
                  {!s.is_read && <span className="admin-resp-table__unread" aria-label="Unread" />}
                  {fmtDate(s.created_at)}
                </td>
                {showJob && <td>{s.job_id ? (jobsById[s.job_id] ?? '—') : '—'}</td>}
                {generic ? (
                  <>
                    <td>{catLabel(s.type)}</td>
                    <td>{s.name || '—'}</td>
                    <td>{s.email || '—'}</td>
                    <td>{s.form_id ? (formTitleById[s.form_id] ?? '—') : '—'}</td>
                    <td title={s.subject ?? ''}>{s.subject || '—'}</td>
                  </>
                ) : (
                  fields.map(f => {
                    const val = formatAnswerForDisplay(f, r[f.id])
                    return <td key={f.id} title={val === '—' ? '' : val}>{val}</td>
                  })
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
