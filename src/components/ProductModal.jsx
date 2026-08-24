import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import { waLink, buildOrderMessage } from '../data/whatsapp.js'

export default function ProductModal({ product, onClose }) {
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`modal ${zoomed ? 'zoomed' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close details">
          ×
        </button>

        {product.image ? (
          <div className="modal-visual blueprint-bg" onClick={() => setZoomed((z) => !z)}>
            <img src={product.image} alt={product.name} />
            <span className="zoom-hint">{zoomed ? 'Click to shrink' : 'Click to zoom'}</span>
          </div>
        ) : (
          <div className="modal-visual modal-visual-icon blueprint-bg">
            <Icon name={product.icon} />
          </div>
        )}

        <div className="modal-info">
          <div className="product-cat">{product.category}</div>
          <h3>{product.name}</h3>
          <dl className="spec-list">
            <div>
              <dt>Material</dt>
              <dd>{product.material}</dd>
            </div>
            <div>
              <dt>Layer height</dt>
              <dd>{product.layerHeight}</dd>
            </div>
            <div>
              <dt>Print time</dt>
              <dd>{product.printTime}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd className="accent">{product.price}</dd>
            </div>
          </dl>
          <p className="modal-note">
            Final price depends on size, infill, and quantity. Message Shivesh to confirm the
            details before ordering.
          </p>
          <a
            className="btn btn-whatsapp"
            href={waLink(buildOrderMessage(product))}
            target="_blank"
            rel="noopener noreferrer"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
