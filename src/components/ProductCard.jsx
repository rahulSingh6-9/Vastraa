import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useStore } from '../context/useStore.js'
import { formatPrice } from '../utils/money.js'
import { getProductImages } from '../data/products.js'

function ProductCard({ product, useCardImages = false }) {
  const { wishlist, toggleWishlist } = useStore()
  const images = getProductImages(product)
  const cardImages = product.gender === 'men' || useCardImages
    ? product.cardImages || images
    : images
  const isWishlisted = wishlist.includes(product.id)
  const badge = product.sale
    ? 'SALE'
    : product.newArrival
      ? 'JUST IN'
      : product.featured
        ? 'VASTRAA EDIT'
        : ''

  return (
    <article className="product-card">
      <div className={`product-card__image${product.gender === 'men' ? ' product-card__image--men' : ''}${cardImages[1] ? '' : ' product-card__image--single'}`}>
        <Link
          className="product-card__photo-link"
          to={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
        >
          <img
            className="product-card__primary"
            src={cardImages[0]}
            alt={product.name}
            loading="lazy"
          />
          {cardImages[1] && (
            <img className="product-card__secondary" src={cardImages[1]} alt="" loading="lazy" />
          )}
          {badge && <span className="product-card__label">{badge}</span>}
          <span className="product-card__quickview">Discover piece <span aria-hidden="true">↗</span></span>
        </Link>
        <button
          className={`product-card__wishlist${isWishlisted ? ' is-active' : ''}`}
          type="button"
          aria-label={`${isWishlisted ? 'Remove from' : 'Add to'} wishlist: ${product.name}`}
          aria-pressed={isWishlisted}
          onClick={() => toggleWishlist(product.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.2 8.7c0 4.1-8.2 10.1-8.2 10.1S3.8 12.8 3.8 8.7a4.2 4.2 0 0 1 8.2-1.3 4.2 4.2 0 0 1 8.2 1.3Z" />
          </svg>
        </button>
      </div>
      <div className="product-card__details">
        <div>
          <h3><Link to={`/product/${product.slug}`}>{product.name}</Link></h3>
          <p>{product.category} · {product.colors[0].name}</p>
        </div>
        <div className="product-card__prices">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <del>{formatPrice(product.originalPrice)}</del>
          )}
        </div>
      </div>
    </article>
  )
}

export function ProductGrid({
  items,
  label = 'Products',
  columns = 4,
  useCardImages = false,
}) {
  const gridRef = useRef(null)
  const itemsKey = items.map((product) => product.id).join('|')

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid || !itemsKey) return undefined

    const motionMedia = gsap.matchMedia()
    motionMedia.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const cards = grid.querySelectorAll(':scope > .product-card')
        if (!cards.length) return

        gsap.fromTo(
          cards,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.72,
            stagger: 0.065,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 90%',
              once: true,
            },
          },
        )
      }, grid)

      return () => context.revert()
    })

    return () => motionMedia.revert()
  }, [itemsKey])

  return (
    <div className={`product-grid product-grid--${columns}`} aria-label={label} ref={gridRef}>
      {items.map((product) => (
        <ProductCard
          product={product}
          useCardImages={useCardImages}
          key={product.id}
        />
      ))}
    </div>
  )
}

export default ProductCard
