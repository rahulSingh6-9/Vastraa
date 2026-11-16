import { menAssetProducts } from '../data/menAssets.js'
import { Link } from 'react-router-dom'

function MenAssetGallery({ columns = 4 }) {
  return (
    <section className="asset-collection" aria-labelledby="men-asset-collection-title">
      <div className="shop-page__heading" data-reveal>
        <div>
          <p className="eyebrow">The wider edit</p>
          <h2 id="men-asset-collection-title">More from the men’s collection</h2>
        </div>
        <span className="shop-page__count">{menAssetProducts.length} pieces</span>
      </div>
      <p className="asset-collection__note">
        Additional pieces from the image collection. Product details and pricing are not available for these yet.
      </p>
      <div className={`product-grid product-grid--${columns} asset-collection-grid`} aria-label="More men's collection images" data-reveal-stagger>
        {menAssetProducts.map((item) => (
          <article className="product-card asset-collection-card" key={item.id} data-reveal-item>
            <Link
              className="asset-card__link"
              to={`/men/collection/${item.id}`}
              aria-label={`View ${item.name}`}
            >
              <div className="product-card__image product-card__image--asset">
                <img src={item.images[0]} alt={`${item.name} — view 1`} loading="lazy" />
                <span className="product-card__quickview">View piece <span aria-hidden="true">↗</span></span>
              </div>
              {item.images.length > 1 && (
                <div className="asset-card__thumbnails" aria-label={`Other views of ${item.name}`}>
                  {item.images.slice(1).map((image, index) => (
                    <img
                      src={image}
                      alt={`${item.name} — view ${index + 2}`}
                      loading="lazy"
                      key={image}
                    />
                  ))}
                </div>
              )}
              <div className="product-card__details asset-card__details">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MenAssetGallery
