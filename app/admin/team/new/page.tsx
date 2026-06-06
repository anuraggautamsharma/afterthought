import TeamForm from '@/components/admin/TeamForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'New team member — Afterthought CMS' }

export default function NewTeamPage() {
  return <TeamForm member={null} />
}
