import { ImmutableMap, isImmutableMap } from 'quiver-util/immutable'

export const createArgs = ImmutableMap

export const assertArgs = args => {
  if(!isImmutableMap(args))
    throw new TypeError('args must be ImmutableMap')
}
