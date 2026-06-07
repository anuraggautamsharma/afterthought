'use client'

import { useState, useCallback } from 'react'
import type { FormField, FieldType, VisibilityRule, MatrixConfig, FileConfig } from '@/lib/forms'
import OptionsEditor from './OptionsEditor'
import ConditionalLogicBuilder from './ConditionalLogicBuilder'

const OPTION_TYPES: FieldType[] = ['radio', 'checkboxes', 'dropdown', 'image_choice', 'ranking']
const SCALE_TYPES: FieldType[] = ['linear_scale', 'slider']
const TEXT_LENGTH_TYPES: FieldType[] = ['short_text', 'paragraph']
const NUMBER_TYPES: FieldType[] = ['number']

interface Props {
  field: FormField
  allFields: FormField[]
  onUpdate: (patch: Partial<FormField>) => void
}

export default function FieldSettingsPanel({ field, allFields, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<'settings' | 'logic'>('settings')

  const update = useCallback((patch: Partial<FormField>) => {
    onUpdate(patch)
  }, [onUpdate])

  const isOptionType = OPTION_TYPES.includes(field.type)
  const isScaleType = SCALE_TYPES.includes(field.type)
  const isTextLengthType = TEXT_LENGTH_TYPES.includes(field.type)
  const isNumberType = NUMBER_TYPES.includes(field.type)
  const isStarRating = field.type === 'star_rating'
  const isMatrix = field.type === 'matrix'
  const isFileUpload = field.type === 'file_upload'

  const matrixConfig: MatrixConfig = field.matrix_config ?? { rows: ['Row 1', 'Row 2'], columns: ['Col 1', 'Col 2', 'Col 3'], multi: false }
  const fileConfig: FileConfig = field.file_config ?? { accepted_types: [], max_size_mb: 10, max_files: 1 }

  return (
    <div className="admin-fb-settings-panel">
      <div className="admin-fb-settings-panel__tabs">
        <button
          type="button"
          className={`admin-fb-settings-panel__tab ${activeTab === 'settings' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button
          type="button"
          className={`admin-fb-settings-panel__tab ${activeTab === 'logic' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('logic')}
        >
          Logic
          {field.visibility && (
            <span className="admin-fb-settings-panel__tab-dot" title="Conditional logic active" />
          )}
        </button>
      </div>

      <div className="admin-fb-settings-panel__body">
        {activeTab === 'settings' && (
          <div className="admin-fb-settings-panel__settings">

            {/* Common settings */}
            <div className="admin-field">
              <label>Label</label>
              <input
                type="text"
                value={field.label}
                placeholder="Field label"
                onChange={e => update({ label: e.target.value })}
              />
            </div>

            <div className="admin-field">
              <label>Description</label>
              <textarea
                value={field.description}
                placeholder="Helper text shown below the label"
                rows={2}
                onChange={e => update({ description: e.target.value })}
              />
            </div>

            {!isOptionType && !isMatrix && field.type !== 'signature' && (
              <div className="admin-field">
                <label>Placeholder</label>
                <input
                  type="text"
                  value={field.placeholder}
                  placeholder="Placeholder text"
                  onChange={e => update({ placeholder: e.target.value })}
                />
              </div>
            )}

            <div className="admin-field admin-field--toggle">
              <label>Required</label>
              <button
                type="button"
                className={`admin-toggle ${field.required ? 'is-on' : ''}`}
                onClick={() => update({ required: !field.required })}
                aria-pressed={field.required}
              >
                <span className="admin-toggle__knob" />
              </button>
            </div>

            <div className="admin-field admin-field--toggle">
              <label>Read only</label>
              <button
                type="button"
                className={`admin-toggle ${field.read_only ? 'is-on' : ''}`}
                onClick={() => update({ read_only: !field.read_only })}
                aria-pressed={field.read_only}
              >
                <span className="admin-toggle__knob" />
              </button>
            </div>

            {/* Type-specific settings */}
            {(isOptionType || isMatrix) && (
              <div className="admin-fb-settings-panel__divider" />
            )}

            {isOptionType && (
              <>
                <div className="admin-field">
                  <label>Options</label>
                  <OptionsEditor
                    options={field.options}
                    onChange={options => update({ options })}
                    showImageUrl={field.type === 'image_choice'}
                  />
                </div>
                <div className="admin-field admin-field--toggle">
                  <label>Shuffle options</label>
                  <button
                    type="button"
                    className={`admin-toggle ${field.shuffle_options ? 'is-on' : ''}`}
                    onClick={() => update({ shuffle_options: !field.shuffle_options })}
                    aria-pressed={field.shuffle_options}
                  >
                    <span className="admin-toggle__knob" />
                  </button>
                </div>
              </>
            )}

            {isScaleType && (
              <>
                <div className="admin-fb-settings-panel__divider" />
                <div className="admin-field-group">
                  <div className="admin-field">
                    <label>Min value</label>
                    <input
                      type="number"
                      value={field.min_value ?? ''}
                      onChange={e => update({ min_value: e.target.value === '' ? null : Number(e.target.value) })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Max value</label>
                    <input
                      type="number"
                      value={field.max_value ?? ''}
                      onChange={e => update({ max_value: e.target.value === '' ? null : Number(e.target.value) })}
                    />
                  </div>
                </div>
                {field.type === 'slider' && (
                  <div className="admin-field">
                    <label>Step</label>
                    <input
                      type="number"
                      value={field.step_value}
                      min={1}
                      onChange={e => update({ step_value: Number(e.target.value) })}
                    />
                  </div>
                )}
                {field.type === 'linear_scale' && (
                  <div className="admin-field-group">
                    <div className="admin-field">
                      <label>Min label</label>
                      <input
                        type="text"
                        value={field.min_label}
                        placeholder="e.g. Not at all"
                        onChange={e => update({ min_label: e.target.value })}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Max label</label>
                      <input
                        type="text"
                        value={field.max_label}
                        placeholder="e.g. Extremely"
                        onChange={e => update({ max_label: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {isStarRating && (
              <>
                <div className="admin-fb-settings-panel__divider" />
                <div className="admin-field">
                  <label>Stars (max)</label>
                  <input
                    type="number"
                    value={field.max_value ?? 5}
                    min={3}
                    max={10}
                    onChange={e => update({ max_value: Number(e.target.value) })}
                  />
                </div>
              </>
            )}

            {isTextLengthType && (
              <>
                <div className="admin-fb-settings-panel__divider" />
                <div className="admin-field-group">
                  <div className="admin-field">
                    <label>Min length</label>
                    <input
                      type="number"
                      value={field.min_length ?? ''}
                      placeholder="—"
                      onChange={e => update({ min_length: e.target.value === '' ? null : Number(e.target.value) })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Max length</label>
                    <input
                      type="number"
                      value={field.max_length ?? ''}
                      placeholder="—"
                      onChange={e => update({ max_length: e.target.value === '' ? null : Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="admin-field">
                  <label>Validation pattern</label>
                  <input
                    type="text"
                    value={field.validation_pattern}
                    placeholder="RegEx pattern (optional)"
                    onChange={e => update({ validation_pattern: e.target.value })}
                  />
                  <span className="admin-field__hint">Applied as a regex when validating responses.</span>
                </div>
              </>
            )}

            {isNumberType && (
              <>
                <div className="admin-fb-settings-panel__divider" />
                <div className="admin-field-group">
                  <div className="admin-field">
                    <label>Min</label>
                    <input
                      type="number"
                      value={field.min_value ?? ''}
                      placeholder="—"
                      onChange={e => update({ min_value: e.target.value === '' ? null : Number(e.target.value) })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Max</label>
                    <input
                      type="number"
                      value={field.max_value ?? ''}
                      placeholder="—"
                      onChange={e => update({ max_value: e.target.value === '' ? null : Number(e.target.value) })}
                    />
                  </div>
                </div>
              </>
            )}

            {isMatrix && (
              <>
                <div className="admin-fb-settings-panel__divider" />
                <div className="admin-field">
                  <label>Rows</label>
                  {matrixConfig.rows.map((row, i) => (
                    <div key={i} className="admin-matrix-row-input">
                      <input
                        type="text"
                        value={row}
                        onChange={e => {
                          const rows = [...matrixConfig.rows]
                          rows[i] = e.target.value
                          update({ matrix_config: { ...matrixConfig, rows } })
                        }}
                      />
                      <button
                        type="button"
                        className="admin-matrix-row-input__remove"
                        onClick={() => {
                          const rows = matrixConfig.rows.filter((_, j) => j !== i)
                          update({ matrix_config: { ...matrixConfig, rows } })
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="admin-btn-ghost admin-btn-ghost--sm"
                    onClick={() => update({ matrix_config: { ...matrixConfig, rows: [...matrixConfig.rows, `Row ${matrixConfig.rows.length + 1}`] } })}
                  >
                    + Add row
                  </button>
                </div>
                <div className="admin-field">
                  <label>Columns</label>
                  {matrixConfig.columns.map((col, i) => (
                    <div key={i} className="admin-matrix-row-input">
                      <input
                        type="text"
                        value={col}
                        onChange={e => {
                          const columns = [...matrixConfig.columns]
                          columns[i] = e.target.value
                          update({ matrix_config: { ...matrixConfig, columns } })
                        }}
                      />
                      <button
                        type="button"
                        className="admin-matrix-row-input__remove"
                        onClick={() => {
                          const columns = matrixConfig.columns.filter((_, j) => j !== i)
                          update({ matrix_config: { ...matrixConfig, columns } })
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="admin-btn-ghost admin-btn-ghost--sm"
                    onClick={() => update({ matrix_config: { ...matrixConfig, columns: [...matrixConfig.columns, `Col ${matrixConfig.columns.length + 1}`] } })}
                  >
                    + Add column
                  </button>
                </div>
                <div className="admin-field admin-field--toggle">
                  <label>Allow multiple per row</label>
                  <button
                    type="button"
                    className={`admin-toggle ${matrixConfig.multi ? 'is-on' : ''}`}
                    onClick={() => update({ matrix_config: { ...matrixConfig, multi: !matrixConfig.multi } })}
                    aria-pressed={matrixConfig.multi}
                  >
                    <span className="admin-toggle__knob" />
                  </button>
                </div>
              </>
            )}

            {isFileUpload && (
              <>
                <div className="admin-fb-settings-panel__divider" />
                <div className="admin-field">
                  <label>Accepted types</label>
                  <input
                    type="text"
                    value={fileConfig.accepted_types.join(', ')}
                    placeholder="e.g. .pdf, .png, image/*"
                    onChange={e => {
                      const accepted_types = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      update({ file_config: { ...fileConfig, accepted_types } })
                    }}
                  />
                  <span className="admin-field__hint">Comma-separated MIME types or extensions.</span>
                </div>
                <div className="admin-field-group">
                  <div className="admin-field">
                    <label>Max size (MB)</label>
                    <input
                      type="number"
                      value={fileConfig.max_size_mb}
                      min={1}
                      onChange={e => update({ file_config: { ...fileConfig, max_size_mb: Number(e.target.value) } })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Max files</label>
                    <input
                      type="number"
                      value={fileConfig.max_files}
                      min={1}
                      onChange={e => update({ file_config: { ...fileConfig, max_files: Number(e.target.value) } })}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'logic' && (
          <div className="admin-fb-settings-panel__logic">
            <ConditionalLogicBuilder
              rule={field.visibility}
              allFields={allFields}
              currentFieldId={field.id}
              onChange={(visibility: VisibilityRule | null) => update({ visibility })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
