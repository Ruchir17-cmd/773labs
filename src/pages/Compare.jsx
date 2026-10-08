import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS, CATEGORIES } from '../data/products.js'

export default function Compare() {
  const [selected, setSelected] = useState([])
  const [imageErrors, setImageErrors] = useState({})

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Compare Designs · 773 Labs'
    return () => { document.title = '773 Labs' }
  }, [])

  const toggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const selectedProducts = selected.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)

  return (
    <main className="page compare-page">
      <div className="page-head">
        <div className="page-kicker">Product Comparison</div>
        <h1>Side by <em>side</em></h1>
        <p className="page-lede">
          Select up to 4 designs to compare their material, layer height, print time, and price
          — all in one view.
        </p>
      </div>

      <div className="compare-select">
        <div className="compare-select-head">
          <h2>Select designs to compare</h2>
          <span>{selected.length}/4 selected</span>
        </div>
        <div className="compare-chips">
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              className={`compare-chip ${selected.includes(p.id) ? 'active' : ''}`}
              onClick={() => toggle(p.id)}
              aria-pressed={selected.includes(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="compare-label-col">Specification</th>
                {selectedProducts.map((p) => (
                  <th key={p.id}>
                    <Link to={`/product/${p.id}`} className="compare-product-link">
                      <div className="compare-thumb">
                        {p.image && !imageErrors[p.id] ? (
                          <img src={p.image} alt={p.name} onError={() => setImageErrors((prev) => ({ ...prev, [p.id]: true }))} />
                        ) : (
                          <div className="compare-thumb-fallback">{p.name.charAt(0)}</div>
                        )}
                      </div>
                      <span>{p.name}</span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="compare-label">Category</td>
                {selectedProducts.map((p) => <td key={p.id}>{p.category}</td>)}
              </tr>
              <tr>
                <td className="compare-label">Material</td>
                {selectedProducts.map((p) => <td key={p.id}>{p.material}</td>)}
              </tr>
              <tr>
                <td className="compare-label">Layer height</td>
                {selectedProducts.map((p) => <td key={p.id}>{p.layerHeight}</td>)}
              </tr>
              <tr>
                <td className="compare-label">Print time</td>
                {selectedProducts.map((p) => <td key={p.id}>{p.printTime}</td>)}
              </tr>
              <tr>
                <td className="compare-label">Price</td>
                {selectedProducts.map((p) => <td key={p.id} className="compare-price">{p.price}</td>)}
              </tr>
              <tr>
                <td className="compare-label">Action</td>
                {selectedProducts.map((p) => (
                  <td key={p.id}>
                    <Link to={`/product/${p.id}`} className="btn btn-outline btn-sm">View design</Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {selectedProducts.length === 0 && (
        <div className="compare-empty">
          <h2>No designs selected</h2>
          <p>Click on the chips above to add designs to the comparison table.</p>
        </div>
      )}
    </main>
  )
}
