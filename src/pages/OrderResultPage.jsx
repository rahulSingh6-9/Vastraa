import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/useStore.js'

function OrderResultPage({ failed = false }) {
  const { orderId } = useParams()
  const { orders } = useStore()
  const order = orders.find((item) => item.id === orderId)

  if (failed) {
    return (
      <section className="order-result section-pad">
        <p className="eyebrow">Demo checkout</p>
        <h1>We could not complete that order.</h1>
        <p>No payment was taken. Your bag is still saved so you can try again.</p>
        <Link className="button button--dark" to="/checkout">Return to checkout</Link>
      </section>
    )
  }

  if (!order) {
    return (
      <section className="order-result section-pad">
        <p className="eyebrow">Order confirmation</p>
        <h1>We could not find that order.</h1>
        <p>Orders placed in this demo are saved in this browser.</p>
        <Link className="button button--dark" to="/account/orders">View your orders</Link>
      </section>
    )
  }

  return (
    <section className="order-result section-pad">
      <p className="eyebrow">Order confirmation</p>
      <h1>Thank you, {order.details.name.split(' ')[0]}.</h1>
      <p>Your demo order has been saved. No payment has been processed and no shipment will be sent.</p>
      <div className="order-result__details">
        <span>Order reference</span><strong>{order.id}</strong>
        <span>Status</span><strong>{order.status} · Demonstration</strong>
      </div>
      <div className="order-result__actions">
        <Link className="button button--dark" to="/account/orders">View order history</Link>
        <Link className="text-link" to="/shop">Continue exploring</Link>
      </div>
    </section>
  )
}

export default OrderResultPage
