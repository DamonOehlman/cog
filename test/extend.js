var test = require('tape'),
    extend = require('../extend');

test('simple extends', function(t) {
    t.plan(1);
    t.equal(extend({}, { a: true }).a, true, 'Property a copied across');
});