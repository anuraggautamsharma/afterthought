import ProjectForm from '@/components/admin/ProjectForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'New project — Afterthought CMS' }

export default function NewProjectPage() {
  return <ProjectForm project={null} />
}
