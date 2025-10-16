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
    n_delete: 0,
    isWin: false as boolean,
    isFailed: false as boolean,
    board: (s) => {
      const board = Board.fromJSON(s)
      if (!s) board.addTile(3)
      return board
    },
    history: (s) => FixedArray.fromJSON<string>(s, 5),
  })

  const state = reactive({
    running: true,
  })

  function newGame() {
    state.running = true
    game.score = 0
    game.moves = 0
    game.n_undo = 112
    game.n_swap = 111
    game.n_delete = 110
    game.isWin = false
    game.isFailed = false
    game.history.clear()
    game.board.clear()
    game.board.addTile(3)
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
          game.n_delete++
        } else if (!game.isWin && value === 2048) {
          game.isWin = true
        }
      })

      game.board.addTile()
      if (!game.board.canMove()) {
        game.isFailed = true
      }

      game.history.push(snapshot)
    }

    return dirty
  }

  function undo() {
    if (game.n_undo) {
      const snapshot = game.history.pop()
      if (snapshot) {
        game.board.load(snapshot)
        game.n_undo--
      }
    }
  }

  function swapTile(pos1: number, pos2: number) {
    clearRemovedTiles()
    if (game.n_swap && game.board.swap(pos1, pos2)) {
      game.n_swap--
    }
  }

  function removeTile(pos: number) {
    clearRemovedTiles()
    if (game.n_delete && game.board.remove(pos)) {
      game.n_delete--
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
