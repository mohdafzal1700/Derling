import Image from "next/image";
import Link from "next/link";

export default function Flavors() {
  return (
    <>
      <header className="flex flex-col items-center gap-4 px-8 py-10 md:py-14">
        <Image
          src="/derlings-logo.svg"
          alt="Derlings"
          width={220}
          height={124}
          className="h-auto w-40 md:w-52"
          priority
        />
        <nav className="flex gap-8 text-sm text-black/60">
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>
          <a href="#flavors" className="transition hover:text-black">
            Flavors
          </a>
        </nav>
      </header>

      <main className="flex-1 px-4 pb-24 md:px-10">
        <section className="mx-auto max-w-6xl text-center">
          <p className="mb-4 text-xs tracking-[0.4em] text-black/45 uppercase">Signature Range</p>
          <h1 className="mx-auto max-w-2xl text-4xl leading-tight font-semibold md:text-6xl">
            Made to be savored, drop by drop.
          </h1>
        </section>

        <section
          id="flavors"
          className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-[2rem] border border-black/10 bg-black/[0.03] shadow-2xl shadow-black/10 backdrop-blur-sm"
        >
          <div className="relative aspect-[3168/1344] w-full">
            <Image
              src="/Gemini_Generated_Image_qjosewqjosewqjos.png"
              alt="Derlings Strawberry Flan and Signature Caramel Pudding"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1152px) 1152px, 100vw"
            />
          </div>
        </section>

        <section className="mx-auto mt-16 grid max-w-5xl gap-6 text-center md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-8 backdrop-blur-sm">
            <h2 className="text-lg font-medium">Strawberry Flan</h2>
            <p className="mt-3 text-sm text-black/50">
              Ripe strawberries folded into a silky flan, finished with a bright fruit glaze.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-8 backdrop-blur-sm">
            <h2 className="text-lg font-medium">Signature Caramel Pudding</h2>
            <p className="mt-3 text-sm text-black/50">
              Slow-cooked caramel over a rich cocoa pudding, topped with a soft caramel cube.
            </p>
          </div>
        </section>
      </main>

      <footer className="px-8 py-10 text-center text-xs text-black/40">
        © {new Date().getFullYear()} Derlings — crafted with care.
      </footer>
    </>
  );
}
