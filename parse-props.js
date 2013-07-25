/* jshint node: true */
'use strict';

var rePropValue = /^([a-z]+|[a-z\-]+(?=\:))([\d\%\.\-\!]+|\:[\"\'].*?[\"\']|\:[^\s]+)(\s|\,|$)/i;
var reQuotes = /(^[\"\']|[\"\']$)/g;
var reLeadingColon = /^\:/;
var reTrailingPerc = /\%$/;

/**
## parseProps(text)
**/
module.exports = function(text) {
  // first tokenize
  var match;
  var propValue;
  var props;

  // check for a property value
  match = rePropValue.exec(text);
  while (match) {
    // extract the property value
    propValue = match[2].replace(reLeadingColon, '').replace(reQuotes, '');

    // initialise the properties
    props = props || {};

    // define the property
    props[match[1]] = reTrailingPerc.test(propValue) ?
      propValue :
      parseFloat(propValue) || propValue;

    // remove the match
    text = text.slice(match[0].length);

    // find the next match
    match = rePropValue.exec(text);
  }

  return props;
};