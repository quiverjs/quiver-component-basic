import test from 'tape'
import { asyncTest } from 'quiver-util/tape'

import {
  streamableToText, textToStreamable, emptyStreamable
} from 'quiver-stream-util'

import {
  simpleHandler
} from '../lib/constructor'

test('simple handler test', assert => {
  assert::asyncTest('basic simple handler', async function(assert) {
    const component = simpleHandler((args, body) => {
      assert.equal(args.foo, 'bar')
      return body.toUpperCase()
    }, {
      inputType: 'text',
      outputType: 'text'
    })

    assert.equal(component.inputType, 'text')
    assert.equal(component.outputType, 'text')

    const builder = component.handleableBuilderFn()
    const handleable = await builder({})
    const handler = handleable.streamHandler

    const resultStreamable = await handler({ foo: 'bar' },
      textToStreamable('Hello World'))

    const result = await streamableToText(resultStreamable)
    assert.equal(result, 'HELLO WORLD')
  })
})
