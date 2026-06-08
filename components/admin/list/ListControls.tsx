'use client'

import type { ReactNode } from 'react'
import Icon from '@/components/Icon'

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) {
  return (
    <label className="admin-checkbox" onClick={e => e.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
      <span className="admin-checkbox__box" />
    </label>
  )
}

export function SearchField({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="admin-search-field">
      <Icon name="search" size={18} className="admin-search-field__icon" />
      <input
        className="admin-search-field__input"
        placeholder={placeholder ?? 'Search…'}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button className="admin-search-field__clear" onClick={() => onChange('')} aria-label="Clear search">
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  )
}

export function SortSelect<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: { value: T; label: string }[]
}) {
  return (
    <label className="admin-sort">
      <span className="admin-sort__label">Sort</span>
      <select className="admin-sort__select" value={value} onChange={e => onChange(e.target.value as T)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}

export function ListToolbar({ tabs, children }: { tabs?: ReactNode; children: ReactNode }) {
  return (
    <div className="admin-toolbar">
      <div className="admin-toolbar__left">{tabs}</div>
      <div className="admin-toolbar__right">{children}</div>
    </div>
  )
}

export function BulkBar({ count, onClear, children }: { count: number; onClear: () => void; children: ReactNode }) {
  return (
    <div className="admin-bulkbar">
      <span className="admin-bulkbar__count">{count} selected</span>
      <div className="admin-bulkbar__actions">{children}</div>
      <button className="admin-bulkbar__clear" onClick={onClear}>Clear</button>
    </div>
  )
}

export function TableHead({ allSelected, onToggleAll, label }: {
  allSelected: boolean; onToggleAll: () => void; label: string
}) {
  return (
    <div className="admin-table-head">
      <Checkbox checked={allSelected} onChange={onToggleAll} label="Select all" />
      <span className="admin-table-head__label">{label}</span>
    </div>
  )
}
