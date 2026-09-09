const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const context = vm.createContext({ assert });
const calculations = read('nianhao.js').split('const $ =')[0];
vm.runInContext(read('nianhao-data.js') + '\n' + calculations, context);
vm.runInContext(`
  assert.equal(civilYear(yearPosition(-1) + 1), 1);
  assert.equal(civilYear(yearPosition(1) - 1), -1);
  for (let position = -139; position <= 1911; position++) {
    assert.notEqual(civilYear(position), 0);
    assert.equal(yearPosition(civilYear(position)), position);
  }
  assert.equal(searchRecords('無年號').length, 5);
  assert.equal(searchRecords('无年号').length, 5);
  const suzongNoEra = searchRecords('唐肃宗').find(item => item.noEra);
  assert(suzongNoEra);
  assert.equal(canConvertEra(suzongNoEra), false);
  assert(recordsForYear(761).includes(suzongNoEra));
  assert(recordsForYear(762).includes(suzongNoEra));
  assert(!recordsForYear(760).includes(suzongNoEra));
  assert(!recordsForYear(763).includes(suzongNoEra));
  assert(recordsForYear(761).some(item => item.ruler === '肅宗 李亨' && item.era === '上元'));
  assert(!recordsForYear(762).some(item => item.ruler === '肅宗 李亨' && item.era === '上元'));
  assert(recordsForYear(762).some(item => item.ruler === '肅宗 李亨' && item.era === '寶應'));
  assert.equal(searchRecords('宋度宗')[0].era, '咸淳');
  assert.equal(searchRecords('宋度宗')[0].ruler, '度宗 趙禥');
  assert.equal(searchRecords('赵禥')[0].era, '咸淳');
  assert(!searchRecords('宋理宗').some(item => item.era === '咸淳'));
  assert.equal(searchRecords('景云')[0].era, '景雲');
  const fixtures = [
    ['南宋', '咸淳', '度宗 趙禥', 1265, 1274, 1265],
    ['東漢', '元興', '和帝 劉肇', 105, 105, 105],
    ['東漢', '延平', '殤帝 劉隆', 106, 106, 106],
    ['東吳', '太元', '大帝 孫權', 251, 252, 251],
    ['東吳', '神鳳', '大帝 孫權', 252, 252, 252],
    ['東吳', '五鳳', '會稽王 孫亮', 254, 256, 254],
    ['東吳', '太平', '會稽王 孫亮', 256, 258, 256],
    ['南梁', '天正', '豫章王 蕭棟', 551, 551, 551],
    ['南梁', '天成', '閔帝 蕭淵明', 555, 555, 555],
    ['北魏', '承平', '南安王 拓跋余', 452, 452, 452],
    ['北魏', '和平', '文成帝 拓跋濬', 460, 465, 460],
    ['北魏', '天安', '獻文帝 拓跋弘', 466, 467, 466],
    ['北魏', '皇興', '獻文帝 拓跋弘', 467, 471, 467],
    ['北魏', '建明', '長廣王 元曄', 530, 531, 530],
    ['北魏', '普泰', '節閔帝 元恭', 531, 532, 531],
    ['北魏', '中興', '安定王 元朗', 531, 532, 531],
    ['北齊', '承光', '幼主 高恆', 577, 577, 577],
    ['唐', '嗣聖', '中宗 李顯', 684, 684, 684],
    ['唐', '唐隆', '殤帝 李重茂', 710, 710, 710],
    ['唐', '天祐', '哀帝 李柷', 904, 907, 904],
    ['後梁', '乾化', '末帝 朱友貞', 913, 915, 911],
    ['後梁', '貞明', '末帝 朱友貞', 915, 921, 915],
    ['後梁', '龍德', '末帝 朱友貞', 921, 923, 921],
    ['後周', '顯德', '恭帝 柴宗訓', 959, 960, 954],
    ['元', '天曆', '明宗 和世㻋', 1329, 1329, 1328],
    ['元', '至順', '寧宗 懿璘質班', 1332, 1332, 1330],
    ['元', '至順', '惠宗 妥懽帖睦爾', 1333, 1333, 1330],
    ['元', '元統', '惠宗 妥懽帖睦爾', 1333, 1335, 1333],
    ['元', '至元', '惠宗 妥懽帖睦爾', 1335, 1340, 1335],
    ['北元', '至正', '惠宗 妥懽帖睦爾', 1368, 1370, 1341],
    ['南詔', '贊普鍾', '閣羅鳳', 752, 768, 752],
    ['南詔', '應道', '尋閣勸', 809, 810, 809],
    ['南詔', '龍興', '勸龍晟', 811, 816, 811],
    ['南詔', '全義', '勸利晟', 816, 819, 816],
    ['南詔', '大豐', '勸利晟', 820, 823, 820],
    ['南詔', '保和', '勸豐祐', 824, 839, 824],
    ['南詔', '中興', '舜化貞', 897, 902, 897],
    ['明', '景泰', '代宗 朱祁鈺', 1450, 1457, 1450]
  ];
  for (const [dynasty, era, ruler, start, end, eraStart] of fixtures) {
    const item = eraData.find(item => item.dynasty === dynasty && item.era === era && item.ruler === ruler);
    assert(item, dynasty + era + ruler);
    assert.deepEqual([item.start, item.end, item.eraStart], [start, end, eraStart]);
    assert(recordsForYear(start).includes(item));
    assert(recordsForYear(end).includes(item));
    assert.equal(eraNumberFor(item, start), start - eraStart + 1);
  }
  assert.equal(searchRecords('南诏').length, 14);
  assert.equal(searchRecords('阁罗凤').length, 2);
  assert.equal(searchRecords('寻阁劝')[0].era, '應道');
  assert.equal(searchRecords('赞普钟')[0].dynasty, '南詔');
  for (let year = 752; year <= 902; year++) {
    assert(recordsForYear(year).some(item => item.dynasty === '南詔'), 'Missing Nanzhao year: ' + year);
  }
  const uncertain = searchRecords('南詔').find(item => item.uncertainEra);
  assert.equal(uncertain.era, '貞明 / 承智 / 大同');
  assert.equal(uncertain.eraStart, null);
  assert.equal(canConvertEra(uncertain), false);
  assert(recordsForYear(888).includes(uncertain));
  assert(!recordsForYear(889).includes(uncertain));
  const hui = searchRecords('元惠宗');
  assert.equal(hui.length, 5);
  assert.deepEqual(searchRecords('元顺帝'), hui);
  assert(hui.every(item => item.ruler === '惠宗 妥懽帖睦爾'));
  assert.equal(eraNumberFor(hui.find(item => item.era === '至順'), 1333), 4);
  assert.equal(eraNumberFor(hui.find(item => item.dynasty === '北元'), 1370), 30);
  assert.equal(eraData.filter(item => item.dynasty === '元' && item.era === '至元').length, 2);
  for (const item of eraData) {
    assert(Number.isInteger(item.start) && Number.isInteger(item.end) && item.start <= item.end);
    if (!canConvertEra(item)) continue;
    assert(item.eraStart <= item.start && item.eraEnd >= item.end);
    for (let p = yearPosition(item.start); p <= yearPosition(item.end); p++) {
      const year = civilYear(p);
      assert.equal(yearForEraNumber(item, eraNumberFor(item, year)), year);
    }
  }
  assert.equal(integerInRange('0', 1, 1911), false);
  assert.equal(integerInRange('1.5', 1, 1911), false);
  assert.equal(integerInRange('', 1, 1911), false);
  assert.equal(integerInRange('1911', 1, 1911), true);
`, context);
console.log('Year boundaries, era roundtrips, search, and input validation passed.');

