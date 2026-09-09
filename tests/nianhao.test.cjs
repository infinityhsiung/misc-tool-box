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
  assert.equal(searchRecords('無年號').length, 2);
  assert.equal(searchRecords('无年号').length, 2);
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
