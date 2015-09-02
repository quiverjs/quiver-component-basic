import { HandleableMiddleware } from 'quiver-component-base'

const configHandlerToMiddleware = configHandler =>
  async function(config, builder) {
    const newConfig = await configHandler(config) || config
    return builder(newConfig)
  }

export class ConfigMiddleware extends HandleableMiddleware {
  mainHandleableBuilderFn() {
    return configHandlerToMiddleware(this.configHandlerFn())
  }

  configHandlerFn() {
    throw new Error('abstract method configHandlerFn() is not implemented')
  }

  get componentType() {
    return 'ConfigMiddleware'
  }
}
