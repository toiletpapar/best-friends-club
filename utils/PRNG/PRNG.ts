class PRNG {
  public getRandomNumber(min: number, max: number): number {
    if (max < min) {
      throw new Error(`PRNG.getRandomNumber: max is less than min`)
    }

    return Math.floor(Math.random() * (max - min + 1) ) + min
  }

  public getID(): string {
    return new Array(24).fill(1).map((): number => this.getRandomNumber(97, 122)).reduce((id, num): string => `${id}${String.fromCharCode(num)}`, '')
  }

  public getRandomNumberSet(min: number, max: number, length: number): number[] {
    if (max - min + 1 < length) {
      throw new Error(`PRNG.getRandomNumberSet: range is not larger than length`)
    } else if (max < min) {
      throw new Error(`PRNG.getRandomNumberSet: max is less than min`)
    }

    return this.shuffle(new Array(max - min + 1).fill(1).map((value, index): number => index + min)).slice(0, length)
  }

  // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
  public shuffle<T>(a: T[]): T[] {
    const arr = a.slice()
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.getRandomNumber(0, i)
      let x = arr[i]
      arr[i] = arr[j]
      arr[j] = x
    }
    return arr
  }
}

export {
  PRNG
}
