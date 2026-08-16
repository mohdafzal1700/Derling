import Link from "next/link";

/** Global footer, mounted once in the root layout so it appears on every page. */
export function Footer() {
  return (
    <footer id="contact" className="w-full bg-[#0a1220] px-6 py-16 text-white md:px-16 lg:px-24">
      <a
        href="mailto:hello@derlings.com"
        className="block border-b border-white/15 pb-8 text-3xl font-black break-all uppercase transition hover:text-[#c17a3d] sm:text-5xl md:text-7xl"
      >
        Hello@Derlings.com
      </a>

      <div className="mt-10 grid grid-cols-2 gap-8 text-xs tracking-widest text-white/60 uppercase md:grid-cols-4 md:text-sm">
        <div className="flex flex-col gap-3">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/flavors" className="transition hover:text-white">
            Products
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/about" className="transition hover:text-white">
            About Us
          </Link>
          <a href="#contact" className="transition hover:text-white">
            Contact
          </a>
        </div>
        <div className="flex flex-col gap-3">
          <a href="#" className="transition hover:text-white">
            Instagram
          </a>
          <a href="#" className="transition hover:text-white">
            X / Twitter
          </a>
        </div>
        <div className="flex flex-col gap-3 normal-case">
          <span>Bengaluru, India</span>
          <span>hello@derlings.com</span>
        </div>
      </div>

      <div className="mt-12 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
        <p>&copy; {new Date().getFullYear()} Derlings — crafted with care.</p>
        <p>It&rsquo;s a new habit.</p>
      </div>
    </footer>
  );
}
