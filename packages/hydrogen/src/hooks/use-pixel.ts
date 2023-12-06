import type { WeaverseHydrogen } from '~/index'
import { useEffect } from 'react'
import { useLocation } from '@remix-run/react'

let fetchingKey = ''

export function usePixel(context: WeaverseHydrogen) {
  // TODO: create a post xhr request to the pixel endpoint
  let { projectId, pageId, weaverseHost, isDesignMode } = context
  let location = useLocation()

  useEffect(() => {
    if (isDesignMode || !projectId || !pageId || !weaverseHost) return
    let currentKey = `${projectId}-${pageId}-${location.pathname}`
    if (fetchingKey === currentKey) return
    fetchingKey = currentKey
    let url = `${weaverseHost}/api/public/px`
    let xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({ projectId, pageId }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])
}
