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
  assert.equal(searchRecords('無年號').length, 4);
  assert.equal(searchRecords('无年号').length, 4);
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
    ['元', '元統', '順帝 妥懽帖睦爾', 1333, 1335, 1333],
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
  for (const item of eraData) {
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
