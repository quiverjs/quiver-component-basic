import { safePromised } from 'quiver-util/promise'
import { assertFunction } from 'quiver-util/assert'

export const safeHandler = handler => {
  assertFunction(handler)
  return safePromised(handler)
}

export const safeBuilder = (builder) => {
  assertFunction(builder)

  const wrappedBuilder = safePromised(builder)
  return (...args) =>
    wrappedBuilder(...args).then(safeHandler)
}
