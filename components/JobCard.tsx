import type { Role } from '@/lib/roles'

export default function JobCard({ role }: { role: Role }) {
  return (
    <div className="job-card">
      <div className="job-card__head">
        <div className="job-card__meta">
          <span className="job-card__tag">{role.type}</span>
          <span className="job-card__tag">{role.location}</span>
        </div>
        <h3 className="job-card__title">{role.title}</h3>
        <p className="job-card__desc">{role.summary}</p>
      </div>
      <div className="job-card__foot">
        <a className="btn btn-primary" href={`/careers/${role.id}`}>
          View role & apply →
        </a>
      </div>
    </div>
  )
}
