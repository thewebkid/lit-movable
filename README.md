# \<movable-el> [![npm version](https://badge.fury.io/js/lit-movable.svg)](https://badge.fury.io/js/lit-movable) [![tests](https://img.shields.io/github/actions/workflow/status/thewebkid/lit-movable/test.yml?branch=master&label=tests)](https://github.com/thewebkid/lit-movable/actions/workflows/test.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Declarative drag/move for [Lit](https://lit.dev/) and plain HTML. Wrap content in `<movable-el>`, optionally constrain axes, snap to a grid, or move a different target than the drag handle.

**When to use it:** Lit / web-component apps that need lightweight pointer dragging with rich move state — without a full drag-and-drop framework.

[Live Demo](http://thewebkid.com/modules/lit-movable)

> **Peer dependency:** `lit` `^3` (not bundled).  
> **Tags:** primary `<movable-el>`; `<lit-movable>` remains registered as a compatible alias.  
> **TypeScript:** ships with `index.d.ts` (`Movable`, `MoveState`, tag map for both elements).

## Installation

```bash
npm i lit-movable
```

```ts
import { Movable, type MoveState } from 'lit-movable';

const el = document.querySelector('movable-el');
el?.addEventListener('move', (e: CustomEvent<MoveState>) => {
  console.log(e.detail.coords);
});
```

## Basic usage

```html
<script type="module">
  import { Movable } from 'lit-movable';
</script>

<movable-el>
  <div style="background:lightsteelblue">I am movable</div>
</movable-el>
```

## Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `posTop` / `posLeft` | Number | Initial / reflected `top` / `left` (px). Set these **before** `boundsX` / `boundsY` when both change in one update |
| `targetSelector` | String | CSS selector for the element that moves (default: the `<movable-el>` itself) |
| `boundsX` / `boundsY` | String | **Relative** `"min,max"` offsets from the *current* `left` / `top` (not document coords). `"null"` locks that axis |
| `axis` | `"x"` \| `"y"` | Lock the other axis to the current position |
| `grid` | Number | Snap increment in px (default `1`) |
| `dragAfterDist` | Number | Pointer travel (px) before a drag starts (default `0`) |
| `shiftBehavior` | Boolean | With open bounds, Shift constrains to the dominant axis |
| `disabled` | Boolean | Disable dragging |
| `eventsOnly` | Boolean | Fire events but do not reposition the target |

## Bounds mental model (read this)

`boundsX` / `boundsY` are **not** absolute `style.left` / `style.top` ranges.

They are **deltas from the element’s current position** at the moment the attribute/property is applied:

```text
absoluteMin = currentLeft + min
absoluteMax = currentLeft + max
```

So if the knob is already at `left: 85` and you want it clamped to the box `[0, 160]`:

```html
<!-- WRONG — looks absolute, parses as [85, 245] -->
<movable-el posLeft="85" boundsX="0,160"></movable-el>

<!-- RIGHT — deltas from 85 → absolute [0, 160] -->
<movable-el posLeft="85" boundsX="-85,75"></movable-el>
```

General recipe for “stay inside `[0, size]`” while the control is at `(left, top)`:

```js
boundsX = `${-left}, ${size - left}`;
boundsY = `${-top}, ${size - top}`;
```

### Lit / reactive gotchas

1. **Set `posLeft` / `posTop` before `boundsX` / `boundsY`** in the same render. Bounds reparse against *current* `style.left` / `top`. If bounds land first, the offset is stale and the clamp drifts.
2. **Do not rewrite bounds on every `move` event.** The resolved `[min, max]` is already absolute after the first parse. Re-applying a new relative string mid-drag (while `style.left` has moved but your bound `pos*` lags) widens or shifts the clamp — knobs escape the box, saturation goes negative, etc. Sync bounds on `movestart` / `moveend` (or whenever you intentionally reposition outside a gesture), and only update `pos*` during `move`.
3. **`"null"` locks an axis** to the current coordinate (no movement on that axis), not “no bounds”.

```html
<!-- Horizontal slider: free X in a band, Y locked -->
<movable-el posLeft="40" axis="x" boundsX="-40,200">
  <a class="thumb"></a>
</movable-el>
```

## Slots

- **default** — content
- **`handle`** — optional drag handle. When present, only that slot starts a drag

```html
<movable-el>
  <div slot="handle">Drag me</div>
  <div>I move with the handle, but I'm not grabbable</div>
</movable-el>
```

## Events

Custom events bubble and are composed. `event.detail` is a plain move-state object (not a spread PointerEvent):

- `coords`, `startCoord`, `moveDist`, `totalDist`, `mouseCoord`, `clickOffset`
- `posTop`, `posLeft`, `pctX` / `pctY` (when bounds are finite), `isMoving`

Events: `movestart`, `move`, `moveend`.

Callback properties `onmovestart`, `onmove`, `onmoveend` receive the same state object.

```js
const el = document.querySelector('movable-el');

el.addEventListener('move', ({ detail }) => {
  console.log(detail.coords, detail.totalDist);
});

el.onmoveend = (state) => console.log(state.posLeft, state.posTop);
```

## Examples

### Move a parent (modal title)

```html
<div id="dialog" style="position:absolute;width:200px;border:1px solid blue">
  <movable-el targetSelector="#dialog">
    <div slot="handle" style="background:lightsteelblue">Title</div>
  </movable-el>
  Body is not a handle.
</div>
```

### Horizontal only

```html
<movable-el axis="x" boundsX="-50,250">
  <div>Horizontal</div>
</movable-el>

<!-- equivalent -->
<movable-el boundsX="-50,250" boundsY="null">
  <div>Horizontal</div>
</movable-el>
```

### Grid + shift

```html
<movable-el grid="50" shiftBehavior>
  <div>Snap 50px (hold Shift)</div>
</movable-el>
```

### Constrained box

Clamped to a 200×200 parent. Note the **relative** bounds: at `(100,100)`, `"-100,100"` → absolute `[0,200]`.

```html
<div style="position:relative;height:200px;width:200px;border:1px solid green">
  <movable-el posTop="100" posLeft="100" boundsX="-100,100" boundsY="-100,100">
    <div>box</div>
  </movable-el>
</div>
```

### Reactive knob (color picker pattern)

Keep the sample point on-canvas; allow the thumb to half-overhang. Freeze bounds during the gesture:

```js
// size = canvas CSS px; left/top = sample point
const boundsX = `${-left}, ${size - left}`;
const boundsY = `${-top}, ${size - top}`;

html`
  <movable-el
    .posTop=${top}
    .posLeft=${left}
    .boundsX=${dragging ? frozenBoundsX : boundsX}
    .boundsY=${dragging ? frozenBoundsY : boundsY}
    @movestart=${() => { dragging = true; freezeBounds(); }}
    @move=${onMove}
    @moveend=${() => { dragging = false; }}>
    <div class="circle"></div>
  </movable-el>
`;
```

## Migrating from 0.x

| 0.x | 1.0 |
|-----|-----|
| `<lit-movable>` | `<movable-el>` (or keep `<lit-movable>` — still registered as an alias) |
| `import { LitMovable }` | `import { Movable }` (`LitMovable` still exported as the alias class) |
| `horizontal="min,max"` | `axis="x"` + `boundsX="min,max"` |
| `vertical="min,max"` | `axis="y"` + `boundsY="min,max"` |
| event `detail` mixed with PointerEvent | plain move-state only |

npm package name remains **`lit-movable`**.

## Local development

```bash
git clone https://github.com/thewebkid/lit-movable.git
cd lit-movable
npm i
npm run dev
```

```bash
npm test
npm run build
```
