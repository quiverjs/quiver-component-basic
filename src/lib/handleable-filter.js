import { HandleableMiddleware } from 'quiver-component-base'
import { componentConstructor } from 'quiver-component-base/util'

import { safeHandler } from './util/wrapper'

const filterToMiddleware = filter =>
  async function(config, builder) {
    const handler = await builder(config)
    return filter(config, handler)
  }

export class HandleableFilter extends HandleableMiddleware {
  mainHandleableMiddlewareFn() {
    return filterToMiddleware(this.handleableFilterFn())
  }

  handleableFilterFn() {
    throw new Error('abstract method handleableFilterFn() is not implemented')
  }

  get componentType() {
    return 'HandleableFilter'
  }
}

export const handleableFilter = componentConstructor(
  HandleableFilter, 'handleableFilterFn', safeHandler)
