import Icon from './Icon.jsx'
import { waLink, buildOrderMessage } from '../data/whatsapp.js'

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-visual blueprint-bg">
        <Icon name={product.icon} />
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
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
