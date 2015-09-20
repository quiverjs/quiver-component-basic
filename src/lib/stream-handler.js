import { copy } from 'quiver-util/object'
import { resolve } from 'quiver-util/promise'
import { ImmutableMap } from 'quiver-util/immutable'
import { assertFunction } from 'quiver-util/assert'

import { HandleableBuilder } from 'quiver-component-base'
import { componentConstructor } from 'quiver-component-base/util'

import { streamHandlerLoader } from './util/loader'

export class StreamHandlerBuilder extends HandleableBuilder {
  mainHandleableBuilderFn() {
    const builder = this.streamHandlerBuilderFn()

    return config =>
      builder(config).then(streamHandler =>
        ImmutableMap().set('streamHandler', streamHandler))
  }

  streamHandlerBuilderFn() {
    throw new Error('abstract method is not implemented')
  }

  get defaultLoader() {
    return streamHandlerLoader
  }

  get isStreamHandlerComponent() {
    return true
  }

  get componentType() {
    return 'StreamHandlerBuilder'
  }
}

export class StreamHandler extends StreamHandlerBuilder {
  streamHandlerBuilderFn() {
    const handler = this.streamHandlerFn()

    return config => resolve(handler)
  }

  streamHandlerFn() {
    throw new Error('abstract method is not implemented')
  }

  get componentType() {
    return 'StreamHandler'
  }
}

export const safeStreamHandlerFn = handler => {
  assertFunction(handler)

  return async function(args, inputStreamable) {
    const resultStreamable = await handler(args, inputStreamable)

    if(!resultStreamable)
      throw new TypeError('user defined stream handler ' +
        'must return valid streamable')

    assertFunction(resultStreamable.toStream,
      'user defined stream handler must return ' +
      'valid streamable object with .toStream() function')

    return resultStreamable
  }
}

const safeStreamHandlerBuilderFn = builder => {
  assertFunction(builder)

  return async function(config) {
    const handler = await builder(copy(config))
    assertFunction(handler, 'user defined stream handler builder ' +
      'must return handler function')

    return safeStreamHandlerFn(handler)
  }
}

export const streamHandler = componentConstructor(
  StreamHandler, 'streamHandlerFn', safeStreamHandlerFn)

export const streamHandlerBuilder = componentConstructor(
  StreamHandlerBuilder, 'streamHandlerBuilderFn',
  safeStreamHandlerBuilderFn)
