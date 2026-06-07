interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="form-progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="form-progress-bar__track">
        <div
          className="form-progress-bar__fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="form-progress-bar__label">
        {current} of {total}
      </span>
    </div>
  )
}
