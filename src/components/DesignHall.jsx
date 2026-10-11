import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS, CATEGORIES } from '../data/products.js'

/* The visible catalogue that follows the 3D walk.
   Every design in PRODUCTS is rendered up front — filters narrow, they never
   hide something by default. That is the whole point of the section: a visitor
   should be able to see the entire catalogue without interacting at all. */

const countFor = (category) => PRODUCTS.filter((product) => product.category === category).length

function DesignCard({ product, index, broken, onError }) {
  const meta = [product.material, product.layerHeight, product.printTime].filter(Boolean)

  return (
    <Link to={`/product/${product.id}`} className="hall-card">
      <span className="hall-card-media">
        {product.image && !broken ? (
          <img
            src={encodeURI(product.image)}
            alt={product.name}
            loading={index < 14 ? 'eager' : 'lazy'}
            decoding="async"
            onError={onError}
          />
        ) : (
          <span className="hall-card-fallback" aria-hidden="true">
            {product.name.charAt(0)}
          </span>
        )}
        <span className="hall-card-cat">{product.category}</span>
        <span className="hall-card-no" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </span>
      <span className="hall-card-body">
        <strong>{product.name}</strong>
        <span className="hall-card-meta">{meta.join(' · ')}</span>
        <span className="hall-card-foot">
          <span className="hall-card-price">{product.price}</span>
          <span className="hall-card-cta">Spec →</span>
        </span>
      </span>
    </Link>
  )
}

export default function DesignHall() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [broken, setBroken] = useState(() => new Set())

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return PRODUCTS.filter((product) => {
      if (category !== 'All' && product.category !== category) return false
      if (!query) return true
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.material.toLowerCase().includes(query)
      )
    })
  }, [category, search])

  const markBroken = (id) => setBroken((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))

  return (
    <section className="design-hall" id="design-hall" aria-labelledby="design-hall-title">
      <div className="hall-inner">
        <header className="hall-head">
          <p className="page-kicker">Design library</p>
          <h2 id="design-hall-title">
            The whole hall, <em>at a glance</em>
          </h2>
          <p className="hall-lede">
            Every design we print, in one wall. <strong>{PRODUCTS.length} objects</strong> across{' '}
            <strong>{CATEGORIES.length} collections</strong> — pick any card to see its full spec,
            or step back into the studio to walk the hall in 3D.
          </p>
        </header>

        <div className="hall-controls">
          <div className="hall-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search designs, materials…"
              aria-label="Search the design library"
            />
          </div>
          <span className="hall-count" aria-live="polite">
            {visible.length} of {PRODUCTS.length}
          </span>
        </div>

        <div className="hall-filters" role="group" aria-label="Filter by collection">
          {['All', ...CATEGORIES].map((name) => (
            <button
              key={name}
              type="button"
              className={`filter-chip ${category === name ? 'active' : ''}`}
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
            >
              {name}
              <span className="filter-count">{name === 'All' ? PRODUCTS.length : countFor(name)}</span>
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="hall-empty">No designs match that. Try another word or clear the filter.</p>
        ) : (
          <div className="hall-grid">
            {visible.map((product, index) => (
              <DesignCard
                key={product.id}
                product={product}
                index={PRODUCTS.indexOf(product)}
                broken={broken.has(product.id)}
                onError={() => markBroken(product.id)}
              />
            ))}
          </div>
        )}

        <footer className="hall-foot">
          <Link to="/shop" className="btn btn-whatsapp hall-foot-cta">
            Browse the full shop
          </Link>
          <span>Can't find what you need? <Link to="/services" className="hall-foot-link">Request a custom print</Link></span>
        </footer>
      </div>
    </section>
  )
}