var test = require('tape');
var listen = require('../listen');
var EventEmitter = require('events').EventEmitter;
var emitter;
var el;

test('listen returns an eventemitter with a stop function', function(t) {
  t.plan(2);

  emitter = listen({});
  t.ok(emitter instanceof EventEmitter, 'valid EventEmitter');
  t.ok(typeof emitter.stop == 'function', 'has a stop function');
});

test('captures dom events', function(t) {
  if (typeof document == 'undefined') {
    return t.end('not in a browser environment');
  }

  t.plan(1);

  // create the test element
  el = createSampleElement();

  // listen to the emitter
  emitter = listen(el, ['click']).once('click', function(evt) {
    t.pass('received click event');
  });

  // generate the a click event
  generateClick(el);
});

test('can stop event capture', function(t) {
  if (typeof document == 'undefined') {
    return t.end();
  }

  t.plan(1);
  emitter.stop();
  emitter.once('click', function() {
    t.fail('captured event and should not have');
  });

  el.addEventListener('click', function() {
    t.pass('normal event capture worked as expected');
  });

  generateClick(el);
});


/* internal helpers */

function createSampleElement() {
  return document.createElement('div');
}

function generateClick(el) {
  var evt = document.createEvent('MouseEvents');

  evt.initMouseEvent('click', true, true, window,
    0, 0, 0, 0, 0, false, false, false, false, 0, null);

  return el.dispatchEvent(evt);
}
