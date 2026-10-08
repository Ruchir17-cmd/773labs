import { useEffect, useState } from 'react'

const ORDER_STAGES = [
  { key: 'placed', label: 'Order placed', desc: 'We have received your order and confirmed the details.' },
  { key: 'printing', label: 'Printing', desc: 'Your design is on the printer — layer by layer.' },
  { key: 'post', label: 'Post-processing', desc: 'Sanding, priming, painting, or assembly as needed.' },
  { key: 'qc', label: 'Quality check', desc: 'Final inspection before it leaves the lab.' },
  { key: 'shipped', label: 'Shipped', desc: 'Handed to our courier partner. Tracking number assigned.' },
  { key: 'delivered', label: 'Delivered', desc: 'Package delivered. Enjoy your print!' },
]

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Track Order · 773 Labs'
    return () => { document.title = '773 Labs' }
  }, [])

  const handleTrack = (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    const id = orderId.trim()
    if (!id) {
      setError('Please enter an order ID.')
      return
    }

    // Simulated lookup — in production this would hit an API
    const mockOrders = {
      '773-001': { stage: 2, eta: '2 days', carrier: 'Delhivery', tracking: 'DL123456789IN' },
      '773-002': { stage: 4, eta: '1 day', carrier: 'BlueDart', tracking: 'BD987654321IN' },
      '773-003': { stage: 5, eta: 'Delivered', carrier: 'DTDC', tracking: 'DT555123456IN' },
    }

    const order = mockOrders[id.toUpperCase()]
    if (order) {
      setResult({ id: id.toUpperCase(), ...order })
    } else {
      setError('Order not found. Check the ID and try again, or contact us on WhatsApp.')
    }
  }

  return (
    <main className="page track-page">
      <div className="page-head">
        <div className="page-kicker">Order Tracking</div>
        <h1>Where&apos;s my <em>print?</em></h1>
        <p className="page-lede">
          Enter your order ID to see the current status of your print — from the first layer
          to your doorstep.
        </p>
      </div>

      <form className="track-form" onSubmit={handleTrack}>
        <div className="track-input-group">
          <input
            type="text"
            placeholder="Enter order ID (e.g. 773-001)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            aria-label="Order ID"
          />
          <button type="submit" className="btn btn-whatsapp">Track</button>
        </div>
        <p className="track-hint">Try demo IDs: 773-001, 773-002, 773-003</p>
      </form>

      {error && <div className="track-error">{error}</div>}

      {result && (
        <div className="track-result">
          <div className="track-summary">
            <div className="track-summary-row">
              <span>Order ID</span>
              <strong>{result.id}</strong>
            </div>
            <div className="track-summary-row">
              <span>Carrier</span>
              <strong>{result.carrier}</strong>
            </div>
            <div className="track-summary-row">
              <span>Tracking number</span>
              <strong>{result.tracking}</strong>
            </div>
            <div className="track-summary-row">
              <span>Estimated delivery</span>
              <strong>{result.eta}</strong>
            </div>
          </div>

          <div className="track-timeline">
            {ORDER_STAGES.map((stage, i) => {
              const isDone = i <= result.stage
              const isCurrent = i === result.stage
              return (
                <div key={stage.key} className={`track-stage ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="track-dot">
                    {isDone && !isCurrent && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    {isCurrent && <span className="track-pulse" />}
                  </div>
                  <div className="track-stage-info">
                    <h3>{stage.label}</h3>
                    <p>{stage.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}
