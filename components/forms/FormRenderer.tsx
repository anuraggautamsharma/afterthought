'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormSection,
  FormField,
  VisibilityCondition,
  VisibilityRule,
  ConditionOp,
  SkipLogicRule,
} from '@/lib/forms'
import { submitFormAction, SubmitResult } from '@/app/forms/[slug]/actions'
import FieldWrapper from './FieldWrapper'
import ProgressBar from './ProgressBar'
import TextField from './fields/TextField'
import NumberField from './fields/NumberField'
import ChoiceField from './fields/ChoiceField'
import DropdownField from './fields/DropdownField'
import ScaleField from './fields/ScaleField'
import DateField from './fields/DateField'
import FileField from './fields/FileField'
import SignatureField from './fields/SignatureField'
import ImageChoiceField from './fields/ImageChoiceField'
import MatrixField from './fields/MatrixField'
import RankingField from './fields/RankingField'
import SliderField from './fields/SliderField'

interface FormRendererProps {
  form: Form
  sections: FormSection[]
  fields: FormField[]
  onSubmit: typeof submitFormAction
  /** Hide the form's own title/description (host page provides context). */
  hideHeader?: boolean
}

// ── Condition evaluation ─────────────────────────────────────────────────────

function evaluateCondition(
  condition: VisibilityCondition,
  answers: Record<string, unknown>
): boolean {
  const answer = answers[condition.field_id]
  const val = condition.value
  const op = condition.op as ConditionOp

  switch (op) {
    case 'equals':
      return String(answer ?? '') === val
    case 'not_equals':
      return String(answer ?? '') !== val
    case 'contains':
      return String(answer ?? '').includes(val)
    case 'not_contains':
      return !String(answer ?? '').includes(val)
    case 'greater_than':
      return Number(answer) > Number(val)
    case 'less_than':
      return Number(answer) < Number(val)
    case 'is_empty':
      return (
        answer === undefined ||
        answer === null ||
        answer === '' ||
        (Array.isArray(answer) && answer.length === 0)
      )
    case 'is_not_empty':
      return !(
        answer === undefined ||
        answer === null ||
        answer === '' ||
        (Array.isArray(answer) && answer.length === 0)
      )
    default:
      return true
  }
}

function evaluateRule(
  rule: VisibilityRule,
  answers: Record<string, unknown>
): boolean {
  const results = rule.conditions.map(c => evaluateCondition(c, answers))
  if (rule.logic === 'and') return results.every(Boolean)
  return results.some(Boolean)
}

function isFieldVisible(field: FormField, answers: Record<string, unknown>): boolean {
  if (!field.visibility) return true
  return evaluateRule(field.visibility, answers)
}

// ── Answer piping ─────────────────────────────────────────────────────────────

function pipeAnswers(text: string, answers: Record<string, unknown>): string {
  return text.replace(/\{\{([^}]+)\}\}/g, (_, fieldId: string) => {
    const val = answers[fieldId]
    if (val === undefined || val === null) return ''
    if (Array.isArray(val)) return val.join(', ')
    return String(val)
  })
}

