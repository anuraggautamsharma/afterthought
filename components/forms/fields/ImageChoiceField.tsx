'use client'

import { FormField } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

export default function ImageChoiceField({ field, value, onChange, readOnly }: FieldProps) {
  const isMulti = false // image_choice is single-select; extend if needed
  const disabled = readOnly || field.read_only

  const strVal = typeof value === 'string' ? value : ''
  const arrVal: string[] = Array.isArray(value) ? (value as string[]) : []

  function handleSelect(optVal: string) {
    if (disabled) return
    if (isMulti) {
      const next = arrVal.includes(optVal)
        ? arrVal.filter(v => v !== optVal)
        : [...arrVal, optVal]
      onChange(next)
    } else {
      onChange(strVal === optVal ? '' : optVal)
    }
  }

  function isSelected(optVal: string): boolean {
    return isMulti ? arrVal.includes(optVal) : strVal === optVal
  }

  return (
    <div className="form-image-choice-grid" role="group" aria-label={field.label}>
      {(field.options ?? []).map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`form-image-choice-option${isSelected(opt.value) ? ' form-image-choice-option--selected' : ''}`}
          onClick={() => handleSelect(opt.value)}
          disabled={disabled}
          aria-pressed={isSelected(opt.value)}
        >
          {opt.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={opt.image_url}
              alt={opt.label}
              className="form-image-choice-option__img"
            />
          ) : (
            <div className="form-image-choice-option__placeholder" aria-hidden="true" />
          )}
          <span className="form-image-choice-option__label">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
