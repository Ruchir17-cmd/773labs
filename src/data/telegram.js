// Fire-and-forget logging of outbound WhatsApp messages to the owner's
// Telegram bot via a serverless proxy. Never blocks or breaks ordering —
// failures are silently ignored.

const TELEGRAM_PROXY_URL = '/api/notify'

export function logToTelegram(source, text) {
  if (!text) return
  try {
    fetch(TELEGRAM_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, text }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // logging must never interfere with the customer flow
  }
}
