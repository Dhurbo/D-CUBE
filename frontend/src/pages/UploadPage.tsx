import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ErrorAlert from '../components/ErrorAlert'
import {
  CubeApiError,
  detectCubeImages,
  type CubeImageName,
  type CubeImages,
} from '../services/cubeApi'
import type { ImageDetectionResponse } from '../types/cubeTypes'

const FACE_UPLOADS: { name: CubeImageName; label: string }[] = [
  { name: 'front', label: 'Front' },
  { name: 'back', label: 'Back' },
  { name: 'left', label: 'Left' },
  { name: 'right', label: 'Right' },
  { name: 'up', label: 'Up' },
  { name: 'down', label: 'Down' },
]

type SelectedImages = Record<CubeImageName, File | null>
type ImagePreviews = Record<CubeImageName, string | null>

const emptyImages: SelectedImages = {
  front: null,
  back: null,
  left: null,
  right: null,
  up: null,
  down: null,
}

const emptyPreviews: ImagePreviews = {
  front: null,
  back: null,
  left: null,
  right: null,
  up: null,
  down: null,
}

function UploadPage() {
  const navigate = useNavigate()
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [images, setImages] = useState<SelectedImages>(emptyImages)
  const [previews, setPreviews] = useState<ImagePreviews>(emptyPreviews)
  const [errors, setErrors] = useState<string[]>([])
  const [response, setResponse] = useState<ImageDetectionResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(
    () => () => {
      Object.values(previews).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview)
      })
      if (redirectTimer.current) clearTimeout(redirectTimer.current)
    },
    [previews],
  )

  const handleFileChange = (face: CubeImageName, file: File | null) => {
    setImages((current) => ({ ...current, [face]: file }))
    setPreviews((current) => ({
      ...current,
      [face]: file ? URL.createObjectURL(file) : null,
    }))
  }

  const handleSubmit = async () => {
    const missingFaces = FACE_UPLOADS.filter(({ name }) => !images[name]).map(({ label }) => label)
    if (missingFaces.length > 0) {
      setErrors([`Select an image for: ${missingFaces.join(', ')}.`])
      return
    }

    setErrors([])
    setResponse(null)
    setIsSubmitting(true)

    try {
      const result = await detectCubeImages(images as CubeImages)
      setResponse(result)
      redirectTimer.current = setTimeout(() => {
        navigate('/correction', { state: { detection: result } })
      }, 1000)
    } catch (submissionError) {
      if (submissionError instanceof CubeApiError) {
        setErrors([submissionError.message, ...submissionError.errors])
      } else {
        setErrors(['Unable to upload the cube images. Please try again.'])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <p className="text-sm font-semibold tracking-[0.25em] text-cyan-400">IMAGE SCAN</p>
      <h1 className="mt-3 text-3xl font-bold">Upload cube faces</h1>
      <p className="mt-3 text-slate-300">Upload one clear image of each face. You can correct detected colours in the next step.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FACE_UPLOADS.map(({ name, label }) => (
          <label
            key={name}
            className="group relative flex min-h-52 cursor-pointer flex-col overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-900 p-4 transition hover:border-cyan-400"
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => handleFileChange(name, event.target.files?.[0] ?? null)}
            />
            <span className="text-sm font-semibold text-cyan-300">{label}</span>
            {previews[name] ? (
              <img src={previews[name] ?? undefined} alt={`${label} cube face preview`} className="mt-3 h-40 w-full rounded-lg object-cover" />
            ) : (
              <span className="grid flex-1 place-items-center text-center text-sm text-slate-400">
                Choose a JPEG, PNG, or WebP image
              </span>
            )}
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-8 rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Detecting cube…' : 'Upload and detect cube'}
      </button>

      {errors.length > 0 && (
        <div className="mt-5">
          <ErrorAlert title="Image upload failed" errors={errors} />
        </div>
      )}

      {response && (
        <section className="mt-5 rounded-lg border border-emerald-800 bg-emerald-950/40 p-4 text-emerald-100" aria-live="polite">
          <p className="font-semibold">{response.message}</p>
          <p className="mt-1 text-sm">Session {response.session_id} created. Opening colour correction…</p>
          <pre className="mt-3 overflow-x-auto rounded bg-slate-950 p-3 text-xs text-slate-300">
            {JSON.stringify(response, null, 2)}
          </pre>
        </section>
      )}
    </main>
  )
}

export default UploadPage
