import { useEffect, useState } from 'react'

// This number is used ONLY when a report is submitted — never rendered on the page.
const BUG_BOUNTY_PHONE = '9289531701'

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical']

export default function BugBounty() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    severity: 'Medium',
    affected: '',
    steps: '',
    expected: '',
    actual: '',
    impact: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Bug Bounty · 773 Labs'
    return () => { document.title = '773 Labs' }
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = [
      'Hi 773 Labs! Bug bounty report.',
      '',
      `Reporter: ${form.name}`,
      form.email ? `Email: ${form.email}` : null,
      form.phone ? `Phone: ${form.phone}` : null,
      '',
      `Title: ${form.title}`,
      `Severity: ${form.severity}`,
      form.affected ? `Affected area/URL: ${form.affected}` : null,
      '',
      'Steps to reproduce:',
      form.steps || '-',
      '',
      form.expected ? `Expected behaviour: ${form.expected}` : null,
      form.actual ? `Actual behaviour: ${form.actual}` : null,
      form.impact ? `Impact: ${form.impact}` : null,
      '',
      'Submitted via 773 Labs Bug Bounty page.',
    ].filter(Boolean).join('\n')

    const url = `https://wa.me/${BUG_BOUNTY_PHONE}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  return (
    <main className="page bug-bounty-page">
      <div className="page-head">
        <div className="page-kicker">Bug Bounty</div>
        <h1>Found a bug? <em>Report it.</em></h1>
        <p className="page-lede">
          Help us make 773 Labs safer and better. Submit any bug, glitch, or security
          issue you discover on the website and we&apos;ll review it. Valid reports may
          earn a reward.
        </p>
      </div>

      <section className="sell-form-section">
        <div className="sell-form-head">
          <h2>Submit a report</h2>
          <p>Provide as much detail as you can. Your report is sent directly to our team for review.</p>
        </div>
        <form className="quote-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="b-name">Your name *</label>
              <input id="b-name" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
            </div>
            <div className="form-field">
              <label htmlFor="b-email">Email *</label>
              <input id="b-email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="b-phone">Phone (optional)</label>
              <input id="b-phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 …" />
            </div>
            <div className="form-field">
              <label htmlFor="b-severity">Severity *</label>
              <select id="b-severity" name="severity" value={form.severity} onChange={handleChange} required>
                {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="b-title">Bug title *</label>
            <input id="b-title" name="title" value={form.title} onChange={handleChange} required placeholder="Short summary of the issue" />
          </div>
          <div className="form-field">
            <label htmlFor="b-affected">Affected page / URL</label>
            <input id="b-affected" name="affected" value={form.affected} onChange={handleChange} placeholder="e.g. /shop, product page…" />
          </div>
          <div className="form-field">
            <label htmlFor="b-steps">Steps to reproduce *</label>
            <textarea id="b-steps" name="steps" value={form.steps} onChange={handleChange} rows={4} required placeholder="1. Go to…\n2. Click…\n3. Observe…" />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="b-expected">Expected behaviour</label>
              <textarea id="b-expected" name="expected" value={form.expected} onChange={handleChange} rows={3} placeholder="What should have happened" />
            </div>
            <div className="form-field">
              <label htmlFor="b-actual">Actual behaviour</label>
              <textarea id="b-actual" name="actual" value={form.actual} onChange={handleChange} rows={3} placeholder="What actually happened" />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="b-impact">Impact / why it matters</label>
            <textarea id="b-impact" name="impact" value={form.impact} onChange={handleChange} rows={3} placeholder="Who is affected and how" />
          </div>
          <button type="submit" className="btn btn-whatsapp">Submit report</button>
          {submitted && (
            <p className="track-hint">
              Report opened in WhatsApp. If it didn&apos;t open, please try again. Thank you!
            </p>
          )}
        </form>
      </section>
    </main>
  )
}