// Exercise selection changes without a browser, including unavailable era counts.
const elements = Object.fromEntries([...read('nianhao.html').matchAll(/id="([^"]+)"/g)].map(([, id]) => [id, {
  value: '', hidden: false, textContent: '', innerHTML: '',
  setAttribute(name, value) { this[name] = value; },
  addEventListener() {}
}]));
const uiContext = vm.createContext({ assert, elements, document: {
  getElementById(id) { assert(elements[id], 'Missing element: ' + id); return elements[id]; },
  querySelectorAll() { return []; }
} });
vm.runInContext(read('nianhao-data.js') + '\n' + read('nianhao.js'), uiContext);
vm.runInContext(`
  assert.equal(elements['era-output'].textContent, '1453');
  setYear(761);
  const suzongNoEra = recordsForYear(761).find(item => item.noEra);
  selectEra(suzongNoEra, 761);
  assert.equal(elements['detail-name'].textContent, '無年號');
  assert.equal(elements['detail-conversion'].hidden, true);
  assert.equal(elements['no-era-note'].hidden, false);
  assert.equal(eraCaption(suzongNoEra, 762), '無年號');
  assert(elements['detail-meta'].textContent.includes('只稱元年'));
  setYear(880);
  const disputed = recordsForYear(880).find(item => item.uncertainEra);
  selectEra(disputed, 880);
  assert.equal(elements['detail-conversion'].hidden, true);
  assert.equal(elements['no-era-note'].hidden, false);
  assert.equal(eraCaption(disputed, 880), '貞明 / 承智 / 大同');
  setYear(1333);
  const inherited = recordsForYear(1333).find(item => item.ruler.startsWith('惠宗') && item.era === '至順');
  selectEra(inherited, 1333);
  assert.equal(elements['detail-conversion'].hidden, false);
  assert.equal(elements['no-era-note'].hidden, true);
  assert.equal(elements['era-number'].value, '4');
  assert.equal(elements['era-output'].textContent, '1333');
  elements['era-search'].value = '南诏';
  renderSearch();
  assert.equal(elements['search-summary'].textContent, '14 筆記錄');
  assert(elements['search-results'].innerHTML.includes('閣羅鳳'));
`, uiContext);
console.log('Era selection, disputed chronology, and search rendering passed.');
