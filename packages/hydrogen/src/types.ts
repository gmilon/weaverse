/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />
import type { ElementSchema, WeaverseElement } from '@weaverse/react'
import type React from 'react'
import type { LoaderArgs } from '@shopify/remix-oxygen'
import type { ForwardRefExoticComponent } from 'react'

// import type { Storefront as HydrogenStorefront } from '@shopify/hydrogen'
// import type {
//   CountryCode,
//   CurrencyCode,
//   LanguageCode,
// } from '@shopify/hydrogen/storefront-api-types'

// export type Locale = {
//   language: LanguageCode
//   country: CountryCode
//   label: string
//   currency: CurrencyCode
// }

// export type Localizations = Record<string, Locale>

// export type I18nLocale = Locale & {
//   pathPrefix: string
// }

// export type Storefront = HydrogenStorefront<I18nLocale>

// export enum CartAction {
//   ADD_TO_CART = 'ADD_TO_CART',
//   REMOVE_FROM_CART = 'REMOVE_FROM_CART',
//   UPDATE_CART = 'UPDATE_CART',
//   UPDATE_DISCOUNT = 'UPDATE_DISCOUNT',
//   UPDATE_BUYER_IDENTITY = 'UPDATE_BUYER_IDENTITY',
// }
// export type CartActions = keyof typeof CartAction

// declare global {
//   /**
//    * A global `process` object is only available during build to access NODE_ENV.
//    */
//   // const process: { env: { NODE_ENV: 'production' | 'development' } }

//   /**
//    * Declare expected Env parameter in fetch handler.
//    */
//   interface Env {
//     SESSION_SECRET: string
//     PUBLIC_STOREFRONT_API_TOKEN: string
//     PRIVATE_STOREFRONT_API_TOKEN: string
//     PUBLIC_STOREFRONT_API_VERSION: string
//     PUBLIC_STORE_DOMAIN: string
//     PUBLIC_STOREFRONT_ID: string
//     WEAVERSE_PROJECT_ID: string
//     WEAVERSE_HOST: string
//   }
// }

/**
 * Declare local additions to `AppLoadContext` to include the session utilities we injected in `server.ts`.
 */
export type TODO = any
declare module '@shopify/remix-oxygen' {
  export interface AppLoadContext {
    waitUntil: ExecutionContext['waitUntil']
    session: TODO
    storefront: TODO
    env: TODO
  }
}

export type WeaverseLoaderArgs = LoaderArgs & {
  data: any
  configs: { projectId: string; weaverseHost: string }
}

export interface HydrogenComponentSchema extends ElementSchema {
  isSection?: boolean
}

export interface HydrogenComponentProps<T = unknown> extends WeaverseElement {
  loaderData?: T
  children?: React.JSX.Element[]
}

export interface HydrogenComponent<T = HydrogenComponentProps> {
  default: ForwardRefExoticComponent<T>
  schema: ElementSchema
  loader?: (args: WeaverseLoaderArgs) => Promise<unknown>
}

export type HydrogenPageConfigs = {
  projectId: string
  weaverseHost: string
  version?: string
  isDesignMode?: boolean
  [key: string]: any
}

export interface HydrogenPageData {
  page: any
  configs: HydrogenPageConfigs
}
