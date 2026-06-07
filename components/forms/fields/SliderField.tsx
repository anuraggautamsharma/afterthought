'use client'

import { FormField } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

export default function SliderField({ field, value, onChange, readOnly }: FieldProps) {
  const min = field.min_value ?? 0
  const max = field.max_value ?? 100
  const step = field.step_value || 1

  const numVal = typeof value === 'number' ? value : min
  const disabled = readOnly || field.read_only

  const percent = max !== min ? ((numVal - min) / (max - min)) * 100 : 0

  return (
    <div className="form-slider">
      <div className="form-slider__track-wrapper">
        <input
          id={`field-${field.id}`}
          type="range"
          className="form-slider__input"
          min={min}
          max={max}
          step={step}
          value={numVal}
          disabled={disabled}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ '--slider-percent': `${percent}%` } as React.CSSProperties}
        />
      </div>
      <div className="form-slider__labels">
        <span className="form-slider__label form-slider__label--min">
          {field.min_label || min}
        </span>
        <span className="form-slider__value">{numVal}</span>
        <span className="form-slider__label form-slider__label--max">
          {field.max_label || max}
        </span>
      </div>
    </div>
  )
}
