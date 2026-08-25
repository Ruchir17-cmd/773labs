// Single source of truth for the WhatsApp number.
// Change this if the number ever changes — nothing else needs editing.
export const WHATSAPP_PHONE = '916260428896' // +91 62604 28896, no spaces or plus sign

export function waLink(message) {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`
}

export function buildOrderMessage(product) {
  return `Hi 773 Labs! I'd like to order this design:\n\n${product.name} (${product.category})\nMaterial: ${product.material}\nStarting price: ${product.price}\n\nCould you confirm the price and turnaround for my order?`
}

export function buildQuoteMessage(fields) {
  const lines = [
    'Hi 773 Labs! I\'d like a custom quote.',
    '',
    `Name: ${fields.name || '-'}`,
    fields.projectType ? `Project type: ${fields.projectType}` : null,
    `Details: ${fields.details || '-'}`,
    `Material: ${fields.material || '-'}`,
    `Quantity: ${fields.quantity || '-'}`,
    fields.deadline ? `Needed by: ${fields.deadline}` : null,
  ].filter(Boolean)
  return lines.join('\n')
}

export function buildGeneralMessage() {
  return "Hi 773 Labs! I have a question about your 3D printed designs."
}
