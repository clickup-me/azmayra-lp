import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  const html = readFileSync(join(process.cwd(), 'public', 'ghania.html'), 'utf8').replace('</body>', '<script src="/azm-lead-tracking.js" defer></script></body>')
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
