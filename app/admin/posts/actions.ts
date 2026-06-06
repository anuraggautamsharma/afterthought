'use server'

import { createPost, updatePost, deletePost, PostInput } from '@/lib/posts'
import { estimateReadTime, slugify } from '@/lib/slugify'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function savePostAction(id: string | null, data: PostInput): Promise<{ id?: string; error?: string }> {
  try {
    const content   = data.content ?? {}
    const readTime  = estimateReadTime(content)
    const slug      = data.slug?.trim() || slugify(data.title ?? '')
    const isPublish = data.status === 'published'

    const input: PostInput = {
      ...data,
      slug,
      read_time: readTime,
      published_at: isPublish && !data.published_at ? new Date().toISOString() : data.published_at,
    }

    if (id) {
      await updatePost(id, input)
      revalidatePath('/thinking')
      revalidatePath(`/thinking/${slug}`)
      return { id }
    } else {
      const post = await createPost(input)
      revalidatePath('/thinking')
      revalidatePath(`/thinking/${post.slug}`)
      return { id: post.id }
    }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deletePostAction(id: string) {
  try {
    await deletePost(id)
    revalidatePath('/thinking')
  } catch {
    // silently continue so we still redirect
  }
  redirect('/admin/posts')
}
