import { useLocation } from 'react-router-dom'

import ErrorAlert from '../components/ErrorAlert'
import type { ImageDetectionResponse } from '../types/cubeTypes'

function CorrectionPage() {
  const location = useLocation()
  const detection = location.state?.detection as ImageDetectionResponse | undefined

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-sm font-semibold tracking-[0.25em] text-cyan-400">STEP 02</p>
      <h1 className="mt-3 text-3xl font-bold">Correct detected faces</h1>
      <p className="mt-3 text-slate-300">Review camera-detected sticker colours before sending the state to the solver.</p>
      {detection && (
        <div className="mt-5 rounded-lg border border-emerald-800 bg-emerald-950/40 p-4 text-emerald-100">
          <p className="font-semibold">{detection.message}</p>
          <p className="mt-1 text-sm">Detection session: {detection.session_id}</p>
        </div>
      )}
      {!detection && (
        <div className="mt-5">
          <ErrorAlert
            title="No detection session found"
            errors={['Upload all six cube-face images before opening the correction page.']}
          />
        </div>
      )}
      <div className="mt-8 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-slate-400">
        Face correction workspace placeholder
      </div>
    </main>
  )
}

export default CorrectionPage
