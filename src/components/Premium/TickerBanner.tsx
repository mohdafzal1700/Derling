const ITEMS = ["IT'S A NEW HABIT", "REAL CREAM", "SMALL BATCHES", "NO SHORTCUTS", "MADE FRESH DAILY"];

/** Infinite horizontal marquee — content duplicated so the loop reads seamlessly. */
export function TickerBanner() {
  return (
    <div className="w-full overflow-hidden bg-[#0a1220] py-6">
      <div className="ticker-track flex w-max items-center gap-10 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
            {ITEMS.map((item, i) => (
              <span key={i} className="flex items-center gap-10">
                <span
                  className="font-display-showcase text-lg text-[#f3e6d3] uppercase md:text-2xl"
                  style={{ fontWeight: 800 }}
                >
                  {item}
                </span>
                <span className="text-lg text-[#c17a3d] md:text-2xl">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
