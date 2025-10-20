import Tile from './tile'

export type Direction = 'up' | 'down' | 'left' | 'right'

export default class Board {
  data = Array<Tile>()

  toJSON() {
    return this.data
      .filter((tile) => !tile.removed)
      .map((tile) => tile.toJSON())
      .join(';')
  }

  static fromJSON(s: string) {
    const board = new Board()

    board.data = s
      .split(';')
      .map((s) => Tile.fromJSON(s))
      .filter((tile) => tile.value)

    return board
  }

  private flatten() {
    return this.data
      .filter((tile) => !tile.removed)
      .reduce((x16, tile) => {
        x16[tile.pos] = tile
        return x16
      }, Array<Tile>(16).fill(Tile.EMPTY))
  }

  swap(pos1: number, pos2: number) {
    const x16 = this.flatten()
    const tile1 = x16[pos1]!
    const tile2 = x16[pos2]!

    if (tile1.value && tile2.value && tile1.value !== tile2.value) {
      tile1.move(pos2)
      tile2.move(pos1)
      return true
    }
    return false
  }

  remove(pos: number) {
    const idx = this.data.findIndex((tile) => !tile.removed && tile.pos === pos)
    if (idx !== -1) {
      this.data.splice(idx, 1)
      return true
    }
    return false
  }

  addTile(n = 1) {
    const emptyPos = this.flatten()
      .map((tile, idx) => (tile.value ? -1 : idx))
      .filter((idx) => idx !== -1)

    let count = 0
    while (n--) {
      if (emptyPos.length > 0) {
        const idx = Math.floor(Math.random() * emptyPos.length)
        const pos = emptyPos.splice(idx, 1)[0]
        this.data.push(new Tile(Math.random() > 0.8 ? 4 : 2, pos))
        count++
      }
    }

    return count
  }

  canMove() {
    const x16 = this.flatten()
    for (let i = 0; i < 16; i++) {
      const tile = x16[i]!
      const rightTile = (i + 1) % 4 ? x16[i + 1]! : Tile.EMPTY
      const downTile = i < 12 ? x16[i + 4]! : Tile.EMPTY

      if (!tile.value || tile.equals(rightTile) || tile.equals(downTile)) {
        return true
      }
    }
    return false
  }

  private move(edges: number[], step: number) {
    let dirty = false
    const merges = Array<number>()

    const x16 = this.flatten()
    for (let i of edges) {
      let cursor = Tile.EMPTY
      let pos = i
      for (let j = 0; j < 4; j++, i += step) {
        const tile = x16[i]!
        if (!tile.value) {
          continue
        } else if (!cursor.value) {
          cursor = tile
        } else if (cursor.equals(tile)) {
          cursor.move(pos)
          const merged = cursor.merge(tile)
          pos += step
          cursor = Tile.EMPTY
          dirty = true
          this.data.push(merged)
          merges.push(merged.value)
        } else {
          dirty = cursor.move(pos) || dirty
          pos += step
          cursor = tile
        }
      }

      if (cursor.value) {
        dirty = cursor.move(pos) || dirty
      }
    }

    return { dirty, merges }
  }

  handleMove(direction: Direction) {
    switch (direction) {
      case 'up':
        return this.move([0, 1, 2, 3], 4)
      case 'down':
        return this.move([12, 13, 14, 15], -4)
      case 'left':
        return this.move([0, 4, 8, 12], 1)
      case 'right':
        return this.move([3, 7, 11, 15], -1)
    }
  }
}
