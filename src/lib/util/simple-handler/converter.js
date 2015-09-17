import { streamToSimpleTable, simpleToStreamTable } from './table'
import { assertFunction } from 'quiver-util/assert'

const handlerConverter = (inConvert, outConvert) =>
  handler => {
    assertFunction(handler)

    return async function(args, input) {
      const convertedInput = await inConvert(input)
      const result = await handler(args, convertedInput)
      const convertedOutput = await outConvert(result)

      return convertedOutput
    }
  }

const createConverter = (inTable, outTable) =>
  (inType, outType) =>  {
    const inConvert = inTable.get(inType)
    if(!inConvert) throw new Error(`invalid simple type ${inType}`)

    const outConvert = outTable.get(outType)
    if(!outConvert) throw new Error(`invalid simple type ${outType}`)

    return handlerConverter(inConvert, outConvert)
  }

export const simpleToStreamHandlerConverter = createConverter(
  streamToSimpleTable, simpleToStreamTable)

export const streamToSimpleHandlerConverter = createConverter(
  simpleToStreamTable, streamToSimpleTable)
