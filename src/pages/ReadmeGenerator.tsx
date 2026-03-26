import { useState } from 'react'
import { FileCode, Wand2, Copy, Check, AlertTriangle, RefreshCw } from 'lucide-react'
import { useReadmeGenerator } from '@/hooks/useReadmeGenerator'

export default function ReadmeGenerator() {
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)
  const { state, markdown, error, truncated, generate, reset } = useReadmeGenerator()

  const handleGenerate = () => {
    if (!code.trim()) return
    generate(code)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isLoading = state === 'loading'

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Privacy Warning Banner */}
      <div className="bg-amber-900/30 border-b border-amber-700/50 px-4 py-2 flex items-center gap-2 text-amber-300 text-sm">
        <AlertTriangle size={16} />
        <span>
          Your code is sent to the AI provider. Do not paste proprietary or security-sensitive code.
        </span>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <FileCode className="text-blue-400" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-white">README Generator</h1>
            <p className="text-gray-400 text-sm">Paste your code. Get a README. Ship faster.</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-300" htmlFor="code-input">
            Your code
          </label>
          <textarea
            id="code-input"
            className="w-full h-80 bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm font-mono text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Paste your source code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {code.split('\n').length} / {2000} lines
            </span>
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              onClick={handleGenerate}
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  Generate README
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {(state === 'success' || state === 'error' || state === 'loading') && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Generated README</label>
              {state === 'success' && (
                <button
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                  onClick={handleCopy}
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            <div className="relative">
              {isLoading ? (
                <div className="h-80 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center">
                  <RefreshCw size={24} className="animate-spin text-gray-500" />
                </div>
              ) : (
                <pre className="h-80 bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-auto text-sm font-mono text-gray-100 whitespace-pre-wrap">
                  {state === 'success' ? markdown : error}
                </pre>
              )}
            </div>

            {state === 'error' && (
              <div className="flex justify-end">
                <button
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                  onClick={reset}
                >
                  <RefreshCw size={14} />
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Truncation Warning */}
        {truncated && state === 'success' && (
          <div className="text-xs text-amber-400 flex items-center gap-2">
            <AlertTriangle size={14} />
            Code truncated — results may be incomplete.
          </div>
        )}
      </div>
    </div>
  )
}
