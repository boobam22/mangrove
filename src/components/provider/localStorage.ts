import {
  type Ref,
  defineComponent,
  ref,
  provide,
  inject,
  onMounted,
  onBeforeUnmount,
  watch,
} from 'vue'

const KEY = '_storageValue'

export const LocalStorageProvider = defineComponent({
  name: 'LocalStorageProvider',
  props: {
    storageKey: { type: String, required: true },
    defaultValue: { type: String, default: '' },
  },
  setup({ storageKey, defaultValue }, { slots }) {
    const initValue = window.localStorage.getItem(storageKey) ?? defaultValue
    const storageValue = ref(initValue)
    provide(KEY, storageValue)

    watch(storageValue, (newValue) => {
      window.localStorage.setItem(storageKey, newValue)
    })

    function handleStorage(e: StorageEvent) {
      if (e.key === storageKey) {
        storageValue.value = e.newValue ?? initValue
      }
    }

    onMounted(() => window.addEventListener('storage', handleStorage))
    onBeforeUnmount(() => window.removeEventListener('storage', handleStorage))

    return () => slots.default?.()
  },
})

export function useLocalStorage() {
  const context = inject<Ref<string>>(KEY)
  if (context === undefined) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider')
  }
  return context
}
