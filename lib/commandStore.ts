// Tiny pub/sub store to open/close the command palette from anywhere.
let _listeners: Array<(open: boolean) => void> = []
let _open = false

function _emit() { _listeners.forEach(l => l(_open)) }

export const commandPalette = {
  open() { _open = true; _emit() },
  close() { _open = false; _emit() },
  toggle() { _open = !_open; _emit() },
}

export function subscribeCommand(fn: (open: boolean) => void) {
  _listeners.push(fn)
  return () => { _listeners = _listeners.filter(l => l !== fn) }
}
