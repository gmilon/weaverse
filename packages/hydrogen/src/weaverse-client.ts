import pkg from '../package.json'
import type {
  AllCacheOptions,
  FetchProjectPayload,
  FetchProjectRequestBody,
  FetchWithCacheOptions,
  HydrogenComponentData,
  LoadPageParams,
  WeaverseClientArgs,
  WeaverseLoaderData,
  WeaverseProjectConfigs,
  WeaverseStudioQueries,
} from './types'
import { getRequestQueries, getWeaverseConfigs } from './utils'

export class WeaverseClient {
  API = 'api/public/project'
  clientVersion = pkg.version
  basePageConfigs: Omit<WeaverseProjectConfigs, 'requestInfo'>
  basePageRequestBody: Omit<FetchProjectRequestBody, 'url'>
  configs: WeaverseProjectConfigs

  request: WeaverseClientArgs['request']
  storefront: WeaverseClientArgs['storefront']
  components: WeaverseClientArgs['components']
  themeSchema: WeaverseClientArgs['themeSchema']
  env: WeaverseClientArgs['env']
  withCache: WeaverseClientArgs['withCache']
  countries?: WeaverseClientArgs['countries']

  constructor(args: WeaverseClientArgs) {
    let {
      env,
      storefront,
      components,
      countries,
      withCache,
      themeSchema,
      request,
    } = args
    this.request = request
    this.storefront = storefront
    this.components = components
    this.themeSchema = themeSchema
    this.env = env
    this.withCache = withCache
    this.countries = countries

    this.configs = getWeaverseConfigs(request, env)
    this.basePageConfigs = {
      projectId: this.configs.projectId,
      weaverseHost: this.configs.weaverseHost,
      weaverseVersion: this.configs.weaverseVersion,
      isDesignMode: this.configs.isDesignMode,
    }
    this.basePageRequestBody = {
      countries,
      isDesignMode: this.configs.isDesignMode,
      i18n: storefront.i18n,
      projectId: this.configs.projectId,
    }
  }

  fetchWithCache = <T>(url: string, options: FetchWithCacheOptions) => {
    let cacheKey = [url, options.body]
    let { strategy = this.storefront.CacheShort(), ...reqInit } = options
    let res = this.withCache(cacheKey, strategy, async () => {
      let response = await fetch(url, reqInit)
      if (!response.ok) {
        let error = await response.text()
        let { status, statusText } = response
        throw new Error(`${status} ${statusText} ${error}`)
      }
      return await response.json<T>()
    })
    return res as Promise<T>
  }

  loadThemeSettings = async (strategy?: AllCacheOptions) => {
    try {
      let { API, configs } = this
      let { weaverseHost, projectId } = configs
      if (!projectId) {
        throw new Error('Missing Weaverse projectId!')
      }
      let res = await this.fetchWithCache(
        `${weaverseHost}/${API}/${projectId}/configs`,
        { method: 'POST', strategy },
      )
      let data = res || {}
      if (this.configs.isDesignMode) {
        data = {
          ...data,
          schema: this.themeSchema,
          countries: this.countries || [],
          publicEnv: this.configs.publicEnv,
        }
      }
      return data
    } catch (e) {
      console.error(`❌ Theme settings load failed.`, e)
      return null
    }
  }

  loadPage = async (
    params: LoadPageParams = {},
  ): Promise<WeaverseLoaderData | null> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        let { request, storefront, basePageRequestBody, basePageConfigs } = this
        let { projectId, isDesignMode, weaverseHost } = this.configs

        if (!projectId) {
          throw new Error('Missing Weaverse projectId!')
        }
        let { strategy, ...pageLoadParams } = params
        let body: FetchProjectRequestBody = {
          ...basePageRequestBody,
          params: pageLoadParams,
          url: request.url,
        }
        let reqInit: RequestInit = {
          method: 'POST',
          body: JSON.stringify(body),
        }
        let url = `${weaverseHost}/${this.API}`
        let payload: FetchProjectPayload
        if (isDesignMode) {
          payload = await fetch(url, reqInit).then((res) => res.json())
        } else {
          payload = await this.fetchWithCache(url, {
            ...reqInit,
            strategy,
          })
        }
        let { page, project, pageAssignment } = payload
        if (!page || !project || !pageAssignment) {
          throw new Error(
            // @ts-ignore
            payload?.error || 'Invalid Weaverse project payload!',
          )
        }
        if (page?.items) {
          let items = page.items
          page.items = await Promise.all(
            items.map((item) => this.execComponentLoader(item)),
          )
        }
        let data: WeaverseLoaderData = {
          page,
          project,
          pageAssignment,
          configs: {
            ...basePageConfigs,
            requestInfo: {
              i18n: storefront.i18n,
              queries: getRequestQueries<WeaverseStudioQueries>(request),
              pathname: new URL(request.url).pathname,
              search: new URL(request.url).search,
            },
          },
        }
        return resolve(data)
      } catch (e) {
        console.error(`❌ Page load failed.`, e)
        reject(e)
      }
    })
  }

  execComponentLoader = async (item: HydrogenComponentData) => {
    let { data = {}, type, id } = item
    let schema = this.components.find(({ schema }) => schema?.type === type)
    let { loader } = schema || {}
    if (loader && typeof loader === 'function') {
      try {
        return {
          ...item,
          loaderData: await loader({
            data,
            weaverse: this,
          }),
        }
      } catch (e) {
        console.warn(`❌ Item loader run failed.`, type, id, e)
        return item
      }
    }
    return item
  }
}