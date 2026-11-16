import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import heroImage1 from '../assets/herosection/OIP.webp'
import heroImage2 from '../assets/herosection/91656dcc12691b484639ff0c00f87434.jpg'
import heroImage3 from '../assets/herosection/3.jpg'
import heroImage4 from '../assets/herosection/d675493af7022a34ea56e846982fdb49.jpg'
import heroImage5 from '../assets/herosection/il_680x540.6371505364_fn1s.webp'
import heroImage6 from '../assets/herosection/164517632639c9a9f50877e4cf48a02230272b654c_thumbnail_600x.jpg'
import heroImage7 from '../assets/herosection/il_1080xN.3266050716_4li1.webp'
import heroImage8 from '../assets/herosection/182ee3e859eb24a8a8fd0eef0364dda3.jpg'

const HeroTshirt3D = lazy(() => import('../components/HeroTshirt3D.jsx'))
const collageImages = [
  heroImage1,
  heroImage2,
  heroImage3,
  heroImage4,
  heroImage5,
  heroImage6,
  heroImage7,
  heroImage8,
]

function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <div className="hero__visual">
        <div className="hero__collage" aria-hidden="true">
          {collageImages.map((image, index) => (
            <img
              className={`hero__photo hero__photo--${index + 1}`}
              src={image}
              alt=""
              key={image}
              fetchPriority={index < 4 ? 'high' : 'auto'}
            />
          ))}
        </div>
        <div className="hero__shade" aria-hidden="true" />
        <Suspense
          fallback={
            <div className="hero__3d" aria-hidden="true">
              <div className="hero__tshirt-fallback" />
            </div>
          }
        >
          <HeroTshirt3D />
        </Suspense>
        <div className="hero__content">
          <p className="hero__eyebrow">VASTRAA campaign · 01</p>
          <h1 className="hero__title">
            <span>BREAK THE</span>
            <span>MOLD</span>
          </h1>
          <div className="hero__details">
            <p className="hero__copy">The fade-black essential. Made to move.</p>
            <div className="hero__actions">
              <Link className="button button--light" to="/new-arrivals">
                Shop the edit <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
        <p className="hero__index">01 <span>—</span> THE FADE-BLACK EDIT</p>
      </div>
      <div className="hero-note">
        <span>Designed to stand apart</span>
        <span>Considered in every detail</span>
        <span>Made to move with you</span>
      </div>
    </section>
  )
}

export default HeroSection
