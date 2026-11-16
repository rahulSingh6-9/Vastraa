import { Link } from 'react-router-dom'

const collectionCards = [
  {
    title: 'The soft edit',
    description: 'Easy layers, softer mornings.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85',
    alt: 'Neutral wardrobe staples',
    path: '/collections/soft-edit',
  },
  {
    title: 'The statement',
    description: 'For wherever the night goes.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
    alt: 'Contemporary fashion look',
    path: '/collections/statement',
  },
  {
    title: 'The in-between',
    description: 'Everyday pieces, elevated.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85',
    alt: 'Friends exploring personal style',
    path: '/collections/the-in-between',
  },
]

function CollectionsPage() {
  return (
    <div className="collections-index">
      <section className="collections-index__intro" data-reveal>
        <p className="eyebrow">Find your feeling</p>
        <h1>Wear what moves you.</h1>
        <p>Thoughtful edits for the different rhythms of your everyday.</p>
      </section>
      <div className="collections-index__grid" data-reveal-stagger>
        {collectionCards.map((collection, index) => (
          <Link className="collections-index__card" to={collection.path} key={collection.title} data-reveal-item>
            <img src={collection.image} alt={collection.alt} loading="lazy" />
            <span className="collections-index__number">0{index + 1}</span>
            <span className="collections-index__caption">
              <span><strong>{collection.title}</strong><small>{collection.description}</small></span>
              <span aria-hidden="true">↗</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CollectionsPage
