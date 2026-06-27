import StickerCell from './StickerCell'
import RUBIKS_CUBE_COLORS, { type FaceName } from '../types/cubeTypes'
import { useCubeStore } from '../store/cubeStore'

interface CubeFaceEditorProps {
  face: FaceName
}

const FACE_TITLES: Record<FaceName, string> = {
  U: 'Up Face',
  R: 'Right Face',
  F: 'Front Face',
  D: 'Down Face',
  L: 'Left Face',
  B: 'Back Face',
}

const COLOR_BY_FACE = Object.fromEntries(
  RUBIKS_CUBE_COLORS.map((color) => [color.faceCode, color.hex]),
) as Record<FaceName, string>

function CubeFaceEditor({ face }: CubeFaceEditorProps) {
  const stickers = useCubeStore((state) => state.cubeState[face])
  const selectedColor = useCubeStore((state) => state.selectedColor)
  const updateSticker = useCubeStore((state) => state.updateSticker)

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
      <h2 className="mb-4 text-center text-sm font-semibold text-slate-100">{FACE_TITLES[face]}</h2>
      <div className="grid grid-cols-3 gap-1.5">
        {stickers.map((row, rowIndex) =>
          row.map((sticker, columnIndex) => (
            <StickerCell
              key={`${rowIndex}-${columnIndex}`}
              colorHex={COLOR_BY_FACE[sticker]}
              faceCode={sticker}
              onClick={() => updateSticker(face, rowIndex, columnIndex, selectedColor)}
            />
          )),
        )}
      </div>
    </section>
  )
}

export default CubeFaceEditor
