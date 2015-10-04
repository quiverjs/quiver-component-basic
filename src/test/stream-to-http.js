import test from 'tape'
import { asyncTest } from 'quiver-util/tape'
import { RequestHead } from 'quiver-http-head'
import { createConfig, loadHandler } from 'quiver-component-base/util'

import {
  streamableToText, buffersToStreamable
} from 'quiver-stream-util'

import { simpleHandler, streamToHttpHandler } from '../lib/constructor'

test::asyncTest('stream to http handler test', async function(assert) {
  const main = simpleHandler(
  async function(args, streamable) {
    const requestHead = args.get('requestHead')
    assert.ok(requestHead)

    assert.equal(requestHead.getHeader('content-type'), 'text/plain')
    assert.equal(requestHead.getHeader('content-length'), '5')

    assert.equal(streamable.contentType, 'text/plain')
    assert.equal(streamable.contentLength, 5)

    const input = await streamableToText(streamable)
    assert.equal(input, 'hello')

    return 'goodbye'

  }, {
    inputType: 'streamable',
    outputType: 'text'
  })

  const wrapped = streamToHttpHandler(main)
  const handler = await loadHandler(createConfig(), wrapped)

  const requestHead = new RequestHead()
    .setPath('/')
    .setHeader('content-type', 'text/plain')
    .setHeader('content-length', '5')

  const requestStreamable = buffersToStreamable([new Buffer('hello')])

  const [responseHead, responseStreamable] = await handler(
    requestHead, requestStreamable)

  assert.equal(responseHead.status, '200')
  assert.equal(responseHead.getHeader('content-type'), 'text/plain')

  // TODO: include streamable.contentLength in stream-util
  // assert.equal(responseHead.getHeader('content-legth'), '7')

  const result = await streamableToText(responseStreamable)
  assert.equal(result, 'goodbye')

  assert.end()
})
