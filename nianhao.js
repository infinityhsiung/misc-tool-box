'use strict';

// Consecutive slider positions cross directly from 1 BCE to 1 CE.
const yearPosition = year => year < 0 ? year + 1 : year;
const civilYear = position => position <= 0 ? position - 1 : position;
const eraNumberFor = (item, year) => yearPosition(year) - yearPosition(item.eraStart) + 1;
const yearForEraNumber = (item, number) => civilYear(yearPosition(item.eraStart) + number - 1);
const recordsForYear = year => eraData.filter(item => item.start <= year && year <= item.end);
const searchRecords = query => {
  const text = normalize(query);
  return eraData.filter(item => [item.noEra ? '無年號' : item.era, item.dynasty, item.ruler]
    .some(value => normalize(value).includes(text)));
};
const integerInRange = (raw, min, max) => /^\d+$/.test(raw.trim()) && Number(raw) >= min && Number(raw) <= max;
const dynastyTones = Object.fromEntries([
  ['green', ['西漢', '東漢', '唐', '後周']],
  ['orange', ['新', '南梁', '北周', '後梁', '後晉', '元', '北元']],
  ['pink', ['更始', '劉宋', '南陳', '武周', '後漢', '遼', '明', '南明']],
  ['purple', ['曹魏', '南齊', '北齊', '西遼', '金']],
  ['blue', ['蜀漢', '西晉', '東晉', '北魏', '後唐', '北宋', '南宋']],
  ['teal', ['東吳', '東魏', '西魏', '隋', '西夏', '後金 / 清', '清']]
].flatMap(([tone, dynasties]) => dynasties.map(dynasty => [dynasty, tone])));
const dynastyTone = item => `tone-${dynastyTones[item.dynasty] || 'blue'}`;
const $ = id => document.getElementById(id);
let selectedYear = 1453;
let beforeCE = false;
let selectedEra = null;

function eraCaption(item, year) {
  if (item.noEra) return '無年號';
  const number = eraNumberFor(item, year);
  return `${item.era}${eraYearName(number)}${eraYearSuffix(item, number)}`;
}

function resultButton(item, caption) {
  const index = eraData.indexOf(item);
  const meta = `${item.dynasty} · ${item.ruler} · ${formatRange(item)}${item.source ? ' · ' + item.source : ''}`;
  return `<button type="button" class="result-row ${dynastyTone(item)}" data-era="${index}" aria-pressed="${item === selectedEra}"><strong>${escapeHtml(caption)}</strong><small>${escapeHtml(meta)}</small></button>`;
}

function markSelectedEra() {
  document.querySelectorAll('[data-era]').forEach(button => {
    button.setAttribute('aria-pressed', String(eraData[Number(button.dataset.era)] === selectedEra));
  });
}

function renderYearResults() {
  const matches = recordsForYear(selectedYear);
  $('year-count').textContent = `${matches.length} 筆`;
  $('year-results').innerHTML = matches.length
    ? matches.map(item => resultButton(item, eraCaption(item, selectedYear))).join('')
    : '<p class="empty">此年份沒有對應記錄。</p>';
}

function setYear(year, syncDetail = true, preserveInput = false) {
  selectedYear = year;
  beforeCE = year < 0;
  if (!preserveInput) $('year-input').value = String(Math.abs(year));
  $('period').textContent = beforeCE ? '公元前' : '公元';
  $('year-input').setAttribute('aria-invalid', 'false');
  $('year-status').textContent = '';
  $('year-slider').value = String(yearPosition(year));
  $('year-slider').setAttribute('aria-valuetext', formatYear(year));
  $('previous-year').disabled = year === -140;
  $('next-year').disabled = year === 1911;
  if (syncDetail) {
    const matches = recordsForYear(year);
    const item = matches.includes(selectedEra) ? selectedEra : matches[0];
    if (item) selectEra(item, year);
    else {
      selectedEra = null;
      $('era-detail').hidden = true;
    }
  }
  renderYearResults();
  markSelectedEra();
}

function readYearInput() {
  const raw = $('year-input').value;
  const max = beforeCE ? 140 : 1911;
  if (!integerInRange(raw, 1, max)) {
    const empty = raw.trim() === '';
    $('year-input').setAttribute('aria-invalid', String(!empty));
    $('year-status').textContent = empty ? '' : `請輸入 1–${max} 的整數年份。`;
    $('year-count').textContent = '';
    $('year-results').innerHTML = '';
    $('previous-year').disabled = true;
    $('next-year').disabled = true;
    return;
  }
  setYear(Number(raw) * (beforeCE ? -1 : 1), true, true);
}

