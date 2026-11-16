import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../context/useStore.js'

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Women', to: '/women', dropdown: true },
  { label: 'Men', to: '/men', dropdown: true },
  { label: 'Collections', to: '/collections' },
  { label: 'Sale', to: '/sale' },
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="m15.5 15.5 4 4" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 8h13l1 12h-15l1-12Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { cartCount, wishlist } = useStore()

  const closeMenu = () => setMenuOpen(false)
  const handleSearch = (event) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
      setSearchOpen(false)
    }
  }

  return (
    <>
    <header className="site-header">
      <div className="header-main">
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <Link className="wordmark" to="/#top" aria-label="Vastraa home">
          VASTRAA
          <span>MADE TO BE WORN</span>
        </Link>

        <form className={`search-box${searchOpen ? ' is-mobile-open' : ''}`} role="search" onSubmit={handleSearch}>
          <input
            type="search"
            aria-label="Search VASTRAA"
            placeholder="Search the collection"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button type="submit" aria-label="Search">
            <SearchIcon />
          </button>
        </form>

        <div className="header-actions">
          <button
            className="header-action mobile-search-toggle"
            type="button"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            onClick={() => { setSearchOpen((open) => !open); setMenuOpen(false) }}
          >
            <SearchIcon />
          </button>
          <Link className="header-action header-account" to="/account" aria-label="Your account">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="3.3" />
              <path d="M5.5 20v-1.6a6.5 6.5 0 0 1 13 0V20" />
            </svg>
          </Link>
          <Link className="header-action header-wishlist" to="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.2 8.7c0 4.1-8.2 10.1-8.2 10.1S3.8 12.8 3.8 8.7a4.2 4.2 0 0 1 8.2-1.3 4.2 4.2 0 0 1 8.2 1.3Z" />
            </svg>
          </Link>
          <Link className="header-action header-bag" to="/cart" aria-label={`Shopping bag, ${cartCount} items`}>
            <BagIcon />
            {cartCount > 0 && <span className="header-action__count">{cartCount}</span>}
          </Link>
        </div>
      </div>

    </header>

    <nav
      className={`primary-navigation${menuOpen ? ' is-open' : ''}`}
      id="primary-navigation"
      aria-label="Main navigation"
      onMouseLeave={() => setOpenMenu('')}
    >
      {navigation.map((item) => (
        <div
          className={`primary-navigation__item${item.dropdown ? ' has-mega-menu' : ''}`}
          key={item.label}
          onMouseEnter={() => setOpenMenu(item.dropdown ? item.label : '')}
        >
          <NavLink
            to={item.to}
            className={({ isActive }) => (isActive ? 'is-current' : '')}
            onClick={closeMenu}
            end
          >
            {item.label}
          </NavLink>
          {item.dropdown && (
            <div className={`mega-menu${openMenu === item.label ? ' is-open' : ''}`}>
              <p className="eyebrow">{item.label} · The VASTRAA edit</p>
              <Link to={item.to} onClick={closeMenu}>Shop all {item.label.toLowerCase()} <span aria-hidden="true">↗</span></Link>
              <Link to="/new-arrivals" onClick={closeMenu}>New arrivals <span aria-hidden="true">↗</span></Link>
              <Link to="/collections" onClick={closeMenu}>Explore collections <span aria-hidden="true">↗</span></Link>
            </div>
          )}
        </div>
      ))}
    </nav>
    </>
  )
}

export default SiteHeader
