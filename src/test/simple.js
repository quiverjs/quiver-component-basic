import test from 'tape'
import { asyncTest } from 'quiver-util/tape'
import { ImmutableMap } from 'quiver-util/immutable'
import { createConfig } from 'quiver-component-base/util'

import {
  streamableToText, textToStreamable
} from 'quiver-stream-util'

import {
  simpleHandler
} from '../lib/constructor'

test('simple handler test', assert => {
  assert::asyncTest('basic simple handler', async function(assert) {
    const component = simpleHandler((args, body) => {
      assert.equal(args.get('foo'), 'bar')
      return body.toUpperCase()
    }, {
      inputType: 'text',
      outputType: 'text'
    })

    assert.equal(component.inputType, 'text')
    assert.equal(component.outputType, 'text')

    const builder = component.handleableBuilderFn()
    const handleable = await builder(createConfig())

    const handler = handleable.get('streamHandler')
    const args = ImmutableMap().set('foo', 'bar')

    const resultStreamable = await handler(
      args, textToStreamable('Hello World'))

    const result = await streamableToText(resultStreamable)
    assert.equal(result, 'HELLO WORLD')

    assert.end()
  })
})
