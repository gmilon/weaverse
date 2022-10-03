import React, { forwardRef, useContext } from 'react'
import { ArticleContext } from '~/elements/context'
import { WeaverseContext } from '@weaverse/react'
import type { ElementCSS } from '@weaverse/core'
import type { ArticleTitleProps } from '~/types'

let ArticleTitle = forwardRef<HTMLDivElement, ArticleTitleProps>(
  (props, ref) => {
    let { htmlTag, linkArticle, ...rest } = props
    let weaverseContext = useContext(WeaverseContext)
    let { ssrMode } = weaverseContext
    let { article, articleId, blogHandle } = useContext(ArticleContext)
    let content = (
      <span>
        {ssrMode ? `{{ article_${articleId}.title }}` : article?.title}
      </span>
    )
    if (linkArticle && blogHandle) {
      content = (
        <a href={`/blogs/${blogHandle}/${article.handle}`}>
          {ssrMode ? `{{ article_${articleId}.title }}` : article?.title}
        </a>
      )
    }
    return React.createElement(htmlTag, { ref, ...rest }, [content])
  }
)

export let css: ElementCSS = {
  '@desktop': {
    fontSize: 20,
    margin: 0,
    a: {
      all: 'inherit',
      cursor: 'pointer',
    },
  },
}

ArticleTitle.defaultProps = {
  htmlTag: 'h3',
  linkArticle: true,
}

export default ArticleTitle