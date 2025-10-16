import { markRaw } from 'vue'

import Tile from './tile'

export type Direction = 'up' | 'down' | 'left' | 'right'

export default class Board {
  data = Array<Tile>()
  private registry = markRaw(Array<Tile>(16).fill(Tile.EMPTY))

  toJSON() {
    return this.data
      .filter((tile) => !tile.removed)
      .map((tile) => tile.toJSON())
      .join(';')
  }

  static fromJSON(s: string) {
    const board = new Board()

    let id = 0
    const data = s
      .split(';')
      .map((s) => Tile.fromJSON(s))
      .filter((tile) => {
        id = Math.max(id, tile.id)
        return tile.value
      })
    Tile.count = id + 1
    board.push(...data)
    return board
  }

  load(s: string) {
    this.clear()
    this.push(...Board.fromJSON(s).data)
  }

  private push(...tiles: Tile[]) {
    this.data.push(...tiles)
    tiles.forEach((tile) => {
      this.registry[tile.pos] = tile
    })
  }

  clear() {
    this.data.splice(0, this.data.length)
    this.registry.fill(Tile.EMPTY)
  }

  swap(pos1: number, pos2: number) {
    const tile1 = this.registry[pos1]!
    const tile2 = this.registry[pos2]!

    if (tile1.value && tile2.value && tile1.value !== tile2.value) {
      this.data.find((it) => tile1.id === it.id)!.pos = pos2
      this.data.find((it) => tile2.id === it.id)!.pos = pos1
      this.registry[pos1] = tile2
      this.registry[pos2] = tile1
      return true
    }
    return false
  }

  remove(pos: number) {
    const tile = this.registry[pos]!
    if (tile.value) {
      this.registry[pos] = Tile.EMPTY
      const idx = this.data.findIndex((it) => tile.id === it.id)
      this.data.splice(idx, 1)
      return true
    }
    return false
  }

  addTile(n = 1) {
    const emptyPos = this.registry
      .map((tile, idx) => (tile.value ? -1 : idx))
      .filter((idx) => idx !== -1)

    let count = 0
    while (n--) {
      if (emptyPos.length > 0) {
        const idx = Math.floor(Math.random() * emptyPos.length)
        const pos = emptyPos.splice(idx, 1)[0]
        this.push(new Tile(Math.random() > 0.8 ? 4 : 2, pos))
        count++
      }
    }

    return count
  }

  private moveTile(tile: Tile, pos: number) {
    if (tile.pos === pos) return false

    this.registry[tile.pos] = Tile.EMPTY
    this.registry[pos] = tile
    tile.pos = pos
    return true
  }

  private mergeTile(tile1: Tile, tile2: Tile, pos: number) {
    this.moveTile(tile1, pos)
    this.moveTile(tile2, pos)

    tile1.removed = tile2.removed = true
    const merged = new Tile(tile1.value + tile2.value, pos)
    this.push(merged)
    return merged
  }

  canMove() {
    for (let i = 0; i < 16; i++) {
      const tile = this.registry[i]!
      const rightTile = (i + 1) % 4 ? this.registry[i + 1]! : Tile.EMPTY
      const downTile = i < 12 ? this.registry[i + 4]! : Tile.EMPTY

      if (!tile.value || tile.equals(rightTile) || tile.equals(downTile)) {
        return true
      }
    }
    return false
  }

  private move(edges: number[], step: number) {
    let dirty = false
    const merges = Array<number>()

    for (let i of edges) {
      let cursor = Tile.EMPTY
      let pos = i
      for (let j = 0; j < 4; j++, i += step) {
        const tile = this.registry[i]!
        if (!tile.value) {
          continue
        } else if (!cursor.value) {
          cursor = tile
        } else if (tile.equals(cursor)) {
          const merged = this.mergeTile(cursor, tile, pos)
          pos += step
          cursor = Tile.EMPTY
          dirty = true
          merges.push(merged.value)
        } else {
          dirty = this.moveTile(cursor, pos) || dirty
          pos += step
          cursor = tile
        }
      }

      if (cursor.value) {
        dirty = this.moveTile(cursor, pos) || dirty
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
