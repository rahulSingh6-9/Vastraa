import { Link } from 'react-router-dom'
import { products } from '../data/products.js'
import { ProductGrid } from '../components/ProductCard.jsx'

function FeaturedSection() {
  const featuredProducts = products
    .filter((product) =>
      (product.featured && product.slug !== 'modern-overshirt')
      || product.slug === 'everyday-straight-trouser',
    )
    .slice(0, 8)

  return (
    <section className="featured-section section-pad" id="new-arrivals">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">Good things, just in</p>
          <h2>Pieces to keep close.</h2>
        </div>
        <Link className="text-link" to="/new-arrivals">
          Shop the new arrivals <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <ProductGrid items={featuredProducts} label="Featured pieces" useCardImages />
    </section>
  )
}

export default FeaturedSection
