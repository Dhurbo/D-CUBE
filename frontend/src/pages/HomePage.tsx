function HomePage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl place-items-center px-6 py-16">
      <section className="max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold tracking-[0.35em] text-cyan-400">D-CUBE</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">AI Rubik&apos;s Cube Solver</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Scan, validate, solve, and animate your Rubik&apos;s Cube. The interface is ready for the next layer of cube magic.
        </p>
        <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
          {['Enter a cube state', 'Review detected faces', 'Follow the solution'].map((step, index) => (
            <div key={step} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <span className="text-sm font-bold text-cyan-400">0{index + 1}</span>
              <p className="mt-2 font-medium text-white">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage
