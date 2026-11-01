import type { GenerateEmailRequest, GenerateEmailResponse } from '../types/leave'

export async function generateEmail(
  request: GenerateEmailRequest
): Promise<GenerateEmailResponse> {
  const response = await fetch('/api/generate-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    let errorMessage = 'Failed to generate email. Please try again.'
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorMessage
    } catch {
      // use default message
    }
    throw new Error(errorMessage)
  }

  const data: GenerateEmailResponse = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to generate email')
  }

  return data
}
