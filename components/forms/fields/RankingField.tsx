'use client'

import { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FormField, FieldOption } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

interface SortableItemProps {
  id: string
  label: string
  index: number
  disabled: boolean
}

function SortableItem({ id, label, index, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`form-ranking-item${isDragging ? ' form-ranking-item--dragging' : ''}`}
    >
      <span className="form-ranking-item__index">{index + 1}</span>
      {!disabled && (
        <span
          className="form-ranking-item__handle"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          ⠿
        </span>
      )}
      <span className="form-ranking-item__label">{label}</span>
    </li>
  )
}

export default function RankingField({ field, value, onChange, readOnly }: FieldProps) {
  const disabled = readOnly || field.read_only
  const options: FieldOption[] = field.options ?? []

  const defaultOrder = options.map(o => o.value)
  const [order, setOrder] = useState<string[]>(() => {
    if (Array.isArray(value) && (value as string[]).length > 0) {
      return value as string[]
    }
    return defaultOrder
  })

  // Sync value to parent on mount
  useEffect(() => {
    if (!value || (Array.isArray(value) && (value as string[]).length === 0)) {
      onChange(defaultOrder)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = order.indexOf(String(active.id))
    const newIndex = order.indexOf(String(over.id))
    const next = arrayMove(order, oldIndex, newIndex)
    setOrder(next)
    onChange(next)
  }

  const labelMap = Object.fromEntries(options.map(o => [o.value, o.label]))

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <ul className="form-ranking-list">
          {order.map((val, i) => (
            <SortableItem
              key={val}
              id={val}
              label={labelMap[val] ?? val}
              index={i}
              disabled={disabled}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
