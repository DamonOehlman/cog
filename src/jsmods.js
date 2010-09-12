/* initialise javascript extensions */

// include the secant method for Number
// code from the excellent number extensions library:
// http://safalra.com/web-design/javascript/number-object-extensions/
Number.prototype.sec = function() {
  return 1 / Math.cos(this);
};

