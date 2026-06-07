export default function Loading() {
  return (
    <div className="admin-form-builder">
      {/* Topbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px 0 20px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E3DC',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="admin-skel admin-skel--btn-sm" style={{ width: 64 }} />
          <span className="admin-skel admin-skel--line" style={{ width: 180 }} />
          <span className="admin-skel admin-skel--badge" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="admin-skel admin-skel--line-xs" style={{ width: 80 }} />
          <span className="admin-skel admin-skel--btn" />
          <span className="admin-skel admin-skel--btn" />
        </div>
      </div>

      {/* 3-panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr 320px',
        overflow: 'hidden',
        height: '100%',
      }}>
        {/* Left: palette */}
        <div style={{ borderRight: '1px solid #E5E3DC', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, background: '#FAFAF9' }}>
          <span className="admin-skel admin-skel--label" style={{ marginBottom: 12 }} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 4px' }}>
              <span className="admin-skel" style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0 }} />
              <span className="admin-skel admin-skel--line-sm" />
            </div>
          ))}
        </div>

        {/* Center: canvas */}
        <div style={{ background: '#F5F4F0', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, overflow: 'hidden' }}>
          <div style={{ width: '100%', maxWidth: 640, background: '#FFFFFF', borderRadius: 12, padding: '28px 32px 24px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span className="admin-skel admin-skel--title" style={{ width: 260 }} />
            <span className="admin-skel admin-skel--line-sm" style={{ width: 200 }} />
            <div style={{ height: 1, background: '#E5E3DC', margin: '4px 0' }} />
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1.5px solid #E5E3DC', borderRadius: 8 }}>
                <span className="admin-skel" style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0 }} />
                <span className="admin-skel admin-skel--line" style={{ flex: 1 }} />
                <span className="admin-skel admin-skel--badge" style={{ width: 52 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: settings */}
        <div style={{ borderLeft: '1px solid #E5E3DC', background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 }}>
          <span className="admin-skel" style={{ width: 40, height: 40, borderRadius: 8 }} />
          <span className="admin-skel admin-skel--line-sm" style={{ width: 160 }} />
          <span className="admin-skel admin-skel--line-xs" style={{ width: 120 }} />
        </div>
      </div>
    </div>
  )
}
