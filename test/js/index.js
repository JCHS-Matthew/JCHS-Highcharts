QUnit.config.autostart = false;

var param1 = '1-2qNM31nv35RaGligm1c9RG2TN94NIYJ3fMDBUt8Sso',
  param2 = 'Sheet2!A:X',
  ref_data = []

$.get(JCHS.requestURL(param1, param2), function (return_object) {
  ref_data = return_object.values
  QUnit.start()
})

QUnit.test("get request results test (Google Sheets API)", function (assert) {
  //assert.ok(typeof return_object == "object", "get request returned an object")
  assert.ok(Array.isArray(ref_data) === true, "request_object.values is an array")
})

QUnit.test('numFormat() test', function (assert) {
  assert.equal(JCHS.numFormat(1234.5678, 2), '1,234.57')
  assert.equal(JCHS.numFormat(1234.321, 2), '1,234.32')
  assert.equal(JCHS.numFormat(1234.5678, 0), '1,235')
  assert.equal(JCHS.numFormat(1234.5), '1,234.5')
  assert.equal(JCHS.numFormat(1234567, 0), '1,234,567')
  assert.equal(JCHS.numFormat(1234567), '1,234,567')
  assert.equal(JCHS.numFormat(7654.321), '7,654.32')
})

QUnit.test("requestURL() test", function (assert) {
  var param1 = '1-2qNM31nv35RaGligm1c9RG2TN94NIYJ3fMDBUt8Sso',
    param2 = 'Sheet2!A:X'
  assert.equal(JCHS.requestURL(param1, param2), "https://sheets.googleapis.com/v4/spreadsheets/1-2qNM31nv35RaGligm1c9RG2TN94NIYJ3fMDBUt8Sso/values/Sheet2!A:X?key=AIzaSyDY_gHLV0A7liVYq64RxH7f7IYUKF15sOQ&valueRenderOption=UNFORMATTED_VALUE")
})
