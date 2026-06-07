import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAllForms, getFormResponseCount } from '@/lib/forms'
import type { Form } from '@/lib/forms'
import { createFormAction } from './actions'
import SystemFormsSetup from '@/components/admin/forms/SystemFormsSetup'
import ShareFormButton from '@/components/admin/forms/ShareFormButton'
import { SYSTEM_FORM_SEEDS } from '@/lib/forms-seed'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Forms — Afterthought CMS' }

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

async function FormCard({ form }: { form: Form }) {
  let responseCount = 0
  try {
    responseCount = await getFormResponseCount(form.id)
  } catch {}

  return (
    <div className="admin-form-card">
      <div className="admin-form-card__header">
        <h3 className="admin-form-card__title">
          <Link href={`/admin/forms/${form.id}/edit`} className="admin-form-card__title-link">
            {form.title || 'Untitled form'}
          </Link>
        </h3>
        <span className={`admin-status-badge admin-status-badge--${form.status}`}>
          <span className="admin-status-badge__dot" />
          {form.status}
        </span>
      </div>

      {form.description && (
        <p className="admin-form-card__desc">{form.description}</p>
      )}

      <div className="admin-form-card__meta">
        <span className="admin-form-card__slug">/{form.slug}</span>
        <span className="admin-form-card__sep" />
        <span className="admin-form-card__responses">
          {responseCount} response{responseCount !== 1 ? 's' : ''}
        </span>
        <span className="admin-form-card__sep" />
        <span className="admin-form-card__date">
          Created {formatDate(form.created_at)}
        </span>
      </div>

      <div className="admin-form-card__actions">
        <Link
          href={`/admin/forms/${form.id}/edit`}
          className="admin-btn-ghost"
        >
          Edit
        </Link>
        <Link
          href={`/admin/inbox?form=${form.id}`}
          className="admin-btn-ghost"
        >
          Responses
        </Link>
        <Link
          href={`/admin/forms/${form.id}/settings`}
          className="admin-btn-ghost"
        >
          Settings
        </Link>
        <ShareFormButton formId={form.id} slug={form.slug} status={form.status} />
        {form.status === 'published' && (
          <Link
            href={`/forms/${form.slug}`}
            target="_blank"
            className="admin-btn-ghost"
          >
            View live ↗
          </Link>
        )}
      </div>
    </div>
  )
}

async function CreateFormButton() {
  async function handleCreate() {
    'use server'
    const { id } = await createFormAction()
    redirect(`/admin/forms/${id}/edit`)
  }

  return (
    <form action={handleCreate}>
      <button type="submit" className="admin-btn-primary admin-btn-primary--sm">
        + New form
      </button>
    </form>
  )
}

export default async function FormsPage() {
  let forms: Form[] = []
  let dbError: string | null = null

  try {
    forms = await getAllForms()
  } catch (e) {
    console.error('[admin/forms] getAllForms failed:', e)
    dbError = e instanceof Error ? e.message : String(e)
  }

  const published = forms.filter(f => f.status === 'published').length
  const drafts = forms.filter(f => f.status === 'draft').length

  // Which built-in (system) forms haven't been created yet?
  const existingRoles = new Set(forms.map(f => f.site_role).filter(Boolean))
  const missingSystem = SYSTEM_FORM_SEEDS
    .filter(s => s.site_role && !existingRoles.has(s.site_role))
    .map(s => s.title)

  return (
    <>
      {dbError && (
        <div className="admin-db-error">
          <strong>Database error:</strong> {dbError}
        </div>
      )}

      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Forms</h1>
          <p className="admin-page-subtitle">
            {published} published · {drafts} draft{drafts !== 1 ? 's' : ''}
          </p>
        </div>
        <CreateFormButton />
      </div>

      {!dbError && <SystemFormsSetup missing={missingSystem} />}

      {forms.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__title">No forms yet.</div>
          <p>Create your first form to start collecting responses.</p>
          <CreateFormButton />
        </div>
      ) : (
        <div className="admin-forms-grid">
          {forms.map(form => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      )}
    </>
  )
}
