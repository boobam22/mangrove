import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const step = ref(0)

export function useTutorial() {
  const route = useRoute()
  const isNotTutorial = computed(() => route.path !== '/2048/tutorial')

  return {
    step,
    isNotTutorial,
  }
}
