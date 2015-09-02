import { getHandlerMap } from './config'

export const loadHandleable = async function(config, id, builder) {
  const handlerMap = config::getHandlerMap()

  if(handlerMap.has(id))
    return handlerMap.get(id)

  const handleable = await builder(config)
  handlerMap.set(id, handleable)

  return handleable
}

export const loadStreamHandler = async function(...args) {
  const handleable = await loadHandleable(...args)

  const handler = handleable.streamHandler
  if(!handler)
    throw new Error('handleable is not a stream handler')

  return handler
}

export const loadHttpHandler = async function(...args) {
  const handleable = await loadHandleable(...args)

  const handler = handleable.httpHandler
  if(!handler)
    throw new Error('handleable is not a http handler')

  return handler
}
