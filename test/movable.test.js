import { html, fixture, expect } from '@open-wc/testing';
import '../src/Movable.js';
import { dragBy, releaseMouse, px, findCenter } from './test.utilities.js';
import { sendMouse } from '@web/test-runner-commands';

describe('Movable', () => {
  afterEach(async () => {
    await releaseMouse();
  });

  it('initializes at supplied posTop and posLeft', async () => {
    const top = 100;
    const left = 200;
    const el = await fixture(html`
      <movable-el posTop=${top} posLeft=${left}>
        <div>Move me</div>
      </movable-el>
    `);

    await expect(el).shadowDom.to.be.accessible();
    expect(px(el.style.top)).to.equal(top);
    expect(px(el.style.left)).to.equal(left);
  });

  it('sets touch-action: none so mobile pans cannot steal the gesture', async () => {
    const el = await fixture(html`
      <movable-el posTop="20" posLeft="20">
        <div>Move me</div>
      </movable-el>
    `);

    expect(getComputedStyle(el).touchAction).to.equal('none');
    expect(getComputedStyle(el.target).touchAction).to.equal('none');
  });

  it('moves with real pointer drag input', async () => {
    const el = await fixture(html`
      <movable-el posTop="40" posLeft="50">
        <div style="width:80px;height:40px;background:#ccc">Move me</div>
      </movable-el>
    `);

    await dragBy(el, 120, 80);

    expect(px(el.style.left)).to.equal(170);
    expect(px(el.style.top)).to.equal(120);
  });

  it('fires movestart, move, and moveend with plain move-state detail', async () => {
    const el = await fixture(html`
      <movable-el posTop="30" posLeft="30">
        <div style="width:80px;height:40px;background:#ccc">Move me</div>
      </movable-el>
    `);

    const events = [];
    el.addEventListener('movestart', (e) => events.push({ type: 'movestart', detail: e.detail }));
    el.addEventListener('move', (e) => events.push({ type: 'move', detail: e.detail }));
    el.addEventListener('moveend', (e) => events.push({ type: 'moveend', detail: e.detail }));

    await dragBy(el, 60, 40);

    const types = events.map((e) => e.type);
    expect(types[0]).to.equal('movestart');
    expect(types).to.include('move');
    expect(types[types.length - 1]).to.equal('moveend');

    const moveDetail = events.find((e) => e.type === 'move').detail;
    expect(moveDetail).to.have.property('coords');
    expect(moveDetail).to.have.property('startCoord');
    expect(moveDetail).to.have.property('totalDist');
    expect(moveDetail).to.not.have.property('pointerId');
    expect(moveDetail).to.not.have.property('element');
    expect(px(el.style.left)).to.equal(90);
    expect(px(el.style.top)).to.equal(70);
  });

  it('clamps movement to boundsX and boundsY', async () => {
    const el = await fixture(html`
      <div style="position:relative;width:300px;height:300px">
        <movable-el posTop="50" posLeft="50" boundsX="-20,20" boundsY="-10,10">
          <div style="width:40px;height:40px;background:#ccc">box</div>
        </movable-el>
      </div>
    `);
    const movable = el.querySelector('movable-el');

    await dragBy(movable, 200, 200);

    expect(px(movable.style.left)).to.equal(70);
    expect(px(movable.style.top)).to.equal(60);
  });

  it('snaps movement to the grid', async () => {
    const el = await fixture(html`
      <movable-el posTop="0" posLeft="0" grid="50">
        <div style="width:60px;height:40px;background:#ccc">grid</div>
      </movable-el>
    `);

    await dragBy(el, 62, 37);

    expect(px(el.style.left)).to.equal(50);
    expect(px(el.style.top)).to.equal(50);
  });

  it('restricts movement with axis="x"', async () => {
    const el = await fixture(html`
      <movable-el posTop="80" posLeft="40" axis="x" boundsX="-100,200">
        <div style="width:80px;height:40px;background:#ccc">horizontal</div>
      </movable-el>
    `);

    await dragBy(el, 90, 70);

    expect(px(el.style.left)).to.equal(130);
    expect(px(el.style.top)).to.equal(80);
  });

  it('restricts movement with axis="y"', async () => {
    const el = await fixture(html`
      <movable-el posTop="20" posLeft="40" axis="y" boundsY="-100,200">
        <div style="width:80px;height:40px;background:#ccc">vertical</div>
      </movable-el>
    `);

    await dragBy(el, 90, 70);

    expect(px(el.style.left)).to.equal(40);
    expect(px(el.style.top)).to.equal(90);
  });

  it('locks an axis with boundsY="null" to the current top', async () => {
    const el = await fixture(html`
      <movable-el posTop="55" posLeft="10" boundsX="-50,50" boundsY="null">
        <div style="width:80px;height:40px;background:#ccc">locked-y</div>
      </movable-el>
    `);

    await dragBy(el, 40, 90);

    expect(px(el.style.left)).to.equal(50);
    expect(px(el.style.top)).to.equal(55);
  });

  it('does not move when disabled', async () => {
    const el = await fixture(html`
      <movable-el posTop="25" posLeft="25" disabled>
        <div style="width:80px;height:40px;background:#ccc">disabled</div>
      </movable-el>
    `);

    await dragBy(el, 100, 100);

    expect(px(el.style.left)).to.equal(25);
    expect(px(el.style.top)).to.equal(25);
  });

  it('eventsOnly fires move events without changing position', async () => {
    const el = await fixture(html`
      <movable-el posTop="15" posLeft="15" eventsOnly>
        <div style="width:80px;height:40px;background:#ccc">events</div>
      </movable-el>
    `);

    let moveCount = 0;
    el.addEventListener('move', () => {
      moveCount += 1;
    });

    await dragBy(el, 75, 50);

    expect(moveCount).to.be.greaterThan(0);
    expect(px(el.style.left)).to.equal(15);
    expect(px(el.style.top)).to.equal(15);
  });

  it('moves an external target via targetSelector', async () => {
    const wrap = await fixture(html`
      <div style="position:relative;height:220px;width:220px">
        <div
          id="dialog"
          style="position:absolute;left:10px;top:10px;width:180px;height:120px;border:1px solid #000"
        >
          <movable-el targetSelector="#dialog">
            <div style="width:160px;height:30px;background:#ccc">title</div>
          </movable-el>
        </div>
      </div>
    `);
    const movable = wrap.querySelector('movable-el');
    const dialog = wrap.querySelector('#dialog');

    await dragBy(movable, 40, 30);

    expect(px(dialog.style.left)).to.equal(50);
    expect(px(dialog.style.top)).to.equal(40);
  });

  it('only starts dragging from the handle slot when provided', async () => {
    const el = await fixture(html`
      <movable-el posTop="10" posLeft="10">
        <div
          slot="handle"
          id="handle"
          style="width:100px;height:30px;background:#99f"
        >
          handle
        </div>
        <div id="body" style="width:100px;height:60px;background:#ccc">body</div>
      </movable-el>
    `);

    const body = el.querySelector('#body');
    const [bx, by] = findCenter(body);
    await sendMouse({ type: 'move', position: [bx, by] });
    await sendMouse({ type: 'down' });
    await sendMouse({ type: 'move', position: [bx + 50, by + 40] });
    await sendMouse({ type: 'up' });

    expect(px(el.style.left)).to.equal(10);
    expect(px(el.style.top)).to.equal(10);

    await dragBy(el.querySelector('#handle'), 40, 20);

    expect(px(el.style.left)).to.equal(50);
    expect(px(el.style.top)).to.equal(30);
  });

  it('ignores short drags below dragAfterDist and skips move events', async () => {
    const el = await fixture(html`
      <movable-el posTop="40" posLeft="40" dragAfterDist="30">
        <div style="width:80px;height:40px;background:#ccc">threshold</div>
      </movable-el>
    `);

    let moveCount = 0;
    let startCount = 0;
    let endCount = 0;
    el.addEventListener('movestart', () => {
      startCount += 1;
    });
    el.addEventListener('move', () => {
      moveCount += 1;
    });
    el.addEventListener('moveend', () => {
      endCount += 1;
    });

    await dragBy(el, 10, 10);

    expect(startCount).to.equal(0);
    expect(moveCount).to.equal(0);
    expect(endCount).to.equal(0);
    expect(px(el.style.left)).to.equal(40);
    expect(px(el.style.top)).to.equal(40);
  });

  it('starts moving after crossing dragAfterDist', async () => {
    const el = await fixture(html`
      <movable-el posTop="40" posLeft="40" dragAfterDist="20">
        <div style="width:80px;height:40px;background:#ccc">threshold</div>
      </movable-el>
    `);

    let startCount = 0;
    el.addEventListener('movestart', () => {
      startCount += 1;
    });

    await dragBy(el, 80, 0);

    expect(startCount).to.equal(1);
    expect(px(el.style.left)).to.be.greaterThan(40);
  });

  it('removes listeners on disconnect', async () => {
    const el = await fixture(html`
      <movable-el posTop="5" posLeft="5">
        <div style="width:40px;height:40px;background:#ccc">x</div>
      </movable-el>
    `);

    expect(el._pointerBound).to.equal(true);
    el.remove();
    expect(el._pointerBound).to.equal(false);
  });

  it('registers lit-movable as a backward-compatible alias', async () => {
    const el = await fixture(html`
      <lit-movable posTop="12" posLeft="18">
        <div style="width:60px;height:30px;background:#ccc">alias</div>
      </lit-movable>
    `);

    expect(el).to.be.instanceOf(customElements.get('lit-movable'));
    expect(customElements.get('lit-movable').prototype).to.be.instanceOf(
      customElements.get('movable-el')
    );
    await dragBy(el, 20, 10);
    expect(px(el.style.left)).to.equal(38);
    expect(px(el.style.top)).to.equal(22);
  });
});
