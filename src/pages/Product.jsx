import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PRODUCTS } from '../data/products.js'
import { waLink, trackSend, buildOrderMessage } from '../data/whatsapp.js'

export default function Product() {
  const { id } = useParams()
  const product = PRODUCTS.find((item) => item.id === id)
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setImageFailed(false)
    document.title = product ? `${product.name} · 773 Labs` : 'Design not found · 773 Labs'
    return () => {
      document.title = '773 Labs'
    }
  }, [product])

  if (!product) {
    return (
      <main id="top" className="product-page">
        <div className="product-missing">
          <h1>That design isn&apos;t on the shelf.</h1>
          <p>It may have been renamed or retired. Head back to the lab floor and pick another card.</p>
          <Link className="btn btn-whatsapp" to="/">Back to the lab</Link>
        </div>
      </main>
    )
  }

  const related = PRODUCTS.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)

  return (
    <main id="top" className="product-page">
      <nav className="product-bar">
        <Link to="/" className="product-back">← Back to the lab</Link>
        <span className="product-mark">773 <span>·</span> PRINT STUDIO</span>
      </nav>

      <article className="product-sheet">
        <div className="product-media">
          {product.image && !imageFailed ? (
            <img src={product.image} alt={product.name} onError={() => setImageFailed(true)} />
          ) : (
            <div className="product-media-fallback">
              <span>No photo yet</span>
              <strong>{product.name}</strong>
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-cat">{product.category}</div>
          <h1>{product.name}</h1>
          <p className="product-lede">
            Printed in our lab layer by layer, finished by hand and checked before it leaves the bench.
            Every order is made to order, so the color, scale and finish can be tuned to your setup.
          </p>

          <dl className="product-specs">
            <div><dt>Material</dt><dd>{product.material}</dd></div>
            <div><dt>Layer height</dt><dd>{product.layerHeight}</dd></div>
            <div><dt>Print time</dt><dd>{product.printTime}</dd></div>
            <div><dt>Price</dt><dd className="accent">{product.price}</dd></div>
          </dl>

          <p className="product-note">
            Final price depends on size, infill and quantity. Message the lab and we&apos;ll confirm
            details before printing.
          </p>

          <a
            className="btn btn-whatsapp"
            href={waLink(buildOrderMessage(product))}
            onClick={trackSend('order', buildOrderMessage(product))}
            target="_blank"
            rel="noopener noreferrer"
          >
            Order on WhatsApp
          </a>
        </div>
      </article>

      {related.length > 0 && (
        <section className="product-related">
          <h2>More from {product.category}</h2>
          <ul>
            {related.map((item) => (
              <li key={item.id}>
                <Link to={`/product/${item.id}`}>
                  <span>{item.name}</span>
                  <em>{item.price}</em>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
