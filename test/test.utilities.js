import { sendMouse  } from '@web/test-runner-commands';

/*
const pointerEventCtorProps = ['clientX', 'clientY', 'pointerType'];
export default class PointerEventFake extends Event {
  constructor(type, props) {
    super(type, props);
    pointerEventCtorProps.forEach((prop) => {
      if (props[prop] != null) {
        this[prop] = props[prop];
      }
    });
  }
}*/
export const emitPointer = (type, x, y, el, shiftKey=false)=>{
  const pe = new PointerEvent(type, {
    trusted:true,
    bubbles:true,
    clientX: x, clientY: y,
    pageX: x, pageY: y, shiftKey,
    pointerId: 222,
    //target: el,
    pointerType: 'touch'

  });
  return pe;
  /*const event = document.createEvent("MouseEvents");
  event.initMouseEvent(type, true, true, view,
    detail, undefined, undefined, x, y,
    false, false, shiftKey, false,
    0, el)*/
}
export const findCenter = (element) => {
  let { top, left, height, width } = element.getBoundingClientRect();
  top += Math.round(height / 2);
  left += Math.round(width / 2);

  return [top,left];
};

export const moveBy = (element, x, y) =>{
  console.log(typeof element)
  const [x1,y1] = findCenter(element);
  emitPointer('pointerdown', x1, y1, element)
  //await sendMouse({ type: 'down', position: [x1, y1] });
  const x2 = x + x1;
  const y2 = y + y1;
  //console.log({x, y, x1, x2, y1, y2});
  emitPointer('pointermove', x2, y2, element)
  //await sendMouse({type: 'move', position:[x2,y2]});
  emitPointer('pointerup', x2, y2, element);

}
