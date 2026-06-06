import type { Job } from '@/lib/jobs'

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="job-card">
      <div className="job-card__head">
        <div className="job-card__meta">
          <span className="job-card__tag">{job.type}</span>
          <span className="job-card__tag">{job.location}</span>
        </div>
        <h3 className="job-card__title">{job.title}</h3>
        <p className="job-card__desc">{job.summary}</p>
      </div>
      <div className="job-card__foot">
        <a className="btn btn-primary" href={`/careers/${job.slug}`}>
          View role & apply →
        </a>
      </div>
    </div>
  )
}
