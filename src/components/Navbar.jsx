import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { waLink, buildGeneralMessage } from '../data/whatsapp.js'

const NAV_LINKS = [
  { to: '/', label: 'Studio' },
  { to: '/printers', label: 'Printers' },
  { to: '/order', label: 'Order' },
  { to: '/vulnerability', label: 'Vulnerability' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="nav-logo-mark">773</span>
          <span className="nav-logo-text">LABS</span>
        </Link>

        <nav className={`nav-links ${open ? 'is-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <a className="nav-cta" href={waLink(buildGeneralMessage())} target="_blank" rel="noreferrer">
          Contact
        </a>

        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
