import { useState } from 'react'
import { waLink, buildQuoteMessage } from '../data/whatsapp.js'

const PROJECT_TYPES = ['Functional part', 'Prototype', 'Miniature / collectible', 'Display piece', 'Enclosure / mount', 'Other']
const MATERIALS = ['PLA', 'PETG', 'ABS', 'TPU', 'Resin', 'Not sure']

export default function Order() {
  const [fields, setFields] = useState({
    name: '',
    projectType: '',
    size: '',
    details: '',
    material: '',
    quantity: '1',
    deadline: '',
  })

  const update = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const msg = buildQuoteMessage(fields)
    window.open(waLink(msg), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <section className="hero" style={{ minHeight: '50vh' }}>
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-meta">
            <span className="kicker">ORDER · 773 LABS</span>
            <span className="dot" aria-hidden="true" />
            <span className="kicker">CUSTOM PRINTS</span>
          </div>
          <h1 className="h1 hero-title">Start an order.</h1>
          <p className="lede hero-sub">
            Tell us what you need. We'll confirm price, material and turnaround on WhatsApp.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label className="kicker" style={{ display: 'block', marginBottom: 8 }}>Name</label>
              <input
                type="text"
                value={fields.name}
                onChange={update('name')}
                required
                style={inputStyle}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="kicker" style={{ display: 'block', marginBottom: 8 }}>Project type</label>
              <select value={fields.projectType} onChange={update('projectType')} style={inputStyle}>
                <option value="">Select…</option>
                {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="kicker" style={{ display: 'block', marginBottom: 8 }}>Material</label>
              <select value={fields.material} onChange={update('material')} style={inputStyle}>
                <option value="">Select…</option>
                {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="kicker" style={{ display: 'block', marginBottom: 8 }}>Size (approx.)</label>
                <input type="text" value={fields.size} onChange={update('size')} style={inputStyle} placeholder="e.g. 10 × 5 × 3 cm" />
              </div>
              <div>
                <label className="kicker" style={{ display: 'block', marginBottom: 8 }}>Quantity</label>
                <input type="number" min="1" value={fields.quantity} onChange={update('quantity')} style={inputStyle} />
              </div>
            </div>

            <div>
              <label className="kicker" style={{ display: 'block', marginBottom: 8 }}>Needed by</label>
              <input type="text" value={fields.deadline} onChange={update('deadline')} style={inputStyle} placeholder="e.g. within 2 weeks" />
            </div>

            <div>
              <label className="kicker" style={{ display: 'block', marginBottom: 8 }}>Details</label>
              <textarea
                value={fields.details}
                onChange={update('details')}
                required
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Describe the part, share a link to a file or reference image…"
              />
            </div>

            <div className="cta-actions" style={{ justifyContent: 'flex-start' }}>
              <button type="submit" className="btn btn-primary">Send on WhatsApp</button>
              <a className="btn btn-ghost" href="/printers">See printers</a>
            </div>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a href="#top" className="nav-logo" style={{ marginBottom: 16, display: 'inline-flex' }}>
                <span className="nav-logo-mark">773</span>
                <span className="nav-logo-text">LABS</span>
              </a>
              <p style={{ marginTop: 16, maxWidth: '36ch', fontSize: '.9rem' }}>
                3D-printed objects, made to order. From the first layer to the finished piece.
              </p>
            </div>
            <div>
              <h5>Studio</h5>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/printers">Printers</a></li>
                <li><a href="/order">Order</a></li>
                <li><a href="/vulnerability">Vulnerability</a></li>
              </ul>
            </div>
            <div>
              <h5>Contact</h5>
              <ul>
                <li><a href="https://wa.me/916260428896" target="_blank" rel="noreferrer">WhatsApp</a></li>
                <li><a href="mailto:hello@773labs.in">Email</a></li>
              </ul>
            </div>
            <div>
              <h5>Legal</h5>
              <ul>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 773 LABS</span>
            <span>Made with care · Printed one layer at a time</span>
          </div>
        </div>
      </footer>
    </>
  )
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: 'var(--bg-elev)',
  border: '1px solid var(--border-strong)',
  borderRadius: 4,
  color: 'var(--fg)',
  font: '400 1rem var(--font-body)',
  outline: 'none',
}
