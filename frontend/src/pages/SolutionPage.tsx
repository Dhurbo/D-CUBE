import Cube3D from '../components/Cube3D'
import { useCubeStore } from '../store/cubeStore'

function SolutionPage() {
  const solutionMoves = useCubeStore((state) => state.solutionMoves)
  const currentMoveIndex = useCubeStore((state) => state.currentMoveIndex)
  const currentMove = solutionMoves[currentMoveIndex]

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <p className="text-sm font-semibold tracking-[0.25em] text-cyan-400">STEP 03</p>
      <h1 className="mt-3 text-3xl font-bold">Cube solution</h1>
      <p className="mt-3 text-slate-300">Inspect the cube and its current solution move.</p>

      <div className="mt-8">
        <Cube3D currentMove={currentMove} />
      </div>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold">Move list</h2>
          <span className="text-sm text-slate-400">{solutionMoves.length} moves</span>
        </div>
        {solutionMoves.length > 0 ? (
          <ol className="mt-5 flex flex-wrap gap-2">
            {solutionMoves.map((move, index) => (
              <li key={`${move}-${index}`} className="rounded-md bg-slate-800 px-3 py-2 font-mono text-cyan-300">
                <span className="mr-2 text-xs text-slate-500">{index + 1}</span>
                {move}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-slate-400">Solve a cube from the manual input page to see its moves here.</p>
        )}
      </section>
    </main>
  )
}

export default SolutionPage
