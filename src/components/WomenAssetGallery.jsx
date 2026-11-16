import { Link } from 'react-router-dom'
import { womenAssetProducts } from '../data/womenAssets.js'

function WomenAssetGallery({ columns = 4 }) {
  return (
    <section className="asset-collection" aria-labelledby="women-asset-collection-title">
      <div className="shop-page__heading" data-reveal>
        <div>
          <p className="eyebrow">The wider edit</p>
          <h2 id="women-asset-collection-title">More from the women’s collection</h2>
        </div>
        <span className="shop-page__count">{womenAssetProducts.length} pieces</span>
      </div>
      <p className="asset-collection__note">
        Additional pieces from the image collection. Product details and pricing are not available for these yet.
      </p>
      <div className={`product-grid product-grid--${columns} asset-collection-grid`} aria-label="More women's collection images" data-reveal-stagger>
        {womenAssetProducts.map((item) => (
          <article className="product-card asset-collection-card" key={item.id} data-reveal-item>
            <Link
              className="asset-card__link"
              to={`/women/collection/${item.id}`}
              aria-label={`View ${item.name}`}
            >
              <div className="product-card__image product-card__image--asset">
                <img src={item.images[0]} alt={item.name} loading="lazy" />
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

export default WomenAssetGallery
