import { resolve } from 'quiver-util/promise'

import {
  simpleToStreamHandler,
  streamToSimpleHandler,
  validateSimpleType
} from './util/simple-handler'

import { simpleHandlerLoader } from 'quiver-component-util'
import { StreamHandler, StreamHandlerBuilder } from './stream-handler'

const $inType = Symbol('inputType')
const $outType = Symbol('outputType')

const setSimpleType = (component, typeField, value) => {
  if(component[typeField])
    throw new Error('simple type is already defined as ' + component[typeField])

  const err = validateSimpleType(value)
  if(err) throw err

  component[typeField] = value
}

export class SimpleHandlerBuilder extends StreamHandlerBuilder {
  constructor(opts={}) {
    super(opts)

    this[$inType] = null
    this[$outType] = null
  }

  streamHandlerBuilderFn() {
    const [ inType, outType ] = this.inOutTypes()
    const simpleHandlerBuilder = this.simpleHandlerBuilderFn()

    return config =>
      simpleHandlerBuilder(config)
      .then(simpleHandler =>
        simpleToStreamHandler(simpleHandler, inType, outType))
  }

  simpleHandlerBuilderFn() {
    throw new Error('abstract method is not implemented')
  }

  defaultLoaderFn() {
    const [ inType, outType ] = this.inOutTypes()
    return simpleHandlerLoader(inType, outType)
  }

  inOutTypes() {
    const inType = this[$inType]
    if(!inType)
      throw new Error('input type is not yet defined')

    const outType = this[$outType]
    if(!outType)
      throw new Error('output type is not yet defined')

    return [inType, outType]
  }

  inputType(inType) {
    setSimpleType(this, $inType, inType)
    return this
  }

  outputType(outType) {
    setSimpleType(this, $outType, outType)
    return this
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
