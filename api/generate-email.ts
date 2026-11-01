import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

interface EmailRequest {
  request_type: 'leave' | 'wfh'
  date_from: string
  date_to: string
  reason: string
  leave_type?: string
  project_name: string
  additional_notes?: string
}

const LEAVE_SYSTEM_PROMPT = `You are an experienced corporate communication assistant for Thoughtwin IT Solutions.

Your task is to generate professional, polite, concise, and natural leave request emails.

Rules:
1. Write a professional subject line.
2. Address the manager respectfully (use "Dear Manager," or "Dear [Manager's Name],").
3. Mention the requested leave dates clearly.
4. Mention the reason naturally without over-explaining.
5. Include the leave category (Casual Leave, Sick Leave, etc.).
6. Mention the project name when relevant.
7. Use polite corporate language.
8. Do not make unnecessary excuses.
9. Do not invent information.
10. Keep the email concise and human-like.
11. Include a polite approval request.
12. End with "Regards," and a placeholder like "[Your Name]".

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{"subject": "...", "email_body": "..."}

Do not include any text outside the JSON.`

const WFH_SYSTEM_PROMPT = `You are an experienced corporate communication assistant for Thoughtwin IT Solutions.

Your task is to generate professional Work From Home request emails.

Rules:
1. Generate a clear, professional subject line.
2. Address the manager respectfully.
3. Mention the WFH dates clearly.
4. Explain the reason naturally and concisely.
5. Mention the project name.
6. Mention additional notes if provided.
7. Assure the manager that work responsibilities and deliverables will be managed effectively.
8. Keep the email short and professional.
9. Do not invent any commitments or information.
10. Politely request approval.
11. End with "Regards," and a placeholder like "[Your Name]".

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{"subject": "...", "email_body": "..."}

Do not include any text outside the JSON.`

function buildUserPrompt(req: EmailRequest): string {
  const dateRange = req.date_from === req.date_to
    ? `on ${req.date_from}`
    : `from ${req.date_from} to ${req.date_to}`

  if (req.request_type === 'leave') {
    return `Generate a leave request email with these details:
- Leave dates: ${dateRange}
- Leave type: ${req.leave_type || 'Casual Leave'}
- Reason: ${req.reason}
- Project name: ${req.project_name}

Return only the JSON response.`
  }

  return `Generate a Work From Home request email with these details:
- WFH dates: ${dateRange}
- Reason: ${req.reason}
- Project name: ${req.project_name}
${req.additional_notes ? `- Additional notes: ${req.additional_notes}` : ''}

Return only the JSON response.`
}

function createAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_FOUNDRY_API_KEY
  const baseURL = process.env.ANTHROPIC_FOUNDRY_BASE_URL
  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022'

  if (!apiKey) {
    throw new Error('ANTHROPIC_FOUNDRY_API_KEY is not configured')
  }

  const clientOptions: ConstructorParameters<typeof Anthropic>[0] = {
    apiKey,
  }

  if (baseURL) {
    clientOptions.baseURL = baseURL
    // Azure AI Foundry uses 'api-key' header for authentication
    clientOptions.defaultHeaders = {
      'api-key': apiKey,
    }
  }

  return { client: new Anthropic(clientOptions), model }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  // Basic CORS for local development
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  const body = req.body as Partial<EmailRequest>

  if (!body.request_type || !['leave', 'wfh'].includes(body.request_type)) {
    return res.status(400).json({ success: false, error: 'Invalid request_type' })
  }
  if (!body.date_from || !body.date_to) {
    return res.status(400).json({ success: false, error: 'date_from and date_to are required' })
  }
  if (!body.reason?.trim()) {
    return res.status(400).json({ success: false, error: 'reason is required' })
  }
  if (!body.project_name?.trim()) {
    return res.status(400).json({ success: false, error: 'project_name is required' })
  }

  let client: Anthropic
  let model: string

  try {
    const result = createAnthropicClient()
    client = result.client
    model = result.model
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Configuration error'
    console.error('Client creation error:', message)
    return res.status(500).json({ success: false, error: message })
  }

  const systemPrompt = body.request_type === 'leave' ? LEAVE_SYSTEM_PROMPT : WFH_SYSTEM_PROMPT
  const userPrompt = buildUserPrompt(body as EmailRequest)

  try {
    const message = await client.messages.create({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const rawText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('')

    // Extract JSON from the response (handles cases where model adds extra text)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No JSON found in LLM response:', rawText)
      return res.status(500).json({ success: false, error: 'Unexpected response format from AI' })
    }

    let parsed: { subject?: string; email_body?: string }
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      console.error('JSON parse error. Raw:', rawText)
      return res.status(500).json({ success: false, error: 'Could not parse AI response' })
    }

    if (!parsed.subject || !parsed.email_body) {
      return res.status(500).json({ success: false, error: 'Incomplete response from AI' })
    }

    return res.status(200).json({
      success: true,
      subject: parsed.subject,
      email_body: parsed.email_body,
    })
  } catch (err) {
    const apiErr = err as { status?: number; message?: string; error?: { message?: string } }
    console.error('Anthropic API error:', apiErr)

    if (apiErr.status === 401) {
      return res.status(500).json({ success: false, error: 'Invalid API credentials. Check your environment variables.' })
    }
    if (apiErr.status === 429) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded. Please wait a moment and try again.' })
    }
    if (apiErr.status === 408 || (err as Error).message?.includes('timeout')) {
      return res.status(504).json({ success: false, error: 'Request timed out. Please try again.' })
    }

    const message = apiErr.error?.message || apiErr.message || 'Failed to generate email'
    return res.status(500).json({ success: false, error: message })
  }
}
