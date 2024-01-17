var ct = Object.defineProperty, pt = (o, t, e) => t in o ? ct(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e, m = (o, t, e) => (pt(o, typeof t != "symbol" ? t + "" : t, e), e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, j = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, it = Symbol(), z = /* @__PURE__ */ new WeakMap();
let ut = class {
  constructor(o, t, e) {
    if (this._$cssResult$ = !0, e !== it)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = o, this.t = t;
  }
  get styleSheet() {
    let o = this.o;
    const t = this.t;
    if (j && o === void 0) {
      const e = t !== void 0 && t.length === 1;
      e && (o = z.get(t)), o === void 0 && ((this.o = o = new CSSStyleSheet()).replaceSync(this.cssText), e && z.set(t, o));
    }
    return o;
  }
  toString() {
    return this.cssText;
  }
};
const mt = (o) => new ut(typeof o == "string" ? o : o + "", void 0, it), vt = (o, t) => {
  if (j)
    o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else
    for (const e of t) {
      const s = document.createElement("style"), i = H.litNonce;
      i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, o.appendChild(s);
    }
}, X = j ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules)
    e += s.cssText;
  return mt(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: _t, defineProperty: ft, getOwnPropertyDescriptor: $t, getOwnPropertyNames: gt, getOwnPropertySymbols: yt, getPrototypeOf: bt } = Object, S = globalThis, Y = S.trustedTypes, At = Y ? Y.emptyScript : "", V = S.reactiveElementPolyfillSupport, C = (o, t) => o, I = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? At : null;
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
} }, ot = (o, t) => !_t(o, t), W = { attribute: !0, type: String, converter: I, reflect: !1, hasChanged: ot };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), S.litPropertyMetadata ?? (S.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class A extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = W) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && ft(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = $t(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get() {
      return i == null ? void 0 : i.call(this);
    }, set(r) {
      const h = i == null ? void 0 : i.call(this);
      n.call(this, r), this.requestUpdate(t, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? W;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties")))
      return;
    const t = bt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, s = [...gt(e), ...yt(e)];
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
        e.unshift(X(i));
    } else
      t !== void 0 && e.push(X(t));
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
    return vt(t, this.constructor.elementStyles), t;
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
    var s;
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const r = (((s = i.converter) == null ? void 0 : s.toAttribute) !== void 0 ? i.converter : I).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var s;
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const r = i.getPropertyOptions(n), h = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((s = r.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? r.converter : I;
      this._$Em = n, this[n] = h.fromAttribute(e, r.type), this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    if (t !== void 0) {
      if (s ?? (s = this.constructor.getPropertyOptions(t)), !(s.hasChanged ?? ot)(this[t], e))
        return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$Eg = this._$EP());
  }
  C(t, e, s) {
    this._$AL.has(t) || this._$AL.set(t, e), s.reflect === !0 && this._$Em !== t && (this._$ET ?? (this._$ET = /* @__PURE__ */ new Set())).add(t);
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
    var t;
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, r] of this._$Ep)
          this[n] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0)
        for (const [n, r] of i)
          r.wrapped !== !0 || this._$AL.has(n) || this[n] === void 0 || this.C(n, this[n], r);
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), (t = this._$E_) == null || t.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(s)) : this._$Ej();
    } catch (i) {
      throw e = !1, this._$Ej(), i;
    }
    e && this._$AE(s);
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
  _$Ej() {
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
    this._$ET && (this._$ET = this._$ET.forEach((e) => this._$EO(e, this[e]))), this._$Ej();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
}
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[C("elementProperties")] = /* @__PURE__ */ new Map(), A[C("finalized")] = /* @__PURE__ */ new Map(), V == null || V({ ReactiveElement: A }), (S.reactiveElementVersions ?? (S.reactiveElementVersions = [])).push("2.0.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, R = L.trustedTypes, F = R ? R.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, rt = "$lit$", f = `lit$${(Math.random() + "").slice(9)}$`, nt = "?" + f, St = `<${nt}>`, b = document, T = () => b.createComment(""), M = (o) => o === null || typeof o != "object" && typeof o != "function", lt = Array.isArray, Et = (o) => lt(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", B = `[ 	
\f\r]`, w = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, q = /-->/g, K = />/g, g = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), J = /'/g, Z = /"/g, ht = /^(?:script|style|textarea|title)$/i, xt = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), wt = xt(1), E = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), G = /* @__PURE__ */ new WeakMap(), y = b.createTreeWalker(b, 129);
function at(o, t) {
  if (!Array.isArray(o) || !o.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return F !== void 0 ? F.createHTML(t) : t;
}
const Ct = (o, t) => {
  const e = o.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : "", r = w;
  for (let h = 0; h < e; h++) {
    const l = o[h];
    let d, c, a = -1, v = 0;
    for (; v < l.length && (r.lastIndex = v, c = r.exec(l), c !== null); )
      v = r.lastIndex, r === w ? c[1] === "!--" ? r = q : c[1] !== void 0 ? r = K : c[2] !== void 0 ? (ht.test(c[2]) && (i = RegExp("</" + c[2], "g")), r = g) : c[3] !== void 0 && (r = g) : r === g ? c[0] === ">" ? (r = i ?? w, a = -1) : c[1] === void 0 ? a = -2 : (a = r.lastIndex - c[2].length, d = c[1], r = c[3] === void 0 ? g : c[3] === '"' ? Z : J) : r === Z || r === J ? r = g : r === q || r === K ? r = w : (r = g, i = void 0);
    const _ = r === g && o[h + 1].startsWith("/>") ? " " : "";
    n += r === w ? l + St : a >= 0 ? (s.push(d), l.slice(0, a) + rt + l.slice(a) + f + _) : l + f + (a === -2 ? h : _);
  }
  return [at(o, n + (o[e] || "<?>") + (t === 2 ? "</svg>" : "")), s];
};
class O {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, r = 0;
    const h = t.length - 1, l = this.parts, [d, c] = Ct(t, e);
    if (this.el = O.createElement(d, s), y.currentNode = this.el.content, e === 2) {
      const a = this.el.content.firstChild;
      a.replaceWith(...a.childNodes);
    }
    for (; (i = y.nextNode()) !== null && l.length < h; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes())
          for (const a of i.getAttributeNames())
            if (a.endsWith(rt)) {
              const v = c[r++], _ = i.getAttribute(a).split(f), U = /([.?@])?(.*)/.exec(v);
              l.push({ type: 1, index: n, name: U[2], strings: _, ctor: U[1] === "." ? Tt : U[1] === "?" ? Mt : U[1] === "@" ? Ot : D }), i.removeAttribute(a);
            } else
              a.startsWith(f) && (l.push({ type: 6, index: n }), i.removeAttribute(a));
        if (ht.test(i.tagName)) {
          const a = i.textContent.split(f), v = a.length - 1;
          if (v > 0) {
            i.textContent = R ? R.emptyScript : "";
            for (let _ = 0; _ < v; _++)
              i.append(a[_], T()), y.nextNode(), l.push({ type: 2, index: ++n });
            i.append(a[v], T());
          }
        }
      } else if (i.nodeType === 8)
        if (i.data === nt)
          l.push({ type: 2, index: n });
        else {
          let a = -1;
          for (; (a = i.data.indexOf(f, a + 1)) !== -1; )
            l.push({ type: 7, index: n }), a += f.length - 1;
        }
      n++;
    }
  }
  static createElement(t, e) {
    const s = b.createElement("template");
    return s.innerHTML = t, s;
  }
}
function x(o, t, e = o, s) {
  var i, n;
  if (t === E)
    return t;
  let r = s !== void 0 ? (i = e._$Co) == null ? void 0 : i[s] : e._$Cl;
  const h = M(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== h && ((n = r == null ? void 0 : r._$AO) == null || n.call(r, !1), h === void 0 ? r = void 0 : (r = new h(o), r._$AT(o, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = r : e._$Cl = r), r !== void 0 && (t = x(o, r._$AS(o, t.values), r, s)), t;
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
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? b).importNode(e, !0);
    y.currentNode = i;
    let n = y.nextNode(), r = 0, h = 0, l = s[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let d;
        l.type === 2 ? d = new N(n, n.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (d = new Nt(n, this, t)), this._$AV.push(d), l = s[++h];
      }
      r !== (l == null ? void 0 : l.index) && (n = y.nextNode(), r++);
    }
    return y.currentNode = b, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV)
      s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class N {
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
    t = x(this, t, e), M(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.g(t) : t.nodeType !== void 0 ? this.$(t) : Et(t) ? this.T(t) : this._(t);
  }
  k(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  $(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.k(t));
  }
  _(t) {
    this._$AH !== p && M(this._$AH) ? this._$AA.nextSibling.data = t : this.$(b.createTextNode(t)), this._$AH = t;
  }
  g(t) {
    var e;
    const { values: s, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = O.createElement(at(i.h, i.h[0]), this.options)), i);
    if (((e = this._$AH) == null ? void 0 : e._$AD) === n)
      this._$AH.p(s);
    else {
      const r = new Pt(n, this), h = r.u(this.options);
      r.p(s), this.$(h), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = G.get(t.strings);
    return e === void 0 && G.set(t.strings, e = new O(t)), e;
  }
  T(t) {
    lt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t)
      i === e.length ? e.push(s = new N(this.k(T()), this.k(T()), this, this.options)) : s = e[i], s._$AI(n), i++;
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
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let r = !1;
    if (n === void 0)
      t = x(this, t, e, 0), r = !M(t) || t !== this._$AH && t !== E, r && (this._$AH = t);
    else {
      const h = t;
      let l, d;
      for (t = n[0], l = 0; l < n.length - 1; l++)
        d = x(this, h[s + l], e, l), d === E && (d = this._$AH[l]), r || (r = !M(d) || d !== this._$AH[l]), d === p ? t = p : t !== p && (t += (d ?? "") + n[l + 1]), this._$AH[l] = d;
    }
    r && !i && this.O(t);
  }
  O(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Tt extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  O(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Mt extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  O(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Ot extends D {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? p) === E)
      return;
    const s = this._$AH, i = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Nt {
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
const Q = L.litHtmlPolyfillSupport;
Q == null || Q(O, N), (L.litHtmlVersions ?? (L.litHtmlVersions = [])).push("3.1.1");
const Ut = (o, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new N(t.insertBefore(T(), n), n, void 0, e ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class P extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
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
var tt;
P._$litElement$ = !0, P.finalized = !0, (tt = globalThis.litElementHydrateSupport) == null || tt.call(globalThis, { LitElement: P });
const et = globalThis.litElementPolyfillSupport;
et == null || et({ LitElement: P });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.3");
const k = (o) => isFinite(o) ? Number(o) : Number(o.replace(/[^0-9.\-]/g, "")), st = (o) => (o = Number(o), (isNaN(o) || [void 0, null].includes(o)) && (o = 0), o);
class u {
  constructor(t, e) {
    this.x = st(t), this.y = st(e);
  }
  static fromPointerEvent(t) {
    const { pageX: e, pageY: s } = t;
    return new u(e, s);
  }
  static fromElementStyle(t) {
    let e = k(t.style.left ?? 0), s = k(t.style.top ?? 0);
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
class $ {
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
      return new $();
    if (t === "null")
      return new $(0, 0);
    let [s, i] = t.split(",").map((r) => Number(r.trim()) + e), n = new $(s, i);
    return n.attr = t, n;
  }
}
class dt extends P {
  constructor() {
    super(), m(this, "_target"), m(this, "_targetSelector", null), m(this, "_boundsX", new $()), m(this, "_boundsY", new $()), m(this, "isMoving", !1), m(this, "moveState", {}), m(this, "_vertical", null), m(this, "_horizontal", null), m(this, "_posTop", null), m(this, "_posLeft", null), m(this, "_grid", 1), m(this, "pointerId");
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
    t = Number(t), this._posTop = t, this.target && (this.target.style.top = t + "px");
  }
  get posTop() {
    return this._posTop;
  }
  set posLeft(t) {
    t = Number(t), this._posLeft = t, this.target && (this.target.style.left = t + "px");
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
    var e;
    this._boundsX = $.fromString(t, k(((e = this.target) == null ? void 0 : e.style.left) ?? 0)), this.bounds.left = this._boundsX;
  }
  get boundsY() {
    return this._boundsY;
  }
  set boundsY(t) {
    var e;
    this._boundsY = $.fromString(t, k(((e = this.target) == null ? void 0 : e.style.top) ?? 0)), this.bounds.top = this._boundsY;
  }
  firstUpdated(t) {
    this._retryTarget && (this.target = document.querySelector(this.targetSelector));
    let { bounds: e, target: s, posTop: i, posLeft: n } = this, { offsetLeft: r, offsetTop: h, style: { left: l, top: d } } = this.target;
    s.classList.add("--movable-base"), this.renderRoot.addEventListener("pointerdown", (c) => this.pointerdown(c)), s.style.position = "absolute", s.style.cursor = "pointer", n ? s.style.left = n + "px" : !l && r && (s.style.left = r + "px", e.left.constrained && (e.left.min = e.left.max = r)), i ? s.style.top = i + "px" : !d && h && (s.style.top = h + "px", e.top.constrained && (e.top.min = e.top.max = h));
  }
  reposition(t) {
    if (typeof t == "object") {
      const { eventsOnly: e, target: s } = this;
      this.posTop = t.top, this.posLeft = t.left, s && !e && (s.style.left = t.left + "px", s.style.top = t.top + "px");
    } else
      this.isMoving = t;
  }
  moveInit(t) {
    let e = this.moveState, { target: s, bounds: i } = this;
    e.mouseCoord = u.fromPointerEvent(t), e.startCoord = u.fromElementStyle(s), e.moveDist = new u(0, 0), e.totalDist = new u(0, 0), e.clickOffset = Ht(t), e.coords = u.fromObject(e.startCoord), e.maxX = isFinite(i.left.min) && isFinite(i.left.max) ? i.left.min + i.left.max : 1 / 0, e.maxY = isFinite(i.top.min) && isFinite(i.top.max) ? i.top.min + i.top.max : 1 / 0, this.isMoving = !0, this.reposition(!0), this.eventBroker("movestart", t);
  }
  eventBroker(t, e) {
    this.moveState.posTop = this.posTop, this.moveState.posLeft = this.posLeft;
    let s = new CustomEvent(t, {
      bubbles: !0,
      composed: !0,
      detail: { ...e, ...this.moveState, element: this }
    });
    this.renderRoot.dispatchEvent(s);
    let i = this[`on${t}`];
    i && i({ ...e, ...this.moveState, me: this });
  }
  unbind(t) {
    this.pointerId = null, this.isMoving = !1, document.body.removeEventListener("pointermove", (e) => this.motionHandler(e)), this.moveEnd(t);
  }
  moveEnd(t) {
    document.body.removeEventListener("pointerup", (e) => this.unbind(e)), this.isMoving = this.moveState.isMoving = !1, this.reposition(!1), this.eventBroker("moveend", t);
  }
  motionHandler(t) {
    t.stopPropagation();
    let e = u.fromPointerEvent(t), s = this.moveState, { grid: i, bounds: n, shiftBehavior: r, boundsX: h, boundsY: l } = this;
    if (s.moveDist = u.fromObject({
      x: e.x - s.mouseCoord.x,
      y: e.y - s.mouseCoord.y
    }), s.mouseCoord = e, s.totalDist = u.fromObject({
      x: s.totalDist.x + s.moveDist.x,
      y: s.totalDist.y + s.moveDist.y
    }), s.coords = u.fromObject({
      x: Math.round(s.totalDist.x / i) * i + s.startCoord.x,
      y: Math.round(s.totalDist.y / i) * i + s.startCoord.y
    }), r && t.shiftKey && h.unconstrained && l.unconstrained) {
      let { x: d, y: c } = s.totalDist;
      Math.abs(d) > Math.abs(c) ? s.coords.top = s.startCoord.y : s.coords.left = s.startCoord.x;
    } else
      s.coords.y = Math.min(Math.max(n.top.min, s.coords.top), n.top.max), s.coords.x = Math.min(Math.max(n.left.min, s.coords.left), n.left.max);
    isFinite(s.maxX) && (s.pctX = Math.max(n.left.min, s.coords.left) / s.maxX), isFinite(s.maxY) && (s.pctY = Math.max(n.top.min, s.coords.top) / s.maxY), this.reposition(s.coords), this.eventBroker("move", t);
  }
  pointerdown(t) {
    document.body.setPointerCapture(t.pointerId), t.preventDefault(), t.stopPropagation(), t.pointerId !== void 0 && (this.pointerId = t.pointerId), document.body.addEventListener("pointerup", (e) => this.unbind(e), !1), document.body.addEventListener("pointermove", (e) => {
      this.pointerId !== void 0 && e.pointerId === this.pointerId && this.motionHandler(e);
    }, !1), this.moveInit(t);
  }
  render() {
    return wt`<slot></slot>`;
  }
}
m(dt, "properties", {
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
