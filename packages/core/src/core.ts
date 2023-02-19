// TODO: Implement Weaverse SDK class
// Only core code is implemented here, avoid importing other packages,
// the core code should be framework agnostic, no react, vue, angular, etc.
// noinspection JSUnusedGlobalSymbols

// using stitches core only for framework-agnostic code
import * as stitches from "@stitches/core"
import type Stitches from "@stitches/core/types/stitches"
import type { RefObject } from "react"
import type {
  BreakPoints,
  ElementData,
  ElementFlags,
  WeaverseProjectDataType,
  WeaverseElement,
  WeaverseType,
  ElementSchema,
} from "./types"
import { isIframe, merge } from "./utils"
import { stichesUtils } from "./utils/styles"

/**
 * WeaverseItemStore is a store for Weaverse item, it can be used to subscribe/update the item data
 * @param itemData {ElementData} Weaverse item data
 * @param weaverse {Weaverse} Weaverse instance
 * @example
 * useEffect(() => {
 *     let handleUpdate = (update: any) => {
 *       setData({...update})
 *     }
 *     itemInstance.subscribe(handleUpdate)
 *     return () => {
 *       itemInstance.unsubscribe(handleUpdate)
 *     }
 * }, [])
 */
export class WeaverseItemStore {
  listeners: Set<any> = new Set()
  ref: RefObject<HTMLElement> = {
    current: null,
  }
  weaverse: Weaverse
  stitchesClass = ""
  _data: ElementData = { id: "", type: "" }
  _flags: ElementFlags = {}

  constructor(itemData: ElementData, weaverse: Weaverse) {
    let { type, id } = itemData
    this.weaverse = weaverse
    if (id && type) {
      weaverse.itemInstances.set(id, this)
      this.data = { ...itemData }
    }
  }

  get _id() {
    return this._data.id
  }
  get _element() {
    return this.ref.current
  }

  get Element() {
    return this.weaverse.elementInstances.get(this._data.type!)
  }

  set data(data: Omit<ElementData, "id" | "type">) {
    this._data = { ...this.data, ...data }
  }

  get data(): ElementData {
    let defaultCss = this.Element?.defaultCss || {}
    let currentCss = this._data.css || {}
    let css = merge(defaultCss, currentCss)
    let defaultData = { ...this.Element?.Component?.defaultProps }
    return { ...defaultData, ...this._data, css }
  }

  setData = (data: Omit<ElementData, "id" | "type">) => {
    this.data = Object.assign(this.data, data)
    this.triggerUpdate()
    return this.data
  }

  subscribe = (fn: any) => {
    this.listeners.add(fn)
  }

  unsubscribe = (fn: any) => {
    this.listeners.delete(fn)
  }

  triggerUpdate = () => {
    this.listeners.forEach((fn) => {
      return fn(this.data)
    })
  }
}

export class Weaverse {
  /**
   * The `weaverse-content-root` element of Weaverse SDK
   */
  contentRootElement: HTMLElement | undefined
  /**
   * For storing, registering element React component from Weaverse or created by user/developer
   */
  elementInstances = new Map<string, WeaverseElement>()
  /**
   * list of element/items store to provide data, handle state update, state sharing, etc.
   */
  itemInstances = new Map<string | number, WeaverseItemStore>()
  /**
   * Weaverse base URL that can provide by user/developer. for local development, use localhost:3000
   * @type {string}
   */
  weaverseHost: string = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://studio.weaverse.io"
  /**
   * Weaverse project key to access project data via API
   * @type {string}
   */
  projectId = ""
  /**
   * Weaverse project data, by default, user can provide project data via React Component:
   * <WeaverseRoot data={data} /> it will be used to server-side rendering
   */
  data: WeaverseProjectDataType = {
    rootId: "",
    items: [],
    script: { css: "", js: "" },
  }
  /**
   * Storing subscribe callback function for any component that want to listen to the change of WeaverseRoot
   * @type {Map<string, (data: any) => void>}
   */
  listeners: Set<any> = new Set()
  /**
   * Check whether the sdk is in editor or not.
   * If isDesignMode is true, it means the sdk is isDesignMode mode, render the editor UI,
   * else render the preview UI, plain HTML + CSS + React hydrate
   * @type {boolean}
   */
  isDesignMode = false

  /**
   * Check whether the sdk is in preview mode or not
   * @type {boolean}
   */
  isPreviewMode = false

  /**
   * Use in element to optionally render special HTML for hydration
   * @type {boolean}
   */
  ssrMode = false
  /**
   * Stitches instance for handling CSS stylesheet, media, theme for Weaverse project
   */
  stitchesInstance: Stitches | any

  studioBridge?: any
  elementSchemas?: ElementSchema[]
  static WeaverseItemStore: typeof WeaverseItemStore = WeaverseItemStore

