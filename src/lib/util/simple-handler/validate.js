import { streamToSimpleTable } from './table'

export const validateSimpleType = type => {
  if(!type)
    throw new Error('simple type is not defined')

  if(typeof(type) != 'string')
    throw new Error('simple type must be of type string')

  if(!streamToSimpleTable.get(type))
    throw new Error(`invalid simple type ${type}`)
}
