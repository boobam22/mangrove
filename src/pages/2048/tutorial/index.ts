import { type Ref, defineComponent, ref, computed, provide, inject } from 'vue'
import { useRoute } from 'vue-router'

const KEY = '_tutorial'

interface TutorialContext {
  step: Ref<number>
  isNotTutorial: Ref<boolean>
}

export const TutorialProvider = defineComponent({
  name: 'TutorialProvider',
  setup(_, { slots }) {
    const route = useRoute()
    const step = ref(0)
    const isNotTutorial = computed(() => route.path !== '/2048/tutorial')

    provide<TutorialContext>(KEY, { step, isNotTutorial })

    return () => slots.default?.()
  },
})

export function useTutorial() {
  const context = inject<TutorialContext>(KEY, { step: ref(0), isNotTutorial: ref(true) })
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider')
  }
  return context
}
