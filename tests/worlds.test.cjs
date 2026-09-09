const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const html = read('worlds.html');
for (const [, resource] of html.matchAll(/(?:src|href)="([^"#:]+)"/g)) {
  assert(fs.existsSync(path.join(root, resource)), 'Missing local resource: ' + resource);
}

function setup(withLibrary = true) {
  const element = () => ({
    dataset: {}, events: {}, attributes: {}, hidden: false, disabled: true,
    addEventListener(name, callback) { this.events[name] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; }
  });
  const elements = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(([, id]) => [id, element()]));
  const layers = new Set();
  const map = {
    layers, fits: 0, attributionControl: { setPrefix() {} },
    removeLayer(layer) { layers.delete(layer); },
    fitBounds(points) { this.fits += 1; this.bounds = points; },
    center: [31.2, 121.55], zoom: 12
  };
  const tiles = {
    events: {}, redraws: 0,
    on(name, fn) { this.events[name] = fn; return this; },
    addTo() { layers.add(this); },
    redraw() { this.redraws += 1; }
  };
  let overlay;
  let reloads = 0;
  const L = {
    map: () => map,
    control: { zoom: () => ({ addTo() {} }) },
    tileLayer: () => tiles,
    circleMarker: coordinates => ({ coordinates, bindTooltip(label) { this.label = label; return this; } }),
    polyline: coordinates => ({ type: 'line', coordinates, bindTooltip(label) { this.label = label; return this; } }),
    layerGroup: markers => (overlay = { markers, addTo() { layers.add(this); } })
  };
  const context = vm.createContext({
    window: { L: withLibrary ? L : undefined, location: { reload() { reloads += 1; } } }, L,
    document: { getElementById: id => elements[id], createElement: element },
    setTimeout() { return 1; }, clearTimeout() {}
  });
  vm.runInContext(read('worlds.js'), context);
  return { elements, map, tiles, overlay, getReloads: () => reloads };
}

const { elements, map, tiles, overlay } = setup();
assert.equal(map.layers.size, 1);
assert(map.layers.has(tiles));
assert.equal(elements['world-toggle'].disabled, false);
assert.deepEqual(Array.from(overlay.markers, marker => marker.label.textContent), [
  '君士坦丁堡', '吐谷浑', '羊关', '河西走廊', '河套', '大散关', '兰州',
  '长安', '华州 · 桶关', '同州', '陕州', '虢州'
]);
assert.equal(overlay.markers[2].label.attributes['aria-label'], '上海海事法院：羊关');
const corridor = overlay.markers.find(marker => marker.label.textContent === '河西走廊');
assert.equal(corridor.type, 'line');
assert(corridor.coordinates.length > 2);
for (const point of corridor.coordinates) {
  assert(map.bounds.some(bound => bound[0] === point[0] && bound[1] === point[1]));
}
assert(map.bounds.every(point => point.length === 2 && point.every(Number.isFinite)));
// A user pans/zooms before changing worlds; neither operation may reset that view.
map.center = [31.24, 121.54];
map.zoom = 15;
for (let cycle = 0; cycle < 3; cycle++) {
  elements['world-toggle'].events.click();
  assert.equal(elements['world-name'].textContent, '李世界');
  assert.equal(elements['world-page'].dataset.world, 'li');
  assert(map.layers.has(tiles) && map.layers.has(overlay));
  elements['world-toggle'].events.click();
  assert.equal(elements['world-name'].textContent, '表世界');
  assert.equal(map.layers.size, 1);
}
assert.equal(map.fits, 1);
assert.equal(map.zoom, 15);
assert.deepEqual(map.center, [31.24, 121.54]);
tiles.events.loading();
tiles.events.tileerror();
tiles.events.load();
assert.equal(elements['map-retry'].hidden, false);
elements['map-retry'].events.click();
assert.equal(tiles.redraws, 1);
tiles.events.loading();
tiles.events.load();
assert.equal(elements['map-notice'].hidden, true);
const missing = setup(false);
assert.equal(missing.elements['world-toggle'].disabled, true);
assert.equal(missing.elements['map-retry'].hidden, false);
missing.elements['map-retry'].events.click();
assert.equal(missing.getReloads(), 1);
console.log('Map resources, labels, world toggling, view preservation, and loading recovery passed.');
