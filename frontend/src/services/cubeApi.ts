import axios from 'axios'

import type { ImageDetectionResponse, SolveResponse } from '../types/cubeTypes'

export interface CubeValidationResponse {
  valid: boolean
  message: string
  errors?: string[] | null
}

export interface ApiErrorDetail {
  message: string
  errors: string[]
}

interface ApiErrorPayload {
  detail?: unknown
  message?: unknown
  errors?: unknown
}

export class CubeApiError extends Error {
  readonly errors: string[]

  constructor(detail: ApiErrorDetail) {
    super(detail.message)
    this.name = 'CubeApiError'
    this.errors = detail.errors
  }
}

const cubeApi = axios.create({
  baseURL: import.meta.env.VITE_CUBE_API_URL ?? 'http://localhost:8000/api/cube',
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function createReadableError(error: unknown): CubeApiError {
  if (!axios.isAxiosError<ApiErrorPayload>(error)) {
    return new CubeApiError({
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
      errors: [],
    })
  }

  if (!error.response) {
    return new CubeApiError({
      message: 'Unable to reach the cube API. Make sure the backend server is running.',
      errors: [],
    })
  }

  const payload = error.response.data
  const detail = payload?.detail ?? payload
  if (typeof detail === 'string') {
    return new CubeApiError({ message: detail, errors: [] })
  }

  if (isRecord(detail)) {
    const message = typeof detail.message === 'string' ? detail.message : 'The cube API rejected the request.'
    const errors = Array.isArray(detail.errors)
      ? detail.errors.filter((item): item is string => typeof item === 'string')
      : []
    return new CubeApiError({ message, errors })
  }

  return new CubeApiError({
    message: 'The cube API returned an unreadable error response.',
    errors: [],
  })
}

/** Send a 54-sticker state to the backend validation endpoint. */
export async function validateCube(cubeState: string): Promise<CubeValidationResponse> {
  try {
    const { data } = await cubeApi.post<CubeValidationResponse>('/validate', {
      cube_state: cubeState,
    })
    return data
  } catch (error) {
    throw createReadableError(error)
  }
}

/** Send a valid state to the backend solver and return its ordered move list. */
export async function solveCube(cubeState: string): Promise<SolveResponse> {
  try {
    const { data } = await cubeApi.post<SolveResponse>('/solve', {
      cube_state: cubeState,
    })
    return data
  } catch (error) {
    throw createReadableError(error)
  }
}

export type CubeImageName = 'front' | 'back' | 'left' | 'right' | 'up' | 'down'

export type CubeImages = Record<CubeImageName, File>

/** Upload one image for each cube face and return the detection session. */
export async function detectCubeImages(images: CubeImages): Promise<ImageDetectionResponse> {
  const formData = new FormData()
  ;(Object.entries(images) as [CubeImageName, File][]).forEach(([name, file]) => {
    formData.append(name, file)
  })

  try {
    const { data } = await cubeApi.post<ImageDetectionResponse>('/detect-images', formData)
    return data
  } catch (error) {
    throw createReadableError(error)
  }
}
