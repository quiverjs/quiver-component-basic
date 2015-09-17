import { HandleableMiddleware } from 'quiver-component-base'
import { assertConfig, componentConstructor } from 'quiver-component-base/util'

const configHandlerToMiddleware = configHandler =>
  async function(config, builder) {
    const newConfig = await configHandler(config)
    return builder(newConfig)
  }

export class ConfigMiddleware extends HandleableMiddleware {
  mainHandleableMiddlewareFn() {
    return configHandlerToMiddleware(this.configHandlerFn())
  }

  configHandlerFn() {
    throw new Error('abstract method configHandlerFn() is not implemented')
  }

  get componentType() {
    return 'ConfigMiddleware'
  }
}

const safeConfigMiddlewareFn = configHandler => {
  return async function(config) {
    const newConfig = await configHandler(config) || config
    assertConfig(newConfig)
    return newConfig
  }
}

export const configMiddleware = componentConstructor(
  ConfigMiddleware, 'configHandlerFn', safeConfigMiddlewareFn)
