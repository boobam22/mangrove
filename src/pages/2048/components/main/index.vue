<script setup lang="tsx">
import { ref, computed, watch, inject } from 'vue'

import { type UseGameReturn } from '../../utils/game'
import CBoard from './CBoard.vue'

const { running, score, moves, isWin, isFailed, newGame } = inject<UseGameReturn>('game')!

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
  <div>
    <div v-if="showResult" class="text-center text-lg text-yellow-900">
      <h1 class="text-4xl font-bold">{{ isWin ? 'You Win' : 'Game Over' }}</h1>
      <p>
        <strong>{{ score }}</strong> points scored in <strong>{{ moves }}</strong> moves.
      </p>
    </div>

    <c-board class="mx-auto my-12" />

    <div v-if="showResult && isFailed">
      <c-button text="Play Again" @click="newGame" />
    </div>
    <div v-else-if="showResult">
      <c-button text="Continue Play" @click="((continuePlay = true), (running = true))" />
      <c-button text="New Game" @click="newGame" />
    </div>
  </div>
</template>
