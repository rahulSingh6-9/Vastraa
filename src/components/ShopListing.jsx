import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductGrid } from './ProductCard.jsx'
import MenAssetGallery from './MenAssetGallery.jsx'
import WomenAssetGallery from './WomenAssetGallery.jsx'
import { getWomenAsset } from '../data/womenAssets.js'
import { products } from '../data/products.js'
import MenShowcaseCarousel from './MenShowcaseCarousel.jsx'
import NewArrivalsLookbook from '../sections/NewArrivalsLookbook.jsx'

const menPageProductSlugs = [
  'the-longline-layer',
  'the-everyday-tee',
  'the-sunday-shirt',
  'pleat-front-skirt',
  'everyday-straight-trouser',
]
const womenPageProductSlugs = [
  'soft-tailored-blazer',
  'sunday-state-of-mind-knit',
  'after-hours-dress',
]

const pageDetails = {
  shop: {
    eyebrow: 'The VASTRAA wardrobe',
    title: 'The full edit.',
    description: 'Thoughtful pieces for every day, every plan, and every version of you.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85',
  },
  arrivals: {
    eyebrow: 'Just landed',
    title: 'New arrivals.',
    description: 'Fresh silhouettes, familiar favourites, and details worth a closer look.',
  },
  women: {
    eyebrow: 'VASTRAA for her',
    title: 'For all the ways you are.',
    description: 'Expressive pieces and easy layers, made to feel like your own.',
    image: getWomenAsset('woman-8228723_1280.jpg'),
  },
  men: {
    eyebrow: 'VASTRAA for him',
    title: 'Everyday, with intention.',
    description: 'Considered essentials and relaxed layers for days that do not stand still.',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1800&q=85',
    gender: 'men',
  },
  sale: {
    eyebrow: 'The VASTRAA sale',
    title: 'Good finds, for a little less.',
    description: 'A considered selection of pieces to keep close and wear on repeat.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1800&q=85',
    sale: true,
  },
}

function ShopListing({ page = 'shop' }) {
  const details = pageDetails[page]
  const sourceProducts = useMemo(() => {
    if (page === 'men') {
      return menPageProductSlugs.map((slug) => {
        const product = products.find((item) => item.slug === slug)
        if (!product) throw new Error(`Missing Men’s collection product: ${slug}`)
        return product
      })
    }
    if (page === 'women') {
      return womenPageProductSlugs.map((slug) => {
        const product = products.find((item) => item.slug === slug)
        if (!product) throw new Error(`Missing Women’s collection product: ${slug}`)
        return product
      })
    }
    if (details.gender) return products.filter((product) => product.gender === details.gender)
    if (details.sale) return products.filter((product) => product.sale)
    if (page === 'arrivals') return products.filter((product) => product.newArrival)
    return products
  }, [details.gender, details.sale, page])

  const [category, setCategory] = useState('')
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [maxPrice, setMaxPrice] = useState(7000)
  const [sort, setSort] = useState('featured')
  const [columns, setColumns] = useState(4)

  const categories = [...new Set(sourceProducts.map((product) => product.category))]
  const sizes = [...new Set(sourceProducts.flatMap((product) => product.sizes))]
  const colors = [...new Set(sourceProducts.flatMap((product) => product.colors.map((item) => item.name)))]

  const visibleProducts = useMemo(() => {
    const filtered = sourceProducts.filter((product) =>
      (!category || product.category === category)
      && (!size || product.sizes.includes(size))
      && (!color || product.colors.some((item) => item.name === color))
      && product.price <= maxPrice,
    )

    return filtered.sort((first, second) => {
      if (sort === 'price-low') return first.price - second.price
      if (sort === 'price-high') return second.price - first.price
      if (sort === 'rating') return second.rating - first.rating
      if (sort === 'newest') return Number(second.newArrival) - Number(first.newArrival)
      return Number(second.featured) - Number(first.featured)
    })
  }, [sourceProducts, category, size, color, maxPrice, sort])

  const clearFilters = () => {
    setCategory('')
    setSize('')
    setColor('')
    setMaxPrice(7000)
    setSort('featured')
  }

  return (
    <div className="shop-page">
      {page === 'arrivals' && <NewArrivalsLookbook />}
      {page !== 'arrivals' && page !== 'men' && (
        <section className="shop-page__hero">
          {details.image && <img src={details.image} alt="" fetchPriority="high" data-reveal-image />}
          <div data-reveal>
            <p className="eyebrow">{details.eyebrow}</p>
            <h1>{details.title}</h1>
            <p>{details.description}</p>
          </div>
        </section>
      )}

      {page === 'men' && <MenShowcaseCarousel />}

      <section className="shop-page__body section-pad">
        <div className="shop-page__heading" data-reveal>
          <div>
            <p className="eyebrow">Considered for your everyday</p>
            <h2>{details.title.replace(/\.$/, '')}</h2>
          </div>
          <span className="shop-page__count">{visibleProducts.length} pieces</span>
        </div>

        <div className="shop-controls" aria-label="Product filters">
          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Size
            <select value={size} onChange={(event) => setSize(event.target.value)}>
              <option value="">All sizes</option>
              {sizes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Colour
            <select value={color} onChange={(event) => setColor(event.target.value)}>
              <option value="">All colours</option>
              {colors.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="shop-controls__price">
            Up to ₹{maxPrice.toLocaleString('en-IN')}
            <input
              type="range"
              min="1000"
              max="7000"
              step="500"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              aria-label="Maximum price"
            />
          </label>
          <label className="shop-controls__sort">
            Sort
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
          <div className="shop-controls__grid" aria-label="Grid layout">
            <button type="button" onClick={() => setColumns(3)} aria-pressed={columns === 3} aria-label="Three column grid">3</button>
            <button type="button" onClick={() => setColumns(4)} aria-pressed={columns === 4} aria-label="Four column grid">4</button>
          </div>
          <button className="shop-controls__clear" type="button" onClick={clearFilters}>Clear all</button>
        </div>

        {visibleProducts.length ? (
          <ProductGrid
            items={visibleProducts}
            label="Shop products"
            columns={columns}
            useCardImages={page === 'men' || page === 'women'}
          />
        ) : (
          <div className="shop-empty">
            <h3>No pieces found just yet.</h3>
            <p>Try adjusting your filters to find your VASTRAA favourite.</p>
            <button className="text-link" type="button" onClick={clearFilters}>Clear filters ↗</button>
          </div>
        )}

        {page === 'men' && <MenAssetGallery columns={columns} />}
        {page === 'women' && <WomenAssetGallery columns={columns} />}

        <p className="shop-page__demo-note">
          Shopping is a frontend demonstration. <Link to="/about">Learn about VASTRAA</Link>
        </p>
      </section>
    </div>
  )
}

export default ShopListing
