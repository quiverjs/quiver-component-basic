import { assertConfig } from 'quiver-component-base/util'
import { isImmutableMap } from 'quiver-util/immutable'

const $handlerMap = Symbol.for('@quiver.config.handlerMap')

export const getHandlerMap = config => {
  const global = config.get('global')
  let handlerMap = global.get($handlerMap)

  if(!handlerMap) {
    handlerMap = new Map()
    global.set($handlerMap, handlerMap)
  }

  return handlerMap
}

export const loadHandleable = async function(config, id, builder) {
  const handlerMap = getHandlerMap(config)

  if(handlerMap.has(id))
    return handlerMap.get(id)

  const handleable = await builder(config)

  if(!handleable)
    throw new TypeError('returned handleable is undefined')

  if(!isImmutableMap(handleable))
    throw new TypeError('returned handleable must be immutable map')

  handlerMap.set(id, handleable)

  return handleable
}

export const loadStreamHandler = async function(...args) {
  const handleable = await loadHandleable(...args)

  const handler = handleable.get('streamHandler')
  if(!handler)
    throw new Error('handleable is not a stream handler')

  return handler
}

export const loadHttpHandler = async function(...args) {
  const handleable = await loadHandleable(...args)

  const handler = handleable.get('httpHandler')
  if(!handler)
    throw new Error('handleable is not a http handler')

  return handler
}

export const loadHandler = async function(config, component) {
  assertConfig(config)
  const loader = component.defaultLoaderFn()
  const builder = component.handleableBuilderFn()
  
  const handler = await loader(config, component.id, builder)
  return handler
}
