import React, { forwardRef } from 'react'
import type { PlaceholderProps } from '~/types'

const Placeholder = forwardRef<HTMLDivElement, PlaceholderProps>(
  (props, ref) => {
    let { element, children, ...rest } = props
    let style = {
      position: 'absolute',
      height: 'calc(100% - 20px)',
      width: 'calc(100% - 20px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#374151',
      pointerEvents: 'none',
      zIndex: 1,
      border: '1px dashed #0F71FF',
      margin: 10,
    } as React.CSSProperties

    return (
      <div style={style} ref={ref} {...rest}>
        <div style={{ fontWeight: 600, marginBottom: '10px' }}>{element}</div>
        <div>{children}</div>
      </div>
    )
  }
)

export default Placeholder
