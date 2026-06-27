import type { FaceName } from '../types/cubeTypes'

export interface ParsedMove {
  face: FaceName
  turns: 1 | -1 | 2
}

/** Parse standard cube notation such as U, R', or F2. */
export function parseMove(move?: string): ParsedMove | null {
  if (!move) {
    return null
  }

  const match = /^([URFDLB])([2']?)$/.exec(move.trim())
  if (!match) {
    return null
  }

  return {
    face: match[1] as FaceName,
    turns: match[2] === "'" ? -1 : match[2] === '2' ? 2 : 1,
  }
}
