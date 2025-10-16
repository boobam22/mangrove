import { type WatchSource, ref, watch, readonly } from 'vue'

function instance() {
  const selecting = ref(false)
  const selected = ref<number[]>([])

  function select(id: number) {
    if (!selecting.value) return

    if (!selected.value.includes(id)) {
      selected.value.push(id)
    }
  }

  function unselect(id: number) {
    if (!selecting.value) return

    const idx = selected.value.indexOf(id)
    if (idx !== -1) {
      selected.value.splice(idx, 1)
    }
  }

  function waitUntil(source: WatchSource<boolean>) {
    return new Promise<number[]>((resolve) => {
      if (selecting.value) resolve([])

      selecting.value = true
      const stop = watch(source, () => {
        resolve([...selected.value])
        selecting.value = false
        selected.value = []
        stop()
      })
    })
  }

  return {
    selecting: readonly(selecting),
    selected: readonly(selected),
    select,
    unselect,
    waitUntil,
  }
}

const registry = new Map<string, ReturnType<typeof instance>>()

export function useSelect(key: string) {
  if (registry.has(key)) {
    return registry.get(key)!
  } else {
    const ins = instance()
    registry.set(key, ins)
    return ins
  }
}
