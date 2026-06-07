export default function Loading() {
  return (
    <div>
      <div className="admin-skel-head">
        <div className="admin-skel-head__left">
          <span className="admin-skel admin-skel--title" />
          <span className="admin-skel admin-skel--subtitle" />
        </div>
        <span className="admin-skel admin-skel--btn" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="admin-skel" style={{ width: '100%', aspectRatio: '4/3', borderRadius: 8 }} />
            <span className="admin-skel admin-skel--line-sm" />
            <span className="admin-skel admin-skel--line-xs" />
          </div>
        ))}
      </div>
    </div>
  )
}
