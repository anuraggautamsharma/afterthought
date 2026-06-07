export default function Loading() {
  return (
    <div>
      <div className="admin-skel-topbar">
        <div className="admin-skel-topbar__left">
          <span className="admin-skel admin-skel--btn-sm" style={{ width: 72 }} />
          <span className="admin-skel admin-skel--title" style={{ width: 220 }} />
          <span className="admin-skel admin-skel--badge" />
        </div>
        <div className="admin-skel-topbar__right">
          <span className="admin-skel admin-skel--btn" />
          <span className="admin-skel admin-skel--btn" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[180, 100, 120, 80, 160, 140].map((w, i) => (
            <div key={i} className="admin-skel-field">
              <span className="admin-skel admin-skel--label" style={{ width: w * 0.5 }} />
              <span className="admin-skel admin-skel--input" />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="admin-skel-card">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="admin-skel-field">
                <span className="admin-skel admin-skel--label" />
                <span className="admin-skel admin-skel--line" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
