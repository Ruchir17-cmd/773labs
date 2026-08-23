import { Link } from 'react-router-dom'
import { waLink, buildGeneralMessage, WHATSAPP_PHONE } from '../data/whatsapp.js'

export default function Footer() {
  const displayPhone = '+91 62604 28896'

  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div>
            <Link to="/" className="brand">
              <span className="dot-grid"><span></span><span></span><span></span><span></span></span>
              SHIVESH.3D
            </Link>
            <p className="footer-tagline">Custom 3D printed designs, made to order — browse the catalog and order straight on WhatsApp.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Site</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/quote">Custom Quote</Link></li>
              </ul>
            </div>
            <div>
              <h4>Connect</h4>
              <ul>
                <li>
                  <a href={waLink(buildGeneralMessage())} target="_blank" rel="noopener noreferrer">
                    WhatsApp — {displayPhone}
                  </a>
                </li>
                <li><a href="#">Instagram</a></li>
                <li><a href="mailto:hello@shivesh3d.studio">Email</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Shivesh.3D — all designs printed to order.</span>
          <span>Orders handled on WhatsApp</span>
        </div>
      </div>
    </footer>
  )
}
