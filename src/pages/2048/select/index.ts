import {
  type Ref,
  type WatchSource,
  type DeepReadonly,
  defineComponent,
  ref,
  watch,
  provide,
  inject,
} from 'vue'

const KEY = '_select'

interface SelectContext {
  selecting: DeepReadonly<Ref<boolean>>
  selected: DeepReadonly<Ref<number[]>>
  select: (id: number) => void
  unselect: (id: number) => void
  waitUntil: (source: WatchSource<boolean>) => Promise<number[]>
}

export const SelectProvider = defineComponent({
  name: 'SelectProvider',
  setup(_, { slots }) {
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
        if (selecting.value) {
          resolve([])
          return
        }

        selecting.value = true
        const stop = watch(source, () => {
          resolve([...selected.value])
          selecting.value = false
          selected.value = []
          stop()
        })
      })
    }

    provide<SelectContext>(KEY, {
      selecting,
      selected,
      select,
      unselect,
      waitUntil,
    })

    return () => slots.default?.()
  },
})

export function useSelect() {
  const context = inject<SelectContext>(KEY)
  if (context === undefined) {
    throw new Error('useSelect must be used within a SelectProvider')
  }
  return context
}
