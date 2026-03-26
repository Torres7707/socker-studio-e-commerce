import { SYSTEM_PROMPT, buildUserPrompt } from './readmePrompt'

const API_URL = 'https://api.anthropic.com/v1/messages'

export interface GenerateResult {
  markdown: string
}

export async function generateReadme(code: string): Promise<GenerateResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env file.')
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(code),
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    if (response.status === 429) {
      throw new Error('Rate limited. Please wait a moment and try again.')
    }
    if (response.status === 401) {
      throw new Error('Invalid API key. Check your VITE_ANTHROPIC_API_KEY in .env')
    }
    throw new Error(`API error ${response.status}: ${error}`)
  }

  const data = await response.json()
  const markdown = data.content?.[0]?.text

  if (!markdown) {
    throw new Error('Empty response from AI. Please try again.')
  }

  return { markdown }
}