function selectEra(item, focusYear = item.start) {
  selectedEra = item;
  const first = eraNumberFor(item, item.start);
  const last = eraNumberFor(item, item.end);
  const number = Math.max(first, Math.min(last, eraNumberFor(item, focusYear)));
  $('era-detail').hidden = false;
  $('era-detail').setAttribute('class', `panel ${dynastyTone(item)}`);
  $('detail-name').textContent = item.noEra ? '無年號' : item.era;
  $('detail-range').textContent = formatRange(item);
  $('detail-meta').textContent = `${item.dynasty} · ${item.ruler}${item.source ? ' · ' + item.source : ''}`;
  $('detail-conversion').hidden = Boolean(item.noEra);
  $('no-era-note').hidden = !item.noEra;
  $('no-era-note').textContent = item.noEra ? `${formatYear(item.start)}${item.end === item.start ? '' : '—' + formatYear(item.end)}` : '';
  if (!item.noEra) {
    $('era-slider').min = String(first);
    $('era-slider').max = String(last);
    $('era-slider').disabled = first === last;
    $('era-min').textContent = first === 1 ? '元年' : `${first}年`;
    $('era-max').textContent = `${last}年`;
    $('era-number-label').textContent = `${item.era}年次`;
    setEraNumber(number);
  }
  markSelectedEra();
}

function setEraNumber(number, preserveInput = false) {
  if (!preserveInput) $('era-number').value = String(number);
  $('era-number').setAttribute('aria-invalid', 'false');
  $('era-status').textContent = '';
  $('era-slider').value = String(number);
  const year = yearForEraNumber(selectedEra, number);
  $('era-slider').setAttribute('aria-valuetext', eraCaption(selectedEra, year));
  $('era-output').textContent = shortYear(year);
}

function readEraInput() {
  if (!selectedEra || selectedEra.noEra) return;
  const raw = $('era-number').value;
  const first = eraNumberFor(selectedEra, selectedEra.start);
  const last = eraNumberFor(selectedEra, selectedEra.end);
  if (!integerInRange(raw, first, last)) {
    const empty = raw.trim() === '';
    $('era-number').setAttribute('aria-invalid', String(!empty));
    $('era-status').textContent = empty ? '' : `請輸入 ${first}–${last} 的整數年次。`;
    $('era-output').textContent = '';
    return;
  }
  setEraNumber(Number(raw), true);
  setYear(yearForEraNumber(selectedEra, Number(raw)), false);
}

function renderSearch() {
  const query = $('era-search').value;
  const hasQuery = normalize(query).length > 0;
  $('search-clear').hidden = !query;
  $('search-results').hidden = !hasQuery;
  if (!hasQuery) {
    $('search-summary').textContent = '';
    $('search-results').innerHTML = '';
    return;
  }
  const matches = searchRecords(query);
  $('search-summary').textContent = matches.length ? `${matches.length} 筆記錄` : '找不到對應記錄。';
  $('search-results').innerHTML = matches.map(item => resultButton(item, item.noEra ? '無年號' : item.era)).join('');
  $('search-results').scrollTop = 0;
}

$('year-input').addEventListener('input', readYearInput);
$('period').addEventListener('click', () => {
  beforeCE = !beforeCE;
  $('period').textContent = beforeCE ? '公元前' : '公元';
  readYearInput();
});
$('year-slider').addEventListener('input', () => setYear(civilYear(Number($('year-slider').value))));
for (const [id, step] of [['previous-year', -1], ['next-year', 1]]) {
  $(id).addEventListener('click', () => setYear(civilYear(Math.max(-139, Math.min(1911, yearPosition(selectedYear) + step)))));
}
$('era-number').addEventListener('input', readEraInput);
$('era-slider').addEventListener('input', () => {
  if (!selectedEra || selectedEra.noEra) return;
  const number = Number($('era-slider').value);
  setEraNumber(number);
  setYear(yearForEraNumber(selectedEra, number), false);
});
$('era-search').addEventListener('input', renderSearch);
$('search-clear').addEventListener('click', () => {
  $('era-search').value = '';
  renderSearch();
  $('era-search').focus();
});
for (const id of ['year-results', 'search-results']) {
  $(id).addEventListener('click', event => {
    const button = event.target.closest('[data-era]');
    if (!button) return;
    const item = eraData[Number(button.dataset.era)];
    const year = id === 'year-results' ? selectedYear : item.start;
    selectEra(item, year);
    setYear(year, false);
  });
}
for (const id of ['year-input', 'era-number']) {
  $(id).addEventListener('focus', () => $(id).select());
}
$('reset').addEventListener('click', () => {
  selectedEra = null;
  $('era-search').value = '';
  renderSearch();
  setYear(1453);
});
setYear(1453);
renderSearch();
