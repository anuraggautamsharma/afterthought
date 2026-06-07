'use client'

import { FormField } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

export default function TextField({ field, value, onChange, readOnly }: FieldProps) {
  const strVal = typeof value === 'string' ? value : ''

  const commonProps = {
    id: `field-${field.id}`,
    name: field.id,
    value: strVal,
    placeholder: field.placeholder || undefined,
    readOnly: readOnly || field.read_only,
    disabled: readOnly || field.read_only,
    minLength: field.min_length ?? undefined,
    maxLength: field.max_length ?? undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
  }

  if (field.type === 'paragraph') {
    return (
      <textarea
        {...commonProps}
        className="form-textarea"
        rows={4}
      />
    )
  }

  const inputType: Record<string, string> = {
    short_text: 'text',
    email: 'email',
    phone: 'tel',
    url: 'url',
  }

  return (
    <input
      {...commonProps}
      className="form-input"
      type={inputType[field.type] ?? 'text'}
      pattern={field.validation_pattern || undefined}
    />
  )
}
