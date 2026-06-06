import MediaLibrary from '@/components/admin/MediaLibrary'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Media — Afterthought CMS' }

export default function MediaPage() {
  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Media</h1>
          <p className="admin-page-subtitle">Upload and manage your images</p>
        </div>
      </div>
      <MediaLibrary />
    </div>
  )
}
