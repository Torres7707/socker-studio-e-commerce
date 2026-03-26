import { useState, useCallback } from 'react'
import { generateReadme } from '@/lib/readmeApi'

const LINE_LIMIT = 2000

export type GeneratorState = 'idle' | 'loading' | 'success' | 'error'

export interface UseReadmeGeneratorReturn {
  state: GeneratorState
  markdown: string
  error: string | null
  truncated: boolean
  generate: (code: string) => Promise<void>
  reset: () => void
}

export function useReadmeGenerator(): UseReadmeGeneratorReturn {
  const [state, setState] = useState<GeneratorState>('idle')
  const [markdown, setMarkdown] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [truncated, setTruncated] = useState(false)

  const generate = useCallback(async (code: string) => {
    const lines = code.split('\n').length
    let processedCode = code
    let isTruncated = false

    if (lines > LINE_LIMIT) {
      processedCode = code.split('\n').slice(0, LINE_LIMIT).join('\n')
      isTruncated = true
    }

    setTruncated(isTruncated)
    setState('loading')
    setError(null)
    setMarkdown('')

    try {
      const result = await generateReadme(processedCode)
      setMarkdown(result.markdown)
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setState('error')
    }
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setMarkdown('')
    setError(null)
    setTruncated(false)
  }, [])

  return { state, markdown, error, truncated, generate, reset }
}
