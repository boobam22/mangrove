import { type Ref, defineComponent, ref, provide, inject } from 'vue'

import { useLocalStorage, LocalStorageProvider } from '@/components/provider/localStorage'
import Game from './game'
import { type Direction } from './board'
import Tile from './tile'

class GameContext {
  private storage: Ref<string>
  private game: Game

  running = ref(false)
  score = ref(0)
  best = ref(0)
  moves = ref(0)
  n_undo = ref(0)
  n_swap = ref(0)
  n_remove = ref(0)
  isWin = ref(false)
  isFailed = ref(false)
  board = ref<Tile[]>([])

  constructor(storage: Ref<string>) {
    this.storage = storage
    this.game = Game.fromJSON(storage.value)
    this.markDirty()

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      const val = (this as any)[key] // eslint-disable-line
      if (key !== 'constructor' && typeof val === 'function') {
        ;(this as any)[key] = val.bind(this) // eslint-disable-line
      }
    }
  }

  private markDirty() {
    this.running.value = this.game.running
    this.score.value = this.game.score
    this.best.value = this.game.best
    this.moves.value = this.game.moves
    this.n_undo.value = this.game.n_undo
    this.n_swap.value = this.game.n_swap
    this.n_remove.value = this.game.n_remove
    this.isWin.value = this.game.isWin
    this.isFailed.value = this.game.isFailed
    this.board.value = this.game.board.data

    this.storage.value = this.game.toJSON()
  }

  newGame() {
    this.game.newGame()
    this.markDirty()
  }

  handleMove(direction: Direction) {
    if (this.game.handleMove(direction)) this.markDirty()
  }

  undo() {
    if (this.game.undo()) this.markDirty()
  }

  swapTile(pos1: number, pos2: number) {
    if (this.game.swapTile(pos1, pos2)) this.markDirty()
  }

  removeTile(pos: number) {
    if (this.game.removeTile(pos)) this.markDirty()
  }

  tutorial() {
    this.game.tutorial()
    this.markDirty()
  }
}

const KEY = '_game'

const _GameProvider = defineComponent({
  name: 'GameProvider',
  setup(_, { slots }) {
    const storage = useLocalStorage()
    const context = new GameContext(storage)

    provide<GameContext>(KEY, context)

    return () => slots.default?.()
  },
})

export function useGame() {
  const context = inject<GameContext>(KEY)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export const GameProvider = defineComponent({
  props: { storageKey: { type: String, required: true } },
  setup({ storageKey }, { slots }) {
    return () => (
      <LocalStorageProvider storageKey={storageKey}>
        <_GameProvider>{slots.default?.()}</_GameProvider>
      </LocalStorageProvider>
    )
  },
})
