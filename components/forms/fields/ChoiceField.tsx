'use client'

import { useState } from 'react'
import { FormField } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

export default function ChoiceField({ field, value, onChange, readOnly }: FieldProps) {
  const isCheckboxes = field.type === 'checkboxes'
  const [otherText, setOtherText] = useState('')

  const options = field.options ?? []
  const hasOther = options.some(o => o.value === '__other__')

  if (isCheckboxes) {
    const selected: string[] = Array.isArray(value) ? (value as string[]) : []

    function toggle(val: string) {
      if (readOnly || field.read_only) return
      const next = selected.includes(val)
        ? selected.filter(v => v !== val)
        : [...selected, val]
      onChange(next)
    }

    function handleOtherChange(text: string) {
      setOtherText(text)
      const withoutOther = selected.filter(v => !v.startsWith('__other__:'))
      if (text) {
        onChange([...withoutOther, `__other__:${text}`])
      } else {
        onChange(withoutOther.filter(v => v !== '__other__'))
      }
    }

    const otherChecked = selected.some(v => v === '__other__' || v.startsWith('__other__:'))

    return (
      <div className="form-checkbox-group">
        {options.map(opt => {
          if (opt.value === '__other__') {
            return (
              <div key="__other__" className="form-checkbox-option form-checkbox-option--other">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={otherChecked}
                    onChange={() => {
                      if (otherChecked) {
                        onChange(selected.filter(v => v !== '__other__' && !v.startsWith('__other__:')))
                        setOtherText('')
                      } else {
                        onChange([...selected, '__other__'])
                      }
                    }}
                    disabled={readOnly || field.read_only}
                  />
                  <span>Other</span>
                </label>
                {otherChecked && (
                  <input
                    type="text"
                    className="form-input form-input--other"
                    placeholder="Please specify"
                    value={otherText}
                    onChange={e => handleOtherChange(e.target.value)}
                    disabled={readOnly || field.read_only}
                  />
                )}
              </div>
            )
          }
          return (
            <label key={opt.value} className="form-checkbox-option">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                disabled={readOnly || field.read_only}
              />
              <span>{opt.label}</span>
            </label>
          )
        })}
      </div>
    )
  }

  // Radio
  const strVal = typeof value === 'string' ? value : ''
  const isOtherSelected = strVal.startsWith('__other__:') || strVal === '__other__'
  const otherRadioText = strVal.startsWith('__other__:') ? strVal.slice(10) : ''

  function handleOtherRadioChange(text: string) {
    setOtherText(text)
    onChange(text ? `__other__:${text}` : '__other__')
  }

  return (
    <div className="form-radio-group">
      {options.map(opt => {
        if (opt.value === '__other__') {
          return (
            <div key="__other__" className="form-radio-option form-radio-option--other">
              <label className="form-radio-label">
                <input
                  type="radio"
                  name={`field-${field.id}`}
                  checked={isOtherSelected}
                  onChange={() => onChange('__other__')}
                  disabled={readOnly || field.read_only}
                />
                <span>Other</span>
              </label>
              {isOtherSelected && (
                <input
                  type="text"
                  className="form-input form-input--other"
                  placeholder="Please specify"
                  value={otherRadioText}
                  onChange={e => handleOtherRadioChange(e.target.value)}
                  disabled={readOnly || field.read_only}
                />
              )}
            </div>
          )
        }
        return (
          <label key={opt.value} className="form-radio-option">
            <input
              type="radio"
              name={`field-${field.id}`}
              value={opt.value}
              checked={strVal === opt.value}
              onChange={() => onChange(opt.value)}
              disabled={readOnly || field.read_only}
            />
            <span>{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}
