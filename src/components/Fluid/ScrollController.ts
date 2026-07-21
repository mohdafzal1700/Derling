/**
 * Converts window scroll deltas into a decaying velocity impulse. The fluid
 * layer injects this as vertical force each frame; when scrolling stops the
 * impulse decays so the liquid settles naturally instead of snapping still.
 */
export class ScrollController {
  private lastY: number;
  private velocity = 0;

  constructor() {
    this.lastY = typeof window !== "undefined" ? window.scrollY : 0;
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }

  private onScroll() {
    const y = window.scrollY;
    const delta = y - this.lastY;
    this.lastY = y;
    this.velocity += delta * 0.02;
    this.velocity = Math.max(-4, Math.min(4, this.velocity));
  }

  /** Call once per frame. Returns the current velocity and decays it toward zero. */
  sample(dt: number): number {
    const value = this.velocity;
    this.velocity *= Math.pow(0.0005, dt);
    return value;
  }

  dispose() {
    window.removeEventListener("scroll", this.onScroll);
  }
}
