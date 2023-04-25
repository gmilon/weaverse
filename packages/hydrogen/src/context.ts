import type { WeaverseType } from '@weaverse/react'
import { createRootContext, isBrowser } from '@weaverse/react'
import type { WeaverseComponentsType } from './types'

const createCachedWeaverseContext = (init: WeaverseType) => {
  if (isBrowser && init.pageId) {
    window.__weaverses = window.__weaverses || {}
    if (!window.__weaverses[init.pageId]) {
      window.__weaverses[init.pageId] = createRootContext(init)
    }
    console.log('createRootContext cached', window.__weaverses[init.pageId])
    return window.__weaverses[init.pageId]
  }
  console.log('createRootContext not cached')

  return createRootContext(init)
}
export let createWeaverseHydrogenContext = (
  {
    weaverseData: { pageData, config } = {
      pageData: {},
      config: {},
    },
  }: any,
  components: WeaverseComponentsType
) => {
  let weaverse = createCachedWeaverseContext({
    ...config,
    data: pageData,
    pageId: pageData?.id,
    isDesignMode: true,
    platformType: 'shopify-hydrogen',
  })
  Object.entries(components).forEach(([key, component]) => {
    weaverse.registerElement({
      type: component?.schema?.type || key,
      Component: component?.default,
      schema: component?.schema,
      defaultCss: component?.css,
      permanentCss: component?.permanentCss,
    })
  })

  return weaverse
}
