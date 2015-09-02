import { HandleableMiddleware } from 'quiver-component-base'
import {
  safeHandler, implComponentConstructor
} from 'quiver-component-util'

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

export const handleableFilter = implComponentConstructor(
  HandleableFilter, 'handleableFilterFn', safeHandler)
