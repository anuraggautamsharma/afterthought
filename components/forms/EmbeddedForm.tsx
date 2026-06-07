import { getFormBySiteRole, getSections, getFields, type SiteRole } from '@/lib/forms'
import FormRenderer from './FormRenderer'
import { submitFormAction } from '@/app/forms/[slug]/actions'

interface Props {
  role: NonNullable<SiteRole>
  /** Hide the form's own title/description when the page already provides it. */
  hideHeader?: boolean
}

/**
 * Renders a built-in (site_role) form inline within a site page — the Contact
 * page, the Freelance page, etc. Pulls the form assigned to the given role and
 * renders the themed FormRenderer. If the form hasn't been set up yet, shows a
 * gentle fallback rather than breaking the page.
 */
export default async function EmbeddedForm({ role, hideHeader }: Props) {
  const form = await getFormBySiteRole(role).catch(() => null)

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
      />
    </div>
  )
}
