import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS, CATEGORIES } from '../data/products.js'

const SORT_OPTIONS = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

function parsePrice(price) {
  const match = price.replace(/,/g, '').match(/\d+/)
  return match ? parseInt(match[0], 10) : 0
}

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name')
  const [imageErrors, setImageErrors] = useState({})

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Shop · 773 Labs'
    return () => { document.title = '773 Labs' }
  }, [])

  const filtered = useMemo(() => {
    let items = [...PRODUCTS]

    if (activeCategory !== 'All') {
      items = items.filter((p) => p.category === activeCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q),
      )
    }

    switch (sort) {
      case 'name':
        items.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        items.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'price-asc':
        items.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
        break
      case 'price-desc':
        items.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
        break
    }

    return items
  }, [activeCategory, search, sort])

  return (
    <main className="page shop-page">
      <div className="page-head">
        <div className="page-kicker">Catalogue</div>
        <h1>Shop the <em>collection</em></h1>
        <p className="page-lede">
          Every design is printed to order in our lab. Filter by collection, search for a
          material, or sort by price — then click any card to view its full spec.
        </p>
      </div>

      <div className="shop-controls">
        <div className="shop-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="search"
            placeholder="Search designs, materials…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
        </div>
        <div className="shop-sort">
          <label htmlFor="sort-select">Sort by</label>
          <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="shop-filters" role="tablist" aria-label="Filter by category">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
            <span className="filter-count">
              {cat === 'All' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      <div className="shop-results">
        <span className="results-count">{filtered.length} design{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="shop-empty">
          <h2>No designs found</h2>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <div className="shop-grid">
          {filtered.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="shop-card">
              <div className="shop-card-media">
                {product.image && !imageErrors[product.id] ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={() => setImageErrors((prev) => ({ ...prev, [product.id]: true }))}
                  />
                ) : (
                  <div className="shop-card-fallback">
                    <span>{product.name.charAt(0)}</span>
                  </div>
                )}
                <span className="shop-card-cat">{product.category}</span>
              </div>
              <div className="shop-card-body">
                <h3>{product.name}</h3>
                <div className="shop-card-meta">
                  <span>{product.material}</span>
                  <span>{product.layerHeight}</span>
                  <span>{product.printTime}</span>
                </div>
                <div className="shop-card-foot">
                  <span className="shop-card-price">{product.price}</span>
                  <span className="shop-card-cta">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
