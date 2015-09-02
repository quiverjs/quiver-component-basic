import { Map as ImmutableMap } from 'immutable'

const $handlerMap = Symbol.for('@quiver.config.handlerMap')

export const createConfig = (...args) => {
  const config = ImmutableMap(...args)
  const global = new Map()
  global.set($handlerMap, new Map())

  return config.set('global', global)
}

export const getHandlerMap = function() {
  return this.get('global').get($handlerMap)
}
