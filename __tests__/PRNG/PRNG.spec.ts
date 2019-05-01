import { PRNG } from "../../utils/PRNG"

describe('PRNG', (): void => {
  let prng: PRNG

  beforeEach((): void => {
    prng = new PRNG()
  })

  describe('#getRandomNumber', (): void => {
    it('should return a random number inclusive of the values provided', (): void => {
      let actual = prng.getRandomNumber(0, 1)

      expect(actual).toBe(0)

      actual = prng.getRandomNumber(0, 1)

      expect(actual).toBe(1)
    })

    it('should throw an error when max is less than min', (): void => {
      expect(prng.getRandomNumber.bind(null, -4, -7)).toThrow(Error)
    })
  })
  
  describe('#getRandomNumberSet', (): void => {
    it('should return an array of unique numbers of size of the provided length with numbers in the provided range', (): void => {
      let actual = prng.getRandomNumberSet(10, 30, 15)

      expect(actual.length).toBe(15)
      expect(actual.every((num): boolean => num >= 10 && num <= 30)).toBe(true)
    })

    it('should throw an error when max is less than min', (): void => {
      expect(prng.getRandomNumberSet.bind(null, -4, -7, 10)).toThrow(Error)
    })

    it('should throw an error when the abs(max - min) is less than the length provided', (): void => {
      expect(prng.getRandomNumberSet.bind(null, -7, -4, 2)).toThrow(Error)
    })
  })

  describe('#shuffle', (): void => {
    let arr: number[]

    beforeEach((): void => {
      arr = [1, 2, 5, 7]     
    })

    it('should not modify the old array', (): void => {
      let actual = prng.shuffle(arr)

      expect(arr).not.toBe(actual)
    })

    it('should return an array whose values are shuffled', (): void => {
      const actual = prng.shuffle(arr)
      const expected = [5, 7, 2, 1]

      expect(actual.every((num, index): boolean => num === expected[index])).toBe(true)
    })
  })
})