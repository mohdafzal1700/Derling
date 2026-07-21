export default function Home() {
  return (
    <>
      <header className="flex items-center justify-between px-8 py-6 md:px-16">
        <span className="text-sm font-semibold tracking-[0.3em] uppercase">Derling</span>
        <nav className="hidden gap-8 text-sm text-black/60 md:flex">
          <a href="#work" className="transition hover:text-black">
            Work
          </a>
          <a href="#studio" className="transition hover:text-black">
            Studio
          </a>
          <a href="#contact" className="transition hover:text-black">
            Contact
          </a>
        </nav>
      </header>

      <main className="flex-1">
        <section className="flex min-h-[85vh] flex-col items-center justify-center px-8 text-center">
          <p className="mb-4 text-xs tracking-[0.4em] text-black/45 uppercase">Interactive Motion Studio</p>
          <h1 className="max-w-3xl text-5xl leading-tight font-semibold md:text-7xl">
            A living surface,
            <br />
            not a background.
          </h1>
          <p className="mt-6 max-w-xl text-balance text-black/55">
            Move, click, and scroll — the liquid beneath this page responds like thick milk, holding
            inertia and settling slowly back into calm.
          </p>
        </section>

        <section id="work" className="mx-auto grid max-w-5xl gap-6 px-8 py-24 md:grid-cols-3">
          {["Fluid Systems", "Realtime Shaders", "Motion Craft"].map((title) => (
            <div
              key={title}
              className="rounded-2xl border border-black/10 bg-black/[0.03] p-8 backdrop-blur-sm"
            >
              <h2 className="text-lg font-medium">{title}</h2>
              <p className="mt-3 text-sm text-black/50">
                GPU-driven, physically inspired, and tuned to feel premium at 60 FPS.
              </p>
            </div>
          ))}
        </section>

        <section id="studio" className="mx-auto max-w-3xl px-8 py-24 text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Built for depth, not decoration.</h2>
          <p className="mt-4 text-black/55">
            Velocity, pressure, curl, and vorticity are solved entirely on the GPU — the CPU only ever
            hands the shaders a pointer position and a scroll delta.
          </p>
        </section>
      </main>

      <footer id="contact" className="px-8 py-10 text-center text-xs text-black/40">
        © {new Date().getFullYear()} Derling — crafted with WebGL.
      </footer>
    </>
  );
}
