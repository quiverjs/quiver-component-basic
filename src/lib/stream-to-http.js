import { bindLoader } from 'quiver-component-base/util'

import { HttpHandlerBuilder } from './http-handler'

import {
  streamHandlerLoader, streamToHttpHandler,
  assertStreamHandlerComponent
} from './util'

const $streamHandlerComponent = Symbol('@streamHandlerComponent')

const streamToHttpBuilder = streamBuilder =>
  async function(config) {
    const streamHandler = await streamBuilder(config)
    return streamToHttpHandler(streamHandler)
  }

export class StreamToHttpHandler extends HttpHandlerBuilder {
  constructor(options={}) {
    const { streamHandlerComponent } = options
    assertStreamHandlerComponent(streamHandlerComponent)

    super(options)
    this.setSubComponent($streamHandlerComponent,
      streamHandlerComponent)
  }

  get streamHandlerComponent() {
    return this.getSubComponent($streamHandlerComponent)
  }

  httpHandlerBuilderFn() {
    const { streamHandlerComponent } = this
    const streamBuilder = bindLoader(
      streamHandlerComponent, streamHandlerLoader)

    return streamToHttpBuilder(streamBuilder)
  }

  get componentType() {
    return 'WrapStreamHttpHandler'
  }
}

export const streamToHttpHandlerComponent = streamHandlerComponent =>
  new StreamToHttpHandler({ streamHandlerComponent })
