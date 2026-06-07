'use client'

import { FormField } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

export default function DropdownField({ field, value, onChange, readOnly }: FieldProps) {
  const strVal = typeof value === 'string' ? value : ''

  return (
    <select
      id={`field-${field.id}`}
      name={field.id}
      className="form-select"
      value={strVal}
      disabled={readOnly || field.read_only}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">
        {field.placeholder || 'Select an option…'}
      </option>
      {(field.options ?? []).map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
