'use client'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ padding: '48px', fontFamily: 'monospace', maxWidth: 760 }}>
      <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Admin error</h2>
      <pre style={{ background: '#fee2e2', padding: '16px', borderRadius: '8px', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#991b1b' }}>
        {error?.message ?? 'Unknown error'}
        {error?.digest ? `\n\ndigest: ${error.digest}` : ''}
      </pre>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button
          onClick={() => reset()}
          style={{ padding: '8px 16px', background: '#1A1916', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}
        >
          Try again
        </button>
        <a
          href="/admin/login"
          style={{ padding: '8px 16px', background: '#fff', color: '#1A1916', border: '1px solid #E0DDD6', borderRadius: 8, textDecoration: 'none', fontSize: 13 }}
        >
          Go to login
        </a>
      </div>
    </div>
  )
}
