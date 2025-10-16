import { reactive, toRefs } from 'vue'

import { useLocalStorage } from '@/utils/localStorage'
import { FixedArray } from '@/utils/shared'
import { type Direction, default as Board } from './board'

export type UseGameReturn = ReturnType<typeof useGame>

export function useGame(key: string) {
  const game = useLocalStorage(`2048.${key}`, {
    score: 0,
    best: 0,
    moves: 0,
    n_undo: 2,
    n_swap: 1,
    n_remove: 0,
    isWin: false as boolean,
    isFailed: false as boolean,
    board: (s) => {
      const board = Board.fromJSON(s)
      if (!s) board.addTile(3)
      return board
    },
    history: (s) => FixedArray.fromJSON<['move' | 'swap' | 'remove', string]>(s, 5),
  })

  if (import.meta.env.DEV) {
    game.n_undo = game.n_swap = game.n_remove = 100
  }

  const state = reactive({
    running: true,
  })

  function newGame() {
    state.running = true
    game.score = 0
    game.moves = 0
    game.n_undo = 2
    game.n_swap = 1
    game.n_remove = 0
    game.isWin = false
    game.isFailed = false
    game.history.clear()
    game.board.clear()
    game.board.addTile(3)

    if (import.meta.env.DEV) {
      game.n_undo = game.n_swap = game.n_remove = 100
    }
  }

  function clearRemovedTiles() {
    const tiles = game.board.data
    tiles.splice(0, tiles.length, ...tiles.filter((tile) => !tile.removed))
  }

  function handleMove(direction: Direction) {
    clearRemovedTiles()
    const snapshot = game.board.toJSON()
    const { dirty, merges } = game.board.handleMove(direction)

    if (dirty) {
      game.moves++
      merges.forEach((value) => {
        game.score += value

        if (value === 128) {
          game.n_undo++
        } else if (value === 512) {
          game.n_swap++
        } else if (value === 1024) {
          game.n_remove++
        } else if (!game.isWin && value === 2048) {
          game.isWin = true
        }
      })

      game.board.addTile()
      if (!game.board.canMove()) {
        game.isFailed = true
      }

      const latest = game.history.pop()
      if (latest) {
        if (latest[0] !== 'move') {
          game.n_undo--
        } else {
          game.history.push(latest)
        }
      }

      game.history.push(['move', snapshot])
    }

    return dirty
  }

  function undo() {
    if (game.n_undo) {
      const [type, snapshot] = game.history.pop() || []
      if (type) {
        game.n_undo--
        game.board.load(snapshot!)
        if (type === 'swap') game.n_swap++
        if (type === 'remove') game.n_remove++
      }
    }
  }

  function swapTile(pos1: number, pos2: number) {
    clearRemovedTiles()
    const snapshot = game.board.toJSON()
    if (game.n_swap && game.board.swap(pos1, pos2)) {
      game.n_swap--
      game.n_undo++
      game.history.push(['swap', snapshot])
    }
  }

  function removeTile(pos: number) {
    clearRemovedTiles()
    const snapshot = game.board.toJSON()
    if (game.n_remove && game.board.remove(pos)) {
      game.n_remove--
      game.n_undo++
      game.history.push(['remove', snapshot])
    }
  }

  return {
    ...toRefs(game),
    ...toRefs(state),
    newGame,
    handleMove,
    undo,
    swapTile,
    removeTile,
  }
}
