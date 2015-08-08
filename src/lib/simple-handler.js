import { resolve } from 'quiver-util/promise'

import {
  simpleToStreamHandler, streamToSimpleHandler,
  validateSimpleType, simpleHandlerLoader
} from './util/simple-handler'

import { StreamHandler, StreamHandlerBuilder } from './stream-handler'

const $inType = Symbol('@inputType')
const $outType = Symbol('@outputType')

export class SimpleHandlerBuilder extends StreamHandlerBuilder {
  constructor(options={}) {
    const { inputType, outputType } = options

    validateSimpleType(inputType)
    validateSimpleType(outputType)

    super(options)

    this[$inType] = inputType
    this[$outType] = outputType
  }

  streamHandlerBuilderFn() {
    const { inputType, outputType } = this
    const simpleHandlerBuilder = this.simpleHandlerBuilderFn()

    return config =>
      simpleHandlerBuilder(config)
      .then(simpleHandler =>
        simpleToStreamHandler(simpleHandler, inputType, outputType))
  }

  simpleHandlerBuilderFn() {
    throw new Error('abstract method is not implemented')
  }

  defaultLoaderFn() {
    const { inputType, outputType } = this
    return simpleHandlerLoader(inputType, outputType)
  }

  get inputType() {
    return this[$inType]
  }

  get outputType() {
    return this[$outType]
  }

  get componentType() {
    return 'SimpleHandlerBuilder'
  }
}

export class SimpleHandler extends SimpleHandlerBuilder {
  simpleHandlerBuilderFn() {
    const simpleHandler = this.simpleHandlerFn()

    return config =>
      resolve(simpleHandler)
  }

  simpleHandlerFn() {
    throw new Error('abstract method is not implemented')
  }

  get componentType() {
    return 'SimpleHandler'
  }
}
