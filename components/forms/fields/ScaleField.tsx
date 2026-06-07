'use client'

import { FormField } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

export default function ScaleField({ field, value, onChange, readOnly }: FieldProps) {
  const numVal = typeof value === 'number' ? value : null

  if (field.type === 'star_rating') {
    const maxStars = field.max_value ?? 5
    return (
      <div className="form-stars" role="group" aria-label={field.label}>
        {Array.from({ length: maxStars }, (_, i) => i + 1).map(star => (
          <button
            key={star}
            type="button"
            className={`form-star-btn${numVal !== null && star <= numVal ? ' form-star-btn--filled' : ''}`}
            onClick={() => {
              if (!readOnly && !field.read_only) onChange(star)
            }}
            disabled={readOnly || field.read_only}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            aria-pressed={numVal !== null && star <= numVal}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  // linear_scale
  const min = field.min_value ?? 1
  const max = field.max_value ?? 5
  const steps: number[] = []
  for (let i = min; i <= max; i++) steps.push(i)

  return (
    <div className="form-scale">
      {field.min_label && (
        <span className="form-scale__label form-scale__label--min">{field.min_label}</span>
      )}
      <div className="form-scale__options">
        {steps.map(step => (
          <label key={step} className={`form-scale__option${numVal === step ? ' form-scale__option--selected' : ''}`}>
            <input
              type="radio"
              name={`field-${field.id}`}
              value={step}
              checked={numVal === step}
              onChange={() => {
                if (!readOnly && !field.read_only) onChange(step)
              }}
              disabled={readOnly || field.read_only}
            />
            <span>{step}</span>
          </label>
        ))}
      </div>
      {field.max_label && (
        <span className="form-scale__label form-scale__label--max">{field.max_label}</span>
      )}
    </div>
  )
}
