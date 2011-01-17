//= require "core"

(function() {
    // initialise constants
    var REGEX_TEMPLATE_VAR = /\$\{(.*?)\}/ig;
    
    // initialise variables
    var hasOwn = Object.prototype.hasOwnProperty,
        objectCounter = 0,
        extend = COG.extend;

    /* exports */
    
    var exports = {},
    
        toID = exports.toID = function(text) {
            return text.replace(/\s/g, "-");
        },
        
        objId = exports.objId = function(prefix) {
            return (prefix ? prefix : "obj") + objectCounter++;
        };
    
    //= require "helpers/types"
    //= require "helpers/object"
    //= require "helpers/string"
    
    COG.extend(COG, exports);
})();

//= require "log"
//= require "loopage"
//= require "observable"
//= require "configurable"
//= require "jsonp"
//= require "tween"