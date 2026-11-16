import { Link } from 'react-router-dom'

const categories = [
  {
    name: 'The soft edit',
    detail: 'Easy layers, softer mornings',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1100&q=85',
    alt: 'Neutral wardrobe staples arranged together',
    className: 'category-card--soft',
    path: '/shop',
  },
  {
    name: 'The statement',
    detail: 'For wherever the night goes',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=85',
    alt: 'Model wearing a confident contemporary outfit',
    className: 'category-card--statement',
    path: '/women',
  },
  {
    name: 'The in-between',
    detail: 'Everyday pieces, elevated',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=85',
    alt: 'Friends browsing and styling clothing together',
    className: 'category-card--everyday',
    path: '/new-arrivals',
  },
]

function CategorySection() {
  return (
    <section className="category-section section-pad" id="collections">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">Find your feeling</p>
          <h2>Wear what moves you.</h2>
        </div>
        <Link className="text-link" to="/collections">
          Explore all collections <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="category-grid" data-reveal-stagger>
        {categories.map((category, index) => (
          <Link
            className={`category-card ${category.className}`}
            to={category.path}
            key={category.name}
            data-reveal-item
          >
            <img src={category.image} alt={category.alt} loading="lazy" />
            <span className="category-card__number">0{index + 1}</span>
            <span className="category-card__caption">
              <span>
                <strong>{category.name}</strong>
                <small>{category.detail}</small>
              </span>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategorySection
