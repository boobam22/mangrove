import { type Direction, default as Board } from './board'
import Tile from './tile'

type Action = 'move' | 'swap' | 'remove'
type History = [Action, string]

export default class Game {
  private snapshot = ''

  running = false
  score = 0
  best = 0
  moves = 0
  n_undo = 0
  n_swap = 0
  n_remove = 0
  isWin = false
  isFailed = false
  board = new Board()
  histories = Array<History>()

  private getSnapshot() {
    const { snapshot, running, histories, ...data } = this // eslint-disable-line
    return JSON.stringify(data)
  }

  private loadSnapshot() {
    if (this.histories.length) {
      this.snapshot = this.histories.pop()![1]
      const parsed = JSON.parse(this.snapshot)
      ;(Object.entries(parsed) as [keyof this, unknown][]).forEach(([k, v]) => {
        if (k === 'board') {
          this.board = Board.fromJSON(v as string)
        } else {
          this[k] = v as this[typeof k]
        }
      })
    }
  }

  toJSON() {
    return JSON.stringify([...this.histories, ['', this.snapshot]])
  }

  static fromJSON(s: string) {
    let parsed
    try {
      parsed = JSON.parse(s)
    } catch {}

    const game = new Game()
    game.newGame()

    if (parsed instanceof Array) {
      game.histories = parsed
      game.loadSnapshot()
    }
    return game
  }

  newGame() {
    this.running = true
    this.score = 0
    this.moves = 0
    this.n_undo = 2
    this.n_swap = 1
    this.n_remove = 0
    this.isWin = false
    this.isFailed = false
    this.board.data = []
    this.histories = []

    if (import.meta.env.DEV) {
      this.n_undo = this.n_swap = this.n_remove = 100
    }

    this.board.addTile(3)
    this.snapshot = this.getSnapshot()
  }

  private record(action: Action) {
    let len = this.histories.length
    if (len && action === 'move' && this.histories[len - 1]![0] !== 'move') {
      while (len) {
        const type = this.histories.pop()![0]
        len--
        if (type !== 'move') {
          this.n_undo--
        }
      }
    }

    this.histories.push([action, this.snapshot])
    this.snapshot = this.getSnapshot()
    if (len > 5) {
      this.histories.shift()
    }
  }

  private clearRemovedTiles() {
    this.board.data = this.board.data.filter((tile) => !tile.removed)
  }

  handleMove(direction: Direction) {
    this.clearRemovedTiles()
    const { dirty, merges } = this.board.handleMove(direction)

    if (dirty) {
      this.moves++
      let score = 0
      merges.forEach((value) => {
        score += value
        if (value === 128) {
          this.n_undo++
        } else if (value === 512) {
          this.n_swap++
        } else if (value === 1024) {
          this.n_remove++
        } else if (!this.isWin && value === 2048) {
          this.isWin = true
        }
      })

      this.score += score
      this.best = Math.max(this.best, this.score)
      this.board.addTile()

      if (!this.board.canMove()) {
        this.isFailed = true
      }

      this.record('move')
    }

    return dirty
  }

  undo() {
    if (this.n_undo && this.histories.length) {
      this.loadSnapshot()
      this.n_undo--
      return true
    }
    return false
  }

  swapTile(pos1: number, pos2: number) {
    this.clearRemovedTiles()
    if (this.n_swap && this.board.swap(pos1, pos2)) {
      this.moves += 4
      this.n_swap--
      this.n_undo++
      this.record('swap')
      return true
    }
    return false
  }

  removeTile(pos: number) {
    this.clearRemovedTiles()
    if (this.n_remove && this.board.remove(pos)) {
      this.moves += 8
      this.n_remove--
      this.n_undo++
      this.record('remove')
      return true
    }
    return false
  }

  tutorial() {
    this.newGame()
    this.board.data = [new Tile(2, 5), new Tile(2, 10)]
  }
}
