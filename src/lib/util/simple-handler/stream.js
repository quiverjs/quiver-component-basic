import { textToStreamable, emptyStreamable } from 'quiver-stream-util'

export const streamableToStream = streamable =>
  streamable.toStream()

export const streamableToVoid = async function(streamable) {
  if(streamable.reusable) return

  const readStream = await streamable.toStream()
  await readStream.closeRead()
}

export const voidToStreamable = () =>
  Promise.resolve(emptyStreamable())

export const htmlToStreamable = (text) =>
  textToStreamable(text, 'text/html')

export const streamableToStreamable = async function(streamable) {
  if(typeof(streamable.toStream) !== 'function')
    throw new TypeError('streamable must have .toStream() method')

  return streamable
}
