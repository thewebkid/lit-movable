import { LitElement, html, css } from 'lit';

const pxVal = (v) => (isFinite(v) ? Number(v) : Number(String(v).replace(/[^0-9.\-]/g, '')));

const zeroIfNaN = (v) => {
  v = Number(v);
  if (isNaN(v) || [undefined, null].includes(v)) {
    v = 0;
  }
  return v;
};

class Coord {
  constructor(x, y) {
    this.x = zeroIfNaN(x);
    this.y = zeroIfNaN(y);
  }
  static fromPointerEvent(event) {
    const { pageX, pageY } = event;
    return new Coord(pageX, pageY);
  }
  static fromElementStyle(el) {
    const x = pxVal(el.style.left ?? 0);
    const y = pxVal(el.style.top ?? 0);
    return new Coord(x, y);
  }
  static fromObject({ x, y }) {
    return new Coord(x, y);
  }
  get top() {
    return this.y;
  }
  set top(v) {
    this.y = v;
  }
  get left() {
    return this.x;
  }
  set left(v) {
    this.x = v;
  }
}

const getClickOffset = (event) => {
  const coords = Coord.fromPointerEvent(event);
  const off = event.target.getBoundingClientRect();
  const x = coords.x - (off.left + document.body.scrollLeft);
  const y = coords.y - (off.top + document.body.scrollTop);
  return new Coord(x, y);
};

class MoveBounds {
  constructor(min = -Infinity, max = Infinity) {
    this.min = min;
    this.max = max;
    this.attr = '';
  }
  get constrained() {
    return this.min === this.max;
  }
  get unconstrained() {
    return this.min === -Infinity && this.max === Infinity;
  }
  static fromString(s = null, offset = 0) {
    if (!s) {
      return new MoveBounds();
    }
    // Lock this axis to the current position (no movement), not document 0.
    if (s === 'null') {
      return new MoveBounds(offset, offset);
    }
    // IMPORTANT: min/max are deltas from `offset` (current style.left/top),
    // not absolute coordinates. "0,160" at left=85 → absolute [85, 245].
    const [min, max] = s.split(',').map((n) => Number(n.trim()) + offset);
    const bounds = new MoveBounds(min, max);
    bounds.attr = s;
    return bounds;
  }
}

/**
 * @attr {number} posTop - Initial / reflected style.top (px). When updating with bounds, set pos* before bounds*.
 * @attr {number} posLeft - Initial / reflected style.left (px). When updating with bounds, set pos* before bounds*.
 * @attr {string} targetSelector - Selector for the element that moves (defaults to this)
 * @attr {string} boundsX - Relative "min,max" **offsets from current left** (not absolute coords). `"0,160"` at left=85 → absolute [85,245]. To clamp to [0,size] use `${-left},${size-left}`. `"null"` locks X. Do not reassign on every move event — reparse mid-drag corrupts the clamp; sync on movestart/moveend.
 * @attr {string} boundsY - Relative "min,max" **offsets from current top** (not absolute coords). Same rules as boundsX.
 * @attr {string} axis - "x" or "y" to lock the other axis to the current position
 * @attr {number} grid - Snap increment in px (default 1)
 * @attr {boolean} shiftBehavior - Shift key constrains to the dominant axis when bounds are open
 * @attr {boolean} disabled - Disables movement
 * @attr {boolean} eventsOnly - Fire events but do not reposition the target
 * @attr {number} dragAfterDist - Px of pointer travel before move starts (default 0)
 *
 * @slot - Default content
 * @slot handle - Optional drag handle; when present, only this slot starts a drag
 *
 * @prop {Element} target - Element that moves
 * @prop {object} bounds - Runtime { left: MoveBounds, top: MoveBounds } with **absolute** min/max after parse
 *
 * @event {CustomEvent} movestart - detail is move state (after dragAfterDist)
 * @event {CustomEvent} move - detail is move state
 * @event {CustomEvent} moveend - detail is move state
 *
 * @summary Declarative pointer-driven move behavior for Lit / web components.
 * @tag movable-el
 */
export class Movable extends LitElement {
  _target;
  _targetSelector = null;
  _boundsX = new MoveBounds();
  _boundsY = new MoveBounds();
  _axis = null;
  _posTop = null;
  _posLeft = null;
  _grid = 1;
  _dragAfterDist = 0;
  _boundsXAttr = null;
  _boundsYAttr = null;
  _pointerBound = false;
  _dragArmed = false;
  _thresholdMet = false;
  pointerId;
  isMoving = false;
  moveState = {};

