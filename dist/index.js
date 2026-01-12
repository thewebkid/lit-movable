/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, j = T.ShadowRoot && (T.ShadyCSS === void 0 || T.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, et = Symbol(), X = /* @__PURE__ */ new WeakMap();
let ht = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== et) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (j && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = X.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && X.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const lt = (o) => new ht(typeof o == "string" ? o : o + "", void 0, et), at = (o, t) => {
  if (j) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = T.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, o.appendChild(s);
  }
}, Y = j ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return lt(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: dt, defineProperty: ct, getOwnPropertyDescriptor: pt, getOwnPropertyNames: ut, getOwnPropertySymbols: ft, getPrototypeOf: mt } = Object, L = globalThis, q = L.trustedTypes, $t = q ? q.emptyScript : "", _t = L.reactiveElementPolyfillSupport, x = (o, t) => o, D = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? $t : null;
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
} }, st = (o, t) => !dt(o, t), F = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: st };
Symbol.metadata ??= Symbol("metadata"), L.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = F) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && ct(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: r } = pt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const l = i?.call(this);
      r?.call(this, n), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? F;
  }
  static _$Ei() {
    if (this.hasOwnProperty(x("elementProperties"))) return;
    const t = mt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(x("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(x("properties"))) {
      const e = this.properties, s = [...ut(e), ...ft(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
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
      for (const i of s) e.unshift(Y(i));
    } else t !== void 0 && e.push(Y(t));
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
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return at(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : D).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : D;
      this._$Em = i;
      const l = n.fromAttribute(e, r.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, r) {
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (r = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? st)(r, e) || s.useDefault && s.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: r }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
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
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, r] of s) {
        const { wrapped: n } = r, l = this[i];
        n !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, r, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[x("elementProperties")] = /* @__PURE__ */ new Map(), A[x("finalized")] = /* @__PURE__ */ new Map(), _t?.({ ReactiveElement: A }), (L.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis, V = (o) => o, U = k.trustedTypes, W = U ? U.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, it = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, ot = "?" + $, gt = `<${ot}>`, b = document, C = () => b.createComment(""), P = (o) => o === null || typeof o != "object" && typeof o != "function", z = Array.isArray, yt = (o) => z(o) || typeof o?.[Symbol.iterator] == "function", I = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, K = /-->/g, Z = />/g, g = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), J = /'/g, G = /"/g, rt = /^(?:script|style|textarea|title)$/i, bt = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), At = bt(1), v = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), Q = /* @__PURE__ */ new WeakMap(), y = b.createTreeWalker(b, 129);
function nt(o, t) {
  if (!z(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return W !== void 0 ? W.createHTML(t) : t;
}
const vt = (o, t) => {
  const e = o.length - 1, s = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = E;
  for (let l = 0; l < e; l++) {
    const h = o[l];
    let d, c, a = -1, f = 0;
    for (; f < h.length && (n.lastIndex = f, c = n.exec(h), c !== null); ) f = n.lastIndex, n === E ? c[1] === "!--" ? n = K : c[1] !== void 0 ? n = Z : c[2] !== void 0 ? (rt.test(c[2]) && (i = RegExp("</" + c[2], "g")), n = g) : c[3] !== void 0 && (n = g) : n === g ? c[0] === ">" ? (n = i ?? E, a = -1) : c[1] === void 0 ? a = -2 : (a = n.lastIndex - c[2].length, d = c[1], n = c[3] === void 0 ? g : c[3] === '"' ? G : J) : n === G || n === J ? n = g : n === K || n === Z ? n = E : (n = g, i = void 0);
    const m = n === g && o[l + 1].startsWith("/>") ? " " : "";
    r += n === E ? h + gt : a >= 0 ? (s.push(d), h.slice(0, a) + it + h.slice(a) + $ + m) : h + $ + (a === -2 ? l : m);
  }
  return [nt(o, r + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class O {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let r = 0, n = 0;
    const l = t.length - 1, h = this.parts, [d, c] = vt(t, e);
    if (this.el = O.createElement(d, s), y.currentNode = this.el.content, e === 2 || e === 3) {
      const a = this.el.content.firstChild;
      a.replaceWith(...a.childNodes);
    }
    for (; (i = y.nextNode()) !== null && h.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const a of i.getAttributeNames()) if (a.endsWith(it)) {
          const f = c[n++], m = i.getAttribute(a).split($), N = /([.?@])?(.*)/.exec(f);
          h.push({ type: 1, index: r, name: N[2], strings: m, ctor: N[1] === "." ? Et : N[1] === "?" ? xt : N[1] === "@" ? wt : R }), i.removeAttribute(a);
        } else a.startsWith($) && (h.push({ type: 6, index: r }), i.removeAttribute(a));
        if (rt.test(i.tagName)) {
          const a = i.textContent.split($), f = a.length - 1;
          if (f > 0) {
            i.textContent = U ? U.emptyScript : "";
            for (let m = 0; m < f; m++) i.append(a[m], C()), y.nextNode(), h.push({ type: 2, index: ++r });
            i.append(a[f], C());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ot) h.push({ type: 2, index: r });
      else {
        let a = -1;
        for (; (a = i.data.indexOf($, a + 1)) !== -1; ) h.push({ type: 7, index: r }), a += $.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = b.createElement("template");
    return s.innerHTML = t, s;
  }
}
function S(o, t, e = o, s) {
  if (t === v) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const r = P(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(o), i._$AT(o, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = S(o, i._$AS(o, t.values), i, s)), t;
}
class St {
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
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? b).importNode(e, !0);
    y.currentNode = i;
    let r = y.nextNode(), n = 0, l = 0, h = s[0];
    for (; h !== void 0; ) {
      if (n === h.index) {
        let d;
        h.type === 2 ? d = new M(r, r.nextSibling, this, t) : h.type === 1 ? d = new h.ctor(r, h.name, h.strings, this, t) : h.type === 6 && (d = new Ct(r, this, t)), this._$AV.push(d), h = s[++l];
      }
      n !== h?.index && (r = y.nextNode(), n++);
    }
    return y.currentNode = b, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = S(this, t, e), P(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== v && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : yt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && P(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = O.createElement(nt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const r = new St(i, this), n = r.u(this.options);
      r.p(e), this.T(n), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = Q.get(t.strings);
    return e === void 0 && Q.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const r of t) i === e.length ? e.push(s = new M(this.O(C()), this.O(C()), this, this.options)) : s = e[i], s._$AI(r), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = V(t).nextSibling;
      V(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class R {
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
    if (r === void 0) t = S(this, t, e, 0), n = !P(t) || t !== this._$AH && t !== v, n && (this._$AH = t);
    else {
      const l = t;
      let h, d;
      for (t = r[0], h = 0; h < r.length - 1; h++) d = S(this, l[s + h], e, h), d === v && (d = this._$AH[h]), n ||= !P(d) || d !== this._$AH[h], d === p ? t = p : t !== p && (t += (d ?? "") + r[h + 1]), this._$AH[h] = d;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Et extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class xt extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class wt extends R {
  constructor(t, e, s, i, r) {
    super(t, e, s, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = S(this, t, e, 0) ?? p) === v) return;
    const s = this._$AH, i = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ct {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    S(this, t);
  }
}
const Pt = k.litHtmlPolyfillSupport;
Pt?.(O, M), (k.litHtmlVersions ??= []).push("3.3.2");
const Ot = (o, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = e?.renderBefore ?? null;
    s._$litPart$ = i = new M(t.insertBefore(C(), r), r, void 0, e ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis;
class w extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ot(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return v;
  }
}
w._$litElement$ = !0, w.finalized = !0, B.litElementHydrateSupport?.({ LitElement: w });
const Mt = B.litElementPolyfillSupport;
Mt?.({ LitElement: w });
(B.litElementVersions ??= []).push("4.2.2");
const H = (o) => isFinite(o) ? Number(o) : Number(o.replace(/[^0-9.\-]/g, "")), tt = (o) => (o = Number(o), (isNaN(o) || [void 0, null].includes(o)) && (o = 0), o);
class u {
  constructor(t, e) {
    this.x = tt(t), this.y = tt(e);
  }
  static fromPointerEvent(t) {
    const { pageX: e, pageY: s } = t;
    return new u(e, s);
  }
  static fromElementStyle(t) {
    let e = H(t.style.left ?? 0), s = H(t.style.top ?? 0);
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
const Nt = (o) => {
  const t = u.fromPointerEvent(o), e = o.target.getBoundingClientRect();
  let s = t.x - (e.left + document.body.scrollLeft), i = t.y - (e.top + document.body.scrollTop);
  return new u(s, i);
};
class _ {
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
      return new _();
    if (t === "null")
      return new _(0, 0);
    let [s, i] = t.split(",").map((n) => Number(n.trim()) + e), r = new _(s, i);
    return r.attr = t, r;
  }
}
class Tt extends w {
  _target;
  _targetSelector = null;
  _boundsX = new _();
  _boundsY = new _();
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
    this._boundsX = _.fromString(t, H(this.target?.style.left ?? 0)), this.bounds.left = this._boundsX;
  }
  get boundsY() {
    return this._boundsY;
  }
  set boundsY(t) {
    this._boundsY = _.fromString(t, H(this.target?.style.top ?? 0)), this.bounds.top = this._boundsY;
  }
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
    let { bounds: e, target: s, posTop: i, posLeft: r } = this, { offsetLeft: n, offsetTop: l, style: { left: h, top: d } } = this.target;
    s.classList.add("--movable-base"), this.renderRoot.addEventListener("pointerdown", (c) => this.pointerdown(c)), s.style.position = "absolute", s.style.cursor = "pointer", r ? s.style.left = r + "px" : !h && n && (s.style.left = n + "px", e.left.constrained && (e.left.min = e.left.max = n)), i ? s.style.top = i + "px" : !d && l && (s.style.top = l + "px", e.top.constrained && (e.top.min = e.top.max = l));
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
    e.mouseCoord = u.fromPointerEvent(t), e.startCoord = u.fromElementStyle(s), e.moveDist = new u(0, 0), e.totalDist = new u(0, 0), e.clickOffset = Nt(t), e.coords = u.fromObject(e.startCoord), e.maxX = isFinite(i.left.min) && isFinite(i.left.max) ? i.left.min + i.left.max : 1 / 0, e.maxY = isFinite(i.top.min) && isFinite(i.top.max) ? i.top.min + i.top.max : 1 / 0, this.isMoving = !0, this.reposition(!0), this.eventBroker("movestart", t);
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
    this.pointerId = null, document.body.removeEventListener("pointermove", (e) => this.motionHandler(e)), this.moveEnd(t);
  }
  moveEnd(t) {
    this.isMoving && (this.isMoving = this.moveState.isMoving = !1, this.reposition(!1), this.eventBroker("moveend", t));
  }
  motionHandler(t) {
    t.stopPropagation();
    let e = u.fromPointerEvent(t), s = this.moveState, { grid: i, bounds: r, shiftBehavior: n, boundsX: l, boundsY: h } = this;
    if (s.moveDist = u.fromObject({
      x: e.x - s.mouseCoord.x,
      y: e.y - s.mouseCoord.y
    }), s.mouseCoord = e, s.totalDist = u.fromObject({
      x: s.totalDist.x + s.moveDist.x,
      y: s.totalDist.y + s.moveDist.y
    }), s.coords = u.fromObject({
      x: Math.round(s.totalDist.x / i) * i + s.startCoord.x,
      y: Math.round(s.totalDist.y / i) * i + s.startCoord.y
    }), n && t.shiftKey && l.unconstrained && h.unconstrained) {
      let { x: d, y: c } = s.totalDist;
      Math.abs(d) > Math.abs(c) ? s.coords.top = s.startCoord.y : s.coords.left = s.startCoord.x;
    } else
      s.coords.y = Math.min(Math.max(r.top.min, s.coords.top), r.top.max), s.coords.x = Math.min(Math.max(r.left.min, s.coords.left), r.left.max);
    isFinite(s.maxX) && (s.pctX = Math.max(r.left.min, s.coords.left) / s.maxX), isFinite(s.maxY) && (s.pctY = Math.max(r.top.min, s.coords.top) / s.maxY), this.reposition(s.coords), this.eventBroker("move", t);
  }
  pointerdown(t) {
    document.body.setPointerCapture(t.pointerId), t.preventDefault(), t.stopPropagation(), t.pointerId !== void 0 && (this.pointerId = t.pointerId), this.listening || (document.body.addEventListener("pointerup", (e) => {
      this.isMoving && this.unbind(e);
    }, !1), document.body.addEventListener("pointermove", (e) => {
      this.pointerId !== void 0 && e.pointerId === this.pointerId && this.motionHandler(e);
    }, !1)), this.listening = !0, this.moveInit(t);
  }
  render() {
    return At`<slot></slot>`;
  }
}
window.customElements.get("lit-movable") || window.customElements.define("lit-movable", Tt);
export {
  Tt as LitMovable
};
