export default function Loading() {
  return (
    <div>
      <div className="admin-skel-topbar">
        <div className="admin-skel-topbar__left">
          <span className="admin-skel admin-skel--btn-sm" style={{ width: 60 }} />
          <span className="admin-skel admin-skel--title" style={{ width: 200 }} />
        </div>
        <div className="admin-skel-topbar__right">
          <span className="admin-skel admin-skel--line-xs" style={{ width: 72 }} />
          <span className="admin-skel admin-skel--btn" />
          <span className="admin-skel admin-skel--btn" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 40 }}>
        <div className="admin-skel-fields">
          {[0, 1, 2].map(i => (
            <div key={i} className="admin-skel-field">
              <span className="admin-skel admin-skel--label" />
              <span className="admin-skel admin-skel--input" />
            </div>
          ))}
          <div className="admin-skel-field">
            <span className="admin-skel admin-skel--label" />
            <span className="admin-skel admin-skel--textarea" />
          </div>
          <div className="admin-skel-field">
            <span className="admin-skel admin-skel--label" />
            <span className="admin-skel admin-skel--richtext" style={{ height: 200 }} />
          </div>
        </div>
        <div className="admin-skel-fields">
          <div className="admin-skel-card" style={{ alignItems: 'center', gap: 16 }}>
            <span className="admin-skel" style={{ width: 80, height: 80, borderRadius: '50%' }} />
            <span className="admin-skel admin-skel--line" style={{ width: 160 }} />
            <span className="admin-skel admin-skel--btn" style={{ width: '100%' }} />
          </div>
          <div className="admin-skel-card">
            {[0, 1].map(i => (
              <div key={i} className="admin-skel-field">
                <span className="admin-skel admin-skel--label" />
                <span className="admin-skel admin-skel--input" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
