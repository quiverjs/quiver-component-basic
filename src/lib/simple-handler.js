import { resolve } from 'quiver-util/promise'
import { componentConstructor } from 'quiver-component-base/util'

import {
  simpleToStreamHandlerConverter,
  validateSimpleType
} from './util/simple-handler'

import { StreamHandlerBuilder } from './stream-handler'
import { simpleHandlerLoader } from './util/loader'

const $inType = Symbol('@inputType')
const $outType = Symbol('@outputType')

export class SimpleHandlerBuilder extends StreamHandlerBuilder {
  constructor(options={}) {
    const { inputType, outputType } = options

    validateSimpleType(inputType)
    validateSimpleType(outputType)

    super(options)

    this.rawComponent[$inType] = inputType
    this.rawComponent[$outType] = outputType
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

  get defaultLoader() {
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

const noWrap = val => val

export const simpleHandler = componentConstructor(
  SimpleHandler, 'simpleHandlerFn', noWrap)

export const simpleHandlerBuilder = componentConstructor(
  SimpleHandlerBuilder, 'simpleHandlerBuilderFn', noWrap)
