import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { products } from '../data/products.js'
import { useStore } from '../context/useStore.js'
import { formatPrice } from '../utils/money.js'

const menShowcaseFiles = import.meta.glob('../assets/menpng/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const showcaseItems = Object.values(Object.entries(menShowcaseFiles)
  .reduce((groups, [path, src]) => {
    const fileName = path.split('/').pop()
    const match = fileName.match(/^(\d+)(front|side)\.[^.]+$/i)

    if (!match) return groups

    const [, number, view] = match
    const item = groups[number] || { number: Number(number), front: '', side: '' }
    item[view.toLowerCase()] = src
    groups[number] = item
    return groups
  }, {}))
  .sort((first, second) => first.number - second.number)
  .map((item) => ({
    ...item,
    side: item.side || item.front,
    front: item.front || item.side,
  }))

const catalogProducts = products.filter((product) =>
  product.gender === 'men' || product.gender === 'unisex',
)

const suggestedProductIds = {
  1: 'vs-007',
  2: 'vs-007',
  3: 'vs-008',
  4: 'vs-008',
}

const showcaseItemNames = {
  1: 'Navy T-shirt',
  2: 'Light T-shirt',
  3: 'Leather Jacket',
  4: 'Graphic Hoodie',
}

const getShowcaseItemName = (item) => showcaseItemNames[item.number] || "Men's Garment"

function HangingRail() {
  return (
    <svg className="men-showcase__rail" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="men-showcase-rail-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#f4f6f7" />
          <stop offset="38%" stopColor="#aeb5b8" />
          <stop offset="57%" stopColor="#f7f8f8" />
          <stop offset="100%" stopColor="#737a7e" />
        </linearGradient>
      </defs>
      <path d="M0 24 Q500 88 1000 24" fill="none" stroke="#080909" strokeWidth="12" opacity=".7" />
      <path d="M0 22 Q500 86 1000 22" fill="none" stroke="url(#men-showcase-rail-gradient)" strokeWidth="5" />
      <path d="M0 20 Q500 84 1000 20" fill="none" stroke="#fff" strokeWidth="1" opacity=".75" />
    </svg>
  )
}

function HangingProduct({ item, index, active, flipped, onActivate, onOpen, onFlip }) {
  const label = getShowcaseItemName(item)

  return (
    <article
      className={`men-showcase__product${active ? ' is-active' : ''}${flipped ? ' is-flipped' : ''}`}
      data-index={index}
      onFocus={() => onActivate(index)}
    >
      <span className="men-showcase__string" aria-hidden="true" />
      <button
        type="button"
        className="men-showcase__assembly"
        onClick={() => {
          onActivate(index)
          onOpen(item)
        }}
        aria-label={`${label}, ${flipped ? 'front' : 'side'} view. Open details and purchase options.`}
      >
        <span className="men-showcase__garment">
          <img className="men-showcase__side-image" src={item.side} alt="" draggable="false" />
          <img className="men-showcase__front-image" src={item.front} alt="" draggable="false" />
        </span>
        <span className="men-showcase__ground-shadow" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="men-showcase__touch-toggle"
        onClick={() => onFlip(item.number)}
        aria-label={`Show ${flipped ? 'side' : 'front'} view of ${label}`}
      >
        {flipped ? 'Show side' : 'Show front'}
      </button>
    </article>
  )
}

function AddToBagOptions({ product }) {
  const { addToCart } = useStore()
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '')
  const [selectedSize, setSelectedSize] = useState('')
  const [notice, setNotice] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!selectedSize) {
      setNotice('Choose a size to add this catalogue item to your bag.')
      return
    }

    addToCart(product, selectedSize, selectedColor)
    setNotice(`${product.name} added to your bag.`)
  }

  return (
    <form className="men-showcase__purchase-form" onSubmit={handleSubmit}>
      <label className="men-showcase__purchase-field">
        Colour
        <select value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)}>
          {product.colors.map((color) => (
            <option value={color.name} key={color.name}>{color.name}</option>
          ))}
        </select>
      </label>

      <fieldset className="men-showcase__purchase-sizes">
        <legend>Size</legend>
        <div>
          {product.sizes.map((size) => (
            <button
              type="button"
              key={size}
              className={selectedSize === size ? 'is-selected' : ''}
              onClick={() => {
                setSelectedSize(size)
                setNotice('')
              }}
              aria-pressed={selectedSize === size}
            >
              {size}
            </button>
          ))}
        </div>
      </fieldset>

      <button className="men-showcase__buy-link" type="submit" disabled={!selectedSize}>
        Add to bag · {formatPrice(product.price)}
      </button>
      <p className="men-showcase__purchase-feedback" role="status">{notice}</p>
    </form>
  )
}

