import PostForm from '@/components/admin/PostForm'

export const metadata = { title: 'New post — Afterthought CMS' }

export default function NewPostPage() {
  return <PostForm post={null} />
}
