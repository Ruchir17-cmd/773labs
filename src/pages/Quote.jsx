import { useMemo, useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import { waLink, buildQuoteMessage, buildGeneralMessage } from '../data/whatsapp.js'

const initialState = {
  name: '',
  details: '',
  material: 'Not sure — advise me',
  quantity: 1,
  deadline: '',
}

const PROJECT_TYPES = [
  'Prop / Cosplay part',
  'Miniature / Figurine',
  'Functional / Replacement part',
  'Decor / Gift',
  'Something else',
]

const MATERIAL_GUIDE = {
  PLA: 'Easy to print, great detail. Best for decorative pieces, miniatures, and display models.',
  PETG: 'Tough and weather-resistant. Best for functional parts, brackets, and outdoor use.',
  ABS: 'Heat-resistant and strong. Best for parts that take a beating — tools, car mounts, props.',
  TPU: 'Flexible rubber-like. Best for grips, phone cases, cushions, and wearables.',
  Nylon: 'Extremely durable engineering filament. Best for gears and high-stress mechanical parts.',
  Resin: 'Ultra-fine detail. Best for miniatures, characters, jewelry, and precision work.',
}

const TIMELINE_STEPS = [
  {
    num: '01',
    title: 'You send the brief',
    text: 'This form opens WhatsApp with everything filled in — add photos or file links in the chat.',
  },
  {
    num: '02',
    title: 'Shivesh replies with a price',
    text: 'Final quote, timeline, and material options — usually within 24 hours.',
  },
  {
    num: '03',
    title: 'Printed & shipped',
    text: 'Once confirmed, your part is printed, checked, packed, and on its way.',
  },
]

export default function Quote() {
  const [fields, setFields] = useState(initialState)
  const [projectType, setProjectType] = useState('')

  function update(key, value) {
    setFields((f) => ({ ...f, [key]: value }))
  }

  const message = useMemo(
    () => buildQuoteMessage({ ...fields, projectType }),
    [fields, projectType]
  )
  const hasContent = fields.name.trim() !== '' || fields.details.trim() !== ''

  function handleSubmit(e) {
    e.preventDefault()
    window.open(waLink(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="quote" className="quote-page">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <div className="eyebrow">Custom quote</div>
            <h2>Tell Shivesh what you need</h2>
          </div>
          <p>Fill this in and it opens WhatsApp with everything filled out — just hit send.</p>
        </Reveal>

        <Reveal className="contact-wrap">
          <div className="contact-info">
            <p>No forms going into a void — everything goes straight to Shivesh's WhatsApp, and you'll normally hear back within 24 hours.</p>
            <div className="contact-detail"><b>WhatsApp</b> +91 62604 28896</div>
            <div className="contact-detail"><b>Response time</b> usually within 24 hours</div>
            <a
              className="btn btn-whatsapp quote-direct"
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
              <label>Project type</label>
              <div className="chip-row">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`chip ${projectType === type ? 'active' : ''}`}
                    onClick={() => setProjectType((t) => (t === type ? '' : type))}
                  >
                    {type}
                  </button>
                ))}
              </div>
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
                <p className="material-hint" aria-live="polite">
                  {MATERIAL_GUIDE[fields.material] ||
                    'No idea which to pick? Leave this as-is and Shivesh will recommend one based on your project.'}
                </p>
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

            <div className={`wa-preview ${hasContent ? '' : 'empty'}`}>
              <div className="wa-preview-label">What you'll send</div>
              {hasContent ? (
                <div className="wa-bubble">{message}</div>
              ) : (
                <div className="wa-bubble wa-bubble-placeholder">
                  Your message preview will appear here as you type…
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary quote-submit">
              Continue on WhatsApp →
            </button>
          </form>
        </Reveal>

        <Reveal className="quote-timeline">
          {TIMELINE_STEPS.map((step) => (
            <div key={step.num} className="qt-step">
              <span className="qt-num">{step.num}</span>
              <div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
