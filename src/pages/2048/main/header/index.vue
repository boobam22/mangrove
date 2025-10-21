<script setup lang="tsx">
import { type SetupContext, ref } from 'vue'

import { useGame } from '../../game'
import { useTutorial } from '../../tutorial'
import { showNewGameConfirm } from './confirm'
import CMenu from './CMenu.vue'
import CScore from './CScore.vue'

const { isNotTutorial } = useTutorial()

const { running, score, best, newGame } = useGame()

function confirmAndNewGame() {
  const oldValue = running.value
  running.value = false

  showNewGameConfirm()
    .then((confirm) => confirm && newGame())
    .finally(() => {
      running.value = oldValue
    })
}

const showMenu = ref(false)

window.addEventListener('click', () => {
  if (showMenu.value) {
    showMenu.value = false
  }
})

function MenuEntry(_: unknown, { slots }: SetupContext) {
  return (
    <div
      class={['relative z-10 rounded-lg hover:bg-stone-300', showMenu.value && 'bg-stone-300']}
      onClick={(e) => {
        e.stopPropagation()
        showMenu.value = !showMenu.value
      }}
    >
      {slots.default?.()}
      {showMenu.value && <CMenu class="absolute top-full left-0 w-80 translate-y-2" />}
    </div>
  )
}
</script>

<template>
  <div class="text-yellow-900">
    <div class="min-md:hidden">
      <div class="flex-between p-2 sm:px-4">
        <menu-entry>
          <icon icon="ic:round-menu" class="size-6" />
        </menu-entry>
        <h1 v-if="isNotTutorial" class="text-3xl font-black">2048</h1>
        <icon
          v-if="isNotTutorial"
          icon="ic:round-refresh"
          class="size-6 cursor-pointer"
          @click="confirmAndNewGame"
        />
      </div>
      <div v-if="isNotTutorial" class="flex-between gap-2 px-4">
        <c-score label="SCORE" :value="score" show-delta class="flex-1 bg-stone-200" />
        <c-score label="BEST" :value="best" class="flex-1 border-3 border-stone-200" />
      </div>
    </div>

    <div class="max-md:hidden">
      <div class="flex-between p-4">
        <menu-entry>
          <div class="flex-between gap-2 px-2">
            <icon icon="ic:round-menu" class="size-6" />
            <h1 class="text-4xl font-black">2048</h1>
          </div>
        </menu-entry>
        <div v-if="isNotTutorial" class="flex-between gap-3">
          <c-score label="SCORE" :value="score" show-delta class="score bg-stone-200" />
          <c-score label="BEST" :value="best" class="score border-3 border-stone-200" />
        </div>
        <div
          v-if="isNotTutorial"
          class="cursor-pointer rounded-lg bg-stone-500 p-2 text-gray-100"
          @click="confirmAndNewGame"
        >
          New Game
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/main.css';

.score {
  @apply px-4;
}
</style>
