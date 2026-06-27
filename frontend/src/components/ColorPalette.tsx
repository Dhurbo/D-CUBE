import RUBIKS_CUBE_COLORS from '../types/cubeTypes'
import { useCubeStore } from '../store/cubeStore'

function ColorPalette() {
  const selectedColor = useCubeStore((state) => state.selectedColor)
  const setSelectedColor = useCubeStore((state) => state.setSelectedColor)

  return (
    <section aria-label="Sticker color palette" className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="text-sm font-semibold text-slate-100">Select sticker color</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {RUBIKS_CUBE_COLORS.map((color) => {
          const isSelected = color.faceCode === selectedColor

          return (
            <button
              key={color.id}
              type="button"
              onClick={() => setSelectedColor(color.faceCode)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                isSelected
                  ? 'border-cyan-300 bg-slate-800 ring-2 ring-cyan-300'
                  : 'border-slate-700 bg-slate-950 hover:border-slate-500'
              }`}
              aria-pressed={isSelected}
            >
              <span
                className="h-5 w-5 rounded border border-slate-500"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
              {color.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default ColorPalette