  constructor() {
    super();
    this._onPointerDown = (e) => this.pointerdown(e);
    this._onPointerMove = (e) => {
      if (this.pointerId !== undefined && e.pointerId === this.pointerId) {
        this.motionHandler(e);
      }
    };
    this._onPointerEnd = (e) => {
      if (this._dragArmed) {
        this.unbind(e);
      }
    };
  }

  set posTop(v) {
    v = Number(v);
    this._posTop = v;
    if (this.target && !this.eventsOnly) {
      this.target.style.top = v + 'px';
    }
  }
  get posTop() {
    return this._posTop;
  }

  set posLeft(v) {
    v = Number(v);
    this._posLeft = v;
    if (this.target && !this.eventsOnly) {
      this.target.style.left = v + 'px';
    }
  }
  get posLeft() {
    return this._posLeft;
  }

  get grid() {
    return this._grid;
  }
  set grid(v) {
    if (v > 0 && v < Infinity) {
      this._grid = v;
    } else {
      this._grid = 1;
    }
  }

  get dragAfterDist() {
    return this._dragAfterDist;
  }
  set dragAfterDist(v) {
    const n = Number(v);
    this._dragAfterDist = n > 0 ? n : 0;
  }

  get bounds() {
    return {
      left: this._boundsX,
      top: this._boundsY,
    };
  }

  set targetSelector(v) {
    this._targetSelector = v;
    this._retryTarget = document.querySelector(v) === null;
    this._target = document.querySelector(v);
  }
  get targetSelector() {
    return this._targetSelector;
  }

  get target() {
    return this._target ?? this;
  }
  set target(v) {
    this._target = v;
  }

  get boundsX() {
    return this._boundsX;
  }
  /**
   * @param {string | null} v Relative `"min,max"` from current left, or `"null"` to lock.
   * Reparse uses `target.style.left` as offset — set `posLeft` first when both change.
   * Avoid reassigning on every `move`; prefer movestart/moveend (see README).
   */
  set boundsX(v) {
    this._boundsXAttr = v;
    this._boundsX = MoveBounds.fromString(v, pxVal(this.target?.style.left ?? 0));
  }

  get boundsY() {
    return this._boundsY;
  }
  /**
   * @param {string | null} v Relative `"min,max"` from current top, or `"null"` to lock.
   * Reparse uses `target.style.top` as offset — set `posTop` first when both change.
   */
  set boundsY(v) {
    this._boundsYAttr = v;
    this._boundsY = MoveBounds.fromString(v, pxVal(this.target?.style.top ?? 0));
  }

  get axis() {
    return this._axis;
  }
  set axis(v) {
    const normalized = v === 'x' || v === 'y' ? v : null;
    this._axis = normalized;
    this.applyAxisLock();
  }

  static styles = css`
    :host {
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
  `;

