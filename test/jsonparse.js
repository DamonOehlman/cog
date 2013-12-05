var test = require('tape');
var parse = require('../jsonparse');

test('an integer is unaltered', function(t) {
  t.plan(1);
  t.equal(parse(1), 1, 'integer preserved');
});

test('a simple object is unaltered', function(t) {
  t.plan(1);
  t.deepEqual(parse({ a: 1 }), { a: 1 }, 'object preserved');
});

test('boolean true is unaltered', function(t) {
  t.plan(1);
  t.equal(parse(true), true, 'boolean true preserved');
});

test('boolean false is unaltered', function(t) {
  t.plan(1);
  t.equal(parse(false), false, 'boolean false preserved');
});

test('null is unaltered', function(t) {
  t.plan(1);
  t.equal(parse(null), null, 'null preserved');
});

test('undefined is unaltered', function(t) {
  t.plan(1);
  t.equal(parse(undefined), undefined, 'undefined preserved');
});

test('an array is unaltered', function(t) {
  t.plan(1);
  t.deepEqual(parse([1, 2, 3]), [1, 2, 3], 'array preserved');
});

test('correctly parse JSONified integer', function(t) {
  t.plan(1);
  t.equal(parse(JSON.stringify(5)), 5, 'correctly parsed 5');
});

test('correctly parse JSONified float', function(t) {
  t.plan(1);
  t.equal(parse(JSON.stringify(2.3)), 2.3, 'correctly parsed 2.3');
});

test('correctly parse JSONified false', function(t) {
  t.plan(1);
  t.equal(parse(JSON.stringify(false)), false, 'correctly parsed false');
});

test('correctly parse JSONified true', function(t) {
  t.plan(1);
  t.equal(parse(JSON.stringify(true)), true, 'correctly parse true');
});

test('correctly parse JSONified null', function(t) {
  t.plan(1);
  t.equal(parse(JSON.stringify(null)), null, 'correctly parse null');
});

test('correctly parse JSONified undefined', function(t) {
  t.plan(1);
  t.equal(parse(JSON.stringify(undefined)), undefined, 'correctly parse undefined');
});

test('correctly parse JSONified object', function(t) {
  t.plan(1);
  t.deepEqual(
    parse(JSON.stringify({ a: 1 })),
    { a: 1 },
    'correctly parse simple object'
  );
});

test('correctly parse JSONified array', function(t) {
  t.plan(1);
  t.deepEqual(
    parse(JSON.stringify([1, 2, 3])),
    [1, 2, 3],
    'correctly parse simple array'
  );
});