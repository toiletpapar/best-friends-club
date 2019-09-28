import {adjectives} from '../../utils/data/adjectives.json'
import {dictionary} from '../../utils/data/codenames.json'
import {prng} from '../PRNG'

const getRandomName = (): string => `${adjectives[prng.getRandomNumber(0, adjectives.length)]} ${dictionary[prng.getRandomNumber(0, dictionary.length)]}`
const capitalizeFirst = (str: string): string => `${str.substring(0, 1).toUpperCase()}${str.substring(1)}`
const titleCase = (str: string): string => str.toLowerCase().split(' ').map(capitalizeFirst).reduce((acc, str): string => `${acc}${str} `, '').trim()

export {
  getRandomName,
  capitalizeFirst,
  titleCase
}