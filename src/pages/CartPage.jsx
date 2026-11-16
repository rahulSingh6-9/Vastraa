import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/money.js'
import { getProductImages, products } from '../data/products.js'
import { useStore } from '../context/useStore.js'

function CartPage() {
  const { cart, coupon, applyCoupon, clearCoupon, removeFromCart, updateQuantity } = useStore()
  const [couponInput, setCouponInput] = useState('')
  const [couponMessage, setCouponMessage] = useState('')

  const cartItems = cart
    .map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) }))
    .filter((item) => item.product)
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discount = coupon ? Math.round(subtotal * 0.1) : 0
  const shipping = subtotal === 0 || subtotal >= 1999 ? 0 : 199
  const total = subtotal - discount + shipping

  const handleCoupon = (event) => {
    event.preventDefault()
    const result = applyCoupon(couponInput)
    setCouponMessage(result.message)
  }

  if (!cartItems.length) {
    return (
      <section className="empty-page section-pad">
        <p className="eyebrow">Your VASTRAA bag</p>
        <h1>A little room for something lovely.</h1>
        <p>Your bag is waiting for its first favourite.</p>
        <Link className="button button--dark" to="/shop">Explore the shop</Link>
      </section>
    )
  }

  return (
    <div className="cart-page section-pad">
      <div className="cart-page__heading">
        <div><p className="eyebrow">Your VASTRAA bag</p><h1>Good choices.</h1></div>
        <Link className="text-link" to="/shop">Continue shopping <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.key}>
              <Link to={`/product/${item.product.slug}`} className={`cart-item__image${item.product.gender === 'men' ? ' cart-item__image--contain' : ''}`}>
                <img src={getProductImages(item.product, item.color)[0]} alt={`${item.product.name} in ${item.color}`} />
              </Link>
              <div className="cart-item__content">
                <div className="cart-item__title">
                  <div>
                    <h2><Link to={`/product/${item.product.slug}`}>{item.product.name}</Link></h2>
                    <p>{item.color} · Size {item.size}</p>
                  </div>
                  <strong>{formatPrice(item.product.price * item.quantity)}</strong>
                </div>
                <div className="cart-item__actions">
                  <div className="quantity-control">
                    <button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(item.key, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button>
                  </div>
                  <button className="text-button" type="button" onClick={() => removeFromCart(item.key)}>Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="order-summary">
          <h2>Order summary</h2>
          <form className="coupon-form" onSubmit={handleCoupon}>
            <label htmlFor="coupon-code">Coupon code</label>
            <div>
              <input id="coupon-code" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Enter code" />
              <button type="submit">{coupon ? 'Apply again' : 'Apply'}</button>
            </div>
            {coupon && <button className="text-button" type="button" onClick={() => { clearCoupon(); setCouponMessage('Code removed.') }}>Remove VASTRAA10</button>}
            <p role="status">{couponMessage}</p>
          </form>
          <div className="order-summary__line"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="order-summary__line"><span>Shipping</span><span>{shipping ? formatPrice(shipping) : 'Complimentary'}</span></div>
          {discount > 0 && <div className="order-summary__line order-summary__discount"><span>VASTRAA10</span><span>−{formatPrice(discount)}</span></div>}
          <div className="order-summary__total"><strong>Total</strong><strong>{formatPrice(total)}</strong></div>
          <p className="order-summary__note">Taxes included. Shipping is complimentary over ₹1,999.</p>
          <Link className="button button--dark order-summary__checkout" to="/checkout" state={{ backTo: '/cart' }}>Continue to checkout <span aria-hidden="true">↗</span></Link>
          <p className="demo-disclaimer">Demo checkout only — no real payment will be taken.</p>
        </aside>
      </div>
    </div>
  )
}

export default CartPage
