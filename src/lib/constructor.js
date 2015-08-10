import {
  safeBuilder, safeHandler,
  implComponentConstructor
} from 'quiver-component-util'

import {
  StreamFilter, HttpFilter,
  HandleableFilter,
  HttpHandler, HttpHandlerBuilder,
  SimpleHandler, SimpleHandlerBuilder,
  StreamHandler, StreamHandlerBuilder
} from './index'

export const streamFilter = implComponentConstructor(
  StreamFilter, 'streamFilterFn', safeBuilder)

export const httpFilter = implComponentConstructor(
  HttpFilter, 'httpFilterFn', safeBuilder)

export const handleableFilter = implComponentConstructor(
  HandleableFilter, 'handleableFilterFn', safeHandler)

export const httpHandler = implComponentConstructor(
  HttpHandler, 'httpHandlerFn', safeHandler)

export const httpHandlerBuilder = implComponentConstructor(
  HttpHandlerBuilder, 'httpHandlerBuilderFn', safeBuilder)

export const simpleHandler = implComponentConstructor(
  SimpleHandler, 'simpleHandlerFn', safeHandler)

export const simpleHandlerBuilder = implComponentConstructor(
  SimpleHandlerBuilder, 'simpleHandlerBuilderFn', safeBuilder)

export const streamHandler = implComponentConstructor(
  StreamHandler, 'streamHandlerFn', safeHandler)

export const streamHandlerBuilder = implComponentConstructor(
  StreamHandlerBuilder, 'streamHandlerBuilderFn', safeBuilder)
