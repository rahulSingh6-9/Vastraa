import { useLayoutEffect, useRef } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import HeroSection from './sections/HeroSection.jsx'
import CategorySection from './sections/CategorySection.jsx'
import FeaturedSection from './sections/FeaturedSection.jsx'
import CampaignFilmSection from './sections/CampaignFilmSection.jsx'
import NewDropSection from './sections/NewDropSection.jsx'
import EditorialStatsSection from './sections/EditorialStatsSection.jsx'
import FashionGallerySection from './sections/FashionGallerySection.jsx'
import EditorialSection from './sections/EditorialSection.jsx'
import CollectionPage from './pages/CollectionPage.jsx'
import ShopListing from './components/ShopListing.jsx'
import CollectionsPage from './pages/CollectionsPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import MenAssetDetailsPage from './pages/MenAssetDetailsPage.jsx'
import WomenAssetDetailsPage from './pages/WomenAssetDetailsPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrderResultPage from './pages/OrderResultPage.jsx'
import WishlistPage from './pages/WishlistPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import AccountPage, { TrackOrderPage } from './pages/AccountPage.jsx'
import InformationPage, { NotFoundPage } from './pages/InformationPage.jsx'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function HomePage() {
  return (
    <div className="homepage-content">
      <HeroSection />
      <CategorySection />
      <FeaturedSection />
      <CampaignFilmSection />
      <NewDropSection />
      <EditorialStatsSection />
      <FashionGallerySection />
      
    </div>
  )
}

function useRouteReveals(pageRef, pathname) {
  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page) return undefined

    const motionMedia = gsap.matchMedia()
    motionMedia.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        if (pathname === '/') {
          const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } })
          entrance.fromTo(
            '.hero__eyebrow, .hero__title span, .hero__copy, .hero__actions',
            { y: 22, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.11 },
          )
        }

        gsap.utils.toArray('[data-reveal]', page).forEach((element) => {
          gsap.fromTo(
            element,
            { y: 28, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                once: true,
              },
            },
          )
        })

        gsap.utils.toArray('[data-reveal-stagger]', page).forEach((group) => {
          const items = group.querySelectorAll(':scope > [data-reveal-item]')
          if (!items.length) return

          gsap.fromTo(
            items,
            { y: 26, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.75,
              stagger: 0.09,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: group,
                start: 'top 88%',
                once: true,
              },
            },
          )
        })

        gsap.utils.toArray('[data-reveal-image]', page).forEach((image) => {
          gsap.fromTo(
            image,
            { clipPath: 'inset(0% 0% 8% 0%)', autoAlpha: 0.94 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              autoAlpha: 1,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: image,
                start: 'top 88%',
                once: true,
              },
            },
          )
        })
      }, page)

      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => {
        window.cancelAnimationFrame(refreshFrame)
        context.revert()
      }
    })

    return () => motionMedia.revert()
  }, [pageRef, pathname])
}

function scrollImmediately(action) {
  const root = document.documentElement
  const previousBehavior = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  try {
    action()
  } finally {
    root.style.scrollBehavior = previousBehavior
  }
}

function scrollToFragment(hash) {
  if (!hash) return false

  const target = document.getElementById(decodeURIComponent(hash.slice(1)))
  if (!target) return false

  scrollImmediately(() => target.scrollIntoView())
  return true
}

function ScrollRestoration() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const positionsRef = useRef(new Map())
  const currentKeyRef = useRef(location.key)
  const previousLocationRef = useRef(location)
  const isInitialNavigationRef = useRef(true)

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  useLayoutEffect(() => {
    const savePosition = () => {
      positionsRef.current.set(currentKeyRef.current, window.scrollY)
    }

    window.addEventListener('scroll', savePosition, { passive: true })
    return () => window.removeEventListener('scroll', savePosition)
  }, [])

  useLayoutEffect(() => {
    const previousLocation = previousLocationRef.current

    if (isInitialNavigationRef.current) {
      isInitialNavigationRef.current = false
      positionsRef.current.set(location.key, window.scrollY)
    } else if (navigationType === 'POP') {
      const savedPosition = positionsRef.current.get(location.key)
      if (savedPosition !== undefined) {
        scrollImmediately(() => window.scrollTo(0, savedPosition))
      } else if (!scrollToFragment(location.hash)) {
        scrollImmediately(() => window.scrollTo(0, 0))
      }
    } else if (location.pathname !== previousLocation.pathname) {
      if (!scrollToFragment(location.hash)) {
        scrollImmediately(() => window.scrollTo(0, 0))
      }
    } else if (location.hash && location.hash !== previousLocation.hash) {
      scrollToFragment(location.hash)
    }

    currentKeyRef.current = location.key
    positionsRef.current.set(location.key, window.scrollY)
    previousLocationRef.current = location
  }, [location.hash, location.key, location.pathname, navigationType])

  return null
}

function App() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const isCheckout = pathname === '/checkout'
  const isAuthPage = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ].includes(pathname) || pathname.startsWith('/reset-password/')
  const isStandalonePage = isCheckout || isAuthPage

  useRouteReveals(mainRef, pathname)

  return (
    <div className="site-shell">
      {!isStandalonePage && <SiteHeader />}
      <ScrollRestoration />
      <main ref={mainRef}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopListing />} />
          <Route path="/new-arrivals" element={<ShopListing page="arrivals" />} />
          <Route path="/women" element={<ShopListing page="women" />} />
          <Route path="/men" element={<ShopListing page="men" />} />
          <Route path="/women/collection/:slug" element={<WomenAssetDetailsPage />} />
          <Route path="/men/collection/:slug" element={<MenAssetDetailsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionPage collection="collections" />} />
          <Route path="/sale" element={<ShopListing page="sale" />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product" element={<ProductDetailsPage />} />
          <Route path="/product/:slug" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderResultPage />} />
          <Route path="/order-success" element={<OrderResultPage />} />
          <Route path="/order-failed" element={<OrderResultPage failed />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
          <Route path="/reset-password" element={<AuthPage mode="reset" />} />
          <Route path="/reset-password/:token" element={<AuthPage mode="reset" />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/orders" element={<AccountPage />} />
          <Route path="/account/orders/:orderId" element={<AccountPage />} />
          <Route path="/account/addresses" element={<AccountPage />} />
          <Route path="/account/profile" element={<AccountPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/about" element={<InformationPage page="about" />} />
          <Route path="/contact" element={<InformationPage page="contact" />} />
          <Route path="/faq" element={<InformationPage page="faq" />} />
          <Route path="/shipping-policy" element={<InformationPage page="shipping-policy" />} />
          <Route path="/return-policy" element={<InformationPage page="return-policy" />} />
          <Route path="/exchange-policy" element={<InformationPage page="exchange-policy" />} />
          <Route path="/cancellation-policy" element={<InformationPage page="cancellation-policy" />} />
          <Route path="/privacy-policy" element={<InformationPage page="privacy-policy" />} />
          <Route path="/terms" element={<InformationPage page="terms" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isStandalonePage && <SiteFooter />}
    </div>
  )
}

export default App
