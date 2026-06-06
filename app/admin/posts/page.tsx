import { getAllPosts } from '@/lib/posts'
import PostsList from '@/components/admin/PostsList'

export const dynamic = 'force-dynamic'

export default async function PostsPage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = []
  let dbError: string | null = null

  try {
    posts = await getAllPosts()
  } catch (e) {
    console.error('[admin/posts] getAllPosts failed:', e)
    dbError = e instanceof Error ? e.message : String(e)
  }

  return (
    <>
      {dbError && (
        <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '13px', color: '#991b1b' }}>
          <strong>Database error:</strong> {dbError}
        </div>
      )}
      <PostsList posts={posts} />
    </>
  )
}
