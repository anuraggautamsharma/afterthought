'use client'

import { FormField } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

export default function NumberField({ field, value, onChange, readOnly }: FieldProps) {
  const numVal = value !== undefined && value !== null && value !== '' ? String(value) : ''

  return (
    <input
      id={`field-${field.id}`}
      name={field.id}
      type="number"
      className="form-input"
      value={numVal}
      placeholder={field.placeholder || undefined}
      readOnly={readOnly || field.read_only}
      disabled={readOnly || field.read_only}
      min={field.min_value ?? undefined}
      max={field.max_value ?? undefined}
      step={field.step_value || 1}
      onChange={e => {
        const raw = e.target.value
        if (raw === '' || raw === '-') {
          onChange(raw)
        } else {
          const parsed = parseFloat(raw)
          onChange(isNaN(parsed) ? '' : parsed)
        }
      }}
    />
  )
}
