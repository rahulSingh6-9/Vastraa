import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products } from '../data/products.js'
import { ProductGrid } from '../components/ProductCard.jsx'

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''
  const results = useMemo(() => {
    const term = query.toLowerCase()
    if (!term) return []

    return products.filter((product) =>
      [product.name, product.category, product.gender, product.description]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [query])

  return (
    <section className="search-page section-pad">
      <p className="eyebrow">Find something you love</p>
      <h1 data-reveal>{query ? `Results for “${query}”` : 'Search VASTRAA'}</h1>
      {!query ? (
        <div className="search-page__empty">
          <p>Try a style, category, or colour to begin.</p>
          <div className="search-suggestions">
            {['shirts', 'dresses', 'outerwear', 'knitwear'].map((term) => (
              <Link to={`/search?q=${term}`} key={term}>{term}</Link>
            ))}
          </div>
        </div>
      ) : results.length ? (
        <>
          <p className="search-page__count">{results.length} pieces found</p>
          <ProductGrid items={results} label={`Search results for ${query}`} />
        </>
      ) : (
        <div className="shop-empty">
          <h2>Nothing found this time.</h2>
          <p>Try a different search, or explore the full edit.</p>
          <Link className="button button--dark" to="/shop">Explore the shop</Link>
        </div>
      )}
    </section>
  )
}

export default SearchPage
