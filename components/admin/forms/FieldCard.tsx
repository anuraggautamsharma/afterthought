'use client'

import { useState, useRef, useCallback } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FIELD_TYPE_ICONS, FIELD_TYPE_LABELS } from '@/lib/forms'
import type { FormField } from '@/lib/forms'

interface Props {
  field: FormField
  isSelected: boolean
  onSelect: () => void
  onLabelChange: (label: string) => void
  onDelete: () => void
}

export default function FieldCard({ field, isSelected, onSelect, onLabelChange, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [labelDraft, setLabelDraft] = useState(field.label)
  const inputRef = useRef<HTMLInputElement>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleLabelClick = useCallback((e: React.MouseEvent) => {
    // If the field isn't selected yet, let the click bubble up so the card
    // selects (and the settings panel opens). Only when it's already selected
    // does clicking the label switch to inline-rename mode.
    if (!isSelected) return
    e.stopPropagation()
    setIsEditing(true)
    setLabelDraft(field.label)
    setTimeout(() => inputRef.current?.select(), 0)
  }, [isSelected, field.label])

  const handleLabelBlur = useCallback(() => {
    setIsEditing(false)
    const trimmed = labelDraft.trim()
    if (trimmed && trimmed !== field.label) {
      onLabelChange(trimmed)
    } else {
      setLabelDraft(field.label)
    }
  }, [labelDraft, field.label, onLabelChange])

  const handleLabelKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setLabelDraft(field.label)
      setIsEditing(false)
    }
  }, [field.label])

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }, [onDelete])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'admin-field-card',
        isSelected ? 'admin-field-card--selected' : '',
        isDragging ? 'admin-field-card--dragging' : '',
        field.visibility ? 'admin-field-card--conditional' : '',
      ].filter(Boolean).join(' ')}
      onClick={onSelect}
    >
      <button
        type="button"
        className="admin-field-card__drag-handle"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        onClick={e => e.stopPropagation()}
      >
        ⠿
      </button>

      <span className="admin-field-card__icon" aria-hidden="true">
        {FIELD_TYPE_ICONS[field.type]}
      </span>

      <div className="admin-field-card__content">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="admin-field-card__label-input"
            value={labelDraft}
            onChange={e => setLabelDraft(e.target.value)}
            onBlur={handleLabelBlur}
            onKeyDown={handleLabelKeyDown}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span
            className="admin-field-card__label"
            title={isSelected ? 'Click to edit label' : undefined}
            onClick={handleLabelClick}
          >
            {field.label || <em className="admin-field-card__label--empty">Untitled field</em>}
          </span>
        )}

        <div className="admin-field-card__meta">
          <span className="admin-field-card__type-badge">
            {FIELD_TYPE_LABELS[field.type]}
          </span>
          {field.visibility && (
            <span className="admin-field-card__conditional-badge" title="Has conditional logic">
              ◈ Conditional
            </span>
          )}
        </div>
      </div>

      <div className="admin-field-card__actions">
        {field.required && (
          <span className="admin-field-card__required-star" title="Required">
            *
          </span>
        )}
        <button
          type="button"
          className="admin-field-card__delete"
          onClick={handleDeleteClick}
          aria-label="Delete field"
          title="Delete field"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
