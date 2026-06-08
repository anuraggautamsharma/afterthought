'use client'

import { useState, useTransition, useEffect } from 'react'
import Icon from '@/components/Icon'
import type { CmsUser, UserRole } from '@/lib/users'
import { createUserAction, updateUserAction, deleteUserAction, setPasswordAction } from '@/app/admin/users/actions'
import { openConfirm } from '@/lib/confirmStore'
import { toast } from '@/lib/toastStore'

interface Props {
  users: CmsUser[]
  ownerEmail: string
  currentEmail: string
}

type ModalState =
  | { mode: 'add' }
  | { mode: 'edit'; user: CmsUser }
  | null

function initial(email: string) {
  return (email.trim()[0] || '?').toUpperCase()
}

export default function UsersManager({ users, ownerEmail, currentEmail }: Props) {
  const [modal, setModal] = useState<ModalState>(null)

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-subtitle">
            {users.length + 1} {users.length === 0 ? 'person' : 'people'} with access
          </p>
        </div>
        <button className="admin-btn-primary admin-btn-primary--icon"
          style={{ width: 'auto', padding: '10px 18px', fontSize: '14px' }}
          onClick={() => setModal({ mode: 'add' })}>
          <Icon name="person_add" size={18} /> Add user
        </button>
      </div>

      <div className="admin-setup-banner" style={{ marginBottom: 20 }}>
        <div className="admin-setup-banner__text">
          <strong>How access works</strong>
          <span>Anyone you add here can sign in at <code>/admin/login</code> with the email and password you set. Share those with them directly. All users currently have full CMS access.</span>
        </div>
      </div>

      <div className="admin-posts-table">
        <div className="admin-table-head">
          <span className="admin-table-head__label">{users.length + 1} accounts</span>
        </div>

        {/* Owner row (env account) */}
        <div className="admin-user-row">
          <span className="admin-user-row__avatar admin-user-row__avatar--owner">{initial(ownerEmail)}</span>
          <div className="admin-user-row__id">
            <span className="admin-user-row__name">
              Owner{ownerEmail === currentEmail ? ' (you)' : ''}
            </span>
            <span className="admin-user-row__email">{ownerEmail || '— set ADMIN_EMAIL —'}</span>
          </div>
          <span className="admin-tag-chip" style={{ background: '#FBF0D8', color: '#8A5A12' }}>Owner</span>
          <div className="admin-user-row__actions">
            <span className="admin-user-row__hint">Managed in Vercel</span>
          </div>
        </div>

        {users.map(u => (
          <div key={u.id} className="admin-user-row">
            <span className="admin-user-row__avatar">{initial(u.name || u.email)}</span>
            <div className="admin-user-row__id">
              <span className="admin-user-row__name">
                {u.name || u.email}{u.email === currentEmail ? ' (you)' : ''}
              </span>
              <span className="admin-user-row__email">{u.email}</span>
            </div>
            <span className={`admin-tag-chip admin-tag-chip--${u.role}`}>{u.role}</span>
            <div className="admin-user-row__actions">
              <button className="admin-btn-ghost" onClick={() => setModal({ mode: 'edit', user: u })}>
                <Icon name="edit" size={15} /> Edit
              </button>
              {u.email !== currentEmail && <DeleteUserButton user={u} />}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <UserModal
          state={modal}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}

function DeleteUserButton({ user }: { user: CmsUser }) {
  const [pending, start] = useTransition()
  const onDelete = async () => {
    const ok = await openConfirm({
      title: 'Remove this user?',
      message: `${user.name || user.email} will lose access immediately. This cannot be undone.`,
      confirmLabel: 'Remove', danger: true,
    })
    if (!ok) return
    start(async () => {
      const res = await deleteUserAction(user.id)
      if (res.error) toast.error(res.error)
      else toast.success('User removed')
    })
  }
  return (
    <button className="admin-btn-ghost admin-btn-ghost--danger" disabled={pending} onClick={onDelete}>
      <Icon name="delete" size={15} /> Remove
    </button>
  )
}

function UserModal({ state, onClose }: { state: NonNullable<ModalState>; onClose: () => void }) {
  const isEdit = state.mode === 'edit'
  const user = isEdit ? state.user : null
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [role, setRole] = useState<UserRole>(user?.role ?? 'admin')
  const [password, setPassword] = useState('')
  const [pending, start] = useTransition()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = () => {
    start(async () => {
      if (isEdit && user) {
        const res = await updateUserAction(user.id, { name, role })
        if (res.error) { toast.error(res.error); return }
        if (password.trim()) {
          const pw = await setPasswordAction(user.id, password.trim())
          if (pw.error) { toast.error(pw.error); return }
        }
        toast.success('User updated')
        onClose()
      } else {
        const res = await createUserAction({ email, name, role, password })
        if (res.error) { toast.error(res.error); return }
        toast.success('User added')
        onClose()
      }
    })
  }

  return (
    <div className="admin-share-backdrop" onMouseDown={onClose}>
      <div className="admin-share" style={{ maxWidth: 460 }} onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="admin-share__head">
          <h2 className="admin-share__title">{isEdit ? 'Edit user' : 'Add user'}</h2>
          <button className="admin-share__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="admin-field" style={{ marginBottom: 16 }}>
          <label>Full name</label>
          <input type="text" value={name} placeholder="Jane Doe" onChange={e => setName(e.target.value)} />
        </div>

        <div className="admin-field" style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input type="email" value={email} placeholder="jane@studio.com"
            disabled={isEdit}
            onChange={e => setEmail(e.target.value)} />
          {isEdit && <span className="admin-field__hint">Email can’t be changed.</span>}
        </div>

        <div className="admin-field" style={{ marginBottom: 16 }}>
          <label>Role</label>
          <select className="admin-sort__select" style={{ width: '100%' }} value={role} onChange={e => setRole(e.target.value as UserRole)}>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>

        <div className="admin-field" style={{ marginBottom: 20 }}>
          <label>{isEdit ? 'New password (optional)' : 'Password'}</label>
          <input type="text" value={password}
            placeholder={isEdit ? 'Leave blank to keep current' : 'At least 8 characters'}
            onChange={e => setPassword(e.target.value)} />
          <span className="admin-field__hint">Shown as plain text so you can copy it to share with them.</span>
        </div>

        <div className="admin-modal__footer">
          <button className="admin-btn-secondary" style={{ width: 'auto', padding: '9px 18px', fontSize: 14 }} onClick={onClose}>
            Cancel
          </button>
          <button className="admin-btn-primary" style={{ width: 'auto', padding: '9px 20px' }} disabled={pending} onClick={submit}>
            {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Add user'}
          </button>
        </div>
      </div>
    </div>
  )
}
