/**
# COG

## Module Functions
*/
COG = (function() {
    // initialise constants
    var REGEX_TEMPLATE_VAR = /\$\{(.*?)\}/ig;
    
    // initialise variables
    var hasOwn = Object.prototype.hasOwnProperty,
        objectCounter = 0;

    /* exports */
    
    var exports = {},
    
        toID = exports.toID = function(text) {
            return text.replace(/\s/g, "-");
        },
        
        objId = exports.objId = function(prefix) {
            return (prefix ? prefix : "obj") + objectCounter++;
        };
    
    //= require "log"
    
    //= require "helpers/object"
    //= require "helpers/string"
    //= require "helpers/types"
    
    //= require "loopage"
    //= require "observable"
    //= require "configurable"
    
    //= require "xhr/jsonp"
    
    return exports;
})();

