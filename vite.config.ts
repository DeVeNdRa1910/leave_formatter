import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'

/* ── Always reload from .env on every server restart ── */
function loadDotEnv() {
  try {
    const raw = readFileSync('.env', 'utf8')
    for (const line of raw.split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      const key = t.slice(0, eq).trim()
      const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
      process.env[key] = val   // always override
    }
  } catch { /* no .env file */ }
}
loadDotEnv()

/* ── Prompts ── */
const LEAVE_SYSTEM = `You are an experienced corporate communication assistant for Thoughtwin IT Solutions.
Generate professional, polite, concise leave request emails.
Rules:
1. Write a professional subject line.
2. Use the EXACT opening salutation provided in the prompt (e.g. "Dear Manager,", "Hello Sir,").
3. Mention leave dates clearly.
4. Include leave category and project name.
5. Keep it concise and human-like.
6. End with "Regards," followed by the exact name provided in the prompt.
IMPORTANT: Respond ONLY with valid JSON: {"subject":"...","email_body":"..."}`

const WFH_SYSTEM = `You are an experienced corporate communication assistant for Thoughtwin IT Solutions.
Generate professional Work From Home request emails.
Rules:
1. Write a clear subject line.
2. Use the EXACT opening salutation provided in the prompt (e.g. "Dear Manager,", "Hello Ma'am,").
3. Mention WFH dates clearly.
4. Include project name and any additional notes.
5. Assure deliverables will be managed.
6. End with "Regards," followed by the exact name provided in the prompt.
IMPORTANT: Respond ONLY with valid JSON: {"subject":"...","email_body":"..."}`

function buildPrompt(b: Record<string, string>): string {
  const range = b.date_from === b.date_to
    ? `on ${b.date_from}`
    : `from ${b.date_from} to ${b.date_to}`
  const salutation = b.salutation || 'Dear Manager'
  const name = b.name || '[Your Name]'
  if (b.request_type === 'leave') {
    return `Generate leave request email:\n- Opening salutation: "${salutation},"\n- Dates: ${range}\n- Type: ${b.leave_type || 'Casual Leave'}\n- Reason: ${b.reason}\n- Project: ${b.project_name}\n- Sign off with the name: ${name}\nReturn only JSON.`
  }
  return `Generate WFH request email:\n- Opening salutation: "${salutation},"\n- Dates: ${range}\n- Reason: ${b.reason}\n- Project: ${b.project_name}${b.additional_notes ? `\n- Notes: ${b.additional_notes}` : ''}\n- Sign off with the name: ${name}\nReturn only JSON.`
}

