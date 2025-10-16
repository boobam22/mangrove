<script setup lang="ts">
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="fixed top-0 h-full w-full bg-neutral-800/50">
    <div
      class="mx-auto mt-48 max-w-[500px] rounded-2xl bg-neutral-200 p-10 text-center text-lg text-yellow-900"
    >
      <h2 class="text-2xl font-bold">New Game</h2>
      <p>Are you sure you want to start a new game?</p>
      <p>All progress will be lost.</p>

      <button
        class="mt-10 w-full cursor-pointer rounded-lg bg-stone-500 py-2 text-gray-100"
        @click="emit('confirm')"
      >
        Start New Game
      </button>
      <button
        class="mt-2 w-full cursor-pointer rounded-lg border-2 border-stone-500 py-2 text-stone-500"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
