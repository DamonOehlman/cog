/* jshint node: true */
'use strict';

/**
  ### throttle(fn, delay)

  A cherry-pickable throttle function.  Used to throttle `fn` to ensure
  that it can be called at most once every `delay` milliseconds.  Will
  fire first event immediately, ensuring the next event fired will occur
  at least `delay` milliseconds after the first, and so on.

**/
module.exports = function(fn, delay) {
  var lastExec = 0;
  var timer;
  var queuedArgs;
  var queuedScope;
  
  function invokeDefered() {
    fn.apply(queuedScope, queuedArgs || []);
    lastExec = Date.now();
  }

  return function() {
    var tick = Date.now();
    var elapsed = tick - lastExec;

    // always clear the defered timer
    clearTimeout(timer);

    if (elapsed < delay) {
      queuedArgs = [].slice.call(arguments, 0);
      queuedScope = this;

      return timer = setTimeout(invokeDefered, delay - elapsed);
    }

    // call the function
    lastExec = tick;
    fn.apply(this, arguments);
  };
};