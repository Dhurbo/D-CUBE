import type { FaceName } from '../types/cubeTypes'

interface StickerCellProps {
  colorHex: string
  faceCode: FaceName
  onClick: () => void
}

function StickerCell({ colorHex, faceCode, onClick }: StickerCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="aspect-square rounded-md border border-slate-700 shadow-sm transition hover:scale-105 hover:ring-2 hover:ring-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
      style={{ backgroundColor: colorHex }}
      aria-label={`Set sticker to ${faceCode}`}
    >
      <span className="text-xs font-bold text-slate-900/75">{faceCode}</span>
    </button>
  )
}

export default StickerCell
