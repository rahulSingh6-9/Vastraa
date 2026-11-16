import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { formatPrice } from '../utils/money.js'
import { getProductImages } from '../data/products.js'
import { products } from '../data/products.js'
import { useStore } from '../context/useStore.js'

function CheckoutPage() {
  const { cart, coupon, applyCoupon, clearCoupon, placeOrder } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [delivery, setDelivery] = useState({ city: '', postalCode: '' })
  const [couponInput, setCouponInput] = useState(coupon)
  const [couponMessage, setCouponMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('demo-card')
  const [formError, setFormError] = useState('')
  const [orderPending, setOrderPending] = useState(false)
  const backTo = location.state?.backTo || '/cart'

  const buyNowItem = location.state?.buyNow ? location.state.buyNowItem : null
  const items = (buyNowItem ? [buyNowItem] : cart)
    .map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) }))
    .filter((item) => item.product)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discount = coupon ? Math.round(subtotal * 0.1) : 0
  const shipping = subtotal >= 1999 ? 0 : 199
  const addressReady = Boolean(delivery.city.trim() && /^[0-9]{6}$/.test(delivery.postalCode))
  const shippingKnown = step === 3 && addressReady
  const total = subtotal - discount + (shippingKnown ? shipping : 0)

  if (!items.length && !orderPending) {
    return <Navigate to="/cart" replace />
  }

  const continueWithEmail = (event) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    setStep(2)
  }

  const continueWithPhone = (event) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    setStep(3)
  }

  const handleCoupon = (event) => {
    event.preventDefault()
    const result = applyCoupon(couponInput)
    setCouponMessage(result.message)
  }

  const submitOrder = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const apartment = data.get('apartment')
    setOrderPending(true)
    const order = placeOrder({
      name: `${data.get('firstName')} ${data.get('lastName')}`.trim(),
      email,
      phone: data.get('phone'),
      address: [data.get('address'), apartment].filter(Boolean).join(', '),
      city: data.get('city'),
      state: data.get('state'),
      postalCode: data.get('postalCode'),
      paymentMethod,
      total,
    }, items)

    if (!order) {
      setOrderPending(false)
      setFormError('We could not prepare this demo order. Please try again.')
      return
    }

    navigate(`/order-success/${order.id}`)
  }

  return (
    <div className="checkout-flow">
      <header className="checkout-brandbar">
        <div className="checkout-brandbar__inner">
          <button className="checkout-brandbar__back" type="button" onClick={() => navigate(backTo)}>
            <span aria-hidden="true">←</span> Back
          </button>
          <Link className="checkout-brandmark" to="/" aria-label="VASTRAA home">
            <span>VASTRAA</span>
            <small>MADE TO BE WORN</small>
          </Link>
        </div>
      </header>

      <div className="checkout-flow__layout">
        <section className="checkout-flow__content" aria-label="Checkout details">
          <div className={`checkout-flow__step${step === 3 ? ' checkout-flow__step--wide' : ''}`}>
            {step === 1 && (
              <>
                <h1 className="checkout-flow__title">Sign in</h1>
                <p className="checkout-flow__subtitle">Or create an account</p>
                <p className="checkout-flow__demo-note">Demo checkout only — no verification message or payment is sent.</p>
                <form className="checkout-flow__simple-form" onSubmit={continueWithEmail}>
                  <label className="visually-hidden" htmlFor="checkout-email">Email address</label>
                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  <button className="checkout-flow__primary" type="submit">Continue with VASTRAA</button>
                </form>
                <p className="checkout-flow__account-link">
                  New to VASTRAA? <Link to="/register">Create an account</Link>
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="checkout-flow__title">What’s your number?</h1>
                <p className="checkout-flow__subtitle">Used to secure your account</p>
                <p className="checkout-flow__demo-note">Demo only — no verification code will be sent.</p>
                <form className="checkout-flow__simple-form" onSubmit={continueWithPhone}>
                  <label className="visually-hidden" htmlFor="checkout-phone">Phone number</label>
                  <div className="checkout-flow__phone-field">
                    <span aria-hidden="true">IN&nbsp; +91</span>
                    <input
                      id="checkout-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      pattern={'[0-9+\\x28\\x29\\x20\\x2D]{8,18}'}
                      placeholder="Enter phone"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                    />
                  </div>
                  <button className="checkout-flow__primary" type="submit">Continue</button>
                </form>
                <button className="checkout-flow__text-button" type="button" onClick={() => setStep(1)}>
                  Use a different account
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="checkout-flow__customer">
                  <span>{email} · {phone}</span>
                  <button type="button" onClick={() => setStep(1)}>Change</button>
                </div>
                <form className="checkout-flow__form" onSubmit={submitOrder}>
                  <section className="checkout-flow__section">
                    <h1 className="checkout-flow__section-title">Delivery</h1>
                    <div className="checkout-flow__fields">
                      <label className="checkout-flow__field checkout-flow__field--wide">
                        Country/Region
                        <select name="country" defaultValue="India">
                          <option value="India">India</option>
                        </select>
                      </label>
                      <label className="checkout-flow__field">
                        First name
                        <input name="firstName" autoComplete="given-name" required />
                      </label>
                      <label className="checkout-flow__field">
                        Last name
                        <input name="lastName" autoComplete="family-name" required />
                      </label>
                      <label className="checkout-flow__field checkout-flow__field--wide">
                        Address
                        <input name="address" autoComplete="street-address" required />
                      </label>
                      <label className="checkout-flow__field checkout-flow__field--wide">
                        Apartment, suite, etc. <span>(optional)</span>
                        <input name="apartment" autoComplete="address-line2" />
                      </label>
                      <label className="checkout-flow__field">
                        City
                        <input
                          name="city"
                          autoComplete="address-level2"
                          value={delivery.city}
                          onChange={(event) => setDelivery((current) => ({ ...current, city: event.target.value }))}
                          required
                        />
                      </label>
                      <label className="checkout-flow__field">
                        State
                        <input name="state" autoComplete="address-level1" required />
                      </label>
                      <label className="checkout-flow__field">
                        PIN code
                        <input
                          name="postalCode"
                          autoComplete="postal-code"
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          value={delivery.postalCode}
                          onChange={(event) => setDelivery((current) => ({ ...current, postalCode: event.target.value }))}
                          required
                        />
                      </label>
                      <label className="checkout-flow__field checkout-flow__field--wide">
                        Phone
                        <input
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          pattern={'[0-9+\\x28\\x29\\x20\\x2D]{8,18}'}
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          required
                        />
                      </label>
                    </div>
                  </section>

                  <section className="checkout-flow__section">
                    <h2 className="checkout-flow__section-title">Shipping method</h2>
                    <div className="checkout-flow__shipping">
                      <span>{shipping === 0 ? 'Complimentary standard delivery' : 'Standard delivery'}</span>
                      <strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong>
                    </div>
                    <p className="checkout-flow__hint">
                      {addressReady ? 'Delivery details saved for this demo order.' : 'Enter your city and PIN code to view the delivery total.'}
                    </p>
                  </section>

                  <section className="checkout-flow__section">
                    <h2 className="checkout-flow__section-title">Payment</h2>
                    <p className="checkout-flow__hint">All transactions are simulated. No card details are requested or stored.</p>
                    <label className="checkout-flow__payment">
                      <input
                        type="radio"
                        name="payment"
                        value="demo-card"
                        checked={paymentMethod === 'demo-card'}
                        onChange={() => setPaymentMethod('demo-card')}
                      />
                      <span><strong>Credit or debit card</strong><small>Demo selection only · No payment will be taken</small></span>
                    </label>
                    <label className="checkout-flow__payment">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <span><strong>Cash on delivery</strong><small>Demo selection only</small></span>
                    </label>
                  </section>

                  <label className="checkout-flow__checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>Use shipping address as billing address</span>
                  </label>
                  <p className="checkout-flow__disclaimer">
                    This frontend demo does not process payments or send orders to a store.
                  </p>
                  {formError && <p className="checkout-flow__error" role="alert">{formError}</p>}
                  <button className="checkout-flow__primary" type="submit" disabled={orderPending}>
                    {orderPending ? 'Preparing demo order…' : 'Place demo order'}
                  </button>
                </form>
              </>
            )}
          </div>

          <footer className="checkout-flow__footer">
            <div className="checkout-flow__footer-links">
              <Link to="/terms">Terms and policies</Link>
              <Link to="/privacy-policy">Privacy</Link>
            </div>
            {step === 1 ? (
              <Link className="checkout-flow__back" to="/cart">Back</Link>
            ) : (
              <button
                className="checkout-flow__back"
                type="button"
                onClick={() => { setFormError(''); setStep((current) => Math.max(1, current - 1)) }}
              >
                Back
              </button>
            )}
          </footer>
        </section>

        <aside className="checkout-flow__summary" aria-label="Order summary">
          <div className="checkout-flow__summary-inner">
            <div className="checkout-flow__products">
              {items.map((item) => (
                <article className="checkout-flow__product" key={item.key}>
                  <div className={`checkout-flow__product-image${item.product.gender === 'men' ? ' checkout-flow__product-image--contain' : ''}`}>
                    <img src={getProductImages(item.product, item.color)[0]} alt="" />
                    <span>{item.quantity}</span>
                  </div>
                  <div className="checkout-flow__product-info">
                    <strong>{item.product.name}</strong>
                    <small>{item.size} / {item.color}</small>
                  </div>
                  <strong className="checkout-flow__product-price">{formatPrice(item.product.price * item.quantity)}</strong>
                </article>
              ))}
            </div>

            <form className="checkout-flow__discount" onSubmit={handleCoupon}>
              <label className="visually-hidden" htmlFor="checkout-discount">Discount code or gift card</label>
              <input
                id="checkout-discount"
                value={couponInput}
                onChange={(event) => setCouponInput(event.target.value)}
                placeholder="Discount code or gift card"
              />
              <button type="submit">{coupon ? 'Applied' : 'Apply'}</button>
            </form>
            {couponMessage && <p className="checkout-flow__coupon-message" role="status">{couponMessage}</p>}
            {coupon && (
              <button className="checkout-flow__remove-coupon" type="button" onClick={() => { clearCoupon(); setCouponInput(''); setCouponMessage('Code removed.') }}>
                Remove {coupon}
              </button>
            )}

            <div className="checkout-flow__totals">
              <div><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div>
                <span>Shipping</span>
                <span>{shippingKnown ? (shipping ? formatPrice(shipping) : 'Complimentary') : 'Enter shipping address'}</span>
              </div>
              {discount > 0 && <div><span>{coupon}</span><span>−{formatPrice(discount)}</span></div>}
              <div className="checkout-flow__grand-total"><strong>Total</strong><strong><small>INR</small> {formatPrice(total)}</strong></div>
            </div>
            <p className="checkout-flow__summary-note">Taxes included · Demo checkout only</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CheckoutPage
