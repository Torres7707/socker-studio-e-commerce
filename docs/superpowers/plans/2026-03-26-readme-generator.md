# AI README Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single-page app where users paste code and receive an AI-generated README in markdown.

**Architecture:** Client-side React + TypeScript calling Claude API directly. No auth. No persistence. State managed via a single custom hook. API key from `VITE_ANTHROPIC_API_KEY`.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, Fetch API (no SDK)

---

## File Structure

```
src/
  pages/
    ReadmeGenerator.tsx       # Main page — textarea + button + output
  hooks/
    useReadmeGenerator.ts     # State machine: idle | loading | success | error
  lib/
    readmeApi.ts              # Calls Claude API with the system prompt
    readmePrompt.ts           # System prompt template + user prompt builder
  App.tsx                     # Add /generate route
.env.example                   # VITE_ANTHROPIC_API_KEY template
```

---

## Task 1: Environment Setup

**Files:**
- Create: `.env.example`
- Create: `.env`

- [ ] **Step 1: Create `.env.example`**

```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

- [ ] **Step 2: Create `.env` (gitignored, local only)**

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

- [ ] **Step 3: Verify `.gitignore` excludes `.env`**

Run: `grep -q "\.env" .gitignore && echo "OK" || echo "MISSING"`
Expected: "OK"

---

## Task 2: API Layer

**Files:**
- Create: `src/lib/readmePrompt.ts`
- Create: `src/lib/readmeApi.ts`

- [ ] **Step 1: Create `src/lib/readmePrompt.ts`**

```typescript
export const SYSTEM_PROMPT = `You are an expert technical writer. Given the user's code, generate a complete, accurate README.md for their project.

Output ONLY the raw markdown content — no preamble, no explanation.

Structure your README as follows:
1. Project title (use the repo/package name inferred from the code, or "My Project")
2. One-paragraph description of what the project does
3. ## Installation — exact commands to install (detect package manager from files: package.json → npm/pnpm/yarn, requirements.txt → pip, go.mod → go, Cargo.toml → cargo, Gemfile → bundle)
4. ## Usage — realistic usage example(s) based on the exported functions or components
5. ## File Structure — brief overview of key files and their purpose
6. ## Tech Stack — detected technologies, libraries, and frameworks

Be specific. If you see React components, show a component example. If you see API routes, show an endpoint example. Generic templates are useless — make it match the actual code.
Do NOT invent dependencies or features that aren't in the code.`

export function buildUserPrompt(code: string): string {
  return `Generate a README for this code:

\`\`\`
${code}
\`\`\``
}
```

- [ ] **Step 2: Create `src/lib/readmeApi.ts`**

```typescript
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
```

- [ ] **Step 3: Run lint to verify no errors**

Run: `pnpm lint -- src/lib/readmeApi.ts src/lib/readmePrompt.ts`
Expected: no errors

---

## Task 3: State Machine Hook

**Files:**
- Create: `src/hooks/useReadmeGenerator.ts`

- [ ] **Step 1: Create `src/hooks/useReadmeGenerator.ts`**

```typescript
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
```

- [ ] **Step 2: Run lint to verify**

Run: `pnpm lint -- src/hooks/useReadmeGenerator.ts`
Expected: no errors

---

## Task 4: Main Page

**Files:**
- Create: `src/pages/ReadmeGenerator.tsx`

- [ ] **Step 1: Create `src/pages/ReadmeGenerator.tsx`**

```typescript
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
```

- [ ] **Step 2: Run lint to verify**

Run: `pnpm lint -- src/pages/ReadmeGenerator.tsx`
Expected: no errors

---

## Task 5: Routing

**Files:**
- Modify: `src/App.tsx` (add route)

- [ ] **Step 1: Add `/generate` route to `App.tsx`**

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import Login from '@/components/Login'
import Register from '@/pages/Register'
import Home from '@/pages/Home'
import ReadmeGenerator from '@/pages/ReadmeGenerator'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/generate" element={<ReadmeGenerator />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/generate" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 2: Run lint to verify**

Run: `pnpm lint -- src/App.tsx`
Expected: no errors

---

## Task 6: Smoke Test

**Files:**
- No file changes — verification only

- [ ] **Step 1: Verify TypeScript compiles**

Run: `pnpm build 2>&1 | head -30`
Expected: build succeeds with no TypeScript errors

- [ ] **Step 2: Verify dev server starts**

Run: `pnpm dev &` (background), sleep 5, then `curl -s http://localhost:5173 | head -20`
Expected: HTML page with Vite content

---

## Self-Review Checklist

**Spec coverage:**
- [ ] Paste-and-go single page — Task 4 covers the full UI
- [ ] AI API call with system prompt — Task 2 covers API + prompt
- [ ] State machine (idle/loading/success/error) — Task 3 covers the hook
- [ ] Line limit handling (>2000 lines truncated) — Task 3 hook checks this
- [ ] Privacy warning banner — Task 4 component includes it
- [ ] Copy-to-clipboard button — Task 4 component includes it
- [ ] `/generate` route — Task 5 covers routing
- [ ] `VITE_ANTHROPIC_API_KEY` env var — Task 1 covers this

**Placeholder scan:**
- No "TBD", "TODO", or "implement later" found
- No vague "add appropriate error handling" — all error states are explicit
- All code blocks are complete

**Type consistency:**
- `generateReadme(code: string)` — Task 2
- `buildUserPrompt(code: string)` — Task 2
- `useReadmeGenerator()` returns `{ state, markdown, error, truncated, generate, reset }` — Task 3
- All components import from the correct paths

---

## Task 7: Commit

- [ ] **Step 1: Commit the implementation**

```bash
git add -A
git commit -m "feat: add AI README generator

- Single-page paste-and-go app at /generate
- Calls Claude API with structured prompt
- Handles idle/loading/success/error states
- Truncates code at 2000 lines with warning
- Privacy warning banner displayed
- Copy-to-clipboard on generated README
- No auth required"
```