  static properties = {
    posLeft: { type: Number },
    posTop: { type: Number },
    target: { type: Object, attribute: false, state: true },
    targetSelector: { type: String },
    bounds: { type: Object, attribute: false, state: true },
    boundsX: { type: String },
    boundsY: { type: String },
    axis: { type: String },
    grid: { type: Number },
    dragAfterDist: { type: Number },
    shiftBehavior: {
      type: Boolean,
      converter: (value) => value !== null && value !== 'false',
    },
    disabled: {
      type: Boolean,
      converter: (value) => value !== null && value !== 'false',
    },
    eventsOnly: {
      type: Boolean,
      converter: (value) => value !== null && value !== 'false',
    },
    onmovestart: { type: Object, attribute: false },
    onmoveend: { type: Object, attribute: false },
    onmove: { type: Object, attribute: false },
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('pointermove', this._onPointerMove);
    this.addEventListener('pointerup', this._onPointerEnd);
    this.addEventListener('pointercancel', this._onPointerEnd);
    this.addEventListener('lostpointercapture', this._onPointerEnd);
    this._pointerBound = true;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._pointerBound) {
      this.removeEventListener('pointermove', this._onPointerMove);
      this.removeEventListener('pointerup', this._onPointerEnd);
      this.removeEventListener('pointercancel', this._onPointerEnd);
      this.removeEventListener('lostpointercapture', this._onPointerEnd);
      this._pointerBound = false;
    }
    this.renderRoot?.removeEventListener('pointerdown', this._onPointerDown);
    if (this._dragArmed) {
      this.unbind();
    }
  }

  firstUpdated() {
    if (this._retryTarget) {
      this.target = document.querySelector(this.targetSelector);
    }

    const { target, posTop, posLeft } = this;
    const {
      offsetLeft,
      offsetTop,
      style: { left, top },
    } = this.target;

    target.classList.add('--movable-base');
    this.renderRoot.addEventListener('pointerdown', this._onPointerDown);

    const computedPosition = getComputedStyle(target).position;
    if (computedPosition === 'static') {
      target.style.position = 'absolute';
    }

    this.style.touchAction = 'none';
    target.style.touchAction = 'none';

    if (posLeft != null) {
      target.style.left = Number(posLeft) + 'px';
    } else if (!left && offsetLeft) {
      target.style.left = offsetLeft + 'px';
    }
    if (posTop != null) {
      target.style.top = Number(posTop) + 'px';
    } else if (!top && offsetTop) {
      target.style.top = offsetTop + 'px';
    }

    // Re-parse attrs against resolved position, then apply axis lock.
    if (this._boundsXAttr != null) {
      this._boundsX = MoveBounds.fromString(
        this._boundsXAttr,
        pxVal(target.style.left ?? 0)
      );
    }
    if (this._boundsYAttr != null) {
      this._boundsY = MoveBounds.fromString(
        this._boundsYAttr,
        pxVal(target.style.top ?? 0)
      );
    }
    this.syncConstrainedBounds();
    this.applyAxisLock();
  }

  /** Pin constrained axes to the target's current left/top. */
  syncConstrainedBounds() {
    const { bounds, target } = this;
    const left = pxVal(target.style.left ?? 0);
    const top = pxVal(target.style.top ?? 0);
    if (bounds.left.constrained) {
      bounds.left.min = bounds.left.max = left;
    }
    if (bounds.top.constrained) {
      bounds.top.min = bounds.top.max = top;
    }
  }

  /** Lock the orthogonal axis when axis="x"|"y". */
  applyAxisLock() {
    if (!this.target) {
      return;
    }
    const left = pxVal(this.target.style.left ?? 0);
    const top = pxVal(this.target.style.top ?? 0);
    if (this._axis === 'x') {
      this._boundsY = new MoveBounds(top, top);
    } else if (this._axis === 'y') {
      this._boundsX = new MoveBounds(left, left);
    }
  }

  hasHandleSlot() {
    const slot = this.renderRoot?.querySelector('slot[name="handle"]');
    return (slot?.assignedElements({ flatten: true }) ?? []).length > 0;
  }

  isEventOnHandle(event) {
    if (!this.hasHandleSlot()) {
      return true;
    }
    const slot = this.renderRoot.querySelector('slot[name="handle"]');
    const assigned = slot.assignedElements({ flatten: true });
    const path = event.composedPath();
    return assigned.some((el) => path.includes(el));
  }

  reposition(pos) {
    if (typeof pos === 'object') {
      const { eventsOnly, target } = this;
      this.posTop = pos.top;
      this.posLeft = pos.left;
      if (target && !eventsOnly) {
        target.style.left = pos.left + 'px';
        target.style.top = pos.top + 'px';
      }
    } else {
      this.isMoving = pos;
    }
  }

  detailState() {
    return {
      coords: this.moveState.coords,
      startCoord: this.moveState.startCoord,
      moveDist: this.moveState.moveDist,
      totalDist: this.moveState.totalDist,
      mouseCoord: this.moveState.mouseCoord,
      clickOffset: this.moveState.clickOffset,
      posTop: this.posTop,
      posLeft: this.posLeft,
      pctX: this.moveState.pctX,
      pctY: this.moveState.pctY,
      isMoving: this.isMoving,
    };
  }

  eventBroker(name) {
    const detail = this.detailState();
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        detail,
      })
    );
    const attrEvent = this[`on${name}`];
    if (typeof attrEvent === 'function') {
      attrEvent(detail);
    }
  }

  moveInit(event) {
    const moveState = this.moveState;
    const { target, bounds } = this;

    moveState.mouseCoord = Coord.fromPointerEvent(event);
    moveState.startCoord = Coord.fromElementStyle(target);
    moveState.moveDist = new Coord(0, 0);
    moveState.totalDist = new Coord(0, 0);
    moveState.clickOffset = getClickOffset(event);
    moveState.coords = Coord.fromObject(moveState.startCoord);
    moveState.maxX =
      isFinite(bounds.left.min) && isFinite(bounds.left.max)
        ? bounds.left.min + bounds.left.max
        : Infinity;
    moveState.maxY =
      isFinite(bounds.top.min) && isFinite(bounds.top.max)
        ? bounds.top.min + bounds.top.max
        : Infinity;
    this._thresholdMet = this._dragAfterDist <= 0;
    this._dragArmed = true;
    this.isMoving = this._thresholdMet;
    if (this._thresholdMet) {
      this.eventBroker('movestart');
    }
  }

  unbind() {
    const pointerId = this.pointerId;
    this.pointerId = null;
    if (pointerId != null) {
      try {
        if (this.hasPointerCapture(pointerId)) {
          this.releasePointerCapture(pointerId);
        }
      } catch (_) {
        /* already released */
      }
    }
    this.moveEnd();
  }

  moveEnd() {
    const shouldEnd = this._thresholdMet && this.isMoving;
    this._dragArmed = false;
    if (shouldEnd) {
      this.isMoving = this.moveState.isMoving = false;
      this.eventBroker('moveend');
    } else {
      this.isMoving = false;
      this._thresholdMet = false;
    }
  }

  motionHandler(event) {
    if (!this._dragArmed) {
      return;
    }
    event.stopPropagation();

    const newCoord = Coord.fromPointerEvent(event);
    const moveState = this.moveState;
    const { grid, bounds, shiftBehavior } = this;

    moveState.moveDist = Coord.fromObject({
      x: newCoord.x - moveState.mouseCoord.x,
      y: newCoord.y - moveState.mouseCoord.y,
    });
    moveState.mouseCoord = newCoord;
    moveState.totalDist = Coord.fromObject({
      x: moveState.totalDist.x + moveState.moveDist.x,
      y: moveState.totalDist.y + moveState.moveDist.y,
    });

    if (!this._thresholdMet) {
      const traveled = Math.hypot(moveState.totalDist.x, moveState.totalDist.y);
      if (traveled < this._dragAfterDist) {
        return;
      }
      this._thresholdMet = true;
      this.isMoving = true;
      this.eventBroker('movestart');
      // Fall through so this same pointermove also applies position.
    }

    moveState.coords = Coord.fromObject({
      x: Math.round(moveState.totalDist.x / grid) * grid + moveState.startCoord.x,
      y: Math.round(moveState.totalDist.y / grid) * grid + moveState.startCoord.y,
    });

    if (
      shiftBehavior &&
      event.shiftKey &&
      bounds.left.unconstrained &&
      bounds.top.unconstrained
    ) {
      const { x, y } = moveState.totalDist;
      if (Math.abs(x) > Math.abs(y)) {
        moveState.coords.top = moveState.startCoord.y;
      } else {
        moveState.coords.left = moveState.startCoord.x;
      }
    } else {
      moveState.coords.y = Math.min(
        Math.max(bounds.top.min, moveState.coords.top),
        bounds.top.max
      );
      moveState.coords.x = Math.min(
        Math.max(bounds.left.min, moveState.coords.left),
        bounds.left.max
      );
    }

    if (isFinite(moveState.maxX)) {
      moveState.pctX = Math.max(bounds.left.min, moveState.coords.left) / moveState.maxX;
    }
    if (isFinite(moveState.maxY)) {
      moveState.pctY = Math.max(bounds.top.min, moveState.coords.top) / moveState.maxY;
    }

    this.reposition(moveState.coords);
    this.eventBroker('move');
  }

  pointerdown(event) {
    if (this.disabled || !this.isEventOnHandle(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.pointerId !== undefined) {
      this.pointerId = event.pointerId;
      try {
        this.setPointerCapture(event.pointerId);
      } catch (_) {
        // Synthetic PointerEvents are not active pointers; real input is fine.
      }
    }

    this.moveInit(event);
  }

  render() {
    return html`
      <slot name="handle"></slot>
      <slot></slot>
    `;
  }
}

window.customElements.get('movable-el') ||
  window.customElements.define('movable-el', Movable);

// Alias: CustomElementRegistry allows one constructor per define() call.
class LitMovable extends Movable {}
window.customElements.get('lit-movable') ||
  window.customElements.define('lit-movable', LitMovable);

export { LitMovable };
