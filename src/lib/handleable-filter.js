import { isImmutableMap } from 'quiver-util/immutable'
import { HandleableMiddleware } from 'quiver-component-base'
import { componentConstructor } from 'quiver-component-base/util'


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

const safeHandleableFilter = filter =>
  async function(config, handler) {
    const handleable = await filter(config, handler)

    if(!isImmutableMap(handleable))
      throw new TypeError('returned handleable must be ImmutableMap')

    return handleable
  }

export const handleableFilter = componentConstructor(
  HandleableFilter, 'handleableFilterFn', safeHandleableFilter)
