export default function Loading() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '232px 1fr', gap: 28, alignItems: 'start' }}>
      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <span className="admin-skel" style={{ height: 34, borderRadius: 8 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px' }}>
              <span className="admin-skel admin-skel--line" style={{ width: 120 }} />
              <span className="admin-skel admin-skel--line-xs" style={{ width: 24 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div>
        <div className="admin-skel-head">
          <div className="admin-skel-head__left">
            <span className="admin-skel admin-skel--title" />
            <span className="admin-skel admin-skel--subtitle" />
          </div>
          <span className="admin-skel admin-skel--btn" />
        </div>
        <div className="admin-skel-table">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="admin-skel-trow">
              <span className="admin-skel" style={{ width: 8, height: 8, borderRadius: '50%' }} />
              <span className="admin-skel admin-skel--badge" />
              <span className="admin-skel admin-skel--line" style={{ width: 140 }} />
              <span className="admin-skel admin-skel--line" style={{ flex: 1 }} />
              <span className="admin-skel admin-skel--line-xs" style={{ width: 48 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