// ── Shuffle helper ─────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function FormRenderer({ form, sections, fields, onSubmit, hideHeader }: FormRendererProps) {
  const router = useRouter()

  // ── Shuffled fields/options (stable on mount) ──────────────────────────────
  const stableFields = useMemo<FormField[]>(() => {
    let fs = [...fields]
    if (form.shuffle_questions) {
      // Shuffle within each section
      const bySec: Record<string, FormField[]> = {}
      const unsectioned: FormField[] = []
      fs.forEach(f => {
        if (f.section_id) {
          if (!bySec[f.section_id]) bySec[f.section_id] = []
          bySec[f.section_id].push(f)
        } else {
          unsectioned.push(f)
        }
      })
      Object.keys(bySec).forEach(sid => {
        bySec[sid] = shuffleArray(bySec[sid])
      })
      fs = sections.flatMap(s => bySec[s.id] ?? [])
      fs = [...fs, ...shuffleArray(unsectioned)]
    }
    // Shuffle options per field
    return fs.map(f => {
      if (f.shuffle_options && f.options?.length) {
        return { ...f, options: shuffleArray(f.options) }
      }
      return f
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Default answers from default_value ────────────────────────────────────
  const initialAnswers = useMemo(() => {
    const ans: Record<string, unknown> = {}
    stableFields.forEach(f => {
      if (f.default_value !== null && f.default_value !== undefined) {
        ans[f.id] = f.default_value
      }
    })
    return ans
  }, [stableFields])

  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pageErrors, setPageErrors] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.sort_order - b.sort_order),
    [sections]
  )

  // Build a virtual single section if there are no sections
  const effectiveSections: FormSection[] = useMemo(() => {
    if (sortedSections.length === 0) {
      return [{
        id: '__default__',
        form_id: form.id,
        title: '',
        description: '',
        sort_order: 0,
        skip_logic: [],
        created_at: '',
      }]
    }
    return sortedSections
  }, [sortedSections, form.id])

  const totalSections = effectiveSections.length
  const currentSection = effectiveSections[currentSectionIndex]

  // ── Fields for current section ─────────────────────────────────────────────
  const currentFields = useMemo(() => {
    if (currentSection.id === '__default__') {
      return stableFields.filter(f => !f.section_id)
    }
    return stableFields.filter(f => f.section_id === currentSection.id)
  }, [stableFields, currentSection])

  const visibleCurrentFields = useMemo(
    () => currentFields.filter(f => isFieldVisible(f, answers)),
    [currentFields, answers]
  )

  // ── Question numbers (global, only visible fields) ─────────────────────────
  const questionNumberMap = useMemo(() => {
    if (!form.show_question_numbers) return {}
    const map: Record<string, number> = {}
    let num = 1
    effectiveSections.forEach(sec => {
      const secFields =
        sec.id === '__default__'
          ? stableFields.filter(f => !f.section_id)
          : stableFields.filter(f => f.section_id === sec.id)
      secFields.forEach(f => {
        if (isFieldVisible(f, answers)) {
          map[f.id] = num++
        }
      })
    })
    return map
  }, [form.show_question_numbers, effectiveSections, stableFields, answers])

  // ── Answer setter ──────────────────────────────────────────────────────────
  const setAnswer = useCallback((fieldId: string, val: unknown) => {
    setAnswers(prev => ({ ...prev, [fieldId]: val }))
    setErrors(prev => {
      if (!prev[fieldId]) return prev
      const next = { ...prev }
      delete next[fieldId]
      return next
    })
  }, [])

  // ── Validation ─────────────────────────────────────────────────────────────
  function validateCurrentSection(): Record<string, string> {
    const errs: Record<string, string> = {}
    for (const field of visibleCurrentFields) {
      if (!field.required) continue
      const val = answers[field.id]
      const empty =
        val === undefined ||
        val === null ||
        val === '' ||
        (Array.isArray(val) && val.length === 0)
      if (empty) {
        errs[field.id] = 'This field is required'
      }
    }
    return errs
  }

  // ── Skip logic ─────────────────────────────────────────────────────────────
  function getNextSectionIndex(): number {
    const skipRules: SkipLogicRule[] = currentSection.skip_logic ?? []
    for (const rule of skipRules) {
      const allMatch = rule.conditions.every(c => evaluateCondition(c, answers))
      if (allMatch) {
        if (rule.target_section_id === null) {
          // null means "submit" / end of form
          return totalSections
        }
        const idx = effectiveSections.findIndex(s => s.id === rule.target_section_id)
        if (idx !== -1) return idx
      }
    }
    return currentSectionIndex + 1
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleNext() {
    const errs = validateCurrentSection()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setPageErrors(true)
      scrollToTop()
      return
    }
    setPageErrors(false)
    setErrors({})

    const nextIndex = getNextSectionIndex()

    if (nextIndex >= totalSections) {
      // Submit
      await handleSubmit()
    } else {
      setCurrentSectionIndex(nextIndex)
      scrollToTop()
    }
  }

  function handleBack() {
    setCurrentSectionIndex(i => Math.max(0, i - 1))
    setPageErrors(false)
    scrollToTop()
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    try {
      const result: SubmitResult = await onSubmit(form.id, form.slug, answers)
      if (result.ok) {
        setSubmitted(true)
        if (form.confirmation_type === 'redirect' && form.redirect_url) {
          router.push(form.redirect_url)
        }
      } else if (result.errors) {
        setErrors(result.errors)
        setPageErrors(true)
        scrollToTop()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted && form.confirmation_type === 'message') {
    return (
      <div className="form-renderer">
        <div className="form-success-screen">
          <div className="form-success-screen__icon">✓</div>
          <h2 className="form-success-screen__title">
            {form.confirmation_message || 'Thank you for your response!'}
          </h2>
        </div>
      </div>
    )
  }

  const isLastSection = getNextSectionIndex() >= totalSections
  const submitLabel = form.submit_label || 'Submit'

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="form-renderer" ref={topRef}>
      {form.show_progress && (
        <ProgressBar current={currentSectionIndex + 1} total={totalSections} />
      )}

      {pageErrors && (
        <div className="form-page-errors" role="alert">
          Please fix the errors below before continuing.
        </div>
      )}

      <div className="form-section">
        {currentSection.title && (
          <div className="form-section__header">
            <h2 className="form-section__title">{currentSection.title}</h2>
            {currentSection.description && (
              <p className="form-section__description">{currentSection.description}</p>
            )}
          </div>
        )}

        {/* Show form title/description on first section */}
        {!hideHeader && currentSectionIndex === 0 && !currentSection.title && (
          <div className="form-section__header">
            <h1 className="form-title">{form.title}</h1>
            {form.description && (
              <p className="form-description">{form.description}</p>
            )}
          </div>
        )}

        <div className="form-fields">
          {visibleCurrentFields.map(field => {
            const pipedLabel = pipeAnswers(field.label, answers)
            const pipedDesc = pipeAnswers(field.description ?? '', answers)
            const qNum = form.show_question_numbers
              ? questionNumberMap[field.id]
              : undefined

            return (
              <FieldWrapper
                key={field.id}
                label={pipedLabel}
                description={pipedDesc || undefined}
                required={field.required}
                error={errors[field.id]}
                questionNumber={qNum}
              >
                <FieldInput
                  field={{
                    ...field,
                    label: pipedLabel,
                    description: pipedDesc,
                    placeholder: pipeAnswers(field.placeholder ?? '', answers),
                  }}
                  value={answers[field.id] ?? field.default_value ?? getDefaultValue(field)}
                  onChange={val => setAnswer(field.id, val)}
                  error={errors[field.id]}
                  readOnly={field.read_only}
                />
              </FieldWrapper>
            )
          })}
        </div>

        <div className="form-nav-buttons">
          {currentSectionIndex > 0 && (
            <button
              type="button"
              className="form-btn form-btn--secondary"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </button>
          )}

          <button
            type="button"
            className={`form-btn form-btn--primary${isSubmitting ? ' form-btn--loading' : ''}`}
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Submitting…'
              : isLastSection
              ? submitLabel
              : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Field dispatcher ──────────────────────────────────────────────────────────

interface FieldInputProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

function FieldInput({ field, value, onChange, error, readOnly }: FieldInputProps) {
  const props = { field, value, onChange, error, readOnly }

  switch (field.type) {
    case 'short_text':
    case 'paragraph':
    case 'email':
    case 'phone':
    case 'url':
      return <TextField {...props} />
    case 'number':
      return <NumberField {...props} />
    case 'radio':
    case 'checkboxes':
      return <ChoiceField {...props} />
    case 'dropdown':
      return <DropdownField {...props} />
    case 'linear_scale':
    case 'star_rating':
      return <ScaleField {...props} />
    case 'date':
    case 'time':
    case 'datetime':
    case 'date_range':
      return <DateField {...props} />
    case 'file_upload':
      return <FileField {...props} />
    case 'signature':
      return <SignatureField {...props} />
    case 'image_choice':
      return <ImageChoiceField {...props} />
    case 'matrix':
      return <MatrixField {...props} />
    case 'ranking':
      return <RankingField {...props} />
    case 'slider':
      return <SliderField {...props} />
    default:
      return (
        <p className="form-field-unsupported">
          Unsupported field type: {(field as FormField).type}
        </p>
      )
  }
}

function getDefaultValue(field: FormField): unknown {
  switch (field.type) {
    case 'checkboxes':
      return []
    case 'slider':
      return field.min_value ?? 0
    case 'ranking':
      return field.options?.map(o => o.value) ?? []
    default:
      return ''
  }
}
