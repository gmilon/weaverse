import React, { forwardRef, useContext } from 'react'
import { WeaverseContext } from '../context'
import { VideoElementProps } from '../types'

let Video = forwardRef<HTMLDivElement, VideoElementProps>((props, ref) => {
  let { isDesignMode } = useContext(WeaverseContext)
  let { src, type, controls, poster, autoPlay, loop, muted, ...rest } = props

  return (
    <div ref={ref} {...rest}>
      <video
        controls={isDesignMode ? false : controls}
        autoPlay={isDesignMode ? false : autoPlay}
        loop={loop}
        muted={true}
        controlsList="nodownload"
        disablePictureInPicture
      >
        <source src={src} type={type || 'video/mp4'} />
      </video>
    </div>
  )
})

Video.defaultProps = {
  src: 'https://ucarecdn.com/7cae0dab-8966-4484-9998-602728c360ca/IMG_0048.MOV',
  poster:
    'https://ucarecdn.com/48d73272-3fe3-43f6-8b5b-22b68fc5a8c8/section.png',
  loop: false,
  type: 'video/mp4',
  controls: false,
  autoPlay: true,
  muted: true,
  css: {
    '@desktop': {
      height: 'fit-content',
      margin: 0,
      outline: 'none',
      overflowWrap: 'break-word',
      padding: 0,
      whiteSpace: 'break-spaces',
      width: '100%',
      wordBreak: 'break-word',
    },
  },
}

export default Video
