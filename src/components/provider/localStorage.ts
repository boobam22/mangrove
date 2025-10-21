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
    const storageValue = ref(window.localStorage.getItem(storageKey) ?? defaultValue)
    provide(KEY, storageValue)

    watch(storageValue, (newValue) => {
      window.localStorage.setItem(storageKey, newValue)
    })

    function handleStorage(e: StorageEvent) {
      if (e.key === storageKey) {
        storageValue.value = e.newValue ?? defaultValue
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
