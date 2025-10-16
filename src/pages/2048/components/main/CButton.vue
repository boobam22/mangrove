<script setup lang="ts">
defineProps({
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  icon: { type: String, default: '' },
  n: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="relative">
    <div
      :class="[
        'peer cursor-pointer rounded-xl bg-stone-500 p-3 text-slate-100 transition-transform',
        active ? '-translate-y-15' : 'hover:-translate-y-2',
      ]"
    >
      <Icon key="action" :icon="icon" :class="['size-10', n === 0 && 'opacity-20']" />

      <Icon
        v-if="active"
        icon="ic:round-clear"
        class="absolute top-full left-1/2 size-6 -translate-x-1/2 translate-y-6 rounded-2xl bg-stone-800"
        @click.stop="emit('cancel')"
      />
    </div>

    <div
      v-if="!active"
      class="absolute -top-full left-1/2 z-10 hidden -translate-x-1/2 -translate-y-4 rounded-lg bg-stone-800 p-3 text-xs font-light text-nowrap text-slate-50 peer-hover:block"
    >
      <div class="flex items-end gap-2">
        <div class="text-sm font-bold">{{ title }}</div>
        <div>{{ n }} uses left</div>
      </div>
      <div class="mt-1">{{ desc }}</div>
    </div>

    <div v-if="!active" class="absolute top-full left-0 flex w-full translate-y-2 gap-1 px-1">
      <div :class="['h-1 flex-1 rounded bg-stone-500', n === 0 && 'opacity-50']"></div>
      <div :class="['h-1 flex-1 rounded bg-stone-500', n <= 1 && 'opacity-50']"></div>
    </div>
  </div>
</template>
