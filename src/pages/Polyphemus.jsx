import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { PRODUCTS } from '../data/products.js'
import { waLink, trackSend, buildGeneralMessage, buildOrderMessage } from '../data/whatsapp.js'

const initialOrder = { product: null, quantity: 1, name: '', notes: '' }
const initialExternal = { url: '', modelName: '', quantity: 1, material: 'PLA', size: 'medium', name: '', notes: '', fileName: '', licenseConfirmed: false }
const EXTERNAL_SIZES = { small: 450, medium: 950, large: 1850, xl: 3200 }
const EXTERNAL_MATERIALS = { PLA: 1, PETG: 1.18, ABS: 1.3, TPU: 1.12, Resin: 1.45, Nylon: 1.35 }

export default function Polyphemus() {
  const [mode, setMode] = useState('start')
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState(initialOrder)
  const [external, setExternal] = useState(initialExternal)

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase()
    return PRODUCTS.filter((product) => !term || `${product.name} ${product.category}`.toLowerCase().includes(term)).slice(0, 6)
  }, [query])

  const selectProduct = (product) => {
    setOrder((current) => ({ ...current, product }))
    setMode('quantity')
  }

  const reset = () => {
    setOrder(initialOrder)
    setExternal(initialExternal)
    setQuery('')
    setMode('start')
  }

  const orderMessage = order.product
    ? `${buildOrderMessage(order.product)}\n\nQuantity: ${order.quantity}\nName: ${order.name || '-'}${order.notes ? `\nNotes: ${order.notes}` : ''}`
    : ''
  const externalTotal = (EXTERNAL_SIZES[external.size] * EXTERNAL_MATERIALS[external.material] * Math.max(1, Number(external.quantity) || 1)) + 350
  const externalMessage = `Hi 773 Labs! Polyphemus found a community model I would like printed.\n\nModel: ${external.modelName || '-'}\nMakerWorld link: ${external.url}\nFile: ${external.fileName || 'I will attach/share the file separately'}\nMaterial: ${external.material}\nSize: ${external.size}\nQuantity: ${external.quantity}\nName: ${external.name || '-'}${external.notes ? `\nNotes: ${external.notes}` : ''}\n\nWorking estimate: Rs. ${Math.round(externalTotal * 0.88).toLocaleString('en-IN')} - Rs. ${Math.round(externalTotal * 1.12).toLocaleString('en-IN')}\nLicense status: Needs manual verification before printing or sale.`

  function finishOrder(event) {
    event.preventDefault()
    trackSend('polyphemus order', orderMessage)()
    window.open(waLink(orderMessage), '_blank', 'noopener,noreferrer')
  }

  function finishExternal(event) {
    event.preventDefault()
    trackSend('polyphemus community model', externalMessage)()
    window.open(waLink(externalMessage), '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="poly-page">
      <div className="wrap">
        <Reveal className="poly-heading">
          <div>
            <div className="eyebrow poly-eyebrow">Agent / Polyphemus</div>
            <h1>The one-eyed<br /><em>order desk.</em></h1>
            <p>Polyphemus knows the 773 Labs catalog. Ask it to find a design, place an order, or get a human involved.</p>
          </div>
          <Link to="/quote" className="poly-custom-link">Need something new? <b>Use the quote agent →</b></Link>
        </Reveal>

        <Reveal className="poly-window">
          <div className="poly-bar"><div className="poly-orb">P</div><div><b>POLYPHEMUS</b><small>Catalog + order assistant</small></div><span className="poly-online"><i></i> READY</span></div>
          <div className="poly-content">
            <div className="poly-thread">
              <div className="poly-bot"><span className="poly-label">POLYPHEMUS</span>Welcome to the order desk. I can find a design, prepare an order, and route the final confirmation to 773 Labs.</div>

              {mode === 'start' && <div className="poly-actions"><button type="button" onClick={() => setMode('search')}><strong>Find a catalog design</strong><small>Search by name or category</small><span>01</span></button><button type="button" onClick={() => { trackSend('polyphemus support', buildGeneralMessage())(); window.open(waLink('Hi 773 Labs! I need help with an existing order.'), '_blank', 'noopener,noreferrer') }}><strong>Help with an existing order</strong><small>Talk to the 773 Labs team</small><span>02</span></button><Link to="/quote"><strong>Make something custom</strong><small>Start a new print brief</small><span>03</span></Link><button type="button" onClick={() => setMode('makerworld')}><strong>Bring a MakerWorld model</strong><small>Paste a link and request a print</small><span>04</span></button></div>}

              {mode === 'search' && <><div className="poly-bot"><span className="poly-label">POLYPHEMUS</span>What should I look for? Try <b>dragon</b>, <b>mechanical</b>, or the exact design name.</div><div className="poly-search"><input autoFocus type="search" placeholder="Search the 773 Labs catalog..." value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search catalog" /><span>{matches.length} matches</span></div><div className="poly-results">{matches.map((product) => <button type="button" key={product.id} onClick={() => selectProduct(product)}><span className="result-code">{product.id}</span><div><b>{product.name}</b><small>{product.category} / {product.material}</small></div><strong>{product.price}</strong><span className="result-arrow">→</span></button>)}{matches.length === 0 && <p className="poly-empty">No exact match. <Link to="/quote">Ask the quote agent about a custom version.</Link></p>}</div><button type="button" className="poly-back" onClick={reset}>← Start over</button></>}

              {mode === 'quantity' && order.product && <><div className="poly-user">{order.product.name}</div><div className="poly-bot"><span className="poly-label">POLYPHEMUS</span>Good choice. How many should I prepare, and who should I put the order under?</div><form className="poly-order-form" onSubmit={(event) => { event.preventDefault(); setMode('review') }}><div className="form-row"><div className="field"><label htmlFor="poly-quantity">Quantity</label><input id="poly-quantity" type="number" min="1" value={order.quantity} onChange={(event) => setOrder((current) => ({ ...current, quantity: event.target.value }))} /></div><div className="field"><label htmlFor="poly-name">Your name</label><input id="poly-name" required value={order.name} onChange={(event) => setOrder((current) => ({ ...current, name: event.target.value }))} /></div></div><div className="field"><label htmlFor="poly-notes">Order notes (optional)</label><textarea id="poly-notes" placeholder="Color, delivery questions, or anything else..." value={order.notes} onChange={(event) => setOrder((current) => ({ ...current, notes: event.target.value }))} /></div><button className="btn btn-primary" type="submit">Review order <span>→</span></button></form></>}

              {mode === 'makerworld' && <><div className="poly-bot"><span className="poly-label">POLYPHEMUS</span>Bring a model from MakerWorld. I will capture the source, collect print details, and flag the request for license review. I do not download or approve files automatically.</div><form className="poly-order-form poly-community-form" onSubmit={(event) => { event.preventDefault(); setMode('makerworld-review') }}><div className="field"><label htmlFor="maker-url">MakerWorld model link</label><input id="maker-url" type="url" pattern="https://(www\\.)?makerworld\\.com/.*" required placeholder="https://makerworld.com/..." value={external.url} onChange={(event) => setExternal((current) => ({ ...current, url: event.target.value }))} /></div><div className="form-row"><div className="field"><label htmlFor="maker-name">Model name</label><input id="maker-name" placeholder="If known" value={external.modelName} onChange={(event) => setExternal((current) => ({ ...current, modelName: event.target.value }))} /></div><div className="field"><label htmlFor="maker-file">Model file (optional)</label><input id="maker-file" type="file" accept=".stl,.3mf,.obj,.step,.stp" onChange={(event) => setExternal((current) => ({ ...current, fileName: event.target.files[0]?.name || '' }))} /></div></div><div className="form-row"><div className="field"><label htmlFor="maker-material">Material</label><select id="maker-material" value={external.material} onChange={(event) => setExternal((current) => ({ ...current, material: event.target.value }))}>{Object.keys(EXTERNAL_MATERIALS).map((material) => <option key={material}>{material}</option>)}</select></div><div className="field"><label htmlFor="maker-size">Approx. size</label><select id="maker-size" value={external.size} onChange={(event) => setExternal((current) => ({ ...current, size: event.target.value }))}><option value="small">Small / under 10 cm</option><option value="medium">Medium / 10-20 cm</option><option value="large">Large / 20-35 cm</option><option value="xl">Oversized / 35+ cm</option></select></div></div><div className="form-row"><div className="field"><label htmlFor="maker-quantity">Quantity</label><input id="maker-quantity" type="number" min="1" value={external.quantity} onChange={(event) => setExternal((current) => ({ ...current, quantity: event.target.value }))} /></div><div className="field"><label htmlFor="maker-customer">Your name</label><input id="maker-customer" required value={external.name} onChange={(event) => setExternal((current) => ({ ...current, name: event.target.value }))} /></div></div><div className="field"><label htmlFor="maker-notes">Color, finish, or other notes</label><textarea id="maker-notes" placeholder="Black PLA, no supports visible, etc..." value={external.notes} onChange={(event) => setExternal((current) => ({ ...current, notes: event.target.value }))} /></div><label className="license-check"><input type="checkbox" required checked={external.licenseConfirmed} onChange={(event) => setExternal((current) => ({ ...current, licenseConfirmed: event.target.checked }))} /> I understand that 773 Labs must verify the model license before accepting this print request.</label><button className="btn btn-primary" type="submit">Prepare community model request <span>→</span></button></form><button type="button" className="poly-back" onClick={reset}>← Start over</button></>}

              {mode === 'makerworld-review' && <><div className="poly-user">MakerWorld model / {external.quantity} unit{Number(external.quantity) > 1 ? 's' : ''}</div><div className="poly-bot poly-review"><span className="poly-label">REQUEST READY / REVIEW REQUIRED</span>I have prepared the request. The working range is below; 773 Labs will verify the creator&apos;s license and inspect the file before confirming.<div className="order-summary"><div><span>SOURCE</span><b>{external.modelName || 'MakerWorld model'}<br /><small>{external.url}</small></b></div><div><span>PRINT PLAN</span><b>{external.material} / {external.size} / {external.quantity} unit{Number(external.quantity) > 1 ? 's' : ''}</b></div><div><span>WORKING RANGE</span><b>Rs. {Math.round(externalTotal * 0.88).toLocaleString('en-IN')} - Rs. {Math.round(externalTotal * 1.12).toLocaleString('en-IN')}</b></div></div></div><button className="btn btn-whatsapp poly-send" type="button" onClick={finishExternal}>Send to 773 Labs for review <span>↗</span></button><button type="button" className="poly-back" onClick={() => setMode('makerworld')}>← Edit request</button></>}

              {mode === 'review' && order.product && <><div className="poly-user">{order.name} / {order.quantity} unit{Number(order.quantity) > 1 ? 's' : ''}</div><div className="poly-bot poly-review"><span className="poly-label">ORDER READY</span>Here&apos;s what I&apos;ll send to the 773 Labs team.<div className="order-summary"><div><span>DESIGN</span><b>{order.product.name}</b></div><div><span>STARTING PRICE</span><b>{order.product.price} x {order.quantity}</b></div><div><span>MAKER NOTE</span><b>{order.notes || 'No extra notes'}</b></div></div></div><button className="btn btn-whatsapp poly-send" type="button" onClick={finishOrder}>Send order to 773 Labs <span>↗</span></button><button type="button" className="poly-back" onClick={() => setMode('quantity')}>← Edit order</button></>}
            </div>
            <aside className="poly-side"><div className="poly-side-top"><span>CAPABILITIES</span><b>01 — FIND</b><b>02 — CONFIGURE</b><b>03 — HAND OFF</b></div><div className="poly-side-note"><span>WHY POLYPHEMUS?</span><p>It does the repetitive part first. You get a clean order brief; the maker confirms price, stock, and turnaround.</p></div><div className="poly-side-bottom">773 LABS<br /><span>PRINTED TO ORDER</span></div></aside>
          </div>
        </Reveal>
        <div className="poly-disclaimer">Polyphemus prepares your request. No payment is taken here. 773 Labs confirms final pricing and delivery on WhatsApp.</div>
      </div>
    </section>
  )
}
