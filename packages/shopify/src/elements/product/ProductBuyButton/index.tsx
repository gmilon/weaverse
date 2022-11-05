import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext, useRef, useState } from 'react'
import { ProductContext } from '~/context'
import { Spinner } from '~/elements/shared'
import type { ProductBuyButtonProps } from '~/types'
import { addProductToCart } from '~/utils'
import { QuantitySelector } from './QuantitySelector'

let ProductBuyButton = forwardRef<HTMLDivElement, ProductBuyButtonProps>(
  (props, ref) => {
    let {
      showQuantitySelector,
      quantityLabel,
      buttonText,
      soldOutText,
      unavailableText,
      ...rest
    } = props
    let atcRef = useRef<HTMLButtonElement>(null)
    let context = useContext(ProductContext)
    let [adding, setAdding] = useState(false)

    if (context) {
      let { formRef, ssrMode, selectedVariant } = context
      let available = false
      if (selectedVariant) {
        if ('available' in selectedVariant) {
          available = Boolean(selectedVariant.available)
        } else {
          available =
            selectedVariant.inventory_quantity > 0 ||
            selectedVariant.inventory_policy === 'continue' ||
            selectedVariant.inventory_management === null
        }
      }

      let handleATC = (e: React.MouseEvent) => {
        e.preventDefault()
        setAdding(true)
        addProductToCart(formRef?.current as HTMLFormElement, () =>
          setAdding(false)
        )
      }

      if (ssrMode) {
        return (
          <div ref={ref} {...rest}>
            <button
              type="submit"
              name="add"
              className="wv-product-atc-button"
              disabled={!available}
            >
              {`
                <span>
                  {%- if product.available -%}
                    ${buttonText}
                  {%- else -%}
                    ${soldOutText}
                  {%- endif -%}
                </span>
              `}
            </button>
          </div>
        )
      }

      let atcText = buttonText
      if (!available) atcText = soldOutText
      if (!selectedVariant) atcText = unavailableText

      return (
        <div ref={ref} {...rest}>
          {showQuantitySelector && (
            <label className="wv-product-quantity-label">{quantityLabel}</label>
          )}
          <div className="wv-product-buy-buttons">
            {showQuantitySelector && <QuantitySelector />}
            <button
              ref={atcRef}
              disabled={adding || !available || !selectedVariant}
              onClick={handleATC}
              type="submit"
              className="wv-product-atc-button"
            >
              <span>{atcText}</span>
              {adding && <Spinner />}
            </button>
          </div>
        </div>
      )
    }
    return null
  }
)

export let css: ElementCSS = {
  '@desktop': {
    marginTop: '20px',
    '.wv-product-quantity-label': {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
    },
    '.wv-product-buy-buttons': {
      display: 'flex',
    },
    '.wv-quantity-selector': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '10px',
      width: '130px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
    },
    '.wv-quantity-button': {
      display: 'flex',
      padding: '0px',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    '.wv-quantity-input': {
      width: '50px',
      height: '40px',
      fontSize: '16px',
      border: 'none',
      textAlign: 'center',
      backgroundColor: 'transparent',
      outline: 'none',
    },
    '.wv-product-atc-button': {
      backgroundColor: '#273820',
      padding: '0px',
      height: '50px',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      flexGrow: 1,
      fontWeight: '500',
      fontSize: '1em',
      lineHeight: '1',
      textAlign: 'center',
      transition: 'background 0.2s ease-in-out',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        backgroundColor: '#2c3e2f',
      },
      '&:disabled': {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
  },
  '@mobile': {
    '.wv-quantity-selector': {
      width: '110px',
    },
    '.wv-quantity-input': {
      width: '30px',
    },
  },
}

ProductBuyButton.defaultProps = {
  showQuantitySelector: true,
  quantityLabel: 'Quantity',
  buttonText: 'Add to cart',
  soldOutText: 'Sold Out',
  unavailableText: 'Unavailable',
}

export default ProductBuyButton