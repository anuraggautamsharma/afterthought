'use client'

import { useCallback, useRef } from 'react'
import { useDroppable } from '@dnd-kit/core'
import type { Form, FormSection, FormField, FieldType } from '@/lib/forms'
import SectionBlock from './SectionBlock'

interface Props {
  form: Form
  sections: FormSection[]
  fields: FormField[]
  selectedFieldId: string | null
  isCanvasDropTarget: boolean
  onSelectField: (id: string | null) => void
  onFieldLabelChange: (fieldId: string, label: string) => void
  onDeleteField: (fieldId: string) => void
  onAddField: (sectionId: string, type: FieldType) => void
  onUpdateSection: (sectionId: string, patch: Partial<FormSection>) => void
  onDeleteSection: (sectionId: string) => void
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void
  onFormTitleChange: (title: string) => void
  onFormDescChange: (description: string) => void
  onAddSection: () => void
}

export default function FormCanvas({
  form,
  sections,
  fields,
  selectedFieldId,
  onSelectField,
  onFieldLabelChange,
  onDeleteField,
  onAddField,
  onUpdateSection,
  onDeleteSection,
  onMoveSection,
  onFormTitleChange,
  onFormDescChange,
  onAddSection,
}: Props) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: 'canvas' })
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.admin-field-card, .admin-section-block__title, .admin-section-block__desc')) return
    onSelectField(null)
  }, [onSelectField])

  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div
      ref={setDropRef}
      className={`admin-fb-canvas ${isOver ? 'admin-fb-canvas--drop-active' : ''}`}
      onClick={handleCanvasClick}
    >
      <div className="admin-fb-canvas__paper">
        {/* Form title */}
        <h1
          ref={titleRef}
          className={`admin-fb-canvas__form-title ${!form.title ? 'admin-fb-canvas__form-title--empty' : ''}`}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => {
            const val = e.currentTarget.textContent?.trim() ?? ''
            if (val !== form.title) onFormTitleChange(val || 'Untitled form')
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() }
          }}
          data-placeholder="Form title…"
          spellCheck={false}
        >
          {form.title}
        </h1>

        {/* Form description */}
        <p
          ref={descRef}
          className={`admin-fb-canvas__form-desc ${!form.description ? 'admin-fb-canvas__form-desc--empty' : ''}`}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => {
            const val = e.currentTarget.textContent?.trim() ?? ''
            if (val !== form.description) onFormDescChange(val)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() }
          }}
          data-placeholder="Form description (optional)…"
          spellCheck={false}
        >
          {form.description}
        </p>

        {/* Sections */}
        {sortedSections.length === 0 ? (
          <div className="admin-fb-canvas__empty">
            <div className="admin-fb-canvas__empty-icon">⊞</div>
            <div className="admin-fb-canvas__empty-title">Your form is empty</div>
            <p className="admin-fb-canvas__empty-hint">
              Drag fields from the left panel, or click a field type to add it.
            </p>
          </div>
        ) : (
          <div className="admin-fb-canvas__sections">
            {sortedSections.map((section, index) => {
              const sectionFields = fields
                .filter(f => f.section_id === section.id)
                .sort((a, b) => a.sort_order - b.sort_order)

              return (
                <SectionBlock
                  key={section.id}
                  section={section}
                  sectionIndex={index}
                  fields={sectionFields}
                  selectedFieldId={selectedFieldId}
                  totalSections={sortedSections.length}
                  onSelectField={onSelectField}
                  onFieldLabelChange={onFieldLabelChange}
                  onDeleteField={onDeleteField}
                  onAddField={type => onAddField(section.id, type)}
                  onUpdateSection={patch => onUpdateSection(section.id, patch)}
                  onDeleteSection={() => onDeleteSection(section.id)}
                  onMoveSection={dir => onMoveSection(section.id, dir)}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Section-level action lives in the canvas flow, below the form sheet */}
      <button type="button" className="admin-fb-add-section" onClick={onAddSection}>
        <span className="admin-fb-add-section__plus">+</span>
        Add section
      </button>
    </div>
  )
}
