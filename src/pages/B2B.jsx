import { useEffect, useState } from 'react'
import { waLink, trackSend, buildQuoteMessage } from '../data/whatsapp.js'

const INDUSTRIES = [
  'Education & Research', 'Product Design & Engineering', 'Architecture & Construction',
  'Manufacturing', 'Medical & Healthcare', 'Aerospace & Defence', 'Automotive',
  'Consumer Goods', 'Media & Entertainment', 'Other',
]

const WHY_CHOOSE = [
  { title: 'Pan-India Delivery', desc: 'We have shipped orders to 10,000+ pincodes across India with the best courier partners.' },
  { title: 'Quality Assurance', desc: 'Every batch is inspected before dispatch. We stand behind our prints.' },
  { title: 'Dedicated Support', desc: 'A dedicated B2B manager for your account — from quote to delivery.' },
  { title: 'Innovation-Driven', desc: 'We constantly expand our materials, finishes, and capabilities.' },
  { title: 'Technical Expertise', desc: 'Our team understands engineering requirements and can advise on design for manufacturability.' },
  { title: 'Genuine & Original', desc: 'All designs are original or properly licensed. No copies, no compromises.' },
]

export default function B2B() {
  const [form, setForm] = useState({ company: '', contact: '', email: '', industry: '', volume: '', details: '' })

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'B2B Bulk Enquiry · 773 Labs'
    return () => { document.title = '773 Labs' }
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = buildQuoteMessage({ ...form, projectType: form.industry, quantity: form.volume })
    window.open(waLink(message), '_blank', 'noopener,noreferrer')
    trackSend('b2b-enquiry', message)()
  }

  return (
    <main className="page b2b-page">
      <div className="page-head">
        <div className="page-kicker">Business to Business</div>
        <h1>Bulk orders, <em>built right</em></h1>
        <p className="page-lede">
          We are a fast-growing electronics and 3D printing distribution company in PAN India
          with operational capability and excellent after-sales service. Quality brands, wide
          product selection, and dedicated support for your business.
        </p>
      </div>

      <div className="b2b-why">
        <h2>Why choose 773 Labs</h2>
        <div className="b2b-why-grid">
          {WHY_CHOOSE.map((item) => (
            <div key={item.title} className="b2b-why-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="b2b-industries">
        <h2>Industries we serve</h2>
        <div className="b2b-industry-tags">
          {INDUSTRIES.map((ind) => <span key={ind} className="industry-tag">{ind}</span>)}
        </div>
      </div>

      <section className="b2b-form-section">
        <div className="b2b-form-head">
          <h2>Bulk enquiry</h2>
          <p>Tell us what you need — quantity, specs, timeline — and our B2B team will get back with a custom quote.</p>
        </div>
        <form className="quote-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="b-company">Company name *</label>
              <input id="b-company" name="company" value={form.company} onChange={handleChange} required placeholder="Your company" />
            </div>
            <div className="form-field">
              <label htmlFor="b-contact">Contact person *</label>
              <input id="b-contact" name="contact" value={form.contact} onChange={handleChange} required placeholder="Full name" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="b-email">Email *</label>
              <input id="b-email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="work@company.com" />
            </div>
            <div className="form-field">
              <label htmlFor="b-industry">Industry</label>
              <select id="b-industry" name="industry" value={form.industry} onChange={handleChange}>
                <option value="">Select…</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="b-volume">Estimated volume</label>
              <input id="b-volume" name="volume" value={form.volume} onChange={handleChange} placeholder="e.g. 50 units / month" />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="b-details">Requirements *</label>
            <textarea id="b-details" name="details" value={form.details} onChange={handleChange} required rows={5} placeholder="Describe the parts, materials, quantities, and timeline…" />
          </div>
          <button type="submit" className="btn btn-whatsapp">Send bulk enquiry</button>
        </form>
      </section>
    </main>
  )
}
