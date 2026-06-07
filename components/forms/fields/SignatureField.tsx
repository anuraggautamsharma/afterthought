'use client'

import { useRef, useEffect, useCallback } from 'react'
import SignaturePad from 'signature_pad'
import { FormField } from '@/lib/forms'

interface FieldProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  readOnly?: boolean
}

export default function SignatureField({ field, value, onChange, readOnly }: FieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<SignaturePad | null>(null)

  const disabled = readOnly || field.read_only

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !padRef.current) return
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(ratio, ratio)
    padRef.current.clear()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const pad = new SignaturePad(canvas, {
      backgroundColor: 'rgba(255,255,255,0)',
    })
    padRef.current = pad

    if (disabled) {
      pad.off()
    }

    pad.addEventListener('endStroke', () => {
      onChange(pad.toDataURL())
    })

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Restore existing signature
    if (value && typeof value === 'string' && value.startsWith('data:')) {
      pad.fromDataURL(value)
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      pad.off()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleClear() {
    if (disabled) return
    padRef.current?.clear()
    onChange(null)
  }

  const hasSignature = value && typeof value === 'string' && value.startsWith('data:')

  return (
    <div className="form-signature">
      <div className="form-signature-canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="form-signature-canvas"
          aria-label="Signature pad"
        />
        {!hasSignature && !disabled && (
          <span className="form-signature-placeholder">Sign here</span>
        )}
      </div>
      {!disabled && (
        <button
          type="button"
          className="form-signature-clear"
          onClick={handleClear}
        >
          Clear
        </button>
      )}
    </div>
  )
}
