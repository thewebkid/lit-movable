import type { LitElement } from 'lit';

/** 2D position / delta used in move-state. */
export interface Coord {
  x: number;
  y: number;
  top: number;
  left: number;
}

/** Runtime axis constraint. */
export interface MoveBounds {
  min: number;
  max: number;
  attr: string;
  readonly constrained: boolean;
  readonly unconstrained: boolean;
}

/**
 * Plain object passed as `event.detail` (and to `onmove*` callbacks).
 * Not a PointerEvent spread.
 */
export interface MoveState {
  coords?: Coord;
  startCoord?: Coord;
  moveDist?: Coord;
  totalDist?: Coord;
  mouseCoord?: Coord;
  clickOffset?: Coord;
  posTop: number | null;
  posLeft: number | null;
  pctX?: number;
  pctY?: number;
  isMoving: boolean;
}

export type MoveAxis = 'x' | 'y';

export type MoveEventName = 'movestart' | 'move' | 'moveend';

export type MoveEventHandler = (state: MoveState) => void;

export declare class Movable extends LitElement {
  /** Initial / reflected style.top (px). */
  posTop: number | null;
  /** Initial / reflected style.left (px). */
  posLeft: number | null;

  /** Snap increment in px (default 1). */
  grid: number;

  /** Pointer travel (px) before a drag starts (default 0). */
  dragAfterDist: number;

  /** CSS selector for the element that moves (default: this element). */
  targetSelector: string | null;

  /** Element that is repositioned during a drag. */
  target: Element;

  /**
   * Bounds for the X axis.
   * Set with `"min,max"` as **offsets from the current left** (not absolute coords),
   * or `"null"` to lock. Example: at `posLeft=85`, use `"-85,75"` to clamp to `[0,160]`.
   * Set `posLeft` before `boundsX` when both change. Do not reassign on every `move`
   * event — reparse mid-drag corrupts the clamp; sync on `movestart` / `moveend`.
   * Reading returns the resolved {@link MoveBounds} (absolute min/max).
   */
  boundsX: string | MoveBounds | null;

  /**
   * Bounds for the Y axis.
   * Set with `"min,max"` as **offsets from the current top** (not absolute coords),
   * or `"null"` to lock. Same ordering / mid-drag rules as {@link Movable.boundsX}.
   * Reading returns the resolved {@link MoveBounds} (absolute min/max).
   */
  boundsY: string | MoveBounds | null;

  /** Lock the orthogonal axis: `"x"` locks Y, `"y"` locks X. */
  axis: MoveAxis | null | string;

  /** Runtime `{ left, top }` bounds. */
  readonly bounds: { left: MoveBounds; top: MoveBounds };

  /** With open bounds, Shift constrains motion to the dominant axis. */
  shiftBehavior: boolean;

  /** Disable dragging. */
  disabled: boolean;

  /** Fire events but do not reposition the target. */
  eventsOnly: boolean;

  /** True while an active drag (past `dragAfterDist`) is in progress. */
  isMoving: boolean;

  /** Active pointer id during a gesture, if any. */
  pointerId: number | null | undefined;

  /** Internal move bookkeeping (prefer event `detail` / callbacks). */
  moveState: Partial<MoveState> & Record<string, unknown>;

  onmovestart: MoveEventHandler | null;
  onmove: MoveEventHandler | null;
  onmoveend: MoveEventHandler | null;

  addEventListener(
    type: MoveEventName,
    listener: (this: Movable, ev: CustomEvent<MoveState>) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener(
    type: MoveEventName,
    listener: (this: Movable, ev: CustomEvent<MoveState>) => void,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

/** Backward-compatible custom element class for the `lit-movable` tag. */
export declare class LitMovable extends Movable {}

declare global {
  interface HTMLElementTagNameMap {
    'movable-el': Movable;
    'lit-movable': LitMovable;
  }
}

export {};
