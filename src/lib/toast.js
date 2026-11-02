import { useSyncExternalStore } from 'react'

/** 极简提示条：同一时间只显示一条 */
let message = null
let timer = null
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())

export function toast(text, ms = 1800) {
  message = { text, id: Date.now() }
  emit()
  clearTimeout(timer)
  timer = setTimeout(() => {
    message = null
    emit()
  }, ms)
}

export function useToast() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => message,
  )
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}
