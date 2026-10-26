import { readFileSync } from 'fs'
import { join } from 'path'

// Only production deployments may send advertising events or marker requests.
export async function GET() {
  const production = process.env.VERCEL_ENV === 'production'
  let html = readFileSync(join(process.cwd(), 'public', 'sakeena.html'), 'utf8')

  if (production) {
    html = html.replace('</body>', '<script src="/sakeena-lead-tracking.js" defer></script></body>')
  } else {
    // Protect the shared Meta Pixel and CAPI datasets while testing PR previews.
    html = html
      .replace('https://connect.facebook.net/en_US/fbevents.js', 'about:blank')
      .replace(/https:\/\/www\.facebook\.com\/tr\?[^"'\s<>]+/g, 'about:blank')
      .replace('function track(ev,data){', 'function track(ev,data){return;')
    // No marker script injection on previews.
  }

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
