import { resolve } from 'quiver-util/promise'

import { HandleableBuilder } from 'quiver-component-base'
import { loadStreamHandler } from 'quiver-component-util'

export class StreamHandlerBuilder extends HandleableBuilder {
  mainHandleableBuilderFn() {
    const builder = this.streamHandlerBuilderFn()

    return config =>
      builder(config).then(streamHandler => ({ streamHandler }))
  }

  streamHandlerBuilderFn() {
    throw new Error('abstract method is not implemented')
  }

  defaultLoaderFn() {
    return loadStreamHandler
  }

  get componentType() {
    return 'StreamHandlerBuilder'
  }
}

export class StreamHandler extends StreamHandlerBuilder {
  streamHandlerBuilderFn() {
    const handler = this.streamHandlerFn()

    return config => resolve(handler)
  }

  streamHandlerFn() {
    throw new Error('abstract method is not implemented')
  }

  get componentType() {
    return 'StreamHandler'
  }
}
