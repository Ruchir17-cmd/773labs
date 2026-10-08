import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Studio' },
  { to: '/shop', label: 'Shop' },
  { to: '/services', label: 'Services' },
  { to: '/b2b', label: 'B2B' },
  { to: '/sell', label: 'Sell on 773' },
  { to: '/track', label: 'Track Order' },
  { to: '/compare', label: 'Compare' },
  { to: '/app', label: 'App' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav-bar">
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

      <button
        className="nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  )
}
