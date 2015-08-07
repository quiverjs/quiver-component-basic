import { copy } from 'quiver-util/object'
import { HandleableFilter } from './handleable-filter'

const simpleToHandleableFilter = (simpleFilter, handleableField) =>
  async function(config, handleable) {
    const handler = handleable[handleableField]
    if(!handler) return resolve(handleable)

    const filteredHandler = await simpleFilter(config, handler)

    const newHandleable = copy(handleable)
    newHandleable[handleableField] = filteredHandler

    return newHandleable
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
      this.httpFilterFn(), 'streamHandler')
  }

  httpFilterFn() {
    throw new Error('abstract method is not implemented')
  }

  get componentType() {
    return 'HttpFilter'
  }
}
