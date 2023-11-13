# \<lit-movable>

A Lit 3 wrapper web component that can enable robustly customizable element move operations and expose rich state data.

## Installation

```bash
npm i lit-movable
```

## Basic Usage

```html
<script type="module">
  import 'lit-movable/lit-movable.js';
</script>

<lit-movable>
  <div style="background:lightsteelblue">I am movable</div>
</lit-movable>
```


### Attributes
- **posTop**: _Number_ - Represents the offsetTop/Left value (reflected). When set, will set the initial _style.top_ value. Updates with move events
- **posTop**: _Number_ - Represents the offsetLeft value (reflected). When set, will set the initial style.top value. Updates with move events
- **targetSelector**: _String_ - A selector to select the element that will move. Defaults to the lit-movable (this) element, but useful when for example you want to allow a modal header to respond to pointer events but you want the entire modal to move.
- **boundsX**: _String: boundsX="min,max"_ Defaults to -Infinity,Infinity. Set to restrict movement along the x axis.
- **boundsY**: _String: boundsY="min,max"_ Defaults to -Infinity,Infinity. Set to restrict movement along the y axis.
- **vertical**: _String: vertical="min,max"_ - Will constrain horizontal (x) movement completely and allow vertical (y) movement between the specified values.
- **horizontal**: _String: horizontal="min,max"_ - Will constrain vertical (y) movement completely and allow horizontal (x) movement between the specified values.
- **grid**: _Number_ - Snaps movement to nearest grid position (defaults to 1). Initial element position represents the 0,0 position. Movement snapped to the provided value increment
- **shiftKey** _Bool_ - When enabled, holding the shift key will coerce movement to perpendicular coordinates only.
- **disabled**: _Bool_ - Disables movement behavior.
- **eventsOnly**: _Bool_ - (advanced) Only fires movement events, but will not move the element.

## Events 
Exposes events as callback properties or built in custom events

### Event Properties
- **onstart**: called immediately after the pointerdown event on the element
- **onmove**: called continuously while moving
- **oncomplete**: called after the pointerup event on the element

### Custom Events
- **start**: fires immediately after the pointerdown event on the element
- **move**: fires continuously while moving
- **complete**: fires after the pointerup event on the element

### Event binding examples
```html
<lit-movable id="myMovable"></lit-movable>
<script>
  const movableEl = document.getElementById("myMovable");
  /* Bind As property */
  movableEl.onmove = (moveState)=>{
    const {coords, clickOffset, mouseCoord, moveDist, startCoord, totalDist} = moveState;
    //all coordinates expose x,y,top,left
    console.log(coords);//Current element pos  
    console.log(clickOffset);// the position of the pointer relative to the top/left of the element
    console.log(mouseCoord); // current mouse pos on page - equivalent of pageX/pageY on a mouse event
    console.log(moveDist); //distance moved since previous move operation
    console.log(startCoord); //position of element on pointerdown
    console.log(totalDist);//distance moved from pointerdown to pointerup
  }
  /* Custom Event */
  movableEl.addEventListener('move', (event) => {
    const moveState = event.detail;
    console.log({moveState});//same state object as above
  });
</script>
 
```




More usage examples coming soon.
