import { getFormBySiteRole, getFormById, getSections, getFields, type SiteRole } from '@/lib/forms'
import FormRenderer from './FormRenderer'
import { submitFormAction } from '@/app/forms/[slug]/actions'

interface Props {
  /** Resolve the form by its built-in site slot… */
  role?: NonNullable<SiteRole>
  /** …or directly by form id (e.g. a job's dedicated application form). */
  formId?: string
  /** Hide the form's own title/description when the page already provides it. */
  hideHeader?: boolean
  /** Tag submissions with the job they came from (for shared application forms). */
  jobId?: string | null
}

/**
 * Renders a builder form inline within a site page — the Contact page, the
 * Freelance page, or a Job's apply section. Resolves the form by site_role or by
 * id and renders the themed FormRenderer. If the form isn't available, shows a
 * gentle fallback rather than breaking the page.
 */
export default async function EmbeddedForm({ role, formId, hideHeader, jobId }: Props) {
  const form = await (formId
    ? getFormById(formId)
    : role
      ? getFormBySiteRole(role)
      : Promise.resolve(null)
  ).catch(() => null)

  if (!form || form.status !== 'published') {
    return (
      <div className="form-embed form-embed--unavailable">
        <p style={{ fontSize: 14, color: 'rgba(0,0,0,.5)', lineHeight: 1.6 }}>
          This form isn’t available right now. Please email us directly and we’ll
          pick it up from there.
        </p>
      </div>
    )
  }

  const [sections, fields] = await Promise.all([
    getSections(form.id).catch(() => []),
    getFields(form.id).catch(() => []),
  ])

  return (
    <div className="form-embed">
      <FormRenderer
        form={form}
        sections={sections}
        fields={fields}
        onSubmit={submitFormAction}
        hideHeader={hideHeader}
        jobId={jobId}
      />
    </div>
  )
}
