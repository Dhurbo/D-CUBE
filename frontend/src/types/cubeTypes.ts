export type FaceName = 'U' | 'R' | 'F' | 'D' | 'L' | 'B'

export interface StickerColor {
  id: string
  label: string
  faceCode: FaceName
  hex: string
}

export interface CubeFace {
  face: FaceName
  stickers: FaceName[][]
}

export interface CubeState {
  U: FaceName[][]
  R: FaceName[][]
  F: FaceName[][]
  D: FaceName[][]
  L: FaceName[][]
  B: FaceName[][]
}

export interface SolveResponse {
  solution: string[]
  move_count: number
  cube_state: string
}

export interface ImageDetectionResponse {
  session_id: string
  detected_faces: Record<string, FaceName[][]>
  cluster_centers: Record<string, [number, number, number]>
  needs_correction: boolean
  message: string
}

const RUBIKS_CUBE_COLORS: StickerColor[] = [
  { id: 'white', label: 'White', faceCode: 'U', hex: '#FFFFFF' },
  { id: 'red', label: 'Red', faceCode: 'R', hex: '#DC2626' },
  { id: 'green', label: 'Green', faceCode: 'F', hex: '#16A34A' },
  { id: 'yellow', label: 'Yellow', faceCode: 'D', hex: '#FACC15' },
  { id: 'orange', label: 'Orange', faceCode: 'L', hex: '#F97316' },
  { id: 'blue', label: 'Blue', faceCode: 'B', hex: '#2563EB' },
]

export default RUBIKS_CUBE_COLORS
