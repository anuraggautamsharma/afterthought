'use client'

import { useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FieldOption } from '@/lib/forms'

interface OptionRowProps {
  option: FieldOption
  index: number
  onChange: (index: number, label: string) => void
  onDelete: (index: number) => void
  showImageUrl?: boolean
  onImageUrlChange?: (index: number, url: string) => void
}

function OptionRow({ option, index, onChange, onDelete, showImageUrl, onImageUrlChange }: OptionRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: option.value,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="admin-options-editor__row">
      <button
        type="button"
        className="admin-options-editor__drag-handle"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      <div className="admin-options-editor__inputs">
        <input
          type="text"
          className="admin-options-editor__label-input"
          value={option.label}
          placeholder={`Option ${index + 1}`}
          onChange={e => onChange(index, e.target.value)}
        />
        {showImageUrl && onImageUrlChange && (
          <input
            type="url"
            className="admin-options-editor__image-input"
            value={option.image_url ?? ''}
            placeholder="Image URL (optional)"
            onChange={e => onImageUrlChange(index, e.target.value)}
          />
        )}
      </div>
      <button
        type="button"
        className="admin-options-editor__delete"
        onClick={() => onDelete(index)}
        aria-label="Remove option"
      >
        ✕
      </button>
    </div>
  )
}

interface Props {
  options: FieldOption[]
  onChange: (options: FieldOption[]) => void
  showImageUrl?: boolean
}

export default function OptionsEditor({ options, onChange, showImageUrl = false }: Props) {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = options.findIndex(o => o.value === active.id)
    const newIndex = options.findIndex(o => o.value === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(options, oldIndex, newIndex))
    }
  }, [options, onChange])

  const handleLabelChange = useCallback((index: number, label: string) => {
    const next = [...options]
    next[index] = { ...next[index], label }
    onChange(next)
  }, [options, onChange])

  const handleImageUrlChange = useCallback((index: number, image_url: string) => {
    const next = [...options]
    next[index] = { ...next[index], image_url }
    onChange(next)
  }, [options, onChange])

  const handleDelete = useCallback((index: number) => {
    onChange(options.filter((_, i) => i !== index))
  }, [options, onChange])

  const handleAdd = useCallback(() => {
    const count = options.length + 1
    onChange([
      ...options,
      { label: `Option ${count}`, value: `option_${count}_${Date.now()}` },
    ])
  }, [options, onChange])

  return (
    <div className="admin-options-editor">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={options.map(o => o.value)} strategy={verticalListSortingStrategy}>
          {options.map((option, index) => (
            <OptionRow
              key={option.value}
              option={option}
              index={index}
              onChange={handleLabelChange}
              onDelete={handleDelete}
              showImageUrl={showImageUrl}
              onImageUrlChange={handleImageUrlChange}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button type="button" className="admin-options-editor__add" onClick={handleAdd}>
        + Add option
      </button>
    </div>
  )
}
