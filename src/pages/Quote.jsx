import { useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import { waLink, buildQuoteMessage, buildGeneralMessage } from '../data/whatsapp.js'

const initialState = {
  name: '',
  details: '',
  material: 'Not sure — advise me',
  quantity: 1,
  deadline: '',
}

export default function Quote() {
  const [fields, setFields] = useState(initialState)

  function update(key, value) {
    setFields((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const link = waLink(buildQuoteMessage(fields))
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="quote" className="quote-page">
      <div className="wrap">
        <Reveal className="contact-wrap">
          <div className="contact-info">
            <div className="eyebrow">Custom quote</div>
            <h2 className="quote-heading">Tell Shivesh what you need</h2>
            <p>Fill this in and it opens WhatsApp with everything filled out — just hit send. Or skip the form and message directly.</p>
            <div className="contact-detail"><b>WhatsApp</b> +91 62604 28896</div>
            <div className="contact-detail"><b>Response time</b> usually within 24 hours</div>
            <a
              className="btn btn-whatsapp"
              style={{ marginTop: '18px', display: 'inline-flex' }}
              href={waLink(buildGeneralMessage())}
              target="_blank"
              rel="noopener noreferrer"
            >
              Skip the form — chat directly
            </a>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                required
                value={fields.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="details">Project details</label>
              <textarea
                id="details"
                placeholder="What are you looking to get printed? Add a link to a file or reference image if you have one."
                required
                value={fields.details}
                onChange={(e) => update('details', e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="material">Material preference</label>
                <select
                  id="material"
                  value={fields.material}
                  onChange={(e) => update('material', e.target.value)}
                >
                  <option>Not sure — advise me</option>
                  <option>PLA</option>
                  <option>PETG</option>
                  <option>ABS</option>
                  <option>TPU</option>
                  <option>Nylon</option>
                  <option>Resin</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={fields.quantity}
                  onChange={(e) => update('quantity', e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="deadline">Deadline (optional)</label>
              <input
                type="date"
                id="deadline"
                value={fields.deadline}
                onChange={(e) => update('deadline', e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
              Continue on WhatsApp →
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
