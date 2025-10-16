<script setup lang="tsx">
import { type WatchSource, ref, watch, provide, onMounted } from 'vue'

import { useGame } from './utils/game'
import { useSelect } from './utils/select'
import PageHeader from './components/header/index.vue'
import PageMain from './components/main/index.vue'
import CControl from './components/main/CControl.vue'

const game = useGame('tutorial')
provide('game', game)

const step = ref(0)

function onChange(source: WatchSource): Promise<void> {
  return new Promise((resolve) => {
    watch(
      source,
      () => {
        step.value++
        resolve()
      },
      { once: true },
    )
  })
}

onMounted(async () => {
  game.newGame()
  game.board.value.tutorial()

  await onChange(game.moves)
  await onChange(game.score)
  await onChange(() => game.board.value.data.findIndex((tile) => tile.value === 8))
  await onChange(() => game.board.value.data.findIndex((tile) => tile.value === 16))

  game.running.value = false
  game.n_undo.value = 1
  game.n_swap.value = 0
  game.n_remove.value = 0
  await onChange(game.n_undo)

  game.n_swap.value++
  await onChange(game.n_swap)
  step.value = 0
})

const { selecting } = useSelect('main')

function CTitle(props: { text: string }) {
  return <h1 class="text-xl font-bold uppercase">{props.text}</h1>
}

function CArrow(props: { icon: string }) {
  return <icon icon={props.icon} class="size-6 rounded bg-stone-800" />
}

function CNumber(props: { value: string }) {
  return (
    <span class="inline-flex h-6 items-center justify-center rounded bg-stone-800 p-1 text-slate-100">
      {props.value}
    </span>
  )
}
</script>

<template>
  <div class="select-none">
    <page-header class="fixed top-0"></page-header>
    <div
      v-if="step > 0 && !selecting"
      class="mx-auto mt-4 w-110 rounded-xl bg-stone-700 p-4 text-lg text-slate-100"
    >
      <div v-if="step === 1">
        <c-title text="Welcome to 2048" />
        <p>Use the arrow keys to move the tiles.</p>
        <div class="flex gap-2">
          <c-arrow icon="ic:round-arrow-back" />
          <c-arrow icon="ic:round-arrow-forward" />
          <c-arrow icon="ic:round-arrow-downward" />
          <c-arrow icon="ic:round-arrow-upward" />
        </div>
      </div>
      <div v-if="step === 2">
        <c-title text="Make match" />
        <p>The tiles all moved in the same direction and a new one appeared.</p>
        <p>Try moving the <c-number value="2" /> and <c-number value="2" /> towards each other.</p>
      </div>
      <div v-if="step === 3">
        <c-title text="Boom!" />
        <p>Tiles with the same number join when they touch.</p>
        <p>
          Keep going. Can you merge two <c-number value="4" /> tiles into an
          <c-number value="8" /> ?
        </p>
      </div>
      <div v-if="step === 4">
        <p class="mb-1">4 + 4 = 8</p>
        <p>You're getting the hang of it!</p>
        <p>
          Let's increase the difficulty. Merge two <c-number value="8" /> tiles into a
          <c-number value="16" /> tiles.
        </p>
      </div>
      <div v-if="step === 5">
        <c-title text="Need a do-over?" />
        <p>If you make mistakes, you can use undo. Try it out!</p>
      </div>
      <div v-if="step === 6">
        <c-title text="Powerups!" />
        <p>Undo isn't the only powerup you can use. Try “Swap Two Tiles”!</p>
      </div>
    </div>

    <teleport v-if="step === 0" to="body">
      <div class="fixed top-0 z-10 h-full w-full bg-neutral-800/50">
        <div
          class="mx-auto mt-48 max-w-[500px] rounded-2xl bg-neutral-200 p-10 text-center text-lg text-yellow-900"
        >
          <h2 class="text-2xl font-bold">You’re Ready</h2>
          <p>Keep merging the tiles until you get to <c-number value="2048" /></p>
          <p>You'll earn powerups each time</p>
          <p>
            you create a <c-number value="128" /> , <c-number value="256" /> or
            <c-number value="512" /> .
          </p>
          <p>Use them wisely to help you along the way.</p>
          <p class="textxl mt-2 font-bold">Good luck!</p>

          <router-link
            to="/2048"
            class="mt-2 block w-full cursor-pointer rounded-lg border-2 bg-stone-500 py-2 text-slate-100"
            @click="step = 1"
          >
            Start Playing
          </router-link>
        </div>
      </div>
    </teleport>

    <page-main></page-main>
    <c-control v-if="step >= 5"></c-control>
  </div>
</template>
