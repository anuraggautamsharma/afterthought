'use server'

import { getAllPosts } from '@/lib/posts'
import { getAllForms } from '@/lib/forms'
import { getAllJobs } from '@/lib/jobs'
import { getSubmissions } from '@/lib/submissions'

export interface SearchResult {
  id: string
  type: 'post' | 'form' | 'job' | 'submission'
  label: string
  sublabel: string
  href: string
}

const TYPE_LABEL: Record<SearchResult['type'], string> = {
  post: 'Post',
  form: 'Form',
  job: 'Job',
  submission: 'Inbox',
}

export { TYPE_LABEL }

/** Global admin search across posts, forms, jobs and submissions. */
export async function searchAdminAction(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results: SearchResult[] = []

  const [posts, forms, jobs, subs] = await Promise.all([
    getAllPosts().catch(() => []),
    getAllForms().catch(() => []),
    getAllJobs().catch(() => []),
    getSubmissions().catch(() => []),
  ])

  for (const p of posts) {
    if (p.title?.toLowerCase().includes(q)) {
      results.push({
        id: p.id, type: 'post', label: p.title || 'Untitled',
        sublabel: p.status === 'published' ? 'Published post' : 'Draft post',
        href: `/admin/posts/${p.id}`,
      })
    }
  }
  for (const f of forms) {
    if (f.title?.toLowerCase().includes(q)) {
      results.push({
        id: f.id, type: 'form', label: f.title || 'Untitled form',
        sublabel: `Form · ${f.status}`,
        href: `/admin/forms/${f.id}/edit`,
      })
    }
  }
  for (const j of jobs) {
    if (j.title?.toLowerCase().includes(q)) {
      results.push({
        id: j.id, type: 'job', label: j.title,
        sublabel: `Job · ${j.status}`,
        href: `/admin/jobs/${j.id}`,
      })
    }
  }
  for (const s of subs) {
    const hay = `${s.name ?? ''} ${s.email ?? ''} ${s.subject ?? ''}`.toLowerCase()
    if (hay.includes(q)) {
      results.push({
        id: s.id, type: 'submission', label: s.name || s.email || '(no name)',
        sublabel: s.subject || 'Submission',
        href: `/admin/inbox/${s.id}`,
      })
    }
  }

  return results.slice(0, 24)
}
