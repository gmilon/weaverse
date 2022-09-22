import React, { createContext } from 'react'
import type { ProductContextProps, ProductListContextProps } from '~/types'
export let ProductContext = createContext<ProductContextProps>({})
export let ProductProvider = ProductContext.Provider
export let ProductConsumer = ProductContext.Consumer
export let ProductListContext = React.createContext<ProductListContextProps>({})
export let ProductListProvider = ProductListContext.Provider
/**
 * For fast access to `window.weaverseShopifyProducts` and server-side render
 * create a proxy version of `window.weaverseShopifyProduct`
 */
export let weaverseShopifyProducts = new Proxy(
  // @ts-ignore
  globalThis?.weaverseShopifyProducts || {},
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaverseShopifyProducts?.[name]
    },
  }
)

export let weaverseShopifyStoreData = new Proxy(
  // @ts-ignore
  globalThis?.weaverseShopifyStoreData || {},
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaverseShopifyStoreData?.[name]
    },
  }
)

export let weaverseShopifyProductLists = new Proxy(
  // @ts-ignore
  globalThis?.weaverseShopifyProductLists || {},
  {
    get: (target, name) => {
      // @ts-ignore
      return target?.[name] || globalThis?.weaverseShopifyProductLists?.[name]
    },
  }
)
