import test from 'tape'
import { asyncTest, rejected } from 'quiver-util/tape'
import { Config, loadHandler } from 'quiver-component-base/util'

import { Args } from '../lib/util'
import {
  configMiddleware, simpleHandler, simpleHandlerBuilder
} from '../lib/constructor'

test('config middleware test', assert => {
  assert::asyncTest('success test', async function(assert) {
    const middleware = configMiddleware(
      config => config.set('foo', 'bar'))

    const main = simpleHandlerBuilder(config => {
      assert.equal(config.get('foo'), 'bar')
      return args => 'hello world'
    }, {
      inputType: 'empty',
      outputType: 'text'
    })
    .addMiddleware(middleware)

    const config = Config()

    const handler = await loadHandler(config, main)
    assert.notOk(config.get('foo'))

    const result = await handler(Args())
    assert.equal(result, 'hello world')

    assert.end()
  })

  assert::asyncTest('bad config handlers test', async function(assert) {
    const middleware = configMiddleware(
      config => ({ desc: 'plain object' }))

    const main = simpleHandler(
      args => 'hello world',
      {
        inputType: 'empty',
        outputType: 'text'
      })
    .addMiddleware(middleware)

    await assert::rejected(loadHandler(Config(), main))

    assert.end()
  })

  assert.end()
})
