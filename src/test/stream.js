import test from 'tape'
import { asyncTest } from 'quiver-util/tape'

import {
  streamableToText, textToStreamable, emptyStreamable
} from 'quiver-stream-util'

import {
  streamHandler, streamFilter
} from '../lib/constructor'

test('integrated stream handler test', assert => {
  assert::asyncTest('basic body filter', async function(assert) {
    const bodyFilter = streamFilter((config, handler) => {
      assert.equal(config.foo, 'bar')

      return async function(args, streamable) {
        args.body = await streamableToText(streamable)
        return handler(args, emptyStreamable())
      }
    })

    const main = streamHandler((args, streamable) => {
      assert.equal(args.body, 'input')
      return textToStreamable('hello world')
    })
    .addMiddleware(bodyFilter)

    const builder = main.handleableBuilderFn()
    const handleable = await builder({ foo: 'bar' })

    const handler = handleable.streamHandler
    const resultStreamable = await handler({},
      textToStreamable('input'))

    const result = await streamableToText(resultStreamable)
    assert.equal(result, 'hello world')
  })

  assert.end()
})
