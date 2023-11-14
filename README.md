# \<lit-movable>

Movable element - simple and robust. A Lit 3 wrapper web component that can enable customizable element move operations and expose pointer state data.

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
Lit-Movable exposes events as either callback properties or the built in custom events.

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

## More usage examples
Constrain vertical movement. Allow -50 -> 250 horizontal movement. Here are two ways to accomplish the identical behavior.
```html
    <!-- Set horizontal movement only -->
    <lit-movable horizontal="-50,250">
      <div style="background:lightsteelblue">Move me horizontally</div>
    </lit-movable>

  <!-- OR -->
  <!-- Explicit x/y boundaries. Null string constrains an axis -->
  <lit-movable boundsX="-50,250" boundsY="null">
    <div style="background:lightsteelblue">Move me horizontally</div>
  </lit-movable>
```

Two identical ways to constrain horizontal movement, but enable broad vertical motion. 
```html
  <!-- Set vertical movement only -->
  <lit-movable vertical="-999,9999">
    <div style="background:lightsteelblue">Move me vertically</div>
  </lit-movable>
  <!-- Alternate explicit bounds (x,y) equivalent. Null = no movement enabled -->
  <lit-movable boundsY="-999,9999" boundsX="null">
    <div style="background:lightsteelblue">Move me horizontally</div>
  </lit-movable>
```

Snap to 50px grid with shift key behavior.
```html
  <lit-movable grid="50" shiftBehavior="true">
    <div style="background:lightsteelblue">my grid is 50 <br>(try holding shift while dragging)</div>
  </lit-movable>
```

Start in middle of a constrained box.
```html
  <div style="height:200px;width:200px;border:solid 1px green;position:relative">
    <lit-movable posTop="100" posLeft="100" boundsX="-100,100" boundsY="-100,100">
      <div style="background:lightsteelblue;width:30px;margin-left:-15px;height:18px;margin-top:-9px">
        box
      </div>
    </lit-movable>
  </div>
```

Modal behavior with draggable title using targetSelector attribute.
```html
  <div style="height:200px;width:200px;border:solid 1px blue;" id="dialog">
    <lit-movable targetSelector="#dialog">
      <div style="background:lightsteelblue;width:100%">I am a draggable title</div>
    </lit-movable>
    I am not directly grabbable, but I will move if you grab my title.
  </div>
```
