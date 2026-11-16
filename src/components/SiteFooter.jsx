import { Link } from 'react-router-dom'

function TruckIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M2.5 8h17v15h-17zM19.5 13h6l4 5v5h-10z" />
      <circle cx="8" cy="24" r="2.7" />
      <circle cx="24" cy="24" r="2.7" />
      <path d="M22 13v5h7" />
    </svg>
  )
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 13.5h22v15H5zM3 13.5l2.5-8h21l2.5 8" />
      <path d="M11 28.5V19h10v9.5M3 13.5a4 4 0 0 0 8 0 4 4 0 0 0 8 0 4 4 0 0 0 8 0" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="5.5" y="13" width="21" height="15" rx="1" />
      <path d="M10 13V9a6 6 0 0 1 12 0v4M16 19v3" />
    </svg>
  )
}

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'New arrivals', to: '/new-arrivals' },
      { label: 'Collections', to: '/collections' },
      { label: 'The VASTRAA story', to: '/about' },
    ],
  },
  {
    title: 'Need a hand?',
    links: [
      { label: 'Contact us', to: '/contact' },
      { label: 'Track an order', to: '/track-order' },
      { label: 'Shipping & returns', to: '/shipping-policy' },
      { label: 'FAQs', to: '/faq' },
    ],
  },
]

function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="service-strip" aria-label="Our service promises">
        <div className="service-item">
          <TruckIcon />
          <span>Free shipping above ₹1,999</span>
        </div>
        <div className="service-item">
          <LockIcon />
          <span>Easy &amp; secure checkout</span>
        </div>
        <div className="service-item">
          <StoreIcon />
          <span>Across India, always</span>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-columns">
          <div className="footer-intro">
            <Link className="footer-wordmark" to="/#top">VASTRAA</Link>
            <p>Thoughtful clothes for the life you live in.</p>
            <a className="footer-email" href="mailto:hello@vastraa.in">hello@vastraa.in</a>
          </div>

          {footerGroups.map((group) => (
            <div className="footer-group" key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to}>{link.label}</Link>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-group footer-journal" id="journal">
            <h2>Stay in the know</h2>
            <p>New things, considered notes, and a little inspiration.</p>
            <a className="footer-email" href="mailto:hello@vastraa.in?subject=VASTRAA%20notes">
              Sign up for our notes <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 VASTRAA. Made for the everyday.</span>
          <div>
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/#top">Back to top ↑</Link>
          </div>
        </div>
        <div className="footer-oversized" aria-hidden="true">VASTRAA</div>
      </div>
    </footer>
  )
}

export default SiteFooter
