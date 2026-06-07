export type ToastType = 'success' | 'error' | 'info'
export interface ToastItem { id: string; type: ToastType; message: string }

let _listeners: Array<(t: ToastItem[]) => void> = []
let _toasts: ToastItem[] = []

function _emit() { _listeners.forEach(l => l([..._toasts])) }

function _add(type: ToastType, message: string) {
  const id = Math.random().toString(36).slice(2)
  _toasts = [..._toasts, { id, type, message }]
  _emit()
  setTimeout(() => { _toasts = _toasts.filter(t => t.id !== id); _emit() }, 4200)
}

export const toast = {
  success: (m: string) => _add('success', m),
  error:   (m: string) => _add('error', m),
  info:    (m: string) => _add('info', m),
}

export function subscribeToasts(fn: (t: ToastItem[]) => void) {
  _listeners.push(fn)
  return () => { _listeners = _listeners.filter(l => l !== fn) }
}
