'use strict';

// WGS84 anchors and sources: docs/map-data.md.
const worldPlaces = [
  { surface: '御桥', li: '君士坦丁堡', lat: 31.1558316, lng: 121.5609656 },
  { surface: '洋泾', li: '吐谷浑', lat: 31.2435273, lng: 121.5468943 },
  { surface: '上海海事法院', li: '羊关', lat: 31.2253329, lng: 121.5450202 },
  { surface: '世纪大道', li: '河西走廊', lat: 31.2308126, lng: 121.5229813, direction: 'left' },
  { surface: '世博', li: '河套', lat: 31.187638, lng: 121.485121 },
  { surface: '紫荆广场', li: '大散关', lat: 31.277065, lng: 121.51242, direction: 'right' },
  { surface: '白玉兰广场', li: '兰州', lat: 31.2510637, lng: 121.4934615, direction: 'left' },
  { surface: '五角场', li: '长安', lat: 31.3016923, lng: 121.5112006, direction: 'right' },
  { surface: '复旦大学', li: '华州 · 桶关', lat: 31.2980617, lng: 121.4979245 },
  { surface: '同济大学', li: '同州', lat: 31.2846675, lng: 121.4974304, direction: 'bottom' },
  { surface: '虹口足球场', li: '陕州', lat: 31.2733099, lng: 121.4763389, direction: 'left' },
  { surface: '大柏树', li: '虢州', lat: 31.294994, lng: 121.4852358, direction: 'left' }
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
    showStatus('地图未能加载，请刷新重试。', true);
    retry.addEventListener('click', () => window.location.reload());
    return;
  }

  const map = L.map(container, { zoomControl: false, minZoom: 3, maxZoom: 19 });
  L.control.zoom({ position: 'topright', zoomInTitle: '放大', zoomOutTitle: '缩小' }).addTo(map);
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
    loadTimer = setTimeout(() => showStatus('地图加载较慢，请检查网络后重试。', true), 15000);
  });
  baseMap.on('tileerror', () => { tileErrors += 1; });
  baseMap.on('load', () => {
    clearTimeout(loadTimer);
    showStatus(tileErrors ? '部分地图未能加载，请检查网络后重试。' : '', tileErrors > 0);
  });
  retry.addEventListener('click', () => {
    showStatus('地图加载中…');
    baseMap.redraw();
  });
  baseMap.addTo(map);

  const liWorld = L.layerGroup(worldPlaces.map(place => {
    const direction = place.direction || 'top';
    const offset = { top: [0, -8], bottom: [0, 8], left: [-8, 0], right: [8, 0] }[direction];
    const label = document.createElement('span');
    label.textContent = place.li;
    label.setAttribute('aria-label', `${place.surface}：${place.li}`);
    return L.circleMarker([place.lat, place.lng], {
      radius: 5, color: '#715397', weight: 2, fillColor: '#fff', fillOpacity: 1, interactive: false
    }).bindTooltip(label, { permanent: true, direction, offset, opacity: 1, className: 'li-place-label' });
  }));
  let isLiWorld = false;
  toggle.addEventListener('click', () => {
    isLiWorld = !isLiWorld;
    if (isLiWorld) liWorld.addTo(map);
    else map.removeLayer(liWorld);
    const name = isLiWorld ? '李世界' : '表世界';
    page.dataset.world = isLiWorld ? 'li' : 'surface';
    document.getElementById('map-theme').setAttribute('content', isLiWorld ? '#0c0a10' : '#f6f7f3');
    heading.textContent = name;
    toggle.textContent = isLiWorld ? '切换到表世界' : '切换到李世界';
    container.setAttribute('aria-label', `上海地图 · ${name}`);
  });
  toggle.disabled = false;
  map.fitBounds(worldPlaces.map(place => [place.lat, place.lng]), { padding: [64, 56], maxZoom: 12 });
  // Keep the current geographic center on rotation or mobile browser chrome changes.
  if (window.ResizeObserver) new ResizeObserver(() => map.invalidateSize({ pan: false })).observe(container);
}

initWorldMap();
