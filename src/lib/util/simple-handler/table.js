import { entries } from 'quiver-util/object'

import {
  streamableToText, streamableToJson,
  textToStreamable, jsonToStreamable,
  streamToStreamable
} from 'quiver-stream-util'

import {
  htmlToStreamable,
  streamableToVoid, voidToStreamable,
  streamableToStream, streamableToStreamable,
} from './stream'

export const streamToSimpleTable = new Map(entries({
  void: streamableToVoid,
  empty: streamableToVoid,

  text: streamableToText,
  string: streamableToText,
  html: streamableToText,

  json: streamableToJson,

  stream: streamableToStream,
  streamable: streamableToStreamable
}))

export const simpleToStreamTable = new Map(entries({
  void: voidToStreamable,
  empty: voidToStreamable,

  text: textToStreamable,
  string: textToStreamable,

  html: htmlToStreamable,
  json: jsonToStreamable,

  stream: streamToStreamable,
  streamable: streamableToStreamable
}))
