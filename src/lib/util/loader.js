import { isImmutableMap } from 'quiver-util/immutable'
import { loadHandleable } from 'quiver-component-base/util'

import { assertArgs } from './args'
import { streamToSimpleHandlerConverter } from './simple-handler'

const safeInputStreamHandlerFn = streamHandler =>
  (args, streamable) => {
    assertArgs(args)

    if(typeof(streamable.toStream) !== 'function')
      throw new TypeError('invalid input streamable')

    return streamHandler(args, streamable)
  }

export const safeInputHttpHandlerFn = httpHandler =>
  async function(requestHead, requestStreamable) {
    if(!requestHead.isRequestHead)
      throw new TypeError('invalid requestHead')

    if(typeof(requestStreamable.toStream) !== 'function')
      throw new TypeError('invalid input streamable')

    return httpHandler(requestHead, requestStreamable)
  }


export const loadStreamHandler = async function(config, component, options={}) {
  const { safeWrap=true } = options
  const handleable = await loadHandleable(config, component, options)

  const handler = handleable.get('streamHandler')
  if(!handler)
    throw new Error('handleable is not a stream handler')

  if(!safeWrap) return handler

  return safeInputStreamHandlerFn(handler)
}

export const loadHttpHandler = async function(config, component, options={}) {
  const { safeWrap=true } = options
  const handleable = await loadHandleable(config, component, options)

  const handler = handleable.get('httpHandler')
  if(!handler)
    throw new Error('handleable is not a http handler')

  if(!safeWrap) return handler

  return safeInputHttpHandlerFn(handler)
}

const safeInputSimpleHandlerFn = simpleHandler =>
  async function(args, input) {
    assertArgs(args)

    return simpleHandler(args, input)
  }

export const simpleHandlerLoader = (inType, outType) => {
  const streamToSimpleHandler = streamToSimpleHandlerConverter(
    inType, outType)

  return async function(config, component, options={}) {
    const { safeWrap=true } = options
    options.safeWrap = false

    const streamHandler = await loadStreamHandler(config, component, options)
    const handler = streamToSimpleHandler(streamHandler)

    if(!safeWrap) return handler

    return safeInputSimpleHandlerFn(handler)
  }
}

export const streamHandlerLoader = loadStreamHandler
export const httpHandlerLoader = loadHttpHandler
