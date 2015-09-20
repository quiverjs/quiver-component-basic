import test from 'tape'
import { asyncTest } from 'quiver-util/tape'
import { ImmutableMap } from 'quiver-util/immutable'
import { createConfig, loadHandler } from 'quiver-component-base/util'

import {
  streamableToText, textToStreamable
} from 'quiver-stream-util'

import { simpleHandler } from '../lib/constructor'
import { streamHandlerLoader } from '../lib/util/loader'

test('simple handler test', assert => {
  assert::asyncTest('basic simple handler', async function(assert) {
    const main = simpleHandler((args, body) => {
      assert.equal(args.get('foo'), 'bar')
      return body.toUpperCase()
    }, {
      inputType: 'text',
      outputType: 'text'
    })

    assert.equal(main.inputType, 'text')
    assert.equal(main.outputType, 'text')

    const handler = await loadHandler(createConfig(), main, {
      loader: streamHandlerLoader
    })

    const args = ImmutableMap().set('foo', 'bar')

    const resultStreamable = await handler(
      args, textToStreamable('Hello World'))

    const result = await streamableToText(resultStreamable)
    assert.equal(result, 'HELLO WORLD')

    assert.end()
  })
})
