'use strict';

// WGS84 anchors and sources: docs/map-data.md.
const worldPlaces = [
  { surface: '御橋', li: '君士坦丁堡', lat: 31.1558316, lng: 121.5609656 },
  { surface: '洋涇', li: '吐谷渾', lat: 31.2435273, lng: 121.5468943 },
  { surface: '上海海事法院', li: '羊關', lat: 31.2253329, lng: 121.5450202 },
  {
    surface: '世紀大道', li: '河西走廊', direction: 'left',
    // Simplified road trace, from Lujiazui toward Century Park.
    path: [
      [31.2400436, 121.4963243], [31.2392209, 121.4990638],
      [31.2384004, 121.5011837], [31.2377876, 121.5028412],
      [31.2370192, 121.5052305], [31.2358961, 121.5089823],
      [31.2345645, 121.5129345], [31.2330942, 121.5172067],
      [31.2317877, 121.5208365], [31.2290609, 121.5256619],
      [31.2260030, 121.5309835], [31.2243184, 121.5339177],
      [31.2237935, 121.5346472], [31.2227048, 121.5366128],
      [31.2210993, 121.5394045], [31.2196348, 121.5417709]
    ]
  },
  { surface: '世博', li: '河套', lat: 31.187638, lng: 121.485121 },
  { surface: '紫荊廣場', li: '大散關', lat: 31.277065, lng: 121.51242, direction: 'right' },
  { surface: '白玉蘭廣場', li: '蘭州', lat: 31.2510637, lng: 121.4934615, direction: 'left' },
  { surface: '五角場', li: '長安', lat: 31.3016923, lng: 121.5112006, direction: 'right' },
  { surface: '復旦大學', li: '華州 · 桶關', lat: 31.2980617, lng: 121.4979245 },
  { surface: '同濟大學', li: '同州', lat: 31.2846675, lng: 121.4974304, direction: 'bottom' },
  { surface: '虹口足球場', li: '陝州', lat: 31.2733099, lng: 121.4763389, direction: 'left' },
  { surface: '大柏樹', li: '虢州', lat: 31.294994, lng: 121.4852358, direction: 'left' }
];
const worldTileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

function initWorldMap() {
  const page = document.getElementById('world-page');
  const toggle = document.getElementById('world-toggle');
  const heading = document.getElementById('world-name');
  const container = document.getElementById('shanghai-map');
  const notice = document.getElementById('map-notice');
  const status = document.getElementById('map-status');
  const retry = document.getElementById('map-retry');
  const showStatus = (message, canRetry = false) => {
    status.textContent = message;
    notice.hidden = !message;
    retry.hidden = !canRetry;
  };

  if (!window.L) {
    showStatus('地圖未能加載，請刷新重試。', true);
    retry.addEventListener('click', () => window.location.reload());
    return;
  }

  const map = L.map(container, { zoomControl: false, minZoom: 3, maxZoom: 19 });
  L.control.zoom({ position: 'topright', zoomInTitle: '放大', zoomOutTitle: '縮小' }).addTo(map);
  map.attributionControl.setPrefix(false);
  const baseMap = L.tileLayer(worldTileUrl, {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
  });
  let tileErrors = 0;
  let loadTimer;
  baseMap.on('loading', () => {
    tileErrors = 0;
    clearTimeout(loadTimer);
    loadTimer = setTimeout(() => showStatus('地圖加載較慢，請檢查網絡後重試。', true), 15000);
  });
  baseMap.on('tileerror', () => { tileErrors += 1; });
  baseMap.on('load', () => {
    clearTimeout(loadTimer);
    showStatus(tileErrors ? '部分地圖未能加載，請檢查網絡後重試。' : '', tileErrors > 0);
  });
  retry.addEventListener('click', () => {
    showStatus('地圖加載中…');
    baseMap.redraw();
  });
  baseMap.addTo(map);

  const liWorld = L.layerGroup(worldPlaces.map(place => {
    const direction = place.direction || 'top';
    const offset = { top: [0, -8], bottom: [0, 8], left: [-8, 0], right: [8, 0] }[direction];
    const label = document.createElement('span');
    label.textContent = place.li.replace(/ · /g, '·');
    label.setAttribute('aria-label', `${place.surface}：${place.li}`);
    const feature = place.path ? L.polyline(place.path, {
      color: '#bd9b5d', weight: 6, opacity: 0.7, lineCap: 'round', lineJoin: 'round', interactive: false
    }) : L.circleMarker([place.lat, place.lng], {
      radius: 4, color: '#cebb91', weight: 1.5, fillColor: '#994f3e', fillOpacity: 0.9, interactive: false
    });
    return feature.bindTooltip(label, { permanent: true, direction, offset, opacity: 1, className: 'li-place-label' });
  }));
  let isLiWorld = false;
  toggle.addEventListener('click', () => {
    isLiWorld = !isLiWorld;
    const name = isLiWorld ? '李世界' : '表世界';
    page.dataset.world = isLiWorld ? 'li' : 'surface';
    if (isLiWorld) liWorld.addTo(map);
    else map.removeLayer(liWorld);
    document.getElementById('map-theme').setAttribute('content', isLiWorld ? '#11110e' : '#f6f7f3');
    heading.textContent = name;
    toggle.textContent = isLiWorld ? '切換到表世界' : '切換到李世界';
    container.setAttribute('aria-label', `上海地圖 · ${name}`);
  });
  toggle.disabled = false;
  map.fitBounds(worldPlaces.flatMap(place => place.path || [[place.lat, place.lng]]), { padding: [64, 56], maxZoom: 12 });
  // Keep the current geographic center on rotation or mobile browser chrome changes.
  if (window.ResizeObserver) new ResizeObserver(() => map.invalidateSize({ pan: false })).observe(container);
}

initWorldMap();
