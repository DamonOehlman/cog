var test = require('tape'),
    classtweak = require('../../classtweak'),
    ids = ['test', 'test2', 'test3'],
    elements = [], ii;

function resetElements() {
    for (ii = 0; ii < elements.length; ii++) {
        elements[ii].className = '';
    } // for
}

// initialise the elements
for (ii = 0; ii < ids.length; ii++) {
    elements[ii] = document.getElementById(ids[ii]);
} // for

test('can add a class to multiple elements', function(t) {

    resetElements();
    classtweak(elements, '+bounce');

    t.plan(3);
    t.equal(elements[0].className, 'bounce');
    t.equal(elements[1].className, 'bounce');
    t.equal(elements[2].className, 'bounce');
});

test('can remove a class to multiple elements', function(t) {
    resetElements();
    classtweak(elements, '+bounce');
    classtweak(elements, '-bounce');

    t.plan(3);
    t.equal(elements[0].className, '');
    t.equal(elements[1].className, '');
    t.equal(elements[2].className, '');
});