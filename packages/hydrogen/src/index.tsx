import elements from './elements'
import type { WeaverseRootPropsType, WeaverseType } from '@weaverse/react'
import { createRootContext, WeaverseRoot } from '@weaverse/react'
import React from 'react'

export * from '@weaverse/react'

export type WeaverseRootProps = WeaverseRootPropsType & {
  data?: any
}

let createWeaverseHydrogenContext = (configs: WeaverseType) => {
  let context = createRootContext(configs)

  Object.keys(elements).forEach((key) => {
    context.registerElement(elements[key])
  })
  return context
}

let WeaverseHydrogenRoot = ({ context }: WeaverseRootProps) => {
  return <WeaverseRoot context={context} />
}

export { WeaverseHydrogenRoot, createWeaverseHydrogenContext }
