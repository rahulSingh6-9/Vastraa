import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductBySlug, getProductImages, products } from '../data/products.js'
import { ProductGrid } from '../components/ProductCard.jsx'
import { formatPrice } from '../utils/money.js'
import { getCartItemKey } from '../utils/cart.js'
import { useStore } from '../context/useStore.js'

function ProductDetailsPage() {
  const { slug } = useParams()
  return <ProductDetailsContent key={slug} slug={slug} />
}

function ProductDetailsContent({ slug }) {
  const navigate = useNavigate()
  const product = getProductBySlug(slug)
  const { addToCart, wishlist, toggleWishlist } = useStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '')
  const [quantity, setQuantity] = useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!product) return
    try {
      const recent = JSON.parse(window.localStorage.getItem('vastraa.recentlyViewed') || '[]')
      const next = [product.id, ...recent.filter((id) => id !== product.id)].slice(0, 6)
      window.localStorage.setItem('vastraa.recentlyViewed', JSON.stringify(next))
    } catch (error) {
      console.error('Unable to update recently viewed products.', error)
    }
  }, [product])

  if (!product) {
    return (
      <section className="not-found-page">
        <p className="eyebrow">Piece not found</p>
        <h1>This one has moved on.</h1>
        <Link className="button button--dark" to="/shop">Explore the shop</Link>
      </section>
    )
  }

  const isWishlisted = wishlist.includes(product.id)
  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4)
  const productImages = getProductImages(product, selectedColor)

  const handleAddToCart = (goToCheckout = false) => {
    if (!selectedSize) {
      setNotice('Choose a size before adding this piece.')
      return
    }

    addToCart(product, selectedSize, selectedColor, quantity)
    setNotice(`${product.name} added to your bag.`)
    if (goToCheckout) {
      const buyNowItem = {
        key: getCartItemKey(product.id, selectedSize, selectedColor),
        productId: product.id,
        size: selectedSize,
        color: selectedColor,
        quantity,
      }
      navigate('/checkout', {
        state: { buyNow: true, buyNowItem, backTo: `/product/${product.slug}` },
      })
    }
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail">
        <div className="product-detail__gallery">
          <div className={`product-detail__main-image${product.gender === 'men' ? ' product-detail__main-image--contain' : ''}`} data-reveal-image>
            <img src={productImages[selectedImage] || productImages[0]} alt={`${product.name} in ${selectedColor}`} fetchPriority="high" />
          </div>
          {productImages.length > 1 && (
            <div className={`product-detail__thumbnails${product.gender === 'men' ? ' product-detail__thumbnails--contain' : ''}`} aria-label="Product images">
              {productImages.map((image, index) => (
                <button
                  type="button"
                  className={selectedImage === index ? 'is-selected' : ''}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View image ${index + 1} of ${product.name}`}
                  key={image}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail__info">
          <p className="eyebrow">{product.category} · VASTRAA</p>
          <h1 data-reveal>{product.name}</h1>
          <div className="product-detail__rating">
            <span aria-label={`${product.rating} out of 5 stars`}>★★★★★</span>
            <a href="#reviews">{product.rating} ({product.reviewCount} reviews)</a>
          </div>
          <div className="product-detail__price">
            <strong>{formatPrice(product.price)}</strong>
            {product.originalPrice > product.price && <del>{formatPrice(product.originalPrice)}</del>}
          </div>
          <p className="product-detail__description">{product.description}</p>

          <div className="product-option">
            <div className="product-option__heading">
              <span>Colour: <strong>{selectedColor}</strong></span>
            </div>
            <div className="product-colors">
              {product.colors.map((color) => (
                <button
                  className={selectedColor === color.name ? 'is-selected' : ''}
                  style={{ '--swatch': color.value }}
                  type="button"
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color.name)
                    setSelectedImage(0)
                  }}
                  aria-label={`Select ${color.name}`}
                  aria-pressed={selectedColor === color.name}
                />
              ))}
            </div>
          </div>

          <div className="product-option">
            <div className="product-option__heading">
              <span>Size: <strong>{selectedSize || 'Select a size'}</strong></span>
              <button type="button" className="text-button" onClick={() => setSizeGuideOpen(true)}>
                Size guide
              </button>
            </div>
            <div className="product-sizes">
              {product.sizes.map((size) => (
                <button
                  type="button"
                  className={selectedSize === size ? 'is-selected' : ''}
                  key={size}
                  onClick={() => { setSelectedSize(size); setNotice('') }}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-detail__buy">
            <div className="quantity-control" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">−</button>
              <span aria-live="polite">{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button type="button" className="button button--dark" onClick={() => handleAddToCart()}>
              Add to bag
            </button>
            <button
              type="button"
              className={`product-detail__wishlist${isWishlisted ? ' is-active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isWishlisted}
            >
              ♥
            </button>
          </div>
          <button type="button" className="button button--light product-detail__buy-now" onClick={() => handleAddToCart(true)}>
            Buy now
          </button>
          <p className="product-detail__feedback" role="status">{notice}</p>
          <p className="product-detail__stock">{product.stock > 0 ? 'In stock · Ready to ship' : 'Currently unavailable'}</p>

          <details className="product-info-disclosure">
            <summary>Description &amp; fit</summary>
            <p>{product.description} Designed for comfortable movement and easy styling.</p>
          </details>
          <details className="product-info-disclosure">
            <summary>Material &amp; care</summary>
            <p>Refer to the garment label for care. Wash with similar colours and store with care.</p>
          </details>
          <details className="product-info-disclosure">
            <summary>Shipping &amp; returns</summary>
            <p>Complimentary shipping over ₹1,999. This demonstration does not process real orders.</p>
          </details>
        </div>
      </div>

      <section className="product-reviews section-pad" id="reviews">
        <p className="eyebrow">The VASTRAA community</p>
        <h2 data-reveal>Worn and loved.</h2>
        <div className="product-reviews__list">
          {product.reviews.map((review) => (
            <article key={review.name}>
              <span>{'★'.repeat(review.rating)}</span>
              <p>“{review.text}”</p>
              <small>{review.name} · Verified customer</small>
            </article>
          ))}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section-pad related-products">
          <div className="section-heading" data-reveal>
            <div><p className="eyebrow">A few more to love</p><h2>Goes well with.</h2></div>
          </div>
          <ProductGrid items={relatedProducts} label="Related products" />
        </section>
      )}

      {sizeGuideOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSizeGuideOpen(false)}>
          <section className="size-guide-modal" role="dialog" aria-modal="true" aria-labelledby="size-guide-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSizeGuideOpen(false)} aria-label="Close size guide">×</button>
            <p className="eyebrow">Find your fit</p>
            <h2 id="size-guide-title">Size guide</h2>
            <p>For the best fit, use your usual size. If you prefer a more relaxed feel, consider sizing up.</p>
            <div className="size-guide-modal__table">
              <span>Size</span><span>Chest</span><span>Waist</span>
              <span>S</span><span>86–91 cm</span><span>71–76 cm</span>
              <span>M</span><span>91–97 cm</span><span>76–81 cm</span>
              <span>L</span><span>97–102 cm</span><span>81–86 cm</span>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default ProductDetailsPage
