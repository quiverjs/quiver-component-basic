import { assertHandlerComponent } from 'quiver-component-base/util'

export const assertStreamHandlerComponent = component => {
  assertHandlerComponent(component)

  if(!component.isStreamHandlerComponent)
    throw new TypeError('component must be stream handler component')
}

export const assertHttpHandlerComponent = component => {
  assertHandlerComponent(component)

  if(!component.isHttpHandlerComponent)
    throw new TypeError('component must be http handler component')
}
