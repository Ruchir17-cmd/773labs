import { useMemo, useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import { waLink, trackSend, buildQuoteMessage, buildGeneralMessage } from '../data/whatsapp.js'

const PROJECTS = [
  { id: 'functional', label: 'Functional part', note: 'Brackets, adapters, replacements', icon: '01' },
  { id: 'prop', label: 'Prop or cosplay', note: 'Wearables, replicas, costume parts', icon: '02' },
  { id: 'model', label: 'Model or miniature', note: 'Characters, terrain, display pieces', icon: '03' },
  { id: 'decor', label: 'Decor or gift', note: 'Objects for home, desk, or gifting', icon: '04' },
]

const SIZES = [
  { id: 'small', label: 'Small', note: 'Under 10 cm', price: 450 },
  { id: 'medium', label: 'Medium', note: '10 - 20 cm', price: 950 },
  { id: 'large', label: 'Large', note: '20 - 35 cm', price: 1850 },
  { id: 'xl', label: 'Oversized', note: 'Over 35 cm / multi-part', price: 3200 },
]

const MATERIALS = [
  { id: 'pla', label: 'PLA', note: 'Clean detail, best value', multiplier: 1 },
  { id: 'petg', label: 'PETG', note: 'Tough and weather-resistant', multiplier: 1.18 },
  { id: 'abs', label: 'ABS', note: 'Heat-resistant engineering plastic', multiplier: 1.3 },
  { id: 'resin', label: 'Resin', note: 'Highest detail for models', multiplier: 1.45 },
  { id: 'unsure', label: 'You choose', note: 'Let 773 Labs recommend', multiplier: 1.08 },
]

const initialState = { project: '', size: '', material: 'unsure', quantity: 1, name: '', details: '', deadline: '' }

function formatPrice(value) {
  return `Rs. ${Math.round(value).toLocaleString('en-IN')}`
}

export default function Quote() {
  const [fields, setFields] = useState(initialState)
  const [step, setStep] = useState(0)

  const update = (key, value) => setFields((current) => ({ ...current, [key]: value }))
  const project = PROJECTS.find((item) => item.id === fields.project)
  const size = SIZES.find((item) => item.id === fields.size)
  const material = MATERIALS.find((item) => item.id === fields.material)
  const quantity = Math.max(1, Number(fields.quantity) || 1)
  const estimate = useMemo(() => {
    if (!size || !material) return null
    const unit = size.price * material.multiplier
    const discount = quantity >= 25 ? 0.8 : quantity >= 10 ? 0.88 : quantity >= 5 ? 0.94 : 1
    const setup = quantity > 1 ? 350 : 0
    const total = (unit * quantity * discount) + setup
    return { low: total * 0.88, high: total * 1.12, unit: total / quantity }
  }, [size, material, quantity])

  const message = useMemo(() => buildQuoteMessage({
    name: fields.name,
    details: fields.details,
    material: material?.label || 'You choose',
    quantity,
    deadline: fields.deadline,
    projectType: project?.label,
    size: size?.label,
    estimate: estimate ? `${formatPrice(estimate.low)} - ${formatPrice(estimate.high)}` : '',
  }), [fields, material, quantity, project, size, estimate])

  const complete = step === 4

  function choose(key, value) {
    update(key, value)
    setStep((current) => current + 1)
  }

  function handleSubmit(event) {
    event.preventDefault()
    trackSend('custom quote agent', message)()
    window.open(waLink(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="quote" className="quote-page agent-page">
      <div className="wrap">
        <Reveal className="agent-intro">
          <div>
            <div className="eyebrow">Quote agent / online now</div>
            <h1>Turn an idea into a<br /><em>printable plan.</em></h1>
            <p>Answer four quick questions. I will recommend a material, calculate a working estimate, and prepare your brief for the 773 Labs team.</p>
          </div>
          <div className="agent-status"><span className="status-dot"></span> 773 QUOTE AGENT <small>v1.0</small></div>
        </Reveal>

        <Reveal className="agent-shell">
          <div className="agent-chat">
            <div className="chat-top"><span className="agent-avatar">773</span><div><b>Print planner</b><small>Guided estimate for your project</small></div><span className="live-pill">LIVE</span></div>
            <div className="chat-body">
              <div className="agent-message"><span className="message-label">PRINT PLANNER</span>Let&apos;s scope this properly. What are we making?</div>

              {step >= 1 && project && <div className="user-choice">{project.label}</div>}
              {step === 0 && <div className="choice-grid">{PROJECTS.map((item) => <button key={item.id} type="button" className="choice-card" onClick={() => choose('project', item.id)}><span>{item.icon}</span><b>{item.label}</b><small>{item.note}</small></button>)}</div>}

              {step >= 1 && <div className="agent-message"><span className="message-label">PRINT PLANNER</span>How big is the finished piece? This helps me estimate print time and material.</div>}
              {step === 1 && <div className="choice-grid size-grid">{SIZES.map((item) => <button key={item.id} type="button" className="choice-card" onClick={() => choose('size', item.id)}><b>{item.label}</b><small>{item.note}</small></button>)}</div>}

              {step >= 2 && size && <div className="user-choice">{size.label} / {size.note}</div>}
              {step >= 2 && <div className="agent-message"><span className="message-label">PRINT PLANNER</span>Which material sounds right? If you&apos;re unsure, I&apos;ll make the call from the use case.</div>}
              {step === 2 && <div className="choice-grid material-grid">{MATERIALS.map((item) => <button key={item.id} type="button" className="choice-card" onClick={() => choose('material', item.id)}><b>{item.label}</b><small>{item.note}</small></button>)}</div>}

              {step >= 3 && material && <div className="user-choice">{material.label} / {material.note}</div>}
              {step >= 3 && <div className="agent-message"><span className="message-label">PRINT PLANNER</span>Last details. Tell me how many you need and what the part should do.</div>}
              {step === 3 && <form className="agent-form" onSubmit={(event) => { event.preventDefault(); setStep(4) }}><div className="form-row"><div className="field"><label htmlFor="agent-quantity">Quantity</label><input id="agent-quantity" type="number" min="1" value={fields.quantity} onChange={(event) => update('quantity', event.target.value)} /></div><div className="field"><label htmlFor="agent-name">Your name</label><input id="agent-name" required value={fields.name} onChange={(event) => update('name', event.target.value)} /></div></div><div className="field"><label htmlFor="agent-details">The brief</label><textarea id="agent-details" required placeholder="Dimensions, what it needs to do, or a link to your file..." value={fields.details} onChange={(event) => update('details', event.target.value)} /></div><div className="field"><label htmlFor="agent-deadline">Needed by (optional)</label><input id="agent-deadline" type="date" value={fields.deadline} onChange={(event) => update('deadline', event.target.value)} /></div><button className="btn btn-primary agent-next" type="submit">Build my estimate <span>→</span></button></form>}

              {complete && <><div className="user-choice">{fields.name}&apos;s {project?.label.toLowerCase()} / {quantity} unit{quantity > 1 ? 's' : ''}</div><div className="agent-message final-message"><span className="message-label">ESTIMATE READY</span>Based on your brief, here&apos;s a sensible starting point. The team will confirm this against your file before printing.<div className="estimate-inline"><small>WORKING RANGE</small><strong>{formatPrice(estimate.low)} - {formatPrice(estimate.high)}</strong><span>Material: {material.label} &nbsp; · &nbsp; approx. {quantity} unit{quantity > 1 ? 's' : ''}</span></div></div><button className="btn btn-whatsapp agent-submit" type="button" onClick={handleSubmit}>Send brief to 773 Labs <span>↗</span></button><button className="start-over" type="button" onClick={() => { setFields(initialState); setStep(0) }}>Start another quote</button></>}
            </div>
          </div>

          <aside className="estimate-panel"><div className="panel-kicker">LIVE ESTIMATE</div><div className="estimate-total">{estimate ? <><small>EXPECTED RANGE</small><strong>{formatPrice(estimate.low)}</strong><b>to {formatPrice(estimate.high)}</b></> : <><strong>--</strong><span>Answer the prompts<br />to unlock pricing</span></>}</div><div className="estimate-lines"><div><span>Project</span><b>{project?.label || 'Not selected'}</b></div><div><span>Scale</span><b>{size?.label || 'Not selected'}</b></div><div><span>Material</span><b>{material?.label || 'Recommended'}</b></div><div><span>Quantity</span><b>{quantity} unit{quantity > 1 ? 's' : ''}</b></div></div><div className="estimate-note">Includes print time and material. Finishing, complex supports, shipping, and design help are confirmed separately.</div><div className="progress-label"><span>PROJECT SCAN</span><b>{Math.min(step, 4)}/4</b></div><div className="progress-track"><span style={{ width: `${Math.min(step, 4) * 25}%` }}></span></div></aside>
        </Reveal>
        <p className="agent-footnote">No file yet? That&apos;s fine. Start with the idea and share photos or a model link with the team on WhatsApp.</p>
      </div>
    </section>
  )
}
