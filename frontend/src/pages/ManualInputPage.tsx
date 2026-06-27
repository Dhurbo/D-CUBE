import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ColorPalette from '../components/ColorPalette'
import CubeFaceEditor from '../components/CubeFaceEditor'
import ErrorAlert from '../components/ErrorAlert'
import { CubeApiError, solveCube, validateCube } from '../services/cubeApi'
import { useCubeStore } from '../store/cubeStore'
import { cubeStateToString } from '../utils/cubeNotation'

interface Feedback {
  message: string
  errors: string[]
  tone: 'success' | 'error'
}

function extractErrorMessages(error: unknown): string[] {
  if (error instanceof CubeApiError) {
    return error.errors.length > 0 ? error.errors : [error.message]
  }

  return [error instanceof Error ? error.message : 'An unexpected error occurred.']
}

function ManualInputPage() {
  const navigate = useNavigate()
  const cubeState = useCubeStore((state) => state.cubeState)
  const setSolutionMoves = useCubeStore((state) => state.setSolutionMoves)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isSolving, setIsSolving] = useState(false)

  const cubeStateString = cubeStateToString(cubeState)

  const handleValidate = async () => {
    setIsValidating(true)
    setFeedback(null)

    try {
      const result = await validateCube(cubeStateString)
      setFeedback({
        message: result.message,
        errors: result.errors ?? [],
        tone: result.valid ? 'success' : 'error',
      })
    } catch (error) {
      setFeedback({
        message: 'Validation request failed.',
        errors: extractErrorMessages(error),
        tone: 'error',
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleSolve = async () => {
    setIsSolving(true)
    setFeedback(null)

    try {
      const result = await solveCube(cubeStateString)
      setSolutionMoves(result.solution)
      navigate('/solution')
    } catch (error) {
      setFeedback({
        message: 'Cube could not be solved.',
        errors: extractErrorMessages(error),
        tone: 'error',
      })
    } finally {
      setIsSolving(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <p className="text-sm font-semibold tracking-[0.25em] text-cyan-400">STEP 01</p>
      <h1 className="mt-3 text-3xl font-bold">Manual Cube Input</h1>
      <p className="mt-3 text-slate-300">
        Select a color, then click stickers to recreate your cube. The centers show the standard face orientation.
      </p>

      <div className="mt-8">
        <ColorPalette />
      </div>

      <section className="mt-8 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-8">
        <div className="mx-auto grid min-w-[640px] max-w-3xl grid-cols-4 gap-4">
          <div className="col-start-2">
            <CubeFaceEditor face="U" />
          </div>
          <CubeFaceEditor face="L" />
          <CubeFaceEditor face="F" />
          <CubeFaceEditor face="R" />
          <CubeFaceEditor face="B" />
          <div className="col-start-2">
            <CubeFaceEditor face="D" />
          </div>
        </div>
      </section>

      <p className="mt-4 text-sm text-slate-400">Solver state: {cubeStateString.length}/54 stickers</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleValidate}
          disabled={isValidating || isSolving}
          className="rounded-lg border border-cyan-400 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isValidating ? 'Validating…' : 'Validate Cube'}
        </button>
        <button
          type="button"
          onClick={handleSolve}
          disabled={isValidating || isSolving}
          className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSolving ? 'Solving…' : 'Solve Cube'}
        </button>
      </div>

      {feedback && (
        feedback.tone === 'error' ? (
          <div className="mt-6">
            <ErrorAlert
              title={feedback.message}
              errors={feedback.errors.length > 0 ? feedback.errors : ['Please review the cube state and try again.']}
            />
          </div>
        ) : (
          <section className="mt-6 rounded-lg border border-emerald-700 bg-emerald-950/50 p-4 text-emerald-200" aria-live="polite">
            <p className="font-semibold">{feedback.message}</p>
          </section>
        )
      )}
    </main>
  )
}

export default ManualInputPage
