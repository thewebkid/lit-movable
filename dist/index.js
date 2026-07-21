import { LitElement as f, css as m, html as g } from "lit";
const l = (n) => isFinite(n) ? Number(n) : Number(String(n).replace(/[^0-9.\-]/g, "")), c = (n) => (n = Number(n), (isNaN(n) || [void 0, null].includes(n)) && (n = 0), n);
class r {
  constructor(t, s) {
    this.x = c(t), this.y = c(s);
  }
  static fromPointerEvent(t) {
    const { pageX: s, pageY: e } = t;
    return new r(s, e);
  }
  static fromElementStyle(t) {
    const s = l(t.style.left ?? 0), e = l(t.style.top ?? 0);
    return new r(s, e);
  }
  static fromObject({ x: t, y: s }) {
    return new r(t, s);
  }
  get top() {
    return this.y;
  }
  set top(t) {
    this.y = t;
  }
  get left() {
    return this.x;
  }
  set left(t) {
    this.x = t;
  }
}
const y = (n) => {
  const t = r.fromPointerEvent(n), s = n.target.getBoundingClientRect(), e = t.x - (s.left + document.body.scrollLeft), o = t.y - (s.top + document.body.scrollTop);
  return new r(e, o);
};
class a {
  constructor(t = -1 / 0, s = 1 / 0) {
    this.min = t, this.max = s, this.attr = "";
  }
  get constrained() {
    return this.min === this.max;
  }
  get unconstrained() {
    return this.min === -1 / 0 && this.max === 1 / 0;
  }
  static fromString(t = null, s = 0) {
    if (!t)
      return new a();
    if (t === "null")
      return new a(s, s);
    const [e, o] = t.split(",").map((d) => Number(d.trim()) + s), i = new a(e, o);
    return i.attr = t, i;
  }
}
class p extends f {
  _target;
  _targetSelector = null;
  _boundsX = new a();
  _boundsY = new a();
  _axis = null;
  _posTop = null;
  _posLeft = null;
  _grid = 1;
  _dragAfterDist = 0;
  _boundsXAttr = null;
  _boundsYAttr = null;
  _pointerBound = !1;
  _dragArmed = !1;
  _thresholdMet = !1;
  pointerId;
  isMoving = !1;
  moveState = {};
  constructor() {
    super(), this._onPointerDown = (t) => this.pointerdown(t), this._onPointerMove = (t) => {
      this.pointerId !== void 0 && t.pointerId === this.pointerId && this.motionHandler(t);
    }, this._onPointerEnd = (t) => {
      this._dragArmed && this.unbind(t);
    };
  }
  set posTop(t) {
    t = Number(t), this._posTop = t, this.target && !this.eventsOnly && (this.target.style.top = t + "px");
  }
  get posTop() {
    return this._posTop;
  }
  set posLeft(t) {
    t = Number(t), this._posLeft = t, this.target && !this.eventsOnly && (this.target.style.left = t + "px");
  }
  get posLeft() {
    return this._posLeft;
  }
  get grid() {
    return this._grid;
  }
  set grid(t) {
    t > 0 && t < 1 / 0 ? this._grid = t : this._grid = 1;
  }
  get dragAfterDist() {
    return this._dragAfterDist;
  }
  set dragAfterDist(t) {
    const s = Number(t);
    this._dragAfterDist = s > 0 ? s : 0;
  }
  get bounds() {
    return {
      left: this._boundsX,
      top: this._boundsY
    };
  }
  set targetSelector(t) {
    this._targetSelector = t, this._retryTarget = document.querySelector(t) === null, this._target = document.querySelector(t);
  }
  get targetSelector() {
    return this._targetSelector;
  }
  get target() {
    return this._target ?? this;
  }
  set target(t) {
    this._target = t;
  }
  get boundsX() {
    return this._boundsX;
  }
  set boundsX(t) {
    this._boundsXAttr = t, this._boundsX = a.fromString(t, l(this.target?.style.left ?? 0));
  }
  get boundsY() {
    return this._boundsY;
  }
  set boundsY(t) {
    this._boundsYAttr = t, this._boundsY = a.fromString(t, l(this.target?.style.top ?? 0));
  }
  get axis() {
    return this._axis;
  }
  set axis(t) {
    const s = t === "x" || t === "y" ? t : null;
    this._axis = s, this.applyAxisLock();
  }
  static styles = m`
    :host {
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
  `;
  static properties = {
    posLeft: { type: Number },
    posTop: { type: Number },
    target: { type: Object, attribute: !1, state: !0 },
    targetSelector: { type: String },
    bounds: { type: Object, attribute: !1, state: !0 },
    boundsX: { type: String },
    boundsY: { type: String },
    axis: { type: String },
    grid: { type: Number },
    dragAfterDist: { type: Number },
    shiftBehavior: {
      type: Boolean,
      converter: (t) => t !== null && t !== "false"
    },
    disabled: {
      type: Boolean,
      converter: (t) => t !== null && t !== "false"
    },
    eventsOnly: {
      type: Boolean,
      converter: (t) => t !== null && t !== "false"
    },
    onmovestart: { type: Object, attribute: !1 },
    onmoveend: { type: Object, attribute: !1 },
    onmove: { type: Object, attribute: !1 }
  };
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("pointermove", this._onPointerMove), this.addEventListener("pointerup", this._onPointerEnd), this.addEventListener("pointercancel", this._onPointerEnd), this.addEventListener("lostpointercapture", this._onPointerEnd), this._pointerBound = !0;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._pointerBound && (this.removeEventListener("pointermove", this._onPointerMove), this.removeEventListener("pointerup", this._onPointerEnd), this.removeEventListener("pointercancel", this._onPointerEnd), this.removeEventListener("lostpointercapture", this._onPointerEnd), this._pointerBound = !1), this.renderRoot?.removeEventListener("pointerdown", this._onPointerDown), this._dragArmed && this.unbind();
  }
  firstUpdated() {
    this._retryTarget && (this.target = document.querySelector(this.targetSelector));
    const { target: t, posTop: s, posLeft: e } = this, {
      offsetLeft: o,
      offsetTop: i,
      style: { left: d, top: h }
    } = this.target;
    t.classList.add("--movable-base"), this.renderRoot.addEventListener("pointerdown", this._onPointerDown), getComputedStyle(t).position === "static" && (t.style.position = "absolute"), this.style.touchAction = "none", t.style.touchAction = "none", e != null ? t.style.left = Number(e) + "px" : !d && o && (t.style.left = o + "px"), s != null ? t.style.top = Number(s) + "px" : !h && i && (t.style.top = i + "px"), this._boundsXAttr != null && (this._boundsX = a.fromString(
      this._boundsXAttr,
      l(t.style.left ?? 0)
    )), this._boundsYAttr != null && (this._boundsY = a.fromString(
      this._boundsYAttr,
      l(t.style.top ?? 0)
    )), this.syncConstrainedBounds(), this.applyAxisLock();
  }
  /** Pin constrained axes to the target's current left/top. */
  syncConstrainedBounds() {
    const { bounds: t, target: s } = this, e = l(s.style.left ?? 0), o = l(s.style.top ?? 0);
    t.left.constrained && (t.left.min = t.left.max = e), t.top.constrained && (t.top.min = t.top.max = o);
  }
  /** Lock the orthogonal axis when axis="x"|"y". */
  applyAxisLock() {
    if (!this.target)
      return;
    const t = l(this.target.style.left ?? 0), s = l(this.target.style.top ?? 0);
    this._axis === "x" ? this._boundsY = new a(s, s) : this._axis === "y" && (this._boundsX = new a(t, t));
  }
  hasHandleSlot() {
    return (this.renderRoot?.querySelector('slot[name="handle"]')?.assignedElements({ flatten: !0 }) ?? []).length > 0;
  }
  isEventOnHandle(t) {
    if (!this.hasHandleSlot())
      return !0;
    const e = this.renderRoot.querySelector('slot[name="handle"]').assignedElements({ flatten: !0 }), o = t.composedPath();
    return e.some((i) => o.includes(i));
  }
  reposition(t) {
    if (typeof t == "object") {
      const { eventsOnly: s, target: e } = this;
      this.posTop = t.top, this.posLeft = t.left, e && !s && (e.style.left = t.left + "px", e.style.top = t.top + "px");
    } else
      this.isMoving = t;
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
      isMoving: this.isMoving
    };
  }
  eventBroker(t) {
    const s = this.detailState();
    this.dispatchEvent(
      new CustomEvent(t, {
        bubbles: !0,
        composed: !0,
        detail: s
      })
    );
    const e = this[`on${t}`];
    typeof e == "function" && e(s);
  }
  moveInit(t) {
    const s = this.moveState, { target: e, bounds: o } = this;
    s.mouseCoord = r.fromPointerEvent(t), s.startCoord = r.fromElementStyle(e), s.moveDist = new r(0, 0), s.totalDist = new r(0, 0), s.clickOffset = y(t), s.coords = r.fromObject(s.startCoord), s.maxX = isFinite(o.left.min) && isFinite(o.left.max) ? o.left.min + o.left.max : 1 / 0, s.maxY = isFinite(o.top.min) && isFinite(o.top.max) ? o.top.min + o.top.max : 1 / 0, this._thresholdMet = this._dragAfterDist <= 0, this._dragArmed = !0, this.isMoving = this._thresholdMet, this._thresholdMet && this.eventBroker("movestart");
  }
  unbind() {
    const t = this.pointerId;
    if (this.pointerId = null, t != null)
      try {
        this.hasPointerCapture(t) && this.releasePointerCapture(t);
      } catch {
      }
    this.moveEnd();
  }
  moveEnd() {
    const t = this._thresholdMet && this.isMoving;
    this._dragArmed = !1, t ? (this.isMoving = this.moveState.isMoving = !1, this.eventBroker("moveend")) : (this.isMoving = !1, this._thresholdMet = !1);
  }
  motionHandler(t) {
    if (!this._dragArmed)
      return;
    t.stopPropagation();
    const s = r.fromPointerEvent(t), e = this.moveState, { grid: o, bounds: i, shiftBehavior: d } = this;
    if (e.moveDist = r.fromObject({
      x: s.x - e.mouseCoord.x,
      y: s.y - e.mouseCoord.y
    }), e.mouseCoord = s, e.totalDist = r.fromObject({
      x: e.totalDist.x + e.moveDist.x,
      y: e.totalDist.y + e.moveDist.y
    }), !this._thresholdMet) {
      if (Math.hypot(e.totalDist.x, e.totalDist.y) < this._dragAfterDist)
        return;
      this._thresholdMet = !0, this.isMoving = !0, this.eventBroker("movestart");
    }
    if (e.coords = r.fromObject({
      x: Math.round(e.totalDist.x / o) * o + e.startCoord.x,
      y: Math.round(e.totalDist.y / o) * o + e.startCoord.y
    }), d && t.shiftKey && i.left.unconstrained && i.top.unconstrained) {
      const { x: h, y: u } = e.totalDist;
      Math.abs(h) > Math.abs(u) ? e.coords.top = e.startCoord.y : e.coords.left = e.startCoord.x;
    } else
      e.coords.y = Math.min(
        Math.max(i.top.min, e.coords.top),
        i.top.max
      ), e.coords.x = Math.min(
        Math.max(i.left.min, e.coords.left),
        i.left.max
      );
    isFinite(e.maxX) && (e.pctX = Math.max(i.left.min, e.coords.left) / e.maxX), isFinite(e.maxY) && (e.pctY = Math.max(i.top.min, e.coords.top) / e.maxY), this.reposition(e.coords), this.eventBroker("move");
  }
  pointerdown(t) {
    if (!(this.disabled || !this.isEventOnHandle(t))) {
      if (t.preventDefault(), t.stopPropagation(), t.pointerId !== void 0) {
        this.pointerId = t.pointerId;
        try {
          this.setPointerCapture(t.pointerId);
        } catch {
        }
      }
      this.moveInit(t);
    }
  }
  render() {
    return g`
      <slot name="handle"></slot>
      <slot></slot>
    `;
  }
}
window.customElements.get("movable-el") || window.customElements.define("movable-el", p);
class b extends p {
}
window.customElements.get("lit-movable") || window.customElements.define("lit-movable", b);
export {
  b as LitMovable,
  p as Movable
};
