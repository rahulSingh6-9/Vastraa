import { useState } from 'react'
import { Link } from 'react-router-dom'

const policies = {
  'shipping-policy': {
    title: 'Shipping policy',
    intro: 'We want your VASTRAA pieces to reach you with care.',
    sections: [
      ['Delivery timeline', 'Orders are typically prepared within 1–2 business days. Delivery timing depends on your location and is confirmed at checkout in this demonstration.'],
      ['Shipping charges', 'Standard delivery is complimentary on orders above ₹1,999. A shipping charge may apply to smaller orders.'],
      ['Order tracking', 'Use the order reference from your confirmation to view a saved demonstration order. No courier integration is connected.'],
    ],
  },
  'return-policy': {
    title: 'Returns & refunds',
    intro: 'We want every piece to feel right. This page outlines the sample return approach for the frontend demonstration.',
    sections: [
      ['Return window', 'Eligible unworn items with original tags may be requested for return within 14 days of delivery.'],
      ['Condition', 'Items should be unwashed, unaltered, and returned in their original packaging. Some intimate or final-sale pieces may not be eligible.'],
      ['Refunds', 'Approved refunds are returned to the original payment method after inspection. No actual payments or refunds are processed here.'],
    ],
  },
  'exchange-policy': {
    title: 'Exchange policy',
    intro: 'A different size or colour should be easy to find.',
    sections: [
      ['Request an exchange', 'Contact customer care within 14 days of delivery with your order reference and preferred replacement.'],
      ['Availability', 'Exchanges depend on stock availability. An item must be unworn, unwashed, and have its original tags.'],
      ['Demonstration notice', 'This website is a frontend demonstration and does not create real exchange requests.'],
    ],
  },
  'cancellation-policy': {
    title: 'Cancellation policy',
    intro: 'Plans change. Here is how a sample cancellation request would work.',
    sections: [
      ['Before dispatch', 'An order may be eligible for cancellation before it is prepared for dispatch.'],
      ['After dispatch', 'Once dispatched, the return process may apply instead of cancellation.'],
      ['Demo orders', 'Orders created on this site are saved in your browser only and are not sent to a warehouse.'],
    ],
  },
  'privacy-policy': {
    title: 'Privacy policy',
    intro: 'Your information belongs to you.',
    sections: [
      ['Information in this demo', 'Cart, wishlist, saved profile, and order demonstration data are stored locally in this browser.'],
      ['No backend', 'This demonstration does not transmit account, address, or payment information to a server. Do not enter sensitive payment credentials.'],
      ['Your choices', 'You can clear locally saved demo information by clearing this site’s browser storage.'],
    ],
  },
  terms: {
    title: 'Terms & conditions',
    intro: 'These sample terms explain the limits of the VASTRAA frontend demonstration.',
    sections: [
      ['Demonstration only', 'Products, prices, coupons, accounts, and orders are mock examples for interface demonstration. They are not offers to sell.'],
      ['No payment or fulfilment', 'No card is charged, no order is submitted to a retailer, and no product is shipped.'],
      ['Illustrative information', 'Descriptions and policy examples are provided to demonstrate page layouts and should be replaced with approved brand and legal copy before launch.'],
    ],
  },
}

const faqs = [
  ['How do I find my size?', 'Choose your usual size for the intended fit. Product pages include a simple size-guide demonstration.'],
  ['How much is shipping?', 'Shipping is shown as complimentary above ₹1,999 in this storefront demonstration.'],
  ['Can I change or cancel an order?', 'The demo checkout saves an order only in your browser. The order and policy pages explain the sample experience; no fulfilment system is connected.'],
  ['How can I reach customer care?', 'Write to hello@vastraa.in. That address is a demonstration contact and should be replaced with the brand’s verified support address.'],
]

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="contact-layout">
      <div>
        <p>Questions about a piece or an order? We would love to hear from you.</p>
        <a href="mailto:hello@vastraa.in">hello@vastraa.in</a>
        <p className="demo-disclaimer">Demo contact only. This form does not send data to a server.</p>
      </div>
      <form className="account-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); event.currentTarget.reset() }}>
        <div className="form-grid">
          <label>Your name<input name="name" required /></label>
          <label>Email address<input name="email" type="email" required /></label>
          <label className="form-grid__wide">How can we help?<textarea name="message" rows="5" required /></label>
        </div>
        <button className="button button--dark" type="submit">Prepare message</button>
        {submitted && <p className="form-message" role="status">Thanks for reaching out. Your message was not sent in this demo.</p>}
      </form>
    </div>
  )
}

function InformationPage({ page }) {
  if (page === 'about') {
    return (
      <article className="information-page information-page--about">
        <div className="information-page__image">
          <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=85" alt="VASTRAA editorial portrait in soft afternoon light" data-reveal-image />
        </div>
        <div className="information-page__copy" data-reveal>
          <p className="eyebrow">A note from VASTRAA</p>
          <h1>Clothes for the life you live in.</h1>
          <p>VASTRAA is built around a simple idea: getting dressed should feel like coming back to yourself. We create considered pieces that move with the many versions of your everyday.</p>
          <p>Thoughtful fabrics, enduring shapes, and small details make a wardrobe worth returning to. This frontend demonstration brings that point of view to life through an editorial shopping experience.</p>
          <Link className="button button--dark" to="/collections">Explore the collections <span aria-hidden="true">↗</span></Link>
        </div>
      </article>
    )
  }

  if (page === 'contact') {
    return (
      <section className="information-page section-pad">
        <p className="eyebrow">We’re here to help</p>
        <h1 data-reveal>Let’s talk.</h1>
        <ContactForm />
      </section>
    )
  }

  if (page === 'faq') {
    return (
      <section className="information-page section-pad">
        <p className="eyebrow">A few helpful things</p>
        <h1 data-reveal>Frequently asked questions.</h1>
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}><summary>{question}</summary><p>{answer}</p></details>
          ))}
        </div>
      </section>
    )
  }

  const policy = policies[page]
  return (
    <article className="information-page policy-page section-pad">
      <p className="eyebrow">VASTRAA information</p>
      <h1 data-reveal>{policy.title}</h1>
      <p className="policy-page__intro">{policy.intro}</p>
      {policy.sections.map(([title, body]) => (
        <section key={title}><h2>{title}</h2><p>{body}</p></section>
      ))}
      <p className="demo-disclaimer">These policy pages are illustrative demo copy and should be reviewed before a real store launch.</p>
    </article>
  )
}

export function NotFoundPage() {
  return (
    <section className="not-found-page section-pad">
      <p className="eyebrow">404 · Not found</p>
      <h1>This page took another turn.</h1>
      <p>Let’s get you back to something good.</p>
      <div className="order-result__actions">
        <Link className="button button--dark" to="/">Back to VASTRAA</Link>
        <Link className="text-link" to="/shop">Explore the shop</Link>
      </div>
    </section>
  )
}

export default InformationPage
