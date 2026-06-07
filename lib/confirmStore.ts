export interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  danger?: boolean
}

type Resolver = (v: boolean) => void
let _resolve: Resolver | null = null
let _listeners: Array<(o: ConfirmOptions | null) => void> = []

export function openConfirm(opts: ConfirmOptions): Promise<boolean> {
  return new Promise(resolve => {
    _resolve = resolve
    _listeners.forEach(l => l(opts))
  })
}

export function resolveConfirm(v: boolean) {
  _resolve?.(v)
  _resolve = null
  _listeners.forEach(l => l(null))
}

export function subscribeConfirm(fn: (o: ConfirmOptions | null) => void) {
  _listeners.push(fn)
  return () => { _listeners = _listeners.filter(l => l !== fn) }
}
