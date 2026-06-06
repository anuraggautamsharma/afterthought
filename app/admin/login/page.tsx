import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/admin/LoginForm'
import '../admin.css'

export const metadata = { title: 'Sign in — Afterthought CMS' }

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect('/admin/posts')

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <span className="admin-login__eyebrow">Afterthought CMS</span>
        <h1 className="admin-login__title">
          Welcome back,<br /><em>Anurag.</em>
        </h1>
        <LoginForm />
      </div>
    </div>
  )
}
