import { Link } from 'react-router-dom'
import { ProductGrid } from '../components/ProductCard.jsx'
import { products } from '../data/products.js'
import { useStore } from '../context/useStore.js'

function WishlistPage() {
  const { wishlist } = useStore()
  const items = products.filter((product) => wishlist.includes(product.id))

  return (
    <section className="wishlist-page section-pad">
      <p className="eyebrow">Saved for later</p>
      <h1 data-reveal>Your wishlist.</h1>
      {items.length ? (
        <div className="wishlist-page__grid"><ProductGrid items={items} label="Wishlist items" /></div>
      ) : (
        <div className="shop-empty">
          <h2>Keep the pieces you love close.</h2>
          <p>Tap the heart on a piece to save it here.</p>
          <Link className="button button--dark" to="/shop">Explore the shop</Link>
        </div>
      )}
    </section>
  )
}

export default WishlistPage
