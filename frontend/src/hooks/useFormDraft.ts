import { useEffect, useRef } from "react"
import type React from "react"

const DEFAULT_DEBOUNCE_MS = 400

export function useFormDraft<T>(
  key: string,
  active: boolean,
  form: T,
  setForm: React.Dispatch<React.SetStateAction<T>>,
  debounceMs: number = DEFAULT_DEBOUNCE_MS
): void {
  const loadedForKeyRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!active) {
      loadedForKeyRef.current = null
      return
    }
    if (loadedForKeyRef.current === key) return
    loadedForKeyRef.current = key

    try {
      const raw = window.localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw) as T
        setForm(parsed)
      }
    } catch {
    }
  }, [active, key, setForm])

  useEffect(() => {
    if (!active) return

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(form))
      } catch {
      }
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [active, key, form, debounceMs])
}

export function clearFormDraft(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
  }
}
