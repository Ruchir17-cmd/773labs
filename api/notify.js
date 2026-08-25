// Serverless proxy: forwards website WhatsApp messages to the owner's
// Telegram bot. Keeps TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID server-side.

// Vercel: this file works as-is (api/notify.js).
// Netlify: move to netlify/functions/notify.js and change the export to:
//   exports.handler = async (event) => { ... return { statusCode, body } }
// Cloudflare Pages: adapt to the fetch-style handler.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' })
    return
  }

  const { source, text } = req.body || {}
  if (!text || typeof text !== 'string' || text.length > 4000) {
    res.status(400).json({ ok: false, error: 'invalid payload' })
    return
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    // Configured but empty creds: acknowledge quietly so the site keeps working.
    res.status(200).json({ ok: true, skipped: 'telegram not configured' })
    return
  }

  const label = source ? `New ${source} from the website` : 'New message from the website'
  const message = `${label}\n\n${text}`

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })
    if (!tgRes.ok) {
      res.status(502).json({ ok: false, error: 'telegram rejected message' })
      return
    }
    res.status(200).json({ ok: true })
  } catch {
    res.status(502).json({ ok: false, error: 'telegram unreachable' })
  }
}
