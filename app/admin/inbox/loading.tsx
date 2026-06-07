export default function Loading() {
  return (
    <div>
      <div className="admin-skel-head">
        <div className="admin-skel-head__left">
          <span className="admin-skel admin-skel--title" />
          <span className="admin-skel admin-skel--subtitle" />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="admin-skel admin-skel--btn" />
          <span className="admin-skel admin-skel--btn" />
        </div>
      </div>

      <div className="admin-skel-table">
        <div className="admin-skel-thead">
          <span className="admin-skel admin-skel--label" style={{ width: 16 }} />
          <span className="admin-skel admin-skel--label" style={{ width: 140 }} />
          <span className="admin-skel admin-skel--label" style={{ width: 80 }} />
          <span className="admin-skel admin-skel--label" style={{ flex: 1 }} />
          <span className="admin-skel admin-skel--label" style={{ width: 70 }} />
          <span className="admin-skel admin-skel--label" style={{ width: 60 }} />
        </div>
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="admin-skel-trow">
            <span className="admin-skel" style={{ width: 8, height: 8, borderRadius: '50%' }} />
            <span className="admin-skel admin-skel--thumb" />
            <span className="admin-skel admin-skel--line" style={{ width: 160 }} />
            <span className="admin-skel admin-skel--badge" />
            <span className="admin-skel admin-skel--line" style={{ flex: 1 }} />
            <span className="admin-skel admin-skel--line-xs" style={{ width: 56 }} />
            <span className="admin-skel admin-skel--btn-sm" />
          </div>
        ))}
      </div>
    </div>
  )
}
