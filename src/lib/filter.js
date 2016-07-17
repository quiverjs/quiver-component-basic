import { copy } from 'quiver-util/object'
import { componentConstructor } from 'quiver-component-base/util'

import { HandleableFilter } from './handleable-filter'
import { safeHttpHandlerFn } from './http-handler'
import { safeStreamHandlerFn } from './stream-handler'

const simpleToHandleableFilter = (simpleFilter, handlerField) =>
  async function(config, handleable) {
    const handler = handleable.get(handlerField)

    if(!handler) throw new TypeError(
      `target handleable is not of type ${handlerField}`)

    const filteredHandler = await simpleFilter(config, handler)

    return handleable.set(handlerField, filteredHandler)
  }

export class StreamFilter extends HandleableFilter {
  handleableFilterFn() {
    return simpleToHandleableFilter(
      this.streamFilterFn(), 'streamHandler')
  }

  streamFilterFn() {
    throw new Error('abstract method is not implemented')
  }

  get componentType() {
    return 'StreamFilter'
  }
}

export class HttpFilter extends HandleableFilter {
  handleableFilterFn() {
    return simpleToHandleableFilter(
      this.httpFilterFn(), 'httpHandler')
  }

  httpFilterFn() {
    throw new Error('abstract method is not implemented')
  }

  get componentType() {
    return 'HttpFilter'
  }
}

const safeStreamFilterFn = filter =>
  async function(config, handler) {
    const filteredHandler = await filter(copy(config), handler)

    return safeStreamHandlerFn(filteredHandler)
  }

const safeHttpFilterFn = filter =>
  async function(config, handler) {
    const filteredHandler = await filter(copy(config), handler)

    return safeHttpHandlerFn(filteredHandler)
  }

export const streamFilter = componentConstructor(
  StreamFilter, 'streamFilterFn', safeStreamFilterFn)

export const httpFilter = componentConstructor(
  HttpFilter, 'httpFilterFn', safeHttpFilterFn)
