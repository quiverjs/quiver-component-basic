import { resolve } from 'quiver-util/promise'

import { HandleableBuilder } from 'quiver-component-base'
import { loadHttpHandler } from 'quiver-component-util'

export class HttpHandlerBuilder extends HandleableBuilder {
  mainHandleableBuilderFn() {
    const builder = this.httpHandlerBuilderFn()

    return config =>
      builder(config).then(httpHandler => ({ httpHandler }))
  }

  toHttpHandlerBuilder() {
    throw new Error('abstract method is not implemented')
  }

  defaultLoaderFn() {
    return loadHttpHandler
  }

  get componentType() {
    return 'HttpHandlerBuilder'
  }
}

export class HttpHandler extends HttpHandlerBuilder {
  httpHandlerBuilderFn() {
    const handler = this.httpHandlerFn()

    return config => resolve(handler)
  }

  httpHandlerFn() {
    throw new Error('abstract method is not implemented')
  }

  get componentType() {
    return 'HttpHandler'
  }
}
