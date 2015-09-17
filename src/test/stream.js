import test from 'tape'
import { asyncTest } from 'quiver-util/tape'
import { ImmutableMap } from 'quiver-util/immutable'
import { createConfig } from 'quiver-component-base/util'

import {
  streamableToText, textToStreamable, emptyStreamable
} from 'quiver-stream-util'

import {
  streamHandler, streamFilter
} from '../lib/constructor'

test('integrated stream handler test', assert => {
  assert::asyncTest('basic body filter', async function(assert) {
    const bodyFilter = streamFilter((config, handler) => {
      assert.equal(config.get('foo'), 'bar')

      return async function(args, streamable) {
        const body = await streamableToText(streamable)
        const newArgs = args.set('body', body)

        return handler(newArgs, emptyStreamable())
      }
    })

    const main = streamHandler((args, streamable) => {
      assert.equal(args.get('body'), 'input')
      return textToStreamable('hello world')
    })
    .addMiddleware(bodyFilter)

    const builder = main.handleableBuilderFn()
    const config = createConfig().set('foo', 'bar')
    const handleable = await builder(config)

    const handler = handleable.get('streamHandler')
    const args = ImmutableMap()

    const resultStreamable = await handler(
      args, textToStreamable('input'))

    const result = await streamableToText(resultStreamable)
    assert.equal(result, 'hello world')

    assert.notOk(args.get('body'))

    assert.end()
  })

  assert.end()
})