function ProductDetailView({ item, onClose }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const images = useMemo(() => [
    { src: item.front, label: 'Front' },
    { src: item.side, label: 'Side' },
  ].filter((image, index, collection) =>
    collection.findIndex((candidate) => candidate.src === image.src) === index,
  ), [item])
  const activeImage = images[selectedImage] || images[0]
  const itemName = getShowcaseItemName(item)
  const suggestedProductId = suggestedProductIds[item.number]
  const [selectedProductId, setSelectedProductId] = useState(suggestedProductId || '')
  const selectedProduct = catalogProducts.find((product) => product.id === selectedProductId)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') setSelectedImage((index) => (index + 1) % images.length)
      if (event.key === 'ArrowLeft') setSelectedImage((index) => (index - 1 + images.length) % images.length)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [images.length, onClose])

  return (
    <div className="men-showcase__detail-backdrop" role="presentation" onClick={onClose}>
      <section
        className="men-showcase__detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="men-showcase-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="men-showcase__detail-close" onClick={onClose} aria-label="Close piece details">×</button>
        <div className="men-showcase__detail-image">
          <button
            type="button"
            className="men-showcase__gallery-arrow"
            onClick={() => setSelectedImage((index) => (index - 1 + images.length) % images.length)}
            aria-label="Previous image"
          >
            ‹
          </button>
          <img src={activeImage.src} alt={`${itemName}, ${activeImage.label.toLowerCase()} view`} />
          <button
            type="button"
            className="men-showcase__gallery-arrow"
            onClick={() => setSelectedImage((index) => (index + 1) % images.length)}
            aria-label="Next image"
          >
            ›
          </button>
          <div className="men-showcase__gallery-dots" aria-label="Choose image">
            {images.map((image, index) => (
              <button
                type="button"
                key={image.label}
                className={index === selectedImage ? 'is-selected' : ''}
                onClick={() => setSelectedImage(index)}
                aria-label={`Show ${image.label.toLowerCase()} view`}
                aria-pressed={index === selectedImage}
              />
            ))}
          </div>
          <span className="men-showcase__gallery-caption">VASTRAA · MEN</span>
        </div>
        <div className="men-showcase__detail-copy">
          <p className="eyebrow">Men's collection · Showcase</p>
          <h2 id="men-showcase-detail-title">{itemName}</h2>
          <p>Front and side views from the VASTRAA men's image collection.</p>
          <div className="men-showcase__view-options" aria-label="Product views">
            {images.map((image, index) => (
              <button
                type="button"
                key={image.label}
                className={index === selectedImage ? 'is-selected' : ''}
                onClick={() => setSelectedImage(index)}
                aria-pressed={index === selectedImage}
              >
                {image.label}
              </button>
            ))}
          </div>
          <div className="men-showcase__buy-option">
            <p className="eyebrow">Similar catalogue piece</p>
            <label className="men-showcase__purchase-field">
              Choose item
              <select value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)}>
                <option value="">Choose a catalogue item</option>
                {catalogProducts.map((product) => (
                  <option value={product.id} key={product.id}>
                    {product.name} · {formatPrice(product.price)}
                  </option>
                ))}
              </select>
            </label>
            {selectedProduct && (
              <AddToBagOptions key={selectedProduct.id} product={selectedProduct} />
            )}
            <p className="men-showcase__showcase-note">
              {selectedProduct
                ? 'The selected catalogue item is added to your bag; it may differ from this showcase image.'
                : 'No exact catalogue match is linked. Choose an available item above to add it to your bag.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function MenShowcaseCarousel() {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const dragRef = useRef(null)
  const scrollFrameRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(() => Math.floor(showcaseItems.length / 2))
  const [flippedItems, setFlippedItems] = useState({})
  const [selectedItem, setSelectedItem] = useState(null)

  const setRailPositions = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const width = track.scrollWidth
    track.querySelectorAll('.men-showcase__product').forEach((product) => {
      const center = product.offsetLeft + product.offsetWidth / 2
      const position = Math.min(1, Math.max(0, center / width))
      const railY = 22 + 128 * position * (1 - position)
      product.style.setProperty('--rail-y', `${railY}px`)
    })
  }, [])

  const centerProduct = useCallback((index, behavior = 'smooth') => {
    const viewport = viewportRef.current
    const product = trackRef.current?.querySelector(`[data-index="${index}"]`)
    if (!viewport || !product) return

    viewport.scrollTo({
      left: product.offsetLeft + product.offsetWidth / 2 - viewport.clientWidth / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : behavior,
    })
  }, [])

  useEffect(() => {
    setRailPositions()
    centerProduct(Math.floor(showcaseItems.length / 2), 'auto')

    const track = trackRef.current
    if (!track || !window.ResizeObserver) return undefined

    const observer = new ResizeObserver(setRailPositions)
    observer.observe(track)
    if (viewportRef.current) observer.observe(viewportRef.current)
    return () => observer.disconnect()
  }, [centerProduct, setRailPositions])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    const onWheel = (event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && viewport.scrollWidth > viewport.clientWidth) {
        event.preventDefault()
        viewport.scrollLeft += event.deltaY
      }
    }
    viewport.addEventListener('wheel', onWheel, { passive: false })
    return () => viewport.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const images = showcaseItems.flatMap((item) => [item.side, item.front])
    images.forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    if (!selectedItem) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedItem])

  if (!showcaseItems.length) return null

  const updateActiveFromScroll = () => {
    if (scrollFrameRef.current) return
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = 0
      const viewport = viewportRef.current
      const productsInTrack = trackRef.current?.querySelectorAll('.men-showcase__product')
      if (!viewport || !productsInTrack?.length) return

      const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2
      let nearestIndex = 0
      let nearestDistance = Infinity
      productsInTrack.forEach((product) => {
        const bounds = product.getBoundingClientRect()
        const distance = Math.abs(bounds.left + bounds.width / 2 - viewportCenter)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = Number(product.dataset.index)
        }
      })
      setActiveIndex((current) => current === nearestIndex ? current : nearestIndex)
    })
  }

  const handlePointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: event.currentTarget.scrollLeft,
      moved: false,
    }
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const distance = event.clientX - drag.startX
    if (Math.abs(distance) > 4) {
      if (!drag.moved) event.currentTarget.setPointerCapture(event.pointerId)
      drag.moved = true
      event.currentTarget.classList.add('is-dragging')
    }
    if (drag.moved) {
      event.preventDefault()
      event.currentTarget.scrollLeft = drag.startScroll - distance
    }
  }

  const handlePointerUp = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (dragRef.current.moved) {
      event.currentTarget.dataset.dragged = 'true'
      window.setTimeout(() => {
        if (viewportRef.current) delete viewportRef.current.dataset.dragged
      }, 0)
    }
    dragRef.current = null
    event.currentTarget.classList.remove('is-dragging')
  }

  const activateProduct = (index) => {
    setActiveIndex(index)
    centerProduct(index)
  }

  const flipProduct = (number) => {
    setFlippedItems((current) => ({ ...current, [number]: !current[number] }))
  }

  const openProduct = (item) => {
    if (viewportRef.current?.dataset.dragged) return
    setSelectedItem(item)
  }

  const moveBy = (direction) => {
    const viewport = viewportRef.current
    const product = trackRef.current?.querySelector('.men-showcase__product')
    if (!viewport || !product) return
    viewport.scrollBy({
      left: product.offsetWidth * direction,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  const activeItem = showcaseItems[activeIndex]
  const activeLabel = getShowcaseItemName(activeItem)

  return (
    <section className="men-showcase" aria-label="Men's hanging clothing showcase">
      <p className="men-showcase__kicker">ON THE RAIL&nbsp; / &nbsp;MEN'S COLLECTION</p>
      <div
        className="men-showcase__viewport"
        ref={viewportRef}
        onScroll={updateActiveFromScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            moveBy(-1)
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            moveBy(1)
          }
        }}
        onClickCapture={(event) => {
          if (event.currentTarget.dataset.dragged) event.stopPropagation()
        }}
        tabIndex="0"
        aria-label="Scroll through hanging garments. Use the arrow buttons or horizontal scrolling."
      >
        <div className="men-showcase__track" ref={trackRef}>
          <HangingRail />
          {showcaseItems.map((item, index) => (
            <HangingProduct
              key={item.number}
              item={item}
              index={index}
              active={index === activeIndex}
              flipped={Boolean(flippedItems[item.number])}
              onActivate={activateProduct}
              onOpen={openProduct}
              onFlip={flipProduct}
            />
          ))}
        </div>
      </div>

      <div className="men-showcase__controls">
        <button type="button" className="men-showcase__nav-btn" onClick={() => moveBy(-1)} aria-label="Scroll to previous garment">‹</button>
        <button type="button" className="men-showcase__nav-btn" onClick={() => moveBy(1)} aria-label="Scroll to next garment">›</button>
      </div>

      <div className="men-showcase__info" aria-live="polite">
        <p className="eyebrow">MEN'S COLLECTION</p>
        <h2>{activeLabel}</h2>
        <p className="men-showcase__info-note">Front &amp; side views · hanging garment</p>
        <button type="button" className="men-showcase__explore" onClick={() => openProduct(activeItem)}>
          View garment
        </button>
      </div>

      {selectedItem && <ProductDetailView item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </section>
  )
}

export default MenShowcaseCarousel
