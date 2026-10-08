import { useEffect } from 'react'

export default function AppPromo() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Download the App · 773 Labs'
    return () => { document.title = '773 Labs' }
  }, [])

  return (
    <main className="page app-page">
      <div className="app-hero">
        <div className="app-hero-content">
          <div className="page-kicker">Mobile App</div>
          <h1>773 Labs in <em>your pocket</em></h1>
          <p className="page-lede">
            Browse the full catalogue, track orders, and get exclusive app-only deals —
            all from your phone.
          </p>
          <div className="app-buttons">
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="app-store-btn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35Zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27Zm3.35-4.31c.34.27.59.68.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31ZM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49Z"/></svg>
              <span>
                <small>Get it on</small>
                Google Play
              </span>
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="app-store-btn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <span>
                <small>Download on the</small>
                App Store
              </span>
            </a>
          </div>
        </div>
        <div className="app-hero-visual">
          <div className="app-phone">
            <div className="app-phone-screen">
              <div className="app-phone-notch" />
              <div className="app-phone-content">
                <div className="app-phone-header">
                  <span className="app-phone-logo">773</span>
                  <span className="app-phone-icons">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </span>
                </div>
                <div className="app-phone-search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <span>Search designs…</span>
                </div>
                <div className="app-phone-grid">
                  {['Dragon', 'Vase', 'Helmet', 'Planter', 'Chess', 'Lamp'].map((name) => (
                    <div key={name} className="app-phone-card">
                      <div className="app-phone-card-img" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
                <div className="app-phone-nav">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="app-features">
        <h2>App features</h2>
        <div className="app-features-grid">
          <div className="app-feature">
            <h3>Full catalogue access</h3>
            <p>Browse every design, filter by category, and view detailed specs on the go.</p>
          </div>
          <div className="app-feature">
            <h3>Order tracking</h3>
            <p>Real-time status updates from print to delivery — push notifications included.</p>
          </div>
          <div className="app-feature">
            <h3>App-only deals</h3>
            <p>Exclusive discounts and early access to new designs, only for app users.</p>
          </div>
          <div className="app-feature">
            <h3>Quick reorder</h3>
            <p>One-tap reorder for designs you&apos;ve bought before. No need to search again.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
