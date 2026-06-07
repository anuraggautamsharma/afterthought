export default function Loading() {
  return (
    <div>
      <div className="admin-skel-head">
        <div className="admin-skel-head__left">
          <span className="admin-skel admin-skel--title" />
          <span className="admin-skel admin-skel--subtitle" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="admin-skel-card" style={{ gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="admin-skel admin-skel--line-sm" style={{ width: 120 }} />
              <span className="admin-skel admin-skel--btn-sm" />
            </div>
            {[0, 1, 2, 3, 4].map(j => (
              <div key={j} className="admin-skel-trow" style={{ padding: '9px 0' }}>
                <span className="admin-skel admin-skel--badge" style={{ width: 52 }} />
                <span className="admin-skel admin-skel--line" style={{ flex: 1 }} />
                <span className="admin-skel admin-skel--line-xs" style={{ width: 48 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
