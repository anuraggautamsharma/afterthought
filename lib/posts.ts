import { supabase } from './supabase'

export interface Faq {
  q: string
  a: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: object
  cover_image: string | null
  category: string
  author: string
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  updated_at: string
  meta_title: string | null
  meta_description: string | null
  og_image: string | null
  focus_keyword: string | null
  read_time: number
  // Controls how the contained cover image is cropped.
  cover_focal?: 'top' | 'center' | 'bottom' | null
  // FAQ accordion shown at the end of the post (+ FAQPage structured data).
  faqs?: Faq[] | null
}

export type PostInput = Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>

/** Maps a cover focal point to a CSS object-position value. */
export function focalToPosition(focal?: string | null): string {
  if (focal === 'top') return 'center top'
  if (focal === 'bottom') return 'center bottom'
  return 'center'
}

export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error('[getAllPosts]', error.message); return [] }
  return (data ?? []) as Post[]
}

export async function getPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (error) { console.error('[getPublishedPosts]', error.message); return [] }
  return (data ?? []) as Post[]
}

/** Lightweight shape for index/listing pages — no heavy `content` payload. */
export type PostListItem = Pick<
  Post,
  'id' | 'title' | 'slug' | 'excerpt' | 'category' | 'cover_image' | 'cover_focal' | 'read_time' | 'published_at'
>

const LIST_COLUMNS = 'id, title, slug, excerpt, category, cover_image, cover_focal, read_time, published_at'

/**
 * Paginated published posts for the journal index. Selects only listing
 * columns (not the full article body) and returns the total count so the page
 * can render pagination. Scales to hundreds of posts without fetching bodies.
 */
export async function getPublishedPostsIndex(
  page = 1,
  perPage = 12,
): Promise<{ posts: PostListItem[]; total: number }> {
  const safePage = Math.max(1, Math.floor(page))
  const from = (safePage - 1) * perPage
  const to = from + perPage - 1
  const { data, count, error } = await supabase
    .from('posts')
    .select(LIST_COLUMNS, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)
  if (error) { console.error('[getPublishedPostsIndex]', error.message); return { posts: [], total: 0 } }
  return { posts: (data ?? []) as unknown as PostListItem[], total: count ?? 0 }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data as Post
}

export async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Post
}

export async function createPost(input: PostInput): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data as Post
}

export async function updatePost(id: string, input: PostInput): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Post
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}
