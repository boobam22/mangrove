import { reactive, watchEffect } from 'vue'

type Primitive = number | string | boolean
type Parser<T> = (s: string) => T
type ParsedValue<T> = T extends Parser<infer U> ? U : T

function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object'
}

function load<T extends Record<string, Primitive | Parser<unknown>>>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key) || ''

  let result: any // eslint-disable-line
  try {
    result = JSON.parse(stored)
  } catch {}

  if (!isObject(result)) {
    result = {}
  }

  Object.entries(defaultValue).forEach(([k, v]) => {
    const current = result[k]

    if (typeof v === 'function') {
      result[k] = (v as Parser<unknown>)(typeof current === 'string' ? current : '')
    } else if (typeof v !== typeof current) {
      result[k] = v
    }
  })

  return result as { [K in keyof T]: ParsedValue<T[K]> }
}

export function useLocalStorage<T extends Record<string, Primitive | Parser<unknown>>>(
  key: string,
  defaultValue: T,
) {
  const data = reactive(load(key, defaultValue))
  watchEffect(() => localStorage.setItem(key, JSON.stringify(data)))
  return data
}
