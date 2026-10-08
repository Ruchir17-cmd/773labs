import { useEffect, useState } from 'react'
import { waLink, trackSend, buildQuoteMessage } from '../data/whatsapp.js'

const SERVICES = [
  {
    id: '3d-print-assembly',
    name: '3D Printer Assembly Service',
    price: '₹2,499',
    description: 'Get your 3D printer assembled, calibrated, and tested by our technicians. We unbox, build, level, and run a test print so you can start printing from day one.',
    features: ['Full assembly & calibration', 'Bed leveling & nozzle tuning', 'Test print included', '15-minute walkthrough'],
    icon: 'printer',
  },
  {
    id: 'rapid-prototyping',
    name: 'Rapid Prototyping',
    price: 'From ₹499',
    description: 'Turn your CAD model or sketch into a physical prototype within days. Ideal for product designers, engineers, and startups validating ideas before production.',
    features: ['2–5 day turnaround', 'PLA, PETG, ABS, Nylon, TPU', 'Up to 300mm build volume', 'Design feedback included'],
    icon: 'cube',
  },
  {
    id: 'custom-design',
    name: 'Custom 3D Design & Modelling',
    price: 'From ₹999',
    description: 'Have an idea but no 3D file? Our designers will model your concept in CAD, prepare it for printing, and deliver both the file and the printed part.',
    features: ['Concept to CAD', 'Print-ready files', '2 revision rounds', 'STL / STEP delivery'],
    icon: 'pencil',
  },
  {
    id: 'batch-printing',
    name: 'Batch & Production Printing',
    price: 'Custom quote',
    description: 'Need 10, 50, or 500 copies? We run multiple printers in parallel for consistent, repeatable batch production with quality checks at every stage.',
    features: ['Volume discounts', 'Consistent quality', 'Packaging included', 'PAN India delivery'],
    icon: 'layers',
  },
  {
    id: 'post-processing',
    name: 'Post-Processing & Finishing',
    price: 'From ₹199',
    description: 'Sanding, priming, painting, smoothing, and assembly. We take your raw print and turn it into a finished piece ready for display or use.',
    features: ['Sanding & priming', 'Custom painting', 'Acetone smoothing', 'Part assembly'],
    icon: 'sparkle',
  },
  {
    id: 'scanner-service',
    name: '3D Scanning & Reverse Engineering',
    price: 'From ₹1,499',
    description: 'Digitise real-world objects into editable 3D models. Useful for replacement parts, custom fits, and archival documentation.',
    features: ['High-res scanning', 'Mesh cleanup', 'CAD conversion', 'STL / OBJ delivery'],
    icon: 'scan',
  },
]

const PROJECT_TYPES = ['Prototype', 'Product', 'Art / Sculpture', 'Replacement Part', 'Other']

export default function Services() {
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ name: '', projectType: '', size: '', details: '', material: '', quantity: '', deadline: '', estimate: '' })

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Prototyping Services · 773 Labs'
    return () => { document.title = '773 Labs' }
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = buildQuoteMessage(form)
    window.open(waLink(message), '_blank', 'noopener,noreferrer')
    trackSend('service-quote', message)()
  }

  return (
    <main className="page services-page">
      <div className="page-head">
        <div className="page-kicker">Prototyping & Services</div>
        <h1>From idea to <em>object</em></h1>
        <p className="page-lede">
          On-demand prototyping and rapid manufacturing services to assist your projects.
          Order a service and we&apos;ll get back to you with a confirmed quote.
        </p>
      </div>

      <div className="services-grid">
        {SERVICES.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-icon" aria-hidden="true">
              <ServiceIcon name={service.icon} />
            </div>
            <div className="service-info">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <ul className="service-features">
                {service.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="service-foot">
                <span className="service-price">{service.price}</span>
                <button className="btn btn-outline" onClick={() => { setSelected(service); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  Get a quote
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <section className="quote-section" id="quote-form">
          <div className="quote-head">
            <h2>Request a quote</h2>
            <p>Filling this for: <strong>{selected.name}</strong> — tell us about your project and we&apos;ll confirm pricing and timeline.</p>
          </div>
          <form className="quote-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="q-name">Your name *</label>
                <input id="q-name" name="name" value={form.name} onChange={handleChange} required placeholder="Full name" />
              </div>
              <div className="form-field">
                <label htmlFor="q-type">Project type</label>
                <select id="q-type" name="projectType" value={form.projectType} onChange={handleChange}>
                  <option value="">Select…</option>
                  {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="q-size">Approximate size</label>
                <input id="q-size" name="size" value={form.size} onChange={handleChange} placeholder="e.g. 100 × 50 × 30 mm" />
              </div>
              <div className="form-field">
                <label htmlFor="q-material">Material preference</label>
                <input id="q-material" name="material" value={form.material} onChange={handleChange} placeholder="PLA, PETG, ABS…" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="q-qty">Quantity</label>
                <input id="q-qty" name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 1, 5, 10…" />
              </div>
              <div className="form-field">
                <label htmlFor="q-deadline">Needed by</label>
                <input id="q-deadline" name="deadline" value={form.deadline} onChange={handleChange} placeholder="e.g. Next week" />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="q-details">Project details *</label>
              <textarea id="q-details" name="details" value={form.details} onChange={handleChange} required rows={4} placeholder="Describe what you need — shape, function, references…" />
            </div>
            <div className="form-field">
              <label htmlFor="q-estimate">Working estimate (optional)</label>
              <input id="q-estimate" name="estimate" value={form.estimate} onChange={handleChange} placeholder="Your budget range" />
            </div>
            <button type="submit" className="btn btn-whatsapp">Send via WhatsApp</button>
          </form>
        </section>
      )}
    </main>
  )
}

function ServiceIcon({ name }) {
  const icons = {
    printer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
    cube: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    pencil: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
    layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    sparkle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
    scan: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/></svg>,
  }
  return icons[name] || icons.cube
}
