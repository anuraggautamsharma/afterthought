import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { getPublishedPosts } from '@/lib/posts'
import { getPublishedProjects } from '@/lib/projects'
import { getOpenJobs } from '@/lib/jobs'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/work', '/services', '/studio', '/thinking', '/careers', '/careers/freelance', '/contact']
  const now = new Date()

  const entries: MetadataRoute.Sitemap = staticRoutes.map(path => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))

  try {
    const posts = await getPublishedPosts()
    for (const p of posts) {
      entries.push({
        url: `${SITE_URL}/thinking/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  } catch {}

  try {
    const projects = await getPublishedProjects()
    for (const pr of projects) {
      entries.push({
        url: `${SITE_URL}/work/${pr.slug}`,
        lastModified: pr.updated_at ? new Date(pr.updated_at) : now,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  } catch {}

  try {
    const jobs = await getOpenJobs()
    for (const j of jobs) {
      entries.push({
        url: `${SITE_URL}/careers/${j.slug}`,
        lastModified: j.updated_at ? new Date(j.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    }
  } catch {}

  return entries
}
