import type { CubeState, FaceName } from '../types/cubeTypes'

const FACE_ORDER: FaceName[] = ['U', 'R', 'F', 'D', 'L', 'B']

/**
 * Converts the editable 3x3 face grids into the URFDLB facelet notation
 * expected by the Kociemba solver API. Each face is read left-to-right,
 * top-to-bottom before moving to the next face.
 */
export function cubeStateToString(cubeState: CubeState): string {
  return FACE_ORDER.flatMap((face) => cubeState[face].flat()).join('')
}

/**
 * The solver receives exactly six faces with nine stickers each: 54 total.
 */
export function isValidLength(cubeStateString: string): boolean {
  return cubeStateString.length === 54
}
