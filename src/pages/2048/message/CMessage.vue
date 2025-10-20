<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  buttonText: { type: String, default: 'OK' },
  duration: { type: Number, default: 2 },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

if (props.duration > 0) {
  setTimeout(() => emit('close'), props.duration * 1000)
}
</script>

<template>
  <div
    class="flex-between fixed top-0 left-1/2 mt-8 -translate-x-1/2 gap-4 rounded-xl bg-stone-700 px-4 py-1"
  >
    <div class="flex min-h-12 min-w-48 flex-col justify-center text-lg text-slate-100">
      <h1 class="text-lg font-bold">{{ title }}</h1>
      <p v-if="desc">{{ desc }}</p>
      <slot v-else name="desc"></slot>
    </div>
    <button
      class="min-w-16 cursor-pointer rounded bg-stone-300 px-2 text-xl text-stone-900"
      @click="emit('close')"
    >
      {{ buttonText }}
    </button>
  </div>
</template>
