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

      <div className="admin-skel-grid">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="admin-skel-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="admin-skel admin-skel--line" style={{ width: 180 }} />
              <span className="admin-skel admin-skel--badge" />
            </div>
            <span className="admin-skel admin-skel--line-sm" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span className="admin-skel admin-skel--line-xs" style={{ width: 60 }} />
              <span className="admin-skel admin-skel--line-xs" style={{ width: 72 }} />
              <span className="admin-skel admin-skel--line-xs" style={{ width: 80 }} />
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {[0, 1, 2].map(j => (
                <span key={j} className="admin-skel admin-skel--btn-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
