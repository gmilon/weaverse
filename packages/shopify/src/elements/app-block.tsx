import React, { forwardRef, useContext } from 'react'
import type { ElementCSS } from '@weaverse/core'
import { Components, WeaverseContext } from '@weaverse/react'

export let AppBlock = forwardRef<HTMLDivElement>((props, ref) => {
  let { isDesignMode } = useContext(WeaverseContext)
  if (isDesignMode) {
    return (
      <div ref={ref} {...props}>
        <Components.Placeholder element="App Block">
          Add an App Block inside Shopify Theme Customizer to show here.
        </Components.Placeholder>
      </div>
    )
  }
  return (
    <div data-prevent-hydration="true" ref={ref} {...props}>
      {`
        {%- unless app_block_index -%}
            {%- assign app_block_index = 0 -%}
        {%- endunless -%}
        {%- assign block = section.blocks[app_block_index] -%}
        {%- if block -%}
          {%- case block.type -%}
            {%- when '@app' -%}
              {%- render block -%}
              {%- assign app_block_index = app_block_index | plus: 1 -%}
            {%- endcase -%}
        {%- endif -%}
      `}
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    '> *': {
      pointerEvents: 'var(--pointer-events, unset)',
    },
  },
}

AppBlock.defaultProps = {}

export default AppBlock
