import { type WatchSource, ref, watch, readonly } from 'vue'

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

export function useSelect() {
  return {
    selecting: readonly(selecting),
    selected: readonly(selected),
    select,
    unselect,
    waitUntil,
  }
}
