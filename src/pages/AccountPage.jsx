import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { formatPrice } from '../utils/money.js'
import { products } from '../data/products.js'
import { useStore } from '../context/useStore.js'

const accountLinks = [
  { label: 'Overview', path: '/account' },
  { label: 'My orders', path: '/account/orders' },
  { label: 'Saved addresses', path: '/account/addresses' },
  { label: 'Profile settings', path: '/account/profile' },
  { label: 'Wishlist', path: '/wishlist' },
]

function AccountPage() {
  const { pathname } = useLocation()
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { user, orders, addresses, signOut, updateProfile, saveAddress, removeAddress } = useStore()
  const [message, setMessage] = useState('')
  const order = orders.find((item) => item.id === orderId)

  if (!user) {
    return (
      <section className="account-gate section-pad">
        <p className="eyebrow">Your VASTRAA account</p>
        <h1>A place for your favourites.</h1>
        <p>Sign in or create a demo account to view your orders and saved details.</p>
        <div><Link className="button button--dark" to="/login">Sign in</Link><Link className="text-link" to="/register">Create account</Link></div>
      </section>
    )
  }

  const saveProfile = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    updateProfile({ name: data.get('name'), email: data.get('email') })
    setMessage('Your profile was updated in this browser.')
  }

  const addAddress = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    saveAddress({
      label: data.get('label'),
      name: data.get('name'),
      address: data.get('address'),
      city: data.get('city'),
      postalCode: data.get('postalCode'),
    })
    event.currentTarget.reset()
    setMessage('Address saved in this browser.')
  }

  let content
  if (orderId) {
    content = order ? (
      <section className="account-content">
        <p className="eyebrow">Order details</p>
        <h2>{order.id}</h2>
        <p className="account-muted">{new Date(order.date).toLocaleDateString('en-IN')} · {order.status} · Demonstration order</p>
        <div className="order-list">
          {order.items.map((item) => {
            const product = products.find((entry) => entry.id === item.productId)
            return product ? (
              <div className="order-list__row" key={item.key}>
                <span>{product.name} · {item.size} · {item.color} × {item.quantity}</span>
                <strong>{formatPrice(product.price * item.quantity)}</strong>
              </div>
            ) : null
          })}
        </div>
        <p className="demo-disclaimer">No payment or delivery is associated with this demonstration order.</p>
      </section>
    ) : (
      <section className="account-content"><h2>Order not found</h2><p>Choose an order from your order history.</p></section>
    )
  } else if (pathname === '/account/orders') {
    content = (
      <section className="account-content">
        <p className="eyebrow">Your VASTRAA history</p><h2>My orders</h2>
        {orders.length ? (
          <div className="order-list">
            {orders.map((orderItem) => (
              <Link className="order-list__row" to={`/account/orders/${orderItem.id}`} key={orderItem.id}>
                <span><strong>{orderItem.id}</strong><small>{new Date(orderItem.date).toLocaleDateString('en-IN')} · {orderItem.status} · Demo</small></span>
                <span>View order ↗</span>
              </Link>
            ))}
          </div>
        ) : <div className="shop-empty"><h3>Your next favourite is out there.</h3><p>Your demo orders will appear here.</p><Link className="button button--dark" to="/shop">Explore the shop</Link></div>}
      </section>
    )
  } else if (pathname === '/account/addresses') {
    content = (
      <section className="account-content">
        <p className="eyebrow">Saved details</p><h2>Delivery addresses</h2>
        {addresses.length > 0 && (
          <div className="address-list">
            {addresses.map((address) => (
              <article key={address.id}>
                <div><strong>{address.label}</strong><p>{address.name}<br />{address.address}, {address.city} {address.postalCode}</p></div>
                <button className="text-button" type="button" onClick={() => removeAddress(address.id)}>Remove</button>
              </article>
            ))}
          </div>
        )}
        <form className="account-form" onSubmit={addAddress}>
          <h3>Add an address</h3>
          <div className="form-grid">
            <label>Label<input name="label" placeholder="Home" required /></label>
            <label>Full name<input name="name" required /></label>
            <label className="form-grid__wide">Address<input name="address" required /></label>
            <label>City<input name="city" required /></label>
            <label>PIN code<input name="postalCode" inputMode="numeric" pattern="[0-9]{6}" required /></label>
          </div>
          <button className="button button--dark" type="submit">Save address</button>
        </form>
      </section>
    )
  } else if (pathname === '/account/profile') {
    content = (
      <section className="account-content">
        <p className="eyebrow">Your details</p><h2>Profile settings</h2>
        <form className="account-form" onSubmit={saveProfile}>
          <div className="form-grid">
            <label>Full name<input name="name" defaultValue={user.name} required /></label>
            <label>Email address<input name="email" type="email" defaultValue={user.email} required /></label>
          </div>
          <button className="button button--dark" type="submit">Save changes</button>
          <p role="status" className="form-message">{message}</p>
        </form>
      </section>
    )
  } else {
    content = (
      <section className="account-content account-overview">
        <p className="eyebrow">Your VASTRAA account</p>
        <h2>Welcome, {user.name.split(' ')[0]}.</h2>
        <p>Keep track of orders, save your details, and make the next visit feel like yours.</p>
        <div className="account-overview__tiles">
          <Link to="/account/orders"><strong>{orders.length}</strong><span>Demo orders</span></Link>
          <Link to="/account/addresses"><strong>{addresses.length}</strong><span>Saved addresses</span></Link>
          <Link to="/wishlist"><strong>♥</strong><span>Wishlist</span></Link>
        </div>
      </section>
    )
  }

  return (
    <div className="account-page section-pad">
      <div className="account-page__heading">
        <p className="eyebrow">The VASTRAA account</p>
        <h1>Your space.</h1>
      </div>
      <div className="account-layout">
        <aside className="account-sidebar">
          <p>{user.name}<small>{user.email}</small></p>
          {accountLinks.map((item) => (
            <Link to={item.path} key={item.path} className={pathname === item.path ? 'is-current' : ''}>{item.label}</Link>
          ))}
          <button type="button" className="text-button" onClick={() => { signOut(); navigate('/') }}>Sign out</button>
        </aside>
        <div>{content}</div>
      </div>
    </div>
  )
}

export function TrackOrderPage() {
  const { orders } = useStore()
  const [orderId, setOrderId] = useState('')
  const [searched, setSearched] = useState(false)
  const order = searched ? orders.find((item) => item.id.toLowerCase() === orderId.trim().toLowerCase()) : null

  return (
    <section className="tracking-page section-pad">
      <p className="eyebrow">A little peace of mind</p>
      <h1>Track your order.</h1>
      <p>Enter a demo order reference to see its saved status.</p>
      <form className="tracking-form" onSubmit={(event) => { event.preventDefault(); setSearched(true) }}>
        <label htmlFor="tracking-id">Order reference</label>
        <div><input id="tracking-id" value={orderId} onChange={(event) => { setOrderId(event.target.value); setSearched(false) }} placeholder="VST-00000000" required /><button className="button button--dark" type="submit">Track</button></div>
      </form>
      {searched && (order ? (
        <div className="tracking-result"><strong>{order.id}</strong><span>{order.status} · Demonstration order</span><small>{new Date(order.date).toLocaleDateString('en-IN')}</small></div>
      ) : <p className="form-message" role="status">No saved demo order matches that reference.</p>)}
      <p className="demo-disclaimer">This demonstration does not connect to a delivery service.</p>
    </section>
  )
}

export default AccountPage
