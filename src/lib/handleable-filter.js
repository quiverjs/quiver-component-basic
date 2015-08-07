import { copy } from 'quiver-util/object'

import { HandleableMiddleware } from 'quiver-component-base'

const noCopy = config => config

const filterToMiddleware = (filter, copyConfig) =>
  (config, builder) =>
    builder(copyConfig(config)).then(handler =>
      filter(config, handler))

export class HandleableFilter extends HandleableMiddleware {
  get copyConfig() {
    return true
  }

  mainHandleableMiddlewareFn() {
    const copyConfig = this.copyConfig ? copy : noCopy
    const handleableFilter = this.handleableFilterFn()

    return filterToMiddleware(
      handleableFilter, copyConfig)
  }

  handleableFilterFn() {
    throw new Error('abstract method is not implemented')
  }

  get componentType() {
    return 'HandleableFilter'
  }
}
