const setStreamableMeta = (requestHead, streamable) => {
  const contentType = requestHead.getHeader('content-type')
  const contentLength = requestHead.getHeader('content-length')

  if(contentType && !streamable.contentType) {
    streamable.contentType = contentType
  }

  if(contentLength && typeof(streamable.contentLength) !== 'number') {
    streamable.contentLength = parseInt(contentLength)
  }
}

const setResponseHeader = (responseHead, streamable) => {
  const { contentType, contentLength } = streamable

  if(contentType) {
    responseHead = responseHead.setHeader('content-type', contentType)
  }

  if(typeof(contentLength) == 'number') {
    responseHead = responseHead.setHeader(
      'content-length', (contentLength|0).toString())
  }

  return responseHead
}

export const streamToHttpHandler = (streamHandler) =>
  async function(requestHead, requestStreamable) {
    setStreamableMeta(requestHead, requestStreamable)

    const args = requestHead.args
    const resultStreamable = await streamHandler(args, requestStreamable)

    let responseHead = requestHead.createResponseHead()
      .setStatus(200)

    responseHead = setResponseHeader(responseHead, resultStreamable)

    return [responseHead, resultStreamable]
  }
