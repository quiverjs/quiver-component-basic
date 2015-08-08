import {
  streamableToText, streamableToJson,
  textToStreamable, jsonToStreamable,
  streamToStreamable, emptyStreamable
} from 'quiver-stream-util'

import { error } from 'quiver-util/error'
import { resolve, reject, safePromised } from 'quiver-util/promise'

const convertHandler = (handler, inConvert, outConvert) =>
  (args, input) =>
    resolve(inConvert(input)).then(input =>
      handler(args, input).then(result =>
        outConvert(result)))

const streamableToVoid = async function(streamable) {
  if(streamable.reusable) return

  const readStream = await streamable.toStream()
  await readStream.closeRead()
}

const voidToStreamable = () => resolve(emptyStreamable())

const streamableToStream = streamable => streamable.toStream()

const streamableToStreamable = streamable => resolve(streamable)

const htmlToStreamable = (text) => textToStreamable(text, 'text/html')

const streamToSimpleTable = {
  'void': streamableToVoid,
  'text': streamableToText,
  'string': streamableToText,
  'html': streamableToText,
  'json': streamableToJson,
  'stream': streamableToStream,
  'streamable': streamableToStreamable
}

const simpleToStreamTable = {
  'void': voidToStreamable,
  'text': textToStreamable,
  'string': textToStreamable,
  'html': htmlToStreamable,
  'json': jsonToStreamable,
  'stream': streamToStreamable,
  'streamable': streamableToStreamable
}

const createConverter = (inTable, outTable) =>
  (handler, inType, outType) =>  {
    const inConvert = inTable[inType]
    if(!inConvert) throw new Error('invalid simple type ' + inType)

    const outConvert = outTable[outType]
    if(!outConvert) throw new Error('invalid simple type ' + outType)

    return convertHandler(safePromised(handler),
      inConvert, outConvert)
  }

export const simpleToStreamHandler = createConverter(
  streamToSimpleTable, simpleToStreamTable)

export const streamToSimpleHandler = createConverter(
  simpleToStreamTable, streamToSimpleTable)

export const validateSimpleType = type => {
  if(!type)
    throw new Error('simple type is not defined')

  if(typeof(type) != 'string')
    throw new Error('simple type must be of type string')

  if(!streamToSimpleTable[type])
    throw new Error('invalid simple type ' + type)
}

export const simpleHandlerLoader = (inType, outType) =>
  async function(...args) {
    const handler = await loadStreamHandler(...args)
    return streamToSimpleHandler(handler, inType, outType)
  }
