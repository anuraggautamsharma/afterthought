import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/projects'
import ProjectForm from '@/components/admin/ProjectForm'

export const dynamic = 'force-dynamic'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()
  return <ProjectForm project={project} />
}
