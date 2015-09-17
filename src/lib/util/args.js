import { ImmutableMap, isImmutableMap } from 'quiver-util/immutable'

export const createArgs = ImmutableMap

export const assertIsArgs = args => {
  if(!isImmutableMap(args))
    throw new TypeError('input args must be ImmutableMap')
}
