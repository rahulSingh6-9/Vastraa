import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { getProductBySlug } from '../data/products.js'
import { formatPrice } from '../utils/money.js'

const lookbookAssets = import.meta.glob('../assets/NewArrivalsmodels/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

function formatGarmentName(filename) {
  const name = filename
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

  return name.toLowerCase() === 'caot' ? 'Coat' : name
}

function discoverLooks(assets) {
  const groupedLooks = new Map()

  Object.entries(assets).forEach(([path, image]) => {
    const filename = path.split('/').pop() || ''
    const match = filename.match(/^(\d+)([a-z][a-z0-9_-]*)\.(png|jpe?g|webp|avif)$/i)

    if (!match) return

    const [, prefix, assetName] = match
    const look = groupedLooks.get(prefix) || { id: prefix, model: null, garments: [] }

    if (assetName.toLowerCase() === 'model') {
      look.model = look.model || image
    } else {
      look.garments.push({
        id: filename,
        name: formatGarmentName(assetName),
        image,
      })
    }

    groupedLooks.set(prefix, look)
  })

  return [...groupedLooks.values()]
    .filter((look) => look.model)
    .sort((first, second) => Number(first.id) - Number(second.id))
    .map((look) => ({
      ...look,
      garments: look.garments.sort((first, second) => first.id.localeCompare(second.id)),
    }))
}

const looks = discoverLooks(lookbookAssets)
const similarProductSlugs = {
  dress: 'after-hours-dress',
  jacket: 'the-weekend-jacket',
  coat: 'the-longline-layer',
  pant: 'everyday-straight-trouser',
  pants: 'everyday-straight-trouser',
  shirt: 'modern-overshirt',
}

function formatLookNumber(index) {
  return String(index + 1).padStart(2, '0')
}

function getSimilarProduct(garmentName) {
  const slug = similarProductSlugs[garmentName.toLowerCase()]
  return slug ? getProductBySlug(slug) : null
}

function NewArrivalsLookbook() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth)
  const selectedIndexRef = useRef(selectedIndex)
  const viewportRef = useRef(null)
  const modelRefs = useRef([])
  const hasPositionedModelsRef = useRef(false)
  const gestureRef = useRef(null)
  const wheelDeltaRef = useRef(0)
  const wheelLockedRef = useRef(false)
  const wheelTimerRef = useRef(null)
  const draggedRef = useRef(false)
  const selectedLook = looks[selectedIndex]

  const positions = useMemo(() => looks.map((look, index) => {
    let offset = index - selectedIndex
    if (offset > looks.length / 2) offset -= looks.length
    if (offset < -looks.length / 2) offset += looks.length

    const distance = Math.abs(offset)
    const isMobileStage = viewportWidth <= 760
    const isCompactStage = viewportWidth <= 1100
    const slot = isMobileStage ? 0.2 : isCompactStage ? 0.22 : 0.215
    const size = distance === 0
      ? (isMobileStage ? 0.68 : isCompactStage ? 0.48 : 0.46)
      : distance === 1
        ? (isMobileStage ? 0.44 : isCompactStage ? 0.28 : 0.245)
        : distance === 2
          ? (isMobileStage ? 0.32 : isCompactStage ? 0.2 : 0.19)
          : isCompactStage ? 0.17 : 0.16
    const rotation = Math.max(-9, Math.min(9, -offset * 3))
    const maxVisibleDistance = Math.min(3, Math.floor(looks.length / 2))
    const isVisible = distance <= maxVisibleDistance

    return {
      id: look.id,
      index,
      left: `calc(50% + ${offset * slot * 100}%)`,
      width: `${size * 100}%`,
      zIndex: looks.length - distance,
      pointerEvents: isVisible ? 'auto' : 'none',
      y: -distance * (isMobileStage ? 8 : 14),
      z: -distance * (isMobileStage ? 24 : 60),
      rotation,
      scale: distance === 0 ? 1 : Math.max(0.58, 1 - distance * 0.16),
      opacity: isVisible ? Math.max(0.58, 1 - distance * 0.13) : 0,
      shadowOpacity: Math.max(0.24, 0.72 - distance * 0.16),
      shadowHeight: `${Math.max(9, 19 - distance * 3)}px`,
    }
  }), [selectedIndex, viewportWidth])

  useLayoutEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', updateViewportWidth)
    return () => window.removeEventListener('resize', updateViewportWidth)
  }, [])

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const shouldAnimate = hasPositionedModelsRef.current && !reduceMotion
    const tweens = []

    positions.forEach((position) => {
      const model = modelRefs.current[position.index]
      if (!model) return

      const visualState = {
        xPercent: -50,
        y: position.y,
        z: position.z,
        rotationY: position.rotation,
        scale: position.scale,
        opacity: position.opacity,
        transformOrigin: '50% 100%',
      }

      if (!shouldAnimate) {
        gsap.set(model, visualState)
      } else {
        tweens.push(gsap.to(model, {
          ...visualState,
          duration: 0.72,
          ease: 'power3.inOut',
          overwrite: 'auto',
        }))
      }
    })

    hasPositionedModelsRef.current = true
    return () => tweens.forEach((tween) => tween.kill())
  }, [positions])

  const selectLook = (index) => {
    selectedIndexRef.current = index
    setSelectedIndex(index)
  }

  const moveSelection = (direction) => {
    const nextIndex = (selectedIndexRef.current + direction + looks.length) % looks.length
    selectedIndexRef.current = nextIndex
    setSelectedIndex(nextIndex)
  }

  const handleWheel = (event) => {
    if (!event.shiftKey && Math.abs(event.deltaX) < Math.abs(event.deltaY)) return

    event.preventDefault()
    if (wheelLockedRef.current) return

    wheelDeltaRef.current += event.shiftKey ? event.deltaY : event.deltaX
    if (Math.abs(wheelDeltaRef.current) < 48) return

    moveSelection(wheelDeltaRef.current > 0 ? 1 : -1)
    wheelDeltaRef.current = 0
    wheelLockedRef.current = true
    window.clearTimeout(wheelTimerRef.current)
    wheelTimerRef.current = window.setTimeout(() => {
      wheelLockedRef.current = false
    }, 420)
  }

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      viewport.removeEventListener('wheel', handleWheel)
      window.clearTimeout(wheelTimerRef.current)
    }
  }, [])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      moveSelection(event.key === 'ArrowRight' ? 1 : -1)
    }
  }

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    draggedRef.current = false
    gestureRef.current = {
      startX: event.clientX,
      startY: event.clientY,
    }
  }

  const handlePointerMove = (event) => {
    if (!gestureRef.current) return
    const distanceX = Math.abs(event.clientX - gestureRef.current.startX)
    const distanceY = Math.abs(event.clientY - gestureRef.current.startY)
    if (distanceX > 8 && distanceX > distanceY) draggedRef.current = true
  }

  const handlePointerUp = (event) => {
    if (!gestureRef.current) return
    const distanceX = event.clientX - gestureRef.current.startX
    const distanceY = event.clientY - gestureRef.current.startY
    gestureRef.current = null

    if (Math.abs(distanceX) > 48 && Math.abs(distanceX) > Math.abs(distanceY)) {
      draggedRef.current = true
      moveSelection(distanceX < 0 ? 1 : -1)
    }
  }

  const handleClickCapture = (event) => {
    if (!draggedRef.current) return
    event.preventDefault()
    event.stopPropagation()
    draggedRef.current = false
  }

  if (!looks.length) return null

  return (
    <section className="lookbook" aria-labelledby="lookbook-title">
      <div className="lookbook__inner">
        <header className="lookbook__intro">
          <div>
            <p className="eyebrow">The new arrivals, in motion</p>
            <h1 id="lookbook-title">Try the look.</h1>
          </div>
          <p>Meet the pieces from every angle. Select a look to see what’s in it.</p>
        </header>

        <div className="lookbook__layout">
          <div className="lookbook__showroom">
            <div
              className="lookbook__viewport"
              ref={viewportRef}
              role="region"
              aria-label="New arrivals model lookbook"
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => { gestureRef.current = null }}
              onClickCapture={handleClickCapture}
            >
              <div className="lookbook__track">
                {looks.map((look, index) => {
                  const position = positions[index]
                  return (
                    <button
                      className={`lookbook__model${selectedIndex === index ? ' is-selected' : ''}`}
                      type="button"
                      key={look.id}
                      ref={(element) => { modelRefs.current[index] = element }}
                      onClick={() => selectLook(index)}
                      aria-label={`View look ${formatLookNumber(index)}`}
                      aria-pressed={selectedIndex === index}
                      style={{
                        left: position.left,
                        width: position.width,
                        zIndex: position.zIndex,
                        pointerEvents: position.pointerEvents,
                        '--look-shadow-opacity': position.shadowOpacity,
                        '--look-shadow-height': position.shadowHeight,
                      }}
                    >
                      <span className="lookbook__shadow" aria-hidden="true" />
                      <img
                        src={look.model}
                        alt={`Model wearing look ${formatLookNumber(index)}`}
                        loading={index < 4 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                        draggable="false"
                      />
                      <span className="lookbook__model-index">{formatLookNumber(index)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <nav className="lookbook__navigation" aria-label="Lookbook navigation">
              <button
                type="button"
                className="lookbook__arrow"
                onClick={() => moveSelection(-1)}
                aria-label="Previous look"
              >
                <span aria-hidden="true">←</span>
              </button>
              <div className="lookbook__progress">
                <span className="lookbook__position" aria-live="polite">
                  {formatLookNumber(selectedIndex)} <span aria-hidden="true">/</span> {String(looks.length).padStart(2, '0')}
                </span>
                <div
                  className="lookbook__progress-track"
                  role="progressbar"
                  aria-label="Lookbook position"
                  aria-valuemin="1"
                  aria-valuemax={looks.length}
                  aria-valuenow={selectedIndex + 1}
                  aria-valuetext={`Look ${selectedIndex + 1} of ${looks.length}`}
                >
                  <span style={{ width: `${((selectedIndex + 1) / looks.length) * 100}%` }} />
                </div>
              </div>
              <button
                type="button"
                className="lookbook__arrow"
                onClick={() => moveSelection(1)}
                aria-label="Next look"
              >
                <span aria-hidden="true">→</span>
              </button>
            </nav>
          </div>

          <aside className="lookbook__details" aria-labelledby="lookbook-details-title">
            <div className="lookbook__details-heading">
              <p className="eyebrow">Look {formatLookNumber(selectedIndex)}</p>
              <h2 id="lookbook-details-title">In this look</h2>
            </div>
            <div className="lookbook__garments" key={selectedLook.id}>
              {selectedLook.garments.length ? selectedLook.garments.map((garment, index) => {
                const similarProduct = getSimilarProduct(garment.name)

                return (
                  <article className="lookbook__garment" key={garment.id}>
                    <div className="lookbook__garment-image">
                      <img src={garment.image} alt={garment.name} loading={index === 0 ? 'eager' : 'lazy'} />
                    </div>
                    <div className="lookbook__garment-copy">
                      <span className="lookbook__garment-index">{String(index + 1).padStart(2, '0')}</span>
                      <h3>{garment.name}</h3>
                      {similarProduct && (
                        <div className="lookbook__similar">
                          <span className="lookbook__similar-name">Similar: {similarProduct.name}</span>
                          <span className="lookbook__similar-price">{formatPrice(similarProduct.price)}</span>
                          <Link
                            className="lookbook__buy-link"
                            to={`/product/${similarProduct.slug}`}
                            aria-label={`Shop similar to ${garment.name}: ${similarProduct.name}`}
                          >
                            Shop similar <span aria-hidden="true">↗</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </article>
                )
              }) : (
                <p className="lookbook__empty">No garment images are available for this look.</p>
              )}
            </div>
            <p className="lookbook__note">Pieces shown from the VASTRAA new arrivals edit.</p>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default NewArrivalsLookbook
