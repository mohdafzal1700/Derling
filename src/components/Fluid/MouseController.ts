export interface PointerSample {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface ClickSample {
  x: number;
  y: number;
}

/**
 * Tracks pointer position/velocity and click events on `window` (not the
 * canvas), so the fluid layer can stay `pointer-events: none` while the UI
 * on top remains fully interactive.
 */
export class MouseController {
  private x = 0.5;
  private y = 0.5;
  private prevX = 0.5;
  private prevY = 0.5;
  private clicks: ClickSample[] = [];

  constructor() {
    this.onMove = this.onMove.bind(this);
    this.onDown = this.onDown.bind(this);
    window.addEventListener("pointermove", this.onMove, { passive: true });
    window.addEventListener("pointerdown", this.onDown, { passive: true });
  }

  private toUV(clientX: number, clientY: number) {
    return {
      x: clientX / window.innerWidth,
      y: 1 - clientY / window.innerHeight,
    };
  }

  private onMove(e: PointerEvent) {
    const { x, y } = this.toUV(e.clientX, e.clientY);
    this.x = x;
    this.y = y;
  }

  private onDown(e: PointerEvent) {
    const { x, y } = this.toUV(e.clientX, e.clientY);
    this.x = x;
    this.y = y;
    this.clicks.push({ x, y });
  }

  /** Call once per frame. Returns position + frame delta, then resets the delta baseline. */
  sample(): PointerSample {
    const dx = this.x - this.prevX;
    const dy = this.y - this.prevY;
    this.prevX = this.x;
    this.prevY = this.y;
    return { x: this.x, y: this.y, dx, dy };
  }

  /** Drains and returns any clicks/taps queued since the last call. */
  consumeClicks(): ClickSample[] {
    if (this.clicks.length === 0) return this.clicks;
    const clicks = this.clicks;
    this.clicks = [];
    return clicks;
  }

  dispose() {
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerdown", this.onDown);
  }
}
