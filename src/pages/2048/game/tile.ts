export default class Tile {
  static count = 0
  static readonly EMPTY = new Tile()

  id
  value
  pos
  removed

  constructor(value = 0, pos = 0) {
    this.id = Tile.count++
    this.value = value
    this.pos = pos
    this.removed = false
  }

  equals(tile: Tile) {
    return this.value === tile.value
  }

  toJSON() {
    return `${this.value}-${this.pos}-${Number(this.removed)}-${this.id}`
  }

  static fromJSON(s: string) {
    const [value = 0, pos = 0, removed = 0, id = 0] = s
      .split('-')
      .map((s) => parseInt(s))
      .filter((n) => !isNaN(n))

    if (id) {
      const tile = new Tile(value, pos)
      tile.id = id
      tile.removed = Boolean(removed)
      return tile
    }

    return Tile.EMPTY
  }
}