function sendJSON(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

/* ── Vite plugin ── */
function apiPlugin(): Plugin {
  return {
    name: 'api-handler',
    configureServer(server) {

      /* ── GET /api/models → list available deployments ── */
      server.middlewares.use('/api/models', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'GET') return sendJSON(res, 405, { error: 'Method not allowed' })
        loadDotEnv()
        const apiKey = process.env.ANTHROPIC_FOUNDRY_API_KEY
        const baseURL = process.env.ANTHROPIC_FOUNDRY_BASE_URL
        if (!apiKey || !baseURL) return sendJSON(res, 500, { error: 'Missing credentials in .env' })

        const modelsEndpoint = baseURL.replace(/\/+$/, '') + '/v1/models'
        console.log(`[api] checking models → ${modelsEndpoint}`)
        try {
          const r = await fetch(modelsEndpoint, {
            headers: { 'api-key': apiKey, 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
          })
          const body = await r.text()
          console.log(`[api] models ← ${r.status}`, body.slice(0, 300))
          return sendJSON(res, r.ok ? 200 : r.status, JSON.parse(body))
        } catch (e) {
          return sendJSON(res, 500, { error: (e as Error).message })
        }
      })

      /* ── POST /api/generate-email ── */
      server.middlewares.use('/api/generate-email', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method === 'OPTIONS') { res.writeHead(204); return res.end() }
        if (req.method !== 'POST') return sendJSON(res, 405, { success: false, error: 'Method not allowed' })

        /* Collect body */
        let raw = ''
        for await (const chunk of req) raw += chunk

        let body: Record<string, string>
        try { body = JSON.parse(raw) }
        catch { return sendJSON(res, 400, { success: false, error: 'Invalid JSON body' }) }

        /* Validate */
        if (!body.request_type || !['leave', 'wfh'].includes(body.request_type))
          return sendJSON(res, 400, { success: false, error: 'Invalid request_type' })
        if (!body.date_from || !body.date_to || !body.reason?.trim() || !body.project_name?.trim())
          return sendJSON(res, 400, { success: false, error: 'Missing required fields' })

        /* Read credentials fresh on each request */
        loadDotEnv()
        const apiKey = process.env.ANTHROPIC_FOUNDRY_API_KEY
        const baseURL = process.env.ANTHROPIC_FOUNDRY_BASE_URL
        const model   = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022'

        if (!apiKey) return sendJSON(res, 500, { success: false, error: 'ANTHROPIC_FOUNDRY_API_KEY is not set in .env' })
        if (!baseURL) return sendJSON(res, 500, { success: false, error: 'ANTHROPIC_FOUNDRY_BASE_URL is not set in .env' })

        /* Build exact Azure AI Foundry endpoint URL
           baseURL  = https://resource.services.ai.azure.com/anthropic
           endpoint = https://resource.services.ai.azure.com/anthropic/v1/messages   */
        const endpoint = baseURL.replace(/\/+$/, '') + '/v1/messages'

        const system = body.request_type === 'leave' ? LEAVE_SYSTEM : WFH_SYSTEM
        const requestPayload = {
          model,
          max_tokens: 1024,
          system,
          messages: [{ role: 'user', content: buildPrompt(body) }],
        }

        console.log(`[api] → ${endpoint}  model=${model}`)

        let response: Response
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': apiKey,                    // Azure AI Foundry auth header
              'x-api-key': apiKey,                  // Anthropic standard header (fallback)
              'anthropic-version': '2023-06-01',    // required by Anthropic API
            },
            body: JSON.stringify(requestPayload),
          })
        } catch (fetchErr) {
          console.error('[api] Network error:', fetchErr)
          return sendJSON(res, 500, { success: false, error: `Network error: ${(fetchErr as Error).message}` })
        }

        const responseText = await response.text()
        console.log(`[api] ← ${response.status}`, responseText.slice(0, 200))

        if (!response.ok) {
          let errMsg = `API error ${response.status}`
          try {
            const parsed = JSON.parse(responseText)
            const detail = parsed?.error?.message || parsed?.message || responseText
            errMsg = `${detail} (status ${response.status})`

            /* Auto-discover available models on DeploymentNotFound */
            if (parsed?.error?.code === 'DeploymentNotFound') {
              let hint = `Deployment "${model}" not found.`
              try {
                const mr = await fetch(baseURL.replace(/\/+$/, '') + '/v1/models', {
                  headers: { 'api-key': apiKey, 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
                })
                const mBody = await mr.json() as { data?: Array<{id: string}> }
                const ids = mBody?.data?.map((m: {id: string}) => m.id) ?? []
                hint += ids.length
                  ? ` Available deployments: ${ids.join(', ')}. Set ANTHROPIC_MODEL to one of these in your .env file.`
                  : ` Could not list models automatically — open Azure AI Foundry portal → your project → Deployments and copy the exact deployment name into ANTHROPIC_MODEL in .env.`
              } catch { hint += ` Open Azure AI Foundry portal → Deployments and copy the exact name into ANTHROPIC_MODEL in .env.` }
              errMsg = hint
            }
          } catch { /* use default */ }
          return sendJSON(res, response.status === 429 ? 429 : 500, { success: false, error: errMsg })
        }

        let apiData: { content?: Array<{ type: string; text: string }> }
        try { apiData = JSON.parse(responseText) }
        catch { return sendJSON(res, 500, { success: false, error: 'Could not parse API response' }) }

        const text = (apiData.content || [])
          .filter(b => b.type === 'text')
          .map(b => b.text)
          .join('')

        const match = text.match(/\{[\s\S]*\}/)
        if (!match) return sendJSON(res, 500, { success: false, error: 'Unexpected AI response format' })

        let parsed: { subject?: string; email_body?: string }
        try { parsed = JSON.parse(match[0]) }
        catch { return sendJSON(res, 500, { success: false, error: 'Could not parse AI response' }) }

        if (!parsed.subject || !parsed.email_body)
          return sendJSON(res, 500, { success: false, error: 'Incomplete AI response' })

        return sendJSON(res, 200, { success: true, subject: parsed.subject, email_body: parsed.email_body })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin()],
})
