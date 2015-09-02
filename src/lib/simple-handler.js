import { resolve } from 'quiver-util/promise'
import {
  safeHandler, safeBuilder, implComponentConstructor 
} from 'quiver-component-util'

import {
  simpleToStreamHandlerConverter,
  validateSimpleType, simpleHandlerLoader
} from './util/simple-handler'

import { StreamHandlerBuilder } from './stream-handler'

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
    const builder = this.simpleHandlerBuilderFn()
    const convertHandler = simpleToStreamHandlerConverter(
      inputType, outputType)

    return async function(config) {
      const simpleHandler = await builder(config)
      return convertHandler(simpleHandler)
    }
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

  mainBuilderFnModifiesConfig(opts) {
    return false
  }

  get componentType() {
    return 'SimpleHandler'
  }
}

export const simpleHandler = implComponentConstructor(
  SimpleHandler, 'simpleHandlerFn', safeHandler)

export const simpleHandlerBuilder = implComponentConstructor(
  SimpleHandlerBuilder, 'simpleHandlerBuilderFn', safeBuilder)
