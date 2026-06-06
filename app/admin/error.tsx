'use client'

export default function AdminError({ error }: { error: Error }) {
  return (
    <div style={{ padding: '48px', fontFamily: 'monospace' }}>
      <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Admin error</h2>
      <pre style={{ background: '#fee2e2', padding: '16px', borderRadius: '8px', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#991b1b' }}>
        {error?.message ?? 'Unknown error'}
        {'\n\n'}
        {error?.stack ?? ''}
      </pre>
    </div>
  )
}
