import { useState } from 'react'
import Icon from './Icon.jsx'
import ProductModal from './ProductModal.jsx'
import { waLink, trackSend, buildOrderMessage } from '../data/whatsapp.js'

export default function ProductCard({ product }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="product-card clickable"
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target === e.currentTarget) setOpen(true)
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.name}`}
    >
      <div className="product-visual blueprint-bg">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
        ) : (
          <Icon name={product.icon} />
        )}
      </div>
      <div className="product-meta">
        <div className="product-cat">{product.category}</div>
        <h3>{product.name}</h3>
        <div className="work-tags">
          <span>{product.material}</span>
          <span>{product.layerHeight} layers</span>
          <span>{product.printTime} print</span>
        </div>
        <div className="product-footer">
          <span className="product-price">{product.price}</span>
          <a
            className="btn btn-whatsapp"
            href={waLink(buildOrderMessage(product))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation()
              trackSend('order', buildOrderMessage(product))()
            }}
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
      {open && <ProductModal product={product} onClose={() => setOpen(false)} />}
    </div>
  )
}
