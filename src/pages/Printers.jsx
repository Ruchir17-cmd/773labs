import { Link } from 'react-router-dom'

const PRINTERS = [
  {
    name: 'Bambu Lab X1 Carbon',
    type: 'FDM',
    build: '256 × 256 × 256 mm',
    materials: 'PLA, PETG, ABS, TPU, PA, PC',
    layer: '0.08 – 0.28 mm',
    notes: 'High-speed core-XY. Our workhorse for functional parts and fast turnarounds.',
  },
  {
    name: 'Prusa MK4',
    type: 'FDM',
    build: '250 × 210 × 220 mm',
    materials: 'PLA, PETG, ABS, TPU, ASA',
    layer: '0.10 – 0.30 mm',
    notes: 'Reliable, precise. Great for brackets, enclosures and prototypes.',
  },
  {
    name: 'Creality Ender 3 V3',
    type: 'FDM',
    build: '220 × 220 × 250 mm',
    materials: 'PLA, PETG',
    layer: '0.12 – 0.28 mm',
    notes: 'Entry-level FDM for simple, cost-effective prints.',
  },
  {
    name: 'Anycubic Photon Mono M5s',
    type: 'Resin (SLA)',
    build: '218 × 123 × 200 mm',
    materials: 'Standard, ABS-like, water-washable resin',
    layer: '0.03 – 0.05 mm',
    notes: '10K mono screen. Fine detail for miniatures and smooth surfaces.',
  },
  {
    name: 'Elegoo Mars 4',
    type: 'Resin (SLA)',
    build: '143 × 89 × 175 mm',
    materials: 'Standard, ABS-like resin',
    layer: '0.03 – 0.05 mm',
    notes: 'Compact resin printer for small, highly detailed parts.',
  },
]

export default function Printers() {
  return (
    <>
      <section className="hero" style={{ minHeight: '60vh' }}>
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-meta">
            <span className="kicker">EQUIPMENT · 773 LABS</span>
            <span className="dot" aria-hidden="true" />
            <span className="kicker">FDM + RESIN</span>
          </div>
          <h1 className="h1 hero-title">Our printers.</h1>
          <p className="lede hero-sub">
            A mixed fleet of FDM and resin machines. We match the right process to your part.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker" style={{ marginBottom: 16 }}>THE FLEET</p>
          <h2 className="h2" style={{ marginBottom: 40 }}>Machines we run.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {PRINTERS.map((p) => (
              <div key={p.name} style={{ borderTop: '1px solid var(--border)', padding: '32px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  <h3 className="h3">{p.name}</h3>
                  <span className="kicker">{p.type}</span>
                </div>
                <div className="specs-grid" style={{ borderTop: 'none' }}>
                  <div className="spec-row"><span className="label">Build volume</span><span className="value">{p.build}</span></div>
                  <div className="spec-row"><span className="label">Materials</span><span className="value">{p.materials}</span></div>
                  <div className="spec-row"><span className="label">Layer height</span><span className="value">{p.layer}</span></div>
                </div>
                <p style={{ color: 'var(--fg-muted)', marginTop: 12, maxWidth: '70ch' }}>{p.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <p className="kicker" style={{ marginBottom: 16 }}>NOT SURE WHICH?</p>
          <h2 className="h2">We'll pick the right machine.</h2>
          <p>Tell us about your part and we'll recommend the best process and printer.</p>
          <div className="cta-actions">
            <a className="btn btn-primary" href="/order">Start an order</a>
            <a className="btn btn-ghost" href="https://wa.me/916260428896?text=Hi%20773%20Labs!%20I%20have%20a%20question%20about%20your%20printers." target="_blank" rel="noreferrer">
              Ask on WhatsApp
            </a>
          </div>
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
