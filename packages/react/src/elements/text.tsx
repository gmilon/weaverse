import type { ElementCSS } from '@weaverse/core'
import * as React from 'react'
import type { TextElementProps } from '~/types'

const Text = React.forwardRef<HTMLDivElement, TextElementProps>(
  (props, ref) => {
    let { children, value, ...rest } = props
    return (
      <div ref={ref} {...rest}>
        <div
          className="wv-text-content"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    )
  }
)

export let css: ElementCSS = {
  '@desktop': {
    display: 'flex',
    padding: '10px',
    overflow: 'hidden',
    '.wv-text-content': {
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'break-spaces',
      width: '100%',
      height: '100%',
      '> p': {
        margin: '0',
      },
    },
  },
}

Text.defaultProps = {
  value: '<p>The quick brown fox jumps over the lazy dog</p>',
}

export default Text
