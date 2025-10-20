<script setup lang="tsx">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useGame } from '../game'
import { SelectProvider } from '../select'
import CHeader from '../header/index.vue'
import CBoard from './CBoard.vue'
import CControl from './control/index.vue'

const route = useRoute()

const { running, score, moves, isWin, isFailed, newGame } = useGame()

const continuePlay = ref(false)
const showResult = computed(() => isFailed.value || (isWin.value && !continuePlay.value))

watch([isWin, isFailed], () => {
  if (!isWin) {
    continuePlay.value = false
  }

  if (showResult.value) {
    running.value = false
  }
})

function CButton(props: { text: string; onClick?: () => void }) {
  return (
    <button
      class="mx-auto my-2 block w-96 cursor-pointer rounded-lg py-2 odd:bg-stone-500 odd:text-gray-100 even:border-2 even:border-stone-500 even:text-stone-500"
      onClick={props.onClick}
    >
      {props.text}
    </button>
  )
}
</script>

<template>
  <select-provider>
    <c-header></c-header>

    <div v-if="showResult" class="mb-4 text-center text-lg text-yellow-900">
      <h1 class="text-4xl font-bold">{{ isWin ? 'You Win' : 'Game Over' }}</h1>
      <p>
        <strong>{{ score }}</strong> points scored in <strong>{{ moves }}</strong> moves.
      </p>
    </div>

    <c-board class="my-12" />

    <div v-if="showResult" class="mt-8">
      <div v-if="isFailed">
        <c-button text="Play Again" @click="newGame" />
      </div>
      <div v-else>
        <c-button text="Continue Play" @click="((continuePlay = true), (running = true))" />
        <c-button text="New Game" @click="newGame" />
      </div>
    </div>

    <c-control v-else-if="route.path !== '/2048/classic'"></c-control>
  </select-provider>
</template>
