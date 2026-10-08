import { useEffect, useState } from 'react'
import { waLink, trackSend, buildGeneralMessage } from '../data/whatsapp.js'

const SELLER_BENEFITS = [
  { title: 'Reach thousands of buyers', desc: 'List your designs in front of our growing community of makers, engineers, and hobbyists.' },
  { title: 'Zero listing fees', desc: 'No upfront cost to list. We only take a small commission when you make a sale.' },
  { title: 'You keep your IP', desc: 'Your designs remain yours. We never resell or reuse your files without permission.' },
  { title: 'Fulfilment optional', desc: 'Ship yourself or let our lab print and dispatch on demand.' },
  { title: 'Analytics dashboard', desc: 'Track views, orders, and revenue from a simple seller dashboard.' },
  { title: 'Payouts on time', desc: 'Weekly payouts via UPI, bank transfer, or PayPal — no delays.' },
]

export default function Sell() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', storeName: '', experience: '', catalog: '' })

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Sell on 773 Labs'
    return () => { document.title = '773 Labs' }
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = `Hi 773 Labs! I'd like to become a seller.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nStore name: ${form.storeName}\nExperience: ${form.experience}\nCatalog: ${form.catalog}`
    window.open(waLink(message), '_blank', 'noopener,noreferrer')
    trackSend('seller-application', message)()
  }

  return (
    <main className="page sell-page">
      <div className="page-head">
        <div className="page-kicker">Sell on 773</div>
        <h1>Your designs, <em>our audience</em></h1>
        <p className="page-lede">
          Join the 773 Labs marketplace. List your 3D designs, reach thousands of buyers,
          and let us handle printing, packaging, and shipping — or fulfil orders yourself.
        </p>
      </div>

      <div className="sell-benefits">
        <h2>Seller benefits</h2>
        <div className="sell-benefits-grid">
          {SELLER_BENEFITS.map((b) => (
            <div key={b.title} className="sell-benefit-card">
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="sell-form-section">
        <div className="sell-form-head">
          <h2>Apply to sell</h2>
          <p>Fill in your details and we&apos;ll reach out with next steps. Approval typically takes 1–2 business days.</p>
        </div>
        <form className="quote-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="s-name">Full name *</label>
              <input id="s-name" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
            </div>
            <div className="form-field">
              <label htmlFor="s-email">Email *</label>
              <input id="s-email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="s-phone">Phone *</label>
              <input id="s-phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 …" />
            </div>
            <div className="form-field">
              <label htmlFor="s-store">Store / brand name</label>
              <input id="s-store" name="storeName" value={form.storeName} onChange={handleChange} placeholder="e.g. MakerWorks" />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="s-exp">3D design / printing experience</label>
            <textarea id="s-exp" name="experience" value={form.experience} onChange={handleChange} rows={3} placeholder="Tell us about your background — software, materials, years of experience…" />
          </div>
          <div className="form-field">
            <label htmlFor="s-catalog">What would you like to sell?</label>
            <textarea id="s-catalog" name="catalog" value={form.catalog} onChange={handleChange} rows={3} placeholder="Describe your designs, categories, or existing catalogue…" />
          </div>
          <button type="submit" className="btn btn-whatsapp">Submit application</button>
        </form>
      </section>
    </main>
  )
}
