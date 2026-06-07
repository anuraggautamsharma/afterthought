'use client'

import { FormField } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

interface DateRangeValue {
  start: string
  end: string
}

export default function DateField({ field, value, onChange, readOnly }: FieldProps) {
  const disabled = readOnly || field.read_only

  if (field.type === 'date_range') {
    const rangeVal: DateRangeValue =
      value && typeof value === 'object' && !Array.isArray(value)
        ? (value as DateRangeValue)
        : { start: '', end: '' }

    return (
      <div className="form-date form-date--range">
        <div className="form-date__group">
          <label className="form-date__sub-label" htmlFor={`field-${field.id}-start`}>
            Start
          </label>
          <input
            id={`field-${field.id}-start`}
            type="date"
            className="form-input"
            value={rangeVal.start}
            disabled={disabled}
            onChange={e => onChange({ ...rangeVal, start: e.target.value })}
          />
        </div>
        <div className="form-date__group">
          <label className="form-date__sub-label" htmlFor={`field-${field.id}-end`}>
            End
          </label>
          <input
            id={`field-${field.id}-end`}
            type="date"
            className="form-input"
            value={rangeVal.end}
            disabled={disabled}
            min={rangeVal.start || undefined}
            onChange={e => onChange({ ...rangeVal, end: e.target.value })}
          />
        </div>
      </div>
    )
  }

  const strVal = typeof value === 'string' ? value : ''

  const typeMap: Record<string, string> = {
    date: 'date',
    time: 'time',
    datetime: 'datetime-local',
  }

  return (
    <input
      id={`field-${field.id}`}
      name={field.id}
      type={typeMap[field.type] ?? 'date'}
      className="form-input form-date"
      value={strVal}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
    />
  )
}
