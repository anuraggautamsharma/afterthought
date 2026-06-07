'use client'

import { useState, useCallback, useRef } from 'react'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { FormField, FormSection, FieldType } from '@/lib/forms'
import { FIELD_GROUPS, FIELD_TYPE_LABELS, FIELD_TYPE_ICONS } from '@/lib/forms'
import FieldCard from './FieldCard'

interface Props {
  section: FormSection
  sectionIndex: number
  fields: FormField[]
  selectedFieldId: string | null
  totalSections: number
  onSelectField: (id: string) => void
  onFieldLabelChange: (fieldId: string, label: string) => void
  onDeleteField: (fieldId: string) => void
  onAddField: (type: FieldType) => void
  onUpdateSection: (patch: Partial<FormSection>) => void
  onDeleteSection: () => void
  onMoveSection: (direction: 'up' | 'down') => void
}

export default function SectionBlock({
  section,
  sectionIndex,
  fields,
  selectedFieldId,
  totalSections,
  onSelectField,
  onFieldLabelChange,
  onDeleteField,
  onAddField,
  onUpdateSection,
  onDeleteSection,
  onMoveSection,
}: Props) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(section.title)
  const [editingDesc, setEditingDesc] = useState(false)
  const [descDraft, setDescDraft] = useState(section.description)
  const pickerRef = useRef<HTMLDivElement>(null)

  const handleTitleBlur = useCallback(() => {
    setEditingTitle(false)
    const trimmed = titleDraft.trim()
    if (trimmed !== section.title) {
      onUpdateSection({ title: trimmed })
    }
  }, [titleDraft, section.title, onUpdateSection])

  const handleDescBlur = useCallback(() => {
    setEditingDesc(false)
    const trimmed = descDraft.trim()
    if (trimmed !== section.description) {
      onUpdateSection({ description: trimmed })
    }
  }, [descDraft, section.description, onUpdateSection])

  const handleAddFieldType = useCallback((type: FieldType) => {
    setIsPickerOpen(false)
    onAddField(type)
  }, [onAddField])

  return (
    <div className="admin-section-block">
      {/* Section header */}
      <div className="admin-section-block__header">
        <div className="admin-section-block__badge">
          Section {sectionIndex + 1}
          <span className="admin-section-block__field-count">
            {fields.length} field{fields.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="admin-section-block__controls">
          <button
            type="button"
            className="admin-section-block__move-btn"
            onClick={() => onMoveSection('up')}
            disabled={sectionIndex === 0}
            aria-label="Move section up"
            title="Move section up"
          >
            ↑
          </button>
          <button
            type="button"
            className="admin-section-block__move-btn"
            onClick={() => onMoveSection('down')}
            disabled={sectionIndex === totalSections - 1}
            aria-label="Move section down"
            title="Move section down"
          >
            ↓
          </button>
          {totalSections > 1 && (
            <button
              type="button"
              className="admin-section-block__delete-btn"
              onClick={onDeleteSection}
              aria-label="Delete section"
              title="Delete section"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Section title */}
      {editingTitle ? (
        <input
          type="text"
          className="admin-section-block__title-input"
          value={titleDraft}
          placeholder="Section title (optional)"
          autoFocus
          onChange={e => setTitleDraft(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={e => {
            if (e.key === 'Enter') e.currentTarget.blur()
            if (e.key === 'Escape') { setTitleDraft(section.title); setEditingTitle(false) }
          }}
        />
      ) : (
        <div
          className={`admin-section-block__title ${!section.title ? 'admin-section-block__title--empty' : ''}`}
          onClick={() => { setEditingTitle(true); setTitleDraft(section.title) }}
          title="Click to edit section title"
        >
          {section.title || 'Click to add section title…'}
        </div>
      )}

      {/* Section description */}
      {editingDesc ? (
        <textarea
          className="admin-section-block__desc-input"
          value={descDraft}
          placeholder="Section description (optional)"
          autoFocus
          rows={2}
          onChange={e => setDescDraft(e.target.value)}
          onBlur={handleDescBlur}
          onKeyDown={e => {
            if (e.key === 'Escape') { setDescDraft(section.description); setEditingDesc(false) }
          }}
        />
      ) : (
        <div
          className={`admin-section-block__desc ${!section.description ? 'admin-section-block__desc--empty' : ''}`}
          onClick={() => { setEditingDesc(true); setDescDraft(section.description) }}
          title="Click to edit section description"
        >
          {section.description || 'Click to add description…'}
        </div>
      )}

      {/* Fields */}
      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        <div className="admin-section-block__fields">
          {fields.length === 0 && (
            <div className="admin-section-block__empty">
              <span>Drop fields here or click &ldquo;Add field&rdquo; below</span>
            </div>
          )}
          {fields.map(field => (
            <FieldCard
              key={field.id}
              field={field}
              isSelected={selectedFieldId === field.id}
              onSelect={() => onSelectField(field.id)}
              onLabelChange={label => onFieldLabelChange(field.id, label)}
              onDelete={() => onDeleteField(field.id)}
            />
          ))}
        </div>
      </SortableContext>

      {/* Add field */}
      <div className="admin-section-block__footer">
        <div className="admin-section-block__add-field-wrap" ref={pickerRef}>
          <button
            type="button"
            className="admin-section-block__add-field-btn"
            onClick={() => setIsPickerOpen(v => !v)}
          >
            + Add field
          </button>

          {isPickerOpen && (
            <>
              <div
                className="admin-field-picker-backdrop"
                onClick={() => setIsPickerOpen(false)}
              />
              <div className="admin-field-picker">
                {FIELD_GROUPS.map(group => (
                  <div key={group.label} className="admin-field-picker__group">
                    <div className="admin-field-picker__group-label">{group.label}</div>
                    <div className="admin-field-picker__items">
                      {group.types.map(type => (
                        <button
                          key={type}
                          type="button"
                          className="admin-field-picker__item"
                          onClick={() => handleAddFieldType(type)}
                        >
                          <span className="admin-field-picker__item-icon">{FIELD_TYPE_ICONS[type]}</span>
                          <span className="admin-field-picker__item-label">{FIELD_TYPE_LABELS[type]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
