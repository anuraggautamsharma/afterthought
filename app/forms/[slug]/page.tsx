import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getFormBySlug, getSections, getFields } from '@/lib/forms'
import FormRenderer from '@/components/forms/FormRenderer'
import PasswordGate from './PasswordGate'
import { submitFormAction } from './actions'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const form = await getFormBySlug(slug)
  if (!form) return { title: 'Form not found' }
  return {
    title: form.title,
    robots: { index: false, follow: false },
  }
}

export default async function FormPage({ params }: Props) {
  const { slug } = await params
  const form = await getFormBySlug(slug)

  if (!form) return notFound()

  // Draft forms are 404
  if (form.status === 'draft') return notFound()

  const now = Date.now()

  // Not open yet
  if (form.open_at && now < new Date(form.open_at).getTime()) {
    return (
      <div className="form-page">
        <FormPageShell>
          <div className="form-status-screen">
            <h2>Not open yet</h2>
            <p>This form isn&apos;t accepting responses yet. Check back later.</p>
          </div>
        </FormPageShell>
      </div>
    )
  }

  // Closed by close_at
  if (form.close_at && now > new Date(form.close_at).getTime()) {
    return (
      <div className="form-page">
        <FormPageShell>
          <div className="form-status-screen">
            <h2>This form is closed</h2>
            <p>This form is no longer accepting responses.</p>
          </div>
        </FormPageShell>
      </div>
    )
  }

  // Explicitly closed
  if (form.status === 'closed') {
    return (
      <div className="form-page">
        <FormPageShell>
          <div className="form-status-screen">
            <h2>This form is closed</h2>
            <p>This form is no longer accepting responses.</p>
          </div>
        </FormPageShell>
      </div>
    )
  }

  const [sections, fields] = await Promise.all([
    getSections(form.id),
    getFields(form.id),
  ])

  const content = (
    <div className="form-page">
      <style>{`:root { --form-accent: ${form.theme_color || '#000000'} }`}</style>
      <FormPageShell headerImage={form.header_image} customFont={form.custom_font}>
        {form.header_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.header_image} alt="" className="form-header-image" />
        )}
        <FormRenderer
          form={form}
          sections={sections}
          fields={fields}
          onSubmit={submitFormAction}
        />
      </FormPageShell>
    </div>
  )

  if (form.password) {
    return (
      <div className="form-page">
        <style>{`:root { --form-accent: ${form.theme_color || '#000000'} }`}</style>
        <PasswordGate formId={form.id} correctPassword={form.password}>
          {content}
        </PasswordGate>
      </div>
    )
  }

  return content
}

function FormPageShell({
  children,
  headerImage,
  customFont,
}: {
  children: React.ReactNode
  headerImage?: string | null
  customFont?: string
}) {
  return (
    <div
      className="form-page-shell"
      style={customFont ? { fontFamily: customFont } : undefined}
    >
      <header className="form-page-header">
        <a href="/" className="form-brand-link">
          Afterthought
        </a>
      </header>
      <main className="form-page-main">
        {headerImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={headerImage} alt="" className="form-header-image" />
        )}
        {children}
      </main>
    </div>
  )
}
