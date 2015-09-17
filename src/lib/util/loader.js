import { assertConfig } from 'quiver-component-base/util'
import { isImmutableMap } from 'quiver-util/immutable'

import { streamToSimpleHandlerConverter } from './simple-handler'

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

const safeInputStreamHandlerFn = streamHandler =>
  (args, streamable) => {
    if(!isImmutableMap(args))
      throw new TypeError('input args must be ImmutableMap')

    if(typeof(streamable.toStream) !== 'function')
      throw new TypeError('invalid input streamable')

    return streamHandler(args, streamable)
  }

export const loadStreamHandler = async function(...args) {
  const handleable = await loadHandleable(...args)

  const handler = handleable.get('streamHandler')
  if(!handler)
    throw new Error('handleable is not a stream handler')

  return safeInputStreamHandlerFn(handler)
}

export const safeInputHttpHandlerFn = httpHandler =>
  (requestHead, requestStreamable) => {
    if(!requestHead.isRequestHead)
      throw new TypeError('invalid requestHead')

    if(typeof(requestStreamable.toStream) !== 'function')
      throw new TypeError('invalid input streamable')

    return httpHandler(requestHead, requestStreamable)
  }

export const loadHttpHandler = async function(...args) {
  const handleable = await loadHandleable(...args)

  const handler = handleable.get('httpHandler')
  if(!handler)
    throw new Error('handleable is not a http handler')

  return safeInputHttpHandlerFn(handler)
}

export const simpleHandlerLoader = (inType, outType) => {
  const streamToSimpleHandler = streamToSimpleHandlerConverter(
    inType, outType)

  return async function(...args) {
    const handler = await loadStreamHandler(...args)
    return streamToSimpleHandler(handler)
  }
}

export const loadHandler = async function(config, component) {
  assertConfig(config)
  const loader = component.loaderFn()
  const builder = component.handleableBuilderFn()

  const handler = await loader(config, component.id, builder)
  return handler
}
