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

      <div className="admin-skel-table">
        <div className="admin-skel-thead">
          <span className="admin-skel admin-skel--label" style={{ width: 200 }} />
          <span className="admin-skel admin-skel--label" style={{ width: 120 }} />
          <span className="admin-skel admin-skel--label" style={{ flex: 1 }} />
          <span className="admin-skel admin-skel--label" style={{ width: 80 }} />
          <span className="admin-skel admin-skel--label" style={{ width: 80 }} />
        </div>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="admin-skel-trow">
            <span className="admin-skel admin-skel--line" style={{ width: 200 }} />
            <span className="admin-skel admin-skel--badge" />
            <span className="admin-skel admin-skel--line" style={{ flex: 1 }} />
            <span className="admin-skel admin-skel--line-xs" style={{ width: 72 }} />
            <span className="admin-skel admin-skel--btn-sm" />
          </div>
        ))}
      </div>
    </div>
  )
}
