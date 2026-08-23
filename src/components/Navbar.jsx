import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { waLink, buildGeneralMessage } from '../data/whatsapp.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header>
      <nav>
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="dot-grid"><span></span><span></span><span></span><span></span></span>
          SHIVESH.3D
        </Link>

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/shop" onClick={() => setOpen(false)}>Shop</NavLink></li>
          <li><NavLink to="/quote" onClick={() => setOpen(false)}>Custom Quote</NavLink></li>
          <li className="nav-links-mobile-cta">
            <a
              className="btn btn-whatsapp"
              href={waLink(buildGeneralMessage())}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              Chat on WhatsApp
            </a>
          </li>
        </ul>

        <a
          className="nav-cta"
          href={waLink(buildGeneralMessage())}
          target="_blank"
          rel="noopener noreferrer"
        >
          Chat on WhatsApp
        </a>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>
    </header>
  )
}
