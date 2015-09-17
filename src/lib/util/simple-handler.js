import { resolve } from 'quiver-util/promise'
import { entries } from 'quiver-util/object'

import {
  streamableToText, streamableToJson,
  textToStreamable, jsonToStreamable,
  streamToStreamable, emptyStreamable
} from 'quiver-stream-util'

import { loadStreamHandler } from './loader'

const streamableToVoid = async function(streamable) {
  if(streamable.reusable) return

  const readStream = await streamable.toStream()
  await readStream.closeRead()
}

const voidToStreamable = () =>
  resolve(emptyStreamable())

const streamableToStream = streamable =>
  streamable.toStream()

const streamableToStreamable = streamable =>
  resolve(streamable)

const htmlToStreamable = (text) =>
  textToStreamable(text, 'text/html')

const streamToSimpleTable = new Map(entries({
  'void': streamableToVoid,
  'empty': streamableToVoid,
  'text': streamableToText,
  'string': streamableToText,
  'html': streamableToText,
  'json': streamableToJson,
  'stream': streamableToStream,
  'streamable': streamableToStreamable
}))

const simpleToStreamTable = new Map(entries({
  'void': voidToStreamable,
  'empty': voidToStreamable,
  'text': textToStreamable,
  'string': textToStreamable,
  'html': htmlToStreamable,
  'json': jsonToStreamable,
  'stream': streamToStreamable,
  'streamable': streamableToStreamable
}))

const handlerConverter = (inConvert, outConvert) =>
  handler =>
    async function(args, inputStreamable) {
      const input = await inConvert(inputStreamable)
      const result = await handler(args, input)
      const resultStreamable = await outConvert(result)

      return resultStreamable
    }

const createConverter = (inTable, outTable) =>
  (inType, outType) =>  {
    const inConvert = inTable.get(inType)
    if(!inConvert) throw new Error('invalid simple type ' + inType)

    const outConvert = outTable.get(outType)
    if(!outConvert) throw new Error('invalid simple type ' + outType)

    return handlerConverter(inConvert, outConvert)
  }

export const simpleToStreamHandlerConverter = createConverter(
  streamToSimpleTable, simpleToStreamTable)

export const streamToSimpleHandlerConverter = createConverter(
  simpleToStreamTable, streamToSimpleTable)

export const validateSimpleType = type => {
  if(!type)
    throw new Error('simple type is not defined')

  if(typeof(type) != 'string')
    throw new Error('simple type must be of type string')

  if(!streamToSimpleTable.get(type))
    throw new Error('invalid simple type ' + type)
}

export const simpleHandlerLoader = (inType, outType) => {
  const streamToSimpleHandler = streamToSimpleHandlerConverter(
    inType, outType)

  return async function(...args) {
    const handler = await loadStreamHandler(...args)
    return streamToSimpleHandler(handler)
  }
}
