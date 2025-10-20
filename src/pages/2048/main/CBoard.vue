<script setup lang="tsx">
import { reactive, ref, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue'

import { useGame } from '../game'
import { type Direction } from '../game/board'
import { useSelect } from '../utils/select'

const { running, isFailed, board, handleMove } = useGame()

onActivated(() => {
  running.value = true
})

onDeactivated(() => {
  running.value = false
})

window.addEventListener('keydown', (e) => {
  if (!running.value || isFailed.value) return

  let direction: Direction
  switch (e.key) {
    case 'ArrowUp':
      direction = 'up'
      break
    case 'ArrowDown':
      direction = 'down'
      break
    case 'ArrowLeft':
      direction = 'left'
      break
    case 'ArrowRight':
      direction = 'right'
      break
    default:
      return
  }

  handleMove(direction)
})

const boardRef = ref<HTMLElement | null>(null)
const box = reactive({
  size: 0,
  offset: 0,
  delta: 0,
})

let observer: ResizeObserver | null = null

onMounted(() => {
  const el = boardRef.value
  if (!el) return

  observer = new ResizeObserver(() => {
    const board = el.getBoundingClientRect()
    const tile0 = el.children[0]!.getBoundingClientRect()
    const tile1 = el.children[1]!.getBoundingClientRect()

    box.size = tile0.width
    box.offset = tile0.x - board.x
    box.delta = tile1.x - tile0.x
  })

  observer.observe(el)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

const { selecting, selected, select, unselect } = useSelect()

function clickTile(pos: number) {
  if (!selecting.value) return

  if (selected.value.includes(pos)) {
    unselect(pos)
  } else {
    select(pos)
  }
}

function CTile(props: { value: number; pos: number }) {
  const x = props.pos % 4
  const y = (props.pos - x) / 4

  const width = `${box.size}px`
  const translate = `${box.offset + box.delta * x}px ${box.offset + box.delta * y}px`

  return (
    <div class={`tile absolute tile-${props.value}`} style={{ width, translate }}>
      {props.value}
    </div>
  )
}
</script>

<template>
  <div
    class="relative z-0 mx-auto aspect-square w-96 rounded-2xl bg-stone-400 sm:w-[540px]"
    :class="[selecting && 'opacity-90']"
  >
    <ul ref="boardRef" class="absolute -z-10 grid h-full w-full grid-cols-4 gap-2 p-2">
      <div v-for="(_, idx) in Array(16)" :key="idx" class="tile tile-0"></div>
    </ul>
    <transition-group name="tile" tag="ul">
      <c-tile
        v-for="{ id, value, pos, removed } in board"
        :key="id"
        :value="value"
        :pos="pos"
        :class="[
          removed && 'removed -z-10',
          selected.includes(pos) && 'no-move z-10 scale-125 border-2 border-neutral-950',
          selecting && !selected.includes(pos) && 'no-move hover:scale-110',
        ]"
        @click="() => !removed && clickTile(pos)"
      />
    </transition-group>
  </div>
</template>

<style scoped>
@reference '@/assets/main.css';

@keyframes pop {
  0% {
    opacity: 0;
  }
  50% {
    scale: 1.25;
  }
}
.tile-enter-active {
  animation-name: pop;
  animation-delay: 100ms;
  animation-duration: 100ms;
  animation-fill-mode: both;
}

.tile-leave-active:not(.removed) {
  @apply transition-opacity duration-200;
}
.tile-leave-to {
  @apply opacity-20;
}

.tile-move:not(.no-move) {
  @apply transition-transform duration-100;
}

.tile {
  @apply flex-center aspect-square rounded-xl bg-amber-300 text-2xl font-bold text-amber-50 sm:text-4xl;
}
.tile-0 {
  @apply bg-neutral-500 text-xs text-transparent;
}
.tile-2 {
  @apply bg-amber-50 text-5xl text-stone-500 sm:text-7xl;
}
.tile-4 {
  @apply bg-amber-100 text-5xl text-stone-500 sm:text-7xl;
}
.tile-8 {
  @apply bg-red-400 text-5xl text-amber-50 sm:text-7xl;
}
.tile-16 {
  @apply bg-orange-300 text-4xl text-amber-50 sm:text-6xl;
}
.tile-32 {
  @apply bg-orange-500 text-4xl text-amber-50 sm:text-6xl;
}
.tile-64 {
  @apply bg-amber-500 text-4xl text-amber-50 sm:text-6xl;
}
.tile-128 {
  @apply bg-yellow-400 text-3xl text-amber-50 sm:text-5xl;
}
.tile-256 {
  @apply bg-yellow-700 text-3xl text-amber-50 sm:text-5xl;
}
.tile-512 {
  @apply bg-amber-700 text-3xl text-amber-50 sm:text-5xl;
}
.tile-1024 {
  @apply bg-orange-300 text-2xl text-amber-50 sm:text-4xl;
}
.tile-2048 {
  @apply bg-amber-300 text-2xl text-amber-50 sm:text-4xl;
}
</style>
