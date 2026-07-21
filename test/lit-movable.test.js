import { html, fixture, expect } from '@open-wc/testing';
import '../src/LitMovable.js';
import { dragBy, releaseMouse, px } from './test.utilities.js';

describe('LitMovable', () => {
  afterEach(async () => {
    await releaseMouse();
  });

  it('initializes at supplied posTop and posLeft', async () => {
    const top = 100;
    const left = 200;
    const el = await fixture(html`
      <lit-movable posTop=${top} posLeft=${left}>
        <div>Move me</div>
      </lit-movable>
    `);

    await expect(el).shadowDom.to.be.accessible();
    expect(px(el.style.top)).to.equal(top);
    expect(px(el.style.left)).to.equal(left);
  });

  it('sets touch-action: none so mobile pans cannot steal the gesture', async () => {
    const el = await fixture(html`
      <lit-movable posTop="20" posLeft="20">
        <div>Move me</div>
      </lit-movable>
    `);

    expect(getComputedStyle(el).touchAction).to.equal('none');
    expect(getComputedStyle(el.target).touchAction).to.equal('none');
  });

  it('moves with real pointer drag input', async () => {
    const el = await fixture(html`
      <lit-movable posTop="40" posLeft="50">
        <div style="width:80px;height:40px;background:#ccc">Move me</div>
      </lit-movable>
    `);

    await dragBy(el, 120, 80);

    expect(px(el.style.left)).to.equal(170);
    expect(px(el.style.top)).to.equal(120);
  });

  it('fires movestart, move, and moveend with position state', async () => {
    const el = await fixture(html`
      <lit-movable posTop="30" posLeft="30">
        <div style="width:80px;height:40px;background:#ccc">Move me</div>
      </lit-movable>
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
    expect(px(el.style.left)).to.equal(90);
    expect(px(el.style.top)).to.equal(70);
  });

  it('clamps movement to boundsX and boundsY', async () => {
    const el = await fixture(html`
      <div style="position:relative;width:300px;height:300px">
        <lit-movable posTop="50" posLeft="50" boundsX="-20,20" boundsY="-10,10">
          <div style="width:40px;height:40px;background:#ccc">box</div>
        </lit-movable>
      </div>
    `);
    const movable = el.querySelector('lit-movable');

    await dragBy(movable, 200, 200);

    expect(px(movable.style.left)).to.equal(70); // 50 + max 20
    expect(px(movable.style.top)).to.equal(60); // 50 + max 10
  });

  it('snaps movement to the grid', async () => {
    const el = await fixture(html`
      <lit-movable posTop="0" posLeft="0" grid="50">
        <div style="width:60px;height:40px;background:#ccc">grid</div>
      </lit-movable>
    `);

    await dragBy(el, 62, 37);

    expect(px(el.style.left)).to.equal(50);
    expect(px(el.style.top)).to.equal(50);
  });

  it('restricts movement to the horizontal axis', async () => {
    const el = await fixture(html`
      <lit-movable horizontal="-100,200">
        <div style="width:80px;height:40px;background:#ccc">horizontal</div>
      </lit-movable>
    `);

    const startTop = px(el.style.top);
    const startLeft = px(el.style.left);

    await dragBy(el, 90, 70);

    expect(px(el.style.left)).to.equal(startLeft + 90);
    expect(px(el.style.top)).to.equal(startTop);
  });

  it('keeps horizontal axis lock at posTop (not document 0)', async () => {
    const el = await fixture(html`
      <lit-movable posTop="80" posLeft="40" horizontal="-100,200">
        <div style="width:80px;height:40px;background:#ccc">horizontal</div>
      </lit-movable>
    `);

    await dragBy(el, 90, 70);

    expect(px(el.style.left)).to.equal(130);
    expect(px(el.style.top)).to.equal(80);
  });

  it('locks an axis with boundsY="null" to the current top', async () => {
    const el = await fixture(html`
      <lit-movable posTop="55" posLeft="10" boundsX="-50,50" boundsY="null">
        <div style="width:80px;height:40px;background:#ccc">locked-y</div>
      </lit-movable>
    `);

    await dragBy(el, 40, 90);

    expect(px(el.style.left)).to.equal(50);
    expect(px(el.style.top)).to.equal(55);
  });

  it('restricts movement to the vertical axis', async () => {
    const el = await fixture(html`
      <lit-movable vertical="-100,200">
        <div style="width:80px;height:40px;background:#ccc">vertical</div>
      </lit-movable>
    `);

    const startTop = px(el.style.top);
    const startLeft = px(el.style.left);

    await dragBy(el, 90, 70);

    expect(px(el.style.left)).to.equal(startLeft);
    expect(px(el.style.top)).to.equal(startTop + 70);
  });

  it('does not move when disabled', async () => {
    const el = await fixture(html`
      <lit-movable posTop="25" posLeft="25" disabled>
        <div style="width:80px;height:40px;background:#ccc">disabled</div>
      </lit-movable>
    `);

    await dragBy(el, 100, 100);

    expect(px(el.style.left)).to.equal(25);
    expect(px(el.style.top)).to.equal(25);
  });

  it('eventsOnly fires move events without changing position', async () => {
    const el = await fixture(html`
      <lit-movable posTop="15" posLeft="15" eventsOnly>
        <div style="width:80px;height:40px;background:#ccc">events</div>
      </lit-movable>
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
        <div id="dialog" style="position:absolute;left:10px;top:10px;width:180px;height:120px;border:1px solid #000">
          <lit-movable targetSelector="#dialog">
            <div style="width:160px;height:30px;background:#ccc">title</div>
          </lit-movable>
        </div>
      </div>
    `);
    const movable = wrap.querySelector('lit-movable');
    const dialog = wrap.querySelector('#dialog');

    await dragBy(movable, 40, 30);

    expect(px(dialog.style.left)).to.equal(50);
    expect(px(dialog.style.top)).to.equal(40);
  });
});
