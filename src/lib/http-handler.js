import { assertFunction } from 'quiver-util/assert'
import { ImmutableMap } from 'quiver-util/immutable'
import { HandleableBuilder } from 'quiver-component-base'
import { componentConstructor } from 'quiver-component-base/util'

import { httpHandlerLoader } from './util/loader'

export class HttpHandlerBuilder extends HandleableBuilder {
  mainHandleableBuilderFn() {
    const builder = this.httpHandlerBuilderFn()

    return config =>
      builder(config).then(httpHandler =>
        ImmutableMap().set('httpHandler', httpHandler))
  }

  toHttpHandlerBuilder() {
    throw new Error('abstract method is not implemented')
  }

  loaderFn() {
    return httpHandlerLoader
  }

  get isHttpHandlerComponent() {
    return true
  }

  get componentType() {
    return 'HttpHandlerBuilder'
  }
}

export class HttpHandler extends HttpHandlerBuilder {
  httpHandlerBuilderFn() {
    const handler = this.httpHandlerFn()

    return config => Promise.resolve(handler)
  }

  httpHandlerFn() {
    throw new Error('abstract method is not implemented')
  }

  get componentType() {
    return 'HttpHandler'
  }
}

export const safeHttpHandlerFn = handler => {
  assertFunction(handler)

  return async function(requestHead, requestStreamable) {
    const response = await handler(requestHead, requestStreamable)
    if(!Array.isArray(response))
      throw new TypeError('user defined http handler must return ' +
        'response as two-element array')

    const [ responseHead, responseStreamable ] = response

    if(!responseHead || !responseHead.isResponseHead)
      throw new TypeError('user defined http handler must return ' +
        'valid response head object as first element')

    if(!responseStreamable || typeof(responseStreamable.toStream) != 'function')
      throw new TypeError('user defined http handler must return ' +
        'valid response streamable as second element')

    return [responseHead, responseStreamable]
  }
}

const safeHttpHandlerBuilderFn = builder => {
  assertFunction(builder)

  return async function(config) {
    const handler = await builder(config)
    assertFunction(handler, 'user defined http handler builder ' +
      'must return handler function')

    return safeHttpHandlerFn(handler)
  }
}

export const httpHandler = componentConstructor(
  HttpHandler, 'httpHandlerFn', safeHttpHandlerFn)

export const httpHandlerBuilder = componentConstructor(
  HttpHandlerBuilder, 'httpHandlerBuilderFn', safeHttpHandlerBuilderFn)
