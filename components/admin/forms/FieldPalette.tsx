'use client'

import { useCallback } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { FIELD_GROUPS, FIELD_TYPE_ICONS, FIELD_TYPE_LABELS } from '@/lib/forms'
import type { FieldType } from '@/lib/forms'

interface PaletteItemProps {
  type: FieldType
  onAdd: (type: FieldType) => void
}

function PaletteItem({ type, onAdd }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { fieldType: type },
  })

  return (
    <div
      ref={setNodeRef}
      className={`admin-palette-item ${isDragging ? 'admin-palette-item--dragging' : ''}`}
      {...listeners}
      {...attributes}
      onClick={() => onAdd(type)}
      title={FIELD_TYPE_LABELS[type]}
    >
      <span className="admin-palette-item__icon" aria-hidden="true">
        {FIELD_TYPE_ICONS[type]}
      </span>
      <span className="admin-palette-item__label">{FIELD_TYPE_LABELS[type]}</span>
    </div>
  )
}

interface Props {
  onAddField: (type: FieldType) => void
}

export default function FieldPalette({ onAddField }: Props) {
  const handleAdd = useCallback((type: FieldType) => {
    onAddField(type)
  }, [onAddField])

  return (
    <div className="admin-fb-palette">
      <div className="admin-fb-palette__header">
        <span className="admin-fb-palette__title">Fields</span>
      </div>
      <div className="admin-fb-palette__body">
        {FIELD_GROUPS.map(group => (
          <div key={group.label} className="admin-palette-group">
            <div className="admin-palette-group__label">{group.label}</div>
            <div className="admin-palette-group__items">
              {group.types.map(type => (
                <PaletteItem key={type} type={type} onAdd={handleAdd} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
