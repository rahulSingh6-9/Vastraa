import { Link, useParams } from 'react-router-dom'
import { ProductGrid } from '../components/ProductCard.jsx'
import { products } from '../data/products.js'
import { NotFoundPage } from './InformationPage.jsx'

const collectionDetails = {
  'soft-edit': {
    eyebrow: 'An easy kind of everyday',
    title: 'The soft edit',
    description: 'Quiet colours, relaxed layers, and soft textures to make everyday dressing feel effortless.',
    categories: ['Shirts', 'Knitwear', 'Tops'],
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
  },
  statement: {
    eyebrow: 'Make an entrance',
    title: 'The statement',
    description: 'Pieces with a little more presence, for wherever the night takes you.',
    categories: ['Dresses', 'Skirts'],
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=85',
  },
  'the-in-between': {
    eyebrow: 'Made for the moments between',
    title: 'The in-between',
    description: 'Versatile pieces that move with you from one part of the day to the next.',
    categories: ['Outerwear', 'Trousers', 'Tops'],
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85',
  },
}

function CollectionPage() {
  const { slug } = useParams()
  const collection = collectionDetails[slug]

  if (!collection) return <NotFoundPage />

  const items = products.filter((product) =>
    collection.categories.includes(product.category),
  )

  return (
    <div className="collection-detail-page">
      <section className="collection-page__hero">
        <div className="collection-page__image" data-reveal-image>
          <img src={collection.image} alt="" />
        </div>
        <div className="collection-page__copy" data-reveal>
          <p className="eyebrow">{collection.eyebrow}</p>
          <p className="collection-page__breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/collections">Collections</Link></p>
          <h1>{collection.title}</h1>
          <p className="collection-page__description">{collection.description}</p>
          <Link className="button button--dark" to="/shop">Explore all pieces <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className="section-pad">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">Curated for you</p><h2>{collection.title}</h2></div>
          <span className="shop-page__count">{items.length} pieces</span>
        </div>
        <ProductGrid items={items} label={`${collection.title} pieces`} />
      </section>
    </div>
  )
}

export default CollectionPage
