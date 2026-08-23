import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import Reveal from '../components/Reveal.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { PRODUCTS, FEATURED_IDS } from '../data/products.js'

const featured = FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)

export default function Home() {
  return (
    <>
      <Hero />

      <div className="status-strip">
        <div className="wrap">
          <div className="status-item">
            <div className="label">Designs in catalog</div>
            <div className="value"><span className="accent">{PRODUCTS.length}+</span></div>
          </div>
          <div className="status-item">
            <div className="label">Materials</div>
            <div className="value">PLA · PETG · ABS · TPU · Resin</div>
          </div>
          <div className="status-item">
            <div className="label">Avg. turnaround</div>
            <div className="value">3–5 days</div>
          </div>
          <div className="status-item">
            <div className="label">Ordering</div>
            <div className="value">Direct on WhatsApp</div>
          </div>
        </div>
      </div>

      <section id="featured">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <div className="eyebrow">Featured</div>
              <h2>A couple of favourites</h2>
            </div>
            <p>Two designs Shivesh keeps coming back to. See everything else in the full catalog.</p>
          </Reveal>
          <Reveal className="featured-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Reveal>
          <Reveal className="featured-cta">
            <Link to="/shop" className="btn btn-ghost">View full catalog →</Link>
          </Reveal>
        </div>
      </section>

      <section id="services">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <div className="eyebrow">Services</div>
              <h2>What Shivesh prints</h2>
            </div>
            <p>From a single test fit to a batch of parts, quoted the same way every time.</p>
          </Reveal>
          <Reveal className="services-grid">
            <div className="service-card">
              <span className="idx">01</span>
              <h3>Prototyping &amp; iteration</h3>
              <p>Fast turnarounds on early-stage parts so you can test fit and function before committing further.</p>
            </div>
            <div className="service-card">
              <span className="idx">02</span>
              <h3>Functional parts &amp; brackets</h3>
              <p>Load-bearing mounts, jigs, and fixtures printed in engineering filaments and checked for tolerance.</p>
            </div>
            <div className="service-card">
              <span className="idx">03</span>
              <h3>Miniatures &amp; collectibles</h3>
              <p>High-resolution resin prints for tabletop miniatures, character models, and display pieces.</p>
            </div>
            <div className="service-card">
              <span className="idx">04</span>
              <h3>Cosplay &amp; props</h3>
              <p>Armor, helmets, and weapon props, printed in sections and finished ready to assemble and paint.</p>
            </div>
            <div className="service-card">
              <span className="idx">05</span>
              <h3>Batch orders</h3>
              <p>Multiple copies of the same part, printed with consistent settings run to run.</p>
            </div>
            <div className="service-card">
              <span className="idx">06</span>
              <h3>Custom design from sketch</h3>
              <p>No file yet? Send a sketch or reference on WhatsApp and Shivesh will model it before printing.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="process">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <div className="eyebrow">How it works</div>
              <h2>From catalog to doorstep</h2>
            </div>
            <p>No accounts, no checkout — everything's confirmed with Shivesh directly.</p>
          </Reveal>
          <Reveal className="process-list">
            <div className="process-step">
              <span className="num">01</span>
              <h3>Browse the catalog</h3>
              <p>Find a design you like, or a starting point for something custom.</p>
            </div>
            <div className="process-step">
              <span className="num">02</span>
              <h3>Message on WhatsApp</h3>
              <p>Tap order and your design, material, and specs are sent over automatically.</p>
            </div>
            <div className="process-step">
              <span className="num">03</span>
              <h3>Confirm price &amp; details</h3>
              <p>Shivesh replies with final pricing, timeline, and any options to choose from.</p>
            </div>
            <div className="process-step">
              <span className="num">04</span>
              <h3>Printed &amp; shipped</h3>
              <p>Your part is printed, inspected, packed, and shipped with tracking.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="testimonials">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <div className="eyebrow">Clients say</div>
              <h2>Placeholder feedback — swap in real quotes</h2>
            </div>
          </Reveal>
          <Reveal className="testimonial-grid">
            <div className="testimonial">
              <p className="quote">"Sent over a rough sketch and got back a part that fit first try. Ordering on WhatsApp was way easier than I expected."</p>
              <div className="who"><b>— Client name</b>, Product designer</div>
            </div>
            <div className="testimonial">
              <p className="quote">"Ordered forty brackets for a client install. Every single one matched the spec sheet exactly."</p>
              <div className="who"><b>— Client name</b>, Small business owner</div>
            </div>
            <div className="testimonial">
              <p className="quote">"The detail on the miniatures is honestly better than what I've gotten from bigger print shops."</p>
              <div className="who"><b>— Client name</b>, Tabletop hobbyist</div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="home-cta">
        <div className="wrap">
          <Reveal className="cta-banner">
            <div>
              <h2>Have something specific in mind?</h2>
              <p>If it's not in the catalog yet, get a custom quote and Shivesh will design it from scratch.</p>
            </div>
            <Link to="/quote" className="btn btn-primary">Get a custom quote →</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
