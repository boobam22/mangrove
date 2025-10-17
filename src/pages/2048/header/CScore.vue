<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: Number, default: 0 },
  showDelta: { type: Boolean, default: false },
})

const delta = ref(0)
watch(
  () => (props.showDelta ? props.value : 0),
  (newValue, oldValue) => {
    delta.value = newValue - oldValue
  },
)
</script>

<template>
  <div class="flex-between rounded-2xl px-2 py-1 font-bold sm:flex-col">
    <div class="text-xs">{{ props.label }}</div>
    <div class="relative z-0 font-extrabold">
      {{ props.value }}
      <transition v-if="delta" name="delta">
        <div
          :key="props.value"
          class="absolute top-1/2 left-full -translate-y-1/2 text-orange-400 opacity-0"
        >
          {{ delta > 0 ? '+' : '' }}{{ delta }}
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/main.css';

.delta-enter-active {
  @apply transition-all duration-500;
}
.delta-enter-from {
  @apply opacity-100;
}
.delta-enter-to {
  transform: translateY(-20px);
}
</style>
