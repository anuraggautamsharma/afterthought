'use client'

import { FormField } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

// value shape: Record<row, string | string[]>
type MatrixValue = Record<string, string | string[]>

export default function MatrixField({ field, value, onChange, readOnly }: FieldProps) {
  const config = field.matrix_config
  if (!config) return null

  const { rows, columns, multi } = config
  const disabled = readOnly || field.read_only
  const matrixVal: MatrixValue = value && typeof value === 'object' && !Array.isArray(value)
    ? (value as MatrixValue)
    : {}

  function handleChange(row: string, col: string) {
    if (disabled) return
    if (multi) {
      const current: string[] = Array.isArray(matrixVal[row]) ? (matrixVal[row] as string[]) : []
      const next = current.includes(col)
        ? current.filter(c => c !== col)
        : [...current, col]
      onChange({ ...matrixVal, [row]: next })
    } else {
      onChange({ ...matrixVal, [row]: matrixVal[row] === col ? '' : col })
    }
  }

  function isChecked(row: string, col: string): boolean {
    const v = matrixVal[row]
    if (multi) {
      return Array.isArray(v) ? v.includes(col) : false
    }
    return v === col
  }

  return (
    <div className="form-matrix" role="group">
      <table className="form-matrix__table">
        <thead>
          <tr>
            <th className="form-matrix__corner" />
            {columns.map(col => (
              <th key={col} className="form-matrix__col-header">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row} className="form-matrix__row">
              <td className="form-matrix__row-label">{row}</td>
              {columns.map(col => (
                <td key={col} className="form-matrix__cell">
                  <input
                    type={multi ? 'checkbox' : 'radio'}
                    name={multi ? `matrix-${field.id}-${row}-${col}` : `matrix-${field.id}-${row}`}
                    checked={isChecked(row, col)}
                    onChange={() => handleChange(row, col)}
                    disabled={disabled}
                    aria-label={`${row}: ${col}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
