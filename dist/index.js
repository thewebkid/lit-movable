import { LitElement as f, css as y, html as g } from "lit";
const h = (n) => isFinite(n) ? Number(n) : Number(n.replace(/[^0-9.\-]/g, "")), c = (n) => (n = Number(n), (isNaN(n) || [void 0, null].includes(n)) && (n = 0), n);
class i {
  constructor(t, o) {
    this.x = c(t), this.y = c(o);
  }
  static fromPointerEvent(t) {
    const { pageX: o, pageY: e } = t;
    return new i(o, e);
  }
  static fromElementStyle(t) {
    let o = h(t.style.left ?? 0), e = h(t.style.top ?? 0);
    return new i(o, e);
  }
  static fromObject({ x: t, y: o }) {
    return new i(t, o);
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
const b = (n) => {
  const t = i.fromPointerEvent(n), o = n.target.getBoundingClientRect();
  let e = t.x - (o.left + document.body.scrollLeft), s = t.y - (o.top + document.body.scrollTop);
  return new i(e, s);
};
class l {
  constructor(t = -1 / 0, o = 1 / 0) {
    this.min = t, this.max = o, this.attr = "";
  }
  get constrained() {
    return this.min === this.max;
  }
  get unconstrained() {
    return this.min === -1 / 0 && this.max === 1 / 0;
  }
  static fromString(t = null, o = 0) {
    if (!t)
      return new l();
    if (t === "null")
      return new l(o, o);
    let [e, s] = t.split(",").map((a) => Number(a.trim()) + o), r = new l(e, s);
    return r.attr = t, r;
  }
}
class x extends f {
  _target;
  _targetSelector = null;
  _boundsX = new l();
  _boundsY = new l();
  isMoving = !1;
  moveState = {};
  _vertical = null;
  _horizontal = null;
  _posTop = null;
  _posLeft = null;
  _grid = 1;
  pointerId;
  constructor() {
    super();
  }
  get vertical() {
    return this._vertical;
  }
  set vertical(t) {
    this.boundsY = t, this.boundsX = "null", this._vertical = t;
  }
  get horizontal() {
    return this._horizontal;
  }
  set horizontal(t) {
    this.boundsX = t, this.boundsY = "null", this._horizontal = t;
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
    this._boundsX = l.fromString(t, h(this.target?.style.left ?? 0));
  }
  get boundsY() {
    return this._boundsY;
  }
  set boundsY(t) {
    this._boundsY = l.fromString(t, h(this.target?.style.top ?? 0));
  }
  static styles = y`
    :host {
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
  `;
  static properties = {
    //set the left/top position
    // defaults to  element.offsetTop /offsetLeft
    posLeft: { type: Number },
    posTop: { type: Number },
    // target element that moves - defaults to root element
    target: { type: Object, attribute: !1, state: !0 },
    // selector that will set the target element that will move
    targetSelector: { type: String },
    // object (left:boundsX,top:boundsY)
    bounds: { type: Object, attribute: !1, state: !0 },
    // Both x and y default to -Infinity,Infinity.
    // Set to boundsX="min,max" ([0,0] to restrict the axis)
    // these are attribute string setters meant for declarative
    // element attribute setting
    boundsX: { type: String },
    boundsY: { type: String },
    // vertical="min,max" - constrain movement to y axis within min and max numbers provided.
    // automatically disables horizontal movement
    vertical: { type: String },
    // horizontal="min,max" - constrain movement to x axis within min and max provided.
    // automatically disables vertical movement
    horizontal: { type: String },
    //defaults to 1. snap to grid size in pixels.
    grid: { type: Number },
    // set to true enables shift key to constrain movement to either
    // x or y axis (whichever is greater).
    // Setting any bounds option automatically disables shift key behavior.
    shiftBehavior: { type: Boolean, converter: (t) => t !== null && t !== "false" },
    //disables moving
    disabled: { type: Boolean, converter: (t) => t !== null && t !== "false" },
    // advanced mode: Does not move the element, but fires
    // events so you can pass to your own handler
    eventsOnly: { type: Boolean, converter: (t) => t !== null && t !== "false" },
    listening: { type: Boolean },
    onmovestart: { type: Object },
    onmoveend: { type: Object },
    onmove: { type: Object }
  };
  firstUpdated(t) {
    this._retryTarget && (this.target = document.querySelector(this.targetSelector));
    let { bounds: o, target: e, posTop: s, posLeft: r } = this, { offsetLeft: a, offsetTop: p, style: { left: d, top: u } } = this.target;
    e.classList.add("--movable-base"), this.renderRoot.addEventListener("pointerdown", (m) => this.pointerdown(m)), e.style.position = "absolute", e.style.cursor = "pointer", this.style.touchAction = "none", e.style.touchAction = "none", r != null ? e.style.left = Number(r) + "px" : !d && a && (e.style.left = a + "px"), s != null ? e.style.top = Number(s) + "px" : !u && p && (e.style.top = p + "px"), this.syncConstrainedBounds();
  }
  /** Pin constrained axes to the target's current left/top. */
  syncConstrainedBounds() {
    const { bounds: t, target: o } = this, e = h(o.style.left ?? 0), s = h(o.style.top ?? 0);
    t.left.constrained && (t.left.min = t.left.max = e), t.top.constrained && (t.top.min = t.top.max = s);
  }
  reposition(t) {
    if (typeof t == "object") {
      const { eventsOnly: o, target: e } = this;
      this.posTop = t.top, this.posLeft = t.left, e && !o && (e.style.left = t.left + "px", e.style.top = t.top + "px");
    } else
      this.isMoving = t;
  }
  moveInit(t) {
    let o = this.moveState, { target: e, bounds: s } = this;
    o.mouseCoord = i.fromPointerEvent(t), o.startCoord = i.fromElementStyle(e), o.moveDist = new i(0, 0), o.totalDist = new i(0, 0), o.clickOffset = b(t), o.coords = i.fromObject(o.startCoord), o.maxX = isFinite(s.left.min) && isFinite(s.left.max) ? s.left.min + s.left.max : 1 / 0, o.maxY = isFinite(s.top.min) && isFinite(s.top.max) ? s.top.min + s.top.max : 1 / 0, this.isMoving = !0, this.reposition(!0), this.eventBroker("movestart", t);
  }
  eventBroker(t, o) {
    this.moveState.posTop = this.posTop, this.moveState.posLeft = this.posLeft;
    let e = new CustomEvent(t, {
      bubbles: !0,
      composed: !0,
      detail: { ...o, ...this.moveState, element: this }
    });
    this.renderRoot.dispatchEvent(e);
    let s = this[`on${t}`];
    s && s({ ...o, ...this.moveState, me: this });
  }
  unbind(t) {
    const o = this.pointerId;
    if (this.pointerId = null, o != null)
      try {
        this.hasPointerCapture(o) && this.releasePointerCapture(o);
      } catch {
      }
    this.moveEnd(t);
  }
  moveEnd(t) {
    this.isMoving && (this.isMoving = this.moveState.isMoving = !1, this.reposition(!1), this.eventBroker("moveend", t));
  }
  motionHandler(t) {
    t.stopPropagation();
    let o = i.fromPointerEvent(t), e = this.moveState, { grid: s, bounds: r, shiftBehavior: a, boundsX: p, boundsY: d } = this;
    if (e.moveDist = i.fromObject({
      x: o.x - e.mouseCoord.x,
      y: o.y - e.mouseCoord.y
    }), e.mouseCoord = o, e.totalDist = i.fromObject({
      x: e.totalDist.x + e.moveDist.x,
      y: e.totalDist.y + e.moveDist.y
    }), e.coords = i.fromObject({
      x: Math.round(e.totalDist.x / s) * s + e.startCoord.x,
      y: Math.round(e.totalDist.y / s) * s + e.startCoord.y
    }), a && t.shiftKey && p.unconstrained && d.unconstrained) {
      let { x: u, y: m } = e.totalDist;
      Math.abs(u) > Math.abs(m) ? e.coords.top = e.startCoord.y : e.coords.left = e.startCoord.x;
    } else
      e.coords.y = Math.min(Math.max(r.top.min, e.coords.top), r.top.max), e.coords.x = Math.min(Math.max(r.left.min, e.coords.left), r.left.max);
    isFinite(e.maxX) && (e.pctX = Math.max(r.left.min, e.coords.left) / e.maxX), isFinite(e.maxY) && (e.pctY = Math.max(r.top.min, e.coords.top) / e.maxY), this.reposition(e.coords), this.eventBroker("move", t);
  }
  pointerdown(t) {
    if (!this.disabled) {
      if (t.preventDefault(), t.stopPropagation(), t.pointerId !== void 0) {
        this.pointerId = t.pointerId;
        try {
          this.setPointerCapture(t.pointerId);
        } catch {
        }
      }
      if (!this.listening) {
        const o = (e) => {
          this.isMoving && this.unbind(e);
        };
        this.addEventListener("pointerup", o), this.addEventListener("pointercancel", o), this.addEventListener("lostpointercapture", o), this.addEventListener("pointermove", (e) => {
          this.pointerId !== void 0 && e.pointerId === this.pointerId && this.motionHandler(e);
        });
      }
      this.listening = !0, this.moveInit(t);
    }
  }
  render() {
    return g`<slot></slot>`;
  }
}
window.customElements.get("lit-movable") || window.customElements.define("lit-movable", x);
export {
  x as LitMovable
};
