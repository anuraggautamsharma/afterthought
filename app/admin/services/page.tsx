import { getServices } from '@/lib/services'
import ServicesList from '@/components/admin/ServicesList'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Services — Afterthought CMS' }

export default async function AdminServicesPage() {
  let services: Awaited<ReturnType<typeof getServices>> = []
  let dbError: string | null = null
  try {
    services = await getServices()
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e)
  }

  return (
    <>
      {dbError && (
        <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '13px', color: '#991b1b' }}>
          <strong>Database error:</strong> {dbError}
        </div>
      )}
      <ServicesList services={services} />
    </>
  )
}
