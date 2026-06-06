import { getPostById } from '@/lib/posts'
import { notFound } from 'next/navigation'
import PostForm from '@/components/admin/PostForm'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post   = await getPostById(id)
  if (!post) notFound()

  return <PostForm post={post} />
}
