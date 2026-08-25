import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { PRODUCTS, CATEGORIES } from '../data/products.js'

const PAGE_SIZE = 12

export default function Shop() {
  const [searchParams] = useSearchParams()
  const initialCategory = CATEGORIES.includes(searchParams.get('category'))
    ? searchParams.get('category')
    : 'All'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  const shown = filtered.slice(0, visible)

  function handleCategory(cat) {
    setCategory(cat)
    setVisible(PAGE_SIZE)
  }

  function handleSearch(e) {
    setQuery(e.target.value)
    setVisible(PAGE_SIZE)
  }

  return (
    <section id="shop" className="shop-page">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <div className="eyebrow">Catalog</div>
            <h2>Browse every design</h2>
          </div>
          <p>New designs are added often. Can't find what you need? Get a custom quote instead.</p>
        </Reveal>

        <div className="shop-controls">
          <input
            type="search"
            placeholder="Search designs…"
            value={query}
            onChange={handleSearch}
            aria-label="Search designs"
          />
          <div className="chip-row">
            <button
              className={`chip ${category === 'All' ? 'active' : ''}`}
              onClick={() => handleCategory('All')}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`chip ${category === cat ? 'active' : ''}`}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="results-count">{filtered.length} design{filtered.length !== 1 ? 's' : ''}</div>

        {shown.length > 0 ? (
          <div className="product-grid">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No designs match that search. Try a different term, or send 773 Labs a custom quote request.</p>
          </div>
        )}

        {visible < filtered.length && (
          <div className="load-more">
            <button className="btn btn-ghost" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Show more designs
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
