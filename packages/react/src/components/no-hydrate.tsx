import React, { useState } from 'react'

type NoHydrateProps = {
  id: string
  getHTML?: () => string
} & JSX.IntrinsicElements['div']

export function NoHydrate({ id, getHTML, ...rest }: NoHydrateProps) {
  let [html] = useState(() => {
    if (typeof document === 'undefined') {
      return getHTML?.() ?? ''
    }
    let el = document.getElementById(id)
    if (!el) return getHTML?.() ?? ''
    return el.innerHTML
  })
  return <div {...rest} id={id} dangerouslySetInnerHTML={{ __html: html }} />
}
