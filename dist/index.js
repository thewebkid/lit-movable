var ct = Object.defineProperty;
var pt = (o, t, e) => t in o ? ct(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var f = (o, t, e) => (pt(o, typeof t != "symbol" ? t + "" : t, e), e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, Y = L.ShadowRoot && (L.ShadyCSS === void 0 || L.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, it = Symbol(), W = /* @__PURE__ */ new WeakMap();
let ut = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== it)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Y && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = W.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && W.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ft = (o) => new ut(typeof o == "string" ? o : o + "", void 0, it), mt = (o, t) => {
  if (Y)
    o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else
    for (const e of t) {
      const s = document.createElement("style"), i = L.litNonce;
      i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, o.appendChild(s);
    }
}, F = Y ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules)
    e += s.cssText;
  return ft(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: $t, defineProperty: _t, getOwnPropertyDescriptor: gt, getOwnPropertyNames: yt, getOwnPropertySymbols: bt, getPrototypeOf: At } = Object, y = globalThis, V = y.trustedTypes, vt = V ? V.emptyScript : "", D = y.reactiveElementPolyfillSupport, C = (o, t) => o, X = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? vt : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, ot = (o, t) => !$t(o, t), q = { attribute: !0, type: String, converter: X, reflect: !1, hasChanged: ot };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class S extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = q) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && _t(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: r } = gt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get() {
      return i == null ? void 0 : i.call(this);
    }, set(n) {
      const a = i == null ? void 0 : i.call(this);
      r.call(this, n), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? q;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties")))
      return;
    const t = At(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, s = [...yt(e), ...bt(e)];
      for (const i of s)
        this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0)
        for (const [s, i] of e)
          this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s)
        e.unshift(F(i));
    } else
      t !== void 0 && e.push(F(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$Eg = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$ES(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$E_ ?? (this._$E_ = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$E_) == null || e.delete(t);
  }
  _$ES() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys())
      this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return mt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$E_) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$E_) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$EO(t, e) {
    var r;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : X).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((r = n.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? n.converter : X;
      this._$Em = i, this[i] = a.fromAttribute(e, n.type), this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, r) {
    if (t !== void 0) {
      if (s ?? (s = this.constructor.getPropertyOptions(t)), !(s.hasChanged ?? ot)(i ? r : this[t], e))
        return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$Eg = this._$EP());
  }
  C(t, e, s) {
    this._$AL.has(t) || this._$AL.set(t, e), s.reflect === !0 && this._$Em !== t && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t);
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$Eg;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, n] of this._$Ep)
          this[r] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0)
        for (const [r, n] of i)
          n.wrapped !== !0 || this._$AL.has(r) || this[r] === void 0 || this.C(r, this[r], n);
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$E_) == null || s.forEach((i) => {
        var r;
        return (r = i.hostUpdate) == null ? void 0 : r.call(i);
      }), this.update(e)) : this._$ET();
    } catch (i) {
      throw t = !1, this._$ET(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$E_) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$ET() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$Eg;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((e) => this._$EO(e, this[e]))), this._$ET();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
}
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[C("elementProperties")] = /* @__PURE__ */ new Map(), S[C("finalized")] = /* @__PURE__ */ new Map(), D == null || D({ ReactiveElement: S }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.0.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, R = P.trustedTypes, K = R ? R.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, rt = "$lit$", _ = `lit$${(Math.random() + "").slice(9)}$`, nt = "?" + _, St = `<${nt}>`, v = document, N = () => v.createComment(""), O = (o) => o === null || typeof o != "object" && typeof o != "function", ht = Array.isArray, Et = (o) => ht(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", z = `[ 	
\f\r]`, w = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, J = /-->/g, Z = />/g, b = RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), G = /'/g, Q = /"/g, lt = /^(?:script|style|textarea|title)$/i, xt = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), wt = xt(1), E = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), tt = /* @__PURE__ */ new WeakMap(), A = v.createTreeWalker(v, 129);
function at(o, t) {
  if (!Array.isArray(o) || !o.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return K !== void 0 ? K.createHTML(t) : t;
}
const Ct = (o, t) => {
  const e = o.length - 1, s = [];
  let i, r = t === 2 ? "<svg>" : "", n = w;
  for (let a = 0; a < e; a++) {
    const h = o[a];
    let d, c, l = -1, m = 0;
    for (; m < h.length && (n.lastIndex = m, c = n.exec(h), c !== null); )
      m = n.lastIndex, n === w ? c[1] === "!--" ? n = J : c[1] !== void 0 ? n = Z : c[2] !== void 0 ? (lt.test(c[2]) && (i = RegExp("</" + c[2], "g")), n = b) : c[3] !== void 0 && (n = b) : n === b ? c[0] === ">" ? (n = i ?? w, l = -1) : c[1] === void 0 ? l = -2 : (l = n.lastIndex - c[2].length, d = c[1], n = c[3] === void 0 ? b : c[3] === '"' ? Q : G) : n === Q || n === G ? n = b : n === J || n === Z ? n = w : (n = b, i = void 0);
    const $ = n === b && o[a + 1].startsWith("/>") ? " " : "";
    r += n === w ? h + St : l >= 0 ? (s.push(d), h.slice(0, l) + rt + h.slice(l) + _ + $) : h + _ + (l === -2 ? a : $);
  }
  return [at(o, r + (o[e] || "<?>") + (t === 2 ? "</svg>" : "")), s];
};
class M {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let r = 0, n = 0;
    const a = t.length - 1, h = this.parts, [d, c] = Ct(t, e);
    if (this.el = M.createElement(d, s), A.currentNode = this.el.content, e === 2) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (i = A.nextNode()) !== null && h.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes())
          for (const l of i.getAttributeNames())
            if (l.endsWith(rt)) {
              const m = c[n++], $ = i.getAttribute(l).split(_), H = /([.?@])?(.*)/.exec(m);
              h.push({ type: 1, index: r, name: H[2], strings: $, ctor: H[1] === "." ? Tt : H[1] === "?" ? Nt : H[1] === "@" ? Ot : k }), i.removeAttribute(l);
            } else
              l.startsWith(_) && (h.push({ type: 6, index: r }), i.removeAttribute(l));
        if (lt.test(i.tagName)) {
          const l = i.textContent.split(_), m = l.length - 1;
          if (m > 0) {
            i.textContent = R ? R.emptyScript : "";
            for (let $ = 0; $ < m; $++)
              i.append(l[$], N()), A.nextNode(), h.push({ type: 2, index: ++r });
            i.append(l[m], N());
          }
        }
      } else if (i.nodeType === 8)
        if (i.data === nt)
          h.push({ type: 2, index: r });
        else {
          let l = -1;
          for (; (l = i.data.indexOf(_, l + 1)) !== -1; )
            h.push({ type: 7, index: r }), l += _.length - 1;
        }
      r++;
    }
  }
  static createElement(t, e) {
    const s = v.createElement("template");
    return s.innerHTML = t, s;
  }
}
function x(o, t, e = o, s) {
  var n, a;
  if (t === E)
    return t;
  let i = s !== void 0 ? (n = e._$Co) == null ? void 0 : n[s] : e._$Cl;
  const r = O(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((a = i == null ? void 0 : i._$AO) == null || a.call(i, !1), r === void 0 ? i = void 0 : (i = new r(o), i._$AT(o, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = x(o, i._$AS(o, t.values), i, s)), t;
}
class Pt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? v).importNode(e, !0);
    A.currentNode = i;
    let r = A.nextNode(), n = 0, a = 0, h = s[0];
    for (; h !== void 0; ) {
      if (n === h.index) {
        let d;
        h.type === 2 ? d = new U(r, r.nextSibling, this, t) : h.type === 1 ? d = new h.ctor(r, h.name, h.strings, this, t) : h.type === 6 && (d = new Mt(r, this, t)), this._$AV.push(d), h = s[++a];
      }
      n !== (h == null ? void 0 : h.index) && (r = A.nextNode(), n++);
    }
    return A.currentNode = v, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV)
      s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class U {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = x(this, t, e), O(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.g(t) : t.nodeType !== void 0 ? this.$(t) : Et(t) ? this.T(t) : this._(t);
  }
  k(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  $(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.k(t));
  }
  _(t) {
    this._$AH !== p && O(this._$AH) ? this._$AA.nextSibling.data = t : this.$(v.createTextNode(t)), this._$AH = t;
  }
  g(t) {
    var r;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = M.createElement(at(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i)
      this._$AH.p(e);
    else {
      const n = new Pt(i, this), a = n.u(this.options);
      n.p(e), this.$(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = tt.get(t.strings);
    return e === void 0 && tt.set(t.strings, e = new M(t)), e;
  }
  T(t) {
    ht(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const r of t)
      i === e.length ? e.push(s = new U(this.k(N()), this.k(N()), this, this.options)) : s = e[i], s._$AI(r), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class k {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, r) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, i) {
    const r = this.strings;
    let n = !1;
    if (r === void 0)
      t = x(this, t, e, 0), n = !O(t) || t !== this._$AH && t !== E, n && (this._$AH = t);
    else {
      const a = t;
      let h, d;
      for (t = r[0], h = 0; h < r.length - 1; h++)
        d = x(this, a[s + h], e, h), d === E && (d = this._$AH[h]), n || (n = !O(d) || d !== this._$AH[h]), d === p ? t = p : t !== p && (t += (d ?? "") + r[h + 1]), this._$AH[h] = d;
    }
    n && !i && this.O(t);
  }
  O(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Tt extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  O(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Nt extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  O(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Ot extends k {
  constructor(t, e, s, i, r) {
    super(t, e, s, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? p) === E)
      return;
    const s = this._$AH, i = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Mt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const j = P.litHtmlPolyfillSupport;
j == null || j(M, U), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.1.0");
const Ut = (o, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new U(t.insertBefore(N(), r), r, void 0, e ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class T extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ut(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return E;
  }
}
var st;
T._$litElement$ = !0, T.finalized = !0, (st = globalThis.litElementHydrateSupport) == null || st.call(globalThis, { LitElement: T });
const B = globalThis.litElementPolyfillSupport;
B == null || B({ LitElement: T });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.2");
const I = (o) => isFinite(o) ? Number(o) : Number(o.replace(/[^0-9.\-]/g, "")), et = (o) => (o = Number(o), (isNaN(o) || [void 0, null].includes(o)) && (o = 0), o);
class u {
  constructor(t, e) {
    this.x = et(t), this.y = et(e);
  }
  static fromPointerEvent(t) {
    const { pageX: e, pageY: s } = t;
    return new u(e, s);
  }
  static fromElementStyle(t) {
    let e = I(t.style.left ?? 0), s = I(t.style.top ?? 0);
    return new u(e, s);
  }
  static fromObject({ x: t, y: e }) {
    return new u(t, e);
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
const Ht = (o) => {
  const t = u.fromPointerEvent(o), e = o.target.getBoundingClientRect();
  let s = t.x - (e.left + document.body.scrollLeft), i = t.y - (e.top + document.body.scrollTop);
  return new u(s, i);
};
class g {
  constructor(t = -1 / 0, e = 1 / 0) {
    this.min = t, this.max = e, this.attr = "";
  }
  get constrained() {
    return this.min === this.max;
  }
  get unconstrained() {
    return this.min === -1 / 0 && this.max === 1 / 0;
  }
  static fromString(t = null, e = 0) {
    if (!t)
      return new g();
    if (t === "null")
      return new g(0, 0);
    let [s, i] = t.split(",").map((n) => Number(n.trim()) + e), r = new g(s, i);
    return r.attr = t, r;
  }
}
class dt extends T {
  constructor() {
    super();
    f(this, "_target");
    f(this, "_targetSelector", null);
    f(this, "_boundsX", new g());
    f(this, "_boundsY", new g());
    f(this, "isMoving", !1);
    f(this, "moveState", {});
    f(this, "_vertical", null);
    f(this, "_horizontal", null);
    f(this, "_posTop", null);
    f(this, "_posLeft", null);
    f(this, "_grid", 1);
    f(this, "pointerId");
  }
  get vertical() {
    return this._vertical;
  }
  set vertical(e) {
    this.boundsY = e, this.boundsX = "null", this._vertical = e;
  }
  get horizontal() {
    return this._horizontal;
  }
  set horizontal(e) {
    this.boundsX = e, this.boundsY = "null", this._horizontal = e;
  }
  set posTop(e) {
    e = Number(e), this._posTop = e, this.target && (this.target.style.top = e + "px");
  }
  get posTop() {
    return this._posTop;
  }
  set posLeft(e) {
    e = Number(e), this._posLeft = e, this.target && (this.target.style.left = e + "px");
  }
  get posLeft() {
    return this._posLeft;
  }
  get grid() {
    return this._grid;
  }
  set grid(e) {
    e > 0 && e < 1 / 0 ? this._grid = e : this._grid = 1;
  }
  get bounds() {
    return {
      left: this._boundsX,
      top: this._boundsY
    };
  }
  set targetSelector(e) {
    this._targetSelector = e, this._retryTarget = document.querySelector(e) === null, this._target = document.querySelector(e);
  }
  get targetSelector() {
    return this._targetSelector;
  }
  get target() {
    return this._target ?? this;
  }
  set target(e) {
    this._target = e;
  }
  get boundsX() {
    return this._boundsX;
  }
  set boundsX(e) {
    var s;
    this._boundsX = g.fromString(e, I(((s = this.target) == null ? void 0 : s.style.left) ?? 0)), this.bounds.left = this._boundsX;
  }
  get boundsY() {
    return this._boundsY;
  }
  set boundsY(e) {
    var s;
    this._boundsY = g.fromString(e, I(((s = this.target) == null ? void 0 : s.style.top) ?? 0)), this.bounds.top = this._boundsY;
  }
  firstUpdated(e) {
    this._retryTarget && (this.target = document.querySelector(this.targetSelector));
    let { bounds: s, target: i, posTop: r, posLeft: n } = this, { offsetLeft: a, offsetTop: h, style: { left: d, top: c } } = this.target;
    i.classList.add("--movable-base"), this.renderRoot.addEventListener("pointerdown", (l) => this.pointerdown(l)), i.style.position = "absolute", i.style.cursor = "pointer", n ? i.style.left = n + "px" : !d && a && (i.style.left = a + "px", s.left.constrained && (s.left.min = s.left.max = a)), r ? i.style.top = r + "px" : !c && h && (i.style.top = h + "px", s.top.constrained && (s.top.min = s.top.max = h));
  }
  reposition(e) {
    if (typeof e == "object") {
      const { eventsOnly: s, target: i } = this;
      this.posTop = e.top, this.posLeft = e.left, i && !s && (i.style.left = e.left + "px", i.style.top = e.top + "px");
    } else
      this.isMoving = e;
  }
  moveInit(e) {
    let s = this.moveState, { target: i, bounds: r } = this;
    s.mouseCoord = u.fromPointerEvent(e), s.startCoord = u.fromElementStyle(i), s.moveDist = new u(0, 0), s.totalDist = new u(0, 0), s.clickOffset = Ht(e), s.coords = u.fromObject(s.startCoord), s.maxX = isFinite(r.left.min) && isFinite(r.left.max) ? r.left.min + r.left.max : 1 / 0, s.maxY = isFinite(r.top.min) && isFinite(r.top.max) ? r.top.min + r.top.max : 1 / 0, this.isMoving = !0, this.reposition(!0), this.eventBroker("movestart", e);
  }
  eventBroker(e, s) {
    this.moveState.posTop = this.posTop, this.moveState.posLeft = this.posLeft;
    let i = new CustomEvent(e, {
      bubbles: !0,
      composed: !0,
      detail: { ...s, ...this.moveState, element: this }
    });
    this.renderRoot.dispatchEvent(i);
    let r = this[`on${e}`];
    r && r({ ...s, ...this.moveState, me: this });
  }
  unbind(e) {
    this.pointerId = null, this.isMoving = !1, document.body.removeEventListener("pointermove", (s) => this.motionHandler(s)), this.moveEnd(e);
  }
  moveEnd(e) {
    document.body.removeEventListener("pointerup", (s) => this.unbind(s)), this.isMoving = this.moveState.isMoving = !1, this.reposition(!1), this.eventBroker("moveend", e);
  }
  motionHandler(e) {
    e.stopPropagation();
    let s = u.fromPointerEvent(e), i = this.moveState, { grid: r, bounds: n, shiftBehavior: a, boundsX: h, boundsY: d } = this;
    if (i.moveDist = u.fromObject({
      x: s.x - i.mouseCoord.x,
      y: s.y - i.mouseCoord.y
    }), i.mouseCoord = s, i.totalDist = u.fromObject({
      x: i.totalDist.x + i.moveDist.x,
      y: i.totalDist.y + i.moveDist.y
    }), i.coords = u.fromObject({
      x: Math.round(i.totalDist.x / r) * r + i.startCoord.x,
      y: Math.round(i.totalDist.y / r) * r + i.startCoord.y
    }), a && e.shiftKey && h.unconstrained && d.unconstrained) {
      let { x: c, y: l } = i.totalDist;
      Math.abs(c) > Math.abs(l) ? i.coords.top = i.startCoord.y : i.coords.left = i.startCoord.x;
    } else
      i.coords.y = Math.min(Math.max(n.top.min, i.coords.top), n.top.max), i.coords.x = Math.min(Math.max(n.left.min, i.coords.left), n.left.max);
    isFinite(i.maxX) && (i.pctX = Math.max(n.left.min, i.coords.left) / i.maxX), isFinite(i.maxY) && (i.pctY = Math.max(n.top.min, i.coords.top) / i.maxY), this.reposition(i.coords), this.eventBroker("move", e);
  }
  pointerdown(e) {
    document.body.setPointerCapture(e.pointerId), e.preventDefault(), e.stopPropagation(), e.pointerId !== void 0 && (this.pointerId = e.pointerId), document.body.addEventListener("pointerup", (s) => this.unbind(s), !1), document.body.addEventListener("pointermove", (s) => {
      this.pointerId !== void 0 && s.pointerId === this.pointerId && this.motionHandler(s);
    }, !1), this.moveInit(e);
  }
  render() {
    return wt`<slot></slot>`;
  }
}
f(dt, "properties", {
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
  shiftBehavior: { type: Boolean },
  //disables moving
  disabled: { type: Boolean },
  // advanced mode: Does not move the element, but fires
  // events so you can pass to your own handler
  eventsOnly: { type: Boolean },
  onmovestart: { type: Object },
  onmoveend: { type: Object },
  onmove: { type: Object }
});
window.customElements.define("lit-movable", dt);
export {
  dt as LitMovable
};
