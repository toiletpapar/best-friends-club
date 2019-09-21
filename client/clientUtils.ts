import {KeyboardEvent} from 'react'

// Return a function that executes when keycode is 13. Useful for keydown/keyup events.
const onEnter = (fn: Function): <T>(event: KeyboardEvent<T>) => void => {
  return <T>(event: KeyboardEvent<T>): void => {
    if (event.keyCode === 13) {
      fn()
    }
  }
}

export {
  onEnter
}