import { handleableLoader } from 'quiver-component-base/util'

import { assertArgs } from './args'
import { streamToSimpleHandlerConverter } from './simple-handler'

export const safeInputStreamHandlerFn = streamHandler =>
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


export const streamHandlerLoader = async function(config, id, builder, options={}) {
  const { safeWrap=true } = options
  const handleable = await handleableLoader(config, id, builder, options)

  const handler = handleable.get('streamHandler')
  if(!handler)
    throw new Error('handleable is not a stream handler')

  if(!safeWrap) return handler

  return safeInputStreamHandlerFn(handler)
}

export const httpHandlerLoader = async function(config, id, builder, options={}) {
  const { safeWrap=true } = options
  const handleable = await handleableLoader(config, id, builder, options)

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

  return async function(config, id, builder, options={}) {
    const { safeWrap=true } = options
    options.safeWrap = false

    const streamHandler = await streamHandlerLoader(config, id, builder, options)
    const handler = streamToSimpleHandler(streamHandler)

    if(!safeWrap) return handler

    return safeInputSimpleHandlerFn(handler)
  }
}
