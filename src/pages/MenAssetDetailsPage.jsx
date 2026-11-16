import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMenAssetProductById } from '../data/menAssets.js'

function MenAssetDetailsPage() {
  const { slug } = useParams()
  return <MenAssetDetailsContent key={slug} slug={slug} />
}

function MenAssetDetailsContent({ slug }) {
  const item = getMenAssetProductById(slug)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!item) {
    return (
      <section className="not-found-page">
        <p className="eyebrow">Piece not found</p>
        <h1>This one has moved on.</h1>
        <Link className="button button--dark" to="/men">Back to the men’s collection</Link>
      </section>
    )
  }

  return (
    <div className="product-detail-page men-asset-detail-page">
      <Link className="asset-detail__back" to="/men">← Back to the men’s collection</Link>
      <div className="product-detail">
        <div className="product-detail__gallery">
          <div className="product-detail__main-image product-detail__main-image--contain" data-reveal-image>
            <img src={item.images[selectedImage]} alt={`${item.name} — view ${selectedImage + 1}`} fetchPriority="high" />
          </div>
          {item.images.length > 1 && (
            <div className="product-detail__thumbnails product-detail__thumbnails--contain" aria-label="Piece images">
              {item.images.map((image, index) => (
                <button
                  type="button"
                  className={selectedImage === index ? 'is-selected' : ''}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View image ${index + 1} of ${item.name}`}
                  aria-pressed={selectedImage === index}
                  key={image}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail__info asset-detail__info">
          <p className="eyebrow">Men’s collection · {item.category}</p>
          <h1 data-reveal>{item.name}</h1>
          <p className="asset-detail__note">
            This piece is part of the VASTRAA image collection. Product details, pricing, and purchase options are not available yet.
          </p>
          <Link className="button button--light" to="/men">Continue exploring</Link>
        </div>
      </div>
    </div>
  )
}

export default MenAssetDetailsPage
