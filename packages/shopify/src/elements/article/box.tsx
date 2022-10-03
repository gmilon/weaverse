import React, { forwardRef, useContext } from 'react'
import {
  ArticleContext,
  weaverseShopifyArticles,
  BlogContext,
} from '../context'
import type { ElementCSS } from '@weaverse/core'
import type { ArticleBoxProps } from '~/types'

let ArticleBox = forwardRef<HTMLDivElement, ArticleBoxProps>((props, ref) => {
  let { children, articleId: aId, articleHandle, ...rest } = props
  let { articleId: articleAutoId, blogHandle } = useContext(BlogContext)
  let articleId = articleAutoId || aId
  let article = weaverseShopifyArticles[articleId]
  return (
    <div {...rest} ref={ref} key={articleId}>
      {articleId ? (
        <ArticleContext.Provider
          value={{
            article,
            articleId,
            blogHandle,
          }}
        >
          {article && children}
        </ArticleContext.Provider>
      ) : (
        'Select a article and start editing.'
      )}
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {},
}

export let permanentCss: ElementCSS = {
  '@desktop': {},
}

ArticleBox.defaultProps = {
  // articleId: 7176137277624,
  // articleHandle: 'adidas-kids-stan-smith',
}

export default ArticleBox