import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon.jsx'
import { waLink, trackSend, buildOrderMessage } from '../data/whatsapp.js'

export default function ProductModal({ product, onClose }) {
  const [zoomed, setZoomed] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const gallery = product.gallery?.length ? product.gallery : product.image ? [product.image] : []
  const [activeImage, setActiveImage] = useState(gallery[0])
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [])

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCloseRef.current()
      }}
      role="presentation"
    >
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

        {activeImage && !imageFailed ? (
          <div className="modal-media">
            <div className="modal-visual blueprint-bg" onClick={() => setZoomed((z) => !z)}>
              <img src={activeImage} alt={product.name} onError={() => setImageFailed(true)} />
              <span className="zoom-hint">{zoomed ? 'Click to shrink' : 'Click to zoom'}</span>
            </div>
            {gallery.length > 1 && (
              <div className="modal-thumbnails" aria-label="Product photos">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    className={`modal-thumbnail ${activeImage === image ? 'active' : ''}`}
                    onClick={() => {
                      setActiveImage(image)
                      setImageFailed(false)
                      setZoomed(false)
                    }}
                    aria-label={`View product photo ${index + 1}`}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
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
          {product.offer && (
            <details className="offer-details">
              <summary><span className="product-offer-mark" aria-hidden="true">+</span>What&apos;s included?</summary>
              <div className="offer-details-body">
                <p>{product.name}</p>
                <p>OpenCode Go AI access</p>
                <p>Premium coding models: {product.offer.models.join(' · ')}</p>
              </div>
            </details>
          )}
          <p className="modal-note">
            Final price depends on size, infill, and quantity. Message 773 Labs to confirm the
            details before ordering.
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
      </div>
    </div>,
    document.body
  )
}
