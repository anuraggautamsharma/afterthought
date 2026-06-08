'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Link from 'next/link'
import type { Form, FormSection, FormField, FieldType, FormWithContent } from '@/lib/forms'
import { FIELD_TYPE_LABELS, FIELD_TYPE_ICONS } from '@/lib/forms'
import {
  updateFormAction,
  createSectionAction,
  updateSectionAction,
  deleteSectionAction,
  createFieldAction,
  updateFieldAction,
  deleteFieldAction,
  reorderFieldsAction,
} from '@/app/admin/forms/actions'
import { toast } from '@/lib/toastStore'
import { openConfirm } from '@/lib/confirmStore'
import SaveBar from '@/components/admin/SaveBar'
import FieldPalette from './FieldPalette'
import FormCanvas from './FormCanvas'
import FieldSettingsPanel from './FieldSettingsPanel'
import ShareFormButton from './ShareFormButton'

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

function generateTempId() {
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

interface Props {
  initial: FormWithContent
}

export default function FormBuilder({ initial }: Props) {
  const [form, setForm] = useState<Form>(initial.form)
  const [sections, setSections] = useState<FormSection[]>(initial.sections)
  const [fields, setFields] = useState<FormField[]>(initial.fields)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [activeDragType, setActiveDragType] = useState<FieldType | null>(null)
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)

  const formRef = useRef(form)
  const sectionsRef = useRef(sections)
  const fieldsRef = useRef(fields)
  useEffect(() => { formRef.current = form }, [form])
  useEffect(() => { sectionsRef.current = sections }, [sections])
  useEffect(() => { fieldsRef.current = fields }, [fields])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const markDirty = useCallback(() => {
    setIsDirty(true)
    setSaveState('dirty')
  }, [])

  // Save-status helpers for immediate (field/section) persistence
  const markSaving = useCallback(() => setSaveState('saving'), [])
  const markSaved = useCallback(() => { setSaveState('saved'); setSavedAt(new Date()) }, [])
  const markError = useCallback((msg: string) => { setSaveState('error'); setErrorMsg(msg) }, [])

  // ── Auto-save: 2s debounce ────────────────────────────────────────────────
  const save = useCallback(async () => {
    setSaveState('saving')
    setIsDirty(false)
    try {
      await updateFormAction(formRef.current.id, {
        title: formRef.current.title,
        description: formRef.current.description,
        status: formRef.current.status,
        submit_label: formRef.current.submit_label,
        confirmation_type: formRef.current.confirmation_type,
        confirmation_message: formRef.current.confirmation_message,
        redirect_url: formRef.current.redirect_url,
        show_progress: formRef.current.show_progress,
        show_question_numbers: formRef.current.show_question_numbers,
        theme_color: formRef.current.theme_color,
      })
      setSaveState('saved')
      setSavedAt(new Date())
    } catch (err) {
      setSaveState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [])

  useEffect(() => {
    if (!isDirty) return
    const timer = setTimeout(save, 2000)
    return () => clearTimeout(timer)
  }, [isDirty, save])

  // Cmd+S / Ctrl+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        save()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [save])

  // Click outside to deselect
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('.admin-field-card') ||
        target.closest('.admin-fb-settings-panel')
      ) return
      setSelectedFieldId(null)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // ── Form field changes ────────────────────────────────────────────────────
  const handleFormTitleChange = useCallback((title: string) => {
    setForm(f => ({ ...f, title }))
    markDirty()
  }, [markDirty])

  const handleFormDescChange = useCallback((description: string) => {
    setForm(f => ({ ...f, description }))
    markDirty()
  }, [markDirty])

  // ── Sections ──────────────────────────────────────────────────────────────
  const handleAddSection = useCallback(async () => {
    const sortOrder = sectionsRef.current.length
    const tempId = generateTempId()
    const optimistic: FormSection = {
      id: tempId,
      form_id: form.id,
      title: '',
      description: '',
      sort_order: sortOrder,
      skip_logic: [],
      created_at: new Date().toISOString(),
    }
    setSections(prev => [...prev, optimistic])
    try {
      const created = await createSectionAction(form.id, sortOrder)
      setSections(prev => prev.map(s => s.id === tempId ? created : s))
    } catch (err) {
      setSections(prev => prev.filter(s => s.id !== tempId))
      toast.error('Failed to add section')
    }
  }, [form.id])

  const handleUpdateSection = useCallback(async (sectionId: string, patch: Partial<FormSection>) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, ...patch } : s))
    markSaving()
    try {
      await updateSectionAction(sectionId, form.id, patch)
      markSaved()
    } catch {
      markError('Failed to save section')
      toast.error('Failed to update section')
    }
  }, [form.id, markSaving, markSaved, markError])

  const handleDeleteSection = useCallback(async (sectionId: string) => {
    const sectionFields = fieldsRef.current.filter(f => f.section_id === sectionId)
    const confirmed = await openConfirm({
      title: 'Delete section?',
      message: sectionFields.length > 0
        ? `This will also delete ${sectionFields.length} field${sectionFields.length !== 1 ? 's' : ''} in this section. This cannot be undone.`
        : 'This section will be permanently deleted.',
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!confirmed) return

    setSections(prev => prev.filter(s => s.id !== sectionId))
    setFields(prev => prev.filter(f => f.section_id !== sectionId))
    if (selectedFieldId && sectionFields.some(f => f.id === selectedFieldId)) {
      setSelectedFieldId(null)
    }

    try {
      await deleteSectionAction(sectionId, form.id)
    } catch {
      toast.error('Failed to delete section')
    }
  }, [form.id, selectedFieldId])

  const handleMoveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    setSections(prev => {
      const sorted = [...prev].sort((a, b) => a.sort_order - b.sort_order)
      const idx = sorted.findIndex(s => s.id === sectionId)
      if (idx === -1) return prev
      const target = direction === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= sorted.length) return prev
      const moved = arrayMove(sorted, idx, target)
      return moved.map((s, i) => ({ ...s, sort_order: i }))
    })
    markDirty()
  }, [markDirty])

  // ── Fields ────────────────────────────────────────────────────────────────
  const getActiveSectionId = useCallback(() => {
    const sorted = [...sectionsRef.current].sort((a, b) => a.sort_order - b.sort_order)
    if (selectedFieldId) {
      const field = fieldsRef.current.find(f => f.id === selectedFieldId)
      if (field?.section_id) return field.section_id
    }
    return sorted[sorted.length - 1]?.id ?? null
  }, [selectedFieldId])

  const handleAddField = useCallback(async (sectionId: string, type: FieldType) => {
    const sectionFields = fieldsRef.current.filter(f => f.section_id === sectionId)
    const sortOrder = sectionFields.length
    const tempId = generateTempId()
    const label = FIELD_TYPE_LABELS[type]

    const optimistic: FormField = {
      id: tempId,
      form_id: form.id,
      section_id: sectionId,
      type,
      label,
      description: '',
      placeholder: '',
      required: false,
      read_only: false,
      options: [],
      shuffle_options: false,
      min_value: null,
      max_value: null,
      step_value: 1,
      min_length: null,
      max_length: null,
      validation_pattern: '',
      min_label: '',
      max_label: '',
      matrix_config: null,
      file_config: null,
      default_value: null,
      visibility: null,
      sort_order: sortOrder,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setFields(prev => [...prev, optimistic])
    setSelectedFieldId(tempId)
    markSaving()

    try {
      const created = await createFieldAction({
        form_id: form.id,
        section_id: sectionId,
        type,
        label,
        sort_order: sortOrder,
      })
      setFields(prev => prev.map(f => f.id === tempId ? created : f))
      setSelectedFieldId(created.id)
      markSaved()
    } catch {
      setFields(prev => prev.filter(f => f.id !== tempId))
      setSelectedFieldId(null)
      markError('Failed to add field')
      toast.error('Failed to add field')
    }
  }, [form.id, markSaving, markSaved, markError])

  const handlePaletteAdd = useCallback((type: FieldType) => {
    const sectionId = getActiveSectionId()
    if (!sectionId) return
    handleAddField(sectionId, type)
  }, [getActiveSectionId, handleAddField])

  const handleUpdateField = useCallback(async (fieldId: string, patch: Partial<FormField>) => {
    setFields(prev => prev.map(f => f.id === fieldId ? { ...f, ...patch } : f))
    markSaving()
    try {
      await updateFieldAction(fieldId, form.id, patch)
      markSaved()
    } catch {
      markError('Failed to save field')
      toast.error('Failed to update field')
    }
  }, [form.id, markSaving, markSaved, markError])

  const handleDeleteField = useCallback(async (fieldId: string) => {
    const confirmed = await openConfirm({
      title: 'Delete field?',
      message: 'All responses to this field will also be lost. This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!confirmed) return

    setFields(prev => prev.filter(f => f.id !== fieldId))
    if (selectedFieldId === fieldId) setSelectedFieldId(null)
    markSaving()

    try {
      await deleteFieldAction(fieldId, form.id)
      markSaved()
    } catch {
      markError('Failed to delete field')
      toast.error('Failed to delete field')
    }
  }, [form.id, selectedFieldId, markSaving, markSaved, markError])

  const handleFieldLabelChange = useCallback((fieldId: string, label: string) => {
    handleUpdateField(fieldId, { label })
  }, [handleUpdateField])

  // ── DnD ───────────────────────────────────────────────────────────────────
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current
    if (data?.fieldType) {
      setActiveDragType(data.fieldType as FieldType)
    } else {
      setActiveFieldId(String(event.active.id))
    }
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveDragType(null)
    setActiveFieldId(null)
    const { active, over } = event

    // Palette drag -> canvas drop
    const activeData = active.data.current
    if (activeData?.fieldType) {
      // Dropped over a field or section — find section_id
      if (over) {
        const overId = String(over.id)
        const overField = fieldsRef.current.find(f => f.id === overId)
        const sectionId = overField?.section_id ?? getActiveSectionId()
        if (sectionId) {
          handleAddField(sectionId, activeData.fieldType as FieldType)
        }
      }
      return
    }

    // Sortable reorder
    if (!over || active.id === over.id) return
    const oldIndex = fields.findIndex(f => f.id === active.id)
    const newIndex = fields.findIndex(f => f.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const movedField = fields[oldIndex]
    const targetField = fields[newIndex]
    const prevFields = fields // for rollback if the save fails

    setFields(prev => {
      const sectionId = targetField.section_id
      const updated = prev.map(f =>
        f.id === movedField.id ? { ...f, section_id: sectionId } : f
      )
      const sectionFields = updated
        .filter(f => f.section_id === sectionId)
        .sort((a, b) => a.sort_order - b.sort_order)

      const oldSectionIndex = sectionFields.findIndex(f => f.id === movedField.id)
      const newSectionIndex = sectionFields.findIndex(f => f.id === targetField.id)
      const reordered = arrayMove(sectionFields, oldSectionIndex, newSectionIndex)

      const updates = reordered.map((f, i) => ({ ...f, sort_order: i }))
      const updateMap = new Map(updates.map(f => [f.id, f]))
      return updated.map(f => updateMap.get(f.id) ?? f)
    })

    // Persist
    const sectionId = targetField.section_id
    const sectionFields = fields
      .filter(f => f.section_id === sectionId)
      .sort((a, b) => a.sort_order - b.sort_order)
    const movedIdx = sectionFields.findIndex(f => f.id === movedField.id)
    const targetIdx = sectionFields.findIndex(f => f.id === targetField.id)
    const reordered = arrayMove(sectionFields, movedIdx, targetIdx)
    markSaving()
    reorderFieldsAction(
      reordered.map((f, i) => ({ id: f.id, sort_order: i, section_id: sectionId }))
    ).then(res => {
      if (res.ok) {
        markSaved()
      } else {
        setFields(prevFields) // roll back so the UI matches the DB
        markError(res.error || 'Could not save order')
        toast.error('Could not save the new order — please retry')
      }
    }).catch(err => {
      setFields(prevFields)
      const msg = err instanceof Error ? err.message : 'Could not save order'
      markError(msg)
      toast.error('Could not save the new order — please retry')
    })
  }, [fields, getActiveSectionId, handleAddField, markSaving, markSaved, markError])

  const selectedField = fields.find(f => f.id === selectedFieldId) ?? null
  const dragField = activeFieldId ? (fields.find(f => f.id === activeFieldId) ?? null) : null

  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="admin-form-builder">
        {/* Topbar */}
        <div className="admin-form-builder__topbar">
          <div className="admin-form-builder__topbar-left">
            <Link href="/admin/forms" className="admin-editor-back">
              ← Forms
            </Link>
            <h2 className="admin-form-builder__form-name">{form.title || 'Untitled form'}</h2>
            <span className={`admin-status-badge admin-status-badge--${form.status}`}>
              <span className="admin-status-badge__dot" />
              {form.status}
            </span>
          </div>
          <div className="admin-form-builder__topbar-right">
            <SaveBar
              state={saveState}
              savedAt={savedAt}
              errorMsg={errorMsg}
              onRetry={save}
            />
            {form.status === 'draft' && (
              <Link
                href={`/forms/${form.slug}`}
                target="_blank"
                className="admin-btn-ghost"
              >
                Preview ↗
              </Link>
            )}
            {form.status === 'published' && (
              <Link
                href={`/forms/${form.slug}`}
                target="_blank"
                className="admin-btn-ghost"
              >
                View live ↗
              </Link>
            )}
            <ShareFormButton formId={form.id} slug={form.slug} status={form.status} />
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={handleAddSection}
            >
              + Add section
            </button>
          </div>
        </div>

        {/* 3-panel layout */}
        <div className="admin-form-builder__panels">
          {/* Left: Palette */}
          <FieldPalette onAddField={handlePaletteAdd} />

          {/* Center: Canvas */}
          <FormCanvas
            form={form}
            sections={sortedSections}
            fields={fields}
            selectedFieldId={selectedFieldId}
            isCanvasDropTarget={activeDragType !== null}
            onSelectField={setSelectedFieldId}
            onFieldLabelChange={handleFieldLabelChange}
            onDeleteField={handleDeleteField}
            onAddField={handleAddField}
            onUpdateSection={handleUpdateSection}
            onDeleteSection={handleDeleteSection}
            onMoveSection={handleMoveSection}
            onFormTitleChange={handleFormTitleChange}
            onFormDescChange={handleFormDescChange}
          />

          {/* Right: Settings */}
          <div className="admin-fb-settings">
            {selectedField ? (
              <FieldSettingsPanel
                key={selectedField.id}
                field={selectedField}
                allFields={fields}
                onUpdate={patch => handleUpdateField(selectedField.id, patch)}
              />
            ) : (
              <div className="admin-fb-settings__empty">
                <div className="admin-fb-settings__empty-icon">⊟</div>
                <p>Select a field to edit its settings</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18,0.67,0.6,1.22)' }}>
        {activeDragType ? (
          <div className="admin-palette-item admin-palette-item--overlay">
            <span className="admin-palette-item__icon">{FIELD_TYPE_ICONS[activeDragType]}</span>
            <span className="admin-palette-item__label">{FIELD_TYPE_LABELS[activeDragType]}</span>
          </div>
        ) : dragField ? (
          <div className="admin-field-card admin-field-card--overlay">
            <span className="admin-field-card__drag-handle">⠿</span>
            <span className="admin-field-card__icon" aria-hidden="true">{FIELD_TYPE_ICONS[dragField.type]}</span>
            <div className="admin-field-card__content">
              <span className="admin-field-card__label">{dragField.label || 'Untitled field'}</span>
              <div className="admin-field-card__meta">
                <span className="admin-field-card__type-badge">{FIELD_TYPE_LABELS[dragField.type]}</span>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