  mediaBreakPoints: BreakPoints = {
    desktop: "all",
    // max-width need to subtract 0.02px to prevent bug https://getbootstrap.com/docs/5.1/layout/breakpoints/#max-width
    // tablet: "(max-width: 1023.98px)", // to set css for tablet, {'@tablet' : { // css }},
    mobile: "(max-width: 767.98px)",
  }

  /**
   * constructor
   * @param weaverseHost {string} Weaverse base URL that can provide by user/developer. for local development, use localhost:3000
   * @param projectId {string} Weaverse project key to access project data via API
   * @param data {WeaverseProjectDataType} Weaverse project data, by default, user can provide project data via React Component.
   * @param mediaBreakPoints {object} Pass down custom media query breakpoints or just use the default.
   * @param isDesignMode {boolean} check whether the sdk is isDesignMode or not
   * @param ssrMode {boolean} Use in element to optionally render special HTML for hydration
   * @param elementSchemas {Array<ElementSchema>} List of element schemas
   */
  constructor({
    weaverseHost,
    projectId,
    data,
    mediaBreakPoints,
    isDesignMode,
    ssrMode,
    elementSchemas,
  }: WeaverseType = {}) {
    this.init({ weaverseHost, projectId, data, mediaBreakPoints, isDesignMode, ssrMode, elementSchemas })
  }

  init({ weaverseHost, elementSchemas, projectId, data, mediaBreakPoints, isDesignMode, ssrMode }: WeaverseType = {}) {
    this.elementSchemas = elementSchemas || this.elementSchemas
    this.weaverseHost = weaverseHost || this.weaverseHost
    this.projectId = projectId || this.projectId
    this.mediaBreakPoints = mediaBreakPoints || this.mediaBreakPoints
    this.isDesignMode = isDesignMode || this.isDesignMode
    this.ssrMode = ssrMode || this.ssrMode
    this.data = data || this.data
    this.initStitches()
    this.initProjectItemData()
  }

  initialized = false
  initializeData = (data: any) => {
    console.log("initializeData", data)
    if (!this.initialized) {
      let { data: d, isDesignMode, id, projectId, weaverseHost } = data
      this.projectId = projectId || this.projectId
      this.weaverseHost = weaverseHost || this.weaverseHost
      this.data = { ...d, pageId: id }
      this.isDesignMode = isDesignMode
      this.initProjectItemData()
      if (this.isDesignMode) {
        this.initStitches()
        this.triggerUpdate()
        this.loadStudio()
      }
    }
    this.initialized = true
  }

  loadStudio(version?: string) {
    console.log("load studio")
    if (isIframe && this.isDesignMode && !this.studioBridge) {
      const initStudio = () => {
        this.studioBridge = new window.WeaverseStudioBridge(this)
        // Make event listeners from studio work
        this.triggerUpdate()
        console.log("Studio loaded", this)
        clearInterval(i)
      }
      let i = setInterval(() => {
        if (!window.WeaverseStudioBridge) {
          // Studio bridge script source -> https://weaverse.io/assets/studio/studio-bridge.js
          let studioBridgeScript = document.createElement("script")
          studioBridgeScript.src = `${this.weaverseHost}/assets/studio/studio-bridge.js?v=${version}`
          studioBridgeScript.type = "module"
          studioBridgeScript.onload = initStudio
          document.body.appendChild(studioBridgeScript)
        } else {
          initStudio()
        }
      }, 2000)
    }
  }

  /**
   * Register the custom React Component to Weaverse, store it into Weaverse.elementInstances
   * @param element {WeaverseElement} custom React Component
   */
  registerElement(element: WeaverseElement) {
    if (element?.type) {
      if (this.elementInstances.has(element.type)) {
        throw new Error(`Weaverse: Element '${element.type}' already registered`)
      }
      this.elementInstances.set(element?.type, element)
    } else {
      throw new Error("Weaverse: registerElement: `type` is required")
    }
  }

  initStitches = () => {
    this.stitchesInstance =
      this.stitchesInstance ||
      stitches.createStitches({
        prefix: "weaverse",
        media: this.mediaBreakPoints,
        utils: stichesUtils,
      })
  }

  subscribe(fn: any) {
    this.listeners.add(fn)
  }

  unsubscribe(fn: any) {
    this.listeners.delete(fn)
  }

  triggerUpdate() {
    this.listeners.forEach((fn) => fn())
  }

  setProjectData(data: WeaverseProjectDataType) {
    this.data = data
    this.initProjectItemData()
    this.triggerUpdate()
  }

  initProjectItemData() {
    const data = this.data
    if (data?.items) {
      data.items.forEach((item) => {
        if (!this.itemInstances.get(item.id as string | number)) {
          new WeaverseItemStore(item, this)
        }
      })
    }
  }
}
