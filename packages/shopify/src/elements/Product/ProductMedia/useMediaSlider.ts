import { useKeenSlider } from 'keen-slider/react'
import { useEffect } from 'react'
import type { ProductImageHooksInput } from '~/types'
import { MainSliderResizePlugin as ResizePlugin } from './ResizePlugin'
import { ThumbnailPlugin } from './ThumbnailPlugin'

export function useMediaSlider(input: ProductImageHooksInput) {
  let { context, onSlideChanged, onSliderCreated } = input
  let initialIndex = 0
  let featured_image = context?.selectedVariant?.featured_image
  if (featured_image) {
    initialIndex = featured_image.position - 1
  }

  let [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: initialIndex,
      slideChanged: onSlideChanged,
      created: onSliderCreated,
    },
    [ResizePlugin]
  )
  let [thumbnailRef, thumbnailInstanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: initialIndex,
      slides: {
        perView: 6,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef), ResizePlugin]
  )

  useEffect(() => {
    if (context) {
      let targetMediaIndex = -1
      let featured_image = context?.selectedVariant?.featured_image
      if (featured_image) {
        targetMediaIndex = featured_image.position - 1
      }
      if (targetMediaIndex >= 0 && instanceRef.current) {
        instanceRef.current.moveToIdx(targetMediaIndex)
      }
    }
  }, [context])

  return [sliderRef, thumbnailRef, instanceRef, thumbnailInstanceRef] as const
}
