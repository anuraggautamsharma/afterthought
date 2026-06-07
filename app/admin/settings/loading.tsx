export default function Loading() {
  return (
    <div>
      <div className="admin-skel-head">
        <div className="admin-skel-head__left">
          <span className="admin-skel admin-skel--title" />
          <span className="admin-skel admin-skel--subtitle" />
        </div>
      </div>

      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 32 }}>
        {[0, 1, 2].map(section => (
          <div key={section} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span className="admin-skel admin-skel--line-sm" style={{ width: 120 }} />
            {[0, 1, 2].map(i => (
              <div key={i} className="admin-skel-field">
                <span className="admin-skel admin-skel--label" />
                <span className="admin-skel admin-skel--input" />
              </div>
            ))}
            <span className="admin-skel" style={{ height: 1, width: '100%', borderRadius: 0, opacity: 0.5 }} />
          </div>
        ))}
        <span className="admin-skel admin-skel--btn" style={{ alignSelf: 'flex-start' }} />
      </div>
    </div>
  )
}
