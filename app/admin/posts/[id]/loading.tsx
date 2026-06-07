export default function Loading() {
  return (
    <div>
      <div className="admin-skel-topbar">
        <div className="admin-skel-topbar__left">
          <span className="admin-skel admin-skel--btn-sm" style={{ width: 64 }} />
          <span className="admin-skel admin-skel--title" style={{ width: 240 }} />
          <span className="admin-skel admin-skel--badge" />
        </div>
        <div className="admin-skel-topbar__right">
          <span className="admin-skel admin-skel--line-xs" style={{ width: 80 }} />
          <span className="admin-skel admin-skel--btn" />
          <span className="admin-skel admin-skel--btn" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40 }}>
        <div className="admin-skel-fields">
          <div className="admin-skel-field">
            <span className="admin-skel admin-skel--label" />
            <span className="admin-skel admin-skel--input" />
          </div>
          <div className="admin-skel-field">
            <span className="admin-skel admin-skel--label" />
            <span className="admin-skel admin-skel--richtext" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="admin-skel-field">
              <span className="admin-skel admin-skel--label" />
              <span className="admin-skel admin-skel--input" />
            </div>
            <div className="admin-skel-field">
              <span className="admin-skel admin-skel--label" />
              <span className="admin-skel admin-skel--input" />
            </div>
          </div>
        </div>
        <div className="admin-skel-fields">
          <div className="admin-skel-card">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="admin-skel-field">
                <span className="admin-skel admin-skel--label" />
                <span className="admin-skel admin-skel--input" />
              </div>
            ))}
          </div>
          <div className="admin-skel-card">
            <span className="admin-skel admin-skel--label" />
            <span className="admin-skel admin-skel--image" />
          </div>
        </div>
      </div>
    </div>
  )
}
