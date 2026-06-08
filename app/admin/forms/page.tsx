import { redirect } from 'next/navigation'
import { getAllForms, getFormResponseCount } from '@/lib/forms'
import type { Form } from '@/lib/forms'
import { createFormAction } from './actions'
import SystemFormsSetup from '@/components/admin/forms/SystemFormsSetup'
import FormsGrid, { type FormWithCount } from '@/components/admin/forms/FormsGrid'
import { SYSTEM_FORM_SEEDS } from '@/lib/forms-seed'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Forms — Afterthought CMS' }

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

  // Response counts for every form (for the cards + sort)
  const counts = await Promise.all(forms.map(f => getFormResponseCount(f.id).catch(() => 0)))
  const formsWithCounts: FormWithCount[] = forms.map((f, i) => ({ ...f, responseCount: counts[i] }))

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
        <FormsGrid forms={formsWithCounts} />
      )}
    </>
  )
}
