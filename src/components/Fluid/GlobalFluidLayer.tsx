"use client";

import { usePathname } from "next/navigation";
import { FluidCanvas } from "./FluidCanvas";

/** Routes that bring their own bespoke WebGL background and opt out of the
 * site-wide ambient milk layer (running both would double GPU cost and the
 * two liquids would visually fight each other). */
const OPTS_OUT_PREFIXES = ["/premium"];

export function GlobalFluidLayer() {
  const pathname = usePathname();
  if (OPTS_OUT_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return null;
  return <FluidCanvas />;
}
