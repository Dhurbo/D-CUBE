import { create } from 'zustand'

import type { CubeState, FaceName } from '../types/cubeTypes'

const createFace = (face: FaceName): FaceName[][] =>
  Array.from({ length: 3 }, () => Array<FaceName>(3).fill(face))

const createSolvedCube = (): CubeState => ({
  U: createFace('U'),
  R: createFace('R'),
  F: createFace('F'),
  D: createFace('D'),
  L: createFace('L'),
  B: createFace('B'),
})

interface CubeStore {
  cubeState: CubeState
  selectedColor: FaceName
  solutionMoves: string[]
  currentMoveIndex: number
  setSelectedColor: (color: FaceName) => void
  updateSticker: (face: FaceName, row: number, col: number, value: FaceName) => void
  resetCube: () => void
  setSolutionMoves: (moves: string[]) => void
  nextMove: () => void
  previousMove: () => void
  resetSolution: () => void
}

export const useCubeStore = create<CubeStore>((set) => ({
  cubeState: createSolvedCube(),
  selectedColor: 'U',
  solutionMoves: [],
  currentMoveIndex: 0,

  setSelectedColor: (color) => set({ selectedColor: color }),

  updateSticker: (face, row, col, value) =>
    set((state) => {
      if (row < 0 || row > 2 || col < 0 || col > 2) {
        return state
      }

      const updatedFace = state.cubeState[face].map((stickers, rowIndex) =>
        rowIndex === row
          ? stickers.map((sticker, columnIndex) => (columnIndex === col ? value : sticker))
          : stickers,
      )

      return {
        cubeState: {
          ...state.cubeState,
          [face]: updatedFace,
        },
      }
    }),

  resetCube: () => set({ cubeState: createSolvedCube() }),

  setSolutionMoves: (moves) => set({ solutionMoves: moves, currentMoveIndex: 0 }),

  nextMove: () =>
    set((state) => ({
      currentMoveIndex: Math.min(state.currentMoveIndex + 1, Math.max(state.solutionMoves.length - 1, 0)),
    })),

  previousMove: () =>
    set((state) => ({
      currentMoveIndex: Math.max(state.currentMoveIndex - 1, 0),
    })),

  resetSolution: () => set({ solutionMoves: [], currentMoveIndex: 0 }),
}))
