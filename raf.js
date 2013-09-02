/* jshint node: true */
/* global window: false */
'use strict';

var TEST_PROPS = ['r', 'webkitR', 'mozR', 'oR', 'msR'];

/**
  ## cog/raf

  Request animation frame helper:

  ```js
  var raf = require('cog/raf');

  function animate() {
    console.log('animating');
    raf(animate); // go again
  }

  raf(animate);
  ```
**/

module.exports = typeof window != 'undefined' && (function() {
  for (var ii = 0; ii < TEST_PROPS.length; ii++) {
    window.animFrame = window.animFrame ||
      window[TEST_PROPS[ii] + 'equestAnimationFrame'];
  } // for
  
  return animFrame;
})();