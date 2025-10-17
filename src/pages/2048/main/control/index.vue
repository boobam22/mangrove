<script setup lang="tsx">
import { ref, computed, inject } from 'vue'

import { type UseGameReturn } from '../../game'
import { useSelect } from '../../utils/select'
import { message } from '../../message'
import CButton from './CButton.vue'

const { n_undo, n_swap, n_remove, undo, swapTile, removeTile } = inject<UseGameReturn>('game')!

const mode = ref<'remove' | 'swap' | 'normal'>('normal')

const { selected, waitUntil } = useSelect()

function clickUndo() {
  mode.value = 'normal'
  undo()
}

function clickSwap() {
  if (!n_swap.value || mode.value === 'swap') return
  mode.value = 'swap'

  const close = message({
    title: 'SWAP TWO TILES',
    desc: computed(
      () => `Choose the ${selected.value.length === 1 ? 'second' : 'first'} tile`,
    ) as unknown as string,
    buttonText: 'cancel',
    duration: 0,
    onClose: cancel,
  })

  waitUntil(() => selected.value.length === 2 || mode.value !== 'swap')
    .then((idxs) => {
      if (idxs.length === 2) {
        swapTile(idxs[0]!, idxs[1]!)
        mode.value = 'normal'
      }
    })
    .finally(close)
}

function clickRemove() {
  if (!n_remove.value || mode.value === 'remove') return
  mode.value = 'remove'

  const close = message({
    title: 'DELETE TILE',
    desc: 'Choose the tile to delete',
    buttonText: 'cancel',
    duration: 0,
    onClose: cancel,
  })

  waitUntil(() => selected.value.length === 1 || mode.value !== 'remove')
    .then((idxs) => {
      if (idxs.length === 1) {
        removeTile(idxs[0]!)
        mode.value = 'normal'
      }
    })
    .finally(close)
}

function cancel() {
  mode.value = 'normal'
}
</script>

<template>
  <div
    class="fixed bottom-20 left-1/2 z-0 flex w-fit -translate-x-1/2 gap-3 rounded-2xl bg-stone-400 p-3 pb-6"
  >
    <c-button
      icon="ic:baseline-undo"
      title="UNDO"
      desc="Make a 128 tile to get more uses"
      :n="n_undo"
      @click="clickUndo"
    />
    <c-button
      icon="ic:round-swap-vert"
      title="SWAP TWO TILES"
      desc="Make a 512 tile to get more uses"
      :active="mode === 'swap'"
      :n="n_swap"
      @click="clickSwap"
      @cancel="cancel"
    />
    <c-button
      icon="ic:outline-delete"
      title="DELETE TILE BY NUMBER"
      desc="Make a 1024 tile to get more uses"
      :active="mode === 'remove'"
      :n="n_remove"
      @click="clickRemove"
      @cancel="cancel"
    />
  </div>
</template>
