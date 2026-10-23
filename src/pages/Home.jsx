import { waLink, buildGeneralMessage } from '../data/whatsapp.js'

const CAPABILITIES = [
  { n: '( 1 )', title: 'FDM printing', body: 'Layer-by-layer thermoplastic printing in PLA, PETG, ABS and TPU. Ideal for functional parts, enclosures and prototypes.' },
  { n: '( 2 )', title: 'Resin printing', body: 'High-detail SLA prints for miniatures, figurines and smooth-finish parts at 0.03-0.05mm layers.' },
  { n: '( 3 )', title: 'Custom design', body: 'From a sketch or a CAD file to a finished part. We model, slice and print to your spec.' },
  { n: '( 4 )', title: 'Finishing', body: 'Sanding, priming and painting on request. Clean, presentable parts ready to use or display.' },
]

const PROCESS = [
  { step: '01', title: 'Share your idea', body: 'Send a reference, a file or just a description on WhatsApp.' },
  { step: '02', title: 'Quote & confirm', body: 'We confirm material, size, price and turnaround.' },
  { step: '03', title: 'Print & finish', body: 'We print, inspect and finish the part.' },
  { step: '04', title: 'Deliver', body: 'Dispatch or local pickup, with tracking.' },
]

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-meta">
            <span className="kicker">773 LABS · 3D PRINT STUDIO</span>
            <span className="dot" aria-hidden="true" />
            <span className="kicker">INDIA</span>
          </div>
          <h1 className="h1 hero-title">
            Ideas, built<br />one layer at a time.
          </h1>
          <p className="lede hero-sub">
            773 Labs is a 3D print studio. We design, print and finish custom parts —
            from functional brackets to display pieces — made to order.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/order">Start an order</a>
            <a className="btn btn-ghost" href="/printers">See our printers</a>
          </div>
        </div>
        <div className="hero-scroll" aria-hidden="true">
          <span>Scroll</span>
        </div>
      </section>

      {/* ---------- ABOUT ---------- */}
      <section className="section">
        <div className="container">
          <p className="kicker" style={{ marginBottom: 16 }}>ABOUT 773 LABS</p>
          <h2 className="h2" style={{ marginBottom: 24, maxWidth: '22ch' }}>
            A small studio with big precision.
          </h2>
          <p className="lede" style={{ maxWidth: '62ch' }}>
            We are a hands-on 3D printing studio. Every part is printed in-house, inspected
            by hand and shipped with care. No mass production, no middlemen — just good prints.
          </p>
        </div>
      </section>

      {/* ---------- CAPABILITIES ---------- */}
      <section className="section" id="capabilities">
        <div className="container">
          <p className="kicker" style={{ marginBottom: 16 }}>WHAT WE DO</p>
          <h2 className="h2" style={{ marginBottom: 48 }}>Capabilities.</h2>
          <div className="num-grid">
            {CAPABILITIES.map((c) => (
              <div className="num-item" key={c.title}>
                <div className="n">{c.n}</div>
                <h4>{c.title}</h4>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PROCESS ---------- */}
      <section className="section">
        <div className="container">
          <p className="kicker" style={{ marginBottom: 16 }}>HOW IT WORKS</p>
          <h2 className="h2" style={{ marginBottom: 48 }}>From idea to part.</h2>
          <div className="num-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {PROCESS.map((p) => (
              <div className="num-item" key={p.step}>
                <div className="n">{p.step}</div>
                <h4>{p.title}</h4>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PRINTERS TEASER ---------- */}
      <section className="section">
        <div className="container">
          <p className="kicker" style={{ marginBottom: 16 }}>EQUIPMENT</p>
          <h2 className="h2" style={{ marginBottom: 16, maxWidth: '24ch' }}>
            The machines behind the parts.
          </h2>
          <p className="lede" style={{ marginBottom: 32, maxWidth: '60ch' }}>
            A mixed fleet of FDM and resin printers lets us match the right process to your part.
          </p>
          <a className="btn btn-ghost" href="/printers">Explore printers</a>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta">
        <div className="container">
          <p className="kicker" style={{ marginBottom: 16 }}>READY TO PRINT?</p>
          <h2 className="h2">Let's make your part.</h2>
          <p>Send us your idea, file or reference. We'll quote and get printing.</p>
          <div className="cta-actions">
            <a className="btn btn-primary" href="/order">Start an order</a>
            <a className="btn btn-ghost" href={waLink(buildGeneralMessage())} target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
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
                <li><a href={waLink(buildGeneralMessage())} target="_blank" rel="noreferrer">WhatsApp</a></li>
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
