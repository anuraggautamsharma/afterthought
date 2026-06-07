'use client'

import { useCallback } from 'react'
import type { FormField, VisibilityRule, VisibilityCondition, ConditionOp } from '@/lib/forms'

const OP_LABELS: Record<ConditionOp, string> = {
  equals: 'equals',
  not_equals: 'does not equal',
  contains: 'contains',
  not_contains: 'does not contain',
  greater_than: 'is greater than',
  less_than: 'is less than',
  is_empty: 'is empty',
  is_not_empty: 'is not empty',
}

const OPS_WITH_VALUE: ConditionOp[] = [
  'equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than',
]

interface Props {
  rule: VisibilityRule | null
  allFields: FormField[]
  currentFieldId: string
  onChange: (rule: VisibilityRule | null) => void
}

export default function ConditionalLogicBuilder({ rule, allFields, currentFieldId, onChange }: Props) {
  const otherFields = allFields.filter(f => f.id !== currentFieldId)

  const enable = useCallback(() => {
    onChange({
      logic: 'and',
      conditions: [{ field_id: otherFields[0]?.id ?? '', op: 'equals', value: '' }],
    })
  }, [onChange, otherFields])

  const disable = useCallback(() => {
    onChange(null)
  }, [onChange])

  const setLogic = useCallback((logic: 'and' | 'or') => {
    if (!rule) return
    onChange({ ...rule, logic })
  }, [rule, onChange])

  const updateCondition = useCallback((index: number, patch: Partial<VisibilityCondition>) => {
    if (!rule) return
    const next = rule.conditions.map((c, i) => i === index ? { ...c, ...patch } : c)
    onChange({ ...rule, conditions: next })
  }, [rule, onChange])

  const addCondition = useCallback(() => {
    if (!rule) return
    onChange({
      ...rule,
      conditions: [
        ...rule.conditions,
        { field_id: otherFields[0]?.id ?? '', op: 'equals', value: '' },
      ],
    })
  }, [rule, onChange, otherFields])

  const removeCondition = useCallback((index: number) => {
    if (!rule) return
    const next = rule.conditions.filter((_, i) => i !== index)
    if (next.length === 0) {
      onChange(null)
    } else {
      onChange({ ...rule, conditions: next })
    }
  }, [rule, onChange])

  if (!rule) {
    return (
      <div className="admin-condition-builder admin-condition-builder--empty">
        <p className="admin-condition-builder__hint">
          This field is always visible. Add conditions to show it only when certain criteria are met.
        </p>
        <button
          type="button"
          className="admin-btn-secondary"
          onClick={enable}
          disabled={otherFields.length === 0}
        >
          + Add condition
        </button>
        {otherFields.length === 0 && (
          <p className="admin-condition-builder__no-fields">
            Add more fields to the form to use conditional logic.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="admin-condition-builder">
      <div className="admin-condition-builder__header">
        <span className="admin-condition-builder__label">Show this field when</span>
        <div className="admin-condition-builder__logic-toggle">
          <button
            type="button"
            className={`admin-condition-builder__logic-btn ${rule.logic === 'and' ? 'is-active' : ''}`}
            onClick={() => setLogic('and')}
          >
            ALL
          </button>
          <button
            type="button"
            className={`admin-condition-builder__logic-btn ${rule.logic === 'or' ? 'is-active' : ''}`}
            onClick={() => setLogic('or')}
          >
            ANY
          </button>
        </div>
        <span className="admin-condition-builder__label">of the following conditions are met:</span>
      </div>

      <div className="admin-condition-builder__conditions">
        {rule.conditions.map((condition, index) => (
          <div key={index} className="admin-condition-row">
            <select
              className="admin-condition-row__field"
              value={condition.field_id}
              onChange={e => updateCondition(index, { field_id: e.target.value })}
            >
              <option value="">Select field…</option>
              {otherFields.map(f => (
                <option key={f.id} value={f.id}>
                  {f.label || `Field ${f.sort_order + 1}`}
                </option>
              ))}
            </select>

            <select
              className="admin-condition-row__op"
              value={condition.op}
              onChange={e => updateCondition(index, { op: e.target.value as ConditionOp })}
            >
              {(Object.keys(OP_LABELS) as ConditionOp[]).map(op => (
                <option key={op} value={op}>{OP_LABELS[op]}</option>
              ))}
            </select>

            {OPS_WITH_VALUE.includes(condition.op) && (
              <input
                type="text"
                className="admin-condition-row__value"
                value={condition.value}
                placeholder="Value…"
                onChange={e => updateCondition(index, { value: e.target.value })}
              />
            )}

            <button
              type="button"
              className="admin-condition-row__remove"
              onClick={() => removeCondition(index)}
              aria-label="Remove condition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="admin-condition-builder__actions">
        <button type="button" className="admin-btn-ghost admin-btn-ghost--sm" onClick={addCondition}>
          + Add condition
        </button>
        <button type="button" className="admin-btn-ghost admin-btn-ghost--sm admin-btn-ghost--danger" onClick={disable}>
          Remove all conditions
        </button>
      </div>
    </div>
  )
}
