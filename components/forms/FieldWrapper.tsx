import { ReactNode } from 'react'

interface FieldWrapperProps {
  label: string
  description?: string
  required?: boolean
  error?: string
  questionNumber?: number
  children: ReactNode
}

export default function FieldWrapper({
  label,
  description,
  required,
  error,
  questionNumber,
  children,
}: FieldWrapperProps) {
  return (
    <div className={`form-field-wrapper${error ? ' form-field-wrapper--error' : ''}`}>
      <label className="form-field-label">
        {questionNumber !== undefined && (
          <span className="form-field-number">{questionNumber}.</span>
        )}
        <span className="form-field-label-text">{label}</span>
        {required && <span className="form-field-required" aria-hidden="true">*</span>}
      </label>
      {description && (
        <p className="form-field-description">{description}</p>
      )}
      <div className="form-field-control">
        {children}
      </div>
      {error && (
        <p className="form-field-error" role="alert">{error}</p>
      )}
    </div>
  )
}
