export class FixedArray<T> {
  private data = Array<T>()
  readonly size

  constructor(size: number) {
    this.size = size
  }

  push(item: T) {
    this.data.push(item)
    if (this.data.length > this.size) {
      return this.data.shift()
    }
  }

  pop() {
    return this.data.pop()
  }

  clear() {
    this.data.splice(0, this.data.length)
  }

  toJSON() {
    return `${this.size}:${JSON.stringify(this.data)}`
  }

  static fromJSON<T>(s: string, size: number, parseData: (s: string) => Array<T> = JSON.parse) {
    const fixedArray = new FixedArray<T>(size)

    const idx = s.indexOf(':')
    if (idx === -1) return fixedArray

    if (size !== parseInt(s.slice(0, idx))) return fixedArray

    let data
    try {
      data = parseData(s.slice(idx + 1))
    } catch {
      return fixedArray
    }

    fixedArray.data = data
    return fixedArray
  }
}
