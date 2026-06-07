export default function Loading() {
  return (
    <div>
      <div className="admin-skel-head">
        <div className="admin-skel-head__left">
          <span className="admin-skel admin-skel--btn-sm" style={{ width: 72, marginBottom: 8 }} />
          <span className="admin-skel admin-skel--title" />
          <span className="admin-skel admin-skel--subtitle" />
        </div>
        <span className="admin-skel admin-skel--btn" />
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E5E3DC', marginBottom: 28 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <span key={i} className="admin-skel admin-skel--btn-sm" style={{ borderRadius: 0, height: 38, width: 88, flexShrink: 0 }} />
        ))}
      </div>

      <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="admin-skel-field">
            <span className="admin-skel admin-skel--label" />
            <span className="admin-skel admin-skel--input" />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 16 }}>
          {[0, 1].map(i => (
            <div key={i} className="admin-skel-field" style={{ flex: 1 }}>
              <span className="admin-skel admin-skel--label" />
              <span className="admin-skel admin-skel--input" />
            </div>
          ))}
        </div>
        <span className="admin-skel admin-skel--btn" style={{ alignSelf: 'flex-start', marginTop: 8 }} />
      </div>
    </div>
  )
}
